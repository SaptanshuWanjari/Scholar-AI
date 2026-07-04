"""Usage tracking and budget endpoints."""

from __future__ import annotations

from datetime import datetime

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import extract, func

from scholarai.storage import get_session
from scholarai.storage.models import PluginState, UsageRecord
from scholarai.llm.routing import update_routing_config, get_routing_config

router = APIRouter(prefix="/api/usage", tags=["usage"])


def _require_plugin() -> None:
    db = get_session()
    try:
        row = db.get(PluginState, "cloud-model-providers")
        if not (row and row.installed and row.enabled):
            raise HTTPException(status_code=403, detail="cloud-model-providers plugin is not enabled")
    finally:
        db.close()


# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------

class UsageSummary(BaseModel):
    today_usd: float
    week_usd: float
    month_usd: float
    total_requests: int
    total_tokens: int


class UsageRecordOut(BaseModel):
    id: int
    provider_id: str
    task: str
    model: str
    input_tokens: int
    output_tokens: int
    cost_usd: float
    created_at: str


class UsageRecordsPage(BaseModel):
    records: list[UsageRecordOut]
    total: int
    page: int
    limit: int


class BudgetConfig(BaseModel):
    monthly_usd: float
    warn_at_pct: int
    current_month_usd: float


class BudgetUpdate(BaseModel):
    monthly_usd: float
    warn_at_pct: int


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.get("/summary", response_model=UsageSummary)
def usage_summary() -> UsageSummary:
    """Return aggregated cost/token summary across time windows."""
    _require_plugin()
    db = get_session()
    try:
        now = datetime.utcnow()

        def _sum_cost(filter_expr) -> float:
            return float(db.query(func.sum(UsageRecord.cost_usd)).filter(filter_expr).scalar() or 0.0)

        def _sum_tokens(filter_expr) -> int:
            input_t = db.query(func.sum(UsageRecord.input_tokens)).filter(filter_expr).scalar() or 0
            output_t = db.query(func.sum(UsageRecord.output_tokens)).filter(filter_expr).scalar() or 0
            return int(input_t) + int(output_t)

        today_filter = (
            extract("year", UsageRecord.created_at) == now.year,
            extract("month", UsageRecord.created_at) == now.month,
            extract("day", UsageRecord.created_at) == now.day,
        )
        week_filter = (
            extract("year", UsageRecord.created_at) == now.year,
            UsageRecord.created_at >= now.replace(hour=0, minute=0, second=0).replace(
                day=now.day - now.weekday()
            ),
        )
        month_filter = (
            extract("year", UsageRecord.created_at) == now.year,
            extract("month", UsageRecord.created_at) == now.month,
        )

        total_requests = int(db.query(func.count(UsageRecord.id)).scalar() or 0)
        total_tokens = int(
            (db.query(func.sum(UsageRecord.input_tokens)).scalar() or 0)
            + (db.query(func.sum(UsageRecord.output_tokens)).scalar() or 0)
        )

        return UsageSummary(
            today_usd=_sum_cost(today_filter[0] and today_filter[1] and today_filter[2]),
            week_usd=_sum_cost(week_filter[0]),
            month_usd=_sum_cost(month_filter[0]),
            total_requests=total_requests,
            total_tokens=total_tokens,
        )
    finally:
        db.close()


@router.get("/records", response_model=UsageRecordsPage)
def list_usage_records(page: int = 1, limit: int = 50, provider: str | None = None) -> UsageRecordsPage:
    """Return paginated usage records."""
    _require_plugin()
    db = get_session()
    try:
        q = db.query(UsageRecord)
        if provider:
            q = q.filter(UsageRecord.provider_id == provider)
        total = q.count()
        records = q.order_by(UsageRecord.created_at.desc()).offset((page - 1) * limit).limit(limit).all()
        return UsageRecordsPage(
            records=[
                UsageRecordOut(
                    id=r.id,
                    provider_id=r.provider_id,
                    task=r.task,
                    model=r.model,
                    input_tokens=r.input_tokens,
                    output_tokens=r.output_tokens,
                    cost_usd=r.cost_usd,
                    created_at=r.created_at.isoformat(),
                )
                for r in records
            ],
            total=total,
            page=page,
            limit=limit,
        )
    finally:
        db.close()


@router.get("/budget", response_model=BudgetConfig)
def get_budget() -> BudgetConfig:
    """Return budget config + current month spend."""
    _require_plugin()
    config = get_routing_config()
    budget = config.get("budget", {"monthly_usd": 0.0, "warn_at_pct": 80})

    db = get_session()
    try:
        now = datetime.utcnow()
        current_month_usd = float(
            db.query(func.sum(UsageRecord.cost_usd)).filter(
                extract("year", UsageRecord.created_at) == now.year,
                extract("month", UsageRecord.created_at) == now.month,
            ).scalar() or 0.0
        )
    finally:
        db.close()

    return BudgetConfig(
        monthly_usd=float(budget.get("monthly_usd", 0.0)),
        warn_at_pct=int(budget.get("warn_at_pct", 80)),
        current_month_usd=current_month_usd,
    )


@router.put("/budget", response_model=BudgetConfig)
def update_budget(payload: BudgetUpdate) -> BudgetConfig:
    """Update monthly budget limit."""
    _require_plugin()
    config = get_routing_config()
    config["budget"] = {"monthly_usd": payload.monthly_usd, "warn_at_pct": payload.warn_at_pct}
    update_routing_config(config)

    return BudgetConfig(
        monthly_usd=payload.monthly_usd,
        warn_at_pct=payload.warn_at_pct,
        current_month_usd=0.0,  # Will be accurate on next GET
    )

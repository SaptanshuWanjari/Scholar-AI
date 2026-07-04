param()
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Write-Host "Starting ScholarAI at http://localhost:8000"
uvicorn scholarcli.api.app:app --host 0.0.0.0 --port 8000

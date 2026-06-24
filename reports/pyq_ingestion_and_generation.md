# PYQ Ingestion and Generation

## What's Done
- **Dedicated Extractor**: Previous Year Questions (PYQs) are ingested separately from RAG documents (`scholarcli/api/pyq.py` and `pyq_service.py`) to prevent exam papers from polluting the knowledge base. The entire paper text is parsed by an LLM prompt (`_EXTRACT_SYSTEM`) to extract structured questions.
- **Rich Analytics**: The backend deterministically aggregates frequency, difficulty, trends, and question patterns based on the extracted questions and user attempt history (`TopicStat`).
- **Generation Grounding**: The exam generator (`exam.py`) leverages the PYQ analysis to ground generated exams in real question styles and topic distributions.

## What's Partial
- **Comparison Mining**: There is a regex-based `difference_suggestions` extractor that mines for "X vs Y" questions. It works for simple patterns but might miss complexly phrased comparison questions.
- **Text Extraction Robustness**: The `_read_text` logic relies on basic PDF/MD parsing and truncates at `_MAX_CHARS` to fit context windows. Very long or complex graphical PDFs might lose data.

## What's Missing
- **OCR Integration**: If a user uploads a scanned PYQ (images), the current text loader may fail to extract text accurately. Integration with the multimodal vision loader (`vision.py`) specifically for PYQs is missing.
- **Manual Edit UI**: There is no API or UI explicitly designed to let a user manually edit a badly parsed PYQ question after ingestion.

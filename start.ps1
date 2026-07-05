param()
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir
.\.venv\Scripts\Activate.ps1
uvicorn scholarai.api.app:app --host 0.0.0.0 --port 8000

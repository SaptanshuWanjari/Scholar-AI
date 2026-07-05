param()
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

$api = Invoke-RestMethod -Uri "https://api.github.com/repos/SaptanshuWanjari/Scholar-AI/releases/latest"
$asset = $api.assets | Where-Object { $_.name -like "*windows*" } | Select-Object -First 1
$url = $asset.browser_download_url

Write-Host "Downloading latest release..."
$zip = "$env:TEMP\scholar-update.zip"
Invoke-WebRequest -Uri $url -OutFile $zip
Expand-Archive -Path $zip -DestinationPath "$env:TEMP\scholar-extracted" -Force
Copy-Item -Path "$env:TEMP\scholar-extracted\*\*" -Destination $ScriptDir -Recurse -Force
Remove-Item -Path "$env:TEMP\scholar-update.zip", "$env:TEMP\scholar-extracted" -Recurse -Force

Write-Host "Updating dependencies..."
& "$ScriptDir\setup.ps1"

Write-Host "Update complete. Run .\start.ps1 to launch."

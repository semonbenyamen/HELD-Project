Write-Host "EstateFlow Pro setup" -ForegroundColor Green

Write-Host "`nInstalling backend dependencies..."
Set-Location "$PSScriptRoot\backend"
npm install

if (!(Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "Created backend\.env"
}

Write-Host "`nInstalling frontend dependencies..."
Set-Location "$PSScriptRoot\frontend"
npm install

if (!(Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "Created frontend\.env"
}

Set-Location $PSScriptRoot
Write-Host "`nDone. Edit backend\.env with your MongoDB connection, then run npm run seed inside backend." -ForegroundColor Cyan

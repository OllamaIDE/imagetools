# 1. Build the project
Write-Host "Building the project... Please wait." -ForegroundColor Cyan
npm run build

# Check if npm build was successful
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Build failed with exit code $LASTEXITCODE. Deployment aborted." -ForegroundColor Red
    exit $LASTEXITCODE
}

# 2. Check if dist folder exists
if (Test-Path "dist") {
    Write-Host "Build successful! Moving .htaccess to dist folder..." -ForegroundColor Green
    
    # Copy .htaccess into dist folder
    if (Test-Path ".htaccess") {
        Copy-Item ".htaccess" "dist/.htaccess"
        Write-Host "Success: .htaccess added to dist." -ForegroundColor Green
    } else {
        Write-Host "Warning: .htaccess not found in root directory." -ForegroundColor Yellow
    }

    Write-Host "----------------------------------------------------"
    Write-Host "READY FOR DEPLOYMENT!" -ForegroundColor Cyan
    Write-Host "1. Right-click the 'dist' folder and choose 'Compress to ZIP file'."
    Write-Host "2. Upload the ZIP to your cPanel's public_html."
    Write-Host "3. Extract it there."
    Write-Host "----------------------------------------------------"
} else {
    Write-Host "Error: Build failed. Please check for errors above." -ForegroundColor Red
}

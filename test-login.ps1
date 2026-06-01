# Test Login Script
# This script tests if the login endpoint is working

Write-Host "Testing Dealer Login..." -ForegroundColor Cyan
Write-Host ""

# Test credentials
$body = @{
    username = "dealer_01"
    password = "Dealer@1234"
} | ConvertTo-Json

Write-Host "Credentials being tested:" -ForegroundColor Yellow
Write-Host "Username: dealer_01"
Write-Host "Password: Dealer@1234"
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8081/api/v1/auth/login" `
        -Method Post `
        -Body $body `
        -ContentType "application/json" `
        -ErrorAction Stop
    
    Write-Host "✅ LOGIN SUCCESSFUL!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 5
    
} catch {
    Write-Host "❌ LOGIN FAILED!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error Details:" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
    Write-Host "Status Description: $($_.Exception.Response.StatusDescription)"
    Write-Host ""
    
    # Try to read the error response body
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $reader.BaseStream.Position = 0
    $reader.DiscardBufferedData()
    $responseBody = $reader.ReadToEnd()
    Write-Host "Response Body:" -ForegroundColor Red
    Write-Host $responseBody
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

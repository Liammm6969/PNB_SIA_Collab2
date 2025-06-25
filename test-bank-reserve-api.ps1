# Bank Reserve API Test Script
# This script tests the bank reserve endpoints

Write-Host "Testing Bank Reserve API endpoints..." -ForegroundColor Green

$baseUrl = "http://192.168.88.244:4000/api/Philippine-National-Bank"

try {
    # Test 1: Get bank reserve
    Write-Host "`n1. Testing GET /bank/reserve..." -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri "$baseUrl/bank/reserve" -Method GET -ContentType "application/json"
    Write-Host "✓ Bank Reserve retrieved successfully" -ForegroundColor Green
    Write-Host "  Current Balance: $($response.data.total_balance)" -ForegroundColor Cyan
    Write-Host "  Status: $($response.data.last_transaction_type)" -ForegroundColor Cyan
    
    # Test 2: Get bank reserve stats  
    Write-Host "`n2. Testing GET /bank/reserve/stats..." -ForegroundColor Yellow
    $statsResponse = Invoke-RestMethod -Uri "$baseUrl/bank/reserve/stats" -Method GET -ContentType "application/json"
    Write-Host "✓ Bank Reserve stats retrieved successfully" -ForegroundColor Green
    Write-Host "  Created: $($statsResponse.data.created_date)" -ForegroundColor Cyan
    Write-Host "  Last Updated: $($statsResponse.data.last_updated)" -ForegroundColor Cyan
    
    # Test 3: Check bank funds
    Write-Host "`n3. Testing POST /bank/reserve/check-funds..." -ForegroundColor Yellow
    $checkFundsBody = @{
        amount = 50000
    } | ConvertTo-Json
    
    $fundsResponse = Invoke-RestMethod -Uri "$baseUrl/bank/reserve/check-funds" -Method POST -Body $checkFundsBody -ContentType "application/json"
    Write-Host "✓ Bank funds check completed" -ForegroundColor Green
    Write-Host "  Amount requested: $($fundsResponse.data.amount_requested)" -ForegroundColor Cyan
    Write-Host "  Sufficient funds: $($fundsResponse.data.sufficient_funds)" -ForegroundColor Cyan
    
    Write-Host "`n🎉 All Bank Reserve API tests passed!" -ForegroundColor Green
    
} catch {
    Write-Host "`n❌ API test failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Make sure the server is running on port 4000" -ForegroundColor Yellow
}

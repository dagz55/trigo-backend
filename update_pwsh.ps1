# Requires -RunAsAdministrator

# Function to check if running as administrator
function Test-Administrator {
    $user = [Security.Principal.WindowsIdentity]::GetCurrent();
    $principal = New-Object Security.Principal.WindowsPrincipal $user
    return $principal.IsInRole([Security.Principal.WindowsBuiltinRole]::Administrator)
}

# Check if running as administrator
if (-not (Test-Administrator)) {
    Write-Error "This script requires administrator privileges. Please run as administrator."
    exit 1
}

Write-Host "Starting updates for PowerShell and Azure CLI..." -ForegroundColor Cyan

# Update PowerShell
Write-Host "Updating PowerShell..." -ForegroundColor Yellow
try {
    winget upgrade Microsoft.PowerShell
    Write-Host "PowerShell update completed successfully." -ForegroundColor Green
} catch {
    Write-Error "Failed to update PowerShell: $_"
}

# Update Azure CLI
Write-Host "Updating Azure CLI..." -ForegroundColor Yellow
try {
    az upgrade --yes
    Write-Host "Azure CLI update completed successfully." -ForegroundColor Green
} catch {
    Write-Error "Failed to update Azure CLI: $_"
}

Write-Host "All updates completed!" -ForegroundColor Green

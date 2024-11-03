# Get all installed Az modules
$currentModules = Get-InstalledModule -Name Az.* -ErrorAction SilentlyContinue

# Update each module
foreach ($module in $currentModules) {
    Write-Host "Updating $($module.Name) from version $($module.Version)..."
    try {
        Update-Module -Name $module.Name -Force -ErrorAction Stop
        Write-Host "Successfully updated $($module.Name)" -ForegroundColor Green
    }
    catch {
        Write-Host "Failed to update $($module.Name): $_" -ForegroundColor Red
    }
}

# Clean up older versions
Write-Host "`nCleaning up older versions..."
foreach ($module in $currentModules) {
    $latest = Get-InstalledModule -Name $module.Name
    Get-InstalledModule -Name $module.Name -AllVersions | 
        Where-Object {$_.Version -ne $latest.Version} | 
        Uninstall-Module -Force
}

Write-Host "`nAz module update complete!" -ForegroundColor Green

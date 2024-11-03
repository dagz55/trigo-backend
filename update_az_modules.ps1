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
    try {
        $latest = Get-InstalledModule -Name $module.Name
        $oldVersions = Get-InstalledModule -Name $module.Name -AllVersions | 
            Where-Object {$_.Version -ne $latest.Version}
        
        foreach ($oldVersion in $oldVersions) {
            try {
                Write-Host "Removing $($oldVersion.Name) version $($oldVersion.Version)..."
                Uninstall-Module -Name $oldVersion.Name -RequiredVersion $oldVersion.Version -Force -ErrorAction Stop
            }
            catch {
                Write-Warning "Could not remove $($oldVersion.Name) version $($oldVersion.Version): $_"
                # Try alternative removal method
                $modulePath = $oldVersion.InstalledLocation
                if (Test-Path $modulePath) {
                    Remove-Item -Path $modulePath -Recurse -Force -ErrorAction SilentlyContinue
                }
            }
        }
    }
    catch {
        Write-Warning "Error cleaning up old versions of $($module.Name): $_"
    }
}

Write-Host "`nAz module update complete!" -ForegroundColor Green

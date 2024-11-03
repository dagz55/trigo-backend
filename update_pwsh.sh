#!/bin/zsh

# Function to compare version strings
version_compare() {
    IFS='.' read -A v1 <<< "$1"
    IFS='.' read -A v2 <<< "$2"
    for ((i=1; i<=${#v1[@]} || i<=${#v2[@]}; i++)); do
        local n1=${v1[i]:-0}
        local n2=${v2[i]:-0}
        if ((n1 > n2)); then
            return 1
        elif ((n1 < n2)); then
            return 2
        fi
    done
    return 0
}

# Get current PowerShell version
current_version=$(pwsh -v | awk '{print $2}')

# Fetch latest version from GitHub API
latest_version=$(curl -s https://api.github.com/repos/PowerShell/PowerShell/releases/latest | grep -Eo '"tag_name": "v[0-9]+\.[0-9]+\.[0-9]+"' | cut -d'"' -f4 | sed 's/v//')

echo "Current version: $current_version"
echo "Latest version: $latest_version"

# Compare versions
version_compare "$current_version" "$latest_version"
comparison_result=$?

case $comparison_result in
    0) echo "PowerShell is up to date." ;;
    1) echo "Current version is newer than the latest release. No update needed." ;;
    2) echo "PowerShell update available!"
       read -q "response?Do you want to update? (y/N) "
       echo
       if [[ $response =~ ^[Yy]$ ]]
       then
           echo "Updating PowerShell..."
           brew update && brew upgrade powershell --cask
           echo "PowerShell updated to version $latest_version"
       else
           echo "Update cancelled."
       fi
       ;;
    *) echo "Error comparing versions." ;;
esac#!/bin/zsh

echo "\033[36mStarting updates for PowerShell and Azure CLI...\033[0m"

# Update PowerShell if installed via homebrew
echo "\033[33mUpdating PowerShell...\033[0m"
if brew list --formula | grep -q "powershell"; then
    brew upgrade powershell || echo "\033[31mFailed to update PowerShell\033[0m"
    echo "\033[32mPowerShell update completed successfully.\033[0m"
else
    echo "\033[31mPowerShell not found. Install it first with: brew install powershell\033[0m"
fi

# Update Azure CLI
echo "\033[33mUpdating Azure CLI...\033[0m"
if command -v az >/dev/null 2>&1; then
    az upgrade --yes || echo "\033[31mFailed to update Azure CLI\033[0m"
    echo "\033[32mAzure CLI update completed successfully.\033[0m"
else
    echo "\033[31mAzure CLI not found. Install it first with: brew install azure-cli\033[0m"
fi

echo "\033[32mAll updates completed!\033[0m"

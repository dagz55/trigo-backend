#!/bin/zsh

echo "\033[36mStarting updates for PowerShell and Azure CLI...\033[0m"

# Update PowerShell
echo "\033[33mChecking PowerShell version...\033[0m"
if command -v pwsh >/dev/null 2>&1; then
    current_version=$(pwsh -v | awk '{print $2}')
    latest_version=$(curl -s https://api.github.com/repos/PowerShell/PowerShell/releases/latest | grep -Eo '"tag_name": "v[0-9]+\.[0-9]+\.[0-9]+"' | cut -d'"' -f4 | sed 's/v//')
    
    echo "Current version: $current_version"
    echo "Latest version: $latest_version"

    if [ "$current_version" != "$latest_version" ]; then
        echo "\033[33mPowerShell update available!\033[0m"
        if brew list --cask | grep -q "powershell"; then
            brew upgrade powershell --cask || echo "\033[31mFailed to update PowerShell\033[0m"
            echo "\033[32mPowerShell update completed successfully.\033[0m"
        else
            echo "\033[31mPowerShell not found in brew cask. Install it first with: brew install --cask powershell\033[0m"
        fi
    else
        echo "\033[32mPowerShell is up to date.\033[0m"
    fi
else
    echo "\033[31mPowerShell not found. Install it first with: brew install --cask powershell\033[0m"
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

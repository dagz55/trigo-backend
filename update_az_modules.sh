#!/bin/bash

# Check if PowerShell is installed
if ! command -v pwsh &> /dev/null; then
    echo "PowerShell is not installed. Please install it first."
    exit 1
fi

# Execute the PowerShell script
pwsh -File "$(dirname "$0")/update_az_modules.ps1"

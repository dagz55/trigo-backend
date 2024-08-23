#!/bin/zsh

# Function to get disk usage percentage
get_disk_usage() {
    df -h | awk '$1 == "/dev/disk3s5" {print $5}' | sed 's/%//'
}

# Function to send notification
send_notification() {
    osascript -e "display notification \"Disk usage is at $1%\" with title \"Disk Usage Alert\""
}

# Main loop
while true; do
    usage=$(get_disk_usage)
    if (( usage >= 74 )); then
        send_notification $usage
    fi
    sleep 3600  # Check every hour
done

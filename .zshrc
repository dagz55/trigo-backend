# Enable Powerlevel10k instant prompt. Should stay close to the top of ~/.zshrc.
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

# Function to safely source files
safe_source() {
    [[ -f "$1" ]] && source "$1"
}

# Set PATH variables
typeset -U path
path=(
    "/Library/Frameworks/Python.framework/Versions/3.12/lib/python3.12/site-packages"
    "/Library/Frameworks/Python.framework/Versions/3.12/bin"
    "/usr/local/bin"
    "$HOME/.cache/lm-studio/bin"
    "/opt/homebrew/opt/curl/bin"
    "$HOME/.local/bin"
    "$BUN_INSTALL/bin"
    $path
)
export PATH

export NODE_OPTIONS="--max-old-space-size=8192"

# FZF setup
export FZF_DEFAULT_COMMAND="fd --hidden --strip-cwd-prefix --exclude .git"
export FZF_CTRL_T_COMMAND="$FZF_DEFAULT_COMMAND"
export FZF_ALT_C_COMMAND="fd --type=d --hidden --strip-cwd-prefix --exclude .git"
export FZF_CTRL_T_OPTS="--preview 'if [ -d {} ]; then eza --tree --color=always {} | head -200; else bat -n --color=always --line-range :500 {}; fi'"
export FZF_ALT_C_OPTS="--preview 'eza --tree --color=always {} | head -200'"

# History setup
HISTFILE="$HOME/.zhistory"
SAVEHIST=100000
HISTSIZE=10000
setopt share_history hist_expire_dups_first hist_ignore_dups hist_verify

# Key bindings
bindkey '^[[A' history-search-backward
bindkey '^[[B' history-search-forward
bindkey -s '^r' 'source ~/.zshrc\n'

# Aliases
alias ls="eza --color=always --long --git --icons=always --no-user --sort newest"
alias py="python"
alias reload='source ~/.zshrc'
alias fixonedrive='fix_onedrive'

# Exports
export BAT_THEME=tokyonight_night
export BUN_INSTALL="$HOME/.bun"

# Source files and load plugins
safe_source ~/.zshrc_console_output
safe_source ~/.p10k.zsh
safe_source /opt/homebrew/share/zsh-autosuggestions/zsh-autosuggestions.zsh
safe_source /opt/homebrew/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
safe_source "$HOME/.bun/_bun"

# Google Cloud SDK setup
setup_gcloud() {
    local gcloud_path="$HOME/google-cloud-sdk"
    local log_file="$HOME/gcloud_setup.log"

    echo "Starting Google Cloud SDK setup at $(date)" > "$log_file"

    if [[ ! -d "$gcloud_path" ]]; then
        echo "Google Cloud SDK not found. Installing..." | tee -a "$log_file"
        if [[ $(uname -m) == "arm64" ]]; then
            echo "Detected ARM64 architecture" | tee -a "$log_file"
            curl https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-cli-437.0.1-darwin-arm.tar.gz | tar xz -C "$HOME" 2>> "$log_file"
            if [ $? -ne 0 ]; then
                echo "Failed to download or extract Google Cloud SDK" | tee -a "$log_file"
                return 1
            fi
            "$gcloud_path/install.sh" --quiet --command-completion false --path-update false --usage-reporting false 2>> "$log_file"
            if [ $? -ne 0 ]; then
                echo "Failed to install Google Cloud SDK" | tee -a "$log_file"
                return 1
            fi
        else
            echo "Detected x86_64 architecture" | tee -a "$log_file"
            curl https://sdk.cloud.google.com | bash -s -- --disable-prompts --command-completion false --path-update false --usage-reporting false 2>> "$log_file"
            if [ $? -ne 0 ]; then
                echo "Failed to install Google Cloud SDK" | tee -a "$log_file"
                return 1
            fi
        fi
    else
        echo "Google Cloud SDK found at $gcloud_path" | tee -a "$log_file"
    fi

    export USE_GKE_GCLOUD_AUTH_PLUGIN=True
    export CLOUDSDK_PYTHON="/usr/bin/python3"
    export RUST_BACKTRACE=1

    echo "Sourcing Google Cloud SDK files..." | tee -a "$log_file"
    if safe_source "$gcloud_path/path.zsh.inc" 2>> "$log_file"; then
        echo "Successfully sourced path.zsh.inc" | tee -a "$log_file"
    else
        echo "Failed to source path.zsh.inc" | tee -a "$log_file"
        return 1
    fi

    if safe_source "$gcloud_path/completion.zsh.inc" 2>> "$log_file"; then
        echo "Successfully sourced completion.zsh.inc" | tee -a "$log_file"
    else
        echo "Failed to source completion.zsh.inc" | tee -a "$log_file"
        return 1
    fi

    echo "Google Cloud SDK setup completed at $(date)" | tee -a "$log_file"
    
    # Verify gcloud installation
    if command -v gcloud &> /dev/null; then
        echo "gcloud command is available" | tee -a "$log_file"
        echo "Attempting to run gcloud --version" | tee -a "$log_file"
        (
            set -x
            python3 -c "import sys; print('Python sys.path:', sys.path)" | tee -a "$log_file"
            python3 -c "import os; print('PYTHONPATH:', os.environ.get('PYTHONPATH', 'Not set'))" | tee -a "$log_file"
            python3 -c "
import sys
try:
    import google.auth
    print('google.auth imported successfully')
except ImportError as e:
    print(f'Failed to import google.auth: {e}')
try:
    from googlecloudsdk.core import properties
    print('googlecloudsdk.core.properties imported successfully')
except ImportError as e:
    print(f'Failed to import googlecloudsdk.core.properties: {e}')
" | tee -a "$log_file"
            gcloud --version
        ) 2>&1 | tee -a "$log_file"
        if [ $? -ne 0 ]; then
            echo "Error occurred while running gcloud --version" | tee -a "$log_file"
        fi
    else
        echo "gcloud command is not available" | tee -a "$log_file"
        return 1
    fi

    # Check for specific error in gcloud.py
    if grep -q "File \"/Users/robertsuarez/google-cloud-sdk/lib/gcloud.py\", line 183, in main" "$log_file"; then
        echo "Detected specific error in gcloud.py. Attempting to fix..." | tee -a "$log_file"
        # You might want to add specific fix here if you know what's causing the error
        # For now, we'll just log it
        echo "Error in gcloud.py detected. Please check the SDK installation." | tee -a "$log_file"
    fi
}

setup_gcloud

# Conda initialization
if [ -f "/opt/homebrew/Caskroom/miniconda/base/etc/profile.d/conda.sh" ]; then
    . "/opt/homebrew/Caskroom/miniconda/base/etc/profile.d/conda.sh"
else
    export PATH="/opt/homebrew/Caskroom/miniconda/base/bin:$PATH"
fi

# Function definitions
fix_onedrive() {
    umount ~/OneDrive 2>/dev/null
    sleep 2
    mount -t smbfs //robertsuarez@d.docs.live.net/OneDrive ~/OneDrive
}

# Remove welcome messages
for file in ~/.zprofile ~/.zshenv ~/.zlogin; do
    if [ -f "$file" ]; then
        sed -i '' '/echo.*[Ww]elcome/d' "$file"
    fi
done

# To customize prompt, run `p10k configure` or edit ~/.p10k.zsh.
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh

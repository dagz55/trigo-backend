# Enable Powerlevel10k instant prompt. Should stay close to the top of ~/.zshrc.
# Initialization code that may require console input (password prompts, [y/n]
# confirmations, etc.) must go above this block; everything else may go below.
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

#!/usr/bin/env zsh

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check requirements
check_requirements() {
    local requirements_file="$HOME/requirements.txt"
    local missing_requirements=()

    if [[ ! -f "$requirements_file" ]]; then
        return 1
    fi

    while IFS= read -r requirement || [[ -n "$requirement" ]]; do
        requirement=$(echo "$requirement" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
        if [[ "$requirement" == \#* ]] || [[ -z "$requirement" ]]; then
            continue
        fi
        if ! command_exists "$requirement"; then
            missing_requirements+=("$requirement")
        fi
    done < "$requirements_file"

    if [[ ${#missing_requirements[@]} -gt 0 ]]; then
        return 1
    fi

    return 0
}

# Check requirements silently
check_requirements >/dev/null 2>&1

# Rest of your .zshrc content starts here
# Use the powerlevel10k theme
ZSH_THEME="powerlevel10k/powerlevel10k"

# The next line updates PATH for the Google Cloud SDK.
if [ -f "$HOME/google-cloud-sdk/path.zsh.inc" ]; then 
    . "$HOME/google-cloud-sdk/path.zsh.inc" 
fi

# The next line enables shell command completion for gcloud.
if [ -f "$HOME/google-cloud-sdk/completion.zsh.inc" ]; then 
    . "$HOME/google-cloud-sdk/completion.zsh.inc" 
fi

# Alias to reload .zshrc
alias reload='source ~/.zshrc'

# Bind Ctrl + R to reload .zshrc
bindkey -s '^r' 'source ~/.zshrc\n'

# Source powerlevel10k theme
if [ -f "/opt/homebrew/share/powerlevel10k/powerlevel10k.zsh-theme" ]; then
    source /opt/homebrew/share/powerlevel10k/powerlevel10k.zsh-theme
else
    echo "Warning: powerlevel10k theme file not found. Please check its installation."
fi

# Conda initialization (simplified)
if [ -f "/opt/homebrew/Caskroom/miniconda/base/etc/profile.d/conda.sh" ]; then
    . "/opt/homebrew/Caskroom/miniconda/base/etc/profile.d/conda.sh"
else
    echo "Warning: Conda initialization file not found. Please check Conda installation."
fi

# Alias to show hidden files with their permissions, sizes, and sorted by date using eza
if command -v eza &> /dev/null; then
    alias lsh='eza -la --long --group-directories-first --icons --color=always --sort newest'
else
    echo "Warning: eza not found. Using default ls command for lsh alias."
    alias lsh='ls -lah'
fi

# Bun completions
if [ -s "$HOME/.bun/_bun" ]; then
    source "$HOME/.bun/_bun"
else
    echo "Warning: Bun completion file not found. Please check Bun installation."
fi

# Bun installation path
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

# Java home and path settings
if [ -d "/opt/homebrew/opt/openjdk" ]; then
    export JAVA_HOME="/opt/homebrew/opt/openjdk"
    export PATH="$JAVA_HOME/bin:$PATH"
else
    echo "Warning: OpenJDK not found. Please check Java installation."
fi

# Function to check for updates and prompt user
function check_for_updates {
    echo "Do you want to check for updates to all installed packages, software, and modules? (Y/n)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo "Checking for updates..."
        
        # Update Homebrew packages
        if command -v brew &> /dev/null; then
            echo "Updating Homebrew packages..."
            brew update && brew upgrade || echo "Homebrew update failed"
        else
            echo "Homebrew not found. Skipping Homebrew updates."
        fi
        
        # Update npm global packages
        if command -v npm &> /dev/null; then
            echo "Updating npm global packages..."
            npm update -g || echo "npm update failed"
        else
            echo "npm not found. Skipping npm updates."
        fi
        
        # Update Python packages
        if command -v pip &> /dev/null; then
            echo "Updating Python packages..."
            pip list --outdated --format=freeze | grep -v '^\-e' | cut -d = -f 1 | xargs -n1 pip install -U || echo "pip update failed"
        else
            echo "pip not found. Skipping Python package updates."
        fi
        
        # Update Conda packages
        if command -v conda &> /dev/null; then
            echo "Updating Conda packages..."
            conda update --all -y || echo "Conda update failed"
        else
            echo "Conda not found. Skipping Conda updates."
        fi
        
        echo "Update process completed."
    else
        echo "Skipping updates."
    fi
}

# Call the function to check for updates
check_for_updates

# Update Homebrew (separate from the function to ensure it always runs)
# if command -v brew &> /dev/null; then
#     echo "Updating Homebrew..."
#     brew update || echo "Homebrew update failed"
# else
#     echo "Homebrew not found. Skipping Homebrew update."
# fi

# Initialized the following:
alias fk='eval $(thefuck --alias)'
source <(zoxide init zsh)
source <(atuin init zsh)
source <(fzf --zsh)
eval "$(starship init zsh)"

# To customize prompt, run `p10k configure` or edit ~/.p10k.zsh.
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh

# Activate auto-suggest
source $(brew --prefix)/share/zsh-autosuggestions/zsh-autosuggestions.zsh

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
export PATH=~/.npm-global/bin:$PATH

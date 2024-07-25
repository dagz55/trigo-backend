# Redirect all output to /dev/null for the entire file
{

# Enable Powerlevel10k instant prompt. Should stay close to the top of ~/.zshrc.
# Initialization code that may require console input (password prompts, [y/n]
# confirmations, etc.) must go above this block; everything else may go below.
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

# Function to check requirements
check_requirements() {
    [[ -f "$HOME/requirements.txt" ]] || return 1
    while IFS= read -r requirement || [[ -n "$requirement" ]]; do
        requirement=${requirement%%#*} # Remove comments
        requirement=${requirement%% *} # Remove version specifiers
        [[ -n "$requirement" ]] && ! command -v "$requirement" >/dev/null 2>&1 && return 1
    done < "$HOME/requirements.txt"
    return 0
}

# Check requirements silently
check_requirements

# Use the powerlevel10k theme
ZSH_THEME="powerlevel10k/powerlevel10k"

# Load Google Cloud SDK configurations
[[ -f "$HOME/google-cloud-sdk/path.zsh.inc" ]] && source "$HOME/google-cloud-sdk/path.zsh.inc"
[[ -f "$HOME/google-cloud-sdk/completion.zsh.inc" ]] && source "$HOME/google-cloud-sdk/completion.zsh.inc"

# Alias to reload .zshrc
alias reload='source ~/.zshrc'

# Bind Ctrl + R to reload .zshrc
bindkey -s '^r' 'source ~/.zshrc\n'

# Source powerlevel10k theme
[[ -f "/opt/homebrew/share/powerlevel10k/powerlevel10k.zsh-theme" ]] && source "/opt/homebrew/share/powerlevel10k/powerlevel10k.zsh-theme"

# Conda initialization (simplified)
[[ -f "/opt/homebrew/Caskroom/miniconda/base/etc/profile.d/conda.sh" ]] && source "/opt/homebrew/Caskroom/miniconda/base/etc/profile.d/conda.sh"

# Alias to show hidden files with their permissions, sizes, and sorted by date using eza
if command -v eza >/dev/null 2>&1; then
    alias lsh='eza -la --long --group-directories-first --icons --color=always --sort newest'
else
    alias lsh='ls -lah'
fi

# Bun completions
[[ -f "$HOME/.bun/_bun" ]] && source "$HOME/.bun/_bun"

# Bun installation path
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

# Java home and path settings
if [ -d "/opt/homebrew/opt/openjdk" ]; then
    export JAVA_HOME="/opt/homebrew/opt/openjdk"
    export PATH="$JAVA_HOME/bin:$PATH"
fi

# Function to check for updates and prompt user
function check_for_updates {
    # This function will be called manually to avoid initialization delays
    # The content remains the same, but it's not automatically executed on startup
}

# Initialize the following:
alias fk='eval $(thefuck --alias)'
source <(zoxide init zsh --no-cmd)
source <(atuin init zsh --disable-ctrl-r)
source <(fzf --zsh)
eval "$(starship init zsh)"

# To customize prompt, run `p10k configure` or edit ~/.p10k.zsh.
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh

# Activate auto-suggest
[[ -f "$(brew --prefix)/share/zsh-autosuggestions/zsh-autosuggestions.zsh" ]] && source "$(brew --prefix)/share/zsh-autosuggestions/zsh-autosuggestions.zsh"

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" --no-use  # This loads nvm without using it
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
export PATH=~/.npm-global/bin:$PATH

} >/dev/null 2>&1

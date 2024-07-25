# Enable Powerlevel10k instant prompt. Should stay close to the top of ~/.zshrc.
# Initialization code that may require console input (password prompts, [y/n]
# confirmations, etc.) must go above this block; everything else may go below.
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

# Silence all output during initialization
{

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check requirements
check_requirements() {
    local requirements_file="$HOME/requirements.txt"
    [[ -f "$requirements_file" ]] || return 1
    while IFS= read -r requirement || [[ -n "$requirement" ]]; do
        requirement=${requirement%%#*} # Remove comments
        requirement=${requirement%% *} # Remove version specifiers
        [[ -n "$requirement" ]] && ! command_exists "$requirement" && return 1
    done < "$requirements_file"
    return 0
}

# Check requirements silently
check_requirements

# Function to load configurations silently
load_config_silently() {
    [[ -f "$1" ]] && source "$1"
}

} 2>/dev/null

# Rest of your .zshrc content starts here
# Use the powerlevel10k theme
ZSH_THEME="powerlevel10k/powerlevel10k"

# Load Google Cloud SDK configurations silently
load_config_silently "$HOME/google-cloud-sdk/path.zsh.inc"
load_config_silently "$HOME/google-cloud-sdk/completion.zsh.inc"

# Alias to reload .zshrc
alias reload='source ~/.zshrc'

# Bind Ctrl + R to reload .zshrc
bindkey -s '^r' 'source ~/.zshrc\n'

# Source powerlevel10k theme silently
load_config_silently "/opt/homebrew/share/powerlevel10k/powerlevel10k.zsh-theme"

# Conda initialization (simplified)
load_config_silently "/opt/homebrew/Caskroom/miniconda/base/etc/profile.d/conda.sh"

# Alias to show hidden files with their permissions, sizes, and sorted by date using eza
if command -v eza &> /dev/null; then
    alias lsh='eza -la --long --group-directories-first --icons --color=always --sort newest'
else
    alias lsh='ls -lah'
fi

# Bun completions
load_config_silently "$HOME/.bun/_bun"

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

# Commented out the automatic call to check_for_updates
# check_for_updates

# Homebrew update is also commented out to avoid initialization delays

# Silence all output during initialization
{

# Initialize the following:
alias fk='eval $(thefuck --alias)'
source <(zoxide init zsh --no-cmd)
source <(atuin init zsh --disable-ctrl-r)
source <(fzf --zsh)
eval "$(starship init zsh)"

# To customize prompt, run `p10k configure` or edit ~/.p10k.zsh.
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh

# Activate auto-suggest
source $(brew --prefix)/share/zsh-autosuggestions/zsh-autosuggestions.zsh 2>/dev/null

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" --no-use  # This loads nvm without using it
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
export PATH=~/.npm-global/bin:$PATH

} 2>/dev/null

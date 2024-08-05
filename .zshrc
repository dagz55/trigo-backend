# Basic PATH setup
export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

# Debug function
debug_zsh_startup() {
    echo "Debug information:"
    echo "SHELL: $SHELL"
    echo "PATH: $PATH"
    echo "Current directory: $(pwd)"
    echo "User: $(whoami)"
    echo "ZSH version: $ZSH_VERSION"
}

# Uncomment the line below to run debug on startup
# debug_zsh_startup

# Google Cloud SDK setup (commented out for now)
# if [ -f "$HOME/google-cloud-sdk/path.zsh.inc" ]; then 
#     . "$HOME/google-cloud-sdk/path.zsh.inc" 
# fi
# if [ -f "$HOME/google-cloud-sdk/completion.zsh.inc" ]; then 
#     . "$HOME/google-cloud-sdk/completion.zsh.inc" 
# fi

# Alias to reload .zshrc
alias reload='source ~/.zshrc'

# Bind Ctrl + R to reload .zshrc
bindkey -s '^r' 'source ~/.zshrc\n'

# Lazy loading conda
#function __lazy_conda {
#    unset -f conda
#    __conda_setup="$('/opt/homebrew/Caskroom/miniconda/base/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
#    if [ $? -eq 0 ]; then
#        eval "$__conda_setup"
#    else
#        if [ -f "/opt/homebrew/Caskroom/miniconda/base/etc/profile.d/conda.sh" ]; then
#            . "/opt/homebrew/Caskroom/miniconda/base/etc/profile.d/conda.sh"
#        else
#            export PATH="/opt/homebrew/Caskroom/miniconda/base/bin:$PATH"
#        fi
#    fi
#    unset __conda_setup
#    conda "$@"
#}

# Alias to initialize conda lazily
# alias conda='__lazy_conda'

# Bun completions
[ -s "$HOME/.bun/_bun" ] && source "$HOME/.bun/_bun"

# Bun installation path
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

# Java home and path settings
export JAVA_HOME="/opt/homebrew/opt/openjdk"
export PATH="$JAVA_HOME/bin:$PATH"

# Spoof-DPI 
export PATH=$PATH:~/.spoof-dpi/bin

# Update Homebrew
#brew update

# ALIASES
alias lsh='eza -la --long --group-directories-first --icons --color=always --sort newest'
alias update='brew update && brew upgrade'
alias cls='clear'
alias ..='cd ..'
alias ...='cd ../..'

# Initialize tools (commented out for troubleshooting)
# eval "$(atuin init zsh)"
# eval "$(zoxide init zsh)"
# [ -f ~/.fzf.zsh ] && source ~/.fzf.zsh
# eval $(thefuck --alias)

# FZF configuration (commented out for now)
# export FZF_DEFAULT_OPTS=$FZF_DEFAULT_OPTS'
#   --color=fg:#d0d0d0,fg+:#d0d0d0,bg:#121212,bg+:#262626
#   --color=hl:#5f87af,hl+:#5fd7ff,info:#afaf87,marker:#87ff00
#   --color=prompt:#d7005f,spinner:#af5fff,pointer:#af5fff,header:#87afaf
#   --color=border:#262626,label:#aeaeae,query:#d9d9d9
#   --border="rounded" --border-label="" --preview-window="border-rounded" --prompt="> "
#   --marker=">" --pointer="◆" --separator="─" --scrollbar="│"
#   --marker=">" --pointer="◆" --separator="─" --scrollbar="│"'

# Function to check for updates
function check_for_updates {
    echo "Checking for updates..."
    # Update Homebrew packages
    if command -v brew &> /dev/null; then
        echo "Updating Homebrew packages..."
        brew update && brew upgrade
    fi
    # Update Python packages
    # if command -v pip &> /dev/null; then
    #     echo "Updating pip packages..."
    #     pip list --outdated --format=freeze | grep -v '^\-e' | cut -d = -f 1 | xargs -n1 pip install -U
    # fi
    # Update Conda packages
    # if command -v conda &> /dev/null; then
    #    echo "Updating Conda packages..."
    #    conda update --all -y
    # fi
}

# Alias for easy update
alias update_all='check_for_updates'

# Function to reset terminal process
reset_terminal() {
    echo "Resetting terminal process..."
    # Ensure PATH includes common locations
    export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"
    # Reset SHELL if it's not set correctly
    export SHELL=$(which zsh)
    # Clear any potentially problematic environment variables
    unset ZDOTDIR
    # Re-execute the shell
    exec $SHELL -l
}

# Alias for easy access
alias fix_terminal='reset_terminal'

# Debug function for VS Code terminal
vscode_terminal_debug() {
    echo "Debugging VS Code terminal launch..."
    echo "SHELL: $SHELL"
    echo "PATH: $PATH"
    echo "Current directory: $(pwd)"
    echo "User: $(whoami)"
    echo "ZSH version: $ZSH_VERSION"
    echo "Terminal program: $TERM_PROGRAM"
}

# Alias for easy debugging
alias debug_vscode_terminal='vscode_terminal_debug'

# Function to reset terminal process
reset_terminal() {
    echo "Resetting terminal process..."
    exec $SHELL
}

# Alias for easy access
alias fix_terminal='reset_terminal'



# Powerlevel10k configuration (commented out for troubleshooting)
# [[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh
# source /opt/homebrew/share/powerlevel10k/powerlevel10k.zsh-theme

# Basic prompt setup
PS1='%n@%m %~ %# '


# Enable Powerlevel10k instant prompt. Should stay close to the top of ~/.zshrc.
# Initialization code that may require console input (password prompts, [y/n]
# confirmations, etc.) must go above this block; everything else may go below.
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

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
# source /opt/homebrew/share/powerlevel10k/powerlevel10k.zsh-theme

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

# Update Homebrew
#brew update

# ALIASES
alias lsh='eza -la --long --group-directories-first --icons --color=always --sort newest'
# alias z=zoxide

# Initialize tools
eval "$(atuin init zsh)"
eval "$(zoxide init zsh)"
[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh
# eval $(thefuck --alias)  # Commented out due to potential issues

export FZF_DEFAULT_OPTS=$FZF_DEFAULT_OPTS'
  --color=fg:#d0d0d0,fg+:#d0d0d0,bg:#121212,bg+:#262626
  --color=hl:#5f87af,hl+:#5fd7ff,info:#afaf87,marker:#87ff00
  --color=prompt:#d7005f,spinner:#af5fff,pointer:#af5fff,header:#87afaf
  --color=border:#262626,label:#aeaeae,query:#d9d9d9
  --border="rounded" --border-label="" --preview-window="border-rounded" --prompt="> "
  --marker=">" --pointer="◆" --separator="─" --scrollbar="│"'

# Function to check for updates
#function check_for_updates {
#    echo "Checking for updates..."
#    # Update Homebrew packages
#    brew update && brew upgrade
#    # Update npm global packages
#    # if command -v npm &> /dev/null; then
#    #    echo "Clearing npm cache..."
#    #    npm cache clean --force
#    #    echo "Updating npm global packages..."
#    #    npm update -g
#    # fi
#    # Update Python packages
#    # if command -v pip &> /dev/null; then pip list --outdated | awk '{print $1}' | xargs -n1 pip install -U; fi
#    # Update Conda packages
#    # if command -v conda &> /dev/null; then conda update --all -y; fi
#}
# Call the function to check for updates
#check_for_updates

# Function to reset terminal process
reset_terminal() {
    echo "Attempting to reset terminal process..."
    kill -9 $$ 2>/dev/null || exec $SHELL
    echo "If you're seeing this, the reset didn't work. Please try running 'exec $SHELL' manually."
}

# Alias for easy access
alias fix_terminal='reset_terminal'

# To customize prompt, run `p10k configure` or edit ~/.p10k.zsh.
# [[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh

# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/opt/homebrew/Caskroom/miniconda/base/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/opt/homebrew/Caskroom/miniconda/base/etc/profile.d/conda.sh" ]; then
        . "/opt/homebrew/Caskroom/miniconda/base/etc/profile.d/conda.sh"
    else
        export PATH="/opt/homebrew/Caskroom/miniconda/base/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<

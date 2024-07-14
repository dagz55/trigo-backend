# Enable Powerlevel10k instant prompt. Should stay close to the top of ~/.zshrc.
# Initialization code that may require console input (password prompts, [y/n]
# confirmations, etc.) must go above this block; everything else may go below.
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

# Remove any welcome message
unsetopt PROMPT_SP

# Set PATH variables
export PATH="/Library/Frameworks/Python.framework/Versions/3.12/lib/python3.12/site-packages:/Library/Frameworks/Python.framework/Versions/3.12/bin:/usr/local/bin:/Users/robertsuarez/.cache/lm-studio/bin:/opt/homebrew/opt/curl/bin:/Users/robertsuarez/.local/bin:$BUN_INSTALL/bin:$PATH"
export NODE_OPTIONS="--max-old-space-size=8192"

# ---- FZF -----

# Set up fzf key bindings and fuzzy completion
eval "$(fzf --zsh)"

# Use fd instead of fzf
export FZF_DEFAULT_COMMAND="fd --hidden --strip-cwd-prefix --exclude .git"
export FZF_CTRL_T_COMMAND="$FZF_DEFAULT_COMMAND"
export FZF_ALT_C_COMMAND="fd --type=d --hidden --strip-cwd-prefix --exclude .git"

_fzf_compgen_path() {
  fd --hidden --exclude .git . "$1"
}
_fzf_compgen_dir() {
  fd --type=d --hidden --exclude .git . "$1"
}

source ~/fzf-git.sh/fzf-git.sh

# Setup fzf theme
#fg="#CBE0F0"
#bg="#011628"
#bg_highlight="#143652"
#purple="#B388FF"
#blue="#06BCE4"
#cyan="#2CF9ED"

export Fzf_Default_Opts="--color=fg:${fg},bg:${bg},hl:${purple},fg+:${fg},bg+:${bg_highlight},hl+:${purple},info:${blue},prompt:${cyan},pointer:${cyan},marker:${cyan},spinner:${cyan},header:${cyan}"

alias ls="eza --color=always --long --git --icons=always --no-user --sort newest"

# Bat (better cat)
export BAT_THEME=tokyonight_night

show_file_or_dir_preview="if [ -d {} ]; then eza --tree --color=always {} | head -200; else bat -n --color=always --line-range :500 {}; fi"

export FZF_CTRL_T_OPTS="--preview '$show_file_or_dir_preview'"
export FZF_ALT_C_OPTS="--preview 'eza --tree --color=always {} | head -200'"

# Advanced customization of fzf options via _fzf_comprun function
_fzf_comprun() {
  local command=$1
  shift

  case "$command" in
    cd)           fzf --preview 'eza --tree --color=always {} | head -200' "$@" ;;
    export|unset) fzf --preview "eval 'echo ${}'"         "$@" ;;
    ssh)          fzf --preview 'dig {}'                   "$@" ;;
    *)            fzf --preview 'bat -n --color=always --line-range :500 {}' "$@" ;;esac
}

# Initialize plugins and settings in parallel using background function if supported
background() {
  [[ ! -z "$1" ]] && eval "$1" &
}

background 'eval "$(conda "shell.$(basename "${SHELL}")" hook)"'
background 'eval $(thefuck --alias fk)'

# Zoxide (better cd)
eval "$(zoxide init zsh)"

# Initialize Atuin
eval "$(atuin init zsh)"

# To customize prompt, run `p10k configure` or edit ~/.p10k.zsh.
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh

# History setup
HISTFILE=$HOME/.zhistory
SAVEHIST=100000
HISTSIZE=9999
setopt share_history
setopt hist_expire_dups_first
setopt hist_ignore_dups
setopt hist_verify

# Completion using arrow keys (based on history)
bindkey '^[[A' history-search-backward
bindkey '^[[B' history-search-forward

source /opt/homebrew/share/zsh-autosuggestions/zsh-autosuggestions.zsh
source /opt/homebrew/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh

#test -e "${HOME}/.iterm2_shell_integration.zsh" && source "${HOME}/.iterm2_shell_integration.zsh"

# Main theme
ZSH_THEME="powerlevel10k/powerlevel10k"
#ZSH_THEME="jonathan"
# Conditionally load Google Cloud SDK
if [ -f '/Users/robertsuarez/google-cloud-sdk/path.zsh.inc' ]; then . '/Users/robertsuarez/google-cloud-sdk/path.zsh.inc'; fi
if [ -f '/Users/robertsuarez/google-cloud-sdk/completion.zsh.inc' ]; then . '/Users/robertsuarez/google-cloud-sdk/completion.zsh.inc'; fi

# Alias to reload .zshrc
alias reload='source ~/.zshrc'

# Bind Ctrl + R to reload .zshrc
bindkey -s '^r' 'source ~/.zshrc\n'

# Conda initialization
if [ -f "/opt/homebrew/Caskroom/miniconda/base/etc/profile.d/conda.sh" ]; then
    . "/opt/homebrew/Caskroom/miniconda/base/etc/profile.d/conda.sh"
else
    export PATH="/opt/homebrew/Caskroom/miniconda/base/bin:$PATH"
fi

# Bun completions
[ -s "/Users/robertsuarez/.bun/_bun" ] && source "/Users/robertsuarez/.bun/_bun"

export BUN_INSTALL="$HOME/.bun"

alias py="python"

# thefuck alias is already set up in the background processes

# Uncomment if you need to source Atuin environment variables
# . "$HOME/.atuin/bin/env"

# Function to unmount and mount OneDrive
fix_onedrive() {
    echo "Unmounting OneDrive..."
    umount ~/OneDrive
    sleep 2
    echo "Mounting OneDrive..."
    mount -t smbfs //robertsuarez@d.docs.live.net/OneDrive ~/OneDrive
    echo "OneDrive has been remounted. Please check if the read-only error is resolved."
}

# Alias for the fix_onedrive function
alias fixonedrive='fix_onedrive'

# Check for and remove any welcome messages from other files
for file in ~/.zprofile ~/.zshenv ~/.zlogin; do
    if [ -f "$file" ]; then
        sed -i '' '/echo.*[Ww]elcome/d' "$file"
    fi
done

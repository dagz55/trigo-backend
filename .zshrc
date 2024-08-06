# Console output
echo "Welcome to Zsh!"

# Enable Powerlevel10k instant prompt. Should stay close to the top of ~/.zshrc.
# Initialization code that may require console input (password prompts, [y/n]
# confirmations, etc.) must go above this block; everything else may go below.
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

# Environment variables
export NODE_OPTIONS="--max-old-space-size=8192"
export BAT_THEME=tokyonight_night
export BUN_INSTALL="$HOME/.bun"
export JAVA_HOME=/usr/local/opt/openjdk@11

# Path exports
export PATH="/usr/local/bin:/Users/robertsuarez/.cache/lm-studio/bin:/opt/homebrew/opt/curl/bin:/Users/robertsuarez/.local/bin:$PATH"
export PATH="$BUN_INSTALL/bin:$PATH"
export PATH="/opt/homebrew/opt/openjdk/bin:$PATH"
export PATH="$JAVA_HOME/bin:$PATH"

# Plugin and tool initializations
eval "$(conda "shell.$(basename "${SHELL}")" hook)"
eval $(thefuck --alias fk)
eval "$(zoxide init zsh)"
eval "$(atuin init zsh)"
eval "$(fzf --zsh)"

# FZF configuration
export FZF_DEFAULT_COMMAND="fd --hidden --strip-cwd-prefix --exclude .git"
export FZF_CTRL_T_COMMAND="$FZF_DEFAULT_COMMAND"
export FZF_ALT_C_COMMAND="fd --type=d --hidden --strip-cwd-prefix --exclude .git"

fg="#CBE0F0"
bg="#011628"
bg_highlight="#143652"
purple="#B388FF"
blue="#06BCE4"
cyan="#2CF9ED"

export FZF_DEFAULT_OPTS="--color=fg:${fg},bg:${bg},hl:${purple},fg+:${fg},bg+:${bg_highlight},hl+:${purple},info:${blue},prompt:${cyan},pointer:${cyan},marker:${cyan},spinner:${cyan},header:${cyan}"

show_file_or_dir_preview="if [ -d {} ]; then eza --tree --color=always {} | head -200; else bat -n --color=always --line-range :500 {}; fi"
export FZF_CTRL_T_OPTS="--preview '$show_file_or_dir_preview'"
export FZF_ALT_C_OPTS="--preview 'eza --tree --color=always {} | head -200'"

# Aliases and custom functions
alias ls="eza --color=always --git --icons=always --no-user --sort newest"
alias reload='source ~/.zshrc'
cat='alias bat'

_fzf_compgen_path() {
  fd --hidden --exclude .git . "$1"
}

_fzf_comprun() {
  local command=$1
  shift

  case "$command" in
    cd)           fzf --preview 'eza --tree --color=always {} | head -200' "$@" ;;
    export|unset) fzf --preview "eval 'echo ${}'"         "$@" ;;
    ssh)          fzf --preview 'dig {}'                   "$@" ;;
    *)            fzf --preview 'bat -n --color=always --line-range :500 {}' "$@" ;;
  esac
}

# Key bindings
bindkey '^[[A' history-search-backward
bindkey '^[[B' history-search-forward
bindkey -s '^r' 'source ~/.zshrc\n'

# Theme and prompt configuration
ZSH_THEME="powerlevel10k/powerlevel10k"
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh
source /opt/homebrew/share/powerlevel10k/powerlevel10k.zsh-theme

# History setup
HISTFILE=$HOME/.zhistory
SAVEHIST=100000
HISTSIZE=9999
setopt share_history
setopt hist_expire_dups_first
setopt hist_ignore_dups
setopt hist_verify

# Conditional sourcing and external tool configurations
source /opt/homebrew/share/zsh-autosuggestions/zsh-autosuggestions.zsh
source /opt/homebrew/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh

test -e "${HOME}/.iterm2_shell_integration.zsh" && source "${HOME}/.iterm2_shell_integration.zsh"

if [ -f '/Users/robertsuarez/google-cloud-sdk/path.zsh.inc' ]; then . '/Users/robertsuarez/google-cloud-sdk/path.zsh.inc'; fi
if [ -f '/Users/robertsuarez/google-cloud-sdk/completion.zsh.inc' ]; then . '/Users/robertsuarez/google-cloud-sdk/completion.zsh.inc'; fi

# conda initialize
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

# bun completions
[ -s "/Users/robertsuarez/.bun/_bun" ] && source "/Users/robertsuarez/.bun/_bun"

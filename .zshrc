# Enable Powerlevel10k instant prompt. Should stay close to the top of ~/.zshrc.
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

# Set PATH variables
export PATH="/Library/Frameworks/Python.framework/Versions/3.12/lib/python3.12/site-packages:/Library/Frameworks/Python.framework/Versions/3.12/bin:/usr/local/bin:/Users/robertsuarez/.cache/lm-studio/bin:/opt/homebrew/opt/curl/bin:/Users/robertsuarez/.local/bin:$BUN_INSTALL/bin:$PATH"
export NODE_OPTIONS="--max-old-space-size=8192"

# FZF setup
export FZF_DEFAULT_COMMAND="fd --hidden --strip-cwd-prefix --exclude .git"
export FZF_CTRL_T_COMMAND="$FZF_DEFAULT_COMMAND"
export FZF_ALT_C_COMMAND="fd --type=d --hidden --strip-cwd-prefix --exclude .git"
export FZF_CTRL_T_OPTS="--preview 'if [ -d {} ]; then eza --tree --color=always {} | head -200; else bat -n --color=always --line-range :500 {}; fi'"
export FZF_ALT_C_OPTS="--preview 'eza --tree --color=always {} | head -200'"

# History setup
HISTFILE=$HOME/.zhistory
SAVEHIST=100000
HISTSIZE=9999
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
[[ ! -f ~/.zshrc_console_output ]] || source ~/.zshrc_console_output
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh
source /opt/homebrew/share/zsh-autosuggestions/zsh-autosuggestions.zsh
source /opt/homebrew/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
[ -s "/Users/robertsuarez/.bun/_bun" ] && source "/Users/robertsuarez/.bun/_bun"

# Load Google Cloud SDK
if [ -f '/Users/robertsuarez/google-cloud-sdk/path.zsh.inc' ]; then . '/Users/robertsuarez/google-cloud-sdk/path.zsh.inc'; fi
if [ -f '/Users/robertsuarez/google-cloud-sdk/completion.zsh.inc' ]; then . '/Users/robertsuarez/google-cloud-sdk/completion.zsh.inc'; fi

# Conda initialization
if [ -f "/opt/homebrew/Caskroom/miniconda/base/etc/profile.d/conda.sh" ]; then
    . "/opt/homebrew/Caskroom/miniconda/base/etc/profile.d/conda.sh"
else
    export PATH="/opt/homebrew/Caskroom/miniconda/base/bin:$PATH"
fi

# Function definitions
fix_onedrive() {
    umount ~/OneDrive
    sleep 2
    mount -t smbfs //robertsuarez@d.docs.live.net/OneDrive ~/OneDrive
}

# Remove welcome messages
for file in ~/.zprofile ~/.zshenv ~/.zlogin; do
    if [ -f "$file" ]; then
        sed -i '' '/echo.*[Ww]elcome/d' "$file"
    fi
done

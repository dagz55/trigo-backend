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
    if [[ ! -d "$gcloud_path" ]]; then
        echo "Google Cloud SDK not found. Installing..."
        curl https://sdk.cloud.google.com | bash -s -- --disable-prompts
    fi
    safe_source "$gcloud_path/path.zsh.inc"
    safe_source "$gcloud_path/completion.zsh.inc"
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

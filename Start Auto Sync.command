#!/bin/zsh
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
cd "$(dirname "$0")" || exit 1
npm run sync:start
printf '\nYou can close this window. Auto-sync runs in the background.\n'
read -r '?Press Enter to close.'

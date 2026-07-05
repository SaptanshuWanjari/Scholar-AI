#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

case "$(uname -s)" in
  Linux)  filter=Linux   ext=tar.gz  ;;
  Darwin) filter=macOS   ext=tar.gz  ;;
  *)      echo "Unsupported OS"; exit 1 ;;
esac

url=$(curl -sL https://api.github.com/repos/SaptanshuWanjari/Scholar-AI/releases/latest \
  | python3 -c "import sys,json;d=json.load(sys.stdin);print(next(a['browser_download_url'] for a in d['assets'] if '$filter' in a['name']))")

echo "Downloading latest release..."
curl -sL "$url" | tar xzf - --strip-components=1

echo "Updating dependencies..."
./setup.sh

echo "Update complete. Run ./start.sh to launch."

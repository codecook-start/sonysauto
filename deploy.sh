#!/bin/bash

sudo apt-get update -y
sudo apt-get install -y curl
curl -fsSL https://bun.sh/install | bash

if screen -list | grep -q "sonysauto"; then
  screen -r sonysauto
else
  screen -S sonysauto
fi

bun i 
bun run build
bun start
#!/bin/bash
souce .env
rsync -avz -e "ssh" ~/code/gerd-site/target/release/personal-site ~/code/gerd-site/static root@$SERVER_IP:~/

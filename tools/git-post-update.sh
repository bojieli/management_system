#!/bin/bash

echo -n "==== BEGIN "
date

cd $(dirname $0)
git pull origin master

port=6088
pid=$(netstat -lntp 2>/dev/null | awk "{if(\$4==\"0.0.0.0:$port\")print \$7}" | awk 'BEGIN{FS="/"}{print $1}')
[ ! -z "$pid" ] && echo "killing pid $pid on port $port" && kill $pid
pkill -f app-runner

nohup ./app-runner.sh >/dev/null 2>&1 &

echo -n "===== END "
date

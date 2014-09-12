#!/bin/bash

echo -n "==== BEGIN "
date

cd $(dirname $0)
git pull origin master

port=8001
pid=$(netstat -lntp 2>/dev/null | awk "{if(\$4==\"0.0.0.0:$port\")print \$7}" | awk 'BEGIN{FS="/"}{print $1}')
[ ! -z "$pid" ] && echo "killing pid $pid on port $port" && kill $pid
pkill -f management-runner

nohup ./management-runner.sh >/dev/null 2>&1 &
echo -n "===== END "
date

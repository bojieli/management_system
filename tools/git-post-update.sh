#!/bin/bash

cd $(dirname $0)
git pull origin master
pkill management-runner
nohup ./management-runner.sh >/dev/null 2>&1 &

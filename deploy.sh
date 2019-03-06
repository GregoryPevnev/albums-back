#!/bin/bash

BUILD_NAME=build.tar.gz

build(){
    rm -rf dist

    /usr/local/bin/npm run build

    tar cfzpv $BUILD_NAME dist/index.js sql json package*.json migrations knexfile.js ecosystem.config.js
}

upload(){
    IP="$2"
    USER="$1"

    scp build.tar.gz $USER@$IP:/tmp/build.tar.gz

    rm $BUILD_NAME
}

config(){
IP="$2"
USER="$1"

ssh -A $USER@$IP << SSH_END

rm -rf ~/app/*
rm -rf ~/data/*
rm -rf /tmp/build

cd /tmp
mkdir build
tar xfvpz build.tar.gz -C build

cd build
mv ./dist/index.js ~/app/index.js
mv ./package*.json ~/app
mv ./ecosystem.config.js ~/app/ecosystem.config.js
mv knexfile.js ~/app/knexfile.js
mv migrations ~/app/migrations
mv sql ~/data/sql
mv json ~/data/json

cd ~/app

npm install --mode=production

~/bin/migrate.sh
~/bin/run.sh

SSH_END
}

[ -z "$REMOTE_IP" ] && { echo "Enter IP-Address to deploy to"; exit 1; }
[ -z "$REMOTE_USER" ] && { echo "Enter Remote-Machine's user"; exit 1; }

build

upload $REMOTE_USER $REMOTE_IP

config $REMOTE_USER $REMOTE_IP

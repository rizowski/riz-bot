#!/bin/bash
docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD";

yarn install
yarn build
rm -rf node_modules

docker build . -t rizowski/riz-bot
docker push rizowski/riz-bot

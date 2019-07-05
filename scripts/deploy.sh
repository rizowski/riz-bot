#!/bin/bash
docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD";

yarn build

docker build . -t rizowski/riz-bot
docker push rizowski/riz-bot

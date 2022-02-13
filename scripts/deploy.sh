#!/bin/bash
docker login -u "$DOCKER_USERNAME"

docker build --no-cache . -t rizowski/riz-bot
docker push rizowski/riz-bot

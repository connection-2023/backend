#!/bin/sh

DOCKER_IMAGE_NAME=server-img

docker system prune -a -f

docker rm -f $(docker ps -qa)

docker build -t ${DOCKER_IMAGE_NAME} . # <--- 프로젝트 루트 경로에 대한 상대경로

docker compose up -d

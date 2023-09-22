FROM node:18-alpine

# Docker container 안의 기본 workdir를 /usr/src/app으로 설정.
WORKDIR /usr/src/app

# 현재 프로젝트의 package.json, package-lock.json을 docker container의 /usr/src/app로 복사.
COPY package*.json ./

COPY prisma ./prisma

RUN npm ci

COPY dist ./dist

COPY .env .

# docker container의 3000번 포트
# EC2 내부에서는 해당 이미지를 사용하는 docker container의 3000번 포트에 접근가>능
EXPOSE 3000

# 이미지가 실행되어 docker container가 되는 시점에 실행될 명령어.
CMD ["npm", "run", "start:prod"]          
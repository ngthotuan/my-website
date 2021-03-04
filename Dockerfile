FROM node:alpine

ENV NODE_ENV=production

RUN mkdir -p /appdata/user-upload && chmod 777 /appdata/user-upload

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY src src

VOLUME /appdata/user-upload
EXPOSE 8080

CMD ["node", "src/bin/www"]

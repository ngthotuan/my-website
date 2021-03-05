FROM node:alpine

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY src src

VOLUME /app/user-upload

EXPOSE 8080

CMD ["node", "src/bin/www"]

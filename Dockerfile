FROM node:alpine

ENV NODE_ENV=production

ENV PORT=3000

ENV DB_HOST=localhost

ENV DB_PORT=27017

ENV DB_NAME=nguyenthotuan_me

ENV DB_USER=admin

ENV DB_PASSWORD=admin

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY src src

VOLUME /app/user-upload

EXPOSE $PORT

CMD ["node", "src/bin/www"]

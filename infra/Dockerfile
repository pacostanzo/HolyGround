FROM node:16

WORKDIR /usr/app

COPY ../package*.json ./

RUN yarn install

COPY . .

EXPOSE 8080
RUN yarn global add nodemon --prefix /usr/local
RUN export PATH="$(yarn global bin):$PATH"


CMD [ "nodemon", "src/index.js" ]
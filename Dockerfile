FROM node:10.22.0-alpine3.9

RUN npm i -g ionic@5.4.9

COPY package.json /app/package.json

RUN cd /app && npm i

COPY . ./app

EXPOSE 8200/tcp

WORKDIR /app

CMD ["npm", "start"]

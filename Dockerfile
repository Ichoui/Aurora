FROM node:10.22.0-alpine3.9

RUN npm i -g @ionic/cli

COPY package.json /app/package.json

RUN cd /app && npm i

COPY . /app/

EXPOSE 8200

VOLUME /app
WORKDIR /app

CMD ["npm", "start"]

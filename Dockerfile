FROM node:10.22.0-alpine3.9

RUN npm i -g @ionic/cli

WORKDIR /app
COPY . /app/

RUN npm i

EXPOSE 49153

CMD ["npm", "start"]

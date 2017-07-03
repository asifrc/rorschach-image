FROM node:8.1-alpine

RUN apk add --update imagemagick && \
    rm -rf /var/cache/apk/*

RUN mkdir /app
WORKDIR /app

COPY package.json /app
RUN npm install

COPY . /app

EXPOSE 3000

ENTRYPOINT ["npm"]
CMD ["start"]

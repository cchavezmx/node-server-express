# NODE SERVER

## Descripción

Creando nuestro porpio servidor con NodeJS y Express para sitio web, conectado a una base de datos postgresql en raiway.app y desplegado en Docket de manera local.

## Documentación

- [PG Pool](https://node-postgres.com/apis/pool)
- [NodeJS Docker](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

```bash
docker build --no-cache -t cchavez/node-web-app .
docker run -p 3000 cchavez/node-web-app
```

### Dockerfile

```Dockefile
FROM node:16

# Create app directory
WORKDIR /usr/src/app


# environment variables
ENV  DB_USER
ENV  DB_HOST
ENV  DB_DATABASE
ENV  DB_PORT
ENV  DB_PASSWORD

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "node", "server.js" ]
```

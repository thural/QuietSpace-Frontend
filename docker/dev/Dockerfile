FROM node:20-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 5000

CMD [ "npm", "run", "dev" ]

ENV VITE_KEYCLOAK_URL=undefined
ENV VITE_KEYCLOAK_REALM=undefined
ENV VITE_KEYCLOAK_CLIENT=undefined
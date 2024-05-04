FROM node:20-alpine as builder

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build



FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app/public /usr/share/nginx/html

EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]
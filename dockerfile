FROM node:20.18.0 as builder

WORKDIR /app

COPY . .

RUN npm install 

RUN npm run build

FROM node:latest 

COPY --from=builder /app/dist /app/dist

RUN npm i -g serve

EXPOSE 3000

CMD ["serve", "-s", "/app/dist", "-l", "3000"]
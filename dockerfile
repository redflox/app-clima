FROM node:20.18.0 as builder

WORKDIR /app

COPY . .

RUN npm install 

RUN npm run build

FROM node:latest 

COPY --from=builder /app/dist /app/dist

RUN npm i -g serve

EXPOSE 5173

CMD ["serve", "-s", "build"]
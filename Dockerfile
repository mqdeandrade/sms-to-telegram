FROM node:24-alpine

WORKDIR /app

COPY --chown=node:node package*.json ./

RUN npm install --production

COPY --chown=node:node index.js ./

RUN chown -R node:node /app

EXPOSE 3000

USER node

CMD ["npm", "start"]

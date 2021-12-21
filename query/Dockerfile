FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
COPY .env ./ 
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 7000
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]

FROM node:16.13.2

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json ./

# RUN npm install -g yarn

RUN npm install node-sass --sass-binary-name=linux-x64-83
RUN yarn
COPY . .
RUN yarn build
CMD ["yarn start"]



EXPOSE 3000
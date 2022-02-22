FROM node:14.17.0
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json ./

# RUN npm install -g yarn

RUN npm install node-sass --sass-binary-name=linux-x64-83
RUN yarn
COPY . .
RUN yarn build
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT 3000


EXPOSE 3000
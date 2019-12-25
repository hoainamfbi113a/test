FROM node:12.13.0-alpine3.10
RUN apk add --no-cache openssh-client git
RUN mkdir /app
WORKDIR /app
COPY package*.json ./
COPY id_rsa /root/.ssh/
RUN chmod 600 /root/.ssh/id_rsa
RUN ssh-agent /bin/sh -c 'ssh-add /root/.ssh/id_rsa'
RUN echo -e "\nStrictHostKeyChecking no" >> /root/.ssh/config
COPY . .
RUN yarn install
RUN yarn build && npm prune --production
CMD ["npm", "start"]

# Base image
FROM node:12

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json /app
COPY yarn.lock /app

RUN yarn install

# Bundle app source
COPY . /app

# Expose port 3000
EXPOSE 3000

# Build application
RUN yarn build

# Start the project
CMD ["yarn", "start"]

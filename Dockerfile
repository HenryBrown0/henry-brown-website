# Base image
FROM node:12

# Create app directory
WORKDIR /app
RUN mkdir -p dist/static/styles

# Install app dependencies
COPY package.json /app
COPY yarn.lock /app

RUN yarn install

# Bundle app source
COPY . /app

# Expose port 3000
EXPOSE 3000

# Start the project
CMD ["yarn", "start"]

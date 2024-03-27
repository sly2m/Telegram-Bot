# Use Alpine Linux as base image
FROM alpine:latest

# Set the working directory in the Docker image to /app
WORKDIR /app

# Install curl, bash and Node.js
RUN apk update && \
    apk add --no-cache curl bash nodejs npm

# Copy package.json and package-lock.json into the image
COPY package*.json ./

# Install any project dependencies
RUN npm install

# Add port forwarding
EXPOSE 3000

# Copy the rest of your project's source code into the image
COPY . .

# Define the command to run your app
CMD [ "node", "index.js" ]
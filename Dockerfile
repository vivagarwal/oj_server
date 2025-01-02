# Use the Node.js 18 Alpine image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /server

# Copy only the package.json and package-lock.json files and install dependencies.
COPY package*.json ./
RUN npm install

# Copy the rest of the application code.
COPY . .

EXPOSE 8080

# Specify the command to run when the container starts
CMD [ "node", "index.js" ]
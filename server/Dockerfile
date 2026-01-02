# 1. Use the official Node.js image (lightweight version)
FROM node:20-alpine

# 2. Set the working directory inside the container
WORKDIR /usr/src/app

# 3. Copy package files first (for faster installs)
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of your code
COPY . .

# 6. Expose the port (Cloud Run defaults to 8080)
EXPOSE 8080

# 7. Start the server
CMD [ "node", "index.js" ]
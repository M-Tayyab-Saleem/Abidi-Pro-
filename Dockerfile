# 1. Use an official Node.js runtime as the base image
FROM node:22

# 2. Set the working directory inside the container
WORKDIR /usr/src/app

# 3. Copy package.json and package-lock.json (for faster rebuilds)
COPY package*.json ./

# 4. Install dependencies inside the container
RUN npm install --force


# 5. Copy the rest of your app files into the container
COPY . .

# 6. Expose the port your app will run on (make sure to use your app's port)
EXPOSE 3000

# 7. Set the command to run your app
CMD ["npm", "start"]

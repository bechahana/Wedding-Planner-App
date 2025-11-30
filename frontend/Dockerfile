FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Copy the already built React app into Nginx html folder
COPY build ./

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

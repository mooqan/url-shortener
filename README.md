## Description

URL Denzel shortener - a link shortener that makes long URLs shorter with fewer characters than the original link, you can also generate QR codes.

## Getting started
Download Docker Desktop for [Mac](https://desktop.docker.com/mac/main/amd64/Docker.dmg?utm_source=docker&utm_medium=webreferral&utm_campaign=dd-smartbutton&utm_location=module) , [Linux](https://docs.docker.com/desktop/linux/install/) and [Windows](https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe?utm_source=docker&utm_medium=webreferral&utm_campaign=dd-smartbutton&utm_location=header). Docker Compose will be automatically installed. 


Create ".env" file and fill it with these lines:
 ```
JWT_SECRET=your_jwt_secret
DB_HOST='your_host'
DB_PORT=your_port
DB_USERNAME='your_username'
DB_PASSWORD='your_password'
DB_NAME='your_db'
```
Then
```
  docker compose up -d –build
```

## Shortening the new link

Go to the ```http://localhost:3001/api``` and use /shorten route to shorten a link

```
 {
  "originalUrl": "https://google.com",
  "title": "Google"
}
```

Here's the response:

```
{"shortUrl":"FJLrUJ"}
```

Open a web browser and visit ```http://localhost:3001/shorten/FJLrUJ``` to access the official Google website.
# Telegram clone ( backend )
---
## Basic installation

##### 1. Install all dependencies
```shell
$ npm install
```

##### 2. Create default config file in config directory of this project
###### terminal
```shell
$ mkdir config
$ cd config
config$ cat > default.json
```
###### config/default.json
```json
{
  "server": {
    "port": 9000,
    "staticPath": "../frontend/build"
  },

  "mongodb": {
    "url": "mongodb+srv://LOGIN:PASSWORD@cluster0.n08kt.mongodb.net/telegram?retryWrites=true&w=majority"
  },

  "jwt": {
    "secret": "your secret code goes here"
  },

  "cors": {
    "origin": "http://localhost"
  }
}
```
###### Notes
  * staticPath - Optional. If not used then server doesn't serve static files  
  * mongodb.url - You need database created on [mongodb.com](https://www.mongodb.com/)

## Start

###### start using nodemon
```shell
$ npm run dev
```

###### start using node
```shell
$ node server.js
```
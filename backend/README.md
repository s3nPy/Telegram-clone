# Telegram clone ( backend )

## Basic installation

##### 1. Install all dependencies
```shell
$ npm install
```

##### 2. Create default config file in config directory of this project
```shell
$ mkdir config
$ cd config
config$ cat > default.json
```

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
    "secret": "ins4n31y s3cr3t c0d3"
  },

  "cors": {
    "origin": "http://localhost"
  }
}
```

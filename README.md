# CroCoMap - Crowdsources Corona Map
This repository contains CroCoMap, the Crowdsourced Corona Map platform designed and implemented for Crowd Computing 2020 at Delft Univerity of Technology by Group 2.

## Before installing
For this project to run, you will need a Google cloud API keys with the following enabled:
 - Google Maps Javascript API
 - Google Street View Static API

[Request them here](https://console.cloud.google.com/home/dashboard?project=chromatic-being-277118) (requires billing enabled by default). For the Street View Static API, you have to turn off signatures via the credentials page of the key. **Thus, be very careful with your key, do not include it in your repository or other public files.**

Create a file in the root folder names ```.env.local``` with as content:
```
VUE_APP_API_KEY=YOUR_API_KEY_HERE
```
In the file, replace ```YOUR_API_KEY_HERE``` with your API key. Then continue with the following steps.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

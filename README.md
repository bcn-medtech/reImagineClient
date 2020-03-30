
# ReImagine client

A simple electron app to anonimize and upload medical data

## Requirements
 * Node >= 8.2.0

## Installing
Clone the repo:

Then install dependencies and run the project

```bash
$ npm i
$ npm start
```

## Packaging the app
1. `npm run build`
2. `npm run pack`
3. `npm run dist`

Your app will packaged as an .exe in the dist folder using the [electron-builder](https://github.com/electron-userland/electron-builder) package. Edit the build section of the package.json to build on additional platforms.



# Funcionalidad api
Esta implementada con express y has 2 endpoints declarados en el archivo things.js dentro de src. Funciona en desarrollo ya que se ejecuta el localhost pero en produccion no.


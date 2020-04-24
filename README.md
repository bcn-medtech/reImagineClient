# ReImagine client

An electron-react app to anonimize and upload medical data for online processing

## Requirements
 * Node >= 10.0

## Installing
Clone the repo:

Then install dependencies and run the project

```bash
$ yarn
$ yarn electron-dev
```

## Packaging the app
1. For windows and linux: `yarn electron-pack`
2. For mac: `yarn electron-pack-mac`

Your app will packaged in the dist folder using the [electron-builder](https://github.com/electron-userland/electron-builder) package. 

## Functionality

We create a conda environment with python3 and gdcm to anonimize the images. We can upload on S3, minio or any other compatible server 


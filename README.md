# ez.chat frontend

[![Requirements](https://img.shields.io/badge/requires-Node.js%206%2B-brightgreen.svg?style=popout&logo=node.js)](https://nodejs.org/en/download/) [![Uses](https://img.shields.io/badge/uses-React%2016-61dafb.svg?style=flat&logo=react)](https://reactjs.org)

The front end for ez.chat, built with Next.js, TypeScript and React.

## Setup

Assuming yarn and Node.js 8+ is installed and in PATH, run `yarn` to install required dependencies.

To start the project, run `yarn dev`. In production, run `yarn build` to build minified assets and bundles followed by `yarn start` to start the production server.

## Configuration

Create a `config.json` in the top level of the project and then add the following content:

```json
{
  "ip": "<insert absolute (with http) IP to the chat server here>"
}
```

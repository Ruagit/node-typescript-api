# Node TypeScript API

- [Development Environment Setup](#setup)

## Setup

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/): Ensure that Node.js, preferably version 16 or higher, is installed on your system, as this project utilizes the latest versions of TypeScript and Nodemon.
- [npm](https://www.npmjs.com/): npm is the package manager for Node.js and comes with the Node.js installation.

### Installation

Install the dependencies:

```
npm i
```

### Usage

In development the following command will start the server and use `nodemon` to auto-reload the server based on file changes

```
npm run dev
```

The server will start at `http://localhost:3000` by default. You can change the port in `src/index.ts`

There are no tests in the project at the moment, but a command is available to run:

```
npm run test
```

There are also commands to build and start a server without nodemon:

```
npm run build
npm start
```

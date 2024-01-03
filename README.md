# Express-TS-TypeORM Server Boilerplate

This is a boilerplate for creating a server with express, typescript and typeorm. It is configured to work with mysql/mariadb. I have also added eslint and prettier settings for code formatting. You can use this boilerplate to create a server for your project.

I have created a user entity and 3 API endpoints about user entity. These 3 APIs have no functional purpose. The purpose of these APIs is only to show how to create an API and how to use typeorm, express and typescript together.

Additionally, I have added a middleware to handle errors and custom errors in `src/util` directory. You can use this middleware to handle errors in your project. You can also remove this middleware if you want.

# Project Setup

## Database

Default DBMS is mysql/mariadb. Install mysql/mariadb and create database with the name you want. If you want to use another DBMS, you can change the `dataSource.ts` file in the `src/config` directory.

## Environment Variable

If you are in development mode, create a `.env.dev` file in the root directory of the project and add the following variables:

```
CLIENT_URL=http://localhost:4000

PORT=3000 # port on which the server will listen

DB_HOST=localhost # host(ip) of the database
DB_PORT=3306 # port of the database
DB_USER=root # username of the database
DB_PASSWORD=pwd # password of the database
DB_NAME=kubid # name of the database, which you created in the previous step
```

If you are in production mode, create a `.env.prod` file in the root directory of the project and add the above configuration variables with the appropriate values.

## Execution

Execute the following commands in the root directory of the project to run the server according to the mode you want.

### Development Mode

```bash
npm install
npm run dev
```

### Production Mode

```bash
npm install
npm run build
npm run prod
```

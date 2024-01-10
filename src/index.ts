import cors from 'cors';
import express from 'express';
import 'reflect-metadata';
import AppDataSource from './config/dataSource';
import './config/env';
import router from './controller/router';
import errorHandler from './util/errorHandler';
import passport from 'passport';
import { passportConfigFunc } from './passport';
// swagger UI 관련 설정
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../swagger-output.json');
const PORT = Number(process.env.PORT) || 3000;

const app = express();

AppDataSource.initialize().then(() => console.log('DATABASE is connected!'));

app.use(cors({ origin: process.env.CLIENT_URL, credentials: false })); // cookie를 전달하고 싶을 때는 credential을 true로 해줘야 함
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.use(errorHandler);

// passport.js 관련 설정
app.use(passport.initialize());
passportConfigFunc();

// swagger UI 관련 설정
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile)); // docs 대신 swagger로 수정한다.
app.listen(PORT, () => console.log(`Server is started!`));

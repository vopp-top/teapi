import express from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { chatRouter } from './routes/chat'
import SimpleNodeLogger from 'simple-node-logger';

export const app = express();

export const log = SimpleNodeLogger.createSimpleLogger({
    logFilePath: 'logs.log',
    timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS'
});

const chatLimiter = rateLimit({
    windowMs: 5000,
    max: 1,
    message: { error: 'Too many requests in one second.' }
});

app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200
}));
app.set('json spaces', 2);

app.use('/chat', chatRouter, chatLimiter);

app.get('/', (request, response) => {
    response.status(200).json({ version: process.env.npm_package_version });
});
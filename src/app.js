import express from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import SimpleNodeLogger from 'simple-node-logger';
import { userRouter, groupsRouter, honorsRouter, videosRouter, count } from './routes'

export const app = express();

export const log = SimpleNodeLogger.createSimpleLogger({
    logFilePath: 'logs.log',
    timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS'
});

const chatLimiter = rateLimit({
    windowMs: 5000,
    max: 1,
    message: { error: 'Too many requests in 5 second.' }
});
const globalLimiter = rateLimit({
    windowMs: 1000,
    max: 3,
    message: { error: 'Too many requests in one second.' }
});

app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200
}));
app.use(express.static('public'));
app.set('json spaces', 2);
app.set('trust proxy', 1);

app.all('*', count);

app.use('/chat', userRouter, chatLimiter);
app.use('/groupBadges', groupsRouter, globalLimiter);
app.use('/honors', honorsRouter, globalLimiter);
app.use('/videos', videosRouter, globalLimiter);

app.get('/', (request, response) => {
    response.status(200).json({ version: process.env.npm_package_version });
});
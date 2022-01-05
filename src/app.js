import express from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';

export const app = express();

const limiter = rateLimit({
    windowMs: 1000,
    max: 5,
    message: { error: 'Too many requests in one second.' }
});

app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200
}));

app.use(limiter);

app.set('json spaces', 2)

app.get('/', (request, response) => {
    response.status(200).json({ version: process.env.npm_package_version });
});
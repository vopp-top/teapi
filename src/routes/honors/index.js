import express from 'express';
import fs from 'fs';

export const honorsRouter = express.Router();

const json = JSON.parse(fs.readFileSync('data/honors.json'));

honorsRouter.get('/', async (request, response) => {
    response.status(200).json(json);
});
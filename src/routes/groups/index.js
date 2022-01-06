import express from 'express';
import fs from 'fs';

export const groupsRouter = express.Router();

const json = JSON.parse(fs.readFileSync('data/groups.json'));

groupsRouter.get('/', async (request, response) => {
    response.status(200).json(json);
});
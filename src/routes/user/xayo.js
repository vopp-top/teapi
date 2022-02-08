import express from 'express';
import fetch from 'node-fetch';

export const xayoRouter = express.Router();

xayoRouter.get('/:name', async (request, response) => {
    const name = request.params.name;
    const data = await fetch(`https://xayo.pl/api/watchtime/${name}`);
    const json = await data.json();
    response.status(200).json(json);
});
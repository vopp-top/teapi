import express from 'express';
import fetch from 'node-fetch';
import { client } from '../../server'

export const videoRouter = express.Router();

videoRouter.get('/:id', async (request, response) => {
    const id = request.params.id;
    let video = await client.get(`teapi.video.${id}`);
    if(!video) videos = await getVideo(id);
    else video = JSON.parse(video);
    response.status(200).json(video);
});

async function getVideo(id) {
    const data = await fetch(`https://api.twitch.tv/helix/videos?id=${id}`, {
        headers: {
            'Authorization': `Bearer ${process.env.TWITCH_TOKEN}`,
            'Client-Id': process.env.TWITCH_ID
        }
    });
    const json = await data.json();
    if(data.status !== 400) {
        client.setEx(`teapi.video.${id}`, 300, JSON.stringify(json));
    }
    return json;
}
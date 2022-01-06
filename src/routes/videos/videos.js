import express from 'express';
import fetch from 'node-fetch';
import { client } from '../../server'
import { log } from '../../app';

export const videosRouter = express.Router();

videosRouter.get('/:id', async (request, response) => {
    const id = request.params.id;
    let videos = await client.get(`teapi.videos.${id}`);
    if(!videos) videos = await getVideos(id);
    else videos = JSON.parse(videos);
    response.status(200).json(videos);
});

async function getVideos(id) {
    const data = await fetch(`https://api.twitch.tv/helix/videos?user_id=${id}&type=archive&first=100`, {
        headers: {
            'Authorization': `Bearer ${process.env.TWITCH_TOKEN}`,
            'Client-Id': process.env.TWITCH_ID
        }
    });
    const json = await data.json();
    if(data.status !== 400) {
        client.setEx(`teapi.videos.${id}`, 600, JSON.stringify(json));
        log.info(`Saving new videos: ${id}.`);
    }
    return json;
}
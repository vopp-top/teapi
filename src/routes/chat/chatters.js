import express from 'express';
import { client } from '../../server'

export const chattersRouter = express.Router();

chattersRouter.get('/:channel', async (request, response) => {
    const chatters = await getChatters(request.params.channel);
    if(!chatters) return response.status(404).json([]);
    else if(chatters.length < 1) return response.status(404).json([]);
    return response.status(200).json(await findChatters(chatters));
});

async function getChatters(channel) {
    await client.zRemRangeByScore(`teapi.chatters.${channel}`, '-inf', Date.now() - 300000);
    return await client.zRange(`teapi.chatters.${channel}`, 0, -1, { LIMIT: 1000 });
}

async function findChatters(chatters) {
    const users = [];
    for(const name of chatters) {
        const user = await client.get(`teapi.chat.${name}`);
        if(user) users.push(JSON.parse(user));
    }
    return users;
}

export async function addChatter(name, channel) {
    client.zAdd(`teapi.chatters.${channel}`, { score: Date.now(), value: name });
}


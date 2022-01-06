import express from 'express';
import fetch from 'node-fetch';
import { client } from '../../server'
import { log } from '../../app';

export const chatRouter = express.Router();

chatRouter.get('/:name', async (request, response) => {
    const users = [];
    const names = request.params.name.split(',');
    const toFind = [];
    for(const name of names) {
        const user = await client.get(`teapi.chat.${name}`);
        if(!user) toFind.push(name);
        else users.push(JSON.parse(user));
    }
    Array.prototype.push.apply(users, await findUsers(toFind));
    response.status(200).json(users);
});

async function findUsers(names) {
    const data = await fetch(`https://vislaud.com/api/chatters?logins=${names.join(',')}`);
    const json = await data.json();
    for(const user of json) {
        client.setEx(`teapi.chat.${user.login}`, 10, JSON.stringify(user));
        log.info(`Saving new user: ${user.login}.`);
    }
    return json;
}
import express from 'express';
import fetch from 'node-fetch';
import { client } from '../../server'
import { log } from '../../app';

export const userRouter = express.Router();

userRouter.get('/:name', async (request, response) => {
    const names = request.params.name.split(',').slice(0, 100);
    const users = [];
    const toFind = [];
    for(const name of names) {
        const user = await client.get(`teapi.chat.${name}`);
        if(!user) toFind.push(name);
        else users.push(JSON.parse(user));
    }
    const foundUsers = await findUsers(toFind);
    users.push(...foundUsers);
    response.status(200).json(users);
});

async function findUsers(names) {
    try {
        const data = await fetchWithTimeout(`https://vislaud.com/api/chatters?logins=${names.join(',')}`, {
            timeout: 10000
        });
        const json = await data.json();
        for(const user of json) {
            client.setEx(`teapi.chat.${user.login}`, 300, JSON.stringify(user));
            log.info(`Saving new user: ${user.login}.`);
        }
        return json;
    } catch(error) {
        log.error('Fetch was aborted (vislaud down).')
    }
    return [];
}

async function fetchWithTimeout(resource, options = {}) {
    const { timeout = 8000 } = options;
    
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal  
    });
    clearTimeout(id);
    return response;
}
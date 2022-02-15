import express from 'express';
import fetch from 'node-fetch';
import { client } from '../../server'
import { log } from '../../app';
import { addChatter } from './chatters'

export const userRouter = express.Router();

let timeouts = 0;
const traffic = {
    stop: false,
    time: 0
}

userRouter.get('/:name', async (request, response) => {
    if(traffic.stop) {
        if(traffic.time >= Date.now()) return response.status(503).json([]);
        traffic.stop = false;
    }
    const names = request.params.name.split(',').slice(0, 100);
    const users = [];
    const toFind = [];
    for(const name of names) {
        const user = await client.get(`teapi.chat.${name}`);
        if(!user) toFind.push(name);
        else users.push(JSON.parse(user));
    }
    const foundUsers = await findUsers(toFind, request.query.channel);
    users.push(...foundUsers);
    response.status(200).json(users);
});

async function findUsers(names, channel) {
    try {
        const data = await fetchWithTimeout(`https://vislaud.com/api/chatters?logins=${names.join(',')}`, {}, 10000);
        const json = await data.json();
        const users = [];
        for(const user of json) {
            user.watchtimes.sort((a, b) => {
                return b.watchtime - a.watchtime;
            });
            const streamer = user.watchtimes[0].streamer;
            if(!streamer) return [];
            const newUser = {
                login: user.login,
                watchtimes: [
                    {
                        watchtime: user.watchtimes[0].watchtime,
                        streamer: {
                            displayName: streamer.displayName,
                            profileImageUrl: streamer.profileImageUrl
                        }
                    }
                ]
            }
            users.push(newUser);
            client.setEx(`teapi.chat.${newUser.login}`, 300, JSON.stringify(newUser));
            if(channel) addChatter(newUser.login, channel)
        }
        return users;
    } catch(error) {
        log.error(`Fetch was aborted (${error.message}).`);
        if(++timeouts > 25) {
            timeouts = 0;
            traffic.stop = true;
            traffic.time = Date.now() + 60000;
            log.info('Stopping traffic for vislaud.');
        }
    }
    return [];
}

async function fetchWithTimeout(url, options, timeout = 7000) {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), timeout)
        )
    ]);
}

setInterval(() => {
    if(timeouts > 0) log.info('Reseting timeouts counter.');
    timeouts = 0;
}, 15000);
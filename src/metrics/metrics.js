import { log } from '../app.js';

let stats = {
    request_time: {
        count: 0,
        time: 0
    },
    requets: 0
}

export function measure(req, res, next) {
    next();
    stats.requets++;
    const start = process.hrtime();
    res.on('finish', () => {
        stats.request_time.count++;
        stats.request_time.time += getDurationInMilliseconds(start);
    });
    console.log(stats);
}

function getDurationInMilliseconds(start) {
    const NS_PER_SEC = 1e9;
    const NS_TO_MS = 1e6;
    const diff = process.hrtime(start);
    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
}

setInterval(() => {
    const ms = (stats.request_time.time / stats.request_time.count).toFixed(2) || 0;
    log.info(`Total requests: ${stats.requets} (${(stats.requets / 60).toFixed(2)} requests per sec)`);
    log.info(`Request time: ${ms}ms`);
    stats = {
        request_time: {
            count: 0,
            time: 0
        },
        requets: 0
    };
}, 60000);
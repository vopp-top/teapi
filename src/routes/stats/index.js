import { log } from '../../app';

let perMinute = 0;

export function count(request, response, next) {
    next();
    perMinute++;
}

setInterval(() => {
    log.info(`Requests per minute: ${perMinute}`);
    perMinute = 0;
}, 60000);
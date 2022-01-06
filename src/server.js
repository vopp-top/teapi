import { app } from './app';
import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

export const client = await createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
});
await client.connect();

app.listen(7773, () => console.log(`🚀 teapi ${process.env.npm_package_version} / PORT: 7773`));
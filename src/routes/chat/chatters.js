import express from 'express';
import fetch from 'node-fetch';
import { client } from '../../server'
import { log } from '../../app';

export const chattersRouter = express.Router();

chattersRouter.get('/:name', async (request, response) => {

});
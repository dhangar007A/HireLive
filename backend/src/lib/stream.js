import {StreamChat} from 'stream-chat';
import {StreamClient} from '@stream-io/node-sdk';
import {ENV} from './env.js';

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET; 

if(!apiKey || !apiSecret) {
    throw new Error("Stream API key and secret are required");
}

export const chatClient = StreamChat.getInstance(apiKey, apiSecret); // this is for chat
export const streamClient = new StreamClient(apiKey, apiSecret); // this is for video calls

export const upsertStreamUser = async (userData) => {
    try{
        await chatClient.upsertUser(userData);
        console.log(`Stream user upserted: ${userData.id}`);
    } catch(err) {
        console.error(`Failed to upsert Stream user: ${err.message}`);
    }
} 

export const deleteStreamUser = async (userId) => {
    try{
        await chatClient.deleteUser(userId);    
    } catch(err) {
        console.error(`Failed to delete Stream user: ${err.message}`);
    }   
}

 
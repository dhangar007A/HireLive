import { chatClient ,streamClient } from '../lib/stream.js';
import Session from '../models/Session.js';

export async function createSession(req, res) {
    try{
        const {problem, difficulty} = req.body;
        const userId = req.user.id;
        const clerkId = req.user.clerkId;

        if(!problem || !difficulty) {
            return res.status(400).json({msg: "Problem and difficulty are required"});
        }

        // generate unique callId for stream video 
        const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

        // create session in DB
        const session = await Session.create({
            problem,
            difficulty,
            host: userId,
            callId
        });

        // create stream video call
        await streamClient.video.call("default", callId).getOrCreate({
            data: {
                created_by_id: clerkId,
                custom : {problem, difficulty, sessionId: session._id.toString()},
            }
        });

        // chat messaging
        const channel = chatClient.channel("messaging", callId, {
            name: `${problem} Session` ,
            created_by_id : clerkId,
            members: [clerkId],
        })

        await channel.create();
        // in future, i will send invitation to participant here
        return res.status(201).json({session});
    }
    catch(err){
        console.error(`Failed to create session: ${err.message}`);
        return res.status(500).json({msg: "Server error"});
    }
}

export async function getActiveSessions(_, res) {
    try{
        const sessions = await Session.find({status: 'active'})
        .populate('host', 'name profileImage email clerkId')
        .sort({createdAt: -1})
        .limit(20);
        res.status(200).json({sessions});
    }
    catch(err){
        console.error(`Failed to get active sessions: ${err.message}`);
        res.status(500).json({msg: "Server error"});
    }
}

export async function getMyRecentSessions(req, res) {
    try{
        const userId = req.user.id;
        const sessions = await Session.find({
            status: 'completed',
            $or: [
                {host: userId}, 
                {participant: userId}
            ]
        }).
        sort({createdAt: -1}).limit(20);
        res.status(200).json({sessions});
    }
    catch(err){
        console.error(`Failed to get recent sessions: ${err.message}`);
        res.status(500).json({msg: "Server error"});
    }
}

export async function getSessionById(req, res) {
    try{
        const sessionId = req.params;

        const session = await Session.findById(sessionId)
        .populate('host', 'name profileImage email clerkId')
        .populate('participant', 'name profileImage email clerkId');

        if(!session) {
            return res.status(404).json({msg: "Session not found"});
        }
        res.status(200).json({session});    
    }
    catch(err){
        console.error(`Failed to get session by id: ${err.message}`);
        res.status(500).json({msg: "Server error"});
    }
}

export async function joinSession(req, res) {
    try{
        const {id} = req.params;
        const userId = req.user.id;
        const clerkId = req.user.clerkId;

        const session = await Session.findById(id);

        if(!session) {
            return res.status(404).json({msg: "Session not found"});
        }

        if(session.status !== 'active') {
            return res.status(400).json({msg: "Session is not active"});
        }

        if(session.host.toString() === userId.toString()) {
            return res.status(400).json({msg: "Host cannot join their own session as participant"});
        }

        // check if session is already full- has a participant
        if(session.participant) {
            return res.status(409).json({msg: "Session is already full"});
        }

        session.participant = userId;
        await session.save();

        const channel = chatClient.channel("messaging", session.callId);
        await channel.addMembers([clerkId]);

        res.status(200).json({msg: "Joined session successfully"});
    }
    catch(err){
        console.error(`Failed to join session: ${err.message}`);
        res.status(500).json({msg: "Server error"});        
    }
}  

export async function endSession(req, res) {
    try{
        const {id} = req.params;
        const userId = req.user.id;

        const session = await Session.findById(id);

        if(!session) {
            return res.status(404).json({msg: "Session not found"});
        }

        // only host can end the session
        if(session.host.toString() !== userId) {
            return res.status(403).json({msg: "Only host can end the session"});
        }

        
        // delete stream video call and chat channel
        const call = streamClient.video.call("default", session.callId);
        await call.delete({hard: true}); 
        
        const channel = chatClient.channel("messaging", session.callId);
        await channel.delete();
        res.status(200).json({msg: "Session ended successfully"});

        
        session.status = 'completed';
        await session.save();
    }
    catch(err){
        console.error(`Failed to end session: ${err.message}`);
        res.status(500).json({msg: "Server error"});
    }
}

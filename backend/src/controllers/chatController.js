import { chatClient} from "../lib/stream.js";

export async function getStreamToken(req, res) {
    try{
        // use clerkid for stream (not mongodb _id) => it should mathc the id we have in the stream dashboard
        const token = chatClient.createToken(req.user.clerkId);

        res.status(200).json({
            token,
            userId: req.user.clerkId,
            userName: req.user.name,
            userImage: req.user.profileImage
        });
    }
    catch(err){
        console.error("Error generating Stream token:", err);
        res.status(500).json({ error: "Failed to generate Stream token" });
    }
}

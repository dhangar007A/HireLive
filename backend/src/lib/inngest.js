import {Inngest} from 'inngest';
import {connectDB} from './db.js';
import User from '../models/User.js';
import { deleteStreamUser } from './stream.js';

//create a client to send and receive inngest events
export const inngest = new Inngest({ id: 'Abhi-HireLive' });

const syncUser = inngest.createFunction(
    {id: "sync/user" },
    {event: "clerk/user.created"},
    async ({event}) => {
        await connectDB();
        const {id, email_addresses, first_name, last_name ,image_url} = event.data;

        const newUser = new User({
            name: `${first_name || ""} ${last_name || ""}`,
            email: email_addresses[0]?.email_address,
            profileImage: image_url,
            clerkId: id,
        });

        await User.create(newUser);

        await upsertStreamUser({
            id: newUser.clerkId.toString(),
            name: newUser.name,
            image: newUser.profileImage,
        });

        // do sth ltr
    }
)

const deleteUserFromDB = inngest.createFunction(
    {id: "delete-user-from-db" },
    {event: "clerk/user.deleted"},
    async ({event}) => {
        await connectDB();
        const {id} = event.data;

        await User.deleteOne({clerkId: id});

        await deleteStreamUser(id.toString()); 
        // do sth ltr
    }
)

export const functions = [ syncUser, deleteUserFromDB ];
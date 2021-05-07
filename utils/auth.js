import { initDatabase, serializeDocument } from "./mongodb";
import crypto from 'crypto';

export async function createAuth(session, redirectOrigin) {
    const client = await initDatabase();
    const auth = client.collection("auth");

    const authObject = {
        state: crypto.randomBytes(32).toString('hex'),
        session: session,
        redirectOrigin: redirectOrigin
    };

    return await auth.insertOne(authObject);
}

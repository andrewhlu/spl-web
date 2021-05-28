import { ObjectId } from "mongodb";
import { initDatabase } from "../../utils/mongodb";
import { getSession } from "../../utils/session";

export default async function(req, res) {
    const { spot } = req.body;
    const sessionId = req?.cookies?.SessionId;

    if (req.method !== "POST") {
        // This endpoint only accepts POST requests
        console.log("Method not allowed");
        return res.status(400).json({
            success: false,
            error: "Method not allowed"
        });
    }

    if (!sessionId) {
        // A session ID is not present
        return res.status(400).json({
            success: false,
            error: "No Session ID present"
        });
    }

    const session = await getSession(req, res);

    if (!session?.user) {
        // Session is not linked to a user
        return res.status(400).json({
            success: false,
            error: "User is not logged in"
        });
    }

    if (!spot) {
        // No spot was specified
        return res.status(400).json({
            success: false,
            error: "Spot is missing"
        });
    }

    await addSpotToUser(spot, session.user._id);

    return res.status(200).json({
        success: true
    });
}

export async function addSpotToUser(spot, uid) {
    const client = await initDatabase();
    const users = client.collection("users");

    const update = {
        $set: {
            spot: spot
        }
    };

    return users.updateOne({
        _id: ObjectId(uid)
    }, update);
}
import { ObjectId } from "mongodb";
import { initDatabase } from "./mongodb";

export async function getSessionUser(sessionCookie) {
    const client = await initDatabase();
    const sessions = client.collection("sessions");

    const agg = [
        {
            $lookup: {
                from: "users",
                localField: "uid",
                foreignField: "_id",
                as: "user",
            },
        },
        {
            $unwind: {
                path: "$user",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $match: {
                token: sessionCookie,
            },
        }
    ];

    const result = await sessions.aggregate(agg).toArray();
    return result[0];
}

export async function getUserFromUid(uid) {
    const client = await initDatabase();
    const users = client.collection("users");

    return users.findOne({
        _id: ObjectId(uid)
    });
}

export async function createUser(user) {
    const client = await initDatabase();
    const users = client.collection("users");

    return users.insertOne(user);
}

export async function getUserFromGoogleId(googleId) {
    const client = await initDatabase();
    const users = client.collection("users");

    return users.findOne({
        google: {
            user: {
                id: googleId
            }
        }
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
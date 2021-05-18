import { initDatabase } from "../../utils/mongodb";

export default async function (req, res) {
    if (req.method !== "POST") {
        // This endpoint only accepts POST requests
        console.log("Method not allowed");
        return res.status(400).json({
            success: false,
            error: "Method not allowed"
        });
    }

    const body = req.body;

    // Add to database
    await addToDatabase(body.id, parseInt(body.timestamp), body.occupied === "true")

    res.status(200).json({
        success: true
    });
}

async function addToDatabase(space, timestamp, occupied) {
    const client = await initDatabase();
    const data = client.collection("parking");

    const newParkingEvent = {
        space: space,
        timestamp: timestamp,
        occupied: occupied
    };

    return await data.insertOne(newParkingEvent);
}
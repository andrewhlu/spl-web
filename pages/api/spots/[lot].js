import { ObjectId } from "mongodb";
import { initDatabase } from "../../../utils/mongodb";

export default async function(req, res) {
    const { lot } = req.query;
    const body = req.body;
    console.log(body);

    switch (req.method) {
        case "GET": {
            if (!lot) {
                // Parking lot not specified
                console.log("Parking lot not specified");
                return res.status(400).json({
                    success: false,
                    error: "Parking lot not specified"
                });
            }

            try {
                const spots = await getSpotsFromLot(lot);

                return res.status(200).json({
                    success: true,
                    spots: spots
                });
            } catch(e) {
                console.log(e);

                return res.status(500).json({
                    success: false,
                    error: "An error occurred while getting parking spots from this lot. Check your lot ID."
                });
            }            
        }
        case "POST": {
            if (!lot || !body.name || !body.x || !body.y) {
                // One or more input parameters is missing
                console.log("One or more input parameters is missing");
                return res.status(400).json({
                    success: false,
                    error: "One or more input parameters is missing"
                });
            }

            try {
                const newSpot = await addNewSpot(lot, body.name, [parseInt(body.x), parseInt(body.y)]);

                return res.status(200).json({
                    success: true,
                    spot: newSpot.ops[0]
                });
            } catch(e) {
                console.log(e);

                return res.status(500).json({
                    success: false,
                    error: "An error occurred while creating the parking spot."
                });
            }
        }
        case "DELETE": {
            if (!lot || !body.id) {
                // One or more input parameters is missing
                console.log("One or more input parameters is missing");
                return res.status(400).json({
                    success: false,
                    error: "One or more input parameters is missing"
                });
            }
            try {
                await deleteSpot(lot, body.id);

                return res.status(200).json({
                    success: true
                });
            } catch(e) {
                console.log(e);

                return res.status(500).json({
                    success: false,
                    error: "An error occurred while deleting the parking spot."
                });
            }
        }
        default: {
            console.log("Method not allowed");
            return res.status(400).json({
                success: false,
                error: "Method not allowed"
            });
        }
    }
}

export async function getSpotsFromLot(lot) {
    const client = await initDatabase();
    const spots = client.collection("spots");

    return await spots.find({
        lot: ObjectId(lot)
    }).toArray();
}

export async function addNewSpot(lot, name, position) {
    const client = await initDatabase();
    const spots = client.collection("spots");

    const newSpot = {
        lot: ObjectId(lot),
        name: name,
        position: position
    };

    return await spots.insertOne(newSpot);
}

export async function deleteSpot(lot, id) {
    const client = await initDatabase();
    const spots = client.collection("spots");

    return await spots.deleteOne({
        lot: ObjectId(lot),
        _id: ObjectId(id)
    });
}
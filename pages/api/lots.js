import { initDatabase } from "../../utils/mongodb";

export default async function(req, res) {
    if (req.method !== "GET") {
        // This endpoint only accepts GET requests
        console.log("Method not allowed");
        return res.status(400).json({
            success: false,
            error: "Method not allowed"
        });
    }

    const lots = await getLots();

    res.status(200).json({
        success: true,
        lots: lots
    })
}

export async function getLots() {
    const client = await initDatabase();
    const lots = client.collection("lots");

    return lots.find().toArray();
}
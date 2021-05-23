import { ObjectId } from "mongodb";
import { initDatabase } from "../../../utils/mongodb";

export default async (req, res) => {
    const { lot } = req.query;

    if (req.method !== "GET") {
        // This endpoint only accepts GET requests
        console.log("Method not allowed");
        return res.status(400).json({
            success: false,
            error: "Method not allowed"
        });
    }

    const spots = await getLatestStatus(lot);

    res.status(200).json({
        success: true,
        spots: spots
    })
};

export async function getLatestStatus(lot) {
    const client = await initDatabase();
    const data = client.collection("spots");

    const agg = [
        {
            '$match': {
                'lot': new ObjectId(lot)
            }
        },
        {
            '$lookup': {
                'from': 'parking',
                'localField': 'name',
                'foreignField': 'space',
                'as': 'data'
            }
        },
        {
            '$project': {
                'latest': {
                    '$filter': {
                        'input': '$data',
                        'cond': {
                            '$eq': [
                                '$$this.timestamp', {
                                    '$max': '$data.timestamp'
                                }
                            ]
                        }
                    }
                }
            }
        },
        {
            '$unwind': {
                'path': '$latest'
            }
        },
        {
            '$addFields': {
                'name': '$latest.space'
            }
        }
    ];

    return await data.aggregate(agg).toArray();
};

// Old aggregation - get latest status of ALL spaces
//   const agg = [
//     {
//         '$group': {
//             '_id': '$space',
//             'timestamp': {
//                 '$max': '$$ROOT'
//             }
//         }
//     }, {
//         '$replaceRoot': {
//             'newRoot': '$timestamp'
//         }
//     }
// ];
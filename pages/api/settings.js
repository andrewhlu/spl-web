export default (req, res) => {
    res.status(200).json({
        "floorplan": "/parking-lot-2.png",
        "title": "Parking Lot 65 Floor 1",
        "spots": [
            {
                "id": "lora32_01",
                "position": [392, 4584]
            },
            {
                "id": "lora32_02",
                "position": [435, 4584]
            },
            {
                "id": "lora32_03",
                "position": [478, 4584]
            }
        ]
    });
}

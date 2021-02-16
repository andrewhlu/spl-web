export default (req, res) => {
    res.status(200).json([
        {
            "device_id": "lora32_01",
            "raw": "true",
            "time": "2021-01-18T06:00:34.353284534Z"
        },
        {
            "device_id": "lora32_02",
            "raw": "false",
            "time": "2021-01-18T06:00:34.353284534Z"
        }
    ]);
}

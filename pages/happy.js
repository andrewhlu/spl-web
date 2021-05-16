import { Button } from "@chakra-ui/button";
import { Box } from "@chakra-ui/layout";
import { useRef } from "react";

export default function Happy() {
    const audioRef = useRef(null);
    const videoRef = useRef(null);

    const startVideo = () => {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
        audioRef.current.play();

        setInterval(() => {
            videoRef.current.currentTime = 0;
        }, 8022);

        setInterval(() => {
            audioRef.current.currentTime = 0;
        }, 53894);
    }

    return (
        <Box h="100vh" w="100vw" bgColor="black">
            <audio ref={audioRef} src="/happy.m4a" hidden />
            <video playsInline muted ref={videoRef} src="/happy.mp4" style={{ width: "100%", height: "100%" }} />
            <Button onClick={startVideo} pos="fixed" bottom="1rem" right="1rem">Start</Button>
        </Box>
    )
}
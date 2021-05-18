import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Image } from "@chakra-ui/image";
import { Box } from "@chakra-ui/layout";
import { Tooltip } from "@chakra-ui/tooltip";
import { useEffect, useRef, useState } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import absoluteUrl from 'next-absolute-url';
import { fetch } from "../utils/fetch.js";
import LeftBar from "../components/LeftBar.js";
import { getSession } from "../utils/session";
import LoginDrawer from "../components/LoginDrawer.js";

export async function getServerSideProps(context) {
    const { origin } = absoluteUrl(context.req, 'localhost:3000');
    // const origin = "http://10.0.0.93:3000";

    const settings = await fetch(`${origin}/api/settings`);
    const status = await fetch(`${origin}/api/status`);
    const devices = await fetch(`${origin}/api/devices`);

    const session = await getSession(context.req, context.res);

    return {
        props: {
            query: context.query,
            settings: settings,
            status: status,
            devices: devices,
            session: session
        }
    }
}

export default function Home(props) {
    const [selectedSpot, setSelectedSpot] = useState("");
    const [collapsed, setCollapsed] = useState(false);
    const [spots, setSpots] = useState(props.settings.spots);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const mapDiv = useRef(null);

    const getStatus = (id) => {
        const statuses = props.status.filter(s => s.device_id === id);

        // Currently only returns the first element, but it should return the most recent
        return statuses.length > 0 ? statuses[0].raw === "true" : null;
    }

    const generateMapIndicator = (spot) => {
        const status = getStatus(spot.id);
        const color = status !== null ? status === true ? "red" : "teal" : "gray";

        return (
            <Tooltip hasArrow label={spot.id} closeOnClick={false} key={spot.id}>
                <Button colorScheme={color}
                    variant="solid" 
                    width="50px" 
                    height="50px" 
                    border="3px solid black" 
                    borderRadius="25px" 
                    pos="absolute"
                    top={`${spot.position[1] - 25}px`} 
                    left={`${spot.position[0] - 25}px`}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                        console.log(`${spot.id} has been clicked`);
                        setSelectedSpot(spot.id);
                        setCollapsed(false);
                    }}></Button>
            </Tooltip>
        )
    }

    return (
        <>
            <LoginDrawer isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
            
            <Box height="100vh" bg="#dae6e6">
                <TransformWrapper
                    defaultScale={0.3}
                    options={{
                        limitToBounds: false,
                        minScale: 0.15,
                        maxScale: 3
                    }}
                    wheel={{
                        step: 250
                    }}
                >
                    <TransformComponent>
                        <Box w="100vw" h="100vh" bg="#dae6e6">
                            <Image
                                ref={mapDiv}
                                src={props.settings.floorplan}
                                alt="Parking Lot"
                                pos="absolute"
                                maxW="none"
                                style={{ pointerEvents: "auto !important" }}
                            />
                            {spots.map(spot => generateMapIndicator(spot))}
                        </Box>
                    </TransformComponent>
                </TransformWrapper>

                <Box w={{ base: "100%", lg: "550px"}} 
                    maxH={{ base: "40%", lg: "800px" }}
                    pos="fixed"
                    top={{ lg: "0"}} 
                    bottom={{ base: "0"}}
                    p={{ base: "0", lg: "2rem" }}>
                    <LeftBar settings={props.settings} 
                        status={props.status} 
                        devices={props.devices} 
                        user={props.session?.user}
                        onOpen={onOpen}
                        selectedSpot={selectedSpot}
                        collapsed={collapsed}
                        setCollapsed={setCollapsed}></LeftBar>
                </Box>
            </Box>
        </>
    )
}

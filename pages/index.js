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
import { getLots } from "./api/lots.js";
import { getSpotsFromLot } from "./api/spots/[lot].js";
import { serializeDocument } from "../utils/mongodb.js";

export async function getServerSideProps(context) {
    const { origin } = absoluteUrl(context.req, 'localhost:3000');
    // const origin = "http://10.0.0.93:3000";

    const status = await fetch(`${origin}/api/status`);

    const session = await getSession(context.req, context.res);

    const lots = await getLots();
    console.log("Lot ID:", lots[0]._id);

    const spots = await getSpotsFromLot(lots[0]._id);
    console.log("Spots:", spots);

    return {
        props: {
            query: context.query,
            status: status,
            session: session,
            lots: serializeDocument(lots),
            spots: serializeDocument(spots)
        }
    }
}

export default function Home(props) {
    const [currentLot, setCurrentLot] = useState(props.lots[0]);
    const [allLots, setAllLots] = useState(props.lots);
    const [spots, setSpots] = useState(props.spots);

    const [selectedSpot, setSelectedSpot] = useState("");
    const [collapsed, setCollapsed] = useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const mapDiv = useRef(null);

    const getStatus = (name) => {
        const statuses = props.status.filter(s => s.device_id === name);

        // Currently only returns the first element, but it should return the most recent
        return statuses.length > 0 ? statuses[0].raw === "true" : null;
    }

    const generateMapIndicator = (spot) => {
        const status = getStatus(spot.name);
        const color = status !== null ? status === true ? "red" : "teal" : "gray";

        return (
            <Tooltip hasArrow label={spot.name} closeOnClick={false} key={spot.name}>
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
                        console.log(`${spot.name} has been clicked`);
                        setSelectedSpot(spot.name);
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
                                src={currentLot?.floorplan}
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
                    <LeftBar
                        status={props.status} 
                        user={props.session?.user}
                        onOpen={onOpen}
                        currentLot={currentLot}
                        lots={allLots}
                        spots={spots}
                        selectedSpot={selectedSpot}
                        collapsed={collapsed}
                        setCollapsed={setCollapsed}></LeftBar>
                </Box>
            </Box>
        </>
    )
}

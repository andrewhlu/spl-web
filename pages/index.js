import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Image } from "@chakra-ui/image";
import { Box } from "@chakra-ui/layout";
import { Tooltip } from "@chakra-ui/tooltip";
import { useEffect, useRef, useState } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { fetch } from "../utils/fetch";
import LeftBar from "../components/LeftBar";
import { getSession } from "../utils/session";
import LoginDrawer from "../components/LoginDrawer";
import { getLots } from "./api/lots";
import { getSpotsFromLot } from "./api/spots/[lot]";
import { serializeDocument } from "../utils/mongodb";
import { getLatestStatus } from "./api/status/[lot]";
import { addSpotToUser } from "../utils/user";

export async function getServerSideProps(context) {
    const session = await getSession(context.req, context.res);

    const lots = await getLots();
    const lotId = lots[0]._id;
    console.log("Lot ID:", lotId);

    const spots = await getSpotsFromLot(lotId);
    const status = await getLatestStatus(lotId);

    return {
        props: {
            query: context.query,
            session: session,
            lots: serializeDocument(lots),
            spots: serializeDocument(spots),
            status: serializeDocument(status),
        }
    }
}

export default function Home(props) {
    const [currentLot, setCurrentLot] = useState(props.lots[0]);
    const [allLots, setAllLots] = useState(props.lots);
    const [spots, setSpots] = useState(props.spots);
    const [availability, setAvailability] = useState(props.status);

    const [selectedSpot, setSelectedSpot] = useState(null);
    const [collapsed, setCollapsed] = useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const mapDiv = useRef(null);

    useEffect(() => {
        let refreshTimer = setInterval(() => {
            refreshAvailability();
        },15000);

        // Cleanup
        return () => {
            clearInterval(refreshTimer);
        }
    }, []);

    const refreshAvailability = async () => {
        const status = await fetch(`/api/status/${currentLot._id}`);

        if (status.success) {
            setAvailability(status.spots);
        }
    }

    const getStatus = (name) => {
        const status = availability.filter(s => s.name === name);

        if (status.length === 0) {
            return null;
        }

        return status[0].latest.occupied;
    }

    const findOpenSpot = async () => {
        const exit = currentLot.exit;
        const openSpots = spots.filter(s => getStatus(s.name) === false);

        let closest = {
            distance: Infinity,
            spot: null
        };

        openSpots.forEach(s => {
            const distance = Math.sqrt(Math.pow(exit[0] - s.position[0], 2) + Math.pow(exit[1] - s.position[1], 2));

            if (distance < closest.distance) {
                closest = {
                    distance: distance,
                    spot: s
                };
            }
        })

        if (closest.spot) {
            console.log(`${closest.spot.name} is the closest spot!`);
            setSelectedSpot(closest.spot.name);
            await addSpotToUser(closest.spot.name, props.session.user._id);
        }
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
                    border={spot.name === selectedSpot ? "8px solid #FEBC11" : "3px solid black"}
                    borderRadius="25px" 
                    pos="absolute"
                    top={`${spot.position[1] - 25}px`} 
                    left={`${spot.position[0] - 25}px`}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                        console.log(`${spot.name} has been clicked`);
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
                    defaultPositionY={-1000}
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
                        setSelectedSpot={setSelectedSpot}
                        collapsed={collapsed}
                        setCollapsed={setCollapsed}
                        findOpenSpot={findOpenSpot}
                    />
                </Box>
            </Box>
        </>
    )
}

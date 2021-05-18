import { Button } from "@chakra-ui/button";
import { Image } from "@chakra-ui/image";
import { Box } from "@chakra-ui/layout";
import { Tooltip } from "@chakra-ui/tooltip";
import { useEffect, useRef, useState } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import absoluteUrl from 'next-absolute-url';
import { fetch } from "../utils/fetch.js";
import LeftBarEditor from "../components/LeftBarEditor.js";
import { getSession } from "../utils/session";

export async function getServerSideProps(context) {
    const { origin } = absoluteUrl(context.req, 'localhost:3000');
    // const origin = "http://10.0.0.93:3000";

    const settings = await fetch(`${origin}/api/settings`);
    const status = await fetch(`${origin}/api/status`);

    const session = await getSession(context.req, context.res);
    console.log(session.user);

    if (!session.user?.admin) {
        // This user is not an admin, redirect to main page
        context.res.writeHead(302, {
            'Location': 'http://localhost:3000'
        }).end();

        return {
            props: {}
        };
    }

    return {
        props: {
            query: context.query,
            settings: settings,
            status: status,
            session: session
        }
    }
}

export default function Home(props) {
    const [currentLot, setCurrentLot] = useState(null);
    const [allLots, setAllLots] = useState([]);
    const [spots, setSpots] = useState(props.settings.spots);

    const mapDiv = useRef(null);

    useEffect(() => {
        const getLots = async () => {
            const lots = await fetch("/api/lots");    
            if (lots.success) {
                setAllLots(lots.lots);
            }
        }

        getLots();
    }, []);

    const getStatus = (id) => {
        const statuses = props.status.filter(s => s.device_id === id);

        // Currently only returns the first element, but it should return the most recent
        return statuses.length > 0 ? statuses[0].raw === "true" : null;
    }

    const removeSpot = (spot) => {
        setSpots(spots.filter(s => s.id !== spot));
    }

    const selectLot = (id) => {
        console.log(`Selecting lot ${id}`);
        setCurrentLot(allLots.filter(lot => lot._id === id)[0]);
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
                    onClick={() => {removeSpot(spot.id)}}
                ></Button>
            </Tooltip>
        )
    }

    const addSpot = (e) => {
        const mapRect = mapDiv.current.getBoundingClientRect();

        const mapCoord = {
            x: mapRect.x,
            y: mapRect.y
        };

        const clickCoord = {
            x: e.pageX,
            y: e.pageY
        };

        const mapDimensions = {
            width: mapRect.width,
            height: mapRect.height
        };

        const naturalDimensions = {
            width: mapDiv.current.naturalWidth,
            height: mapDiv.current.naturalHeight
        };

        const clickPosition = [
            Math.floor((clickCoord.x - mapCoord.x) / mapDimensions.width * naturalDimensions.width),
            Math.floor((clickCoord.y - mapCoord.y) / mapDimensions.height * naturalDimensions.height)
        ];

        setSpots(spots => [...spots, {
            id: `new-${clickPosition[0]}-${clickPosition[1]}`,
            position: clickPosition
        }]);
    }

    return (
        <>
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
                                onClick={addSpot}
                                style={{ pointerEvents: "auto !important" }}
                            />
                            {spots.map(spot => generateMapIndicator(spot))}
                        </Box>
                    </TransformComponent>
                </TransformWrapper>

                <Box w={{ base: "100%", lg: "550px"}} 
                    pos="fixed"
                    top={{ lg: "0"}} 
                    bottom={{ base: "0"}}
                    p={{ base: "0", lg: "2rem" }}>
                    <LeftBarEditor 
                        settings={props.settings}
                        status={props.status}
                        user={props.session?.user}
                        currentLot={currentLot}
                        selectLot={selectLot}
                        lots={allLots}
                        spots={spots}
                        setSpots={setSpots}
                        removeSpot={removeSpot}
                    ></LeftBarEditor>
                </Box>
            </Box>
        </>
    )
}

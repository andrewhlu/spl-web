import { Button } from "@chakra-ui/button";
import { Image } from "@chakra-ui/image";
import { Box } from "@chakra-ui/layout";
import { Tooltip } from "@chakra-ui/tooltip";
import { useEffect, useRef, useState } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { fetch } from "../utils/fetch";
import LeftBarEditor from "../components/LeftBarEditor";
import { getSession } from "../utils/session";

export async function getServerSideProps(context) {
    const session = await getSession(context.req, context.res);

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
            session: session
        }
    }
}

export default function Home(props) {
    const [currentLot, setCurrentLot] = useState(null);
    const [allLots, setAllLots] = useState([]);
    const [spots, setSpots] = useState([]);
    const [availability, setAvailability] = useState([]);

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

    const getStatus = (name) => {
        const status = availability.filter(s => s.name === name);

        if (status.length === 0) {
            return null;
        }

        return status[0].latest.occupied;
    }

    const removeSpot = async (spot) => {
        const options = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: spot._id
            })
        };

        const lots = await fetch(`/api/spots/${currentLot._id}`, options);    
        if (lots.success) {
            setSpots(spots.filter(s => s.name !== spot.name));
        }
    }

    const selectLot = async (id) => {
        console.log(`Selecting lot ${id}`);
        const lot = allLots.filter(lot => lot._id === id)[0]
        setCurrentLot(lot);

        // Get spots for current lot
        const spotsResult = await fetch(`/api/spots/${lot._id}`);    
        if (spotsResult.success) {
            setSpots(spotsResult.spots);

            // Get availability for current lot
            const availResult = await fetch(`/api/status/${lot._id}`);    
            if (availResult.success) {
                setAvailability(availResult.spots);
            }
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
                    border="3px solid black" 
                    borderRadius="25px" 
                    pos="absolute"
                    top={`${spot.position[1] - 25}px`} 
                    left={`${spot.position[0] - 25}px`}
                    style={{ cursor: "pointer" }}
                    onClick={() => {removeSpot(spot)}}
                ></Button>
            </Tooltip>
        )
    }

    const addSpot = async (e) => {
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

        const namePrefix = currentLot._id.substring(currentLot._id.length - 4);

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: `${namePrefix}-${clickPosition[0]}-${clickPosition[1]}`,
                x: clickPosition[0],
                y: clickPosition[1]
            })
        };

        const result = await fetch(`/api/spots/${currentLot._id}`, options);    
        if (result.success) {
            setSpots(spots => [...spots, result.spot]);
        }
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

import { Box, Button, HStack, Image, Spacer, Tooltip } from "@chakra-ui/react";
import { useState } from 'react';
import { MapInteractionCSS } from 'react-map-interaction';
import absoluteUrl from 'next-absolute-url';
import { fetch } from "../utils/fetch.js";
import LeftBar from "../components/LeftBar.js";
import NavItem from "../components/NavItem.js";
import styles from '../styles/Home.module.css';

export async function getServerSideProps(context) {
    const { origin } = absoluteUrl(context.req, 'localhost:3000');

    const settings = await fetch(`${origin}/api/settings`);
    const status = await fetch(`${origin}/api/status`);
    const devices = await fetch(`${origin}/api/devices`);

    return {
        props: {
            query: context.query,
            settings: settings,
            status: status,
            devices: devices
        }
    }
}

export default function Home(props) {
    const [selectedSpot, setSelectedSpot] = useState("");
    const [collapsed, setCollapsed] = useState(false);
    
    const navbarHeight = "4rem";

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
                    className={styles.mapDivItem} 
                    top={`${spot.position[1] - 25}px`} 
                    left={`${spot.position[0] - 25}px`}
                    onClick={() => {setSelectedSpot(spot.id)}}></Button>
            </Tooltip>
        )
    }

    return (
        <Box height="100vh">
            <Box bg="#333333" width="100vw" height={navbarHeight}>
                <HStack className={styles.navLink} style={{margin: "0 1.5rem"}}>
                    <NavItem height={navbarHeight} content="Smart Parking Lot"></NavItem>
                    <Spacer></Spacer>
                    <Button colorScheme="teal" variant="solid" disabled>Login</Button>
                </HStack>
            </Box>

            <Box width="100%" height={`calc(100vh - ${navbarHeight})`} bg="#dae6e6">
                <MapInteractionCSS>
                    <Image src={props.settings.floorplan} alt="Parking Lot" className={styles.mapDivItem}></Image>
                    {props.settings.spots.map(spot => generateMapIndicator(spot))}
                </MapInteractionCSS>
            </Box>

            <Box w={{ base: "100%", lg: "500px"}} 
                maxH={{ base: "40%", lg: "800px" }}
                pos="fixed"
                top={{ lg: "4rem"}} 
                bottom={{ base: "0"}}
                p={{ base: "0", lg: "2rem" }}>
                <LeftBar settings={props.settings} 
                    status={props.status} 
                    devices={props.devices} 
                    selectedSpot={selectedSpot}
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}></LeftBar>
            </Box>
        </Box>
    )
}

import { Button } from "@chakra-ui/button";
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Box, Container, Divider, Heading } from "@chakra-ui/layout";
import { Menu, MenuItem, MenuList } from "@chakra-ui/menu";
import { useRouter } from "next/router";
import styles from '../styles/LeftBar.module.css';

export default function LeftBar(props) {
    const router = useRouter();

    const getStatus = (id) => {
        const statuses = props.status.filter(s => s.device_id === id);

        // Currently only returns the first element, but it should return the most recent
        return statuses.length > 0 ? statuses[0].raw === "true" : null;
    }

    const toggleCollapsed = () => {
        props.setCollapsed(!props.collapsed);
    }

    const signinWithGoogle = () => {
        router.push("/api/auth/google");
    }

    return (
        <Box w="100%" 
            h="100%" 
            bg="white" 
            border="5px solid #9cbebe" 
            borderBottom={{base: "0", lg: "5px solid #9cbebe"}}
            borderRadius="2rem" 
            borderBottomRadius={{base: "0", lg: "2rem"}}>
            <Menu placement="bottom">
                {/* This should be MenuButton */}
                <Button
                    variant="ghost" 
                    width="100%" 
                    mb={props.collapsed ? {base: "1rem", lg: "0"} : "0"}
                    rightIcon={props.collapsed ? <ChevronUpIcon /> : <ChevronDownIcon />} 
                    borderTopRadius="1.7rem"
                    onClick={toggleCollapsed}
                >
                    {props.settings.title}
                </Button>
                <MenuList>
                    <MenuItem>Floor 1</MenuItem>
                </MenuList>
            </Menu>
            
            <hr></hr>

            {!props.collapsed &&
                <Container p="1rem">
                    <Heading size="md" pb="1rem">
                        {props.user ? `Welcome, ${props.user.fname} ${props.user.lname}!` : "Welcome to Parkingbase!"}
                    </Heading>

                    {props.user ?
                        <>
                            <p>You are currently not parked in any spot.</p>
                            <Button w="100%" my="0.5rem">Find me a spot!</Button>

                            <Divider my="0.5rem" />

                            <Heading size="sm" py="0.5rem">History</Heading>
                            <p>You have never parked in this parking lot.</p>
                        </>
                    :
                        <>
                            <p>Sign in to Parkingbase to reserve spots, keep track of your car's location, and more!</p>

                            <Box d={{base: "none", lg: "inline"}}>
                                {/* Shows on large screens */}
                                <Button w="100%" onClick={signinWithGoogle} my="0.5rem">Sign in with Google</Button>
                                <Button w="100%" my="0.5rem" disabled>Sign in with UCSB NetID (coming soon)</Button>
                            </Box>
                            <Box d={{base: "inline", lg: "none"}}>
                                <Button w="100%" my="0.5rem" onClick={props.onOpen}>Sign in to Parkingbase</Button>
                            </Box>
                        </>
                    }

                    {/* <p>Selected Spot: <span className={styles.bold}>{props.selectedSpot || "None"}</span></p>
                    {props.selectedSpot && (getStatus(props.selectedSpot) !== null ?
                        <p>This spot is <span fontWeight="bold">{getStatus(props.selectedSpot) ? "occupied" : "vacant"}</span>.</p>
                    :
                        <p>Unable to get data for this parking spot.</p>
                    )}
                    <br></br>
                    <p>All Spots:</p>
                    <VStack spacing="20px">
                        {props.devices.map(device => {
                            return <p className={styles.bold} key={device}>{device}</p>
                        })}
                    </VStack> */}
                </Container>
            }
        </Box>
    )
}

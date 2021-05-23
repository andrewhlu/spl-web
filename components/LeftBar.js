import { Button } from "@chakra-ui/button";
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Image } from "@chakra-ui/image";
import { Box, Container, Divider, Heading, HStack, Spacer, Text } from "@chakra-ui/layout";
import { Menu, MenuItem, MenuList } from "@chakra-ui/menu";
import { useRouter } from "next/router";
import User from "./User";

export default function LeftBar(props) {
    const router = useRouter();

    const getStatus = (name) => {
        const statuses = props.status.filter(s => s.device_id === name);

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
            borderBottomRadius={{base: "0", lg: "2rem"}}
        >
            {/* Small screens (phone) */}
            <Image
                pos="fixed"
                top="0.5rem"
                left="0.5rem"
                src="/marker-sm.png"
                alt="Parkingbase Logo"
                h="3rem"
                d={{base: "inline", lg: "none"}}
            />
            <Box
                
            >
                {props?.user ?
                    <User user={props.user} mobile={true}/>
                :
                    <Button
                        colorScheme="teal"
                        variant="solid"
                        onClick={props.onOpen}
                        pos="fixed"
                        top="0.5rem"
                        right="0.5rem"
                        d={{base: "inline", lg: "none"}}
                    >Sign In</Button>
                }
            </Box>

            {/* Large screens (computer) */}
            <Box d={{base: "none", lg: "inline"}}>
                <Box w="100%" px="1rem" py="0.5rem">
                    <HStack>
                        <Image src="/marker-sm.png" alt="Parkingbase Logo" h="3rem" />
                        <Heading size="lg">Parkingbase</Heading>

                        <Spacer />

                        {props?.user &&
                            <User user={props.user} />
                        }
                    </HStack>
                </Box>

                <Divider />
            </Box>

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
                    {props.currentLot.title}
                </Button>
                <MenuList>
                    <MenuItem>Floor 1</MenuItem>
                </MenuList>
            </Menu>
            
            <Divider />

            {!props.collapsed &&
                <Container p="1rem">
                    <Heading size="md" pb="1rem">
                        {props.user ? `Welcome, ${props.user.fname} ${props.user.lname}!` : "Welcome to Parkingbase!"}
                    </Heading>

                    {props.user ?
                        <>
                            <Text>You are currently not parked in any spot.</Text>
                            <Button w="100%" my="0.5rem" onClick={props.refresh}>Find me a spot!</Button>
                            {/* <Text>Handicapped? Show handicapped spots first by toggling the option in Settings.</Text> */}

                            <Divider my="0.5rem" />

                            {/* <Heading size="sm" py="0.5rem">History</Heading>
                            <Text>You have never parked in this parking lot.</Text> */}
                        </>
                    :
                        <>
                            <Text>Sign in to Parkingbase to reserve spots, keep track of your car's location, and more!</Text>

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

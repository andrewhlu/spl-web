import { Button } from "@chakra-ui/button";
import { ChevronDownIcon } from '@chakra-ui/icons';
import { Image } from "@chakra-ui/image";
import { VStack } from "@chakra-ui/layout";
import { Box, Container, Divider, Heading, HStack, Spacer, Text } from "@chakra-ui/layout";
import { MenuButton } from "@chakra-ui/menu";
import { Menu, MenuItem, MenuList } from "@chakra-ui/menu";
import User from "./User";

export default function LeftBarEditor(props) {
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
                <MenuButton as={Button}
                    variant="ghost"
                    width="100%"
                    rightIcon={<ChevronDownIcon />}
                >
                    {props.currentLot ? props.currentLot.title : "Select a lot"}
                </MenuButton>
                <MenuList>
                    {props.lots?.map(lot => <MenuItem key={lot._id} onClick={() => props.selectLot(lot._id)}>{lot.title}</MenuItem>)}
                </MenuList>
            </Menu>
            
            <Divider />

            <Container p="1rem">
                <Heading size="md" pb="1rem">Editor</Heading>
                <Text mb="1rem">Click an empty space on the map to add a new parking spot. Click on an existing spot to remove it.</Text>

                <VStack spacing="1rem">
                    {props.spots.map(spot => 
                        <Button w="100%" key={spot.name} onClick={() => props.removeSpot(spot)}>{spot.name}</Button>
                    )}
                </VStack>
            </Container>
        </Box>
    )
}

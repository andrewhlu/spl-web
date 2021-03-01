import { Box, Button, Container, VStack, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import styles from '../styles/LeftBar.module.css';

export default function LeftBar(props) {
    const getStatus = (id) => {
        const statuses = props.status.filter(s => s.device_id === id);

        // Currently only returns the first element, but it should return the most recent
        return statuses.length > 0 ? statuses[0].raw === "true" : null;
    }

    const toggleCollapsed = () => {
        props.setCollapsed(!props.collapsed);
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
                    <p>Selected Spot: <span className={styles.bold}>{props.selectedSpot || "None"}</span></p>
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
                    </VStack>
                </Container>
            }
        </Box>
    )
}

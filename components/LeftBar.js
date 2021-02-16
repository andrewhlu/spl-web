import { Box, Button, Container, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { ChevronDownIcon } from '@chakra-ui/icons';
import styles from '../styles/LeftBar.module.css';

export default function LeftBar(props) {
    const getStatus = (id) => {
        const statuses = props.status.filter(s => s.device_id === id);

        // Currently only returns the first element, but it should return the most recent
        return statuses.length > 0 ? statuses[0].raw === "true" : null;
    }

    return (
        <Box width="100%" height="100%" bg="white" className={styles.leftBar}>
            <Menu placement="bottom">
                <MenuButton as={Button} variant="ghost" width="100%" rightIcon={<ChevronDownIcon />} borderRadius="1.7rem 1.7rem 0 0">
                    {props.settings.title}
                </MenuButton>
                <MenuList>
                    <MenuItem>Floor 1</MenuItem>
                </MenuList>
            </Menu>
            
            <hr></hr>

            <Container className={styles.contPadding}>
                <p>Selected Spot: <span className={styles.bold}>{props.selectedSpot || "None"}</span></p>
                {props.selectedSpot && (getStatus(props.selectedSpot) !== null ?
                    <p>This spot is <span className={styles.bold}>{getStatus(props.selectedSpot) ? "occupied" : "vacant"}</span>.</p>
                :
                    <p>Unable to get data for this parking spot.</p>
                )}
                <br></br>
                <p>All Spots:</p>
                {props.devices.map(device => {
                    return <p className={styles.bold} key={device}>{device}</p>
                })}
            </Container>
        </Box>
    )
}

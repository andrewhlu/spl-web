import { Center } from "@chakra-ui/react";

export default function NavItem(props) {
    return (
        <Center height={props.height}>
            <p>{props.content}</p>
        </Center>
    )
}
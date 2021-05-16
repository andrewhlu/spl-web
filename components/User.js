import { Button } from "@chakra-ui/button";
import { Image } from "@chakra-ui/image";
import { Text } from "@chakra-ui/layout";
import { Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverTrigger } from "@chakra-ui/popover";
import { useRouter } from "next/router";

export default function User(props) {
    const router = useRouter();

    const getLoginMethod = () => {
        if (props.user.google) {
            return "Google";
        } else if (props.user.ucsb) {
            return "UCSB NetID";
        } else {
            return "Unknown";
        }
    }

    const signOut = () => {
        router.push("/api/auth/logout");
    }

    return (
        <Popover>
            <PopoverTrigger>
                <Image
                    borderRadius="full"
                    h="3rem"
                    src={props.user.picture}
                    alt={props.user.fname}
                    pos={props.mobile && "fixed"}
                    top={props.mobile && "0.5rem"}
                    right={props.mobile && "0.5rem"}
                    d={props.mobile && {base: "inline", lg: "none"}}
                />
            </PopoverTrigger>
            <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody textAlign="center">
                    <Text fontWeight="bold">{`${props.user.fname} ${props.user.lname}`}</Text>
                    <Text>{props.user.email}</Text>
                    <Text>{`Login Method: ${getLoginMethod()}`}</Text>
                    <Button colorScheme="red" variant="solid" my="0.5rem" onClick={signOut}>Sign Out</Button>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    )
}
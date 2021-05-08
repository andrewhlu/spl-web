import { Button } from "@chakra-ui/button";
import { Image } from "@chakra-ui/image";
import { Center, Heading, Spacer, Text, VStack } from "@chakra-ui/layout";
import { Drawer, DrawerCloseButton, DrawerContent, DrawerOverlay } from "@chakra-ui/modal";
import { useRouter } from 'next/router';

export default function LoginDrawer(props) {
    const router = useRouter();

    const signinWithGoogle = () => {
        router.push("/api/auth/google");
    }

    return (
        <>
            <Drawer isOpen={props.isOpen} onClose={props.onClose} placement="right" size="sm">
                <DrawerOverlay />
                <DrawerContent p={{ base: "1.5rem", lg: "3rem"}}>
                    <DrawerCloseButton />

                    <Center my="0.5rem">
                        <VStack>
                            <Image src="/marker-sm.png" alt="Logo" boxSize={{ base: "50px", lg: "100px"}}></Image>
                            <Heading size="xl">Sign in</Heading>
                            <Text align="center">Choose an authentication provider to continue</Text>
                        </VStack>
                    </Center>

                    <Spacer />
                    
                    <Button w="100%" onClick={signinWithGoogle} my="0.5rem">Sign in with Google</Button>
                    <Button w="100%" my="0.5rem" disabled>Sign in with UCSB NetID (coming soon)</Button>

                    <Spacer />

                    <Text align="center">UCSB Capstone Project</Text>
                </DrawerContent>
            </Drawer>
        </>
    )
}
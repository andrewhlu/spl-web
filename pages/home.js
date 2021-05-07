import { Button } from "@chakra-ui/button";
import { Image } from "@chakra-ui/image";
import { Box, Link, Spacer, Text, VStack } from "@chakra-ui/layout";
import { useEffect } from "react";
import { getSession } from "../utils/session";

export async function getServerSideProps(context) {
    const session = await getSession(context.req, context.res);

    return {
        props: {
            session: session
        }
    }
}

export default function Home() {
    useEffect(() => {
        document.querySelector("body").style.background = "url('video.mp4') no-repeat center cover";
    }, [])

    return (
        <Box h="100vh" w="100vw">
            <VStack p="2rem" h="100%">
                <Image src="/logo.png" alt="Parkingbase"></Image>

                <Spacer />

                <Text>Welcome! Log in to continue.</Text>
                <Link w="100%" href="/api/auth/google">
                    <Button w="100%">Sign in with Google</Button>
                </Link>
                <Button w="100%" disabled>Sign in with UCSB NetID (coming soon)</Button>
                <Link w="100%" href="/">
                    <Button w="100%">Continue as Guest</Button>
                </Link>

                <Spacer />

                <Text>UCSB Capstone Project</Text>
            </VStack>
        </Box>
    )
}
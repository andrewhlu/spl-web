import { Button } from "@chakra-ui/button";
import { Center } from "@chakra-ui/layout";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Loading() {
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            router.push("/");
        }, 1000);
    }, []);

    return (
        <Center h="100vh">
            <Button size="lg" isLoading />
        </Center>
    );
}
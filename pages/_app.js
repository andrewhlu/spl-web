import { ChakraProvider } from "@chakra-ui/react";
import Head from 'next/head';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>Smart Parking Lot</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            
            <ChakraProvider>
                <Component {...pageProps} />
            </ChakraProvider>
        </>
    )
}

export default MyApp

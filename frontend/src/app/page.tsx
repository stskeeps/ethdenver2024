"use client";

import {
    Alert,
    Center,
    Group,
    Image,
    Loader,
    SimpleGrid,
    Stack,
    Title,
} from "@mantine/core";
import { Address } from "viem";

import { Gravatar } from "../components/Gravatar";
import { Project } from "../components/Project";
import { useGravatars } from "../hooks/Gravatar";

const host = process.env.NEXT_PUBLIC_CARTESI_NODE_HOST!;
const chainCID = process.env.NEXT_PUBLIC_CARTESI_CHAIN_CID!;

export default function HomePage() {
    const { cid, data, error, loading, path } = useGravatars({
        host,
        chainCID,
    });

    const gravatars = data.map((gravatar) => {
        const { id, owner, displayName, imageUrl } = gravatar;
        return (
            <Gravatar
                key={id}
                id={id}
                displayName={displayName}
                owner={owner as Address}
                imageUrl={imageUrl}
            />
        );
    });
    return (
        <Stack gap={30} p={30}>
            <Project
                contractAddress="0x08d08e320e2b25184173331FcCCa122E4129523f"
                databaseCID={cid}
                databasePath={path}
            />
            {error && (
                <Alert title="Error" variant="light" color="red">
                    {error.message}
                </Alert>
            )}
            {loading && (
                <Center>
                    <Loader />
                </Center>
            )}
            <SimpleGrid cols={4}>{gravatars}</SimpleGrid>
            <Center>
                <Group>
                    <Title>Verified by Fido</Title>
                    <Image
                        alt="Fido"
                        radius="md"
                        src="/img/fido.webp"
                        h={60}
                        w={60}
                    />
                </Group>
            </Center>
        </Stack>
    );
}

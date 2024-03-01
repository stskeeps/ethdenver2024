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
import { useGravatars } from "../hooks/Gravatar";

export default function HomePage() {
    const lambadaUrl = "https://<lambada_url>/latest/<chain_id>/state_cid";
    const { data, error, loading } = useGravatars(lambadaUrl);

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
        <Stack gap={20}>
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

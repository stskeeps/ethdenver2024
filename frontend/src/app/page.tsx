"use client";

import {
    Alert,
    Center,
    Group,
    Image,
    SimpleGrid,
    Stack,
    Title,
} from "@mantine/core";
import { CID } from "multiformats/cid";
import { useMemo } from "react";
import { Address } from "viem";

import { Gravatar } from "../components/Gravatar";
import { useGravatars } from "../hooks/Gravatar";

export default function HomePage() {
    const cid = useMemo(
        () =>
            CID.parse(
                "bafkreifobfnrhofigxhfdhci4do5tfpajithjpfp6dldeukmqqnhnd3kve"
            ),
        []
    );
    const { data, error, loading } = useGravatars(cid);

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

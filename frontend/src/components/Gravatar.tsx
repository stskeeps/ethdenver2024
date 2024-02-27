import { Avatar, Paper, Text } from "@mantine/core";
import { FC } from "react";
import { Address } from "viem";

export type GravatarProps = {
    id: string;
    owner: Address;
    displayName: string;
    imageUrl: string;
};

export const Gravatar: FC<GravatarProps> = ({
    id,
    owner,
    displayName,
    imageUrl,
}) => {
    return (
        <Paper radius="md" withBorder p="lg" bg="var(--mantine-color-body)">
            <Avatar src={imageUrl} size={120} radius={120} mx="auto" />
            <Text ta="center" fz="lg" fw={500} mt="md">
                {displayName}
            </Text>
        </Paper>
    );
};

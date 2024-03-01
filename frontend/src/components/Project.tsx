import { Group, Image, Stack, Text, Title } from "@mantine/core";
import { IconBrandTwitter, IconBrandGithub } from "@tabler/icons-react";
import Link from "next/link";
import { FC } from "react";

type ProjectProps = {
    contractAddress: string;
    databaseCID: string;
    databasePath: string;
};

export const Project: FC<ProjectProps> = ({
    contractAddress,
    databaseCID,
    databasePath,
}) => {
    return (
        <Stack>
            <Group justify="space-between">
                <Image
                    radius="md"
                    src="/img/ethdenver.png"
                    h={100}
                    w={100}
                    alt="ETHDenver"
                />
                <Stack gap={5}>
                    <Title>VeriFido Demo</Title>
                    <Text>ETHDenver 2024 #BUIDLathon</Text>
                    <Group>
                        <Text>Ethereum events: </Text>
                        <Link
                            href={`https://sepolia.etherscan.io/address/${contractAddress}`}
                        >
                            <Text>
                                https://sepolia.etherscan.io/address/
                                {contractAddress}
                            </Text>
                        </Link>
                    </Group>
                    <Group>
                        <Text>Database location: </Text>
                        <Link href={`https://ipfs.io/ipfs/${databaseCID}`}>
                            <Text>
                                {databaseCID}
                                {databasePath}
                            </Text>
                        </Link>
                    </Group>
                </Stack>
                <Stack>
                    <Group>
                        <Link href="https://twitter.com/0xFido_Project">
                            <IconBrandTwitter />
                        </Link>
                        <Text>@0xFido_Project</Text>
                    </Group>
                    <Group>
                        <Link href="https://github.com/stskeeps/ethdenver2024">
                            <IconBrandGithub />
                        </Link>
                        <Text>https://github.com/stskeeps/ethdenver2024</Text>
                    </Group>
                </Stack>
            </Group>
        </Stack>
    );
};

import { Center, Group, Image, SimpleGrid, Stack, Title } from "@mantine/core";
import { Gravatar } from "../components/Gravatar";

export default function HomePage() {
    const array = Array.from(Array(10).keys());
    return (
        <Stack gap={20}>
            <SimpleGrid cols={4}>
                {array.map((index) => (
                    <Gravatar
                        id={index.toString()}
                        key={index.toString()}
                        displayName={`Happy User ${index + 1}`}
                        owner="0x1234567890123456789012345678901234567890"
                        imageUrl={`https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-${
                            index + 1
                        }.png`}
                    />
                ))}
            </SimpleGrid>
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

import '../App.css';
import { Avatar, Card, Container, Space, Text } from "@mantine/core";

//This function is used to display the Profile page
export default function Profile() {
  return (
    <Container>
      <Space h="md"/>
      <Card shadow="md" withBorder>
        <Avatar color="dark" radius="xl" size="xl">DZ</Avatar> <Space h="sm"/>
        <Text size="lg" weight="bold">Danilo Zhu</Text>
        <Space h="sm"/><Text><em>Lorem ipsum dolor sit amet</em></Text>
      </Card>
      <Space h="md"/>
    </Container>
  )
}
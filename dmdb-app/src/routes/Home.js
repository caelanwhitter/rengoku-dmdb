import { Container, Text, Group, Space, Image, ThemeIcon, Button } from "@mantine/core";
import { Link } from "react-router-dom";

//This function is used to render the featured movies of our movie database
export default function Home() {
  return (
      <Container id="mainPageContainer">
        <Group spacing={-100}>
          <Text className="intro" weight={1000} variant="gradient" gradient={{ from: 'dark', to: 'gray', deg: 90}}>Fully Fledged</Text> 
          <Text className="intro">Dawson College Movie Database</Text>
        </Group>

        <Text size="xl">The best movie database available to Dawson College - Browse <Space/> 
          our database of more than 7000 of the most popular movies, rate them, <Space/>
          or submit your own Hidden Gem
        </Text>
        <Space h="md"/>

        <Button gradient={{ from: 'dark', to: 'gray', deg: 45}} component={Link} to={"/movies"} variant="gradient" size="xl">Start Browsing</Button>
        <Space h="md"/>

        <Group>
          <ThemeIcon size="xl"
          variant="gradient" gradient={{ from: 'orange', to: 'yellow', deg: 90}}>
            <Image 
            height={50}
            width={50}
            src="https://about.gitlab.com/images/press/logo/png/gitlab-icon-1-color-white-rgb.png"/>
          </ThemeIcon>
          <a id="gitLabLink" target="_blank" rel="noreferrer" href="https://gitlab.com/zhuxiaoj1/rengoku-dmdb"><Text>Check us out on GitLab!</Text></a>
        </Group>
      </Container>
  );
}
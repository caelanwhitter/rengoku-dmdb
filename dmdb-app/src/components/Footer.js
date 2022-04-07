import { Button, Divider, Image, List, Modal, Space, Text, Title } from "@mantine/core";
import { useState } from 'react';

/**
 * Footer that contains all the credits and basic information.
 * @returns Footer functional component
 */
export default function Footer() {
  const [aboutOpened, setAboutOpened] = useState(false);

  return (
    <>
      <Modal
        opened={aboutOpened}
        onClose={() => setAboutOpened(false)}
        title={<Title order={2}>About Us</Title>}
        size="lg"
      >
        <Text>Dawson Movie Solutions is a small team consisting of four<Space />
          Dawson College Computer Science & Technology student developers: </Text>
        <List withPadding>
          <List.Item>Mikael Baril (1844064)</List.Item>
          <List.Item>Daniel Lam (1932789)</List.Item>
          <List.Item>Caelan Whitter (1841768)</List.Item>
          <List.Item>Danilo Zhu (1943382)</List.Item>
        </List>

        <Space h="md" />
        <div id="contributorButton">
          <Button component="a" href="https://gitlab.com/zhuxiaoj1/rengoku-dmdb/-/graphs/deploy"
            rel="noreferrer" target="_blank" variant="filled" 
            color="dark" uppercase compact>View Contributors</Button>
        </div>
      </Modal>

      <footer>
        <div className="footSection">
          <div id="brandIcon">
            <a href="/"><Title className="title">DMDB</Title>
              <Title className="subtitle" order={5}>Dawson Movie Database</Title></a>
          </div>

          <Space h="sm" />
          <Text color="gray">Browse thousands of popular movies and their details<Space />
            or submit your own Hidden Gem</Text>

          <Space h="md" />
          <Divider label="Built by" labelPosition="center" />
          <Text color="gray" id="footContent">{"© Dawson Movie Solutions 2022"}</Text>
        </div>

        <div className="footSection">
          <Title order={4}>About the project</Title>
          <Text className="underHover" onClick={() => setAboutOpened(true)}
            style={{ cursor: "pointer" }} color="gray">About Us</Text>

          <Space h="xl" />
          <Title order={4}>Feedback</Title>
          <a rel="noreferrer" target="_blank" href="https://stats.uptimerobot.com/v7xxocEMVD">
            <Text color="gray">Site status</Text></a>
          <a href="mailto:daniel.lam@dawsoncollege.qc.ca">
            <Text color="gray">Report a bug</Text></a>
        </div>

        <div className="footSection">
          <Title order={4}>Acknowledgements</Title>
          <Text color="gray">Images and Descriptions<Space /> fetched from</Text>

          <Space h="md" />
          <a href="https://www.themoviedb.org/" rel="noreferrer" target="_blank">
            
            <Image width="200px"
            /* eslint-disable-next-line max-len */
              src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_1-5bdc75aaebeb75dc7ae79426ddd9be3b2be1e342510f8202baf6bffa71d7f5c4.svg" />
          </a>
        </div>
      </footer>
    </>
  )
}
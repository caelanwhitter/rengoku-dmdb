import { useState } from 'react';
import { Divider, Image, List, Modal, Space, Text, Title } from "@mantine/core";

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
        <Text>Dawson Movie Solutions is a small team consisting of four<Space/>
        Dawson College Computer Science & Technology student developers: </Text>
        <List withPadding>
          <List.Item>Mikael Baril</List.Item>
          <List.Item>Daniel Lam</List.Item>
          <List.Item>Caelan Whitter</List.Item>
          <List.Item>Danilo Zhu (1943382)</List.Item>
        </List>
        <Text align="center" underline><a rel="noreferrer" target="_blank"
          href="https://gitlab.com/zhuxiaoj1/rengoku-dmdb/-/graphs/deploy">
            [View Contributors]</a></Text>
      </Modal>

      <footer>
        <div className="footSection">
          <div id="brandIcon">
            <a href="/"><Title className="title">DMDB</Title>
              <Title className="subtitle" order={5}>Dawson Movie Database</Title></a>
          </div>

          <Space h="sm"/>
          <Text color="gray">Browse thousands of popular movies and their details<Space/>
           or submit your own Hidden Gem</Text>

          <Space h="md"/>
          <Divider label="Built by" labelPosition="center"/>
          <Text color="gray" id="footContent">{"© Dawson Movie Solutions 2022"}</Text>
        </div>

        <div className="footSection">
          <Title order={4}>About the project</Title>
          <Text onClick={() => setAboutOpened(true)} color="gray">About Us</Text>
          <Space h="xl"/>
          <Title order={4}>Feedback</Title>
          <Text color="gray">Report a bug</Text>
        </div>

        <div className="footSection">
          <Title order={4}>Acknowledgements</Title>
          <Text color="gray">Images and Descriptions<Space/> fetched from</Text>
          <Space h="md"/>
          <a href="https://www.themoviedb.org/" rel="noreferrer" target="_blank">
            <Image src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_1-5bdc75aaebeb75dc7ae79426ddd9be3b2be1e342510f8202baf6bffa71d7f5c4.svg"/>
          </a>
        </div>
      </footer>
    </>
  )
}
import React from "react";
import { Title, Image, Space, Text, Divider } from "@mantine/core";

export default class Footer extends React.Component {
  render() {
    return (
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
          <Text color="gray">About Us</Text>
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
    )
  }
}
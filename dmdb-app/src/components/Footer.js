import React, { Component } from "react";
import { Title, Space, Text, Divider } from "@mantine/core";

export default class Footer extends Component {
    render() {
        return (
            <footer>
                <div className="footSection">
                <div id="brandIcon">
                    <a href="/home"><Title className="title">DMDB</Title>
                    <Title className="subtitle" order={5}>Dawson Movie Database</Title></a>
                </div>
                <Space h="sm"/>
                <Text color="gray">Browse thousands of popular movies and their details<Space/> or submit your own Hidden Gem</Text>

                <Space h="md"/>
                <Divider label="Built by" labelPosition="center"/>
                <Text color="gray" id="footContent">{"© Dawson Movie Solutions 2022"}</Text>
                </div>

                <div className="footSection">
                <Title order={4}>About the project</Title>
                <Text color="gray">About Us</Text>
                </div> 

                <div className="footSection">
                <Title order={4}>Feedback</Title>
                <Text color="gray">Report a bug</Text>
                </div>
            </footer>
        )
    }
}
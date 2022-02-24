import { useParams } from "react-router-dom";
import { useState } from 'react';
import { Title, Modal, Button } from '@mantine/core';

//This function is used to create a navigation page from the Movies component.
//It will hold the details of the movies for now.
export default function Movie() {
  let params = useParams();
  const [opened, setOpened] = useState(false);

  return (
    <div>
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title={params.movieName}
      size="xl"
    >
    <div id="movieDetails">
      <Title>{params.movieName}</Title>
      <p>This is the description of the movie.</p>
    </div>
    </Modal>
    <Title>{params.movieName}</Title><br/>
    <Button color="dark" onClick={() => setOpened(true)} variant="subtle">View Details</Button>
    </div>
    );
}
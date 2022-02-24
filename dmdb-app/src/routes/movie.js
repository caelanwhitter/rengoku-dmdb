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
    >
    <div id="movieDetails">
      <h2>This is the ID of the movie: {params.movieId}</h2>
      <h2>This is the name of the movie: {params.movieName}</h2>
      <h2>This is the gross amount of the movie: {params.movieGross}</h2>
      <h2>This is the rate of the movie: {params.movieRate}</h2>
    </div>
    </Modal>
    <Title>{params.movieName}</Title><br/>
    <Button color="dark" onClick={() => setOpened(true)} variant="subtle">View Details</Button>
    </div>
    );
}
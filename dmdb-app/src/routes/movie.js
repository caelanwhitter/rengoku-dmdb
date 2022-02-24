import { useParams } from "react-router-dom";
import { useState } from 'react';
import { getMovies } from "../data";
import { Title, Modal, Button } from '@mantine/core';

//This function is used to create a navigation page from the Movies component.
//It will hold the details of the movies for now.
export default function Movie() {
  let params = useParams();
  const movieList = getMovies();
  const [opened, setOpened] = useState(false);

  let current;
  movieList.forEach(i => {
    if (parseInt(params.movieId) === i.number) {
      current = {
        movieName: i.name,
        movieId: i.number
      }
    }
  });

  return (
    <div>
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title={current.movieName}
    >
    <div id="movieDetails">
      <h2>This is the ID of the movie: {current.movieId}</h2>
      <h2>This is the name of the movie: {current.movieName}</h2>
      <h2>This is the gross amount of the movie: {params.movieGross}</h2>
      <h2>This is the rate of the movie: {params.movieRate}</h2>
    </div>
    </Modal>
    <Title>{current.movieName}</Title><br/>
    <Button color="dark" onClick={() => setOpened(true)} variant="subtle">View Details</Button>
    </div>
    );
}
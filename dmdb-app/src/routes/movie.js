import { Link, NavLink, Outlet } from "react-router-dom";
import { useParams } from "react-router-dom";
import React, {useEffect, useState} from 'react'
import { Title, Modal, Button } from '@mantine/core';


//This function is used to create a navigation page from the Movies component.
//It will hold the details of the movies for now.
export default function Movie() {
  let params = useParams();
  const [opened, setOpened] = useState(false);
  const [backendData, setBackendData] = useState([{}])

  useEffect(()=> {
    fetch("/api/oneMovie?id=" + params.movieId).then(
      response => response.json()
    ).then(
      data => { 
        setBackendData(data[0])
      })
  }, [params.movieId])

  return (
    <div>
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title={backendData.title + " Details"}
      size="xl"
    >
    <div id="movieDetails">
      <Title>{backendData.title}</Title>
      <Title order={4}>Director: {backendData.director}</Title>
      <p>Genre: {backendData.genre}</p>
      <p>Rating: {backendData.rating}</p> <p>Score: {backendData.score}</p>
      <p>Duration: {parseInt(backendData.duration)} minutes</p>
      <p>This is the description of the movie.</p>
          <Title order={6}>Gross: {backendData.gross}</Title>
          <p><NavLink to={`reviews`}>View Reviews</NavLink></p>

    </div>
    </Modal>
    <Title>{backendData.title}</Title><br/>
      <Button color="dark" onClick={() => setOpened(true)} variant="subtle">View Details</Button>

    </div>
    );
}
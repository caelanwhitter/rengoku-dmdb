import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { Table, Spoiler, Textarea, TextInput, Button, Text, Box, Avatar, NumberInput } from '@mantine/core';


export default function Reviews() {
  let params = useParams();
  const [backendData, setBackendData] = useState([{}]);
  const [headline, setHeadline] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(3);
  const date = new Date().toLocaleDateString('en-us', {year:"numeric", month:"short", day:"numeric"}) 

  



  /**
     * useEffect() runs following methods once. Similar to ComponentDidMount()
     */
   useEffect(() => {
    fetchReviews();}, []);

  
      /**
     * fetchReviews() fetches list of reviews for specific movie
     * 
     */
  async function fetchReviews() {
         console.log("fetch")
        let response = await fetch('/api/oneMovie/reviews?id='+params.movieId);
        let moviesPaginationJson = await response.json();
        setBackendData(moviesPaginationJson);
  
  }
  
  async function insertReview() {

    // var xhr = new XMLHttpRequest();
    // xhr.open("POST", "/api/reviews", true);
    // xhr.setRequestHeader("Content-Type", "application/json");
    // xhr.send(JSON.stringify({
    //   username: "pop",
    //   movieId: params.movieId,
    //   content: content,
    //   rating: rating,
    //   datePosted: date,
    //   subtitle: headline
    // }));

    console.log("here");
    await fetch('/api/reviews', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: "",
        movieId: params.movieId,
        content: content,
        rating: rating,
        datePosted: date,
        subtitle: headline
      })
     })
  }

    const rows = backendData.map((element) => (
      <tr>
        <td><Avatar radius="xl"/></td>
        <td>{element.subtitle}</td>
        <Spoiler maxHeight={100} showLabel="Show more" hideLabel="Hide"><td>{element.content}</td></Spoiler>
        <td>{element.rating}</td>
        <td>{element.username}</td>
        <td>{element.datePosted}</td>
      </tr>
    ));
  

    return (
    
      <><Box sx={(theme) => ({
        textAlign: 'center',
        padding: theme.spacing.sm,
        margin: theme.spacing.xl,
        marginLeft: 400,
        marginRight: 400,
        border: 'solid 1px #000'
      })}>
        <Text underline align="center" size="xl">Your Rating and Review</Text>
        <TextInput value={headline} onChange={(event) => setHeadline(event.currentTarget.value)} sx={(theme) => ({
        textAlign: 'center',
          paddingLeft: theme.spacing.xl,
          paddingRight: theme.spacing.xl,

        marginTop: theme.radius.md,
      })} size="sm" radius="lg" placeholder="Headline for your review" label="Subtitle" required />
        <Textarea value={content} onChange={(event) => setContent(event.currentTarget.value)} sx={(theme) => ({
        textAlign: 'center',
          paddingLeft: theme.spacing.xl,
          paddingRight: theme.spacing.xl,

        marginTop: theme.radius.md,
      })}  textAlign="center" autosize radius="lg" placeholder="Write your review here" label="Your Review" required />
    
  
        <NumberInput value={rating} onChange={(val) => setRating(val)}
          label="Star Rating"
          placeholder="3"
          max={5}
          min={0}
        />
        <Button onClick={(event)=> insertReview()} sx={(theme) => ({
        textAlign: 'center',
        padding: theme.spacing.sm,
        marginTop: theme.radius.md,
        border: 'solid 1px #000'
      })} variant="gradient" gradient={{ from: 'orange', to: 'red', deg: 105 }}>Submit Review</Button>
      </Box>

        

        <Table highlightOnHover>
          <thead>
            <tr>
              
              <th>User</th>
              <th>Movie Subtitle</th>
              <th>Movie content</th>
              <th>Movie rating</th>
              <th>username</th>
              <th>date</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>

      </>

    );
  }
  
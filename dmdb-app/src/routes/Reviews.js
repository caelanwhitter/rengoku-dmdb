import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";

import { useParams } from "react-router-dom";
import {Spoiler, Textarea, TextInput, Button, Text, Box, Avatar, NumberInput , Group, Badge} from '@mantine/core';
import { TrashIcon } from "@radix-ui/react-icons";




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


  function refreshPage(){
    window.location.reload();
  } 
  
  async function deleteReview(id) {

    await fetch('/api/review/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: id,
      })
    }).then(refreshPage())

    
  }
  
  async function insertReview() {

  

      await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: "unknown",
          movieId: params.movieId,
          content: content,
          rating: rating,
          datePosted: date,
          subtitle: headline
        })
      }).then(refreshPage())
    
    
  }

 

  const reviews = backendData.map((element) => (
    
    <>
      
      <Box sx={(theme) => ({
        textAlign: 'center',
        padding: theme.spacing.sm,
        margin: theme.spacing.xl,
          border: 'solid 1px #000',
      })}>
          <Text underline weight={600}>{element.subtitle}</Text>
            <Badge size="xl" color="gray" >{element.rating}⭐</Badge>
        
        <Spoiler maxHeight={100} showLabel="Show more" hideLabel="Hide">
          {element.content} </Spoiler>
        <Group spacing="xl">
        <Link className="trashLink" id={element._id}  onClick={(event) => {deleteReview(event.target.id);}} to={{}}> <TrashIcon size="xl" id={element._id} /></Link>
          <Group position="right" >
            <Avatar/>
          <Text>{element.username}</Text>
          <Text>|</Text>
            <Text>{element.datePosted}</Text>
        </Group>
        </Group>

        </Box></>
    ));
  

    return (
    
      <>
              <div style={{ display: "flex" }}>
          
          
          <div style={{ width: "50%" }}>{reviews}</div>
    
        
        
        <Box sx={(theme) => ({
        textAlign: 'center',
        padding: theme.spacing.sm,
        margin: theme.spacing.xl,
          width: "50%",
            border: 'solid 1px #000',
            height: "50%",
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
            <Button onClick={() => {
              if (content=== "" || headline=== "") {
                document.getElementById("visible").style.visibility = "visible";
              } else {
            
                insertReview();
            
              }
            }} sx={(theme) => ({
        textAlign: 'center',
        padding: theme.spacing.sm,
        marginTop: theme.radius.md,
        border: 'solid 1px #000'
      })} variant="gradient" gradient={{ from: 'orange', to: 'red', deg: 105 }}>Submit Review</Button>
                    <h4 id="visible" style={{ color: "red", visibility: "hidden" }}>Please Fill Out Every Field</h4>

          </Box>
        </div>
        


        

 

      </>

    );
  }
  
import {
  Avatar, Badge, Box, Button, Group,
  NumberInput, Spoiler, Text, Textarea, TextInput
} from '@mantine/core';
import { TrashIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";





export default function Reviews() {
  //Initializes variables and sets up "settters to variables"
  let params = useParams();
  const [backendData, setBackendData] = useState([{}]);
  const [headline, setHeadline] = useState("");
  const [content, setContent] = useState("");
  const [movieTitle, setMovieTitle] = useState("");
  const [rating, setRating] = useState(3);
  const date = new Date().
    toLocaleDateString('en-us', { year: "numeric", month: "short", day: "numeric" })

  /**
  * useEffect() runs following methods once. Similar to ComponentDidMount()
  */
  useEffect(() => {
    getTitle(); fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  /**
 * fetchReviews() fetches list of reviews for specific movie
 * 
 */
  async function fetchReviews() {
    let response = await fetch('/api/oneMovie/reviews?id=' + params.movieId);
    let moviesPaginationJson = await response.json();
    setBackendData(moviesPaginationJson);
  }

  /**
   * Get the title of the movie
   */
  async function getTitle() {
    let response = await fetch('/api/oneMovie?id=' + params.movieId);
    let movieTitle = await response.json();
    setMovieTitle(movieTitle[0].title);

  }

  /**
   * function that refreshes the page
   */
  function refreshPage() {
    window.location.reload();
  }

  /**
   * deleteReview(id) does a DELETE request with a specific id 
   * so that it deletes that review from mongo
   * @param {String} id 
   */
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
  /**
   * insertReview() does a POST request to insert a review into the database
   */
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


  /**
   * reach review is put into a box and styled accordingly
   */
  const reviews = backendData.map((element) =>

    <>

      <Box sx={(theme) => ({
        backgroundColor: "#f6f6f5",
        textAlign: 'center',
        padding: theme.spacing.sm,
        margin: theme.spacing.xl,
        border: 'solid 1px #000',
      })}>
        <Text underline size="lg" weight={500}>{element.subtitle}</Text>
        <Badge sx={(theme) => ({ margin: "10px" })} 
          size="xl" color="dark" >{element.rating}⭐</Badge>

        <Spoiler maxHeight={100} showLabel="Show more"
          hideLabel="Hide"> {element.content} </Spoiler>

        <Group position="center" >
          <Avatar />
          <Text>{element.username}</Text>
          <Text>|</Text>
          <Text>{element.datePosted}</Text>
        </Group>
        <Link className="trashLink" id={element._id} onClick={(event) => {
          deleteReview(event.target.id);
        }} to={{}}> <TrashIcon size="xl" id={element._id} /></Link>
        
      </Box></>
  );


  return (

    <>
      <Text sx={(theme) => ({ paddingTop: "10px", fontSize: "300%" })}
        weight={700} underline align="center">{movieTitle}</Text>
      <div style={{ display: "flex" }}>
        <div style={{ width: "50%" }}>{reviews}</div>

        <Box sx={(theme) => ({
          backgroundColor: "#f6f6f5",
          textAlign: 'center',
          padding: theme.spacing.sm,
          margin: theme.spacing.xl,
          width: "50%",
          border: 'solid 1px #000',
          height: "50%",
        })}>
          <Text weight={500} underline align="center" size="xl">Your Rating and Review</Text>
          <TextInput value={headline}
            onChange={(event) => setHeadline(event.currentTarget.value)}
            sx={(theme) => ({
              textAlign: 'center',
              paddingLeft: theme.spacing.xl,
              paddingRight: theme.spacing.xl,

              marginTop: theme.radius.md,
            })} size="sm" radius="lg" placeholder="Headline for your review"
            label="Subtitle" required />

          <Textarea id="headline" value={content}
            onChange={(event) => setContent(event.currentTarget.value)}
            sx={(theme) => ({
              paddingTop: "10px",
              textAlign: 'center',
              paddingLeft: theme.spacing.xl,
              paddingRight: theme.spacing.xl,

              marginTop: theme.radius.md,
            })} textAlign="center" autosize radius="lg" placeholder="Write your review here"
            label="Your Review" required />


          <NumberInput sx={(theme) => ({
            width: "25%", margin: "auto", padding: "10px"
          })} value={rating} onChange={(val) => setRating(val)}
          label="Star Rating"
          placeholder="3"
          max={5}
          min={0}
          />
          <Button onClick={() => {
            if (content === "" || headline === "") {
              document.getElementById("visible").style.visibility = "visible";
            } else {

              insertReview();

            }
          }} sx={(theme) => ({
            textAlign: 'center',
            padding: theme.spacing.sm,
            marginTop: theme.radius.md,
            border: 'solid 1px #000'
          })} variant="gradient"
          gradient={{ from: 'orange', to: 'red', deg: 105 }}>Submit Review</Button>

          <h4 id="visible"
            style={{ color: "red", visibility: "hidden" }}>Please Fill Out Every Field</h4>
        </Box>
      </div>
    </>
  );
}

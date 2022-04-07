import {
  Alert, Avatar, Badge, Box, Button, Drawer, Group,
  LoadingOverlay, Modal, NumberInput, Spoiler, Text,
  Textarea, TextInput, Title, useMantineTheme
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { TrashIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import { z } from 'zod';

/**
 * Return fully-featured Reviews component
 * @returns Reviews functional component
 */
export default function Reviews() {
  //Initializes variables and sets up "settters to variables"
  let params = useParams();
  const theme = useMantineTheme();
  const [backendData, setBackendData] = useState([{}]);
  const [movieTitle, setMovieTitle] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [source, setSource] = useState("");
  const [openedDel, setOpenedDel] = useState(false);
  const [openedSub, setOpenedSub] = useState(false);
  const [openedReview, setOpenedReview] = useState(false);
  const [deletedBox, setDeletedBox] = useState("");
  const [deletedData, setDeletedData] = useState("");
  const [loading, setLoading] = useState(false);

  // Date formatting
  const date = new Date().
    toLocaleDateString('en-us', { year: "numeric", month: "short", day: "numeric" });

  /**
  * useEffect() runs functions once. Similar to ComponentDidMount()
  */
  useEffect(() => {
    getTitle(); fetchReviews(); getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * fetchReviews() fetches list of reviews for specific movie
   */
  async function fetchReviews() {
    setLoading((v) => !v);
    let response = await fetch('/api/oneMovie/reviews?id=' + params.movieId);
    let moviesPaginationJson = await response.json();
    setBackendData(moviesPaginationJson);
    setLoading((v) => !v);
  }

  /**
   * Get the title of the movie matching the ID
   */
  async function getTitle() {
    let response = await fetch('/api/oneMovie?id=' + params.movieId);
    let movieTitle = await response.json();
    setMovieTitle(movieTitle[0].title);
  }

  /**
   * deleteReview(id) does a DELETE request with a specific id 
   * so that it deletes that review from mongo
   * @param {String} id Review ID
   */
  async function deleteReview() {
    deletedBox.remove();
    setOpenedDel(false);
    await fetch('/api/review/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: deletedData,
      })
    });
  }

  /**
   * insertReview() does a POST request to insert a review into the database
   */
  async function insertReview(values) {
    await fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        email: email,
        source: source,
        movieId: params.movieId,
        content: values.content,
        rating: values.rating,
        datePosted: date,
        subtitle: values.headline
      })
    }).then(window.location.reload())
  }

  /**
   * Get the username, email and image src from local storage
   */
  async function getUser() {
    const tokenString = localStorage.getItem("token");
    if (tokenString !== null) {
      const userToken = JSON.parse(tokenString);

      setUsername(userToken.name);
      setEmail(userToken.email);
      setSource(userToken.source);
    }
  }

  /**
   * Each review is put into a box and styled accordingly
   */
  const reviews = backendData.map((element) =>
    <>
      <Box key={element._id} sx={(theme) => ({
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
          <Avatar src={element.source} />
          <Text>{element.username}</Text>
          <Text>|</Text>
          <Text>{element.datePosted}</Text>
        </Group>
        {element.email === email &&
          <div id={element._id}><TrashIcon className="trashLink" onClick={(event) => {
            setDeletedBox(document.getElementById(event.target.id).parentElement)
            setDeletedData(event.target.id)
            setOpenedDel(true)
          }} to={{}} size="xl" id={element._id} /></div>
        }
      </Box>
    </>
  );

  /**
   * Schema for the form to follow
   */
  const schema = z.object({
    // eslint-disable-next-line max-len
    headline: z.string().min(5, { message: 'Name should have at least 2 letters' }).max(50, { message: 'Headline should be less than 50 characters' }),
    // eslint-disable-next-line max-len
    content: z.string().max(10000, { message: 'Your review is too long. It needs to contain less than 5000 characters.' }),
  });

  /**
   * Set initial values to the form
   */
  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      headline: '',
      content: '',
      rating: '',
    }
  });

  /**
   * Check if the person is logged in by checking the local storage
   */
  let isLoggedIn = false;
  if (localStorage.getItem("token") !== null) {
    isLoggedIn = true;
  }

  return (
    <>
      {isLoggedIn ?
        <Text align="center" className="reviewLink" size="xl"
          onClick={() => setOpenedReview(true)}>+ Add New Review</Text> :
        <Text align="center" className="reviewLink" size="xl" component={Link}
          to="/profile">+ Login to Add New Review</Text>}

      <Modal
        transition="slide-right"
        size="md"
        centered
        overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
        overlayOpacity={0.95}
        opened={openedDel}
        onClose={() => setOpenedDel(false)}
        title="Are you sure you want to DELETE your review?"
      >
        <Group grow>
          <Button color="green" onClick={() => deleteReview()}>Yes</Button>
          <Button color="red" onClick={() => setOpenedDel(false)}> No </Button>
        </Group>

      </Modal>
      <Modal
        transition="slide-left"
        size="md"
        centered
        overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
        overlayOpacity={0.95}
        opened={openedSub}
        onClose={() => setOpenedSub(false)}
        title="Are you sure you want to SUBMIT your review?"
      >
        <Group grow>
          <Button color="green" onClick={() => insertReview()}>Yes</Button>
          <Button color="red" onClick={() => setOpenedSub(false)}> No </Button>
        </Group>

      </Modal>
      <Text sx={(theme) => ({ paddingTop: "10px", fontSize: "300%" })}
        weight={700} underline align="center">{movieTitle}</Text>
      {reviews.length === 0 ?
        <div style={{ display: "flex" }}>
          <Alert sx={(theme) => ({ margin: "auto", width: "70%" })}
            title="No Reviews!" color="gray">
            This is Terrible! Add some of your own to fill up the page!
          </Alert>
        </div>
        :
        <div style={{ display: "flex" }}>
          <div style={{ margin: "auto", width: "70%" }}>{reviews}</div>
        </div>
      }

      <Drawer
        opened={openedReview}
        onClose={() => setOpenedReview(false)}
        title={<Title order={1}>Add New Review</Title>}
        padding="lg"
        size="45%"
      >
        <Text color="red">All fields with an asterisk (*) are required.</Text>
        <form onSubmit={form.onSubmit((values) => insertReview(values))}>
          <Group
            direction="column"
            grow
          >

            <TextInput
              placeholder="Headline"
              label="Review Headline"
              description="Headline of your Review"
              required
              {...form.getInputProps('headline')}
            />

            <Textarea
              placeholder="Content"
              label="Review Description"
              description="How did you find the movie?"
              required
              {...form.getInputProps('content')}
            />

            <NumberInput sx={(theme) => ({
              width: "25%", margin: "auto", padding: "10px"
            })}
            label="Star Rating"
            required
            max={5}
            min={0}
            {...form.getInputProps('rating')}
            />

            <Button type="submit" color="dark">Submit</Button>
          </Group>
        </form>
      </Drawer>
      <LoadingOverlay loaderProps={{ color: 'dark', variant: 'dots' }}
        visible={loading} />
    </>
  );
}

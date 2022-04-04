import {
  Avatar, Badge, Box, Button, Drawer, Group,
  NumberInput, Spoiler, Text, Textarea,
  TextInput, Modal, useMantineTheme, Title,
} from '@mantine/core';
import { TrashIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useForm,  zodResolver} from '@mantine/form';
import { z } from 'zod';




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
  

  

  const date = new Date().
    toLocaleDateString('en-us', { year: "numeric", month: "short", day: "numeric" })

  /**
  * useEffect() runs following methods once. Similar to ComponentDidMount()
  */
  useEffect(() => {
    getTitle(); fetchReviews(); getUser();
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
    })


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
    }).then(refreshPage())
  }

  async function getUser() {
    const tokenString = localStorage.getItem("token");
    const userToken = JSON.parse(tokenString);
    

    setUsername(userToken.name);
    setEmail(userToken.email);
    setSource(userToken.source);

  }



  /**
   * each review is put into a box and styled accordingly
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
          <Avatar src={element.source}/>
          <Text>{element.username}</Text>
          <Text>|</Text>
          <Text>{element.datePosted}</Text>
        </Group>
        {element.email === email &&
          <div id={element._id}><TrashIcon className="trashLink" onClick={(event) => {
            setDeletedBox(document.getElementById(event.target.id).parentElement)
            setDeletedData(event.target.id)
            setOpenedDel(true)
          }} to={{}}size="xl" id={element._id} /></div>
        }


   
        
        
      </Box></>
  );

  const schema = z.object({
    // eslint-disable-next-line max-len
    headline: z.string().min(5, { message: 'Name should have at least 2 letters' }).max(50, {message: 'Headline should be less than 50 characters'}),
    // eslint-disable-next-line max-len
    content: z.string().min(150, { message: 'Your review is too short. It needs to contain at least 150 characters.' }),
  });


  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      headline: '',
      content: '',
      rating: '',
    },

    // validate: {
    //   link: (value) => /^((http|https):\/\/)(www.)?(youtube|dailymotion|vimeo).com/g.test(value)
    //     ? null : 'Invalid link!',
    // },
  });


  let isLoggedIn = false;
  if (localStorage.getItem("token") !== null) {
    isLoggedIn = true;
  }
  return (
    <>
      {isLoggedIn ?
        <Text className="tabLink" size="xl"
          onClick={() => setOpenedReview(true)}>+ Add New Review</Text> :
        <Text className="tabLink" size="xl" component={Link}
          to="/profile">+ Add New Hidden Gem</Text>}

          

      <Modal
        transition="slide-right"
        size="md"
        centered
        overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
        overlayOpacity={0.95}
        opened={openedDel}
        onClose={() => setOpenedDel(false)}
        title="Are you sure you want to Delete your review?"
      >
        <Group grow>
          <Button color="green" onClick={() => deleteReview()}>Yes</Button>
          <Button color="red"onClick={() => setOpenedDel(false)}> No </Button>
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
        title="Are you sure you want to Submit your review?"
      >
        <Group grow>
          <Button color="green" onClick={() => insertReview()}>Yes</Button>
          <Button color="red" onClick={() => setOpenedSub(false)}> No </Button>
        </Group>
      
      </Modal>
      <Text sx={(theme) => ({ paddingTop: "10px", fontSize: "300%" })}
        weight={700} underline align="center">{movieTitle}</Text>
      <div style={{ display: "flex" }}>
        <div style={{ margin: "auto", width:"70%"}}>{reviews}</div>
      </div>
    
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
    </>
  );
}






// {isLoggedIn ?
//   <Box sx={(theme) => ({
//     backgroundColor: "#f6f6f5",
//     textAlign: 'center',
//     padding: theme.spacing.sm,
//     margin: theme.spacing.xl,
//     width: "50%",
//     border: 'solid 1px #000',
//     height: "50%",
//   })}>
//     <Text weight={500} underline align="center" size="xl">Your Rating and Review</Text>
//     <TextInput value={headline}
//       onChange={(event) => setHeadline(event.currentTarget.value)}
//       sx={(theme) => ({
//         textAlign: 'center',
//         paddingLeft: theme.spacing.xl,
//         paddingRight: theme.spacing.xl,

//         marginTop: theme.radius.md,
//       })} size="sm" radius="lg" placeholder="Headline for your review"
//       label="Subtitle" required />

//     <Textarea value={content}
//       onChange={(event) => setContent(event.currentTarget.value)}
//       sx={(theme) => ({
//         paddingTop: "10px",
//         textAlign: 'center',
//         paddingLeft: theme.spacing.xl,
//         paddingRight: theme.spacing.xl,

//         marginTop: theme.radius.md,
//       })} textAlign="center" autosize radius="lg" placeholder="Write your review here"
//       label="Your Review" required />


//     <NumberInput sx={(theme) => ({
//       width: "25%", margin: "auto", padding: "10px"
//     })} value={rating} onChange={(val) => setRating(val)}
//     label="Star Rating"
  
//     max={5}
//     min={0}
//     />
//     <Button onClick={submitReview} sx={(theme) => ({
//       textAlign: 'center',
//       padding: theme.spacing.sm,
//       marginTop: theme.radius.md,
//       border: 'solid 1px #000'
//     })} variant="gradient"
//     gradient={{ from: 'orange', to: 'red', deg: 105 }}>Submit Review</Button>

//     <h4 id="visible"
//       style={{ color: "red", visibility: "hidden" }}>Please Fill Out Every Field</h4>
//   </Box> :
//   <Box sx={(theme) => ({
//     backgroundColor: "#f6f6f5",
//     textAlign: 'center',
//     padding: theme.spacing.sm,
//     margin: theme.spacing.xl,
//     width: "50%",
//     border: 'solid 1px #000',
//     height: "50%",
//   })}><Text sx={(theme) => ({ paddingTop: "10px", fontSize: "300%" })}
//       weight={300} align="center">
//       Please <NavLink style={{ textDecoration: 'none', color: 'blue' }} to={`/profile`}>
//         Login</NavLink> to make a review!!</Text>
//   </Box>}
import {
  Badge, Button, Card, Drawer, Grid, Group,
  LoadingOverlay, Modal, NativeSelect, NumberInput, Select,
  Space, Text, Textarea, TextInput, Title
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import '../App.css';

/**
 * Return fully-featured Hidden Gem page.
 * @returns HiddenGems page
 */
export default function HiddenGems() {
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [addOpened, setAddOpened] = useState(false);
  const [searchopened, setSearchOpened] = useState(false);
  const [hiddenGemData, setHiddenGemData] = useState({});
  const [submissions, setSubmissions] = useState([{}]);
  const [userid, setUserid] = useState("");

  /**
   * React useEffect to get user ID and fetch all HiddenGems.
   */
  useEffect(() => {
    getUser();
    fetchAllHiddenGems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Get user id if logged in.
   */
  const getUser = async () => {
    if (localStorage.getItem("token") !== null) {
      const tokenString = localStorage.getItem("token");
      const userToken = JSON.parse(tokenString);

      setUserid(userToken._id);
    }
  }

  /**
   * Fetch all Hidden Gems to display on page.
   */
  const fetchAllHiddenGems = async () => {
    setLoading(v => !v);
    let response = await fetch('/api/hiddengems');
    let hiddenGemsJSON = await response.json();
    setSubmissions(hiddenGemsJSON);
    setLoading(v => !v);
  }

  const searchHiddenGems = async (values) => {
    setLoading(v => !v);
    console.log(`api/hiddengems/search?title=${values.title}&director=${values.director}&rating=${values.rating}&genre=${values.genre}`);
    // eslint-disable-next-line max-len
    let response = await fetch(`api/hiddengems/search?title=${values.title}&director=${values.director}&rating=${values.rating}&genre=${values.genre}`);
    console.log(await response.json());
    setLoading(v => !v);
  }

  /**
   * Insert new submission into database from form values and refresh.
   * @param {Object} values Form values
   */
  const insertSubmission = async (values) => {
    await fetch('api/hiddengems', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: values.title,
        director: values.director,
        description: values.description,
        duration: values.duration,
        releaseDate: values.releaseDate.toLocaleString('en-US',
          { day: "numeric", month: "short", year: "numeric" }),
        link: values.link,
        rating: values.rating,
        genre: values.genre,
        userid: values.userid
      })
    });
    window.location.reload();
  }

  /**
   * Delete submission from database with ID and refresh page.
   * @param {String} id Hidden Gem ID
   */
  const deleteSubmission = async (id) => {
    await fetch('/api/hiddengems', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: id,
      })
    });
    window.location.reload();
  }

  /**
   * Fetch specific Hidden Gem with ID.
   * @param {String} id Hidden Gem ID
   */
  const fetchHiddenGemDetails = async (id) => {
    await fetch("/api/hiddengems?id=" + id).then(
      response => response.json()).
      then(
        data => {
          data.forEach(hg => {
            if (hg._id === id) {
              setHiddenGemData(hg);
            }
          });
        }
      )
    setModalLoading(v => !v);
  }

  /**
   * Assign Card component and Grid Column to each Hidden Gem on page.
   */
  let cards = submissions.map((elem) => {
    return (
      <Grid.Col key={elem._id} span={3}>
        <Card key={elem._id} onClick={() => {
          setModalLoading(v => !v);
          fetchHiddenGemDetails(elem._id);
          setOpened(true);
        }}
        style={{ cursor: "pointer" }} shadow="md" withBorder={true}>

          <Text weight={600}>{elem.title}</Text>
          <Group position="apart">
            <Text size="sm">{elem.director}</Text>
            <Badge color="dark">{elem.releaseDate}</Badge>
          </Group>
        </Card>
      </Grid.Col>
    );
  });

  /**
   * Form template
   */
  const form = useForm({
    initialValues: {
      title: '',
      director: '',
      description: '',
      duration: null,
      rating: '',
      releaseDate: '',
      link: '',
      genre: '',
      userid: ''
    },

    validate: {
      // Allow only YouTube, Dailymotion and Vimeo full links.
      link: (value) => /^((http|https):\/\/)(www.)?(youtube|dailymotion|vimeo).com/g.test(value)
        ? null : 'Invalid link!',
    },
  });

  const searchForm = useForm({
    initialValues: {
      title: '',
      director: '',
      rating: '',
      genre: ''
    }
  });

  return (
    <>
      <nav id="searchNav">
        <Link className="tabLink"
          onClick={() => setSearchOpened(true)} to={{}}> <MagnifyingGlassIcon /> Search</Link>
        {localStorage.getItem("token") !== null ?
          <Text className="tabLink" size="xl"
            onClick={() => setAddOpened(true)}>+ Add New Hidden Gem</Text>
          :
          <Text className="tabLink" size="xl" component={Link}
            to="/profile">Login To Add Hidden Gem</Text>}
      </nav>

      {/* Search Modal */}
      <Modal
        opened={searchopened}
        onClose={() => setSearchOpened(false)}
        hideCloseButton
      >
        <form onSubmit={searchForm.onSubmit((values) => searchHiddenGems(values))}>
          <Group grow
            direction="column">
            <TextInput
              label="Title"
              placeholder="Enter the title"
              size="md"
              {...searchForm.getInputProps('title')}
            />

            <TextInput
              label="Director"
              placeholder="Enter the Director"
              size="md"
              {...searchForm.getInputProps('director')}
            />

            <TextInput
              label="Genre"
              placeholder="Enter the Genre"
              size="md"
              {...searchForm.getInputProps('genre')}
            />

            <NativeSelect
              label="Rating"
              data={['', 'R', 'PG', 'PG-13']}
              size="md"
              placeholder="Select a Rating"
              {...searchForm.getInputProps('rating')}
            />
          </Group>
          <Space h="md"/>
          <Button
            color="dark"
            type="submit">
            Go!
          </Button>
        </form>
      </Modal>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={<Title>{hiddenGemData.title}</Title>}
        size="xl"
        overflow="inside"
        centered
      >
        <LoadingOverlay loaderProps={{ color: 'dark', variant: 'dots' }}
          visible={modalLoading} />
        <div id="movieDetails">
          <div id="movieText">
            <Title order={4}>Director:
              {hiddenGemData.director ? hiddenGemData.director : " Unknown"}</Title>
            <Group position="left">
              <Badge color="dark">{hiddenGemData.genre}</Badge>
              <Badge color="dark"
                variant="outline">
                {hiddenGemData.duration ? hiddenGemData.duration : "Unknown"} minutes</Badge>
              <Badge color="gray" variant="outline">Rated {hiddenGemData.rating}</Badge>
            </Group>

            <Space h="md" />
            <Text>{hiddenGemData.description ? hiddenGemData.description :
              "No description provided."}</Text>
            <Space h="xl" />
            <Group>
              <Button component="a" rel="noreferrer" target="_blank"
                href={hiddenGemData.link} color="dark">View Movie</Button>
              {hiddenGemData.userid === userid &&
                <Button color="red" id={hiddenGemData._id}
                  onClick={(e) => deleteSubmission(e.currentTarget.id)} uppercase>Delete</Button>}
            </Group>
          </div>
        </div>
      </Modal>

      <Drawer
        opened={addOpened}
        position="right"
        onClose={() => setAddOpened(false)}
        title={<Title order={2}>Add New Hidden Gem</Title>}
        padding="lg"
        size="40%"
      >
        <Text color="red">All fields with an asterisk (*) are required.</Text>
        <form onSubmit={form.onSubmit((values) => insertSubmission(values))}>
          <Group
            direction="column"
            grow
          >
            <Group grow>
              <TextInput
                placeholder="Title"
                label="Hidden Gem Title"
                description="Title of the movie"
                required
                {...form.getInputProps('title')}
              />

              <TextInput
                placeholder="Director"
                label="Hidden Gem Director"
                description="Director of the movie"
                {...form.getInputProps('director')}
              />
            </Group>

            <Textarea
              placeholder="Description"
              label="Hidden Gem Description"
              description="Describe your movie"
              {...form.getInputProps('description')}
            />

            <Group grow>
              <NumberInput
                label="Hidden Gem Duration"
                description="Duration of the movie in minutes"
                placeholder="Duration"
                max={500}
                min={10}
                step={10}
                {...form.getInputProps('duration')}
              />

              <Select
                data={['PG', 'PG-13', 'R']}
                placeholder="Age Rating"
                label="Hidden Gem Age Rating"
                description="Age rating of the movie"
                color="dark"
                required
                {...form.getInputProps('rating')}
              />

              <Select
                data={['Adventure', 'Action', 'Comedy', 'Romance', 'Horror', 'Thriller']}
                placeholder="Genre"
                label="Hidden Gem Genre"
                description="Genre of the movie"
                color="dark"
                required
                {...form.getInputProps('genre')}
              />
            </Group>

            <Group grow>
              <DatePicker
                placeholder="Release Date"
                label="Hidden Gem Release Date"
                description="Release date of the movie"
                required
                {...form.getInputProps('releaseDate')}
              />

              <TextInput
                placeholder="Link"
                label="Hidden Gem Link"
                description="Youtube, Vimeo or Dailymotion link only"
                required
                {...form.getInputProps('link')}
              />
            </Group>
            <Button type="submit" onClick={() => form.setFieldValue('userid', userid)}
              color="dark">Submit</Button>
          </Group>
        </form>
      </Drawer>

      <LoadingOverlay loaderProps={{ color: 'dark', variant: 'dots' }}
        visible={loading} />
      <Grid className="movieGrid" gutter={80}>
        {cards}
      </Grid>
    </>
  );
}
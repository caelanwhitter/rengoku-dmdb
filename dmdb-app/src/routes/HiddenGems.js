import {
  Badge, Button, Card, Drawer, Grid, Group,
  Modal, NativeSelect, NumberInput, Select,
  Space, Text, Textarea, TextInput, Title
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useState } from 'react';
import { Link } from "react-router-dom";
import '../App.css';

//This function is used to display the hiddenGems page
export default function HiddenGems() {
  const [opened, setOpened] = useState(false);
  const [addOpened, setAddOpened] = useState(false);
  const [searchopened, setSearchOpened] = useState(false);

  let elems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  let cards = elems.map((elem) => {
    return (
      <Grid.Col key={elem} span={3}>
        <Card onClick={() => {
          setOpened(true)
        }}
        style={{ cursor: "pointer" }} shadow="md" withBorder={true}>

          <Text weight={600}>Hidden Gem {elem}</Text>
          <Group position="apart">
            <Text size="sm">Poster {elem}</Text>
            <Badge color="dark">2022</Badge>
          </Group>
        </Card>
      </Grid.Col>
    );
  });

  return (
    <>
      <nav id="searchNav">
        <Link className="tabLink"
          onClick={() => setSearchOpened(true)} to={{}}> <MagnifyingGlassIcon /> Search</Link>
        <Text className="tabLink" size="xl"
          onClick={() => setAddOpened(true)}>+ Add New Hidden Gem</Text>
      </nav>

      <Modal
        opened={searchopened}
        onClose={() => setSearchOpened(false)}
        hideCloseButton
      >
        <TextInput
          label="Title"
          placeholder="Enter the title"
          //variant="unstyled"
          size="md"
          radius="md"
          required
        />

        <TextInput
          label="Director"
          placeholder="Enter the Director"
          //variant="unstyled"
          size="md"
          radius="md"
          required
        />

        <TextInput
          label="Genre"
          placeholder="Enter the Genre"
          //variant="unstyled"
          size="md"
          radius="md"
          required
        />

        <TextInput
          label="Release Year "
          placeholder="Enter the Release Year"
          //variant="unstyled"
          size="md"
          radius="md"
          required
        />

        <TextInput
          label="Score"
          placeholder="Enter the Score "
          // variant="unstyled"
          size="md"
          radius="md"
          required
        />

        <NativeSelect
          label="Rating"
          data={['R', 'PG', 'PG-13']}
          placeholder="Select a Rating"
        />
        <br />
        <Button
          color="dark"
          type="submit">
          Go!
        </Button>
      </Modal>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={<Title>Title</Title>}
        size="xl"
        overflow="inside"
        centered
      >
        <div id="movieDetails">
          <div id="movieText">
            <Title order={4}>Poster: John Doe</Title>
            <Group position="left">
              <Badge color="dark">Genre</Badge>
              <Badge color="dark"
                variant="outline">Duration</Badge>
              <Badge color="gray" variant="outline">Rating?</Badge>
              <Badge color="yellow" variant="dot">Score ⭐</Badge>

            </Group>
            <p>The quick brown fox jumps over the lazy dog.</p>

            {/* <Badge variant="gradient" gradient={{ from: 'teal', to: 'lime', deg: 105 }}>
              <NavLink style={{ textDecoration: 'none', color: 'black' }}
                to={null}>View Reviews</NavLink></Badge> */}
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
        <Group
          direction="column"
          grow
        >
          <Group
            direction="row"
            grow
          >
            <TextInput
              placeholder="Title"
              label="Hidden Gem Title"
              description="Title of the movie"
              required
            />

            <TextInput
              placeholder="Director"
              label="Hidden Gem Director"
              description="Director of the movie"
            />
          </Group>
          
          <Textarea
            placeholder="Description"
            label="Hidden Gem Description"
            description="Describe your movie"
          />

          <Group
            direction="row"
            grow
          >
            <NumberInput
              label="Hidden Gem Duration"
              description="Duration of the movie in minutes"
              placeholder="Duration"
              max={500}
              min={10}
              step={10}
            />

            <Select
              data={['PG', 'PG-13', 'R']}
              placeholder="Age Rating"
              label="Hidden Gem Age Rating"
              description="Age rating of the movie"
              required
            />
          </Group>

          <Group grow>
            <DatePicker
              placeholder="Release Date"
              label="Hidden Gem Release Date"
              description="Release date of the movie"
              required
            />

            <TextInput
              placeholder="Link"
              label="Hidden Gem Link"
              description="Link to the movie"
              required
            />
          </Group>
          <Button color="dark">Submit</Button>
        </Group>
      </Drawer>

      <Grid className="movieGrid" gutter={80}>
        {cards}
      </Grid>

      {/* <div id="pagination">
        <Pagination page={activePage} onChange={changePage} 
          total={totalPagination} color="dark" sibilings={1} withEdges />
      </div> */}
    </>
  );
}
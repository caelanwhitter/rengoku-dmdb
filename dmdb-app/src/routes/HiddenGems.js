import {
  Badge, Button, Card, Grid, Group,
  Modal, NativeSelect, Text, TextInput, Title
} from '@mantine/core';
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useState } from 'react';
import { Link } from "react-router-dom";
import '../App.css';

//This function is used to display the hiddenGems page
export default function HiddenGems() {
  const [opened, setOpened] = useState(false);
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
import {
  Avatar, Modal, Group, Button, Card, Container,
  LoadingOverlay, Space, Text, Title, Textarea
} from "@mantine/core";
import { useEffect, useState } from 'react';
import GoogleLogin from 'react-google-login';
import '../App.css';

export default function Profile() {

  const [, setLogoutMessage] = useState()

  const [loading, setLoading] = useState(false);
  const [opened, setOpened] = useState(false);
  const [bio, setBio] = useState("");
  const [name, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [source, setSource] = useState("");

  // /**
  // * useEffect() runs following methods once. Similar to ComponentDidMount()
  // */
  // useEffect(() => {
  //   getUser();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  
  /**
   * function that refreshes the page
   */
  function refreshPage() {
    window.location.reload();
  }

  const handleFailed = (result) => {
    console.log("Login failed" + result);
    //alert(result);
  };
  
  const handleLogin = async (googleData) => {
    setLoading(v => !v);
    const res = await fetch('/api/google-login', {
      method: 'POST',
      body: JSON.stringify({
        token: googleData.tokenId,
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      }
    });

    getUser();
    
    setLoading(v => !v);
    refreshPage()
  };
  
  /**
   * Get the username, email and image src from session key
   */
  async function getUser() {

    let response = await fetch('/api/useSession');
    let userSession = await response.json();
    console.log(userSession);
    setUsername(userSession[0].name);
    setEmail(userSession[0].email);
    setSource(userSession[0].source);
    setBio(userSession[0].biography)
    
  }

  const handleLogout = async response => {
    setLoading(v => !v);
    const res = await fetch("/api/v1/auth/logout", {
      method: "DELETE",
   
    })
    const data = await res.json()
    setLogoutMessage(data.message);
    setLoading(v => !v);
  }


  async function submitBio(){
    setOpened(false)
    await getUser();
    const res = await fetch('/api/biography', {
      method: 'POST',
      body: JSON.stringify({
        email: email,
        biography: bio
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      }
    });


  }
  let isLoggedIn = false;
  if ( email !== null) {
    isLoggedIn = true;
  }
  return (
    <div className="centered">
      <Container>
        <LoadingOverlay loaderProps={{ color: 'dark', variant: 'dots' }}
          visible={loading} />
        {
          isLoggedIn ?
            <Container>
              <Space h="md" />
              <Title>Welcome to your page, {name}!</Title>
              <Text color="gray">Logged in with {email}</Text>
              <Space h="md" />

              <Card shadow="md" withBorder>
                <Avatar src={source} color="dark" radius="xl" size="xl" />
                <Space h="sm" />

                <Text size="lg" weight="bold">{name}</Text>
                <Group
                  noWrap={true}
                >
                  <Text><em>{bio}</em></Text>
                </Group>
                <Space h="xs" />

                <Button 
                  onClick={() => setOpened(true)}
                  color="dark" 
                  size="xs" 
                  compact uppercase>
                    Edit bio
                </Button>
                <Modal
                  opened={opened}
                  onClose={()=>setOpened(false)}
                  title="Tell us about yourself!">
                  <Textarea
                    onChange={(event) => setBio(event.currentTarget.value)}
                    value={bio} 
                    placeholder="Write your biography here!"
                    label="Biography"
                    required
                  />
                  <Button color="dark" sx={(theme) => ({ marginTop: "15px"})} onClick={submitBio}
                  >
                    Submit
                  </Button>
                </Modal>

                <Space h="md" />
                <Container className="centered">
                  <Button color="red"
                    onClick={handleLogout} uppercase variant="filled">Logout</Button>
                </Container>
              </Card>
              <Space h="md" />
            </Container>
            :
            <Container>
              <Space h="md" />
              <Card className="centered" shadow="md" withBorder>
                <Title order={2}>Please login with your Google account</Title>
                <Space h="xl" />
                <GoogleLogin
                  clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                  buttonText="Log in with Google"
                  onSuccess={handleLogin}
                  onFailure={handleFailed}
                  cookiePolicy={'single_host_origin'}
                />
              </Card>
              <Space h="md" />
            </Container>
        }
      </Container>
    </div>
  )
}
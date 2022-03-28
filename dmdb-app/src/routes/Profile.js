import { Avatar, Button, Card, Container, LoadingOverlay, Space, Text, Title } from "@mantine/core";
import { useState } from 'react';
import GoogleLogin from 'react-google-login';
import '../App.css';

export default function Profile() {
  const [loginData, setLoginData] = useState(
    localStorage.getItem('loginData')
      ? JSON.parse(localStorage.getItem('loginData'))
      : null
  );
  const [loading, setLoading] = useState(false);

  const handleFailed = (result) => {
    console.log("login failed");
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
      },
    });

    const data = await res.json();
    setLoginData(data);
    localStorage.setItem('loginData', JSON.stringify(data));
    setLoading(v => !v);
  };

  const handleLogout = () => {
    setLoading(v => !v);
    localStorage.removeItem('loginData');
    setLoginData(null);
    setLoading(v => !v);
  }
  // async function fetchPicture(picture)
  // {
  //   let response = await fetch(picture);
  //   if (response.ok)
  //   {
  //     let pictureblob = await response.blob(); 
  //     console.log(pictureblob);
  //     return pictureblob;
  //   }
  // }
  return (
    <div className="login-wrapper">
      <Container>
        <LoadingOverlay loaderProps={{ color: 'dark', variant: 'dots' }}
          visible={loading} />
        {
          loginData ?
            <Container>
              <Space h="md" />
              <Title>Welcome to your page, {loginData.name}!</Title>
              <Text color="gray">Logged in with {loginData.email}</Text>
              <Space h="md" />

              <Card shadow="md" withBorder>
                <Avatar src={loginData.picture} color="dark" radius="xl" size="xl" />
                <Space h="sm" />

                <Text size="lg" weight="bold">{loginData.name}</Text>
                <Text><em>Lorem ipsum dolor sit amet</em></Text>
                <Space h="xs" />
                <Button color="dark" size="xs" compact uppercase>Edit bio</Button>

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
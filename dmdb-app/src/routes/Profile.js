import { Avatar, Card, Container, Space, Text } from "@mantine/core";
import { useState } from 'react';
import GoogleLogin from 'react-google-login';
import '.././App.css';

export default function Profile() {

  const [logoutMessage, setLogoutMessage] = useState()
  const [loginData, setLoginData] = useState(
    localStorage.getItem('token')
      ? JSON.parse(localStorage.getItem('token'))
      : null
  );
 
 
  const handleFailed = (result) => {
    console.log("login failed");
    //alert(result);
  };
  const handleLogin = async (googleData) => {
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
    const data = await res.json();
    setLoginData(data);
    localStorage.setItem('token', JSON.stringify(data));
  };
  

  const handleLogout = async response => {

    const res = await fetch("/api/v1/auth/logout", {
      method: "DELETE",
   
    })
    const data = await res.json()
    setLogoutMessage(data.message);

    localStorage.clear();
    setLoginData(null);
  }




  
  return (
    <Container>
      <div className="login-wrapper">
        <div>
          {
            loginData ?
              <div>

                <h1 className="centered" > Welcome to the Profile Page! {loginData.name} </h1>
                <h3 className="centered" >You logged in as {loginData.email}</h3>
                <h3>
                  <img className="centered"
                    src={loginData.picture}
                    alt="NoImage"
                  />
                </h3>
                <button
                  className="centered"
                  onClick={handleLogout}>Logout</button>
              </div>

              :
              <div>
                <h1 className="centered" >Please Log In with your Google account</h1>
                <GoogleLogin
                  className="centered"
                  clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                  buttonText="Log in with Google"
                  onSuccess={handleLogin}
                  onFailure={handleFailed}
                  cookiePolicy={'single_host_origin'}
                />
                <h1>{logoutMessage}</h1>
              </div>

          }

        </div>
      </div>
      
      <Space h="md" />
      <Card shadow="md" withBorder>
        <Avatar color="dark" radius="xl" size="xl">DZ</Avatar> <Space h="sm" />
        <Text size="lg" weight="bold">Danilo Zhu</Text>
        <Space h="sm" /><Text><em>Lorem ipsum dolor sit amet</em></Text>
      </Card>
      <Space h="md" />
    </Container>
  )
}
import { Avatar, Card, Container, Space, Text } from "@mantine/core";
import { useState } from 'react';
import GoogleLogin from 'react-google-login';
import '.././App.css';

export default function Profile() {
  var name = "";
  var email = "";
  var picture = "";
  const [loginData, setLoginData] = useState(
    localStorage.getItem('loginData')
      ? JSON.parse(localStorage.getItem('loginData'))
      : null
  );
  /**
   * function that refreshes the page
   */
  function refreshPage() {
    window.location.reload();
  }
 
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
    console.log(data);
    console.log(data.name);
    name = data.name;
    email = data.email;
    picture = data.picture;
    setLoginData(data);
    localStorage.setItem('loginData', JSON.stringify(data));
  };
  const handleLogout = () => {
    localStorage.removeItem('loginData');
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
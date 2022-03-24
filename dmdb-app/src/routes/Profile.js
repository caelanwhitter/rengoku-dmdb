import React from 'react';
import '.././App.css';
import GoogleLogin, { GoogleLogout } from 'react-google-login';
import { useState } from 'react';

export default function Profile() {
  const [loginData, setLoginData] = useState(
    localStorage.getItem('loginData')
      ? JSON.parse(localStorage.getItem('loginData'))
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
      },
    });
    const data = await res.json();
    setLoginData(data);
    localStorage.setItem('loginData', JSON.stringify(data));
  };
  const handleLogout = () => {
    localStorage.removeItem('loginData');
    setLoginData(null);
  }
  async function fetchPicture(picture)
  {
    let response = await fetch(picture);
    if (response.ok)
    {
      let pictureblob = await response.blob(); 
      console.log(pictureblob);
      return pictureblob;
    }
  }
  return (
    <div className="login-wrapper">

      <div>
        {
          loginData ? (
            <div>

              <h1 className="centered" > Welcome to the Profile Page! {loginData.name} </h1>
              <h3 className="centered" >You logged in as {loginData.email}</h3>
              <h3 className="centered" >You logged in as {loginData.picture}</h3>
              <h3>
                <img className="centered" 
                  src={async () => await fetchPicture(loginData.picture)}
                  alt="NoImage"
                />
              </h3>
              <button 
                className="centered" 
                onClick={handleLogout}>Logout</button>
            </div>
          )
            : (
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
            )
        }

      </div>
    </div>
  )
}
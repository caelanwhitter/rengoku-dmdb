import React from 'react';
import '.././App.css';
import GoogleLogin, { GoogleLogout } from 'react-google-login';
import {useState} from 'react';

export default function Profile() {
  const [loginData, setLoginData] = useState(
    localStorage.getItem('loginData')
      ? JSON.parse(localStorage.getItem('loginData'))
      : null
  );
  const handleFailed = (result) => {
    alert(result);
  };
  const handleLogin = async (googleData) => {
    const res = await fetch('/api/google-login', {
      method: 'POST',
      body: JSON.stringify({
        token: googleData.tokenId,
      }),
      headers: {
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
  return (
    <div className="login-wrapper">
      <h1>Please Log In</h1>
      <div>
        {
          loginData ? (
            <div>
              <h3>You logged in as {loginData.email}</h3>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )
            : (
              <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                buttonText="Log in with Google"
                onSuccess={handleLogin}
                onFailure={handleFailed}
                cookiePolicy={'single_host_origin'}
              />
            )
        }

      </div>
    </div>
  )
}
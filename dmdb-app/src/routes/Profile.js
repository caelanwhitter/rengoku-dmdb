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
  const handleFailed = () => {
    alert("Login Failed.");
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

      <div>
        {
          loginData ? (
            <div>
              <h1 className="centered" > Welcome to the Profile Page! {loginData.name} </h1>
              <h3 className="centered" >You logged in as {loginData.email}</h3>
              <h3>
                <img className="centered" 
                  src={loginData.picture}
                  alt="ImageIcon"
                />
              </h3>
              <button 
                className="centered" 
                onClick={handleLogout}>Logout</button>
            </div>
          )
            : (
              <div>
                <h1 className="centered" >Please Log In with your google account</h1>
                <GoogleLogin
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
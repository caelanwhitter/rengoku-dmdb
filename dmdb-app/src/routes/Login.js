import React from 'react';
import '.././App.css';
import GoogleLogin, {GoogleLogout} from 'react-google-login';

async function handleLogin(){
  
}
export default function Login() {
  return(
    <div className="login-wrapper">
      <h1>Please Log In</h1>
      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
        buttonText="Log in with Google"
        onSuccess={handleLogin}
        onFailure={handleLogin}
        cookiePolicy={'single_host_origin'}
      />

    </div>
  )
}
import { render } from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Home from "./routes/Home";
import Movies from "./routes/Movies";
import HiddenGems from "./routes/HiddenGems";
import Profile from "./routes/Profile";
import Register from "./routes/Register";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BttAffix from "./components/BttAffix";
import Reviews from "./routes/Reviews";
import Login from "./routes/Login";

const rootElement = document.getElementById("root");
render(
  <BrowserRouter>
    {<Navbar/>}
    <Routes>
      <Route path="/" element={<Home/>}/>

      <Route path="movies" element={<Movies />}/>

      <Route path="hiddengems" element={<HiddenGems />} >
        <Route
          index
          element={
            <main style={{ padding: "1rem" }}>
              <p>View the Hidden Gems</p>
            </main>
          }
        />
      </Route>

      <Route path="movies/:movieId/reviews" element={<Reviews />}/>

      <Route path="profile" element={<Profile />}/>

      <Route path="register" element={<Register />} >
        <Route
          index
          element={
            <main style={{ padding: "1rem" }}>
              <p>Click here to register</p>
            </main>
          }
        />
      </Route>

      <Route path="admin" element={<Register />} >
        <Route
          index
          element={
            <main style={{ padding: "1rem" }}>
              <p>Sign in to your admin account</p>
            </main>
          }
        />
      </Route>

      <Route path="login" element={<Login />} >
        
      </Route>

      <Route path="logout" element={<Register />} >
        <Route
          index
          element={
            <main style={{ padding: "1rem" }}>
              <p>Click here to logout!</p>
            </main>
          }
        />
      </Route>

      <Route
        path="*"
        element={
          <main style={{ padding: "1rem" }}>
            { /* eslint-disable-next-line react/no-unescaped-entities */ }
            <p>There's nothing here!</p>
          </main>
        }
      />
    </Routes>
    {<Footer/>}
    {<BttAffix/>}
  </BrowserRouter>,
  rootElement
);
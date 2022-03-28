import { render } from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Home from "./routes/Home";
import Movies from "./routes/Movies";
import HiddenGems from "./routes/HiddenGems";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BttAffix from "./components/BttAffix";
import Reviews from "./routes/Reviews";
import Profile from "./routes/Profile";

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


      <Route path="profile" element={<Profile />} >
        
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
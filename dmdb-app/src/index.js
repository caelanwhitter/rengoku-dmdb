import { render } from "react-dom";
import {
  HashRouter, Route, Routes
} from "react-router-dom";
import BttAffix from "./components/BttAffix";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import HiddenGems from "./routes/HiddenGems";
import Home from "./routes/Home";
import Movies from "./routes/Movies";
import Profile from "./routes/Profile";
import Reviews from "./routes/Reviews";

const rootElement = document.querySelector("#root");
render(
  <HashRouter>
    <Navbar/>

    <div id="mainContent">
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="movies" element={<Movies />} />

        <Route path="hiddengems" element={<HiddenGems />} />

        <Route path="movies/:movieId/reviews" element={<Reviews />} />

        <Route path="profile" element={<Profile />} />

        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              { /* eslint-disable-next-line react/no-unescaped-entities */}
              <p>There's nothing here!</p>
            </main>
          }
        />
      </Routes>
      <Footer/>
    </div>
    
    <BttAffix/>
  </HashRouter>,
  rootElement
);
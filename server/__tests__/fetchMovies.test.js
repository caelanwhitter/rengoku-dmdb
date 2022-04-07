/* eslint-disable max-len */
/**
 * fetchMovies.test.js tests many edge cases when fetching data 
 * from the API and matching it with the dataset.
 * Properly tests out any mismatching data between the API and the dataset
 * HOW TO RUN: Run `npm test` on root dir to run
 * @author Daniel Lam
 */
const app = require("../app");
const request = require("supertest");
const mongoose = require("mongoose");
const pageOne = require("./page1.json");
const pageTwo = require("./page2.json");
const spiderMan = require("./spiderman.json");
const quentinTarantino = require("./quentintarantino.json")
const emptyQuery = {
  title: "",
  director: "",
  genre: "",
  releaseYear: "",
  score: "",
  rating: ""
};

beforeAll(done => {
  done()
});

afterAll(done => {
  // Closing the DB connection allows Jest to exit successfully.
  mongoose.connection.close();
  mongoose.disconnect();
  done()
})

describe("GET/ Request test at endpoint '/api/getSearch/page/:pageNumber'", () => {
  jest.setTimeout(60000);

  test("Tests endpoint at page 1 with no queries", async () => {
    const response = await request(app).get("/api/getSearch/page/1").
      query(emptyQuery).
      expect("Content-Type", /json/).
      expect(200);

    const expectedResults = pageOne;

    expect(expectedResults).toEqual(response.body);
  });

  test("Tests endpoint at page 2 with no queries", async () => {
    const response = await request(app).get("/api/getSearch/page/2").
      query(emptyQuery).
      expect("Content-Type", /json/).
      expect(200);

    const expectedResults = pageTwo;

    expect(expectedResults).toEqual(response.body);
  })

  test("Tests endpoint at page 1 with search query with title 'Spider-Man'", async () => {
    const response = await request(app).get("/api/getSearch/page/1").
      query({
        title: "Spider-Man",
        director: "",
        genre: "",
        releaseYear: "",
        score: "",
        rating: ""
      }).
      expect("Content-Type", /json/).
      expect(200);

    const expectedResults = spiderMan;

    expect(expectedResults).toEqual(response.body);
  });

  test("Tests endpoint at page 1 with search query with director 'Quentin Tarantino'", async () => {
    const response = await request(app).get("/api/getSearch/page/1").
      query({
        title: "",
        director: "Quentin Tarantino",
        genre: "",
        releaseYear: "",
        score: "",
        rating: ""
      }).
      expect("Content-Type", /json/).
      expect(200);

    const expectedResults = quentinTarantino;

    expect(expectedResults).toEqual(response.body);
  });

  test("Tests endpoint with queries that will not return any movies", async () => {
    const response = await request(app).get("/api/getSearch/page/1").
      query({
        title: "this is a test because there is no movie that will match this title query",
        director: "",
        genre: "",
        releaseYear: "",
        score: "",
        rating: ""
      }).
      expect("Content-Type", /json/).
      expect(200);

    const expectedResults = [];

    expect(expectedResults).toEqual(response.body);
  })

  test("Tests endpoint with pagination out of bounds", async () => {
    const response = await request(app).get("/api/getSearch/page/100000").
      query({
        title: "",
        director: "",
        genre: "",
        releaseYear: "",
        score: "",
        rating: ""
      }).
      expect("Content-Type", /json/).
      expect(200);

    const expectedResults = [];

    expect(expectedResults).toEqual(response.body);
  })
})

describe("GET/ Request test at endpoint /api/oneMovie/:movieId", () => {
  jest.setTimeout(60000);

  test("Tests endpoint with The Shining object id", async () => {
    const theShiningId = "624ed5bdcc0005072bfd5947";
    const response = await request(app).get("/api/oneMovie").
      query({ id: theShiningId }).
      expect("Content-Type", /json/).
      expect(200);

    const expectedMovie = [
      {
        "_id": "624ed5bdcc0005072bfd5947",
        "description": "Jack Torrance accepts a caretaker job at the Overlook Hotel, where he, along with his wife Wendy and their son Danny, must live isolated from the rest of the world for the winter. But they aren't prepared for the madness that lurks within.",
        "director": "Stanley Kubrick",
        "duration": "146.0",
        "genre": "Drama",
        "gross": "$46,998,772.00",
        "poster": "https://rengokudmdb.blob.core.windows.net/rengokublobs/rengokuBlob-The%20Shining-1980.jpg",
        "rating": "R",
        "releaseYear": "1980",
        "score": "8.4",
        "title": "The Shining"
      }
    ]

    expect(expectedMovie).toEqual(response.body);
  });

  test("Tests endpoint with The Blue Lagoon id", async () => {
    const theBlueLagoonId = "624ed5bdcc0005072bfd5948";
    const response = await request(app).get("/api/oneMovie").
      query({ id: theBlueLagoonId }).
      expect("Content-Type", /json/).
      expect(200);

    const expectedMovie = [
      {
        "_id": "624ed5bdcc0005072bfd5948",
        "description": "Two small children and a ship's cook survive a shipwreck and find safety on an idyllic tropical island. Soon, however, the cook dies and the young boy and girl are left on their own. Days become years and Emmeline and Richard make a home for themselves surrounded by exotic creatures and nature's beauty. But will they ever see civilization again?",
        "director": "Randal Kleiser",
        "duration": "104.0",
        "genre": "Adventure",
        "gross": "$58,853,106.00",
        "poster": "https://rengokudmdb.blob.core.windows.net/rengokublobs/rengokuBlob-The%20Blue%20Lagoon-1980.jpg",
        "rating": "R",
        "releaseYear": "1980",
        "score": "5.8",
        "title": "The Blue Lagoon"
      }
    ]

    expect(expectedMovie).toEqual(response.body);
  })
})


// /** The Shining - 1980
//    * NOTES: Bread and Butter test for endpoint. Check if functionality works
//    */
// test("Tests endpoint with 'The Shining - 1980'", async () => {
//   const response = await request(app).get("/api/oneMovie/fetchMovieDataFromApi").
//     query({ title: "The Shining", year: 1980 }).
//     expect("Content-Type", /json/).
//     expect(200);

//   const expectedMovie = {
//     title: "The Shining",
//     // eslint-disable-next-line max-len
//     description: "Jack Torrance accepts a caretaker job at the Overlook Hotel, where he, along with his wife Wendy and their son Danny, must live isolated from the rest of the world for the winter. But they aren't prepared for the madness that lurks within.",
//     poster: "/b6ko0IKC8MdYBBPkkA1aBPLe2yz.jpg",
//     year: 1980
//   }

//   expect(expectedMovie).toMatchObject(response.body);
// });

// /**
//    * Cattle Annie And Little Britches - 1980
//    * NOTES: Edge case type 1 - Empty results when fetching from TMDB API (year must be 1981)
//    */
// test("Tests endpoint with 'Cattle Annie And Little Britches - 1980'", async () => {
//   const response = await request(app).get("/api/oneMovie/fetchMovieDataFromApi").
//     query({ title: "Cattle Annie And Little Britches", year: 1980 }).
//     expect("Content-Type", /json/).
//     expect(200);

//   const expectedMovie = {
//     title: "Cattle Annie and Little Britches",
//     // eslint-disable-next-line max-len
//     description: "In nineteenth century Oklahoma, two teen girls, fans of stories about outlaws, are on a quest to meet and join up with them. They find a shadow of a former gang and although disappointed, still try to help them escape from a vigorous Marshal.",
//     poster: "/vbY56Vl2hoW5N5CuPDuaE8sDwpy.jpg",
//     year: 1980
//   }

//   expect(expectedMovie).toMatchObject(response.body);
// })

// /**
//    * Mantis Fist Fighter - 1980
//    * NOTES: Edge case type 2 - Movie's original title of API
//    * doesn't match with movie title of dataset
//    */
// test("Tests endpoint with 'Mantis Fist Fighter - 1980'", async () => {
//   const response = await request(app).get("/api/oneMovie/fetchMovieDataFromApi").
//     query({ title: "Mantis Fist Fighter", year: 1980 }).
//     expect("Content-Type", /json/).
//     expect(200);

//   const expectedMovie = {
//     title: "The Thundering Mantis",
//     // eslint-disable-next-line max-len
//     description: "Ah Chi (Ka-Yan Leung) is obsessed with the martial arts and, more often than not, his kung-fu clowning gets him into trouble. Ending up facing Hsia (Eddie Ko) of the notorious Jade Brotherhood is inevitable. As a result, Hsia forces Chi's martial arts master to expel him. Masterless and working for a fish vendor, Chi meets a crafty kid (Yat Lung Wong), whose uncle Chow Tung (Chin Yuet Sang) is a master of the Insane Mantis style. The Jade Brotherhood aims for control of the small town but Chi is training with a new Master and will not accept bullies in the neighbourhood.",
//     poster: "/efRflUMFeql2vqy1Y1EnBc0kDDc.jpg",
//     year: 1980
//   }

//   expect(expectedMovie).toMatchObject(response.body);
// })

// /**
//    * Venom - 1981
//    * NOTES: Edge case type 3 - Query returns multiple movies with very similar release years.
//    * Return right movie with Venom as title
//    */
// test("Tests endpoint with 'Venom - 1981'", async () => {
//   const response = await request(app).get("/api/oneMovie/fetchMovieDataFromApi").
//     query({ title: "Venom", year: 1981 }).
//     expect("Content-Type", /json/).
//     expect(200);

//   const expectedMovie = {
//     title: "Venom",
//     // eslint-disable-next-line max-len
//     description: "International terrorists attempt to kidnap a wealthy couple's child. Their plan comes unstuck when a deadly Black Mamba, sent by mistake instead of a harmless snake, escapes and the terrorists and several hostages are trapped in the boy's London home.",
//     poster: "/oGspQXUm4BtFioE6dHLwQGJqaGu.jpg",
//     year: 1981
//   }

//   expect(expectedMovie).toMatchObject(response.body);
// })

// /**
//    * Inchon - 1981
//    * NOTES: Edge case type 4 - Query returns wrong movie
//    * with different movie title and no description.
//    * Ambiguity on which movie is the correct one.
//    */
// test("Tests endpoint with 'Inchon - 1981'", async () => {
//   const response = await request(app).get("/api/oneMovie/fetchMovieDataFromApi").
//     query({ title: "Inchon", year: 1981 }).
//     expect("Content-Type", /json/).
//     expect(200);

//   const expectedMovie = {
//     title: "Operation Inchon",
//     description: "",
//     poster: "/4Bc7lSZJHFIuAmFHymRTT1sGtiz.jpg",
//     year: 1981
//   }

//   // Ambiguous result:
//   // const expectedMovie = {
//   //     title: "Inchon",
//   //     description: "A noisy and absurd re-telling of the great 1950 invasion of
//   //     Inchon during the Korean War which was masterminded by General Douglas MacArthur.",
//   //     poster: "/wq7hdBXdEYEkT9lstETxVQvZ8Ki.jpg",
//   //     year: 1981
//   // }

//   expect(expectedMovie).toMatchObject(response.body);
// })

// /**
//    * The Entity - 1982
//    * NOTES: Edge case type 3 - Query returns multiple movies with very similar release years.
//    * Return right movie with The Entity as title
//    */
// test("Tests endpoint with 'The Entity - 1982'", async () => {
//   const response = await request(app).get("/api/oneMovie/fetchMovieDataFromApi").
//     query({ title: "The Entity", year: 1982 }).
//     expect("Content-Type", /json/).
//     expect(200);

//   const expectedMovie = {
//     title: "The Entity",
//     description: "Carla Moran, a hard-working single mother,  is raped in her bedroom by someone - or something - that she cannot see. Despite skeptical psychiatrists, she is repeatedly attacked in her car by this invisible force. Could this be a case of hysteria or something more horrific?",
//     poster: "/3gk2ZuC4OcyE9JYnv6f4FQAbH20.jpg",
//     year: 1982
//   }

//   expect(expectedMovie).toMatchObject(response.body);
// })


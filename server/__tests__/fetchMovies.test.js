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

beforeAll(done => {
  done()
});

afterAll(done => {
  // Closing the DB connection allows Jest to exit successfully.
  mongoose.connection.close();
  mongoose.disconnect();
  done()
})

describe("GET/ Request test at endpoint '/oneMovie/fetchMovieDataFromApi/'", () => {
  jest.setTimeout(60000);

  /** The Shining - 1980
     * NOTES: Bread and Butter test for endpoint. Check if functionality works
     */
  test("Tests endpoint with 'The Shining - 1980'", async () => {
    const response = await request(app).get("/api/oneMovie/fetchMovieDataFromApi").
      query({ title: "The Shining", year: 1980 }).
      expect("Content-Type", /json/).
      expect(200);

    const expectedMovie = {
      title: "The Shining",
      // eslint-disable-next-line max-len
      description: "Jack Torrance accepts a caretaker job at the Overlook Hotel, where he, along with his wife Wendy and their son Danny, must live isolated from the rest of the world for the winter. But they aren't prepared for the madness that lurks within.",
      poster: "/b6ko0IKC8MdYBBPkkA1aBPLe2yz.jpg",
      year: 1980
    }

    expect(expectedMovie).toMatchObject(response.body);
  });

  /**
     * Cattle Annie And Little Britches - 1980
     * NOTES: Edge case type 1 - Empty results when fetching from TMDB API (year must be 1981)
     */
  test("Tests endpoint with 'Cattle Annie And Little Britches - 1980'", async () => {
    const response = await request(app).get("/api/oneMovie/fetchMovieDataFromApi").
      query({ title: "Cattle Annie And Little Britches", year: 1980 }).
      expect("Content-Type", /json/).
      expect(200);

    const expectedMovie = {
      title: "Cattle Annie and Little Britches",
      // eslint-disable-next-line max-len
      description: "In nineteenth century Oklahoma, two teen girls, fans of stories about outlaws, are on a quest to meet and join up with them. They find a shadow of a former gang and although disappointed, still try to help them escape from a vigorous Marshal.",
      poster: "/vbY56Vl2hoW5N5CuPDuaE8sDwpy.jpg",
      year: 1980
    }

    expect(expectedMovie).toMatchObject(response.body);
  })

  /** 
     * Mantis Fist Fighter - 1980
     * NOTES: Edge case type 2 - Movie's original title of API 
     * doesn't match with movie title of dataset
     */
  test("Tests endpoint with 'Mantis Fist Fighter - 1980'", async () => {
    const response = await request(app).get("/api/oneMovie/fetchMovieDataFromApi").
      query({ title: "Mantis Fist Fighter", year: 1980 }).
      expect("Content-Type", /json/).
      expect(200);

    const expectedMovie = {
      title: "The Thundering Mantis",
      // eslint-disable-next-line max-len
      description: "Ah Chi (Ka-Yan Leung) is obsessed with the martial arts and, more often than not, his kung-fu clowning gets him into trouble. Ending up facing Hsia (Eddie Ko) of the notorious Jade Brotherhood is inevitable. As a result, Hsia forces Chi's martial arts master to expel him. Masterless and working for a fish vendor, Chi meets a crafty kid (Yat Lung Wong), whose uncle Chow Tung (Chin Yuet Sang) is a master of the Insane Mantis style. The Jade Brotherhood aims for control of the small town but Chi is training with a new Master and will not accept bullies in the neighbourhood.",
      poster: "/efRflUMFeql2vqy1Y1EnBc0kDDc.jpg",
      year: 1980
    }

    expect(expectedMovie).toMatchObject(response.body);
  })

  /**
     * Venom - 1981
     * NOTES: Edge case type 3 - Query returns multiple movies with very similar release years. 
     * Return right movie with Venom as title
     */
  test("Tests endpoint with 'Venom - 1981'", async () => {
    const response = await request(app).get("/api/oneMovie/fetchMovieDataFromApi").
      query({ title: "Venom", year: 1981 }).
      expect("Content-Type", /json/).
      expect(200);

    const expectedMovie = {
      title: "Venom",
      // eslint-disable-next-line max-len
      description: "International terrorists attempt to kidnap a wealthy couple's child. Their plan comes unstuck when a deadly Black Mamba, sent by mistake instead of a harmless snake, escapes and the terrorists and several hostages are trapped in the boy's London home.",
      poster: "/oGspQXUm4BtFioE6dHLwQGJqaGu.jpg",
      year: 1981
    }

    expect(expectedMovie).toMatchObject(response.body);
  })

  /**
     * Inchon - 1981
     * NOTES: Edge case type 4 - Query returns wrong movie 
     * with different movie title and no description. 
     * Ambiguity on which movie is the correct one.
     */
  test("Tests endpoint with 'Inchon - 1981'", async () => {
    const response = await request(app).get("/api/oneMovie/fetchMovieDataFromApi").
      query({ title: "Inchon", year: 1981 }).
      expect("Content-Type", /json/).
      expect(200);

    const expectedMovie = {
      title: "Operation Inchon",
      description: "",
      poster: "/4Bc7lSZJHFIuAmFHymRTT1sGtiz.jpg",
      year: 1981
    }

    // Ambiguous result:
    // const expectedMovie = {
    //     title: "Inchon",
    //     description: "A noisy and absurd re-telling of the great 1950 invasion of 
    //     Inchon during the Korean War which was masterminded by General Douglas MacArthur.",
    //     poster: "/wq7hdBXdEYEkT9lstETxVQvZ8Ki.jpg",
    //     year: 1981
    // }

    expect(expectedMovie).toMatchObject(response.body);
  })

  /**
     * The Entity - 1982
     * NOTES: Edge case type 3 - Query returns multiple movies with very similar release years. 
     * Return right movie with The Entity as title
     */
  test("Tests endpoint with 'The Entity - 1982'", async () => {
    const response = await request(app).get("/api/oneMovie/fetchMovieDataFromApi").
      query({ title: "The Entity", year: 1982 }).
      expect("Content-Type", /json/).
      expect(200);

    const expectedMovie = {
      title: "The Entity",
      description: "Carla Moran, a hard-working single mother,  is raped in her bedroom by someone - or something - that she cannot see. Despite skeptical psychiatrists, she is repeatedly attacked in her car by this invisible force. Could this be a case of hysteria or something more horrific?",
      poster: "/3gk2ZuC4OcyE9JYnv6f4FQAbH20.jpg",
      year: 1982
    }

    expect(expectedMovie).toMatchObject(response.body);
  })

  // 1984: Title is completely off from title in API
})

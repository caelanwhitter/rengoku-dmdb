const app = require('../app');
const request = require('supertest');
const mongoose = require('mongoose');

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
    /* The Shining - 1980
    NOTES: Bread and Butter test for endpoint. Check if functionality works
    */
    test("Tests endpoint with 'The Shining'", async () => {
        const response = await request(app).get("/api/oneMovie/fetchMovieDataFromApi").query({ title: "The Shining", year: 1980})
        .expect("Content-Type", /json/)
        .expect(200);

        const expectedMovie = {
            title: "The Shining",
            description: "Jack Torrance accepts a caretaker job at the Overlook Hotel, where he, along with his wife Wendy and their son Danny, must live isolated from the rest of the world for the winter. But they aren't prepared for the madness that lurks within.",
            poster: "/b6ko0IKC8MdYBBPkkA1aBPLe2yz.jpg",
            year: 1980
        }

        expect(expectedMovie).toMatchObject(response.body);
    });

    /* Cattle Annie And Little Britches - 1980
    NOTES: Edge case - Empty results when fetching from TMDB API (year must be 1981) */
    test("Tests endpoint with 'Cattle Annie And Little Britches'", async () => {
        const response = await request(app).get("/api/oneMovie/fetchMovieDataFromApi").query({ title: "Cattle Annie And Little Britches", year: 1980})
        .expect("Content-Type", /json/)
        .expect(200);

        const expectedMovie = {
            title: "Cattle Annie and Little Britches",
            description: "In nineteenth century Oklahoma, two teen girls, fans of stories about outlaws, are on a quest to meet and join up with them. They find a shadow of a former gang and although disappointed, still try to help them escape from a vigorous Marshal.",
            poster: "/vbY56Vl2hoW5N5CuPDuaE8sDwpy.jpg",
            year: 1980
        }

        expect(expectedMovie).toMatchObject(response.body);
    })


})

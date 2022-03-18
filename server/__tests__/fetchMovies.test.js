const routes = require('../routes/route');
const supertest = require('supertest');
const request = supertest(routes);

describe('Sample Test', () => {
    it('should test that true === true', () => {
        expect(true).toBe(true)
    })
});

describe("GET/ Request test at endpoint '/oneMovie/fetchMovieDataFromApi/'", () => {
    it("Tests endpoint with 'The Shining'", async done => {
        const response = await request.get("/oneMovie/fetchMovieDataFromApi?title=The Shining&year=1980");

    })
})

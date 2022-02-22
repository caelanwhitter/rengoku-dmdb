package utils;

import static org.junit.Assert.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.junit.*;

/**
 * Unit test to check if all the fields are properly filled in with the right data
 */
public class ImporterTest 
{
    // TO-DO: Find a way to have a universal path
    private String movieAttributesPath = "/Users/Caelan/Documents/sixthsemester/WebDevelopment/rengoku-dmdb/importer/src/test/java/utils/resources/testmovies.csv";
    private Importer importer;
    private List<Movie> testMovieList;

    /**
     * Initializes the Importer and List before every Test
     */
    @Before
    public void setUp() {
        this.importer = new Importer(movieAttributesPath);
        this.testMovieList = importer.fetchDataFromDataset();
    }
    
    /**
     * Checks if every title is extracted properly and in the right order
     */
    @Test
    public void testTitlesFromDataset()
    {
        List<String> givenMovieTitles = Arrays.asList("Oh, God! Book II", "Saw: The Final Chapter", "Killers",
                "Devil in the Flesh", "One for the Money");
        List<String> takenMovieTitles = new ArrayList<String>();

        for (Movie movie : testMovieList) {
            takenMovieTitles.add(movie.getTitle());
        }

        assertTrue(givenMovieTitles.size() == takenMovieTitles.size() && givenMovieTitles.equals(takenMovieTitles)
                && takenMovieTitles.equals(givenMovieTitles));
    }
        
        /**
     * Checks if every Description is extracted properly and in the right order
     */
    @Test
    public void testDescriptionFromDataset()
    {

        List<String> givenMovieDescription = Arrays.asList("", "", "", "", "");
        List<String> takenMovieDescription = new ArrayList<String>();

        for (Movie movie : testMovieList) {
            takenMovieDescription.add(movie.getDescription());
        }

        assertTrue(givenMovieDescription.size() == takenMovieDescription.size()
                && givenMovieDescription.equals(takenMovieDescription)
                && takenMovieDescription.equals(givenMovieDescription));
    }
      
    
        /**
     * Checks if every Duration is extracted properly and in the right order
     */
    @Test
    public void testDurationFromDataset() 
    {

        List<String> givenMovieDuration = Arrays.asList("94.0", "", "100.0", "114.0", "");
        List<String> takenMovieDuration = new ArrayList<String>();

        for (Movie movie : testMovieList) {
            takenMovieDuration.add(movie.getDuration());
        }
        assertTrue(
                givenMovieDuration.size() == takenMovieDuration.size() && givenMovieDuration.equals(takenMovieDuration)
                        && takenMovieDuration.equals(givenMovieDuration));
    }
        
    
        /**
     * Checks if every Genre is extracted properly and in the right order
     */
    @Test
    public void testGenreFromDataset() 
    {

        List<String> givenMovieGenre = Arrays.asList("Comedy", "Crime", "Action", "Drama", "Action");
        List<String> takenMovieGenre = new ArrayList<String>();

        for (Movie movie : testMovieList) {
            takenMovieGenre.add(movie.getGenre());
        }

        assertTrue(givenMovieGenre.size() == takenMovieGenre.size() && givenMovieGenre.equals(takenMovieGenre)
                && takenMovieGenre.equals(givenMovieGenre));
    }
        
    
        /**
     * Checks if every Rating is extracted properly and in the right order
     */
    @Test
    public void testRatingFromDataset() 
    {
        List<String> givenMovieRating = Arrays.asList("PG", "R", "PG-13", "X", "PG-13");
        List<String> takenMovieRating = new ArrayList<String>();

        for (Movie movie : testMovieList) {
            takenMovieRating.add(movie.getRating());
        }

        assertTrue(givenMovieRating.size() == takenMovieRating.size() && givenMovieRating.equals(takenMovieRating)
                && takenMovieRating.equals(givenMovieRating));
    }
        
    
        /**
     * Checks if every Poster is extracted properly and in the right order
     */
    @Test
    public void testPosterFromDataset()
    {
        List<String> givenMoviePosters = Arrays.asList("", "", "", "", "");
        List<String> takenMoviePosters = new ArrayList<String>();

        for (Movie movie : testMovieList) {
            takenMoviePosters.add(movie.getPoster());
        }

        assertTrue(givenMoviePosters.size() == takenMoviePosters.size() && givenMoviePosters.equals(takenMoviePosters)
                && takenMoviePosters.equals(givenMoviePosters));
    }
    
    
        /**
     * Checks if every Director is extracted properly and in the right order
     */
    @Test
    public void testDirectorFromDataset()
    {
        List<String> givenMovieDirector = Arrays.asList("Gilbert Cates", "Kevin Greutert", "Robert Luketic",
                "Marco Bellocchio", "Julie Anne Robinson");
        List<String> takenMovieDirector = new ArrayList<String>();

        for (Movie movie : testMovieList) {
            takenMovieDirector.add(movie.getDirector());
        }

        assertTrue(
                givenMovieDirector.size() == takenMovieDirector.size() && givenMovieDirector.equals(takenMovieDirector)
                        && takenMovieDirector.equals(givenMovieDirector));
    }
        
    
        /**
     * Checks if every Score is extracted properly and in the right order
     */
    @Test
    public void testScoreFromDataset()
    {
        List<Double> givenMovieScore = Arrays.asList(5.2, 5.6, 5.5, 5.8, 5.3);
        List<Double> takenMovieScore = new ArrayList<Double>();

        for (Movie movie : testMovieList) {
            takenMovieScore.add(movie.getScore());
        }

        assertTrue(givenMovieScore.size() == takenMovieScore.size() && givenMovieScore.equals(takenMovieScore)
                && takenMovieScore.containsAll(givenMovieScore));
    }

    
        /**
     * Checks if every Gross is extracted properly and in the right order
     */
    @Test
    public void testGrossFromDataset()
    {
        List<String> givenMovieGross = Arrays.asList("14504277.0", "", "98159963.0",
                "546904.0", "38084162.0");
        List<String> takenMovieGross = new ArrayList<String>();

        for (Movie movie : testMovieList) {
            takenMovieGross.add(movie.getGross());
        }

        assertTrue(givenMovieGross.size() == takenMovieGross.size() && givenMovieGross.equals(takenMovieGross)
                && takenMovieGross.equals(givenMovieGross));
    }
        

        /**
     * Checks if every ReleaseYear is extracted properly and in the right order
     */
    @Test
    public void testReleaseYearFromDataset()
    {           
        List<Integer> givenMovieReleaseYear = Arrays.asList(1980, 2010, 2010,1986,2012);
        List<Integer> takenMovieReleaseYear = new ArrayList<Integer>();
        
        for (Movie movie : testMovieList) {
            takenMovieReleaseYear.add(movie.getReleaseYear());
        }

        assertTrue(givenMovieReleaseYear.size() == takenMovieReleaseYear.size() && givenMovieReleaseYear.equals(takenMovieReleaseYear) && takenMovieReleaseYear.equals(givenMovieReleaseYear));
        }
 }

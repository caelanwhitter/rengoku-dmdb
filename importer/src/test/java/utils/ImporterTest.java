package utils;

import static org.junit.Assert.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.junit.*;

/**
 * Unit test to check if all the fields are properly filled in with the right data
 */
public class ImporterTest 
{
   
    private String movieAttributesPath = System.getProperty("user.dir")+"/src/test/java/utils/resources/testmovies.csv";
    private Importer importer;
    private List<Movie> testMovieList;

    /**
     * Initializes the Importer and List before every Test
     * @throws IOException
     */
    @Before
    public void setUp() throws IOException {
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
                "Devil in the Flesh", "One for the Money", "Sorority Boys","House Party","Babylon");
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

        List<String> givenMovieDescription = Arrays.asList("", "", "", "", "","","","");
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

        List<String> givenMovieDuration = Arrays.asList("94.0", "Unknown", "100.0", "114.0", "Unknown","93.0","100.0","95.0");
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

        List<String> givenMovieGenre = Arrays.asList("Comedy", "Crime", "Action", "Drama", "Action","Comedy","Comedy","Drama");
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
        List<String> givenMovieRating = Arrays.asList("PG", "R", "PG-13", "X", "PG-13","R","R","Unknown");
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
        List<String> givenMoviePosters = Arrays.asList("", "", "", "", "","","","");
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
                "Marco Béllocchio", "Julie Anne Robinson","Wallace Wolodarsky","Reginald Hudlin","Franco Rosso");
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
        List<String> givenMovieScore = Arrays.asList("5.2", "5.6", "5.5", "5.8", "5.3","5.5","6.5","7.4");
        List<String> takenMovieScore = new ArrayList<String>();

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
        List<String> givenMovieGross = Arrays.asList("$14,504,277.00", "Unknown", "$98,159,963.00",
                "$546,904.00", "$38,084,162.00","$12,517,488.00","$26,385,627.00","$109,749.00");
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
        List<String> givenMovieReleaseYear = Arrays.asList("1980", "2010", "2010","1986","2012","2002","1990","1980");
        List<String> takenMovieReleaseYear = new ArrayList<String>();
        
        for (Movie movie : testMovieList) {
            takenMovieReleaseYear.add(movie.getReleaseYear());
        }

        assertTrue(givenMovieReleaseYear.size() == takenMovieReleaseYear.size() && givenMovieReleaseYear.equals(takenMovieReleaseYear) && takenMovieReleaseYear.equals(givenMovieReleaseYear));
        }
 }

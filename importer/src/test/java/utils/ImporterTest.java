package utils;

import static org.junit.Assert.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.junit.*;

/**
 * Unit test for simple App.
 */
public class ImporterTest 
{
    private String movieAttributesPath = "/Users/Caelan/Documents/sixthsemester/WebDevelopment/rengoku-dmdb/importer/src/test/java/utils/resources/testmovies.csv";
    //private String movieAttributesPath = "importer/src/test/java/utils/resources/testmovies.csv";
    private Importer importer;
    private List<Movie> testMovieList;

    @Before
    public void setUp() throws Exception {
        this.importer = new Importer(movieAttributesPath);
        this.testMovieList = importer.fetchDataFromDataset();
    }
    

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
        
    @Test
    public void testDescriptionFromDataset()
    {
     
        List<String> givenMovieDescription = Arrays.asList("", "", "","", "");
        List<String> takenMovieDescription = new ArrayList<String>();

        for (Movie movie : testMovieList) {
            takenMovieDescription.add(movie.getDescription());
        }

        assertTrue(givenMovieDescription.size() == takenMovieDescription.size() && givenMovieDescription.equals(takenMovieDescription)
                && takenMovieDescription.equals(givenMovieDescription));
    }
        
    @Test
    public void testDurationFromDataset() 
    {
     
        List<String> givenMovieDuration = Arrays.asList("94.0","","100.0","114.0","");
        List<String> takenMovieDuration = new ArrayList<String>();

        for (Movie movie : testMovieList) {
            takenMovieDuration.add(movie.getDuration());
        }
        assertTrue(givenMovieDuration.size() == takenMovieDuration.size() && givenMovieDuration.equals(takenMovieDuration)
        && takenMovieDuration.equals(givenMovieDuration));
    }
        
    @Test
    public void testGenreFromDataset() 
    {
   
        List<String> givenMovieGenre = Arrays.asList("Comedy", "Crime", "Action","Drama", "Action");
        List<String> takenMovieGenre = new ArrayList<String>();

        for (Movie movie : testMovieList) {
            takenMovieGenre.add(movie.getGenre());
        }

        assertTrue(givenMovieGenre.size() == takenMovieGenre.size() && givenMovieGenre.equals(takenMovieGenre)
                && takenMovieGenre.equals(givenMovieGenre));
    }
        
    @Test
    public void testRatingFromDataset() 
    {
        List<String> givenMovieRating = Arrays.asList("PG", "R", "PG-13","X", "PG-13");
        List<String> takenMovieRating = new ArrayList<String>();

        for (Movie movie : testMovieList) {
            takenMovieRating.add(movie.getRating());
        }

        assertTrue(givenMovieRating.size() == takenMovieRating.size() && givenMovieRating.equals(takenMovieRating)
                && takenMovieRating.equals(givenMovieRating));
    }
        
    @Test
    public void testPosterFromDataset()
    {
        List<String> givenMoviePosters = Arrays.asList("", "", "","", "");
        List<String> takenMoviePosters = new ArrayList<String>();

        for (Movie movie : testMovieList) {
            takenMoviePosters.add(movie.getPoster());
        }

        assertTrue(givenMoviePosters.size() == takenMoviePosters.size() && givenMoviePosters.equals(takenMoviePosters)
                && takenMoviePosters.equals(givenMoviePosters));
    }
        
    @Test
    public void testDirectorFromDataset()
    {
        List<String> givenMovieDirector = Arrays.asList("Gilbert Cates", "Kevin Greutert", "Robert Luketic",
                "Marco Bellocchio", "Julie Anne Robinson");
        List<String> takenMovieDirector = new ArrayList<String>();

        for (Movie movie : testMovieList) {
            takenMovieDirector.add(movie.getDirector());
        }

        assertTrue(givenMovieDirector.size() == takenMovieDirector.size() && givenMovieDirector.containsAll(takenMovieDirector)
                && takenMovieDirector.containsAll(givenMovieDirector));
    }
        
//     @Test
//     public void testScoreFromDataset() throws IOException
//     {
//         Importer importer = new Importer(movieAttributesPath);
//         List<Movie> testMovieList = importer.fetchDataFromDataset();
//         List<String> givenMovieTitles = Arrays.asList("Oh, God! Book II", "Saw: The Final Chapter", "Killers",
//                 "The Wolfman", "One for the Money");
//         List<String> takenMovieTitles = new ArrayList<String>();

//         for (Movie movie : testMovieList) {
//             takenMovieTitles.add(movie.getTitle());
//         }

//         assertTrue(givenMovieTitles.size() == takenMovieTitles.size() && givenMovieTitles.containsAll(takenMovieTitles)
//                 && takenMovieTitles.containsAll(givenMovieTitles));
//     }

//     @Test
//     public void testGrossFromDataset() throws IOException
//     {
//         Importer importer = new Importer(movieAttributesPath);
//         List<Movie> testMovieList = importer.fetchDataFromDataset();
//         List<String> givenMovieTitles = Arrays.asList("Oh, God! Book II", "Saw: The Final Chapter", "Killers",
//                 "The Wolfman", "One for the Money");
//         List<String> takenMovieTitles = new ArrayList<String>();

//         for (Movie movie : testMovieList) {
//             takenMovieTitles.add(movie.getTitle());
//         }

//         assertTrue(givenMovieTitles.size() == takenMovieTitles.size() && givenMovieTitles.containsAll(takenMovieTitles)
//                 && takenMovieTitles.containsAll(givenMovieTitles));
//     }
        
//     @Test
//     public void testReleaseYearFromDataset() throws IOException
//     {           
//         Importer importer = new Importer(movieAttributesPath);
//         List<Movie> testMovieList = importer.fetchDataFromDataset();
//         List<String> givenMovieTitles = Arrays.asList("Oh, God! Book II", "Saw: The Final Chapter", "Killers",
//                 "The Wolfman", "One for the Money");
//         List<String> takenMovieTitles = new ArrayList<String>();
        
//         for (Movie movie : testMovieList) {
//             takenMovieTitles.add(movie.getTitle());
//         }

//         assertTrue(givenMovieTitles.size() == takenMovieTitles.size() && givenMovieTitles.containsAll(takenMovieTitles) && takenMovieTitles.containsAll(givenMovieTitles));
//         }
 }

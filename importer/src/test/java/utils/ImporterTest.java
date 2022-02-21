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
    
    @Test
    public void testfetchDataFromDataset()
    {
        Importer testImporter = new Importer("importer/src/test/java/utils/TestMovies.csv");
        List<Movie> testMovieList = testImporter.fetchDataFromDataset();
        int size = testMovieList.size();
       // String title = testMovieList.get(0).getTitle();
        //List<String> testTitles = Arrays.asList("Oh, God! Book II","Saw: The Final Chapter","Killers","The Wolfman","One for the Money");

        boolean answer = testMovieList.contains("Oh, God! Book II");
        assertEquals(5, size);
    }
}

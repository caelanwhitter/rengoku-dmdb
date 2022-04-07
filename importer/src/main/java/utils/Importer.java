package utils;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.text.NumberFormat;

/**
 * Importer.java reads through every line of dataset, cleans each line and creates a Movie object
 * @author Caelan Whitter & Daniel Lam 
 */
public class Importer {
    /**
     * Create private fields for every field of a movie
     */
    private String movieAttributesPath;
    private List<Movie> movieList = new ArrayList<Movie>();
    private NumberFormat formatter = NumberFormat.getCurrencyInstance();


    /**
     * set the path to the csv file
     */
    public Importer(String path) {
        this.movieAttributesPath = path;
    }

    public List<Movie> fetchDataFromDataset() throws IOException {


        String line = " ";
        String splitby = ",";

        /**
         * a try-catch method to extract data from csv file
         */

        FileInputStream fis = new FileInputStream(movieAttributesPath);
        InputStreamReader isr = new InputStreamReader(fis, StandardCharsets.UTF_8);
        BufferedReader reader = new BufferedReader(isr);
        //BufferedReader reader = new BufferedReader(new FileReader(movieAttributesPath));

        try {
            boolean firstLine = true;
            // File file = new File("D:\\sample.txt");
            //         // Instantiating the PrintStream class
            //         PrintStream stream = new PrintStream(file);
            //         System.out.println("From now on "+file.getAbsolutePath()+" will be your console");
            //         System.setOut(stream);
            while ((line = reader.readLine()) != null) {

                /**
                 * Skip the first line of the csv file
                 */
                if (firstLine) {
                    firstLine = false;
                    continue;
                }

                // Create starting Movie object with default values
                Movie movie = new Movie();
                String[] movieAttributes = line.split(splitby);
                /**
                 * Lines that start with a " means that there is a comma within the title which
                 * would disrupt the cleaning process.
                 * Send the line to a helper method to set the movie variables properly
                 */
                if (line.startsWith("\"")) {
                    formatTitleWithComma(line, movie);

                } else {
                  
                    
                    /**
                     * Set title, rating, genre and releaseYear since they never change even if a
                     * line is missing information
                     */
                    movie.setTitle(movieAttributes[0]);
                    movie.setRating(formatRating(movieAttributes[1]));
                    movie.setGenre(movieAttributes[2]);
                    movie.setReleaseYear(movieAttributes[3]);

                    /**
                     * Since the release date column can contain a comma,
                     * we set the remaining movie variables depending on their respective place only
                     * if the line isn't missing any data
                     * The lines that are missing the last column of data will have the duration set
                     * to empty
                     */
                    if (movieAttributes[4].startsWith("\"")
                            && (movieAttributes.length >= 16 || movieAttributes.length == 15 )) {
                        if (movieAttributes.length == 16) {
                            movie.setDuration(movieAttributes[15]);
                        }
                        if (movieAttributes.length == 17) {
                            movie.setDuration(movieAttributes[16]);
                        }
                        if (movieAttributes.length == 18) {
                            movie.setDuration(movieAttributes[17]);
                        }
                        movie.setScore(formatNumber(movieAttributes[6]));
                        movie.setDirector(movieAttributes[8]);
                        movie.setGross(formatGross(movieAttributes[13]));




                    }
                    /**
                     * There are a couple movieAttributes that are missing the last 5 columns of
                     * data so we set the data appropriatly without some of the fields
                     */
                    else if (movieAttributes.length == 10) {
                        movie.setDirector(movieAttributes[7]);
                        movie.setScore(formatNumber(movieAttributes[5]));
                    }

                    else if (movieAttributes.length > 16) {
                        movie.setScore(formatNumber(movieAttributes[6]));
                    }

                    /**
                     * In case if movieAttributes where the release date have no comma, go through
                     * here since the
                     * data are in different spots
                     */
                    
                    else {
                        movie.setDuration(movieAttributes[14]);
                        movie.setDirector(movieAttributes[7]);
                        movie.setGross(formatGross(movieAttributes[12]));
                        movie.setScore(formatNumber(movieAttributes[5]));

                    }

                    /* Add movie into movie list after changes */
                    // System.out.println(movie);
                    movieList.add(movie);
                }

            }  

        } catch (IOException e) {
            e.printStackTrace();
        }finally {
            reader.close();
        }

        /**
         * Return the List of movies
         */
        return movieList;
    }

    /**
     * Method to check if the score or gross aren't empty strings.
     * If empty, return 0, if not parse it to a double
     * 
     * @param number A String containing either a number or is empty
     * @return the parsed double of the string or the default number of 0
     */
    public String formatNumber(String number) {
        if (number.equals(""))
        {

            return "Unknown";
        }
        return number;
    }


    /**
     * Formats the gross into a more readable number
     * 
     * @param number A String containing either a number or is empty
     * @return the formatted number
     */
    public String formatGross(String number) {

        if (formatNumber(number).equals("Unknown")) {
            return "Unknown";
        }
        String newNumber = formatter.format(Double.parseDouble(formatNumber(number)));

        return newNumber;
    }
    
    /**
     * Checks if rating is empty and make it unknown or keeps it
     * @param letter string containing rating
     * @return the formatted rating
     */
    public String formatRating(String letter) {
        if(letter.equals(""))
        {
            return "Unknown";
        }
        return letter;
    }


    /**
     * 
     * @param line line containing Movie where the title contains at least one
     *             comma
     */
    public void formatTitleWithComma(String line, Movie movie) {

        /**
         * Split by ", to get the title by itself. Creates two other arrays.
         * One containing everything before and up to the release date, and the other
         * containing everything after
         */
        String[] commas = line.split("\",");
        String[] firstHalf = commas[1].split(",");
        String[] secondHalf = commas[2].split(",");


        /**
         * Set the variables depending on their placements in the seperate arrays
         */
        movie.setTitle(commas[0].substring(1));
        movie.setDuration(secondHalf[9]);
        movie.setRating(formatRating(firstHalf[0]));
        movie.setGenre(firstHalf[1]);
        movie.setReleaseYear(firstHalf[2]);
        movie.setDirector(secondHalf[2]);
        movie.setScore(formatNumber(secondHalf[0]));
        movie.setGross(formatGross(secondHalf[7]));
        //movie.setReleaseYear(firstHalf[2]);

        /**
         * create a movie object and add it to List of movies
         */
        movieList.add(movie);
    }
}

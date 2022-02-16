package utils;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class Importer {
    /**
     * Create private fields for every field of a movie
     */
    private String moviesPath;
    private String title, duration, genre, rating, director;
	private double score, gross;
    private int releaseYear;
    private List<Movie> movieList;

    /**
     * set the path to the csv file
     */
    public Importer() {
        this.moviesPath = "importer/src/main/java/utils/resources/movies.csv";
    }

    public List<Movie> fetchDataFromDataset() {

        String line = " ";
        String splitby = ",";
        movieList = new ArrayList<Movie>();

        /**
         * a try-catch method to extract data from csv file
         */
        try {
            boolean firstLine = true;
            BufferedReader reader = new BufferedReader(new FileReader(moviesPath));
            while ((line = reader.readLine()) != null) {

                /**
                 * Skip the first line of the csv file
                 */
                if (firstLine) {
                    firstLine = false;
                    continue;
                }

                String[] movies = line.split(splitby);
                /**
                 * Lines that start with a " mean that there is a comma within the title which would disrupt the cleaning process.
                 * Send the line to a helper method to set the movie variables properly 
                 */
                if (line.startsWith("\"")) {
                    titleWithComma(line);

                } else {
                    /**
                     * Set title, rating, genre and releaseYear since they never chnage even if a line is missing information
                     */
                    title = movies[0];
                    rating = movies[1];
                    genre = movies[2];
                    releaseYear = Integer.parseInt(movies[3]);
                    score = parseDouble(movies[6]);

                    /**
                     * Since the release date column can contain a comma, 
                     * we set the remaining movie variables depending on their respective place only if 
                     * the line isn't missing any data
                     * The lines that are missing the last column of data will have the duration set to empty
                     */
                    if (movies[4].startsWith("\"") && (movies.length == 16 || movies.length == 15)) {
                        if (movies.length == 16) {
                            duration = movies[15];
                        } else {
                            duration = "";
                        }
                        director = movies[8];
                        gross = parseDouble(movies[13]);

                    }
                    /**
                     * There are a couple movies that are missing the last 5 columns of data
                     * so we set the data appropriatly without some of the fields
                     */
                    else if (movies.length == 10) {
                        duration = "";
                        director = movies[7];
                        gross = 0.0;

                    }
                    /**
                     * Movies the the release date have no comma go through here since the data is in different spots 
                     */
                    else {
                        System.out.println(title);
                        duration = movies[14];
                        director = movies[7];
                        gross = parseDouble(movies[12]);
                    }

                    /**
                     * Create a movie object with all the data and add it to the List
                     */
                    Movie movie = new Movie(title, " ", duration, genre, rating, " ", director,
                            score, gross, releaseYear);
                    movieList.add(movie);
                }

            }

        } catch (IOException e) {
            e.printStackTrace();
        }

        /**
         * Return the List of movies
         */
        return movieList;
    }

/**
 * Method the check if the score or gross arent empty strings.
 * If empty return 0, if not parse it to a Double
 * @param number A String containing either a number or is empty
 * @return the parsed double of the string or the default number of 0
 */
public double parseDouble(String number) {
    return number != "" ? Double.parseDouble(number) : 0;
}

/**
 * 
 * @param line line conytaining Movie where the title contains at least one comma
 */
public void titleWithComma(String line) {
    /** 
     * Split by ", to get the titll by itself. Creates two other arrays.
     * One containing everythig before and up to the release date, and the other
     * containing everything after
    */
    String[] commas = line.split("\",");
    String[] firstHalf = commas[1].split(",");
    String[] secondHalf = commas[2].split(",");

    /**
     * Set the variables depending on their placements in the seperate arrays
     */
   title = commas[0].substring(1);
   duration=secondHalf[9];
   rating = firstHalf[0];
   genre = firstHalf[1];
   releaseYear = Integer.parseInt(firstHalf[2]);
   director=secondHalf[2];
   score=parseDouble(secondHalf[0]);
   gross=parseDouble(secondHalf[7]);
   releaseYear = Integer.parseInt(firstHalf[2]);

   /**
    * create a movie object and add it to List of Movies
    */
   Movie movie = new Movie(title, " ", duration, genre, rating, " ", director,
           score, gross, releaseYear);
    movieList.add(movie);

    }
}

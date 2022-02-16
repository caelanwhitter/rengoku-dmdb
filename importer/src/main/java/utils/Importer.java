package utils;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class Importer {
    private String moviesPath;
    private String title, duration, genre, rating, director;
	private double score, gross;
    private int releaseYear;
    private int count = 0;
    public Importer() {
        this.moviesPath = "importer/src/main/java/utils/resources/movies.csv";
    }

    public List<Movie> fetchDataFromDataset() {
        String line = " ";
        String splitby = ",";
        
        
        List<Movie> movieList = new ArrayList<Movie>();

        try {
            boolean firstLine = true;
        BufferedReader reader = new BufferedReader(new FileReader(moviesPath));
        while ((line = reader.readLine()) != null) {
            if (firstLine) {
                firstLine = false;
                continue;
            }
            if (line.startsWith("\"")) {
                String[] commas = line.split("\",");
                title = commas[0].substring(1);
                //System.out.println(commas[0].substring(1));
            } else {
                String[] movies = line.split(splitby);
                title = movies[0];
                rating = movies[1];
                genre = movies[2];
                releaseYear = Integer.parseInt(movies[3]);

                if (movies[4].startsWith("\"") && movies.length == 16) {
                    duration = movies[15];
                    director = movies[8];
                    score = parseDouble(movies[6]);
                    gross = parseDouble(movies[13]);

                } else if (movies.length == 10) {
                    duration = "";
                    director = movies[7];
                    score = parseDouble(movies[6]);
                    gross = 0.0;

                } else if (movies.length == 15) {
                    duration = movies[14];
                    director = movies[7];
                    score = parseDouble(movies[6]);
                    gross = 0.0;

                } else {
                    duration = movies[14];
                    director = movies[7];
                    score = parseDouble(movies[6]);
                    gross = parseDouble(movies[12]);
                }
                count++;
                System.out.println(title + ", " + duration);

                Movie movie = new Movie(title, " ", duration, genre, rating, " ", director,
                        score, gross, releaseYear);
                //System.out.println(title + " | " + movies[15] + " | " +  movies[2] + " | " +  movies[1] + " | " +  movies[8] + " | " + 
                //movies[6] + " | " + movies[13] + " | " +  movies[3]);
                //System.out.println(movie.getTitle()+" | "+movie.getDescription()+" | "+movie.getDuration()+" | "+movie.getGenre()+" | "+movie.getRating()+" | "+movie.getPoster()+" | "+movie.getDirector()+" | "+movie.getScore()+" | "+movie.getGross()+" | "+movie.getReleaseYear());
                movieList.add(movie);
            }

        }
        System.out.println(count);

    }catch(IOException e)
    {
        e.printStackTrace();
    }

        return movieList;
}

public double parseDouble(String number) {
    return number != "" ? Double.parseDouble(number) : 0;
    }
}

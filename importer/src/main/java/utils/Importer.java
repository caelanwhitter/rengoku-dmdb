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
            if(line.startsWith("\""))
            {
                String[] commas = line.split("\",");
                title = commas[0].substring(1);
                //System.out.println(commas[0].substring(1));
            }
            else {
                String[] movies = line.split(splitby);
                if (movies[4].startsWith("\"") || movies[4]== "")  {

                    title = movies[0];
                    duration = movies[15];
                    genre = movies[2];
                    rating = movies[1];
                    director = movies[8];
                    score = parseDouble(movies[6]);
                    gross = parseDouble(movies[13]);
                    releaseYear = Integer.parseInt(movies[3]);
                    
                } else {
                    title = movies[0];
                    //duration = movies[14];
                    genre = movies[2];
                    rating = movies[1];
                    director = movies[7];
                    score = parseDouble(movies[6]);
                    //gross = parseDouble(movies[12]);
                    releaseYear = Integer.parseInt(movies[3]);
                    System.out.println(title+", "+movies[1]+", "+movies[2]+", "+movies[3]+", "+movies[4]+", "+movies[5]+", "+movies[6]);
                  }

            Movie movie = new Movie(title, " ", duration, genre, rating , " ", director,
                    score, gross, releaseYear);
            //System.out.println(title + " | " + movies[15] + " | " +  movies[2] + " | " +  movies[1] + " | " +  movies[8] + " | " + 
            //movies[6] + " | " + movies[13] + " | " +  movies[3]);
            //System.out.println(movie.getTitle()+" | "+movie.getDescription()+" | "+movie.getDuration()+" | "+movie.getGenre()+" | "+movie.getRating()+" | "+movie.getPoster()+" | "+movie.getDirector()+" | "+movie.getScore()+" | "+movie.getGross()+" | "+movie.getReleaseYear());
                    movieList.add(movie);
            }


        }

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

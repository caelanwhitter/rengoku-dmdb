package utils;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class Importer {
    private String moviesPath;

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
            String[] movies = line.split(splitby);

            Movie movie = new Movie(movies[0], " ", movies[15], movies[2], movies[1], " ", movies[8],
                    parseDouble(movies[6]), parseDouble(movies[13]), Integer.parseInt(movies[3]));
// fix parse double bug 
            System.out.println(movie.getTitle());
                    movieList.add(movie);

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

package utils;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintStream;
import java.util.List;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;

import org.bson.codecs.configuration.CodecRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.codecs.pojo.PojoCodecProvider;

/**
 * Hello world!
 *
 */
public class App 
{
    
    public static void main( String[] args ) throws FileNotFoundException
    {

        ConnectionString connectionString = new ConnectionString(
                "mongodb+srv://dmdbadmin:iKYCXvnAZWe0zGO8@dmbdcluster.nkrxw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");
        CodecRegistry pojoCodecRegistry = CodecRegistries
                .fromProviders(PojoCodecProvider.builder().automatic(true).build());
        CodecRegistry codecRegistry = CodecRegistries.fromRegistries(MongoClientSettings.getDefaultCodecRegistry(),
                pojoCodecRegistry);
        MongoClientSettings clientSettings = MongoClientSettings.builder().applyConnectionString(connectionString)
                .codecRegistry(codecRegistry).build();
        MongoClient client = MongoClients.create(clientSettings);

        MongoDatabase database = client.getDatabase("moviedb");
        MongoCollection<Movie> movies = database.getCollection("movies", Movie.class);

        Importer importer = new Importer();
        List<Movie> movieList = importer.fetchDataFromDataset();
        
        int count = 0;

        PrintStream o = new PrintStream(new File("A.txt"));

        for (Movie movie : movieList) {
                count++;
                //System.out.println(movie.getTitle());
                System.setOut(o);
                System.out.println(movie.getTitle()+", "+movie.getDescription()+", "+movie.getDuration()+", "+movie.getGenre()+", "+movie.getRating()+", "+movie.getPoster()+", "+movie.getDirector()+", "+movie.getScore()+", "+movie.getGross()+", "+movie.getReleaseYear());
        }

        //System.out.println(count);
        
        
        // Movie m = new Movie();
        //movies.insertOne(m);

    }
}

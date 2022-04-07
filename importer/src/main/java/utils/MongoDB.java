package utils;

import java.io.IOException;
import java.util.List;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import org.bson.codecs.configuration.CodecRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.codecs.pojo.PojoCodecProvider;

import io.github.cdimascio.dotenv.Dotenv;

/**
 * MongoDB.java sets up initial connection to MongoDB database, creates Importer
 * and inserts movies into database
 * 
 * @author Caelan Whitter & Daniel Lam
 */
public class MongoDB {
    public static void main(String[] args) throws IOException {

        Dotenv dotenv = Dotenv.load();
        final String ATLAS_URI = dotenv.get("ATLAS_URI");
        final String DATABASE_NAME = "moviedb";
        final String COLLECTION_NAME = "movies";

        System.out.println("Importing data into: '" + DATABASE_NAME + "'...");

        ConnectionString connectionString = new ConnectionString(ATLAS_URI);
        CodecRegistry pojoCodecRegistry = CodecRegistries
                .fromProviders(PojoCodecProvider.builder().automatic(true).build());
        CodecRegistry codecRegistry = CodecRegistries.fromRegistries(
                MongoClientSettings.getDefaultCodecRegistry(),
                pojoCodecRegistry);
        MongoClientSettings clientSettings = MongoClientSettings.builder()
                .applyConnectionString(connectionString)
                .codecRegistry(codecRegistry).build();
        MongoClient client = MongoClients.create(clientSettings);

        MongoDatabase database = client.getDatabase(DATABASE_NAME);
        MongoCollection<Movie> movies = database.getCollection(COLLECTION_NAME, Movie.class);

        Importer importer = new Importer("importer/src/main/java/utils/resources/movies.csv");
        List<Movie> movieList = importer.fetchDataFromDataset();
        movies.insertMany(movieList);

        System.out.println("Importing data into: '" + DATABASE_NAME + "' done!");
    }
}

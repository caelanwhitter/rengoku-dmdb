package utils;

import org.bson.codecs.pojo.annotations.BsonProperty;
import org.bson.*;
import org.bson.types.*;
import java.util.*;

public class Movie {
	private ObjectId id;
	private String title, description, duration, genre, rating, poster, director;
	private double score, gross;
	private int releaseYear;

	public Movie() {}

	public Movie(String title, String description, String duration, String genre, String rating,
			String poster, String director, double score, double gross, int releaseYear) {
		this.title = title;
		this.description = description;
		this.duration = duration;
		this.genre = genre;
		this.rating = rating;
		this.poster = poster;
		this.director = director;
		this.score = score;
		this.gross = gross;
		this.releaseYear = releaseYear;
	}

	public ObjectId getId() {
		return id;
	}

	public void setId(ObjectId id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getDuration() {
		return duration;
	}

	public void setDuration(String duration) {
		this.duration = duration;
	}

	public String getGenre() {
		return genre;
	}

	public void setGenre(String genre) {
		this.genre = genre;
	}

	public String getRating() {
		return rating;
	}

	public void setRating(String rating) {
		this.rating = rating;
	}

	public String getPoster() {
		return poster;
	}

	public void setPoster(String poster) {
		this.poster = poster;
	}

	public String getDirector() {
		return director;
	}

	public void setDirector(String director) {
		this.director = director;
	}

	public double getScore() {
		return score;
	}

	public void setScore(double score) {
		this.score = score;
	}

	public double getGross() {
		return gross;
	}

	public void setGross(double gross) {
		this.gross = gross;
	}

	public int getReleaseYear() {
		return releaseYear;
	}

	public void setReleaseYear(int releaseYear) {
		this.releaseYear = releaseYear;
	}
}

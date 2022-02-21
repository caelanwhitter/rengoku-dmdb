package utils;

import org.bson.types.*;

public class Movie {
	// TO-DO: find better replacement than empty string
	private ObjectId id;
	private String title, description, duration, genre, rating, poster, director, gross;
	private double score;
	private int releaseYear;

	public Movie() {
		this.title = "";
		this.description = "";
		this.duration = "";
		this.genre = "";
		this.rating = "";
		this.poster = "";
		this.director = "";
		this.score = 0.0;
		this.gross = "";
		this.releaseYear = 0;
	}

	public Movie(String title, String description, String duration, String genre, String rating,
			String poster, String director, double score, String gross, int releaseYear) {
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

	public String getGross() {
		return gross;
	}

	public void setGross(String gross) {
		this.gross = gross;
	}

	public int getReleaseYear() {
		return releaseYear;
	}

	public void setReleaseYear(int releaseYear) {
		this.releaseYear = releaseYear;
	}

	@Override
	public String toString() {
		return "MOVIE: " + title + " | " + description + " | " + genre + " | " + rating + " | " + poster + " | "
				+ director + " | " + score + " | " + gross + " | " + releaseYear;
	}
}

package utils;

import org.bson.types.*;

public class Movie {
	// TO-DO: find better replacement than empty string
	private ObjectId id;
	private String title, description, duration, genre, rating, poster, director, gross, score, releaseYear;

	public Movie() {
		this.title = "Unknown";
		this.description = "";
		this.duration = "Unknown";
		this.genre = "Unknown";
		this.rating = "Unknown";
		this.poster = "";
		this.director = "Unknown";
		this.score = "Unknown";
		this.gross = "Unknown";
		this.releaseYear = "Unknown";
	}

	public Movie(String title, String description, String duration, String genre, String rating,
			String poster, String director, String score, String gross, String releaseYear) {
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

	public String getScore() {
		return score;
	}

	public void setScore(String score) {
		this.score = score;
	}

	public String getGross() {
		return gross;
	}

	public void setGross(String gross) {
		this.gross = gross;
	}

	public String getReleaseYear() {
		return releaseYear;
	}

	public void setReleaseYear(String releaseYear) {
		this.releaseYear = releaseYear;
	}

	@Override
	public String toString() {
		return "MOVIE: " + description + " | " + director + " | "+ duration +" | " + genre + " | " + gross + " | " + poster + " | "
				+ rating + " | " + releaseYear + " | " + score + " | " + title;
	}


}

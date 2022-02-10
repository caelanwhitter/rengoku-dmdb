package utils;

import org.bson.types.*;

public class Review {
	private ObjectId id;
	private String username, content, datePosted;
	private double rating;

	public Review() {}

	public Review(ObjectId id, String username, String content, String datePosted, double rating) {
		this.id = id;
		this.username = username;
		this.content = content;
		this.datePosted = datePosted;
		this.rating = rating;
	}

	public ObjectId getId() {
		return id;
	}

	public void setId(ObjectId id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public double getRating() {
		return rating;
	}

	public void setRating(double rating) {
		this.rating = rating;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getDatePosted() {
		return datePosted;
	}

	public void setDatePosted(String datePosted) {
		this.datePosted = datePosted;
	}
}

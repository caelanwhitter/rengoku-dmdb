package utils;

import org.bson.types.*;

/**
 * Submission is an object that represents and hold the fields of an Hidden Gem
 */
public class Submission {
    private ObjectId id;
    private String username, title, description, duration, genre, rating, poster, videoLink;
    private double score;

    public Submission() {
    }

    public Submission(String username, String title, String description, String duration, String genre,
            String rating, String poster, String videoLink, double score) {
        this.username = username;
        this.title = title;
        this.description = description;
        this.duration = duration;
        this.genre = genre;
        this.rating = rating;
        this.poster = poster;
        this.videoLink = videoLink;
        this.score = score;
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

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }

    public String getPoster() {
        return poster;
    }

    public void setPoster(String poster) {
        this.poster = poster;
    }

    public String getVideoLink() {
        return videoLink;
    }

    public void setVideoLink(String videoLink) {
        this.videoLink = videoLink;
    }
}

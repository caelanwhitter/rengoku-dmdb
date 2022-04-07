# Dawson Movie Database

[Visit our official website](https://dmdb-project.herokuapp.com)

## Description
This project aims to display a list of over 7500 movies to a user. A user could also login, review movies and submit their own Hidden Gem which are user-submitted movies found on their own separate page.

## Installation
For this project, the latest version of Node.js is preferred, it was developed with Node.js 16.14.2 LTS, but should work with slightly older versions too.
NPM is also necessary, but usually comes with the installation of Node.js.

To install and run this project on your local network:
   1. Clone the repository, using HTTP or SSH, in the directory of your choice
   2. Change directory to the project: `cd rengoku-dmdb`
   3. Use the command `npm install` in the root, dmdb-app and server folders, or use this command:
   ```sh
   npm install; cd server; npm install; cd ../dmdb-app/; npm install; cd .. 
   ```
   4. The project should be set up
   5. Set up a `.env` file at the root folder level that includes these variables:
      - `ATLAS_URI`: Your MongoDB connection URL
      - `PORT`: Set the `PORT` variable to 3001
      - `AZURE_STORAGE_CONNECTION_STRING`: Connection string for the Microsoft Azure blob storage
      - `TMDB_API_KEY`: Your TMDB API Key gotten from your TMDB Accoutn
      - `SECRET`: A secret key
   6. Set up a `.env` file at the *dmdb-app/* folder level that includes this variable:
      - `REACT_APP_GOOGLE_CLIENT_ID`: ID for the Google Login

## Usage
You can head over to our [deployed site](https://dmdb-project.herokuapp.com) or start the site yourself, if you have two terminals open. On one terminal, execute `npm start` from the root folder, then on another terminal, change directory to the `dmdb-app/` directory, then run `npm start`. A page should then appear in your default browser from which you can start using the application.

## Support
If you would like to check the DMDB Project's server and site status, head over to our [status page](https://stats.uptimerobot.com/v7xxocEMVD) hosted by UptimeRobot.

If you would like to report a bug [send an email](mailto:daniel.lam@dawsoncollege.qc.ca) to Daniel Lam.

## Contributing
Unfortunately, we do not accept contributions, as this was made as a project for our college.

## Authors and acknowledgment

- Mikael Baril (1844064)
- Daniel Lam (1932789)
- Caelan Whitter (1841768)
- Danilo Zhu (1943382)

with initial contribution from Natalia Solovyeva.

Special thanks to [TMDB](https://www.themoviedb.org/) for the poster images and movie descriptions.

## License
[Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0)

## Project status
This project is complete.

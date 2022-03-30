/**
 * Start server and listen on port 3001 or PORT environment variable
 * @author Danilo Zhu 1943382, Mikael Baril 1844064, Caelan Whitter 1841768
 */
const Mongoose = require("./database/mongoose");
const User = Mongoose.User;


const dotenv = require("dotenv");
const session = require("express-session");
dotenv.config();


const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

const app = require("./app");



app.post("/api/google-login", async (req, res) => {
  const { token } = await req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });
  const { name, email, picture } = ticket.getPayload();
  let user;

  const findUser = await User.find({ "email": email });
  if (findUser.length === 0) {
    req.session.user = email;

    user = new User({
      name: name,
      email: email,
      picture: picture
    });
    await user.save();
    try {
      res.json(user);
      res.end();
    } catch (error) {
      console.error(error);
      res.sendStatus(404).end();
    }
    
  } else {
    req.session.userId = email;
    console.log(req.session.userId);
    user = await User.updateOne(
      { email: email },
      { $set: { "name": name, "picture": picture } },
      {upsert: true}
  
    )
    try {
      res.json(findUser[0]);
      res.end();
    } catch (error) {
      console.error(error);
      res.sendStatus(404).end();
    }
  }

})

app.use(session({
  secret: "siuirpoerer",
  resave: true,
  saveUninitialized: true

})); 

app.use(async (req, res, next) => {
  const user = await User.findFirst({where: { email:  req.session.userId }})
  req.user = user
  next()
})


app.listen(process.env.PORT || 3001, () => {
  console.log(`Server listening on port ${process.env.PORT || 3001}...`);
}) 

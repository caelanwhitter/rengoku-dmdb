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


app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true

})); 

app.post("/api/google-login", async (req, res) => {
  const { token } = await req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });
  const { name, email, picture } = ticket.getPayload();
  req.session.userId = email;
  let user;

  const findUser = await User.find({ "email": email });
  
  if (findUser.length === 0) {

    user = new User({
      name: name,
      email: email,
      source: picture
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
    user = await User.updateOne(
      { email: email },
      { $set: { "name": name, "source": picture } },
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

app.delete("/api/v1/auth/logout", async (req, res) => {
  await req.session.destroy()
  res.status(200)
  res.json({
    message: "Logged out successfully"
  })
})






app.listen(process.env.PORT || 3001, () => {
  console.log(`Server listening on port ${process.env.PORT || 3001}...`);
}) 

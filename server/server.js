/**
 * Start server and listen on port 3001 or PORT environment variable
 * @author Danilo Zhu 1943382, Mikael Baril 1844064, Caelan Whitter 1841768, Daniel Lam 1932789
 */
const Mongoose = require("./database/mongoose");
const User = Mongoose.User;


const dotenv = require("dotenv");
const { OAuth2Client } = require("google-auth-library");
const session = require("express-session");
dotenv.config();

const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);
const app = require("./app");
const res = require("express/lib/response");
const req = require("express/lib/request");

app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: false

}));

app.use(async (req, res, next) => {
  
  const user = await User.find({email:  req.session.userId })
  req.user = user
  next()
})

/**
 * @swagger
 * post:
 *    summary: Google Login
 *    security:
 *      - OAuth2: [write]
 *    
 *    responses:
 *      201:
 *        description: Created
 */
app.post("/api/google-login", async (req, res) => {
  const { token } = await req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });
  const { name, email, picture, biography } = ticket.getPayload();
  let user;

  const findUser = await getUser(email);
  req.session.userId = email;

  console.log(req.session.userId);
 
  if (findUser.length === 0) {

    user = new User({
      name: name,
      email: email,
      source: picture,
      biography: ""
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
      { $set: { "name": name, "source": picture, "biography": biography } },
      { upsert: true }
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




app.post("/api/biography", async (req, res) => {
  const body = req.body;
  await User.updateOne(
    { email: body.email },
    { $set: { "biography": body.biography } },
    { upsert: true }
  );
  console.log(req.user);
  const user = await getUser(body.email);
  try {
    res.json(user);
    res.end();
  } catch (error) {
    console.error(error);
    res.sendStatus(404).end();
  }
});


app.get("/api/useSession", async (req, res) => {
  try {
    res.json(req.user);
    res.end();
  } catch (error) {
    console.error(error);
    res.sendStatus(404).end();
  }
});

app.delete("/api/v1/auth/logout", async (req, res) => {
  console.log(req.user);
  await req.session.destroy()
  res.status(200)
  res.json({
    message: "Logged out successfully"
  })
})

/**
 * getUser() is a helper method that returns the fields of a User based on their email
 * @param {*} email 
 * @returns 
 */
async function getUser(email) {
  if (req.user !== undefined) {
    console.log(req.session.userId);
  }
  const findUser = await User.find({ "email": email });
  return findUser;
}

// Server listening to port 3001
app.listen(process.env.PORT || 3001, () => {
  console.log(`Server listening on port ${process.env.PORT || 3001}...`);
}) 



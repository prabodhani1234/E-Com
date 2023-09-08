const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv").config()

const app = express()
app.use(cors())
app.use(express.json({limit : "10mb"}))

const PORT = process.env.PORT || 8080

//MongoDB Connection
mongoose.set("strictQuery", false)
mongoose.connect(process.env.MONGODB_URL)
.then(()=>console.log("Connection To The Database"))
.catch((err)=>console.log(err))

//schema
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  confirmPassword: String,
  image: String,
});

// 
const userModel = mongoose.model("user", userSchema)
  
//API
app.get("/",(req,res)=>{
    res.send("Server is running")
})

//Sign UP

app.post("/signup", async (req, res) => {
  try {
    const { email } = req.body;

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      res.send({ message: "Email id is already registered", alert: false });
    } else {
      const newUser = new userModel(req.body);
      await newUser.save();
      res.send({ message: "Successfully signed up", alert: true });
    }
  } catch (error) {
    console.error("Error during sign-up:", error);
    res.status(500).json({ message: "Internal server error", alert: false });
  }
});

//api login
app.post("/login", async (req, res) => {
  try {
    const { email } = req.body;
    const result = await userModel.findOne({ email: email }).exec();

    if (result) {
      const dataSend = {
        _id: result._id,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        image: result.image,
      };
      console.log(dataSend);
      res.send({
        message: "Login is successfully",
        alert: true,
        data: dataSend,
      });
    } else {
      res.send({
        message: "Email is not available, please sign up",
        alert: false,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "An error occurred during login",
      alert: false,
    });
  }
});


//server is ruuning
app.listen(PORT, () => console.log("server is running at port : " + PORT));
require("dotenv").config();
const express  = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const routes = require("./routes");
const app  = express();

//middleware
app.use(cors());
app.use(express.json());

//Connect DB
connectDB();

//routes
app.use("/api",routes);

app.get("/",(req,res)=>{
    res.send("Backend up!");
});

const PORT = 8080;
app.listen(PORT,() => console.log(`Backend server running on ${PORT}`));
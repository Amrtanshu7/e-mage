require("dotenv").config();
const mongoose = require("mongoose");
const express  = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const routes = require("./routes");
const authRoutes = require("./routes/authRoutes");
const imageRoutes = require("./routes/imageRoutes");
const app  = express();

//middleware
app.use(cors());
app.use(express.json());

//Connect DB
connectDB();


app.get("/health", (req,res) => {
    res.status(200).json({
        status: "ok",
        service: "backend",
        timestamp: new Date().toISOString()
    });
});

app.get("/health/db",(req,res) => {
    const state = mongoose.connection.readyState;

    res.status(state === 1 ? 200 : 500).json({
        status: state === 1 ? "ok" : "down",
        mongoState: state
    });
});

//routes
app.use("/api",routes);
app.use("/auth",authRoutes);
app.use("/api",imageRoutes);

app.get("/",(req,res)=>{
    res.send("Backend up!");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT,() => console.log(`Backend server running on ${PORT}`));
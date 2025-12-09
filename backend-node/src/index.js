const express  = require("express");
const cors = require("cors");
const routes = require("./routes");

const app  = express();

app.use(cors());
app.use(express.json());

app.use("/api",routes);

app.get("/",(req,res)=>{
    res.send("Backend up!");
});

const PORT = 8080;
app.listen(PORT,() => console.log(`Backend server running on ${PORT}`));
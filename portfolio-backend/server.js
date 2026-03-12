const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log("MongoDB Error ❌", err));

app.listen(process.env.PORT || 5000, () => {
    console.log("Server is running on port 5000");
});
const contactRoutes = require("./routes/projects");
app.use("/api/contact", contactRoutes);
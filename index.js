const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { DBConnection } = require("./database/db.js");
const cookieParser = require("cookie-parser");
const authRoutes = require('./routes/auth.js');
const problemRoutes = require('./routes/problem.js')
const auth = require("./middleware/auth.js");

dotenv.config();

DBConnection(); //Db connection

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({
    origin:['https://codebash.online', 'https://www.codebash.online','http://localhost:5173'],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/',auth, authRoutes);
app.use('/',auth,problemRoutes);

// Basic route for testing
app.get('/', (req, res) => {
    res.json({ message: "Welcome to the CodeArena" });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
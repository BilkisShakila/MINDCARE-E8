require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 4000;

// =====================
// MIDDLEWARE
// =====================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// static files
app.use(express.static(path.join(__dirname, "public")));

// session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "mindcare-secret",
    resave: false,
    saveUninitialized: false
  })
);

// =====================
// VIEW ENGINE
// =====================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// =====================
// ROUTES
// =====================
const routes = require("./routes");
app.use("/", routes);

// =====================
// SERVER
// =====================
app.listen(PORT, "0.0.0.0",() => {
  console.log(`Server running on port ${PORT}`);
});
const express = require("express");
const router = express.Router();
const db = require("../config/database");

// =====================
// AUTH
// =====================

// login page
router.get("/login", (req, res) => {
  res.render("login");
});

// login process
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.send("Terjadi kesalahan");
      }

      if (results.length > 0) {
        req.session.user = results[0];
        res.redirect("/");
      } else {
        res.send("Login gagal");
      }
    }
  );
});

// logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

// =====================
// REGISTER
// =====================
router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, password],
    err => {
      if (err) {
        console.error(err);
        return res.send("Email sudah terdaftar");
      }
      res.redirect("/login");
    }
  );
});

// =====================
// AUTH GUARD
// =====================
router.use((req, res, next) => {
  if (
    !req.session.user &&
    req.path !== "/login" &&
    req.path !== "/register"
  ) {
    return res.redirect("/login");
  }
  next();
});

// =====================
// HOME / TIMELINE (index.ejs)
// =====================
router.get("/", (req, res) => {
  db.query(
    "SELECT * FROM moods WHERE user_id = ? ORDER BY created_at DESC",
    [req.session.user.user_id],
    (err, moods) => {
      if (err) {
        console.error(err);
        return res.send("Gagal mengambil data mood");
      }

      // 👉 render ke index.ejs (BUKAN timeline.ejs)
      res.render("index", { moods, user: req.session.user });
    }
  );
});

// =====================
// CREATE MOOD
// =====================
router.post("/mood", (req, res) => {
  const { mood_level, notes } = req.body;

  db.query(
    "INSERT INTO moods (user_id, mood_level, notes) VALUES (?, ?, ?)",
    [req.session.user.user_id, mood_level, notes],
    err => {
      if (err) {
        console.error(err);
        return res.send("Gagal menyimpan mood");
      }
      res.redirect("/");
    }
  );
});

// =====================
// EDIT MOOD
// =====================
router.get("/mood/edit/:id", (req, res) => {
  db.query(
    "SELECT * FROM moods WHERE mood_id = ? AND user_id = ?",
    [req.params.id, req.session.user.user_id],
    (err, result) => {
      if (err || result.length === 0) {
        return res.send("Data tidak ditemukan");
      }

      res.render("edit", { mood: result[0] });
    }
  );
});

// =====================
// UPDATE MOOD
// =====================
router.post("/mood/update/:id", (req, res) => {
  const { mood_level, notes } = req.body;

  db.query(
    "UPDATE moods SET mood_level = ?, notes = ? WHERE mood_id = ? AND user_id = ?",
    [mood_level, notes, req.params.id, req.session.user.user_id],
    err => {
      if (err) {
        console.error(err);
        return res.send("Gagal update mood");
      }
      res.redirect("/");
    }
  );
});

// =====================
// DELETE MOOD
// =====================
router.get("/mood/delete/:id", (req, res) => {
  db.query(
    "DELETE FROM moods WHERE mood_id = ? AND user_id = ?",
    [req.params.id, req.session.user.user_id],
    err => {
      if (err) {
        console.error(err);
        return res.send("Gagal menghapus mood");
      }
      res.redirect("/");
    }
  );
});

module.exports = router;
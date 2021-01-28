const router = require("express").Router();
const fs = require("fs");
const uuidv1 = require("uuidv1");
const { validateNote } = require("../../lib/notes");



router.get("/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", function (err, contents) {
    var words = JSON.parse(contents);
    res.send(words);
  });
});


router.post("/notes", (req, res) => {
  if (!validateNote(req.body)) {
    res.status(400).send("The note is not properly formatted.");
  } else {
    fs.readFile("db/db.json", (err, data) => { 
      if (err) throw err;
      
      let notes = JSON.parse(data);
      req.body.id = notes.length.toString();
      let note = {
        title: req.body.title,
        text: req.body.text,
        id: uuidv1(),
      };
      res.json(note);
      notes.push(note);
      fs.writeFile("db/db.json", JSON.stringify(notes, null, 2), (err) => {
        if (err) throw err;
        console.log("OK");
      });
    });
  }
});


router.delete("/notes/:id", (req, res) => {
  fs.readFile("db/db.json", (err, data) => {
    if (err) throw err;
    let deleteId = req.params.id;
    let notes = JSON.parse(data);
    notes.forEach((item, i) => {
      if (item.id == deleteId) {
        console.log(item);
        notes.splice(i, 1);
      }
    });

    fs.writeFile("db/db.json", JSON.stringify(notes, null, 2), (err) => {
      if (err) throw err;
      res.send("200");
    });
  });
});

module.exports = router;
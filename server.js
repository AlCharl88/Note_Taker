// Dependencies

const express = require('express');
const path = require('path');
const { json } = require('express');
const unId = require('unId');
const fs = requre('fs');


// Sets up the Express App
const app = express();
const PORT = process.env.PORT || 3000;

// Set up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "./public/assets")));

// Routes

app.get("/", (req, res) =>
res.sendFile(path.join
    (__dirname, "./public/index.html"))
);
app.get("/notes", (req, res) =>
res.sendFile(path.join
    (__dirname, "./public/notes.html"))
);

app.delete("/api/notes/:id", (req, res) => {
    const noteTodel = req.params.id;
    console.log(noteTodel);
    readDB("./db/db.json", (err, note) => {
        if(err) {
            console.log(err);
            return;
        }

        let notetodelInd = note.findIndex(n => n.id === noteTodel);
        note.splice(notetodelInd,1);
        const saveData = JSON.stringify(note);

        fs.writeFile("./db/db.json", saveData, err => {
            if(err) {
                console.log("error writing file", err);
            }else{
                console.log("note successfully deleted");
                res.json(note);
            }
        })
    });
});

// API Routes
app.get("/api/notes", (req, res) => {
    readDB("./db/db.json", (err, note) => {
        if(err) {
            console.log(err);
            return;
        }
        res.json(note);
    });
});

function readDB(filePath, cback) {
    fs.readFile(filePath, (err,data) => {
        if(err) {
            return cback && cback(err);
        } try {
            const object = JSON.parse(data);
            return cback && cback(null, object);
        } catch(err) {
            return cback && cback(err);
        }
    });
    };

    app.post("/api/notes", (req, res) => {
        const uniqId = unId.v4();

        fs.readFile("./db/db.json", "utf8", (err, dbFile) => {
            if(err) {
                console.log("error reading file", err);
            }else {
                const note = req.body;
                note.id = uniqId;
                const jsonString = JSON.parse(dbFile);
                jsonString.push(note);
                const saveData = JSON.stringify(jsonString);

                fs.writeFile("./db/db.json". saveData, err => {
                    if(err) {
                        console.log("error wriitng file", err);
                    } else {
                        console.log("note successfully added");
                        res.json(jsonString);
                    }
                })
            };
    });

});

app.listen(PORT, () => {
    console.log(`APP listening at http://localhost:${Port}`)
});




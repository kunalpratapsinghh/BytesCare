const express = require("express");
const { MusicRecord } = require("../Service/Music");
const { urlFinder } = require("../Service/TextUrlSearch");
const { searchSubtitlesByFileName, searchLyricsByFileName } = require("../Service/Subtitle");
const app = express();
const router = express.Router();
app.use(express.json());

router.get("", async (req, res) => {
  res.send("hello");
});

router.post("/audio", async (req, res) => {
  try {
    let { url, durationToRecord } = req.body; //durationToRecord in seconds
    let data = await MusicRecord(url, +durationToRecord);
    res.send(data);
  } catch (error) {
    res.status(401).send(error.message);
  }
});

router.post("/urlsearch", async (req, res) => {
  try {
    let { path } = req.body;
    let data = await urlFinder(path);
    res.send(data);
  } catch (error) {
    res.status(401).send(error.message);
  }
});

router.post("/subtitle", async (req, res) => {
  try {
    let { name, type } = req.body;
    let data;
    if (type === "movie") {
      data = await searchSubtitlesByFileName(name);
    } else if (type === "song") {
      data = await searchLyricsByFileName(name);
    } else {
      data = {
        success:false,
        message:`type ${type} is not correct. you need to define type as movie or song only`
      };
    }
    res.send(data);
  } catch (error) {
    res.status(401).send(error.message);
  }
});

module.exports = router;

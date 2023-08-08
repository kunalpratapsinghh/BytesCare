const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const record = require("node-record-lpcm16");
var screencap = require("screencap");

module.exports.MusicRecord = async (url, durationToRecord = 5) => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--disable-dev-shm-usage",
      "--autoplay-policy=no-user-gesture-required",
      "--enable-usermedia-screen-capturing",
      "--allow-http-screen-capture",
      "--no-sandbox",
      "--auto-select-desktop-capture-source=pickme",
      "--disable-setuid-sandbox",
      "--load-extension=" + __dirname,
    ],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({
      width: 1400,
      height: 1800,
    });
    await page.goto(url, { waitUntil: "networkidle2" });

    const promise1 = new Promise(async (resolve, reject) => {
      try {
        await page.waitForSelector("video", 5000);
        resolve("video");
      } catch (error) {
        reject("video not found");
      }
    });

    const promise2 = new Promise(async (resolve, reject) => {
      try {
        await page.waitForSelector("audio", 5000);
        resolve("audio");
      } catch (error) {
        reject("audio not found");
      }
    });
    let type = await Promise.race([promise1, promise2]);
    if (!["audio", "video"].includes(type)) {
      return { success: false, path: null };
    }
    const isAudioPlaying = await page.evaluate((type) => {
      const audioElements = document.querySelector(type);
      if (!audioElements.paused) {
        return true;
      }
      return false;
    }, type);

    if (isAudioPlaying) {
      let fileName = `${Date.now()}.wav`;
      const file = fs.createWriteStream(fileName, { encoding: "binary" });
      const recording = record.record();
      recording.stream().pipe(file);
      return new Promise((res, rej) => {
        setTimeout(() => {
          recording.stop();
          browser.close();
          res({ success: true, path: path.resolve(fileName) });
        }, durationToRecord * 1000);
      });
    } else {
      return { success: false, message: "No audio is playing on the page." };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
};

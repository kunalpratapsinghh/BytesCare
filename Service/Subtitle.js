const OS = require("opensubtitles-api");
const _ = require("lodash");
const axios = require("axios");

const OpenSubtitles = new OS({
  useragent: "MyApp v1",
  ssl: true,
});

module.exports.searchSubtitlesByFileName = async (fileName) => {
  try {
    const subtitle = await OpenSubtitles.search({
      sublanguageid: "eng",
      query: fileName,
    });
    if (!_.isEmpty(subtitle)) {
      return {
        success: true,
        subtitle,
      };
    }
    return {
      success: false,
      subtitle: "No result found",
    };
  } catch (error) {
    return {
      success: false,
      subtitle: error.message,
    };
  }
};

module.exports.searchLyricsByFileName = async (fileName) => {
  console.log(
    "🚀 ~ file: Subtitle.js:35 ~ module.exports.searchLyricsByFileName=async ~ fileName:",
    fileName
  );
  try {
    let { data } = await axios.get(
      `https://lyrist.vercel.app/api/${fileName}`,
      {
        headers: {
          authority: "lyrist.vercel.app",
          accept: "*/*",
          "accept-language": "en-US,en;q=0.9,hi;q=0.8",
          referer: "https://lyrist.vercel.app/",
          "sec-ch-ua":
            '"Not/A)Brand";v="99", "Google Chrome";v="115", "Chromium";v="115"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Linux"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "user-agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        },
      }
    );
    return {
      success: true,
      lyrics: data,
    };
  } catch (error) {
    return {
      success: false,
      lyrics: error.message,
    };
  }
};

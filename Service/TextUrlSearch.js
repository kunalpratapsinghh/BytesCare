const fs = require("fs");
const readline = require("readline");

module.exports.urlFinder = async (filePath) => {
    let numOccurrences
  try {
    const fileStream = fs.createReadStream(filePath);
    const readLineInterface = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let firstOccurrence = null;
    numOccurrences = 0;

    for await (const line of readLineInterface) {
      const urls = line.match(/http[s]?:\/\/[^\s]+/g);
      if (urls) {
        if (!firstOccurrence) {
          firstOccurrence = urls[0];
        }
        numOccurrences += urls.length;
      }
    }

    readLineInterface.close();

    if (numOccurrences > 0) {
      return {
        firstOccurrence,
        numOccurrences,
      };
    } else {
      return {
        firstOccurrence: "No URL occurrences found in the text file.",
        numOccurrences
      };
    }
  } catch (error) {
    return {
      firstOccurrence: error.message,
      numOccurrences
    };
  }
};

const functions = require('firebase-functions');
const fs = require('fs');
const path = require('path');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
const importFromDir = dirname => {
  fs.readdirSync(path.resolve(__dirname, dirname)).forEach(file => { // list files in the folder.
    if (file.endsWith('.js')) {
      const fileBaseName = file.slice(0, -3); // Remove the '.js' extension
      if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === fileBaseName) {
        exports[fileBaseName] = require(`./${dirname}/${fileBaseName}`);
      }
    }
  })
}

importFromDir(`express`)

importFromDir(`databaseTriggers`)

importFromDir(`httpRequests`)

importFromDir(`typeScript/lib`)

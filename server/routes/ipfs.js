// var promiseExec = require('promise-exec');
var express = require('express');
var router = express.Router();
var request = require('request');
// 
// console.log("in promise exec");
// var exec = require('promise-exec');
//
// exec('ls -al')
//   .then(function(result) {
//     console.log(result);
//   })
//   .catch(function(err) {
//     console.error(err);
//   });

// promiseExec("test").then((output) => {
//     return new Promise((resolve, reject) => {
//       console.log("in promise exec");
//       // tmpFilePath = output.replace("\n", "")
//       // let manifestContents = fs.readFileSync("config/prod/container_manifest.yaml").toString()
//       // manifestContents.replace("%%GCLOUD_PROJECT_ID%%", process.env.BACKEND_GCLOUD_PROJECT)
//       // fs.writeFileSync(tmpFilePath, manifestContents)
//       resolve()
//     })
//   }).then(() => {
//     // return promiseExecEach([
//     //
//     // ])
//   })

// promiseExec("test").then(function(err, res){
//   console.log("worked in the promsie")
// })
module.exports = router;

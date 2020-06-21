const gitlog = require("gitlog").default;

const options = {
  repo: __dirname,
  number: 20,
//   author: "Changyun Lee",
  fields: ["authorEmail", "abbrevHash", "subject", "authorName", "authorDate"],
  execOptions: { maxBuffer: 1000 * 1024 },
};

const commits = gitlog(options);

var fs = require('fs');
fs.writeFile("src/test.json", JSON.stringify(commits), function(err) {
    if (err) {
        console.log(err);
    }
});

// export default function GitLog() {
//     // Synchronous
//     return (
//         <Container>
//             {commits}
//         </Container>
//         );
// }

// Asynchronous (with Callback)
// gitlog(options, function (error, commits) {
  // Commits is an array of commits in the repo
//   console.log(commits);
// });

// const { gitlogPromise } = require("gitlog");

// Asynchronous (with Promise)
// gitlogPromise(options)
//   .then((commits) => console.log(commits))
//   .catch((err) => console.log(err));
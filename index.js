var inquirer = require("inquirer");
const axios = require("axios");

//Added this part, because I need a proxy in one of my development enviroments
//global var to be used across any function
var axiosCall;
if (process.argv[2] === "-proxy") {
  axiosCall = function axiosFunc(url) {
    return axios.get(url, {
      proxy: {
          host: '127.0.0.1',
          port: 12346
      }
  });
  }
}
else {
  axiosCall = function axiosFunc(url) {
    return axios.get(url);
  }
}

getMovie();
async function getMovie() {
  try {
    const { movie } = await inquirer.prompt({
      message: "Search a movie:",
      name: "movie"
    });

    const { data } = await axios.get(
      `https://www.omdbapi.com/?t=${movie}&apikey=trilogy`
    );

    console.log(data);
  
  } catch (err) {
    console.log(err);
  }
}

// function asyncFunc() {
//   const response = await promptUser();
//   console.log(response);
//   return response;
// }

// asyncFunc();
// promptUser()
//   .then(function(response){
//     console.log(`username ${response.username} and location ${response.location}!`);
//     return response;
//   })
//   .then(function({ username }){
//     console.log(username);
//     //return axiosCall("http://markstout.com")
//     let res =  await axiosCall(`https://api.github.com/users/${username}/repos?per_page=100`);
//     console.log(`in a then`);
//     return res;
//     //parseGithub(username);
//   })
//   .then(function(res) {
//     console.log("res");
//   });

// console.log("here");

// function parseGithub(res){
//   console.log(res);
// }

function parseGithub(username) {
  return new Promise(function(resolve, reject) {
    let axiosReturn = axiosCall(`https://api.github.com/users/${username}/repos?per_page=100`) 
      // if (err) {
      //   return reject(err);
      // }
      console.location(axiosReturn);
      resolve(axiosReturn);
    });
}

///////////////////////////////////////////////////////////////////
//prompt user for input and return username location
function promptUser() {
  return inquirer.prompt([
    {
      type: "input",
      name: "username",
      message: "What is your github username?"
    },
    {
      type: "input",
      name: "location",
      message: "What city do you live in?"
    }
  ]);
}


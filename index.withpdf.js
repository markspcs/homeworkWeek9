const inquirer = require("inquirer");
const axios = require("axios");
const pdf = require('html-pdf');
const fs = require('fs');
const html = fs.readFileSync('./test.html', 'utf8');
// const option = { format: 'A4', orientation: 'portrait', viewportSize: {
//   width: 1200,
//   height: 600
// },
// };

const option = { height: "10in", 
  width: "10in",
  margin: '1cm',
  viewportSize: { width: 400, height: 400 }
};

pdf.create(html, option).toFile('./test.pdf', function(err, res){
  if (err) return console.log(err);
  console.log(res);
});

var githubInfo = {};
var gitUsername;
var numRepos;
var numFollowing;
var numFollowers;
var githubName, githubAvatar, githubLocation, githubBio, githubBlog, githubCompany;

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


asyncFunc();
console.log("here")
////////////////////////////////////////////////
//ALL ASYNC CONTENT HERE
async function asyncFunc() {
  const response = await promptUser();
  console.log(response);
  gitUsername = response.username;
  let resUserInfo = await axiosCall(`https://api.github.com/users/${response.username}`);
  let resRepos = await axiosCall(`https://api.github.com/users/${response.username}/repos?per_page=100`);
  let resFollowers = await axiosCall(`https://api.github.com/users/${response.username}/followers`);
  let resFollowing = await axiosCall(`https://api.github.com/users/${response.username}/following`);
  console.log(resUserInfo.data);
  githubInfo = {
    numRepos: resUserInfo.data.public_repos,
    numStars: resUserInfo.data.public_gists,
    numFollowers: resUserInfo.data.followers,
    numFollowing: resUserInfo.data.following,
    githubName: resUserInfo.data.name,
    githubAvatar: resUserInfo.data.avatar_url,
    githubLocation: resUserInfo.data.location,
    githubBio: resUserInfo.data.bio,
    githubBlog: resUserInfo.data.blog,
    githubCompany: resUserInfo.data.company
  }
  console.log(githubInfo);


  //console.log(`user ${gitUsername} git ${numRepos} follower ${numFollowers} following ${numFollowing} ${githubAvatar}`);
  console.log(createHTML());

}
function printThis() {
  console.log(githubAvatar);
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
      name: "color",
      message: "What is your favorite color?"
    }
  ]);
}


//////////////////////////////////////////////////////
function createHTML() {
  return `
  <!DOCTYPE html>
  <html lang="en-us">
  
  <head>
      <meta charset="UTF-8">
      <title>profolio</title>
      <!-- <link rel="stylesheet" type="text/css" href="./assets/css/reset.css"> -->
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
          integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
      <link rel="stylesheet" href="./style.css">
  </head>
  
  <body>
          <div class="card w-75 text-center bubble">
              <div class="card-body">
                <h5 class="card-title">Hi!</h5>
                <p class="card-text">My name is ${githubInfo.githubName}.</p>
                <p> Currently @ ${githubInfo.githubCompany} </p>
                <a href="https://www.google.com/maps/place/${githubInfo.githubLocation}">${githubInfo.githubLocation}</a>
              </div>
          </div>
          <div class="bodyCont w-50">
              <h3 class="black">${githubInfo.githubBio}</h3>
              <div class="card text-center dynCont">
              <div class="card-body">
                <h5 class="card-title">Public Repositories</h5>
                <p class="card-text">${githubInfo.numRepos}.</p>
              </div>
          </div>
          <div class="card text-center dynCont right">
              <div class="card-body">
                <h5 class="card-title">Followers</h5>
                <p class="card-text">${githubInfo.numFollowers}</p>
              </div>
          </div>
  
      </p>
          <div class="card w-25 text-center dynCont">
              <div class="card-body">
                <h5 class="card-title">GitHub Stars</h5>
                <p class="card-text">5</p>
              </div>
          </div>
          <div class="card w-25 text-center dynCont right">
              <div class="card-body">
                <h5 class="card-title">Following</h5>
                <p class="card-text">${githubInfo.numFollowing}</p>
              </div>
          </div>
      </div>
  </body>
  
  </html>`;
}

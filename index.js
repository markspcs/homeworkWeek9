const inquirer = require("inquirer");
const axios = require("axios");
const pdf = require('html-pdf');
//const fs = require('fs');
//Turn console logs on or off
const debug = 0;



var githubInfo = {};
var gitUsername;

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
////////////////////////////////////////////////
//ALL ASYNC CONTENT HERE
async function asyncFunc() {
  const response = await promptUser();
  debug && console.log(`prompt response object : ${response}`);
  gitUsername = response.username;
  let resUserInfo = await axiosCall(`https://api.github.com/users/${response.username}`);
  debug && console.log(resUserInfo.data);
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
    githubCompany: resUserInfo.data.company,
    githubWeb: `https://github.com/${gitUsername}`,
    favColor: response.color
  }
  const option = {
    height: "10in",
    width: "10in",
    margin: '1cm',
    viewportSize: { width: 400, height: 400 }
  };
  var page = createHTML();
  pdf.create(page, option).toFile("./portfolio.pdf", function (err, res) {
    if (err) return console.log(err);
    debug && console.log(`response ${res}` );
  });
  debug && console.log(`githubInfo ${githubInfo}`);


  debug && console.log(createHTML());

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
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
      integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"
      integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous" />
    <style>
      html {
      height: 100%;
  }
  body {
      background-color: #879cdf;
      background: linear-gradient(
          #879cdf ,
          #879cdf 33%,
          #dfedee 33%,
          #dfedee 66%,
          #879cdf 66%,
          #879cdf 0px
         
          );
      min-height: 100%;
      height: 100%;
      width: 100%;
      color: white;
      font-family: Georgia, serif;
      font-weight: 800;
      font-size: 22px;
  }
  .topCard{
      overflow: hidden;
      background-color: ${githubInfo.favColor};
      padding-top: 100px;
  }
  .bold{
    font-weight: bold;
  }
  img.avatar{
      position: absolute;
      left: 390px;
      top: 1px;
      transform: translate(-50%, -50%);
      display: inline;
      background-color: yellow;
      width: 200px;
      height: 200px;
  
      border-radius: 50%;
      border: 3px solid yellow;
  }
  a {
      color: white;
  }
  .black{
      color: black;
      text-align: center;
  }
  .bubble {
      margin: 100px auto;
      margin-bottom: 40px;
      overflow: auto;
      background-color: transparent;
  }
  .bodyCont{
      margin: 0 auto;
      align-content: center;
  }
  .dynCont{
      width: 40%;
      background-color: ${githubInfo.favColor};
      display: inline-block;
      margin: 10px auto;
      overflow: auto;
  }
  .right{
      float:right;
  }
  .clickInfo {
    font-size: 12px;
    margin-left: 8px;
  }
    </style>
  </head>
  
  <body>
  
    <div class="card w-75 text-center bubble">
  
      <div class="card-body topCard">
  
  
  
        <h3 class="card-title">Hi!</h3>
        <p class="card-text">My name is ${githubInfo.githubName}!</p>
        <p><h5> Currently @ ${githubInfo.githubCompany} </h5></p>
        <a class="clickInfo" href="https://www.google.com/maps/place/${githubInfo.githubLocation}"><i class="fas fa-location-arrow"></i> ${githubInfo.githubLocation}   </a>
        <a class="clickInfo" href="${githubInfo.githubWeb}><i class="fab fa-github"></i> GitHub   </a>
        <a class="clickInfo" href="${githubInfo.githubBlog}"><i class="fas fa-rss"></i> Blog</a>
      </div>
    </div>
  
    <img class="avatar" src="${githubInfo.githubAvatar}" />
  
    <div class="bodyCont w-50">
      <h3 class="black">${githubInfo.githubBio}</h3>
      <div class="card text-center dynCont">
        <div class="card-body">
          <h5 class="card-title">Public Repositories</h5>
          <p class="card-text">${githubInfo.numRepos}</p>
        </div>
      </div>
      <div class="card text-center dynCont right">
        <div class="card-body">
          <h5 class="card-title"><br>Followers</h5>
          <p class="card-text">${githubInfo.numFollowers}</p>
        </div>
      </div>
  
      </p>
      <div class="card text-center dynCont">
        <div class="card-body">
          <h5 class="card-title">GitHub Stars</h5>
          <p class="card-text">${githubInfo.numStars}</p>
        </div>
      </div>
      <div class="card text-center dynCont right">
        <div class="card-body">
          <h5 class="card-title">Following</h5>
          <p class="card-text">${githubInfo.numFollowing}</p>
        </div>
      </div>
    </div>
  </body>
  
  </html>

`;
}
//   <body>
//           <div class="card w-75 text-center bubble">
//               <div class="card-body">
//                 <h5 class="card-title">Hi!</h5>
//                 <p class="card-text">My name is ${githubInfo.githubName}.</p>
//                 <p> Currently @ ${githubInfo.githubCompany} </p>
//                 <a href="https://www.google.com/maps/place/${githubInfo.githubLocation}">${githubInfo.githubLocation}</a>
//               </div>
//           </div>
//           <div class="bodyCont w-50">
//               <h3 class="black">${githubInfo.githubBio}</h3>
//               <div class="card text-center dynCont">
//               <div class="card-body">
//                 <h5 class="card-title">Public Repositories</h5>
//                 <p class="card-text">${githubInfo.numRepos}.</p>
//               </div>
//           </div>
//           <div class="card text-center dynCont right">
//               <div class="card-body">
//                 <h5 class="card-title">Followers</h5>
//                 <p class="card-text">${githubInfo.numFollowers}</p>
//               </div>
//           </div>

//       </p>
//           <div class="card w-25 text-center dynCont">
//               <div class="card-body">
//                 <h5 class="card-title">GitHub Stars</h5>
//                 <p class="card-text">5</p>
//               </div>
//           </div>
//           <div class="card w-25 text-center dynCont right">
//               <div class="card-body">
//                 <h5 class="card-title">Following</h5>
//                 <p class="card-text">${numFollowing}</p>
//               </div>
//           </div>
//       </div>
//   </body>

//   </html>`;
// }

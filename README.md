# Portfolio PDF
While the content is hosted it will not render exactly in a web browser as it does in a PDF. Only execute with node.js

## Description

This Node.js application uses the username provided during execution to query github.com, and gets varouis information. That is saved, and formatted into a PDF

![screen shot](./example.png)
## Usage
execute by typing:
    node index.js

    at the prompt enter the github.com username.
    then at the next prompt enter your favorite color, which will be used to color the background
    containers showing the users information. If you use WHITE, you may not be able to see the user information.
## Installation

Requires Inquirer, Axios, and html-pdf

## Issues
If you execute this script consecutively  or other scripts that queries the github API, 
YOU WILL NOT get a file created because github rate limits the amount of traffic.

## Credits

This program includes bootstrap from http://getbootstrap.com 
Also fontawsome from https://www.fontawesome.com



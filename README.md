[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-f059dc9a6f8d3a56e377f745f24479a46679e63a5d9fe6f495e02850cd0d8118.svg)](https://classroom.github.com/online_ide?assignment_repo_id=6605325&assignment_repo_type=AssignmentRepo)
# ex4-nodejs
<h1>marsearch</h1>
<p>
This project is both the client side and server side of a website for searching pictures of Mars from NASA's API.
The website requires you to register a new user and log in, providing email, password and full name.
Once you log in you are presented with 'MarSearch' webpage.
This webpage allows you to search for pictures of Mars.
You may enter a Sol number (solar day on Mars) or a date, 
the rover (Curiosity, Opportunity or spirit) from which you want to see pictures from,
and the camera of that rover.
<br>
Once you search, all the pictures that fits your search will be displayed on the page.
You can enter a full size mode for each picture, and save them to a list of favourites.
The list will be saved between logs in a server database, so once you log in back again 
you are presented with it
<br>
<br>
Please note that each rover has different cameras:
<br>
    Curiosity: FHAZ, RHAZ, MAST, CHEMCAM, MAHLI, MARDI, NAVCAM
<br>
    Opportunity: FHAZ, RHAZ, NAVCAM, PANCAM, MINITES
<br>
    Spirit: FHAZ, RHAZ, NAVCAM, PANCAM, MINITES

</p>

<h1>Shaked Stossel</h1>
<p>Email: shakedst@edu.hac.ac.il</p>

<h1>Initialization</h1>
<p>
Open console, execute : npm install
</p>
<h1>Execution</h1>
<p>Use the configuration in Webstorm (top right 'play' button) or: open terminal,
and execute : node bin/www
</p>
<p>
Then open your browser at http://localhost:3000
</p>
<h1>Assumptions</h1>
<p>
  The site use bootstrap CDN and communication with NASA's API, therefore assumes an internet connection is available.
</p>

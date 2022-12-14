"# ScamOverflow!"

MongoDB is necessary to run this project!

#Installation:

Download this project and create a file inside the **/backend** folder.
Inside this file, the credentials for the following syntax must be written.

```
BASE_URL = <URL of the database>
SECRET_KEY = <hash key that for password encryption>
```

Where **<URL of the database>** is the URL of the MongoDB database (if running in localhost this field is equal to: **mongodb://localhost:27017**) and **SECRET_KEY** is any string that will be used as a base to hash the password. It must NOT be shared by any means. This last field could for example be equal to **secretkey**.

Inside the **/backend** folder create a console and run **npm install** to install all packages. Do the same process inside the **/frontend** folder.

#Running the Project

To run the project, go inside the **/backend** folder and run the command: **npm run dev**. This will start the server and connect to the database.

To run the frontend, go inside the **/frontend** folder and run the command: **npm start**. A new tab in the predetermined browser will open with the project running.

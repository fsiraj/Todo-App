# Todo-App
 A simple Todo app built with React, Tornado, and MySQL.

 ## To run:

 ### Database
 The datbase schema is specified in `sql/mindump.sql`. From within `mysql`, run `source sql/mindump.sql`. 
 To start off with dummy data, you can also run `source sql/data.sql`.

 ### Backend
 To install requirements: `pip3 install -r server/requirements.txt`
 To run the tornado server: `python3 server/main.py`.

### Frontend
Be sure to be in the app directory: `cd app`.
To install dependencies: `npm install`.
To build the react app: `npm run build`.
To serve the app, start the server with: `serve -s build`.
//Import database
require("./database");


//Import express
const express = require("express");
const app = express();
const http = require("http");

const server = http.createServer(app);

//Import morgan
const morgan = require("morgan");

//Import CORS
const cors = require("cors");

//Apply JSON reading, CORS policy and morgan
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000"}));
app.use(morgan("tiny"));

//Apply routes
app.use("/api", require("./routes/routes"));

server.listen(8080, () => {
  console.log('listening on *:8080');
});
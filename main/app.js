const mysql = require('mysql');

// Setup MySQL-server connection
const connection = mysql.createConnection({
  host     : 'mysql.stud.iie.ntnu.no',
  user     : 'g_oops_10',  // Replace [username] with your username
  password : 'qtjxbwXr',     // Replace [password] with your password
  database : 'g_oops_10'   // Replace [username] with your username
});

// Connect to MySQL-server
connection.connect(function(error) {
  if(error) throw error; // If error, show error in console and return from this function
});

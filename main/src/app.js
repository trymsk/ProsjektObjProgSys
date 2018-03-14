const mysql = require('mysql');

// Setup MySQL-server connection
const connection = mysql.createConnection({
  host     : 'mysql.stud.iie.ntnu.no',
  user     : 'g_oops_10',  // Replace [username] with your username
  password : 'qtjxbwXr',     // Replace [password] with your password
  database : 'g_oops_10'   // Replace [username] with your username
});

// Kobling til MySQL-server
connection.connect(function(error) {
  if(error) throw error; // If error, show error in console and return from this function
});

var uName = document.getElementById('uName');
var password = document.getElementById('password');

// Funksjon for å logge inn
function logIn(){
  if(uName === "Trym" && password === "123"){
  mainWindow.loadURL('fille://' + __dirname + '/app.html')
} else {
  window.alert("Feil brukernavn eller passord");
}
};

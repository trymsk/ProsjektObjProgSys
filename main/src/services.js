import * as mysql from 'mysql';

// MySQL kobling
let connection;
function connect() {
  connection = mysql.createConnection({
    host: 'mysql.stud.iie.ntnu.no',
    user: 'g_oops_10',
    password: 'qtjxbwXr',
    database: 'g_oops_10'
  });


  // Connect to MySQL-server
  connection.connect((error) => {
    if (error) throw error; // If error, show error in console and return from this function
  });

  // Add connection error handler
  connection.on('error', (error: Error) => {
    if (error.code === 'PROTOCOL_CONNECTION_LOST') { // Reconnect if connection to server is lost
      connect();
    }
    else {
      throw error;
    }
  });
}
connect();


class User {
  B_Medlemsnummer: number;
  B_Epost: string;
  B_Fornavn: string;
  B_Passord: string;
}

class UserService {
signIn(B_Epost:string, B_Passord:string): Promise<void> {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM Users WHERE B_Epost = ? AND B_Passord = ?', [B_Epost, B_Passord], (error, result)=>{
      if(error) {
        reject(error);
        return;
      }
      if(result.length!=1) {
          reject(new Error('Result length was not 1'))
          return;
        }
      localStorage.setItem('signedInUser', JSON.stringify(result[0]));
    });
  });
}

signOut() {
   localStorage.removeItem('signedInUser'); // Delete User-object from browser
 }
};

getUser(B_Medlemsnummer: number): Promise<User> {
   return new Promise((resolve, reject) => {
     connection.query('SELECT * FROM Users where B_Medlemsnummer=?', [B_Medlemsnummmer], (error, result) => {
       if(error) {
         reject(error);
         return;
       }
       if(result.length!=1) {
         reject(new Error('Result length was not 1'))
         return;
       }

       resolve(result[0]);
     });
   });
 }

let userService = new UserService();

export{User, userService};

// @flow
import * as mysql from 'mysql';

// Setup database server reconnection when server timeouts connection:
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
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  telephone: string;
  streetAdress: string;
  postalCode: string;
  place: string;


}

class UserService {
  signIn(username: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM Bruker where B_Epost=? AND B_Passord=?', [username, password], (error, result) => {
        if(error) {
          reject(error);
          return;
        }
        if(result.length!=1) {
          reject(new Error('Result length was not 1'))
          return;
        }

        localStorage.setItem('signedInUser', JSON.stringify(result[0]));
        resolve();
      });
    });
  }

  signUp(username: string, firstName: string, lastName: string, password: string, telephone: string, streetAdress: string, postalCode: string, place: string): Promise<void> {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO Bruker (B_Epost, B_Fornavn, B_Etternavn, B_Passord, B_Telefon, B_Adresse, B_Postnr, B_Poststed) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [username, firstName, lastName, password, telephone, streetAdress, postalCode, place], (error, result) => {
        if(error) {
          reject(error);
          return;
        }
        if(typeof(result.insertId) != 'number') {
          reject(new Error('Could not read insertId'))
          return;
        }

        let user = new User();
        user.id = result.insertId;
        user.username = username;
        user.firstName = firstName;
        user.lastName = lastName;
        user.password = password;
        user.telephone = telephone;
        user.streetAdress = streetAdress;
        user.postalCode = postalCode;
        user.place = place;
        localStorage.setItem('signedInUser', JSON.stringify(user)); // Store User-object in browser
        resolve();
      });
    });
  }

  getSignedInUser(): ?User {
    let item: ?string = localStorage.getItem('signedInUser'); // Get User-object from browser
    if(!item) return null;

    return JSON.parse(item);
  }

  signOut() {
    localStorage.removeItem('signedInUser'); // Delete User-object from browser
  }

  getUser(id: number): Promise<User> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM Bruker where B_Medlemsnummer=?', [id], (error, result) => {
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

}

class Event {
  id: number;
  title: string;
  type: string;
  place: string;
  placeAdress: string;
  date: string;
  time: string;
  contact: string;
  info: string;

  }

  class EventService{}


let userService = new UserService();
let eventService = new EventService();
export { User, userService };

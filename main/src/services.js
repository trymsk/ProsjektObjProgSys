// @flow
import * as mysql from 'mysql';

// Setup database server reconnection when server timeouts connection:
let connection;
function connect() {
  connection = mysql.createConnection({
    host: 'mysql.stud.iie.ntnu.no',
    user: 'g_oops_10',
    password: 'qtjxbwXr',
    database: 'g_oops_10',
    multipleStatements: true
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
  uId: number;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  telephone: string;
  uAdress: string;
  postalCode: string;
  uPlace: string;
  ambulance: boolean;
  dLicense160: boolean;
  dLicenseBE: boolean;
  hkp: boolean;
  srw: boolean;
  sr: boolean;
  srs:boolean;
  advFH:boolean;
  boat: boolean;
  vhf:boolean;
  vseaR:boolean;
  seaR: boolean;
  vlk: boolean;
  smDriver: boolean;
  smCourse: boolean;
  atv: boolean;
  dSensor: boolean;


}

class UserService {
  signIn(username: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM User where username=? AND password=?', [username, password], (error, result) => {
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

  signUp(username: string, firstName: string, lastName: string, password: string, telephone: string, uAdress: string, postalCode: string, uPlace: string, ambulance: boolean, dLicense160: boolean, dLicenseBE: boolean, hkp: boolean, srw: boolean, sr: boolean, srs:boolean,
    advFH:boolean, boat: boolean, vhf:boolean, vseaR:boolean, seaR: boolean, vlk: boolean, smDriver: boolean, smCourse: boolean, atv: boolean, dSensor: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO User (username, firstName, lastName, password, telephone, uAdress, postalCode, uPlace) VALUES (?, ?, ?, ?, ?, ?, ?, ?); INSERT INTO Qualifications (ambulance, dLicense160, dLicenseBE, hkp, srw, sr, srs, advFH, boat, vhf, vseaR, seaR, vlk, smDriver, smCourse, atv, dSensor) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [username, firstName, lastName, password, telephone, uAdress, postalCode, uPlace, ambulance, dLicense160, dLicenseBE, hkp, srw, sr, srs, advFH, boat, vhf, vseaR, seaR, vlk, smDriver, smCourse, atv, dSensor], (error, result) => {
        if(error) {
          reject(error);
          return;
        }
        if(typeof(result[0].insertId) != 'number') {
          reject(new Error('Could not read insertId'))
          return;
        }

        let user = new User();
        user.uId = result[0].insertId;
        user.username = username;
        user.firstName = firstName;
        user.lastName = lastName;
        user.password = password;
        user.telephone = telephone;
        user.uAdress = uAdress;
        user.postalCode = postalCode;
        user.uPlace = uPlace;
        user.ambulance = ambulance;
        user.dLicense160 = dLicense160;
        user.dLicenseBE = dLicenseBE;
        user.hkp = hkp;
        user.srw = srw;
        user.sr = sr;
        user.srs = srs;
        user.advFH = advFH;
        user.boat = boat;
        user.vhf = vhf;
        user.vseaR = vseaR;
        user.seaR = seaR;
        user.vlk = vlk;
        user.smCourse = smCourse;
        user.smDriver = smDriver;
        user.atv = atv;
        user.dSensor = dSensor;


        localStorage.setItem('signedInUser', JSON.stringify(user));
        resolve();
      });
    });
  }

  getSignedInUser(): ?User {
    let item: ?string = localStorage.getItem('signedInUser');
    if(!item) return null;

    return JSON.parse(item);
  }

  signOut() {
    localStorage.removeItem('signedInUser');
  }

  getUser(id: number): Promise<User> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM User where uId=?', [id], (error, result) => {
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
  eId: number;
  title: string;
  type: string;
  place: string;
  adress: string;
  date: string;
  time: string;
  contact: string;
  info: string;
};

  class EventService {
    addEvent(title:string, type:string, place:string, adress:string, date:string, time:string, contact:string, info:string):Promise<void>{
      return new Promise((resolve, reject) => {
        connection.query('INSERT INTO Event(title, type, ePlace, eAdress, date, time, contact, info) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [title, type, place, adress, date, time, contact, info], (error, result) =>{

          if(error) {
            reject(error);
            return;
          }
          if(typeof(result.insertId) != 'number') {
            reject(new Error('Could not read insertId'))
            return;
          }

          let event = new Event();
          event.eId = result.insertId;
          event.title = title;
          event.type = type;
          event.place= place;
          event.adress = adress;
          event.date = date;
          event.time = time;
          event.contact = contact;
          event.info = info;

          resolve();
        });
      });
    };

    getEvent(): Promise<Event[]> {
      return new Promise((resolve, reject) =>{
        connection.query('SELECT * FROM Event', [], (error, result) =>{
          if(error){
            reject(error);
            return;
          }

          resolve(result);
        })
      })
    }
  }


let userService = new UserService();
let eventService = new EventService();
export { User, userService, Event, eventService };

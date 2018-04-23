// @flow
import * as mysql from 'mysql';

// Databasekobling
let connection;
function connect() {
  connection = mysql.createConnection({
    host: 'mysql.stud.iie.ntnu.no',
    user: 'g_oops_10',
    password: 'qtjxbwXr',
    database: 'g_oops_10',
    multipleStatements: true
  });


  connection.connect((error) => {
    if (error) throw error;
  });


  connection.on('error', (error: Error) => {
    if (error.code === 'PROTOCOL_CONNECTION_LOST') {
      connect();
    }
    else {
      throw error;
    }
  });
}
connect();

//Brukerobjekt
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

//Objekt med metoder for å håndtere alt av brukerinfo
class UserService {
  //metode for å logge inn i systemet
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

//metode for å registrere en ny bruker i systemet
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

//metode for å få info om brukeren som er innlogget i systemet
  getSignedInUser(): ?User {
    let item: ?string = localStorage.getItem('signedInUser');
    if(!item) return null;

    return JSON.parse(item);
  }

//metode for å logge ut av systemet
  signOut() {
    localStorage.removeItem('signedInUser');
  }

//metode for å få informasjon om en bruker basert på id
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

//de følgende metodene er for å hente ut informasjon om brukere som er kvalifisert for de forskjellige rollene.

//Sanitet
  getMedic():Promise<User[]>{
    return new Promise((resolve, reject) => {
      connection.query('SELECT Qualifications.uId, firstName, lastName FROM Qualifications INNER JOIN User WHERE User.uId=Qualifications.uId AND hkp = 1',[],(error, result) => {
        if(error){
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }

  //Ambulansemedhjelper
  getAmbulanceHelp():Promise<User[]>{
    return new Promise((resolve, reject) => {
      connection.query('SELECT Qualifications.uId, firstName, lastName FROM Qualifications INNER JOIN User WHERE User.uId=Qualifications.uId AND hkp = 1 AND ambulance=1',[],(error, result) => {
        if(error){
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }

//Ambulansesjåfør
  getAmbulanceDriver():Promise<User[]>{
    return new Promise((resolve, reject) => {
      connection.query('SELECT Qualifications.uId, firstName, lastName FROM Qualifications INNER JOIN User WHERE User.uId=Qualifications.uId AND hkp = 1 AND ambulance=1 AND dLicense160=1',[],(error, result) => {
        if(error){
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }

//Ambulanse tredjemann
  getAmbulance3Man():Promise<User[]>{
    return new Promise((resolve, reject) => {
      connection.query('SELECT Qualifications.uId, firstName, lastName FROM Qualifications INNER JOIN User WHERE User.uId=Qualifications.uId AND hkp = 1 AND advFH=1',[],(error, result) => {
        if(error){
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }

//Båtfører
  getBSkipper():Promise<User[]>{
    return new Promise((resolve, reject) => {
      connection.query('SELECT Qualifications.uId, firstName, lastName FROM Qualifications INNER JOIN User WHERE User.uId=Qualifications.uId AND hkp = 1 AND boat=1 AND vhf=1 AND vseaR=1',[],(error, result) => {
        if(error){
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }

//Båtmedhjelper
  getBHelper():Promise<User[]>{
    return new Promise((resolve, reject) => {
      connection.query('SELECT Qualifications.uId, firstName, lastName FROM Qualifications INNER JOIN User WHERE User.uId=Qualifications.uId AND hkp = 1 AND ambulance=1 AND seaR=1',[],(error, result) => {
        if(error){
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }

//Båtmannskap
  getBCrew():Promise<User[]>{
    return new Promise((resolve, reject) => {
      connection.query('SELECT Qualifications.uId, firstName, lastName FROM Qualifications INNER JOIN User WHERE User.uId=Qualifications.uId AND hkp = 1 AND seaR=1',[],(error, result) => {
        if(error){
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }

//Vaktleder
  getLeader():Promise<User[]>{
    return new Promise((resolve, reject) => {
      connection.query('SELECT Qualifications.uId, firstName, lastName FROM Qualifications INNER JOIN User WHERE User.uId=Qualifications.uId AND hkp = 1 AND vlk=1',[],(error, result) => {
        if(error){
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }

//Snøscootermedhjelper
  getSMHelper():Promise<User[]>{
    return new Promise((resolve, reject) => {
      connection.query('SELECT Qualifications.uId, firstName, lastName FROM Qualifications INNER JOIN User WHERE User.uId=Qualifications.uId AND hkp = 1 AND ambulance=1 AND srw=1',[],(error, result) => {
        if(error){
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }

//Snøscooterfører
  getSMDriver():Promise<User[]>{
    return new Promise((resolve, reject) => {
      connection.query('SELECT Qualifications.uId, firstName, lastName FROM Qualifications INNER JOIN User WHERE User.uId=Qualifications.uId AND hkp = 1 AND srw=1 AND smCourse=1 AND smDriver=1 AND dLicenseBE=1',[],(error, result) => {
        if(error){
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }

//Snøscooter tredjemann
  getSM3Man():Promise<User[]>{
    return new Promise((resolve, reject) => {
      connection.query('SELECT Qualifications.uId, firstName, lastName FROM Qualifications INNER JOIN User WHERE User.uId=Qualifications.uId AND hkp = 1 AND advFH=1 AND sr=1',[],(error, result) => {
        if(error){
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }

//ATV-fører
  getATVDriver():Promise<User[]>{
    return new Promise((resolve, reject) => {
      connection.query('SELECT Qualifications.uId, firstName, lastName FROM Qualifications INNER JOIN User WHERE User.uId=Qualifications.uId AND hkp = 1 AND srs=1 AND atv=1 AND dLicenseBE=1',[],(error, result) => {
        if(error){
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }

//Distriktsensor
  getDSensor():Promise<User[]>{
    return new Promise((resolve, reject) => {
      connection.query('SELECT Qualifications.uId, firstName, lastName FROM Qualifications INNER JOIN User WHERE User.uId=Qualifications.uId AND hkp = 1 AND dSensor=1',[],(error, result) => {
        if(error){
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }

}

//Objekt for arrangemnet
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


//Objekt for behandling av arrangementinfo
  class EventService {
    //metode for å legge til arrangement
    addEvent(title:string, type:string, place:string, adress:string, date:string, time:string, contact:string, info:string):Promise<void>{
      return new Promise((resolve, reject) => {
        connection.query('INSERT INTO Event(title, type, place, adress, date, time, contact, info) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [title, type, place, adress, date, time, contact, info], (error, result) =>{

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

//Metode for å hente ut all info om alle arrangementene, ikke nødvendig med formatering av data her siden vi bare bruker tittelen og id-nummeret til arrangementet
    getEvents(): Promise<Event[]> {
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
    //Hente ut all informasjon om et arrangement basert på id med omformatering av dato- og tidsdata
    getEvent(id: number): Promise<Event> {
      return new Promise((resolve, reject) =>{
        connection.query('SELECT contact, adress, place, type, title, info, eId, DATE_FORMAT(date, "%W %m/%d/%Y") AS date, TIME_FORMAT(time, "%H:%i") AS time FROM Event where eId=?', [id], (error, result) =>{
          if(error){
            reject(error);
            return;
          }

          resolve(result[0]);
        })
      })
    }
  }

//Objekt for interesse av arrangement
  class Interest{
    eId:number;
    uId:number;
    date: string ='';
  }

//Objekt for håndtering av data i interesseobjektet
  class InterestService{

//Metode for å melde interesse for et arrangmenet.
    reportInterest(eId:number, uId:number): Promise<void> {
      return new Promise((resolve, reject) => {
        connection.query('INSERT INTO Interest (uId, eId) VALUES(?, ?)', [uId, eId], (error, result) => {
          if(error) {
            reject(error);
            return;
          }

          let interest = new Interest();

          interest.uId = uId;
          interest.eId = eId;

          resolve();
      });
    });
  }
}



let userService = new UserService();
let eventService = new EventService();
let interestService = new InterestService();
//eksportere objektene til app.js-filen
export { User, userService, Event, eventService, Interest, interestService };

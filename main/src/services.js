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
}

class UserService {
  signIn(username: string): Promise<void> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM Bruker where B_Epost=?', [username], (error, result) => {
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

  signUp(username: string, firstName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO Bruker (B_Epost, B_Fornavn) VALUES (?, ?)', [username, firstName], (error, result) => {
        if(error) {
          reject(error);
          return;
        }
        if(typeof(result.insertId) !== 'number') {
          reject(new Error('Could not read insertId'))
          return;
        }

        let user = new User();
        user.id = result.insertId;
        user.username = username;
        user.firstName = firstName;
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

  // getFriends(id: number): Promise<User[]> {
  //   return new Promise((resolve, reject) => {
  //     connection.query('SELECT * FROM Users where B_Medlemsnummer!=?', [B_Medlemsnummer], (error, result) => {
  //       if(error) {
  //         reject(error);
  //         return;
  //       }
  //
  //       resolve(result);
  //     });
  //   });
  // }
}

// class Post {
//   id: number;
//   text: string;
//   fromUserId: number;
//   fromUserFirstName: string;
//   toUserId: number;
//   toUserFirstName: string;
// }
//
// class PostService {
//   getPostsToUser(userId: number): Promise<Post[]> {
//     return new Promise((resolve, reject) => {
//       connection.query('SELECT Posts.id AS id, text, fromUserId, FromUsers.firstName AS fromUserFirstName, toUserId, ToUsers.firstName AS toUserFirstName FROM Posts, Users AS FromUsers, Users AS ToUsers WHERE fromUserId = FromUsers.id AND toUserId = ToUsers.id AND ToUsers.id = ? ORDER BY Posts.id DESC', [userId], (error, result) => {
//         if(error) {
//           reject(error);
//           return;
//         }
//
//         resolve(result);
//       });
//     });
//   }
//
//   getPostsNotFromUser(userId: number): Promise<Post[]> {
//     return new Promise((resolve, reject) => {
//       connection.query('SELECT Posts.id AS id, text, fromUserId, toUserId, FromUsers.firstName AS fromUserFirstName, ToUsers.firstName AS toUserFirstName FROM Posts, Users AS FromUsers, Users AS ToUsers WHERE fromUserId = FromUsers.id AND toUserId = ToUsers.id AND FromUsers.id != ? ORDER BY Posts.id DESC', [userId], (error, result) => {
//         if(error) {
//           reject(error);
//           return;
//         }
//
//         resolve(result);
//       });
//     });
//   }
//
//   addPost(fromUserId: number, toUserId: number, text: string): Promise<void> {
//     return new Promise((resolve, reject) => {
//       connection.query('INSERT INTO Posts (text, fromUserId, toUserId) values (?, ?, ?)', [text, fromUserId, toUserId], (error, result) => {
//         if(error) {
//           reject(error);
//           return;
//         }
//         if(typeof(result.insertId) !== 'number') {
//           reject(new Error('Could not read insertId'))
//           return;
//         }
//
//         resolve();
//       });
//     });
//   }
// }

let userService = new UserService();
// let postService = new PostService();

export { User, userService };

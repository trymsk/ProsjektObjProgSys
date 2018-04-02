// @flow
import * as React from 'react';
import ReactDOM from 'react-dom';
import { Link, NavLink, HashRouter, Switch, Route } from 'react-router-dom';
import createHashHistory from 'history/createHashHistory';
const history = createHashHistory();
import {User, userService} from './services';

class ErrorMessage extends React.Component<{}> {
  refs: {
    closeButton: HTMLButtonElement
  };

  message = '';

  render() {
    // Only show when this.message is not empty
    let displayValue;
    if(this.message=='') displayValue = 'none';
    else displayValue = 'inline';

    return (
      <div style={{display: displayValue}}>
        <b><font color='red'>{this.message}</font></b>
        <button ref='closeButton'>x</button>
      </div>
    );
  }

  componentDidMount() {
    errorMessage = this;
    this.refs.closeButton.onclick = () => {
      this.message = '';
      this.forceUpdate();
    };
  }

  componentWillUnmount() {
    errorMessage = null;
  }

  set(post: string) {
    this.message = post;
    this.forceUpdate();
  }
}
let errorMessage: ?ErrorMessage;

class Menu extends React.Component<{}> {
  render() {
    let signedInUser = userService.getSignedInUser();
    if(signedInUser) {
      return (
        <div>
          <NavLink activeStyle={{color: 'green'}} exact to='/'>Home</NavLink>{' '}
          <NavLink activeStyle={{color: 'green'}} to={'/user/' + signedInUser.id}>{signedInUser.fullName}</NavLink>{' '}
          <NavLink activeStyle={{color: 'green'}} to='/signout'>Sign Out</NavLink>{' '}
        </div>
      );
    }
    return (
      <div>
        <NavLink activeStyle={{color: 'green'}} to='/signin'>Sign In</NavLink>{' '}
        <NavLink activeStyle={{color: 'green'}} to='/signup'>Sign Up</NavLink>
      </div>
    );
  }

  componentDidMount() {
    menu = this;
  }

  componentWillUnmount() {
    menu = null;
  }
}
let menu: ?Menu;

class SignIn extends React.Component<{}> {
  refs: {
    signInUsername: HTMLInputElement,
    signInButton: HTMLButtonElement
  }

  render() {
    return (
      <div class="LogInBox">
          <div class="icon-bar">
              <a href="#" id="admin"><i class="fab fa-angular"></i></a>
          </div>
        <div class="imgcontainer">
          <img src="Bilder\red_cross_logo.png" alt="Logo" class="Logo"></img>
        </div>
        <div class="container">
          <input type="text" placeholder="E-post" id="uname" ref ='signInUsername'/>
          <input type="password" placeholder="Passord" id="psw"/>
          <button ref='signInButton'>Login</button>
        <button onclick="document.getElementById('id01').style.display='block'" id="regBtn">Registrer ny bruker</button>
        </div>
      </div>
    );
  }

  componentDidMount() {
    if(menu) menu.forceUpdate();

    this.refs.signInButton.onclick = () => {
      userService.signIn(this.refs.signInUsername.value).then(() => {
        history.push('/');
      }).catch((error: Error) => {
        if(errorMessage) errorMessage.set("Incorrect username");
      });
    };
  }
}

class SignUp extends React.Component<{}> {
  refs: {
    signUpUsername: HTMLInputElement,
    signUpFirstName: HTMLInputElement,
    signUpButton: HTMLButtonElement
  }

  render() {
    return (
      <div id='id01'>
      <div class="modal-content">
        <div class="container">
          <h1>Registrer ny bruker</h1>
          <p>Fyll ut dette skjemaet for å registrere deg</p>
          <hr></hr>
          <label for="email">Epost (brukernavn)</label>
          <input type="text" placeholder="eksempel@gmail.com" name="email" ref='signUpUsername'required></input>

          <label for="psw">Passord</label>
          <input type="password" placeholder="••••••••" name="psw" required></input>

          <label for="psw-repeat">Gjenta passord</label>
          <input type="password" placeholder="••••••••" name="psw-repeat" required></input>

          <label for="full-name">Fullt navn</label>
          <input type="text" placeholder="Ola Normann" name="full-name" required></input>

          <label for="tlf-number">Telefon</label>
          <input type="number" placeholder="+4792233311" name ="tlf-number" required></input>

          <label for="adr-fylke">Fylke</label>
          <input type="text" placeholder="Trøndelag" name ="adr-fylke" required></input>

          <label for="adr-postnummer">Postnummer</label>
          <input type="number" placeholder="7030" name="adr-postnummer" required></input>

          <label for="adr-poststed">Poststed</label>
          <input type="text" placeholder="Trondheim" name="adr-poststed" required></input>

          <label for="adr-gate">Gateadresse</label>
          <input type="text" placeholder="Gateadresse" name="adr-gate" required></input>
          <div class="clearfix">
            <button type="button" onclick="document.getElementById('id01').style.display='none'" class="cancelbtn">Avbryt</button>
            <button type="submit" class="signup" ref='signUpButton'>Registrer</button>
          </div>

        </div>
      </div>
      </div>
    );
  }

  componentDidMount() {
    this.refs.signUpButton.onclick = () => {
      userService.signUp(this.refs.signUpUsername.value, this.refs.signUpFirstName.value).then(() => {
        history.push('/');
      }).catch((error: Error) => {
        if(errorMessage) errorMessage.set("Could not create account");
      });
    };
  }
}

class SignOut extends React.Component<{}> {
  render() {
    return (<div />);
  }

  componentDidMount() {
    userService.signOut();
    history.push('/signin');
  }
}

class Home extends React.Component<{}> {

  render() {

    return (
      <div>
        Posts from friends:
      </div>
    );
  }

  componentDidMount() {
    let signedInUser = userService.getSignedInUser();
    if(!signedInUser) {
      history.push('/signin');
      return;
    }

    if(menu) menu.forceUpdate();

  }
}


class UserDetails extends React.Component<{ match: { params: { id: number } } }> {
  refs: {
    newPost: HTMLInputElement,
    newPostButton: HTMLButtonElement
  }

  user = new User();

  render() {

  }

  update() {
  }

  componentDidMount() {
    this.update();

  }

  // Called when the this.props-object change while the component is mounted
  // For instance, when navigating from path /user/1 to /user/2
  componentWillReceiveProps() {
    setTimeout(() => { this.update(); }, 0); // Enqueue this.update() after props has changed
  }
}

let root = document.getElementById('root');
if(root) {
  ReactDOM.render((
    <HashRouter>
      <div>
        <ErrorMessage />
        <Menu />
        <Switch>
          <Route exact path='/signin' component={SignIn} />
          <Route exact path='/signup' component={SignUp} />
          <Route exact path='/signout' component={SignOut} />
          <Route exact path='/' component={Home} />
          <Route exact path='/user/:id' component={UserDetails} />
        </Switch>
      </div>
    </HashRouter>
  ), root);
}

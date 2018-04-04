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
      <div id="errorDiv" style={{display: displayValue}}>
        <b><font id="errorMsg" color='black'>{this.message}</font></b>
        <button id='closeBtn' ref='closeButton'>Lukk</button>
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
          <NavLink activeStyle={{color: 'green'}} to={'/user/' + signedInUser.id}>{signedInUser.firstName}</NavLink>{' '}
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
    signInButton: HTMLButtonElement,
    signInPassword: HTMLInputElement
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
          <input type="password" placeholder="Passord" id="psw" ref ='signInPassword'/>
          <button ref='signInButton'>Login</button>
        <button onclick="document.getElementById('id01').style.display='block'" id="regBtn">Registrer ny bruker</button>
        </div>
      </div>
    );
  }

  componentDidMount() {
    if(menu) menu.forceUpdate();

    this.refs.signInButton.onclick = () => {
      userService.signIn(this.refs.signInUsername.value, this.refs.signInPassword.value).then(() => {
        history.push('/');
      }).catch((error: Error) => {
        if(errorMessage) errorMessage.set("Feil brukernavn og/eller passord");
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
        <div className="container">
          <h1>Registrer ny bruker</h1>
          <p>Fyll ut dette skjemaet for å registrere deg</p>
          <hr></hr>
          <label>Epost (brukernavn)</label>
          <input type="text" placeholder="eksempel@gmail.com" ref='signUpUsername'required></input>

          <label>Fullt navn</label>
          <input type="text" placeholder="Ola" ref='signUpFirstName' required></input>

          <button ref='signUpButton'>Registrer</button>

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

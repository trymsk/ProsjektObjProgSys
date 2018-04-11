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
        <div id="NavLink">
          <NavLink activeStyle={{color: 'green'}} exact to='/'>Hjem</NavLink>{' '}
          <NavLink activeStyle={{color: 'green'}} to={'/user/' + signedInUser.id}>{signedInUser.firstName}</NavLink>{' '}
          <NavLink activeStyle={{color: 'green'}} to='/addevent'> Legg til arrangement</NavLink>{' '}
          <NavLink activeStyle={{color: 'green'}} to='/signout'>Logg ut</NavLink>{' '}

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
    signUpButton: HTMLButtonElement,
    signInPassword: HTMLInputElement
  }

  render() {
    return (
      <div className="LogInBox">
          <div className="icon-bar">
              <a href="#" id="admin"><i className="fab fa-angular"></i></a>
          </div>
        <div className="imgcontainer">
          <img src="Bilder\red_cross_logo.png" alt="Logo" className="Logo"></img>
        </div>
        <div className="container">
          <input type="text" placeholder="E-post" id="uname" ref ='signInUsername'/>
          <input type="password" placeholder="Passord" id="psw" ref ='signInPassword'/>
          <button ref='signInButton'>Login</button>
        <button ref='signUpButton' id="regBtn">Registrer ny bruker</button>
        </div>
      </div>
    );
  }

  componentDidMount() {
    if(menu) menu.forceUpdate();

    this.refs.signUpButton.onclick = () => {
      history.push('/signup');
    }

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
    signUpPassword: HTMLInputElement,
    signUpLastName: HTMLInputElement,
    signUpTelephone: HTMLInputElement,
    signUpStreetadress: HTMLInputElement,
    signUpPostalcode: HTMLInputElement,
    signUpPlace: HTMLInputElement,
    signUpButton: HTMLButtonElement,
    signUpAmbulance: HTMLInputElement,
    signUpDriver160: HTMLInputElement,
    signUpDriverBE: HTMLInputElement,
    signUpHKP: HTMLInputElement,
    signUpSRW: HTMLInputElement,
    signUpSR: HTMLInputElement,
    signUpSRS: HTMLInputElement,
    signUpAdvFH:HTMLInputElement,
    signUpBoatDriver: HTMLInputElement,
    signUpVHF: HTMLInputElement,
    signUpVSeaR: HTMLInputElement,
    signUpSeaR: HTMLInputElement,
    signUpVLK: HTMLInputElement,
    signUpSMDriver: HTMLInputElement,
    signUpSMKurs: HTMLInputElement,
    signUpATV: HTMLInputElement,
    signUpDSensor: HTMLInputElement


  }

  render() {
    return (
      <div className='row'>
        <div className="table">
          <h1>Registrer ny bruker</h1>
          <p>Vennligst fyll ut registreringsskjemaet</p>
          <hr></hr>
          <label>Epost (brukernavn)</label>
          <input type="text" placeholder="eksempel@gmail.com" ref='signUpUsername'required/>

          <label>Passord</label>
          <input type="password" placeholder="Passord" ref='signUpPassword' required/>

          <label>Fornavn</label>
          <input type="text" placeholder="Ola" ref='signUpFirstName' required/>

          <label>Etternavn</label>
          <input type="text" placeholder="Nordmann" ref='signUpLastName' required/>

          <label>Telefon</label>
          <input type="text" placeholder="+4792233311" ref='signUpTelephone' required/>

          <label>Gateadresse</label>
          <input type="text" placeholder="Norgesveien 1" ref="signUpStreetadress" required/>

          <label>Postnummer</label>
          <input type="text" placeholder="0129" ref="signUpPostalcode" required/>

          <label>Poststed</label>
          <input type="text" placeholder="Oslo" ref="signUpPlace" required/>
        </div>
        <div className='table'>
          <h1> Kvalifikasjoner</h1>
          <p>Sjekk av for de kvalifikasjonene du har</p>
          <hr></hr>
          <input type='checkbox' ref='signUpAmbulance'/>Ambulansesertifisering<br/>

          <input type='checkbox' ref='signUpDriver160'/>Førerkort 160 Utrykningskjøring<br/>

          <input type='checkbox' ref='signUpDriverBE'/>Førerkort BE<br/>

          <input type='checkbox' ref='signUpHKP'/>Hjelpekorpsprøven<br/>

          <input type='checkbox' ref='signUpSR'/>Søk og Redning<br/>

          <input type='checkbox' ref='signUpSRW'/>Søk og Redning Vinter<br/>

          <input type='checkbox' ref='signUpSRS'/>Søk og Redning Sommer<br/>

          <input type='checkbox' ref='signUpAdvFH'/>Videregående Førstehjelpskurs<br/>

          <input type='checkbox' ref='signUpBoatDriver'/>Båtførerprøven<br/>

          <input type='checkbox' ref='signUpVHF'/>Maritimt VHF-sertifikat<br/>

          <input type='checkbox' ref='signUpSeaR'/>Kvalifisert sjøredningskurs<br/>

          <input type='checkbox' ref='signUpVSeaR'/>Videregående sjøredningskurs<br/>

          <input type='checkbox' ref='signUpVLK'/>Vaktlederkurs<br/>

          <input type='checkbox' ref='signUpSMDriver'/>Førerkort S Snøscooter<br/>

          <input type='checkbox' ref='signUpSMKurs'/>Kvalifisert Snøscooterkurs<br/>

          <input type='checkbox' ref='signUpATV'/>Kvalifisert ATV-kurs<br/>

          <input type='checkbox' ref='signUpDSensor'/>Distriktsensorkurs<br/>

          <button ref='signUpButton'>Registrer</button>
          </div>
        </div>
    );
  }


  componentDidMount() {
    this.refs.signUpButton.onclick = () => {
      userService.signUp(this.refs.signUpUsername.value, this.refs.signUpFirstName.value, this.refs.signUpLastName.value, this.refs.signUpPassword.value, this.refs.signUpTelephone.value, this.refs.signUpStreetadress.value, this.refs.signUpPostalcode.value, this.refs.signUpPlace.value, this.refs.signUpAmbulance.checked, this.refs.signUpDriver160.checked,
        this.refs.signUpDriverBE.checked, this.refs.signUpHKP.checked, this.refs.signUpSRW.checked, this.refs.signUpSR.checked, this.refs.signUpSRS.checked, this.refs.signUpAdvFH.checked, this.refs.signUpBoatDriver.checked, this.refs.signUpVHF.checked,
      this.refs.signUpSeaR.checked, this.refs.signUpVSeaR.checked, this.refs.signUpVLK.checked, this.refs.signUpSMDriver.checked, this.refs.signUpSMKurs.checked, this.refs.signUpATV.checked, this.refs.signUpDSensor.checked).then(() => {
        history.push('/');
      }).catch((error: Error) => {
        console.log(error);
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

  refs: {
    EventList: HTMLDivElement
  }
  render() {

    return (
      <div>
        <div id='eventList' ref='EventList'>
        <ul>
        </ul>
        </div>
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

  componentDidMount() {

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

// @flow
import * as React from 'react';
import ReactDOM from 'react-dom';
import { Link, NavLink, HashRouter, Switch, Route } from 'react-router-dom';
import createHashHistory from 'history/createHashHistory';
const history = createHashHistory();
import {User, userService, Event, eventService} from './services';

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
      if(signedInUser.uId == 36){
      return (
        <div id="NavLink">
          <NavLink activeStyle={{color: 'green'}} exact to='/'>Hjem</NavLink>{' '}
          <NavLink activeStyle={{color: 'green'}} to={'/user/' + signedInUser.uId}>{signedInUser.firstName}</NavLink>{' '}
          <NavLink activeStyle={{color: 'green'}} to='/addevent'>Legg til arrangement</NavLink>{' '}
          <NavLink activeStyle={{color: 'green'}} to='/signout'> Logg Ut </NavLink>{' '}
          <NavLink activeStyle={{color: 'green'}} to='/roles'>Roller</NavLink>{' '}

        </div>
      );}else{
        return (
          <div id="NavLink">
            <NavLink activeStyle={{color: 'green'}} exact to='/'>Hjem</NavLink>{' '}
            <NavLink activeStyle={{color: 'green'}} to={'/user/' + signedInUser.uId}>{signedInUser.firstName}</NavLink>{' '}
            <NavLink activeStyle={{color: 'green'}} to='/signout'> Logg Ut </NavLink>{' '}

          </div>
      );}
    }
    return (<div>  </div>
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
    signUpDSensor: HTMLInputElement,
    backButton: HTMLButtonElement


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
          <button ref='backButton'>Tilbake</button>
          </div>
        </div>
    );
  }


  componentDidMount() {
    this.refs.signUpButton.onclick = () => {
      userService.signUp(this.refs.signUpUsername.value, this.refs.signUpFirstName.value, this.refs.signUpLastName.value, this.refs.signUpPassword.value, this.refs.signUpTelephone.value, this.refs.signUpStreetadress.value, this.refs.signUpPostalcode.value, this.refs.signUpPlace.value,
        this.refs.signUpAmbulance.checked, this.refs.signUpDriver160.checked, this.refs.signUpDriverBE.checked, this.refs.signUpHKP.checked, this.refs.signUpSRW.checked, this.refs.signUpSR.checked, this.refs.signUpSRS.checked, this.refs.signUpAdvFH.checked, this.refs.signUpBoatDriver.checked, this.refs.signUpVHF.checked,
      this.refs.signUpSeaR.checked, this.refs.signUpVSeaR.checked, this.refs.signUpVLK.checked, this.refs.signUpSMDriver.checked, this.refs.signUpSMKurs.checked, this.refs.signUpATV.checked, this.refs.signUpDSensor.checked).then(() => {
        history.push('/');
      }).catch((error: Error) => {
        console.log(error);
        if(errorMessage) errorMessage.set("Kunne ikke opprette bruker, vennligst kontakt en administrator");
      });
    };

    this.refs.backButton.onclick = () => {
      history.push('/signIn');
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
  Events: Event[] = [];

  name: string = '';
  email: string = '';

  render() {
    let listItems=[];

    for(let event of this.Events){
      listItems.push(
        <li key={event.eId}>
        <Link to={'/event/' + event.eId}>{event.title}</Link>
        </li>
        );

    }
    return (
      <div className='container'>
      <h1>Arrangementer</h1>
      <hr></hr>
        <ul id='eventList'>
        {listItems}
        </ul>
        Tittel: <input type="text" ref="title" />
        Date: <input type="date" ref="date" />
        <h1>Profil</h1>
        Navn: {this.name}
        Epost: {this.email}
      </div>
    );
  }
  componentDidMount() {
    this.refs.title.value="en tittel";
    this.refs.date.valueAsDate = new Date();
    let signedInUser = userService.getSignedInUser();
    if(!signedInUser) {
      history.push('/signin');
      return;
    }
    this.name = signedInUser.firstName;
    this.email = signedInUser.username;
    this.forceUpdate();

    if(menu) menu.forceUpdate();

    eventService.getEvents().then((Events) => {
      this.Events = Events;
      this.forceUpdate();
    })

  }
}


class AddEvent extends React.Component<{}>{
  refs:{
    eTitle: HTMLInputElement,
    eType: HTMLInputElement,
    ePlace: HTMLInputElement,
    eAdress: HTMLInputElement,
    eDate: HTMLInputElement,
    eTime: HTMLInputElement,
    eContact: HTMLInputElement,
    eInfo: HTMLInputElement,
    eButton: HTMLButtonElement
  }
  render(){
    return(
    <div className='container'>
      <label>Tittel</label>
      <input type='text' ref='eTitle'/> <br/>
      <label>Type</label>
      <input type='text' ref='eType'/> <br/>
      <label>Sted</label>
      <input type='text' ref='ePlace'/> <br/>
      <label>Adresse</label>
      <input type='text' ref='eAdress'/> <br/>
      <label>Dato </label>
      <input type='date' ref='eDate'/>
      <label> Tidspunkt </label>
      <input type='time' ref='eTime'/><br/>
      <label>Ansvarlig</label>
      <input type='text' ref='eContact'/><br/>
      <label>Informasjon</label>
      <input type='text' ref='eInfo'/><br/>
      <button ref='eButton'>Legg til</button>
    </div>
    );
  }
  componentDidMount() {
    this.refs.eButton.onclick = () =>{
      eventService.addEvent(this.refs.eTitle.value, this.refs.eType.value, this.refs.ePlace.value, this.refs.eAdress.value, this.refs.eDate.value, this.refs.eTime.value, this.refs.eContact.value, this.refs.eInfo.value).then(() => {
        history.push('/');
      }).catch((error: Error) => {
        console.log(error);
        if(errorMessage) errorMessage.set("Kunne ikke opprette arrangement");
      });
    };
  }
}

class UserDetails extends React.Component <{}> {
  name: string = '';
  telephone: string = '';
  adress: string = '';
  email: string = '';

  render(){
    return(
      <div className='container'>
      <h1> Brukerprofil </h1>
      Navn: {this.name} <br/>
      Telefon: {this.telephone}<br/>
      Adresse: {this.adress} <br/>
      Epost: {this.email} <br/>
      </div>
    )
  }
  componentDidMount() {
    let signedInUser = userService.getSignedInUser();
    if(!signedInUser) {
      history.push('/signin');
      return;
    }
    this.name = signedInUser.firstName;
    this.telephone = signedInUser.telephone;
    this.adress = signedInUser.uAdress + ' ' + signedInUser.postalCode + ' ' + signedInUser.uPlace;
    this.email = signedInUser.username;
    this.forceUpdate();
    if(menu) menu.forceUpdate();
  }
}

class EventPage extends React.Component<{match: {params: {id:number}}}>{
  id: number;
  title: string = '';
  type: string = '';
  place: string = '';
  adress: string = '';
  date: string = '';
  time: string = '';
  contact: string = '';
  info: string = '';

  render(){
    return (
    <div className='container'>
      Tittel:{this.title} <br/>
      Type: {this.type} <br/>
      Sted: {this.place} <br/>
      Adresse: {this.adress} <br/>
      Dato og tidspunkt: {this.date + this.time} <br/>
      Ansvarlig: {this.contact} <br/>
      Informasjon: <div className='eventInfoDiv'> {this.info}</div> <br/>
    </div>
  );}
  componentDidMount() {
    eventService.getEvent(this.props.match.params.id).then(event => {
      this.id=event.eId;
      this.title=event.title;
      this.type = event.type;
      this.place = event.place;
      this.adress = event.adress;
      this.date = event.date;
      this.time = event.time;
      this.contact = event.contact;
      this.info = event.info;
      this.forceUpdate();
    });
  }

}

class Roles extends React.Component<{}>{
  users: User[] = [];

  render(){
    let options=[];
    for(let user of this.users) {
      options.push(<option key={user.uId}>{user.firstName + ' ' + user.lastName}</option>);
    }
    return(
      <div className='container'>
        <select>
          {options}
        </select>
      </div>
    );
  }

  componentDidMount() {
    userService.getMedic().then(users=> {
      this.users=users;
      this.forceUpdate();
    })
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
          <Route exact path='/addevent' component={AddEvent}/>
          <Route exact path='/' component={Home} />
          <Route exact path='/user/:id' component={UserDetails}/>
          <Route exact path='/event/:id' component={EventPage}/>
          <Route exact path='/roles' component={Roles}/>

        </Switch>
      </div>
    </HashRouter>
  ), root);
}

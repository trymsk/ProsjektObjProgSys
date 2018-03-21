// @flow
import * as React from 'react';
import ReactDOM from 'react-dom';
import { Link, NavLink, HashRouter, Switch, Route } from 'react-router-dom';
import createHashHistory from 'history/createHashHistory';
const history = createHashHistory();
import { User, userService, Post, postService } from './services';

class ErrorMessage extends React.Component<{}> {
  refs: {
    closeButton: HTMLButtonElement
  };
  message = '';

  render() {
    let displayValue;
    if(this.message=='') displayValue = 'none';
    else displayValue = 'inline';

    return(
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

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
          <NavLink activeStyle={{color: 'green'}} to={'/user/' + signedInUser.id}>{signedInUser.firstName}</NavLink>{' '}
          <NavLink activeStyle={{color: 'green'}} to='/friends'>Friends</NavLink>{' '}
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
      <div>
        Username: <input type='text' ref='signInUsername' />
        <button ref='signInButton'>Sign In</button>
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
      <div>
        Username: <input type='text' ref='signUpUsername' />
        First name: <input type='text' ref='signUpFirstName' />
        <button ref='signUpButton'>Sign Up</button>
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
  posts: Post[] = [];

  render() {
    let listItems = [];
    for(let post of this.posts) {
      listItems.push(
        <li key={post.id}>From{' '}
          <Link to={'/user/' + post.fromUserId}>
            {post.fromUserFirstName}
          </Link> to {' '}
          <Link to={'/user/' + post.toUserId}>
            {post.toUserFirstName}
          </Link>: {post.text}
        </li>
      );
    }

    return (
      <div>
        Posts from friends:
        <ul>
          {listItems}
        </ul>
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

    postService.getPostsNotFromUser(signedInUser.id).then((posts) => {
      this.posts = posts;
      this.forceUpdate();
    }).catch((error: Error) => {
      if(errorMessage) errorMessage.set("Failed getting posts");
    });
  }
}

class Friends extends React.Component<{}> {
  friends: User[] = [];

  render() {
    let listItems = [];
    for(let friend of this.friends) {
      listItems.push(<li key={friend.id}><Link to={'/user/' + friend.id}>{friend.firstName}</Link></li>);
    }

    return (
      <div>
        Friends:
        <ul>
          {listItems}
        </ul>
      </div>
    );
  }

  componentDidMount() {
    let signedInUser = userService.getSignedInUser();
    if(signedInUser) {
      userService.getFriends(signedInUser.id).then((friends) => {
        this.friends = friends;
        this.forceUpdate();
      }).catch((error: Error) => {
        if(errorMessage) errorMessage.set('Could not get friends');
      });
    }
  }
}

class UserDetails extends React.Component<{ match: { params: { id: number } } }> {
  refs: {
    newPost: HTMLInputElement,
    newPostButton: HTMLButtonElement
  }

  user = new User();
  posts: Post[] = [];

  render() {
    let listItems = [];
    for(let post of this.posts) {
      listItems.push(<li key={post.id}>From <Link to={'/user/' + post.fromUserId}>{post.fromUserFirstName}</Link>: {post.text}</li>);
    }

    return (
      <div>
        Posts to {this.user.firstName}:
        <ul>
          {listItems}
        </ul>
        Make post:
        <input type='text' ref='newPost' />
        <button ref='newPostButton'>Post</button>
      </div>
    );
  }

  update() {
    userService.getUser(this.props.match.params.id).then((user) => {
      this.user = user;
      this.forceUpdate();
    }).catch((error: Error) => {
      if(errorMessage) errorMessage.set("Failed getting user");
    });
    postService.getPostsToUser(this.props.match.params.id).then((posts) => {
      this.posts = posts;
      this.forceUpdate();
    }).catch((error: Error) => {
      if(errorMessage) errorMessage.set("Failed getting posts");
    });
  }

  componentDidMount() {
    this.update();

    this.refs.newPostButton.onclick = () => {
      let signedInUser = userService.getSignedInUser();
      if(!signedInUser) {
        history.push('/signin');
        return;
      }
      postService.addPost(signedInUser.id, this.props.match.params.id, this.refs.newPost.value).then(() => {
        this.refs.newPost.value = '';
        this.update();
      }).catch((error: Error) => {
        if(errorMessage) errorMessage.set("Error adding post");
      });
    }
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
          <Route exact path='/friends' component={Friends} />
          <Route exact path='/user/:id' component={UserDetails} />
        </Switch>
      </div>
    </HashRouter>
  ), root);
}

import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import io from 'socket.io-client';
import style from './App.css';

//import MessageForm from './MessageForm';
//import MessageList from './MessageList';
import Userslist from './UsersList';
import UserForm from './UserForm';

//nawiązanie połączenia z przestrzenią nazw czyli ('/')
const socket = io('/');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {users: [], messages: [], text: '', name: ''};
  }

  ComponentDidMount() {
    socket.on('message', message => this.messageReceive(message));
    socket.on('update', ({users}) => this.chatUpdate(users));
  }

  render() {
    //jeśli this.state.name nie jest puste to renderujemy aplikację, w przeciwnym wypadku - formularz do wpisania nazwy
    //<warunek_do_sprawdzenia> ? <przypadek_true> : <przypadek_false>
    return this.state.name !=='' ? this.renderLayout() : this.renderUserForm();
  }

  renderLayout() {
    return (
      <div className={styles.App}>
        <div className={styles.AppHeader}>
          <div className={styles.AppTitle}>ChatApp</div>
          <div className={styles.AppRoom}>App Room</div>
        </div>
        <div className={styles.AppBody}>
          <UsersList users={this.state.users}/>
          <div className={styles.MessageWrapper}>
            <MessageList messages={this.state.messages}/>
            <MessageForm
              onMessageSubmit={message => this.handleMessageSubmit(message)}
              name={this.state.name}/>
          </div>
        </div>
      </div>
    );
  }

  renderUserForm() {
    return (<UserForm onUserSubmit={name => this.handleUserSubmit(name)}/>)
  }

  messageReceive(message) {
    const messages = [message, ...this.state.messages];
    this.setState({messages});
  }

  chatUpdate(users) {
    this.setState({users});
  }

  handleMessageSubmit(message) {
    const messages = [message, ...this.state.messages];
    this.setState({messages});
    socket.emit('message', message);
  }

  handleUserSubmit(name) {
    this.setState({name});
    socket.emit('join', name);
  }
};

export default hot(module)(App);

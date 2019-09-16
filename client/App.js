import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import io from 'socket.io-client';

//nawiązanie połączenia z przestrzenią nazw czyli ('/')
const socket = io('/');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {users: [], messages: [], text: '', name: ''};
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
              onMessageSubmit={message =>this.handleMessageSubmit(message)}
              name={this.state.name}/>
          </div>
        </div>
      </div>
    );
  }
};

export default hot(module)(App);

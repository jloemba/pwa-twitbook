import { LitElement, html, css } from 'lit-element';
import './data/chat-data.js';
import './data/chat-auth.js';
import './data/chat-login.js';
import './data/chat-store.js';


import firebase from 'firebase/app';

class ChatApp extends LitElement {

  constructor() {
    super();
    this.users = [];
    this.user = {};
    this.messages = [];
    this.comment = '';
    this.message = '';
    this.logged = false;
    this.userData = {}
  }

  static get properties(){
    return {
      unresolved: {
        type: Boolean,
        reflect: true
      },
      email: { type: String },
      pseudo: { type: String },
      users: { type: Array },
      user: { type: Object },
      messages: { type: Array },
      message: { type: String },
      logged: { type: Boolean }

    }
  }

  static get styles() {
    return css`
     :host {
       display: block;
     }
     ::slotted(header) {
       position: sticky;
       top: 0;
       z-index: 1;
       background-color: #fff;
     }
     * {  box-sizing: border-box }
     body {
      background: #e6ecf0
     }
     footer {
       position: fixed;
       bottom: 0;
       width: 100%;
     }
     footer form {
       display: flex;
       justify-content: space-between;
       background-color: #ffffff;
       padding: 0.5rem 1rem;
       width: 100%;
     }
     footer form input {
       width: 100%;
     }

     .profile {
      width: 62px;
      height: 62px;
      text-align: center;
      -moz-border-radius: 100%;
      -webkit-border-radius: 100%;
      -o-border-radius: 100%;
      -ms-border-radius: 100%;
      border-radius: 100%;
     }

     ul {
       position: relative;
       display: flex;
       flex-direction: column;
       list-style: none;
       padding: 0;
       margin: 0;
       margin-bottom: 3em;
     }

     ul li {
       display: block;
       padding: 0.5rem 1rem;
       margin-bottom: 1rem;
       background-color: #cecece;
       border-radius: 15px;
       width: 70%;
     }
     ul li.own {
       align-self: flex-end;
       text-align: right;
       background-color: #16a7f1;
       color: #ffffff;
       border-radius: 15px;
     }
     .grid {
        width: 100%;
        display: table;
        border-collapse:separate;
        border-spacing:15px;
      }

      .grid-row {
        width: 100%;
        display: table;
        table-layout: fixed;
        margin:0 0 -15px 0;
      }

      .item {
        display: table-cell;
        padding: 2%;
      }

      @media screen and (max-width: 480px) {

        .grid-row {
            display: block;
            width: 100%;
            margin:0;
        }

        .item {
          display: block;
          width: 100%;
          margin: 0 0 5px 0;
        }

      }
   `;
  }

  firstUpdated() {
    this.unresolved = false;
    this.logged = localStorage.getItem('logged') === 'true' ? true : false;

    if (Notification.permission === 'granted') {
         navigator.serviceWorker.ready
           .then(registration => {
             registration.pushManager.subscribe({
               userVisibleOnly: true,
               applicationServerKey: this.urlBase64ToUint8Array(document.config.publicKey)
             }).then(async subscribtion => {
               await fetch('http://localhost:8085/subscribe', {
                 method: 'POST',
                 headers: {
                   'Content-Type': 'application/json',
                 },
                 body: JSON.stringify(subscribtion)
               })
             });
           });
       }
  }

  customChildChanged(e) {
    this.messages = e.detail;
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 0);
  }

  handleLogin(e) {
    this.user = e.detail.user;

    // On va chercher quelques personnes à follow
    firebase.firestore().collection('users').get()
    .then((users) => {
      users.forEach((user) => {
          this.users.push({
            uid : user.id,
            ...user.data()
          })
      });
    })

    // On charge les données de l'utilisateur
    firebase.firestore().collection('users').doc(this.user.uid).get()
    .then((user) => {
      if (user.exists) this.userData = user.data()
      else alert('Utilisateur inconnu')
    })


  }

  getDate(timestamp) {
    const date = new Date(timestamp);
    // Hours part from the timestamp
    const hours = date.getHours();
    // Minutes part from the timestamp
    const minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    const seconds = "0" + date.getSeconds();

    // Will display time in 10:30:23 format
    return `${hours}:${minutes.substr(-2)}:${seconds.substr(-2)}`;
  }

  sendMessage(e) {
    e.preventDefault();
    if (!this.message) return;
    firebase.firestore().collection('messages').add({
      content: this.message,
      user: this.user.uid,
      email: this.user.email,
      username: this.user.username,
      is_retweet : false,
      is_comment : false,
      comments : [],
      date: new Date().getTime()
    });

    this.message = '';
  }

  sendComment(e){
    e.preventDefault();
    let message = e.target.getAttribute('data-message')

    if (!this.comment) return;
    firebase.firestore().collection('messages').add({
      content: this.comment,
      user: this.user.uid,
      email: this.user.email,
      username: this.user.username,
      is_comment : true,
      is_retweet : false,
      comments : [],
      comment_message : message,
      date: new Date().getTime()
    });

    firebase.firestore().collection('messages').doc(message).get()
    .then((message) => {
      if (message.exists) {
        firebase.firestore().collection("messages").doc(message.id).update({
          comments: [...message.data().comments, this.comment]
        })
      }

      this.comment = '';
    })

  }

  urlBase64ToUint8Array(base64String) {
      const padding = '='.repeat((4 - base64String.length % 4) % 4);
      const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    }


  subscribe() {
    if (('serviceWorker' in navigator) || ('PushManager' in window)) {
      Notification.requestPermission()
        .then(function(result) {
          if (result === 'denied') {
            console.log('Permission wasn\'t granted. Allow a retry.');
            return;
          }
          if (result === 'default') {
            console.log('The permission request was dismissed.');
            return;
          }
          console.log('Notification granted', result);
          // Do something with the granted permission.
        });
      }
    }

  retweet(e) {
    e.preventDefault();
    let messageId = e.target.getAttribute('data-message')
    let userId = firebase.auth().currentUser.uid;
    firebase.firestore().collection('messages').doc(messageId).get()
    .then((message) => {
      firebase.firestore().collection('messages').add({
        user: this.user.uid,
        email: this.user.email,
        username: this.user.username,
        is_comment : false,
        is_retweet : true,
        retweet_message : message.data(),
        date: new Date().getTime()
      });
    })
  }

  like(e) {
    e.preventDefault();
    let message = e.target.getAttribute('data-message')
    let userId = firebase.auth().currentUser.uid;

    firebase.firestore().collection('users').doc(userId).get()
    .then((user) => {
      if(user.data().likes.indexOf(message) == -1)
        firebase.firestore().collection("users").doc(userId).update({
          likes : [...user.data().likes, message]
        })
    })

  }

  follow(e) {
    e.preventDefault();
    let otherId = e.target.getAttribute('data-user')
    let userId = firebase.auth().currentUser.uid;

    // On va chercher les 2 utilisateurs concernés
    return Promise.all([
      firebase.firestore().collection('users').doc(otherId).get(),
      firebase.firestore().collection('users').doc(userId).get()
    ])
    .then(function([other, user]) {
      if (other.exists && user.exists) {
        // Uniquement s'il ne le suit pas déjà
        if(other.data().followings.indexOf(userId) == -1
          && user.data().followers.indexOf(otherId) == -1){
          // On ajoute l'utilisateur aux followers de l'autre
          // On ajoute l'autre aux followings de l'utilisateur
          return Promise.all([
            firebase.firestore().collection("users").doc(otherId).update({
              followings : [...other.data().followings, userId]
            }),
            firebase.firestore().collection("users").doc(userId).update({
              followers : [...user.data().followers, otherId]
            })
          ])
          .then(function() {
            // Changer le bouton en following
          }).catch(function(error) {
            console.log('erreur', error)
          });
        }
      } else {
        alert("Utilisateur non trouvé");
      }
    }).catch(function(error) {
      console.log('erreur', error)
    });
  }

  render() {

    return html`
    <div class="row">
      <div class="col-6">
        <chat-store collection="messages" @custom-child-changed="${this.customChildChanged}"></chat-store>
        <slot></slot>
        ${
            !this.logged ? html`
              <div class="grid">
                <div class="grid-row">
                  <div class="item"><chat-auth></chat-auth></div>

                  <div class="item"><chat-login @user-logged="${this.handleLogin}"></chat-login></div>
                </div>
              </div>
            ` : html `
              <h1> Hi ${this.user.username} </h1>

              <button type="button" @click="${this.subscribe}">Subcribe</button>

              <div class="grid">
                <div class="grid-row">
                  <div class="item">
                    <ul>
                      ${this.messages.map(message => html`
                        <li class="${message.user === this.user.uid ? 'own' : ''}">
                        <div class="grid">
                          <div class="grid-row">
                            <div class="item">
                              <img class="profile" src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png">
                              <p> <strong>${message.username}</strong> </p>
                              <i>${this.getDate(message.date)}</i>
                              ${
                                message.user !== this.user.uid ? html`
                                  <button data-user=${message.user} @click="${this.follow}">${message.user !== this.user.uid ? 'Follow' : ''}</button>
                                ` : html``
                              }

                            </div>
                            <div class="item">
                              ${!message.is_retweet ? html`
                                <p>${message.content}</p>
                              ` : `
                              <strong style="color:red;">${message.retweet_message.username} a retweeté : </strong><p>${message.retweet_message.content}</p>
                              `}
                            </div>
                          </div>
                        </div>
                        <div class="grid">
                          <div class="grid-row">
                            ${!message.is_retweet ? html`
                              <div class="item">
                                <span>↩️ ${message.comments.length}</span>
                                <form .tweet="${message}" data-message=${message.id} @submit="${this.sendComment}">
                                  <input type="text" .value="${this.comment}" @input="${e => this.comment = e.target.value}">
                                  <button type="submit">Comment</button>
                                </form>
                              </div>
                              <div class="item">
                                <button data-message=${message.id} @click="${this.retweet}">🔄</button>
                              </div>
                              <div class="item">
                                <button data-message=${message.id} @click="${this.like}">❤️</button>
                              </div>` : `
                                <div class="item">
                                <span>↩️ ${message.retweet_message.comments.length}</span>
                                <form .tweet="${message.retweet_message}" data-message=${message.retweet_message.id} @submit="${this.sendComment}">
                                  <input type="text" .value="${this.comment}" @input="${e => this.comment = e.target.value}">
                                  <button type="submit">Comment</button>
                                </form>
                                </div>
                                <div class="item">
                                  <button data-message=${message.retweet_message.id} @click="${this.retweet}">🔄</button>
                                </div>
                                <div class="item">
                                  <button data-message=${message.retweet_message.id} @click="${this.like}">❤️</button>
                                </div>
                                `}
                          </div>
                        </div>
                      </li>
                      `)}
                    </ul>
                  </div>
                  <div class="item">
                    <h4>Derniers utilisateurs</h4>
                      <ul>
                      ${html`${this.users.map(user => user.uid !== this.user.uid ? html`
                        <li>
                          ${user.username}
                          <button data-user=${user.uid} @click="${this.follow}">Follow</button>
                        </li>` : ``)}` }
                      </ul>
                  </div>
                </div>
              </div>
              <footer>
                <form @submit="${this.sendMessage}">
                  <input type="text" .value="${this.message}" @input="${e => this.message = e.target.value}">
                  <button type="submit">Submit</button>
                </form>
              </footer>
            `
          }
      </div>
    </div>`
  }
}

customElements.define('chat-app', ChatApp);

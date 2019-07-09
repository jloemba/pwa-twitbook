import { LitElement, html, css } from 'lit-element';
import './data/chat-data.js';
import './data/chat-auth.js';
import './data/chat-login.js';
import './data/chat-store.js';

import firebase from 'firebase/app';
import "firebase/storage";

class ChatApp extends LitElement {

  constructor() {
    super();
    this.users = [];
    this.user = {};
    this.messages = [];
    this.comment = '';
    this.message = '';
    this.logged = false;
    this.authRender = false;
    this.wantToComment = false;
    this.nbImage = 0;
    this.wantToPutImage = false;
    this.images = [];
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
      logged: { type: Boolean },
      authRender: {type: Boolean},
      wantToComment: {type: Boolean},
      nbImage : {type: Number},
      wantToPutImage: {type: Boolean},
      images : {Array}
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
       width: 100%;
     }

     .grid {
        width: 100%;
        display: table;
        border-collapse:separate;
        border-spacing:15px;
      }

      .profile {
        margin-left: -150px;
        margin-bottom: -300px;
        position: absolute;
        width: 62px;
        height: 62px;
        text-align: center;
        -moz-border-radius: 100%;
        -webkit-border-radius: 100%;
        -o-border-radius: 100%;
        -ms-border-radius: 100%;
        border-radius: 100%;
      }

      .mini-profile {
        margin-left: -45px;
        margin-bottom: -300px;
        position: absolute;
        width: 34px;
        height: 34px;
        text-align: center;
        -moz-border-radius: 100%;
        -webkit-border-radius: 100%;
        -o-border-radius: 100%;
        -ms-border-radius: 100%;
        border-radius: 100%;
      }

      .mini {
        width: 100px;
        height: 100px;
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
        text-align: top;
      }

    .form-container {
      display: block;

      background-color: #cecece;
      border-radius: 15px;
      width: 100%;
    }

    .signed {
      background: green;
      color: white !important;
      border: solid #316133;
      border-radius: 5px;
      padding: 10px 0px;
      text-decoration: none;
      text-align: center;
    }

    #sendmessage {
        padding: 5px 25px 25px;
        -moz-border-radius: 5px;
        -webkit-border-radius: 5px;
        border-radius: 5px;
    }

    #sendmessage .header {
        margin-bottom: 20px;
    }

    #sendmessage .header h3 {
        color: #333333;
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 5px;
    }

    #sendmessage .header p {
        color: #8f8f8f;
        font-size: 14px;
        font-weight: 300;
    }

    #sendmessage .sep {
        height: 1px;
        background: #e8e8e8;
        margin: 0px -25px;
    }

    #sendmessage .inputs {
        margin-top: 25px;
        text-align: right;
    }

    #sendmessage .inputs label {
        color: #8f8f8f;
        font-size: 12px;
        font-weight: 300;
        letter-spacing: 1px;
        margin-bottom: 7px;
        display: block;
    }

    input::-webkit-input-placeholder {
        color:    #b5b5b5;
    }

    input:-moz-placeholder {
        color:    #b5b5b5;
    }

    #sendmessage .inputs input[type=email], input[type=password], input[type=text], input[type=textarea]{
        background: #f5f5f5;
        font-size: 0.8rem;
        -moz-border-radius: 3px;
        -webkit-border-radius: 3px;
        border-radius: 3px;
        width: 100%;
        border: none;
        padding: 13px 10px;
        margin-bottom: 20px;
        box-shadow: inset 0px 2px 3px rgba( 0,0,0,0.1 );
    }

    #sendmessage .inputs input[type=email]:focus, input[type=password]:focus, input[type=text]:focus, input[type=textarea]:focus {
        background: #fff;
        box-shadow: 0px 0px 0px 3px #fff38e, inset 0px 2px 3px rgba( 0,0,0,0.2 ), 0px 5px 5px rgba( 0,0,0,0.15 );
        outline: none;
    }

    #sendmessage .inputs .checkboxy {
        display: block;
        position: static;
        height: 25px;
        margin-top: 10px;
        clear: both;
    }

    #sendmessage .inputs input[type=checkbox] {
        float: left;
        margin-right: 10px;
        margin-top: 3px;
    }

    #sendmessage .inputs label.terms {
        float: left;
        font-size: 14px;
        font-style: italic;
    }

    #sendmessage .inputs #submit {
      align-self: right;
        width: 50%;
        padding: 15px 0;
        color: #fff;
        font-size: 14px;
        font-weight: 500;
        letter-spacing: 1px;
        text-align: center;
        text-decoration: none;
            background: -moz-linear-gradient(
            top,
            #b9c5dd 0%,
            #a4b0cb);
        background: -webkit-gradient(
            linear, left top, left bottom,
            from(#b9c5dd),
            to(#a4b0cb));
        -moz-border-radius: 5px;
        -webkit-border-radius: 5px;
        border-radius: 5px;
        border: 1px solid #737b8d;
        -moz-box-shadow:
            0px 5px 5px rgba(000,000,000,0.1),
            inset 0px 1px 0px rgba(255,255,255,0.5);
        -webkit-box-shadow:
            0px 5px 5px rgba(000,000,000,0.1),
            inset 0px 1px 0px rgba(255,255,255,0.5);
        box-shadow:
            0px 5px 5px rgba(000,000,000,0.1),
            inset 0px 1px 0px rgba(255,255,255,0.5);
        text-shadow:
            0px 1px 3px rgba(000,000,000,0.3),
            0px 0px 0px rgba(255,255,255,0);
      }

      #sendmessage .inputs #submit:hover {
          background: -moz-linear-gradient(
              top,
              #a4b0cb 0%,
              #b9c5dd);
          background: -webkit-gradient(
              linear, left top, left bottom,
              from(#a4b0cb),
              to(#b9c5dd));
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
      return users
    })
    .then(()=>{
      // On charge nos utilisateurs
      return firebase.firestore().collection('users').doc(this.user.uid).get()
    })
    .then((user) => {
      if (user.exists) {
        // On autorise le render des messages
        this.authRender = true;
        // On charge les données de l'utilisateur courant
        this.user.data = user.data()
      }
      else alert('Utilisateur inconnu')
    })
  }

  sendMessage(e) {
    e.preventDefault();
    if (!this.message) return;

    let imgSnapshots = []
    let promises = []

    // Préparation de l'upload des images sur Firebase
    this.images.forEach((image, i) => {
      const ref = firebase.storage().ref().child(`image-${i}-${new Date().getTime()}.png`)

      promises.push(
        ref.putString(image.toDataURL(), 'data_url')
          .then(snapshot => snapshot.ref.getDownloadURL())
          .then(downloadURL => imgSnapshots.push(downloadURL)))
    })
    console.log("imgs", imgSnapshots)
    // On créer les références des images en base et on les ajoute au message
    return Promise.all(promises).then(() => {
      console.log("imgseeee", imgSnapshots)
      // Ajoute un message dans la base
      firebase.firestore().collection('messages').add({
        content: this.message,
        user: this.user.uid,
        email: this.user.email,
        username: this.user.username,
        is_retweet : false,
        is_comment : false,
        comments : [],
        likes : [],
        images : imgSnapshots,
        date: new Date().getTime()
      });

      this.nbImage = 0;
      this.images = []
      this.message = '';
    })
  }

  sendComment(e){
    e.preventDefault();
    let message = e.target.getAttribute('data-message')

    // On va ajouter un commentaire (message) dans la base en le liant au message
    // On va aussi chercher ce message pour le modifier
    if (!this.comment) return;
    return Promise.all([
      firebase.firestore().collection('messages').add({
        content: this.comment,
        user: this.user.uid,
        email: this.user.email,
        username: this.user.username,
        is_comment : true,
        is_retweet : false,
        comments : [],
        likes : [],
        comment_message : message,
        date: new Date().getTime()
      }),
      firebase.firestore().collection('messages').doc(message).get()
    ])
    .then(([comment, message]) => {
      if (message.exists) {
        // On ajoute le commentaire au message
        firebase.firestore().collection("messages").doc(message.id).update({
          comments: [...message.data().comments, {
            id : comment.id,
            content: this.comment,
            user: this.user.uid,
            email: this.user.email,
            username: this.user.username,
            is_comment : true,
            is_retweet : false,
            comments : [],
            likes : [],
            comment_message : message.id,
            date: new Date().getTime()
          }]
        })
        // On modifie les commentaires qu'on a chargé
        this.messages.forEach(m => {
          if(m.id == message.id){
            m.comments = [...message.data().comments, {
              id : comment.id,
              content: this.comment,
              user: this.user.uid,
              email: this.user.email,
              username: this.user.username,
              is_comment : true,
              is_retweet : false,
              comments : [],
              likes : [],
              comment_message : message.id,
              date: new Date().getTime()
            }]
          }
        });
        this.comment = '';
        // Retire le formulaire de commentaire
        this.wantToComment = false
      }
    })
  }

  retweet(e) {
    e.preventDefault();
    let message = e.target.getAttribute('data-message')
    let userId = firebase.auth().currentUser.uid;

    // On ajoute un message à la base en relation avec le message qu'on RT
    firebase.firestore().collection('messages').doc(message).get()
    .then((message) => {
      firebase.firestore().collection('messages').add({
        user: this.user.uid,
        email: this.user.email,
        username: this.user.username,
        is_comment : false,
        is_retweet : true,
        retweet_message : {
          id : message.id,
          ...message.data()
        },
        date: new Date().getTime()
      });
    })
  }

  like(e) {
    e.preventDefault();
    let message = e.target.getAttribute('data-message')
    let userId = firebase.auth().currentUser.uid;

    // On va ajouter aux likes de l'utilisateur le message sur lequel on a cliqué
    // On va incrémenter le nombre de likes du tweet
    return Promise.all([
      firebase.firestore().collection('users').doc(userId).get(),
      firebase.firestore().collection('messages').doc(message).get()
    ])
    .then(([user, comment]) => {
      // Uniquement si l'utilisateur ne l'a pas déjà liké
      if(user.data().likes.indexOf(message) == -1){

        // On ajouter l'utilisateur aux tableaux de likes
        firebase.firestore().collection("messages").doc(message).update({
          likes : [...comment.data().likes, userId]
        })
        // On ajouter le message aux tableaux de likes de l'utilisateur
        firebase.firestore().collection("users").doc(userId).update({
          likes : [...user.data().likes, message]
        })

        // On ajoute également les likes à l'utilisateur courant
        this.user.data.likes = [...user.data().likes, message]
        //console.log(e.target)
        //e.target.textContent = "❤️️"
      }
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

  logout(){
    // Déconnexion Firebase
    firebase.auth().signOut().then(function() {
      window.location.reload();
    }).catch(function(error) {
      alert('Erreur')
    });
  }

  userWantToComment(e){
    // Permet d'afficher les commentaires d'un tweet et de
    if(!this.wantToComment) this.wantToComment = e.target.getAttribute('data-message')
    else this.wantToComment = false
  }

  onPaste(e){

    // Pas plus de 4 images
    if(this.nbImage >= 4) return;
    // Handle the event
    this.retrieveImageFromClipboardAsBlob(e, (imageBlob) => {
        // If there's an image, display it in the canvas
        if(imageBlob){

            let canvas = document.createElement('canvas')
            let ctx = canvas.getContext('2d');

            // Create an image to render the blob on the canvas
            let img = new Image();

            // Once the image loads, render the img on the canvas
            img.onload = function(){
                // Update dimensions of the canvas with the dimensions of the image
                canvas.width = this.width;
                canvas.height = this.height;

                // Draw the image
                ctx.drawImage(img, 0, 0);
            };

            // Crossbrowser support for URL
            let URLObj = window.URL || window.webkitURL;

            // Creates a DOMString containing a URL representing the object given in the parameter
            // namely the original Blob
            img.src = URLObj.createObjectURL(imageBlob);

            this.wantToPutImage = true;
            this.nbImage++;
            this.images.push(canvas)
        }
    });
  };

  render() {
    let authRender = this.authRender

    return html`
      <div class="row">
        <div class="col-6">
          <chat-store collection="messages" @custom-child-changed="${this.customChildChanged}"></chat-store>
          <slot></slot>


          <!-- Si l'utilisateur n'est pas loggé, on affiche les formulaires  -->

          ${
              !this.logged ? html`
                <div class="grid">
                  <div class="grid-row">
                    <div class="item"><chat-auth></chat-auth></div>
                    <div class="item"><chat-login @user-logged="${this.handleLogin}"></chat-login></div>
                  </div>
                </div>

                <!-- Si l'utilisateur est loggé, on lui dit bonjour et tout va bien -->

              ` : html `
                <h1> Hi ${this.user.username} </h1>
                <small @click="${this.logout}">logout</small>
                <button type="button" @click="${this.subscribe}">Subcribe</button>

                <!-- S'affiche uniquement si les données ont fini de charger -->

                ${authRender ? html`

                <!-- TWEET INPUT -->

                <div class="grid">
                  <div class="grid-row">
                    <div class="item">
                      <div class="form-container">
                        <form id="sendmessage" @submit="${this.sendMessage}">
                          <div class="inputs">
                            <input @paste="${this.onPaste}" rows="2" type="textarea" .value="${this.message}" @input="${e => this.message = e.target.value}">
                            <button id="submit" type="submit">Tweet</button>
                          </div>

                          <!-- IMAGES -->

                          ${ this.wantToPutImage ? html `
                           ${this.images.map(image => image) }
                          ` : ``}
                          <div id="canvas">
                            <!-- TWEET INPUT -->
                          </div>
                        </form>
                      </div>
                    </div>
                    <div class="item"></div>
                  </div>
                </div>

                <div class="grid">
                  <div class="grid-row">
                    <div class="item">
                      <ul>

                      <!-- TWEET -->

                        ${this.messages.map(message => html`
                          <li>
                            <div class="grid">

                              <!-- Si le message est un retweet, on affiche un message en plus -->

                              ${message.is_retweet ? html`
                              <div class="grid-row">
                                <div class="item">
                                  <strong style="color:red;">${message.username} Retweeted : </strong></i>
                                </div>
                              </div>`: html``}

                              <!-- HEADER TWEET-->

                              <div class="grid-row">
                                <div class="item">
                                  ${!message.is_retweet ?
                                    html`
                                    <img class="profile" src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"><strong>${message.username} : </strong><i>${this.getDate(message.date)}</i>
                                      ${ message.user !== this.user.uid ? html`<button data-user=${message.user} @click="${this.follow}">Follow</button>`: html`` }
                                    ` :
                                    html`
                                    <img class="profile" src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"><strong>${message.retweet_message.username} : </strong><i>${this.getDate(message.retweet_message.date)}</i>
                                      ${ message.retweet_message.user !== this.user.uid ? html`<button data-user=${message.user} @click="${this.follow}">Follow</button>`: html`` }
                                  `}
                                </div>
                              </div>

                              <!-- BODY TWEET-->

                              <div class="grid-row">
                                <div class="item">

                                  <!-- NATIVE TWEET-->

                                  ${!message.is_retweet ? html`
                                    <div>${message.content}</div>
                                    <div>
                                      <button data-message=${message.id} @click="${this.like}">${this.user.data.likes.find(function(like) { return like == message.id }) ? html`❤️️`: html`♡`}</button>
                                      <button data-message=${message.id} @click="${this.retweet}">🔄</button>


                                    <!-- DO NOT WANT TO COMMENT-->

                                    ${this.wantToComment != message.id ? html`
                                      ${message.comments.length} <button data-message=${message.id} @click="${this.userWantToComment}">💬</button>

                                    <!-- DO WANT TO COMMENT-->

                                    `: html`
                                        ${message.comments.map(comment => html`
                                          <div>
                                            <img class="mini-profile" src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png">
                                            ${comment.username} - ${ this.getDate(comment.date) } :
                                          </div>
                                          <div>
                                            ${comment.content}
                                          </div>
                                          <div>
                                            <button data-message=${comment.id} @click="${this.like}">${this.user.data.likes.find(function(like) { return like == comment.id }) ? html`❤️️`: html`♡`}</button>
                                          </div>
                                          <hr>
                                        `)}

                                        <form .tweet="${message}" data-message=${message.id} @submit="${this.sendComment}">
                                          <input type="text" .value="${this.comment}" @input="${e => this.comment = e.target.value}">
                                          <button type="submit">Comment</button>
                                        </form>`}
                                      </div>
                                      <div>
                                      ${message.images.map(image => html`
                                        <img class="mini" src="${image}">`)}
                                      </div>


                                  <!-- RETWEET-->

                                  ` : html `
                                    <strong>${message.retweet_message.username} send : </strong> ${message.retweet_message.content} - <i>${this.getDate(message.retweet_message.date)}</i>
                                    ${
                                      this.user && message.retweet_message.user !== this.user.uid ? html`

                                        <button data-message=${message.retweet_message.id} @click="${this.like}">${this.user.data.likes.find(function(like) { return like == message.retweet_message.id }) ? html`❤️️`: html`♡`}</button><button data-message=${message.retweet_message.id} @click="${this.retweet}">🔄</button>
                                      ` : html``
                                    }
                                    <span>Commentaires : ${message.retweet_message.comments.length}</span>
                                    <form .tweet="${message.retweet_message}" data-message=${message.retweet_message.id} @submit="${this.sendComment}">

                                      <input type="text" .value="${this.comment}" @input="${e => this.comment = e.target.value}">
                                      <button type="submit">Comment</button>
                                    </form>
                                  `}
                                  </div>
                                </div>
                            </div>
                          </li>
                        `)}
                      </ul>
                    </div>

                    <!-- SUGGESTS -->

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


                </footer>` : html``}
              `
            }
        </div>
      </div>`
  }

/**
 * Fonction format date pour Twitter
 */

  getDate(timestamp) {
    const today = new Date().getTime()
    const fromtoday = today-timestamp

    let date = new Date(fromtoday)
    const daysfrom = date.getDay();
    const hours = date.getHours()-1;
    const minutes = date.getMinutes();
    const days = hours/24

    if(hours == 0) return `${minutes}m ago`
    else if(days < 1 && daysfrom == 0) return `${hours}h ago`
    else{
      date = new Date(timestamp)
      return date.mmdd();
    }
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

  // Fonction qui récupère une image lorsqu'on copie colle
  retrieveImageFromClipboardAsBlob(pasteEvent, callback){
    if(pasteEvent.clipboardData == false){
          if(typeof(callback) == "function"){
              callback(undefined);
          }
      };

      var items = pasteEvent.clipboardData.items;

      if(items == undefined){
          if(typeof(callback) == "function"){
              callback(undefined);
          }
      };

      for (var i = 0; i < items.length; i++) {
          // Skip content if not image
          if (items[i].type.indexOf("image") == -1) continue;
          // Retrieve image on clipboard as blob
          var blob = items[i].getAsFile();

          if(typeof(callback) == "function"){
              callback(blob);
          }
      }
  }
}

Date.prototype.mmdd = function() {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const mm = monthNames[this.getMonth()]; // getMonth() is zero-based
  const dd = this.getDate();

  return [
          mm,
          (dd > 9 ? '' : '0') + dd
         ].join(' ');
};

customElements.define('chat-app', ChatApp);

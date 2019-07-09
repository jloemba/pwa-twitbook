import { LitElement, html, css } from 'lit-element';

import firebase from 'firebase/app';
import 'firebase/auth';

class ChatLogin extends LitElement {

  constructor() {
    super();
    this.auth = {};
    this.email = '';
    this.password = '';
  }

  static get properties() {
    return {
      email: String,
      password: String
    }
  }

  static get styles() {
    return css`
     :host {
       display: block;
     }
     body {
      background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#8be8cf), color-stop(100%,#cdeb8b));


        font-family: "Helvetica Neue", Helvetica, Arial;
        padding-top: 20px;
    }

    .form-container {
        width: 280px;
        max-width: 280px;
        margin: 0 auto;
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

    #signup {
        padding: 0px 25px 25px;
        background: #fff;
        box-shadow:
            0px 0px 0px 5px rgba( 255,255,255,0.4 ),
            0px 4px 20px rgba( 0,0,0,0.33 );
        -moz-border-radius: 5px;
        -webkit-border-radius: 5px;
        border-radius: 5px;
        display: table;
        position: static;
    }

    #signup .header {
        margin-bottom: 20px;
    }

    #signup .header h3 {
        color: #333333;
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 5px;
    }

    #signup .header p {
        color: #8f8f8f;
        font-size: 14px;
        font-weight: 300;
    }

    #signup .sep {
        height: 1px;
        background: #e8e8e8;
        width: 300px;
        margin: 0px -25px;
    }

    #signup .inputs {
        margin-top: 25px;
    }

    #signup .inputs label {
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

    #signup .inputs input[type=email], input[type=password], input[type=text]{
        background: #f5f5f5;
        font-size: 0.8rem;
        -moz-border-radius: 3px;
        -webkit-border-radius: 3px;
        border-radius: 3px;
        border: none;
        padding: 13px 10px;
        width: 220px;
        margin-bottom: 20px;
        box-shadow: inset 0px 2px 3px rgba( 0,0,0,0.1 );
        clear: both;
    }

    #signup .inputs input[type=email]:focus, input[type=password]:focus {
        background: #fff;
        box-shadow: 0px 0px 0px 3px #fff38e, inset 0px 2px 3px rgba( 0,0,0,0.2 ), 0px 5px 5px rgba( 0,0,0,0.15 );
        outline: none;
    }

    #signup .inputs .checkboxy {
        display: block;
        position: static;
        height: 25px;
        margin-top: 10px;
        clear: both;
    }

    #signup .inputs input[type=checkbox] {
        float: left;
        margin-right: 10px;
        margin-top: 3px;
    }

    #signup .inputs label.terms {
        float: left;
        font-size: 14px;
        font-style: italic;
    }

    #signup .inputs #submit {
        width: 100%;
        margin-top: 20px;
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
        display: table;
        position: static;
        clear: both;
      }

      #signup .inputs #submit:hover {
          background: -moz-linear-gradient(
              top,
              #a4b0cb 0%,
              #b9c5dd);
          background: -webkit-gradient(
              linear, left top, left bottom,
              from(#a4b0cb),
              to(#b9c5dd));
      }

   `;
  }

  firstUpdated() {
    this.auth = firebase.auth();

    this.auth.onAuthStateChanged(user => {
      if (!user) {
        // handle logout
        localStorage.setItem('logged', false);
      } else {
         firebase.firestore().collection('users').doc(user.uid).get()
         .then((u) => {
            if (u.exists) {
              if(localStorage.getItem('logged') == 'false')
                window.location.reload();
              localStorage.setItem('logged', true);
              this.dispatchEvent(new CustomEvent('user-logged', { detail: { user : {...user, username : u.data().username} }}));
            }
           else alert('Utilisateur inconnu')
         })

      }
    });
  }

  handleForm(e) {
    e.preventDefault();

    if ((!this.email || !this.password)) {
      console.error('Email or Password missing');
    }

    this.auth.signInWithEmailAndPassword(this.email, this.password)
    .then(user => {
      console.info('User logged', user);
    });
  }

  render() {
    return html`
    <div class="form-container">
      <form id="signup" @submit="${this.handleForm}">
        <div class="header">
          <h3>Connexion</h3>
          <p>Email Password</p>
        </div>
        <div class="sep"></div>
        <div class="inputs">
          <input placeholder="Email" type="text" .value="${this.email}" @input="${e => this.email = e.target.value}">
          <input placeholder="Password" type="password" .value="${this.password}" @input="${e => this.password = e.target.value}">
          <button id="submit" type="submit">Login</button>
        </div>
      </form>
    </div>
    `
  }
}

customElements.define('chat-login', ChatLogin);

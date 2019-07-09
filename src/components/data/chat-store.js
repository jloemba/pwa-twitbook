import { LitElement, html, css } from 'lit-element';

import firebase from 'firebase/app';
import 'firebase/firestore';
import './chat-auth.js';

class ChatStore extends LitElement {

  constructor() {
    super();
    this.collection = '';
    this.data = [];
  }

  static get properties() {
    return {
      collection: { type: String },
      data: { type: Array }
    }
  }

  firstUpdated() {
    firebase.initializeApp(document.config);
    firebase.firestore().collection(this.collection).where("is_comment", "==", false).orderBy('date', 'asc').onSnapshot(ref => {

      ref.docChanges().forEach(change => {
        const { newIndex, oldIndex, doc, type } = change;

        if (type === 'added'){
          this.data = [{id: doc.id, ...doc.data()}, ...this.data];
          this.dispatchEvent(new CustomEvent('custom-child-changed', { detail: this.data }))
        } else if (type === 'removed') {
          this.data.splice(oldIndex, 1);
          this.dispatchEvent(new CustomEvent('custom-child-changed', { detail: this.data }))
        }
      });
    });
  }
}

customElements.define('chat-store', ChatStore);



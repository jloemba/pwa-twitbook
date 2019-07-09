import { LitElement, html } from 'lit-element';
import firebase from 'firebase/app';
import 'firebase/database';

class ChatData extends LitElement {
  constructor() {
    super();
    this.database = {};
    this.path = "";
    this.data = [];
    this._data = [];
  }

  static get properties() {
    return {
      database: Object,
      path: String,
      data: Array,
      _data: Array
    }
  }

  firstUpdated() {
    this.database = firebase.database();

    this.database.ref(this.path).on('value', data => this.pathChanged('value', data));
    this.database.ref(this.path).on('child_added', data => this.pathChanged('child_added', data));
    this.database.ref(this.path).on('child_changed', data => this.pathChanged('child_changed', data));
    this.database.ref(this.path).on('child_moved', data => this.pathChanged('child_moved', data));
    this.database.ref(this.path).on('child_removed', data => this.pathChanged('child_removed', data));
  }

  handleCustomChildChanged() {
    this._data = this.data.map(item => {
      item.val()
    });
    this.dispatchEvent(new CustomEvent('custom-child-changed', { detail: this._data }));
  }

  pathChanged(event, data) {
    switch (event) {
      case 'value':
        break;
      case 'child_added':
        this.data = [data, ...this.data];
        this.handleCustomChildChanged();
        break;
      case 'child_removed':
        this.data = this.data.filter(item => item.key !== data.key);
        this.handleCustomChildChanged();
      default:
        break;
    }
  }
}

customElements.define('chat-data', ChatData);

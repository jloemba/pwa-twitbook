import { LitElement, html, css } from 'lit-element';

class ChatHeader extends LitElement {

  static get styles() {
    return css`
     :host {
       display: block;
       background-color: #ffffff;
     }
     header {
       height: 48px;
       display: flex;
       justify-content: center;
       align-items: center;
       border-bottom: solid #eeeeee 1px;
     }
     img {
       height: 42px;
       width: 42px;
       display: block;
     }
   `;
  }

  render() {
    return html`
     <header><img src="./src/assets/images/1f680.png" alt="Logo">Firechat</header>
   `;
  }
}
customElements.define('chat-header', ChatHeader);
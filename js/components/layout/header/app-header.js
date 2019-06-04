import { LitElement, html, css } from 'lit-element';

class AppHeader extends LitElement{

   render() {
       return html`<p>Header</p>`;
   }

}

customElements.define('app-header',AppHeader);
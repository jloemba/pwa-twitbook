import { LitElement, html } from 'lit-element';
import './layout/header/app-header.js';


class Main extends LitElement{

    constructor(){
        super();
    }

    render(){
        return html`
            <h3>Haut de la page</h3>
            <app-header></app-header>
            
        `;
    }
}

customElements.define('app-twitbook',Main);
'use strict';
class MyElement extends HTMLElement {

	constructor() {
    // Always call super first in constructor
    super();
    console.log('CardComponent constructor')

    this.setupShadow();
	}
	
	connectedCallback() {
		console.log('connectedCallback');
	}

	disconnectedCallback() {
    console.log('connectedCallback');
  }

  adoptedCallback() {
    console.log('adoptedCallback');
	}
	
	attributeChangedCallback(name, oldValue, newValue) {
		console.log('attributeChangedCallback');
	}

	setupShadow() {
    this.shadow = this.attachShadow({ mode: 'open' });
    const template = document.getElementById('my-element-template');
    const templateContent = template.content;
    const shadowRoot = this.shadow.appendChild(templateContent.cloneNode(true));
  }

}

customElements.define('my-element', MyElement);
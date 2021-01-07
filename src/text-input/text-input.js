export class TextInput extends HTMLInputElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.validate();
    this.addEventListener("keyup", this.validate.bind(this));
  }

  disconnectedCallback() {
    this.removeEventListener("keyup", this.validate.bind(this));
  }

  validate() {
    if (!this.value) {
      this.style.border = "2px solid red";
    } else {
      this.style.border = "";
    }
  }
}

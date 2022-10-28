export default class Validation {
  #options;
  #reqular;
  #minLength;
  #maxLength;
  #text;
  #equalText;

  constructor(input, options) {
    this.input = input;
    this.#options = options;
    if (options.regex != null) this.#reqular = options.regex;
    if (options.minlength != null) this.#minLength = options.minlength;
    if (options.maxlength != null) this.#maxLength = options.maxLength;
    if (options.equal != null)  this.#equalText = options.equal
  }

  isMatch() {
    this.#text = this.input.value
    return this.#reqular.test(this.#text);
  }

  isEqual() {
    let firstVal = this.#equalText.value
    return firstVal ==  this.input.value
  }

  isEmpty() {
    this.#text = this.input.value
    if (this.#text.trim() != "") return true;
    else return false;
  }
}

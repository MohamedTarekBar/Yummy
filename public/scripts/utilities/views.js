/**
* @param classess [] , @param children [] ,  @param attrs [{}], @param id String
*/
export function createElement (
    tag,
    classess = null,
    id = null,
    children = null,
    attrs = null
  ) {
    let el = document.createElement (tag);
    if (classess != null) {
      for (let i = 0; i < classess.length; i++) {
        el.classList.add (classess[i]);
      }
    }
    if (id != null) {
        el.id = id
    }
    if (children != null) {
      for (let i = 0; i < children.length; i++) {
        const element = children[i];
        el.append (element);
      }
    }
    if (attrs != null) {
      for (let i = 0; i < attrs.length; i++) {
        var obj = new Map (Object.entries (attrs[i]));
        for (const attr of obj) {
          el.setAttribute (attr[0], attr[1]);
          break;
        }
      }
    }
    return el;
}

export function isEmpty(v) {
  if (v.trim() != '') {
    return false
  } else {
    return true
  }
}

export function cutHasslePara(text, length) {
  var n = ''
  if (text.length > length) {
    for (let i = 0; i < length; i++) {
      n += text[i]
    }
  } else {
    return text
  }
  n += '...'
  return n
}

export class Indicator {
  constructor() {
    this.indicator = this.getIndicator()
  }
  getIndicator() {
    let faSpinner = createElement("i", ["fa", "fa-spinner", "fa-spin", "fa-5x", "text-white", ]);
    let indicator = createElement("div",
      ["indicator",'loading-screen', "position-absolute", "justify-content-center", "align-items-center", ], "indicator",
      [faSpinner]);
    return indicator
  }
  show(parent) {
    $(parent).addClass('loading-screen-on')
    $(this.indicator).show()
  }
  hide(parent) {
    $(parent).removeClass('loading-screen-on')
    $(this.indicator).hide()
  }
}


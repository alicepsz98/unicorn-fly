function newElement (tagName, className) {
  const element = document.createElement(tagName);
  element.className = className;
  return element;
};

function Barrier (reverse = false) {
  this.element = newElement('div', 'barrier');
  const border = newElement('div', 'border');
  const body = newElement('div', 'body');
  this.element.appendChild(reverse ? body : border);
  this.element.appendChild(reverse ? border : body);
  this.setHeight = height => body.style.height = `${height}px`;
};

// const b = new Barrier(true);
// b.setHeight(200);
// document.querySelector('[wm-flappy]').appendChild(b.element)


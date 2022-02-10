function newElement(tagName, className){
  const element = document.createElement(tagName)
  element.className = className 
  return element
};

function Barrier (reverse = false) {
  this.element = newElement ('div', 'barrier')
  const border = newElement ('div', 'border')
  const body = newElement ('div', 'body')
  this.element.appendChild(reverse ? body : border)
  this.element.appendChild(reverse ? border : body)
  this.setHeight = height => body.style.height = `${height}px`
};

function coupleBarriers(height, opening, x) {
  this.element = newElement('div', 'couple-barriers')
  this.superior = new Barrier(true)
  this.inferior = new Barrier (false)
  this.element.appendChild(this.superior.element)
  this.element.appendChild(this.inferior.element)
  this.sortOpening = () => {
      const superiorHeight = Math.random() * (height - opening)
      const inferiorHeight = height - opening - superiorHeight
      this.superior.setHeight(superiorHeight)
      this.inferior.setHeight(inferiorHeight)
  }
  this.getX = () => parseInt(this.element.style.left.split('px')[0])
  this.setX = x => this.element.style.left = `${x}px`
  this.getWidth = () => this.element.clientWidth 
  this.sortOpening()
  this.setX(x)
};

function Barriers ( height, width, opening, space, notifyDot){
  this.couples = [
      new coupleBarriers(height, opening, width),
      new coupleBarriers(height, opening, width + space),
      new coupleBarriers(height, opening, width + space * 2),
      new coupleBarriers(height, opening, width + space * 3),
  ]
  const displacement = 3
  this.animate = () => {
      this.couples.forEach(couple => {
          couple.setX(couple.getX() - displacement)
          if (couple.getX() < -couple.getWidth()) {
               couple.setX(couple.getX() + space * this.couples.length)
               couple.sortOpening()
          }
          const middle = width / 2
          const crossedMiddle = couple.getX() + displacement >= middle
              && couple.getX() < middle
          if (crossedMiddle) notifyDot()
      })
  } 
};

function Bird(gameHeight){
  let flying = false
  this.element = newElement ('img', 'bird')
  this.element.src = 'assets/img/bird.png'
  this.getY = () => parseInt(this.element.style.bottom.split('px')[0])
  this.setY = y => this.element.style.bottom = `${y}px`
  window.ontouchstart = e => flying = true
  window.ontouchend = e => flying = false
  this.animate = () => {
      const newY = this.getY() + (flying ? 4 : -3.5)
      const heightMaxima = gameHeight - this.element.clientHeight
      if(newY <= 0) {
          this.setY(0)
      } else if (newY >= heightMaxima) {
          this.setY(heightMaxima)
      } else {
          this.setY(newY)
      }
  }
  this.setY(gameHeight / 2)
};

function Progress() {
  this.element = newElement('span', 'progress')
  this.updateDots = dots => {
      this.element.innerHTML = dots
  }
  this.updateDots(0)
};

function overlapping(elementA, elementB) {
  const a = elementA.getBoundingClientRect()
  const b = elementB.getBoundingClientRect()
  const horizontal = a.left + a.width >= b.left
      && b.left + b.width >= a.left
  const vertical = a.top + a.height >= b.top
      && b.top + b.height >= a.top
  return horizontal && vertical
};

function collided(bird, barriers){
  let collided = false
  barriers.couples.forEach(coupleBarriers => {
      if (!collided) {
          const superior = coupleBarriers.superior.element
          const inferior = coupleBarriers.inferior.element
          collided = overlapping(bird.element, superior)
          || overlapping(bird.element, inferior)
      }
  })
  return collided
};

function FlappyBird(){
  let dots = 0
  const gameArea = document.querySelector('[wm-flappy]')
  const height = gameArea.clientHeight
  const width = gameArea.clientWidth
  const progress = new Progress()
  const barriers = new Barriers(height, width, 180, 380, 
      () => progress.updateDots(++dots))
  const bird = new Bird(height)
  gameArea.appendChild(progress.element)
  gameArea.appendChild(bird.element)
  barriers.couples.forEach(couple => gameArea.appendChild(couple.element))
  this.start = () => {
      const temporizador = setInterval(() => {
          barriers.animate()
          bird.animate()
          if (collided(bird, barriers)) {
            clearInterval(temporizador)
            alert(`Parabéns, você perdeu!
Jogar novamente?`)
            window.location.reload();
          }
      }, 15)
  }
};

new FlappyBird().start();
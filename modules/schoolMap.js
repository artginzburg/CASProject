import { floorsQuantity, floorSelector } from './constants.js';

const roomDisplay = document.getElementById('roomDisplay');
const display = document.getElementById('display');
const displayOpenedClass = 'opened';

const addScript = (src, onload = '') =>
  fetch(src)
    .then(res => res.ok
      ? res.text()
      : Promise.reject(`Error ${res.status} loading ${src}`)
    )
    .then(result => {
      const el = document.createElement('div');
      el.innerHTML = result.trim();
      return el.firstChild;
    })
    .then(onload)
    .catch(console.error)
;

export const schoolMap = {
  floor: {
    select(e = '', exact) {
      schoolMap.floor.deSelect();

      const theFloor = (e == '' || exact)
        ? document.getElementById(exact)
        : e.target.farthestViewportElement ? e.target.farthestViewportElement : e.target;

      if (!theFloor)
        return;

      let marginBefore;
      let marginAfter;

      switch (theFloor.id) {
        case '4':
          marginBefore = '0'
          marginAfter = '415px'
          break;
        case '3':
          marginBefore = '270px'
          marginAfter = '580px'
          break;
        case '2':
          marginBefore = '410px'
          marginAfter = '560px'
          break;
        case '1':
          marginBefore = '490px'
          marginAfter = '0'
          break;
      }

      theFloor.style.transform = 'none';
      theFloor.style.top = marginBefore;

      let theEl = theFloor.nextElementSibling;

      while (theEl) {
        theEl.style.top = marginAfter;
        theEl = theEl.nextElementSibling;
      }

      theFloor.classList.add('selected')
    },
    deSelect() {
      for (const el of document.querySelectorAll(floorSelector)) {
        el.style.transform = '';
        el.style.top = '';
        el.classList.remove('selected');
      }
    }
  },
  display: {
    open(e) {
      const id = e.target.id;
      const theLevel = e.target.farthestViewportElement.id;

      const levelStructure = rooms.levels[theLevel];
      if (!levelStructure)
        return;

      const str = levelStructure[id];
      if (!str)
        return;

      const oldName = (typeof str.name === 'undefined') ? '' : str.name;
      const rdbleName = e.target.parentNode.getElementsByTagName('text')[0].getElementsByTagName('tspan')[0].innerHTML;

      roomDisplay.innerHTML = '';

      if (id)
        roomDisplay.innerHTML += `<h2 style="border: none; border-bottom: 2px solid ${typeof str.ladder !== 'undefined' ? str.ladder + '; padding-bottom: .4em' : ''}">${oldName} <sup>${rdbleName}</sup></h2>`;
      if (str.board) {
        roomDisplay.innerHTML +=
          '<p>Whiteboard: ' +
          ((str.board === 'smart') ?
            'Interactive</p>' :
            'Simple</p>');
      }
      if (str.projector)
        roomDisplay.innerHTML += `<p>Has a projector</p>`;
      if (str.appletv)
        roomDisplay.innerHTML += `<p>Apple TV: name</p>`;
      if (str.seats)
        roomDisplay.innerHTML += `<p>${str.seats} places</p>`;
      if (str.additionaly)
        roomDisplay.innerHTML += `<p>Additional info: ${str.additionaly}</p>`;

      roomDisplay.classList.add(displayOpenedClass);
    },
    close() {
      roomDisplay.classList.remove(displayOpenedClass);
    }
  },
  loadAll: async function() {
    for (let level = floorsQuantity; level >= 1; level--) {
      await addScript(`levels/${level}.svg`, theSvg => {
        document.body.appendChild(theSvg)

        const theLevelTitle = document.createElement('p');
        theLevelTitle.className = 'levelTitle'
        theLevelTitle.innerText = level;
        document.body.appendChild(theLevelTitle)

        theSvg.style.opacity = '0'
        theSvg.style.transform = 'scale(.1)'
        theSvg.style.transitionDuration = '1s'
        theSvg.classList.add('initial')
        setTimeout(() => {
          theSvg.style.opacity = '1'
          theSvg.style.transform = 'scale(1)'
          theSvg.style.transitionDuration = '1s'
        }, 200);
        setTimeout(() => {
          theSvg.style.transform = 'perspective(100em) rotateX(70deg) rotateZ(-30deg)';
        }, 800);
        setTimeout(() => {
          theSvg.classList.remove('initial')
          theSvg.style.transform = ''
          theSvg.style.transitionDuration = ''
          theSvg.style.opacity = ''
        }, 1350);

        document.getElementsByTagName('svg')[floorsQuantity - level].id = level;

        theSvg.onclick = schoolMap.floor.select;

        theSvg.onmouseenter = function() {
          if (!rooms.levels[level])
            return;

          for (const el of display.children)
            el.innerHTML = '';

          display.classList.add(displayOpenedClass);

          for (const key in rooms.levels[level]) {
            const theP = document.createElement('p');
            theP.textContent = key;
            display.children.item(0).appendChild(theP);

            const name = rooms.levels[level][key].name;

            const theName = document.createElement('p');
            theName.innerHTML = name ?? '<br>';

            display.children.item(1).appendChild(theName);
          }
        }

        theSvg.onmouseleave = function() {
          display.classList.remove(displayOpenedClass);
        }

        classes = document.getElementsByTagName('svg').item(floorsQuantity - level).getElementById('classes');
        const rects = classes.getElementsByTagName('g');
        for (const el of rects) {
          el.children.item(0).setAttribute('fill', 'rgba(25, 25, 25)');
          el.children.item(0).setAttribute('opacity', 0.5);

          if (!el.id.includes('WC') && !el.id.includes('room')) {
            el.setAttribute('onclick', '');
          }

          el.onclick = schoolMap.display.open;
        }
      })
    }
  }
}
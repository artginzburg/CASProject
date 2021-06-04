import { schoolMap } from './schoolMap.js';

document.onkeydown = e => {
  if (e.code === 'Escape') {
    if (document.getElementById('roomDisplay').classList.contains('opened'))
      schoolMap.display.close();
    else
      schoolMap.floor.deSelect();
  }

  if (e.code.includes('Digit'))
    schoolMap.floor.select('', e.code.split('Digit')[1]);

  if (e.code.includes('Arrow')) {
    let currentId = document.getElementsByClassName('selected').length == 0 ? 0 : document.getElementsByClassName('selected')[0].id;

    const way = e.code.split('Arrow')[1];

    if ((way === 'Down') || (way === 'Right')) {
      if (currentId === 0)
        currentId = 5;
      schoolMap.floor.select('', currentId - 1);
    } else if ((way === 'Up') || (way === 'Left'))
      schoolMap.floor.select('', Number(currentId) + 1);
  }
}

document.onclick = e => {
  const parents = [];
  let element = e.target;
  while (element.parentElement) {
    parents.push(element);
    element = element.parentElement;
  }
  const mouseIsOnSvg = parents.some(el => el.tagName === 'svg');

  if (!mouseIsOnSvg)
    schoolMap.floor.deSelect();
}

document.addEventListener('DOMContentLoaded', schoolMap.loadAll);

fetch('structure.json')
    .then(res => res.json())
    .then(result =>
        window.rooms = result
    );
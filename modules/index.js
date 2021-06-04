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
    const allSelected = document.querySelector('.selected');
    let currentId = allSelected
      ? allSelected.id
      : 0;

    const way = e.code.split('Arrow')[1];

    if ((way === 'Down') || (way === 'Right')) {
      if (!currentId)
        currentId = 5;
      schoolMap.floor.select('', currentId - 1);
    } else if ((way === 'Up') || (way === 'Left'))
      schoolMap.floor.select('', Number(currentId) + 1);
  }
}

document.onclick = e => {
  const mouseIsOnSvg = e.target.closest('.svgFloor');

  if (!mouseIsOnSvg)
    schoolMap.floor.deSelect();
}

document.addEventListener('DOMContentLoaded', schoolMap.loadAll);

fetch('structure.json')
    .then(res => res.json())
    .then(result =>
        window.rooms = result
    );
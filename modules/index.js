import { schoolMap } from './schoolMap.js';
import { floorsQuantity, floorSelector } from './constants.js';

document.addEventListener('DOMContentLoaded', schoolMap.loadAll);

document.body.onkeydown = e => {
  if (e.code === 'Escape')
    return document.getElementById('roomDisplay').classList.contains('opened')
      ? schoolMap.display.close()
      : schoolMap.floor.deSelect();

  if (e.code.includes('Digit'))
    return schoolMap.floor.select('', e.code.split('Digit')[1]);

  if (e.code.includes('Arrow')) {
    const allSelected = document.querySelector('.selected');
    let currentId = allSelected
      ? allSelected.id
      : 0;

    const way = e.code.split('Arrow')[1];

    if ((way === 'Down') || (way === 'Right')) {
      if (!currentId)
        currentId = floorsQuantity + 1;
      schoolMap.floor.select('', currentId - 1);
    } else if ((way === 'Up') || (way === 'Left'))
      schoolMap.floor.select('', Number(currentId) + 1);
  }
}

document.body.onclick = e =>
  !e.target.closest(floorSelector)
    && schoolMap.floor.deSelect();

fetch('structure.json')
    .then(res => res.json())
    .then(result =>
        window.rooms = result
    );
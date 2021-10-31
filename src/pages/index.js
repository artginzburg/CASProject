import { schoolMap } from '../utils/schoolMap.js';
import {
  floorsQuantity,
  floorSelector,
  displayOpenedClass,
  selectedSelector,
} from '../utils/constants.js';
import { roomDisplay } from '../utils/elements.js';

const keyCodes = {
  digit: 'Digit',
  arrow: 'Arrow',
  escape: 'Escape',
};

const structurePath = './src/utils/structure.json';

document.addEventListener('DOMContentLoaded', schoolMap.loadAll);

document.body.onkeydown = (e) => {
  if (e.code.includes(keyCodes.escape)) {
    roomDisplay.classList.contains(displayOpenedClass)
      ? schoolMap.display.close()
      : schoolMap.floor.deSelect();
    return;
  }

  if (e.code.includes(keyCodes.digit)) {
    schoolMap.floor.select('', e.code.split(keyCodes.digit)[1]);
    return;
  }

  if (e.code.includes(keyCodes.arrow)) {
    const allSelected = document.querySelector(selectedSelector);
    const currentId = allSelected ? Number(allSelected.id) : 0;

    const way = e.code.split(keyCodes.arrow)[1];

    if (way === 'Down' || way === 'Right') {
      schoolMap.floor.select('', (currentId || floorsQuantity + 1) - 1);
      return;
    }
    if (way === 'Up' || way === 'Left') {
      schoolMap.floor.select('', currentId + 1);
    }
  }
};

document.body.onclick = (e) => {
  if (!e.target.closest(floorSelector)) {
    schoolMap.floor.deSelect();
  }
};

fetch(structurePath)
  .then((res) => res.json())
  .then((result) => (window.rooms = result));

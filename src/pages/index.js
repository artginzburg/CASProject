import { schoolMap } from '../utils/schoolMap.js';
import {
  floorsQuantity,
  floorSelector,
  displayOpenedClass,
  selectedSelector,
} from '../utils/constants.js';
import { roomDisplay } from '../utils/elements.js';

const digitString = 'Digit';
const arrowString = 'Arrow';
const escapeString = 'Escape';

const structurePath = './src/utils/structure.json';

document.addEventListener('DOMContentLoaded', schoolMap.loadAll);

document.body.onkeydown = (e) => {
  if (e.code === escapeString)
    return roomDisplay.classList.contains(displayOpenedClass)
      ? schoolMap.display.close()
      : schoolMap.floor.deSelect();

  if (e.code.includes(digitString)) return schoolMap.floor.select('', e.code.split(digitString)[1]);

  if (e.code.includes(arrowString)) {
    const allSelected = document.querySelector(selectedSelector);
    let currentId = allSelected ? allSelected.id : 0;

    const way = e.code.split(arrowString)[1];

    if (way === 'Down' || way === 'Right') {
      if (!currentId) currentId = floorsQuantity + 1;
      schoolMap.floor.select('', currentId - 1);
    } else if (way === 'Up' || way === 'Left') schoolMap.floor.select('', Number(currentId) + 1);
  }
};

document.body.onclick = (e) => e.target.closest(floorSelector) ?? schoolMap.floor.deSelect();

fetch(structurePath)
  .then((res) => res.json())
  .then((result) => (window.rooms = result));

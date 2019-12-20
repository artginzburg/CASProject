function rectClick(e) {
    id = e.target.id;

    let results = {};
    for (key in rooms.levels["3"]) {
        if (key === id) {
            // results.push({[key]: rooms[key]});
            results[key] = rooms.levels["3"][key]
        }
    }
    console.log(results);
    str = results[id].ladder;
    document.querySelector('#leftBlock').innerHTML += `${str}<br>`;
}

document.addEventListener('DOMContentLoaded', function() {
    classes = document.getElementsByTagName('svg').item(0).getElementById('classes');
    rects = classes.getElementsByTagName('g');
    for (el of rects) {
        console.log(el);
        el.addEventListener('click', e => rectClick(e));
    }
})
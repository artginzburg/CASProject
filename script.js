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
    str = results[id];
    document.querySelector('#display').innerHTML = '';
    if (id)
        document.querySelector('#display').innerHTML += `<h1>${id}</h1><br>`;
    if (str.ladder)
        document.querySelector('#display').innerHTML += `<p>located near the <b>${str.ladder}</b> ladder</p><br>`;
    if (str.name)
        document.querySelector('#display').innerHTML += `<p>previously named <b>${str.name}</b></p><br>`;
}

document.addEventListener('DOMContentLoaded', function() {
    classes = document.getElementsByTagName('svg').item(0).getElementById('classes');
    rects = classes.getElementsByTagName('g');
    for (el of rects) {
        console.log(el);
        el.onclick = e => rectClick(e);
        el.addEventListener('mouseenter', e => {
            e.target.getElementsByTagName('rect')[0].setAttribute('opacity', 0.2)
        })
        el.addEventListener('mouseleave', e => {
            e.target.getElementsByTagName('rect')[0].setAttribute('opacity', 0.1)
        })
    }
})
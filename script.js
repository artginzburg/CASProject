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
    rdbleName = e.target.parentNode.getElementsByTagName('text')[0].getElementsByTagName('tspan')[0].innerHTML;
    document.querySelector('#display').classList.add('hover');
    document.querySelector('#display').style.display = 'block';

    document.querySelector('#display').innerHTML = '';
    if (id)
        document.querySelector('#display').innerHTML += `<h1>${rdbleName}</h1><br>`;
    if (str.ladder)
        document.querySelector('#display').innerHTML += `<p>located near the <b>${str.ladder}</b> ladder</p><br>`;
    if (str.name)
        document.querySelector('#display').innerHTML += `<p>previously named <b>${str.name}</b></p><br>`;
}

function closeDisplay() {
    document.querySelector('#display').style.display = 'none';
}
document.onkeyup = e => {
    if (e.code === 'Escape')
        closeDisplay()
};

document.addEventListener('DOMContentLoaded', function () {
    classes = document.getElementsByTagName('svg').item(0).getElementById('classes');
    rects = classes.getElementsByTagName('g');
    for (el of rects) {
        console.log(el);
        el.getElementsByTagName('rect')[0].setAttribute('fill', 'rgba(25, 25, 25)');
        el.getElementsByTagName('rect')[0].setAttribute('opacity', 0.5);

        if (!el.id.includes('WC'))
            el.onclick = e => rectClick(e);

        el.addEventListener('mouseenter', e => {
            e.target.getElementsByTagName('rect')[0].setAttribute('opacity', 0.1);
            e.target.getElementsByTagName('rect')[0].setAttribute('fill', 'white');

            if (document.getElementById('display').getElementsByTagName('h1')[0].innerHTML === e.target.getElementsByTagName('text')[0].getElementsByTagName('tspan')[0].innerHTML)
                document.getElementById('display').classList.add('hover');

        })

        el.addEventListener('mouseleave', e => {
            e.target.getElementsByTagName('rect')[0].setAttribute('opacity', 0.5);
            e.target.getElementsByTagName('rect')[0].setAttribute('fill', 'rgba(25, 25, 25)');

            if (document.getElementById('display').getElementsByTagName('h1')[0].innerHTML === e.target.getElementsByTagName('text')[0].getElementsByTagName('tspan')[0].innerHTML)
                document.getElementById('display').classList.remove('hover');
        })
    }
})
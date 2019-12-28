settings = {
    maxLevel: 4
}

if (!localStorage.level || localStorage.level > settings.maxLevel)
    localStorage.level = 3

function loadFloor(num) {
    if ((localStorage.level != num || document.getElementsByClassName('svgFloor').length == 0) && num <= settings.maxLevel) {
        localStorage.level = num

        addScript(`levels/${num}.js`, function() {
            for (el of document.getElementsByClassName('svgFloor'))
                el.parentNode.removeChild(el)

            document.body.appendChild(htmlToElement(window['floor' + localStorage.level]))

            classes = document.getElementsByTagName('svg').item(0).getElementById('classes');
            rects = classes.getElementsByTagName('g');
            for (el of rects) {
                console.log(el);
                el.children.item(0).setAttribute('fill', 'rgba(25, 25, 25)');
                el.children.item(0).setAttribute('opacity', 0.5);

                if (!el.id.includes('WC') && !el.id.includes('room')) {
                    el.setAttribute('onclick', '');
                    el.onclick = e => rectClick(e);
                }

                el.addEventListener('mouseenter', e => {
                    e.target.children.item(0).setAttribute('opacity', 0.1);
                    e.target.children.item(0).setAttribute('fill', 'white');

                    if (document.getElementById('display').getElementsByTagName('h1')[0].innerHTML === e.target.getElementsByTagName('text')[0].getElementsByTagName('tspan')[0].innerHTML)
                        document.getElementById('display').classList.add('hover');

                })

                el.addEventListener('mouseleave', e => {
                    e.target.children.item(0).setAttribute('opacity', 0.5);
                    e.target.children.item(0).setAttribute('fill', 'rgba(25, 25, 25)');

                    if (document.getElementById('display').getElementsByTagName('h1')[0].innerHTML === e.target.getElementsByTagName('text')[0].getElementsByTagName('tspan')[0].innerHTML)
                        document.getElementById('display').classList.remove('hover');
                })
            }
        })
    }
}

function htmlToElement(html) {
    var template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstChild;
}

function rectClick(e) {
    id = e.target.id;

    let results = {};

    for (key in rooms.levels[localStorage.level])
        if (key === id)
            results[key] = rooms.levels[localStorage.level][key]

    console.log(results);
    str = results[id];
    rdbleName = e.target.parentNode.getElementsByTagName('text')[0].getElementsByTagName('tspan')[0].innerHTML;
    document.querySelector('#display').classList.add('hover');
    document.querySelector('#display').style.display = 'block';

    document.querySelector('#display').innerHTML = '';

    if (id)
        document.querySelector('#display').innerHTML += `<h1>${rdbleName}</h1>`;
    if (str.ladder)
        document.querySelector('#display').innerHTML += `<p>located near the <b>${str.ladder}</b> ladder</p>`;
    if (str.name)
        document.querySelector('#display').innerHTML += `<p>previously named <b>${str.name}</b></p>`;
}

// function rotateMap(deg = -90) {
//     document.getElementsByClassName('svgFloor')[0].style.transform = `rotate(${deg}deg)`
// }

function closeDisplay() {
    document.querySelector('#display').style.display = 'none';
}
document.onkeydown = e => {
    // console.log(e);

    if (e.code === 'Escape')
        closeDisplay()

    if (e.altKey) {
        if (e.code.includes('Digit'))
            loadFloor(e.code.split('Digit')[1])
    }
};

document.addEventListener('DOMContentLoaded', function() {
    loadFloor(localStorage.level)
})

function addScript(src, onload = '') {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.onload = onload;
    script.src = src;
    if (findScript(src))
        document.head.removeChild(findScript(src))
    head.appendChild(script);
}

function findScript(path) {
    for (script of document.getElementsByTagName('script'))
        if (script.getAttribute('src') === path)
            return script
}
settings = {
    maxLevel: 4
}
oldLevel = 0;

function loadFloor(num) {
    if (typeof document.getElementsByTagName('svg')[0] !== 'undefined' && num === document.getElementsByTagName('svg')[0].id)
        return // prevent multiloads

    if (((localStorage.level != num || (localStorage.level === num || document.getElementsByTagName('svg').length === 0 && num != document.getElementsByTagName('svg')[0].id)) || document.getElementsByClassName('svgFloor').length == 0) && num <= settings.maxLevel) {
        localStorage.level = num

        addScript(`levels/${num}.svg`, function(theSvg) {
            animationName = 'level';
            if (typeof document.getElementsByTagName('svg')[0] !== 'undefined') {
                timeoutAnimation = 450
                for (el of document.getElementsByClassName('svgFloor')) {
                    oldLevel = el.id
                    el.classList.remove(animationName + 'InDown');
                    el.classList.remove(animationName + 'InUp');
                    if (num > oldLevel) {
                        el.classList.add(animationName + 'OutDown');
                    } else if (num === oldLevel) {
                        el.classList.add('bounceOut');
                        timeoutAnimation = 700
                    } else {
                        el.classList.add(animationName + 'OutUp');
                    }
                    setTimeout(() => {
                        el.parentNode.removeChild(el)
                    }, timeoutAnimation);
                }
            } else {
                timeoutAnimation = 0
            }

            setTimeout(() => {
                document.body.appendChild(theSvg)
                theSvg.classList.add('animated');
                theSvg.classList.add('medDur');
                if (typeof document.getElementsByTagName('svg')[0] !== 'undefined') {
                    if (num > oldLevel) {
                        theSvg.classList.add(animationName + 'InDown');
                    } else if (num === oldLevel) {
                        theSvg.classList.add('bounceIn');
                    } else {
                        theSvg.classList.add(animationName + 'InUp')
                    }
                }
    
                document.getElementsByTagName('svg')[0].id = num
    
                classes = document.getElementsByTagName('svg').item(0).getElementById('classes');
                rects = classes.getElementsByTagName('g');
                for (el of rects) {
                    console.log(el);
                    el.children.item(0).setAttribute('fill', 'rgba(25, 25, 25)');
                    el.children.item(0).setAttribute('opacity', 0.5);
    
                    if (!el.id.includes('WC') && !el.id.includes('room')) {
                        el.setAttribute('onclick', '');
                        el.onclick = rectClick;
                    }
    
                    el.addEventListener('mouseenter', e => {
                        if (typeof e.target.getElementsByTagName('text')[0] === 'undefined')
                            return

                        e.target.children.item(0).setAttribute('opacity', 0.1);
                        e.target.children.item(0).setAttribute('fill', 'white');

                        if (typeof document.getElementById('display').getElementsByTagName('h1')[0] === 'undefined')
                            return
    
                        if (document.getElementById('display').getElementsByTagName('h1')[0].innerHTML === e.target.getElementsByTagName('text')[0].getElementsByTagName('tspan')[0].innerHTML)
                            document.getElementById('display').classList.add('hover');
    
                    })
    
                    el.addEventListener('mouseleave', e => {
                        if (typeof e.target.getElementsByTagName('text')[0] === 'undefined')
                            return

                        e.target.children.item(0).setAttribute('opacity', 0.5);
                        e.target.children.item(0).setAttribute('fill', 'rgba(25, 25, 25)');

                        if (typeof document.getElementById('display').getElementsByTagName('h1')[0] === 'undefined')
                            return
    
                        if (document.getElementById('display').getElementsByTagName('h1')[0].innerHTML === e.target.getElementsByTagName('text')[0].getElementsByTagName('tspan')[0].innerHTML)
                            document.getElementById('display').classList.remove('hover');
                    })
                }
            }, timeoutAnimation);
            
        })

        for (elem of document.getElementsByTagName('nav')[0].children) {
            elem.classList.remove('selected');

            if (elem.innerHTML === localStorage.level)
                elem.classList.add('selected');
        }
    }
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

    document.querySelector('#display').classList.remove('zoomOutDown');
    document.querySelector('#display').classList.add('zoomInDown');

    document.querySelector('#display').style.display = 'block';

    document.querySelector('#display').innerHTML = '';

    if (id)
        document.querySelector('#display').innerHTML += `<h1>${rdbleName}</h1>`;
    if (typeof str.ladder !== 'undefined')
        document.querySelector('#display').innerHTML += `<p>located near the <b>${str.ladder}</b> ladder</p>`;
    if (typeof str.name  !== 'undefined')
        document.querySelector('#display').innerHTML += `<p>previously named <b>${str.name}</b></p>`;
}

function rotateMap(deg = -90) {
    document.getElementsByClassName('svgFloor')[0].style.transform = `rotate(${deg}deg)`
}

function closeDisplay() {
    document.querySelector('#display').classList.remove('zoomInDown');
    document.querySelector('#display').classList.add('zoomOutDown');

    setTimeout(() => {
        document.querySelector('#display').style.display = 'none';
    }, 800);
}

function addScript(src, onload = '') {
    xhr = new XMLHttpRequest();
    xhr.open('GET', src, false);
    xhr.overrideMimeType('image/svg+xml');
    xhr.send('');
    if (xhr.responseXML) 
        onload(xhr.responseXML.documentElement);
    else {
        text = 'Error loading ' + src
        console.log(text);
        alert(text);
    }
}
function loadJSON(filename, callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType('application/json');
    xobj.open('GET', filename, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == '200') {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

window.onstorage = e => {
    if (e.key === 'level')
        loadFloor(e.newValue);
}

document.onkeydown = e => {
    // console.log(e);

    if (e.code === 'Escape')
        closeDisplay()

    if (e.altKey) {
        if (e.code.includes('Digit'))
            loadFloor(e.code.split('Digit')[1])
    }
}

if (!localStorage.level || localStorage.level > settings.maxLevel)
    localStorage.level = 3

document.addEventListener('DOMContentLoaded', function() {
    loadFloor(localStorage.level);
    
    for (el of document.getElementsByTagName('nav')[0].children)
        el.onclick = e => loadFloor(e.toElement.innerHTML)
})

loadJSON('structure.json', e => {
    window.rooms = JSON.parse(e)
    console.log(e)
})
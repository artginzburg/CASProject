// settings = {
//     maxLevel: 4,
//     temp: {
//         oldLevel: 0
//     }
// }

schoolMap = {
    floor: {
        select(e) {
            console.log(e);
            schoolMap.floor.deSelect();

            if (e.target.farthestViewportElement)
                theFloor = e.target.farthestViewportElement
            else
                theFloor = e.target

            switch (theFloor.id) {
                case '4':
                    marginBefore = '0'
                    marginAfter = '400px'
                    break;
                case '3':
                    marginBefore = '290px'
                    marginAfter = '580px'
                    break;
                case '2':
                    marginBefore = '400px'
                    marginAfter = '560px'
                    break;
                case '1':
                    marginBefore = '490px'
                    marginAfter = '0'
                    break;
            }

            theFloor.style.transform = 'none';
            theFloor.style.top = marginBefore;

            theEl = theFloor.nextElementSibling;

            while (theEl) {
                theEl.style.top = marginAfter;
                theEl = theEl.nextElementSibling;
            }

        },
        deSelect() {
            for (el of document.getElementsByClassName('svgFloor')) {
                el.style.transform = '';
                el.style.top = '';
            }
        }
    },
    display: {
        open(e) {
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
        },
        close() {
            document.querySelector('#display').classList.remove('zoomInDown');
            document.querySelector('#display').classList.add('zoomOutDown');
        
            setTimeout(() => {
                document.querySelector('#display').style.display = 'none';
            }, 800);
        }
    },
    load: level => {
        if (typeof document.getElementsByTagName('svg')[0] !== 'undefined' && level === document.getElementsByTagName('svg')[0].id)
            return // prevent multiloads

        if (((localStorage.level != level || (localStorage.level === level || document.getElementsByTagName('svg').length === 0 && level != document.getElementsByTagName('svg')[0].id)) || document.getElementsByClassName('svgFloor').length == 0) && level <= settings.maxLevel) {
            localStorage.level = level

            addScript(`levels/${level}.svg`, function(theSvg) {
                // animationName = 'level';
                if (typeof document.getElementsByTagName('svg')[0] !== 'undefined') {
                    timeoutAnimation = 450
                    for (el of document.getElementsByClassName('svgFloor')) {
                        settings.temp.oldLevel = el.id
                        // el.classList.remove(animationName + 'InDown');
                        // el.classList.remove(animationName + 'InUp');
                        // if (level > settings.temp.oldLevel) {
                        //     el.classList.add(animationName + 'OutDown');
                        // } else if (level === settings.temp.oldLevel) {
                        //     el.classList.add('bounceOut');
                        //     timeoutAnimation = 700
                        // } else {
                        //     el.classList.add(animationName + 'OutUp');
                        // }
                        setTimeout(() => {
                            el.parentNode.removeChild(el)
                        }, timeoutAnimation);
                    }
                } else {
                    timeoutAnimation = 0
                }

                setTimeout(() => {
                    document.body.appendChild(theSvg)
                    // theSvg.classList.add('animated');
                    // theSvg.classList.add('medDur');
                    // if (typeof document.getElementsByTagName('svg')[0] !== 'undefined') {
                    //     if (level > settings.temp.oldLevel) {
                    //         theSvg.classList.add(animationName + 'InDown');
                    //     } else if (level === settings.temp.oldLevel) {
                    //         theSvg.classList.add('bounceIn');
                    //     } else {
                    //         theSvg.classList.add(animationName + 'InUp')
                    //     }
                    // }
        
                    document.getElementsByTagName('svg')[0].id = level
        
                    classes = document.getElementsByTagName('svg').item(0).getElementById('classes');
                    rects = classes.getElementsByTagName('g');
                    for (el of rects) {
                        console.log(el);
                        el.children.item(0).setAttribute('fill', 'rgba(25, 25, 25)');
                        el.children.item(0).setAttribute('opacity', 0.5);
        
                        if (!el.id.includes('WC') && !el.id.includes('room')) {
                            el.setAttribute('onclick', '');
                            el.onclick = schoolMap.display.open;
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
    },
    loadAll: function() {
        for (let level = 4; level >= 1; level--) {
            addScript(`levels/${level}.svg`, theSvg => {
                document.body.appendChild(theSvg)

                document.getElementsByTagName('svg')[4 - level].id = level

                theSvg.onclick = schoolMap.floor.select
    
                classes = document.getElementsByTagName('svg').item(4 - level).getElementById('classes');
                rects = classes.getElementsByTagName('g');
                for (el of rects) {
                    console.log(el);
                    el.children.item(0).setAttribute('fill', 'rgba(25, 25, 25)');
                    el.children.item(0).setAttribute('opacity', 0.5);
    
                    if (!el.id.includes('WC') && !el.id.includes('room')) {
                        el.setAttribute('onclick', '');
                        el.onclick = schoolMap.display.open;
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
            })
        }
    },
    rotate: (deg = -90) => {
        document.getElementsByClassName('svgFloor')[0].style.transform = `rotate(${deg}deg)`
    }
}

function addScript(src, onload = '') {
    xhr = new XMLHttpRequest();
    xhr.open('GET', src, false);
    xhr.overrideMimeType('image/svg+xml'); // not needed if your server delivers SVG with correct MIME type (just to be on the safe side)
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
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == '200') {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}


// window.onstorage = e => {
//     if (e.key === 'level')
//         schoolMap.load(e.newValue);
// }

document.onkeydown = e => {
    // console.log(e);

    if (e.code === 'Escape') {
        // schoolMap.display.close()
        schoolMap.floor.deSelect()
    }

    // if (e.altKey) {
    //     if (e.code.includes('Digit'))
    //         schoolMap.load(e.code.split('Digit')[1])
    // }
}


// if (!localStorage.level || localStorage.level > settings.maxLevel)
//     localStorage.level = 3

document.addEventListener('DOMContentLoaded', function() {
    schoolMap.loadAll();
    
    // for (el of document.getElementsByTagName('nav')[0].children)
    //     el.onclick = e => schoolMap.load(e.toElement.innerHTML)
})

loadJSON('structure.json', e => {
    window.rooms = JSON.parse(e)
    console.log(e)
})
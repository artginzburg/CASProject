function rectClick(e) {
    id = e.target.id;

    let results = {};
    for (key in rooms.levels["3"]) {
        if (key === id) {
            // results.push({[key]: rooms[key]});
            results[key] = rooms.levels["3"][key]
        }
    }
    console.log(results[id]);
    console.log(results);
    str = results[id].ladder;
    document.querySelector('#leftBlock').innerHTML += `${str}<br>`;
}
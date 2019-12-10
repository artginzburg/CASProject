function rectClick(e) {
    id = e.target.id;

    let results = {};
    for (key in rooms.levels["4"]) {
        if (key === id) {
            // results.push({[key]: rooms[key]});
            results[key] = rooms.levels["4"][key]
        }
    }
    console.log(results[id]);
    str = results[id].name;
    document.body.innerHTML += `${str}<br>`;
}
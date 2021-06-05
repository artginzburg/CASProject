export const fetchSvg = (src, onload = '') =>
fetch(src)
  .then(res => res.ok
    ? res.text()
    : Promise.reject(`Error ${res.status} loading ${src}`)
  )
  .then(result => {
    const el = document.createElement('div');
    el.innerHTML = result.trim();
    return el.firstChild;
  })
  .then(onload)
  .catch(console.error)
;
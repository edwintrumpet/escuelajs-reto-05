const $app = document.getElementById('app');
const $observe = document.getElementById('observe');
const API = 'https://rickandmortyapi.com/api/character/';

const getData = async api => {
  let url, output, newItem;
  const storage = localStorage.getItem('next_fetch');

  if(storage){
    url = storage;
  }else{
    url = api;
  }

  try {
    if(url!=='end'){
      const res = await fetch(url);
      const response = await res.json();
      if(storage && storage.substr(-2)==='25'){
        localStorage.setItem('next_fetch', 'end');
      }else {
        localStorage.setItem('next_fetch', response.info.next);
      }

      const characters = response.results;
      output = characters.map(character => {
        return `
        <article class="Card">
          <img src="${character.image}" />
          <h2>${character.name}<span>${character.species}</span></h2>
        </article>
        `
      }).join('');
      newItem = document.createElement('section');
      newItem.classList.add('Items');
      newItem.innerHTML = output;
      $app.appendChild(newItem);
    }else {
      intersectionObserver.unobserve($observe)
      output = 'Ya no hay personajes…'
      newItem = document.createElement('p');
      newItem.innerHTML = output;
      $app.appendChild(newItem);
    }
  }catch(e) {
    console.log(e)
  }
}

const loadData = () => {
  getData(API);
}

const intersectionObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    loadData();
  }
}, {
  rootMargin: '0px 0px 100% 0px',
});

const cleanStorage = () => {
  localStorage.removeItem('next_fetch');
}

intersectionObserver.observe($observe);
window.addEventListener('unload', cleanStorage);

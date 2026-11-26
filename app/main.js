// The router: reads the hash, loads the data module once, renders the matching page and wires its controls.
//
//   #/                     overview          #/topic/<id>     one topic
//   #/indicator/<key>      one indicator     #/compare        neighbours
//   #/data                 searchable table  #/sources        sources and method
//
// window.__shotReady is true once a page is on screen, for the screenshot script.

const app = document.getElementById('app');
let dataPromise;
const loadData = () => (dataPromise ||= import('./data/load.js'));
const pagesPromise = import('./pages.js');

function parse() {
  const [path, query = ''] = location.hash.replace(/^#/, '').split('?');
  return { parts: path.split('/').filter(Boolean), params: new URLSearchParams(query) };
}

function markNav(section) {
  document.querySelectorAll('.nav a').forEach((a) => a.classList.toggle('on', a.dataset.nav === section));
}

async function render() {
  window.__shotReady = false;
  const { parts, params } = parse();
  const [data, pages] = await Promise.all([loadData(), pagesPromise]);
  const result = pages.route(data, parts, params);
  document.title = `${result.title} | Statistik Indonesia`;
  app.innerHTML = result.html;
  markNav(result.section);
  pages.bindPage(app, data, params);
  if (!params.has('keep')) window.scrollTo(0, 0);
  window.__shotReady = true;
}

addEventListener('hashchange', render);
render();

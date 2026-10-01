'use strict';
const $ = selector => document.querySelector(selector);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let motionOff = reduceMotion.matches;
const motionButton = $('#motion');
function updateMotion() {
  document.documentElement.classList.toggle('no-motion', motionOff);
  motionButton.setAttribute('aria-pressed', String(motionOff));
  motionButton.textContent = `Анимации: ${motionOff ? 'выкл.' : 'вкл.'}`;
}
updateMotion();
motionButton.addEventListener('click', () => { motionOff = !motionOff; updateMotion(); });
reduceMotion.addEventListener('change', event => { motionOff = event.matches; updateMotion(); });
// Подсветка не заменяет системный курсор и не перехватывает клики.
let pointerFrame = 0;
window.addEventListener('pointermove', event => {
  if (event.pointerType !== 'mouse' || motionOff || pointerFrame) return;
  pointerFrame = requestAnimationFrame(() => {
    $('#cursor-glow').style.transform = `translate(${event.clientX - 110}px, ${event.clientY - 110}px)`;
    const rect = $('#star').getBoundingClientRect();
    const dx = Math.max(-5, Math.min(5, (event.clientX - rect.left - rect.width / 2) / 70));
    const dy = Math.max(-4, Math.min(4, (event.clientY - rect.top - rect.height / 2) / 70));
    document.querySelectorAll('.pupil').forEach(pupil => pupil.style.transform = `translate(${dx}px, ${dy}px)`);
    pointerFrame = 0;
  });
}, { passive: true });
const colors = ['#d6ef6c', '#ffafc9', '#ffb75d', '#b9e7ff'];
let color = 0;
$('#star').addEventListener('click', () => { color = (color + 1) % colors.length; $('#star svg').style.fill = colors[color]; });
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.remove('pending'); observer.unobserve(entry.target); }
  }), { threshold: .08 });
  document.querySelectorAll('.section-head, .about-grid, .skill-row, .project').forEach(node => { node.classList.add('reveal', 'pending'); observer.observe(node); });
}
let scrollFrame = 0;
function updateProgress() { const total = document.documentElement.scrollHeight - innerHeight; $('#progress').style.width = `${total > 0 ? Math.min(100, scrollY / total * 100) : 0}%`; }
window.addEventListener('scroll', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(() => { updateProgress(); scrollFrame = 0; }); }, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(item => { const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active)); });
  let count = 0;
  document.querySelectorAll('.project').forEach(card => {
    card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
    if (!card.hidden) { count++; card.classList.remove('pending'); }
  });
  $('#filter-status').textContent = `Показано проектов: ${count}`;
  updateProgress();
}));
const projects = {
  skillpool: {url:"https://www.figma.com/proto/hjZh6MH1CWMmg782trl5pZ/%D0%9F%D0%BE%D1%80%D1%82%D1%84%D0%BE%D0%BB%D0%B8%D0%BE?node-id=1-497&viewport=374%2C572%2C0.11&t=cAs7j55gZcPHKBW9-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1", title:'SkillPool', tag:'Веб-дизайн / учебный проект', image:'assets/skillpool.png', description:'Лендинг платформы, где дизайнеры развиваются через реальные проекты. Визуальная система строится на голубых оттенках, крупной типографике и последовательной подаче информации.', note:'В портфолио показан предоставленный макет. По кнопке открывается прототип в Figma.'},
  bloom: {url:"https://www.figma.com/proto/hjZh6MH1CWMmg782trl5pZ/%D0%9F%D0%BE%D1%80%D1%82%D1%84%D0%BE%D0%BB%D0%B8%D0%BE?node-id=1-2512&viewport=-485%2C559%2C0.11&t=EFe7TPo6f7NA5xck-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1", title:'Mouthful Bloom', tag:'Веб-дизайн / учебный проект', image:'assets/mouthful-bloom.png', description:'Сайт бенто-тортов: главная страница, каталог и корзина. Проект о том, как через интерфейс передать настроение продукта и сделать выбор понятным.', note:'Представлен предоставленный скриншот сайта. По кнопке открывается прототип в Figma.'},
  booklet: {url:"https://www.figma.com/proto/hjZh6MH1CWMmg782trl5pZ/%D0%9F%D0%BE%D1%80%D1%82%D1%84%D0%BE%D0%BB%D0%B8%D0%BE?node-id=1-682&viewport=-485%2C559%2C0.11&t=EFe7TPo6f7NA5xck-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1", title:'Буклет', tag:'Графический дизайн / учебный проект', image:'assets/booklet.png', description:'Буклет по прикладному дизайну. Работа с выразительной типографикой, цветом и композицией печатного издания.', note:'Представлена предоставленная обложка буклета.'},
  reflo: {url:"https://www.figma.com/proto/hjZh6MH1CWMmg782trl5pZ/%D0%9F%D0%BE%D1%80%D1%82%D1%84%D0%BE%D0%BB%D0%B8%D0%BE?node-id=1-712&viewport=-485%2C559%2C0.11&t=EFe7TPo6f7NA5xck-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1", title:'Reflo', tag:'UI-дизайн / учебный проект', image:'assets/reflo.png', description:'Приложение для наблюдения за самочувствием, эмоциями и личными целями. На экранах показаны знакомство с помощником, выбор направления и оценка состояния.', note:'Представлены экраны прототипа, а не опубликованное приложение.'},
  forgotten: {url:"https://www.figma.com/design/hjZh6MH1CWMmg782trl5pZ/%D0%9F%D0%BE%D1%80%D1%82%D1%84%D0%BE%D0%BB%D0%B8%D0%BE?node-id=1-5386&t=ACfLa6PeSqPfanS8-1", title:'Forgotten — Lights of Memory', tag:'Игровой дизайн / учебный проект', image:'assets/forgotten.png', description:'Игровой проект с атмосферой загадочного мира и светящимися персонажами. Представлен главный экран с выбором начала игры, уровней и настроек.', note:'Название приведено по изображению проекта: Forgotten. В исходном перечне было указано Foggotten.'}
};
const dialog = $('#project-dialog');
let opener;
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
  const project = projects[button.dataset.project];
  opener = button;
  $('#dialog-title').textContent = project.title;
  $('#dialog-tag').textContent = project.tag;
  $('#dialog-description').textContent = project.description;
  $('#dialog-note').textContent = project.note;
  $('#dialog-figma').href = project.url;
  $('#dialog-figma').textContent = button.dataset.project === 'forgotten' ? 'Открыть макет в Figma ↗' : 'Открыть в Figma ↗';
  $('#dialog-figma').setAttribute('aria-label', `${project.title} в Figma — новая вкладка`);
  $('#dialog-image').hidden = !project.image;
  if (project.image) { $('#dialog-image').src = project.image; $('#dialog-image').alt = `Проект ${project.title}`; }
  else $('#dialog-image').removeAttribute('src');
  dialog.showModal();
  document.body.style.overflow = 'hidden';
}));
$('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { const r = dialog.getBoundingClientRect(); if (event.target === dialog && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) dialog.close(); });
dialog.addEventListener('close', () => { document.body.style.overflow = ''; opener?.focus(); });
$('#copy-email').addEventListener('click', async () => {
  try {
    if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText('t.r0zina@yandex.ru');
    $('#copy-status').textContent = 'Почта скопирована!';
  } catch { $('#copy-status').textContent = 'Выдели и скопируй адрес: t.r0zina@yandex.ru'; }
});

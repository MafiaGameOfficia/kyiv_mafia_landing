// script.js

// ---------- Налаштування (підставиш пізніше) ----------
const ORGANIZER_TAG = 'sergeevich16_ss'; 
const ADMIN_CODE = 'admin123'; // змініть на свій секретний код для керування списком (або реалізуйте бекенд)
const TOURNAMENT_MAX = 25;
const ENTRY_FEE = 100;
const TOURNAMENT_DATE = '2025-10-16';
const adminTournamentBtn = document.getElementById('adminTournamentBtn');

// -------------------------------------------

// список ролей (ті самі дані)
const roles = [
  {id:'don',name:'Дон',faction:'Мафія',short:'Глава Мафії. Вночі разом із сім’єю обирає жертву.',desc:`Глава Мафії. Вночі разом зі всією мафіозною сім’єю вибирають жертву і оголошують вирок.`},
  {id:'maf',name:'Мафія',faction:'Мафія',short:'Член мафіозної сім’ї.',desc:'Член мафіозної сім’ї. Вночі разом із сім’єю обирає жертву. Може стати новим Доном, якщо попереднього вб’ють.'},
  {id:'advokat',name:'Адвокат',faction:'Мафія',short:'Захищає мафію від перевірок.',desc:'Грає за Мафію! Може захищати союзників від перевірок Слідчого.'},
  {id:'balamut',name:'Баламут',faction:'Мафія',short:'Оббріхує мирних.',desc:'Може захищати союзників і дезінформувати Мирних гравців.'},
  {id:'dominika',name:'Домініка',faction:'Мафія',short:'Дружина Дона.',desc:'Поки Дон живий, відволікає інших від його ходів. Якщо Дон помирає — може стати Доном.'},
  {id:'peaceful',name:'Мирний житель',faction:'village',short:'Вдень лінчує поганців.',desc:'Вночі спить, вдень допомагає знаходити Мафію.'},
  {id:'investigator',name:'Слідчий',faction:'village',short:'Правоохоронець.',desc:'Вночі може дізнатися роль одного з гравців або вбити когось наосліп.'},
  {id:'sergeant',name:'Сержант',faction:'village',short:'Помічник Слідчого.',desc:'Допомагає Слідчому, знає перевірених гравців.'},
  {id:'doctor',name:'Лікар',faction:'village',short:'Рятує життя вночі.',desc:'Може врятувати одного гравця вночі, один раз може вилікувати себе.'},
  {id:'courtesan',name:'Повія',faction:'village',short:'Відволікає інших на ніч.',desc:'Мирна роль, здатна відволікти будь-якого персонажа на ніч.'},
  {id:'tramp',name:'Волоцюга',faction:'village',short:'Свидок подій у місті.',desc:'Ходить по місту, може дізнатися, хто вбив, не знаючи ролі.'},
  {id:'kamikaze',name:'Камікадзе',faction:'village',short:'Мирний, але вибуховий.',desc:'Якщо його лінчують, може підірвати когось разом із собою.'},
  {id:'lucky',name:'Щасливчик',faction:'village',short:'Мирний з сюрпризом.',desc:'Іноді виживає при замахах — удача змінює хід гри.'},
  {id:'journalist',name:'Журналістка',faction:'village',short:'Бере інтерв’ю та аналізує.',desc:'Може визначити, чи гравці за одну команду, якщо її не збаламутять.'},
  {id:'suicider',name:'Самогубець',faction:'neutral',short:'Виграє лише у смертельному голосуванні.',desc:'Виграє, якщо помре під час денного голосування.'},
  {id:'maniac',name:'Маніяк',faction:'neutral',short:'Баланс між сторонами.',desc:'Виграє, якщо збалансує Мирних та Мафію за своєю користю.'},
  {id:'sorcerer',name:'Чаклун',faction:'neutral',short:'Невразливий вночі.',desc:'Нейтральна роль, яку не можна вбити вночі, веде власну гру.'},
  {id:'jack',name:'Джек-Різник',faction:'neutral',short:'Полює на Повію.',desc:'Виграє, якщо вб’є Повію.'},
];

// прості SVG-іконки вбудовано — можна замінити на файли в /svgs/{id}.svg пізніше
const roleIcons = {
  don: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" fill="#8B0000"/><path d="M32 10 L40 30 H24 L32 10 Z" fill="#000"/><rect x="28" y="30" width="8" height="24" fill="#000"/></svg>`,
  maf: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" fill="#8B0000"/><path d="M20 40 L44 40 L32 20 Z" fill="#000"/></svg>`,
  advokat: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" fill="#8B0000"/><path d="M20 44 L44 44 L32 20 Z" fill="#FFD700"/><rect x="28" y="32" width="8" height="12" fill="#000"/></svg>`,
  balamut: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" fill="#8B0000"/><path d="M20 24 Q32 10 44 24 L36 36 H28 L20 24 Z" fill="#000"/></svg>`,
  dominika: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" fill="#8B0000"/><path d="M32 12 L42 28 H22 L32 12 Z" fill="#FFC0CB"/><circle cx="32" cy="36" r="8" fill="#000"/></svg>`,
  peaceful: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" fill="#1E90FF"/><rect x="28" y="20" width="8" height="24" fill="#fff"/><path d="M20 44 L44 44 L32 32 Z" fill="#fff"/></svg>`,
  investigator: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" fill="#1E90FF"/><circle cx="32" cy="28" r="6" fill="#000"/><rect x="30" y="34" width="4" height="10" fill="#000"/></svg>`,
  sergeant: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" fill="#1E90FF"/><polygon points="32,12 36,28 48,28 38,36 42,52 32,42 22,52 26,36 16,28 28,28" fill="#FFD700"/></svg>`,
  doctor: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" fill="#1E90FF"/><rect x="28" y="16" width="8" height="32" fill="#fff"/><path d="M16 28 H48 V36 H16 Z" fill="#fff"/></svg>`,
  courtesan: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" fill="#1E90FF"/><path d="M32 16 L44 32 L32 48 L20 32 Z" fill="#FF69B4"/></svg>`,
  tramp: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" fill="#1E90FF"/><rect x="28" y="20" width="8" height="24" fill="#654321"/><circle cx="32" cy="36" r="6" fill="#fff"/></svg>`,
  kamikaze: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" fill="#1E90FF"/><rect x="28" y="28" width="8" height="8" fill="#FF4500"/><circle cx="32" cy="32" r="4" fill="#000"/></svg>`,
  lucky: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" fill="#1E90FF"/><path d="M32 12 L36 28 H28 L32 12 Z" fill="#FFFF00"/><circle cx="32" cy="36" r="6" fill="#000"/></svg>`,
  journalist: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" fill="#1E90FF"/><rect x="24" y="20" width="16" height="24" fill="#fff"/><line x1="24" y1="26" x2="40" y2="26" stroke="#000" stroke-width="2"/><line x1="24" y1="32" x2="40" y2="32" stroke="#000" stroke-width="2"/></svg>`,
  suicider: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" fill="#800080"/><line x1="20" y1="20" x2="44" y2="44" stroke="#000" stroke-width="4"/><line x1="44" y1="20" x2="20" y2="44" stroke="#000" stroke-width="4"/></svg>`,
  maniac: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" fill="#800080"/><path d="M32 12 L36 28 H28 L32 12 Z" fill="#FF0000"/><rect x="28" y="36" width="8" height="12" fill="#000"/></svg>`,
  sorcerer: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" fill="#800080"/><path d="M32 12 L28 32 L36 32 Z" fill="#8A2BE2"/><circle cx="32" cy="44" r="6" fill="#FFFF00"/></svg>`,
  jack: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" fill="#800080"/><rect x="30" y="20" width="4" height="24" fill="#FF0000"/><polygon points="32,12 36,20 28,20" fill="#000"/></svg>`
};

// --- DOM refs
const menuBtn = document.getElementById('menuBtn');
const menuDropdown = document.getElementById('menuDropdown');
const menuRoles = document.getElementById('menuRoles');
const menuTournament = document.getElementById('menuTournament');
const menuRules = document.getElementById('menuRules');

const panelRoles = document.getElementById('panelRoles');
const closePanelRoles = document.getElementById('closePanelRoles');
const rolesGrid = document.getElementById('rolesGrid');

const modalBackdrop = document.getElementById('modalBackdrop');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const modalActions = document.getElementById('modalActions');
const closeModal = document.getElementById('closeModal');

const joinBtn = document.getElementById('joinBtn');

const readRulesBtn = document.getElementById('readRulesBtn');
const joinTournamentBtn = document.getElementById('joinTournamentBtn');
const playersCountEl = document.getElementById('playersCount');
const playersListEl = document.getElementById('playersList');
const managePlayersBtn = document.getElementById('managePlayersBtn');

// carousel refs
const carouselImage = document.getElementById('carouselImage');
const prevScreen = document.getElementById('prevScreen');
const nextScreen = document.getElementById('nextScreen');



// ---------- Menu behaviour: hover dropdown & accessibility ----------
let dropdownOpen = false;
menuBtn.addEventListener('click', (e)=>{
  dropdownOpen = !dropdownOpen;
  menuBtn.setAttribute('aria-expanded', String(dropdownOpen));
  menuDropdown.style.display = dropdownOpen ? 'flex' : 'none';
  menuDropdown.setAttribute('aria-hidden', String(!dropdownOpen));
});
document.addEventListener('click', (e)=>{
  if (!menuBtn.contains(e.target) && !menuDropdown.contains(e.target)){
    dropdownOpen = false;
    menuDropdown.style.display = 'none';
    menuDropdown.setAttribute('aria-hidden','true');
    menuBtn.setAttribute('aria-expanded','false');
  }
});

// keyboard accessibility
menuBtn.addEventListener('keydown', e=> { if(e.key==='Escape'){ menuDropdown.style.display='none'; } });

// ---------- Roles offcanvas ----------
function renderRoles(){
  rolesGrid.innerHTML = '';
  roles.forEach(r=>{
    const div = document.createElement('div');
    div.className = 'role';
    div.tabIndex = 0;
    div.innerHTML = `<div class="icon">${roleIcons[r.id] || r.name.slice(0,2)}</div><h4>${r.name}</h4><p>${r.short}</p>`;
    div.addEventListener('click', ()=> openRoleModal(r));
    div.addEventListener('keydown', e=> { if(e.key==='Enter') openRoleModal(r); });
    rolesGrid.appendChild(div);
  });
}
function openRoleModal(r){
  modalTitle.textContent = r.name;
  modalBody.innerHTML = `<p class="muted">${r.desc}</p>`;
  modalActions.innerHTML = `<button class="btn primary" id="modalCloseBtn">Закрити</button>`;
  showModal();
  document.getElementById('modalCloseBtn').addEventListener('click', hideModal);
}

menuRoles.addEventListener('click', ()=>{
  panelRoles.classList.add('open');
  panelRoles.setAttribute('aria-hidden','false');
  menuDropdown.style.display='none';
});
closePanelRoles.addEventListener('click', ()=>{
  panelRoles.classList.remove('open');
  panelRoles.setAttribute('aria-hidden','true');
});
renderRoles();

// ---------- Modal helpers ----------
function showModal(){
  modalBackdrop.style.display='flex';
  modalBackdrop.setAttribute('aria-hidden','false');
  setTimeout(()=> modalBackdrop.classList.add('open'),10);
}
function hideModal(){
  modalBackdrop.classList.remove('open');
  setTimeout(()=>{ modalBackdrop.style.display='none'; modalBackdrop.setAttribute('aria-hidden','true'); },220);
}
closeModal.addEventListener('click', hideModal);
modalBackdrop.addEventListener('click', (e)=>{ if(e.target===modalBackdrop) hideModal(); });
document.addEventListener('keydown', e=> { if(e.key==='Escape') hideModal(); });

// ---------- Tournament logic (localStorage) ----------
const STORAGE_KEY = 'kiev_mafia_tournament_players';
function loadPlayers(){ const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : []; }
function savePlayers(arr){ localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); }
function renderPlayers(){
  const arr = loadPlayers();
  playersCountEl.textContent = arr.length;
  playersListEl.innerHTML = '';
  arr.forEach(n=>{
    const li = document.createElement('li');
    li.textContent = n;
    playersListEl.appendChild(li);
  });
}
renderPlayers();

// ---------- Tournament date helpers ----------
const TOURNAMENT_DATE_KEY = 'kiev_mafia_tournament_date';
function loadTournamentDate() {
  const stored = localStorage.getItem(TOURNAMENT_DATE_KEY);
  return stored || TOURNAMENT_DATE;
}
function saveTournamentDate(dateStr) {
  localStorage.setItem(TOURNAMENT_DATE_KEY, dateStr);
}

document.addEventListener('DOMContentLoaded', () => {
  const saveDateBtn = document.getElementById('saveDateBtn');
  if(saveDateBtn) {
    saveDateBtn.addEventListener('click', () => {
      const newDate = document.getElementById('tournamentDateInput').value;
      saveTournamentDate(newDate);

      const tournamentDateEl = document.getElementById('tournamentDate');
      if(tournamentDateEl) tournamentDateEl.textContent = new Date(newDate).toLocaleDateString('uk-UA');

      alert(`Дата турніру змінена на ${newDate}`);
    });
  }
});


// show rules modal
const tournamentRulesText = `
<h4>Умови участі в турнірі</h4>
<ul>
<li>Максимум 25 учасників.</li>
<li>Стартовий внесок — <strong>${ENTRY_FEE} грн</strong>.</li>
<li>Після реєстрації вам надішлють реквізити для оплати. Місце буде зарезервоване після отримання платежу.</li>
<li>Після завершення ігор перші три місця ділять призи: 1000 / 500 / 250 грн.</li>
<li>Учасники повинні дотримуватися правил чату та поведінки — порушники вилучаються без повернення внеску.</li>
</ul>
<h4>Коротко про гру</h4>
<p>Мафія — психологічна детективна гра. Мирні жителі повинні знайти Мафію, Мафія — знищити Мирних.</p>
`;

readRulesBtn.addEventListener('click', ()=>{
  modalTitle.textContent = 'Умови та правила турніру';
  modalBody.innerHTML = tournamentRulesText;
  modalActions.innerHTML = `<button class="btn primary" id="closeRulesBtn">Закрити</button>`;
  showModal();
  document.getElementById('closeRulesBtn').addEventListener('click', hideModal);
});

// Join tournament flow: show confirmation modal with checkbox, then register and redirect to organizer
// Join tournament flow: show confirmation modal with checkbox, then send request to organizer (NO auto-add)
joinTournamentBtn.addEventListener('click', () => {
  modalTitle.textContent = 'Підтвердження участі';
  modalBody.innerHTML = `
    <p class="muted">Щоб подати заявку на участь у турнірі, будь ласка, підтвердіть, що ви прочитали умови та погоджуєтесь з правилами.</p>
    <label style="display:block;margin:12px 0">
      <input type="checkbox" id="agreeCheck" /> Я прочитав(ла) умови та правила турніру
    </label>
    <p class="muted small">Після підтвердження ваша заявка буде надіслана організатору. Місце буде зарезервовано лише після підтвердження оплати модератором (він додасть вас у список).</p>
  `;

  // confirm button disabled by default
  modalActions.innerHTML = `
    <button class="btn outline" id="cancelJoin">Скасувати</button>
    <button class="btn primary" id="confirmJoin" disabled>Підтвердити і надіслати запит</button>
  `;
  showModal();

  const cancelBtn = document.getElementById('cancelJoin');
  const confirmBtn = document.getElementById('confirmJoin');
  const agreeCheck = document.getElementById('agreeCheck');

  cancelBtn.addEventListener('click', hideModal);

  // Активуємо кнопку тільки після встановлення галочки
  agreeCheck.addEventListener('change', () => {
    confirmBtn.disabled = !agreeCheck.checked;
  });

  confirmBtn.addEventListener('click', () => {
    if (!agreeCheck.checked) {
      alert('Потрібно підтвердити, що ви прочитали умови.');
      return;
    }


    // НЕ додаємо учасника автоматично у players[]
    // Лише формуємо повідомлення для організатора з проханням зв'язатися і надати реквізити.
    const message = encodeURIComponent(
      `Хочу долучитися до турніру 🎭(${new Date(TOURNAMENT_DATE).toLocaleDateString('uk-UA')}). \n\nПрочитав(ла) умови та правила ✅\nЧекаю реквізити для оплати 💸.`
    );

    // Редірект у Telegram до організатора (app first, then web share)
    window.location.href = `https://t.me/${ORGANIZER_TAG}?text=${message}`;
 

    hideModal();
    // Користувачу показуємо повідомлення про подальші дії
    alert('Ваш запит на участь відправлено організатору. Місце буде зарезервовано після підтвердження оплати модератором.');
  });
});


// Керування турніром — доступ через код адміністратора
adminTournamentBtn.addEventListener('click', ()=> {
  const code = prompt('Введіть адміністративний код для керування турніром:');
  if(code !== ADMIN_CODE){ 
    alert('Невірний код.'); 
    return; 
  }

  // Заголовок модалки
  modalTitle.textContent = 'Керування турніром';

  // Отримуємо дату та список учасників
  const tournamentDate = loadTournamentDate(); // функція повертає рядок дати
  const players = loadPlayers();

  // Створюємо HTML для модалки
  modalBody.innerHTML = `
    <div class="tournament-date">
      <label>Дата турніру:</label>
      <input type="date" id="tournamentDateInput" value="${tournamentDate}">
      <button class="btn small" id="saveDateBtn">Зберегти дату</button>
    </div>
    <hr>
    <div class="tournament-players">
      <label>Учасники:</label>
      <ul id="mgmtList" class="players-list"></ul>
      <input type="text" id="newPlayer" placeholder="Додати учасника">
      <button class="btn small" id="addPlayerBtn">Додати</button>
    </div>
  `;

  // Додаємо учасників у список
  const mgmtList = document.getElementById('mgmtList');
  players.forEach((n,i)=>{
    const li = document.createElement('li');
    li.innerHTML = `${n} <button data-index="${i}" class="btn small danger inline-remove">Видалити</button>`;
    mgmtList.appendChild(li);
  });

  // Дії модалки
  modalActions.innerHTML = `<button class="btn outline" id="closeMgmt">Закрити</button>
                            <button class="btn danger" id="clearAll">Очистити все</button>`;

  showModal();

  // Закрити модалку
  document.getElementById('closeMgmt').addEventListener('click', hideModal);

  // Очистити список учасників
  document.getElementById('clearAll').addEventListener('click', ()=>{
    if(confirm('Очистити весь список учасників?')){ 
      savePlayers([]); 
      renderPlayers(); 
      hideModal(); 
    }
  });

  // Видалити конкретного учасника
  document.querySelectorAll('.inline-remove').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const idx = Number(e.currentTarget.dataset.index);
      players.splice(idx,1);
      savePlayers(players);
      renderPlayers();
      hideModal();
      alert('Учасник видалений.');
    });
  });

  // Додати нового учасника
  document.getElementById('addPlayerBtn').addEventListener('click', ()=>{
    const newPlayer = document.getElementById('newPlayer').value.trim();
    if(newPlayer){
      players.push(newPlayer);
      savePlayers(players);
      renderPlayers();
      hideModal();
      alert(`Учасник "${newPlayer}" доданий.`);
    }
  });

  // Зберегти дату турніру
  document.getElementById('saveDateBtn').addEventListener('click', ()=>{
    const newDate = document.getElementById('tournamentDateInput').value;
    saveTournamentDate(newDate);
    alert(`Дата турніру змінена на ${newDate}`);
  });
});


// Меню -> Турнір відкриває секцію (скрол)
menuTournament.addEventListener('click', ()=>{
  document.getElementById('tournamentSection').scrollIntoView({behavior:'smooth'});
  menuDropdown.style.display='none';
  panelRoles.classList.remove('open');
});

// Меню -> Правила (короткі)
const generalRules = `
<h4>Правила чату та гри</h4>
<ul>
<li>Поважайте інших гравців — за образи і порушення правил передбачене видалення.</li>
<li>Чітко дотримуйтесь регламенту ігор — не спойлеріть ролі у публічному чаті.</li>
<li>Чат — україномовний; використовуйте українську мову під час ігор.</li>
<li>Адміністратори можуть приймати рішення щодо конфліктних ситуацій.</li>
</ul>
<p class="muted">Мафія — відмінна розвага, де важлива чесність і повага.</p>
`;
menuRules.addEventListener('click', ()=>{
  modalTitle.textContent = 'Правила спільноти';
  modalBody.innerHTML = generalRules;
  modalActions.innerHTML = `<button class="btn primary" id="closeRulesBtn">Закрити</button>`;
  showModal();
  document.getElementById('closeRulesBtn').addEventListener('click', hideModal);
  menuDropdown.style.display='none';
});

// ---------- Join chat button ----------
const inviteCode = 'HhW9yhiVMtRiZDM6';
function openTelegramInvite(){
  window.location.href = `tg://join?invite=${inviteCode}`;
  setTimeout(()=> window.open(`https://t.me/+${inviteCode}`, '_blank'), 700);
}
joinBtn.addEventListener('click', openTelegramInvite);

// ---------- Screenshots carousel (заміни screenshots масив своїми файлами) ----------
const screenshots = [
  'images/screens/screen1.jpg',
  'images/screens/screen2.jpg',
  'images/screens/screen3.jpg'
];
// якщо немає файлів — можна показати змінний фон
let currentScreen = 0;
function showScreen(idx){
  if(!screenshots || screenshots.length===0){
    carouselImage.style.background = 'linear-gradient(180deg,#081226,#0b1830)';
    carouselImage.textContent = 'Тут будуть ваші скріни — підтягніть файли у images/screens/';
    return;
  }
  const url = screenshots[idx % screenshots.length];
  carouselImage.style.backgroundImage = `url(${url})`;
  carouselImage.style.backgroundSize = 'cover';
  carouselImage.style.backgroundPosition = 'center';
}
if(carouselImage){
  showScreen(currentScreen);
  if(prevScreen) prevScreen.addEventListener('click', ()=>{ currentScreen = (currentScreen -1 + screenshots.length) % screenshots.length; showScreen(currentScreen);});
  if(nextScreen) nextScreen.addEventListener('click', ()=>{ currentScreen = (currentScreen +1) % screenshots.length; showScreen(currentScreen);});
}

// close any open dropdowns when scrolling
window.addEventListener('scroll', ()=>{ menuDropdown.style.display='none'; menuBtn.setAttribute('aria-expanded','false'); });

// initial UI: hide menu dropdown
menuDropdown.style.display = 'none';

// set tournament date display
const tournamentDateEl = document.getElementById('tournamentDate');
if (tournamentDateEl) tournamentDateEl.textContent = new Date(TOURNAMENT_DATE).toLocaleDateString('uk-UA');

/* === Mobile enhancements: carousel swipe & menu touch improvements === */
(function(){
  // Swipe for carousel
  const carousel = document.getElementById('carouselImage') || document.getElementById('carouselImage');
  if(carousel){
    let startX = 0, currentX = 0, isTouch = false;
    carousel.addEventListener('touchstart', e=>{
      if(e.touches && e.touches.length === 1){
        isTouch = true;
        startX = e.touches[0].clientX;
      }
    }, {passive:true});
    carousel.addEventListener('touchmove', e=>{
      if(!isTouch) return;
      currentX = e.touches[0].clientX;
    }, {passive:true});
    carousel.addEventListener('touchend', e=>{
      if(!isTouch) return;
      const dx = currentX - startX;
      if(Math.abs(dx) > 40){
        // trigger prev/next buttons if exist
        const nextBtn = document.getElementById('nextScreen');
        const prevBtn = document.getElementById('prevScreen');
        if(dx < 0){
          if(nextBtn) nextBtn.click();
        } else {
          if(prevBtn) prevBtn.click();
        }
      }
      startX = currentX = 0; isTouch = false;
    }, {passive:true});
  }

  // Improve dropdown for touch: close when tapping outside is already implemented.
  const menuBtn = document.getElementById('menuBtn');
  const menuDropdown = document.getElementById('menuDropdown');
  if(menuBtn && menuDropdown){
    // enlarge hit area on mobile
    function isMobile(){ return window.innerWidth < 600; }
    if(isMobile()){
      menuBtn.style.width = '64px'; menuBtn.style.height = '64px';
    }
    // accessibility: allow keyboard open via Enter/Space
    menuBtn.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); menuBtn.click(); }
    });
  }
})();

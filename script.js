// script.js — roles data + modal + invite logic
const roles = [
  {id:'don',name:'Дон',faction:'Мафія',short:'Глава Мафії. Вночі разом із сім’єю обирає жертву.',desc:`Глава Мафії. Вночі разом зі всією мафіозною сім’єю вибирають жертву і оголошують вирок. ...`},
  {id:'maf',name:'Мафія',faction:'Мафія',short:'Член мафіозної сім’ї.',desc:'Член мафіозної сім’ї. Вночі разом із сім’єю обирає жертву. Може стати новим Доном, якщо попереднього вб’ють ...'},
  {id:'advokat',name:'Адвокат',faction:'Мафія',short:'Захищає мафію від перевірок.',desc:'Грає за Мафію! Якщо Адвокат обере Мафію в одну ніч із Слідчим, то зможе захистити її, адже Слідчому покаже роль Мирного жителя...'},
  {id:'balamut',name:'Баламут',faction:'Мафія',short:'Оббріхує мирних.',desc:'Грає за Мафію! Як і Адвокат, він може захистити союзника від перевірки, проте це ще не все — Баламут оббріхує Мирних гравців!..'},
  { id: 'dominika', name: 'Домініка', faction: 'Мафія', short: 'Дружина Дона.', desc: 'Грає за Мафію! Поки Дон живий, відволікає інших від їхніх ходів. Якщо Дон вмирає, то сама стає Доном, і може помститись за нього вночі, але може на емоціях видати себе іншим ролям, тому будьте обачніші з цим. Не любить Повію, і якщо помітить її в партнера (або Дон помітить її в Домініки), то є шанс, що помре хтось один, обидва, або всі будуть з мовчанкою...' },
  {id:'peaceful', name:'Мирний житель', faction:'village', short:'Вдень лінчує поганців.', desc:'Вночі солодко спить, а вдень намагається знайти поганих персонажів і лінчувати їх. Не знецінюйте цю роль, адже від неї залежить баланс гри та шанс міста вижити.'},
  { id: 'investigator', name: 'Слідчий', faction: 'village', short: 'Правоохоронець із пістолетом справедливості.', desc: 'Вночі може дізнатися роль одного з гравців або ж вбити когось наосліп. Зазвичай бере на себе керування грою, маючи перевірених гравців та пістолет справедливості. Слідкуйте, щоб його не вбили рано — від цього залежить порядок у місті.' },
  { id: 'sergeant', name: 'Сержант', faction: 'village', short: 'Помічник Слідчого.', desc: 'Допомагає Слідчому наводити порядок у місті. Знає ролі перевірених Слідчим гравців. Якщо Слідчий помре — Сержант посяде його місце і продовжить боротьбу з поганцями.' },
  { id: 'doctor', name: 'Лікар', faction: 'village', short: 'Рятує життя вночі.', desc: 'Робітник реанімації. Вночі може приїхати до одного із учасників і врятувати йому життя. Один раз за всю гру може вилікувати себе. Його рішення можуть змінити хід ночі, будьте уважні.' },
  { id: 'courtesan', name: 'Повія', faction: 'village', short: 'Відволікає інших на ніч.', desc: 'Мирна роль, яка здатна відволікти будь-якого персонажа на цілу ніч. Перебуваючи у Дона чи у Маніяка, вона не дає можливості вбити, але якщо Дон все-таки знайде Повію, то на нього чари блоку не діють. Слідкуйте за тим, хто з нею взаємодіє.' },
  { id: 'tramp', name: 'Волоцюга', faction: 'village', short: 'Свидок подій у місті.', desc: 'Мирна роль, котра ходить по домівках у пошуках випивки. Може стати свідком вбивства і дізнатися ім’я вбивці (але не його роль). У жертви ви можете побачити не тільки Дона чи Маніяка, а й Слідчого чи Лікаря, тому будьте уважними.' },
  { id: 'kamikaze', name: 'Камікадзе', faction: 'village', short: 'Мирний, але вибуховий.', desc: 'Вдень і вночі це звичайний Мирний житель, але якщо його лінчують, втративши глузд, може підкласти комусь вибухівку та забрати з собою. Грайте обережно — наслідки непередбачувані.' },
  { id: 'lucky', name: 'Щасливчик', faction: 'village', short: 'Мирний з сюрпризом.', desc: 'Мирна роль, яка має вирахувати Мафію та на міських зборах лінчувати поганців. Якщо пощастить, під час замаху залишиться у живих (шанс 50/50, один раз за гру). Його удача може змінити хід подій.' },
  { id: 'journalist', name: 'Журналістка', faction: 'village', short: 'Бере інтерв’ю та аналізує.', desc: 'Бере інтерв’ю у двох громадян маленького містечка та аналізує їхні відповіді. Може визначити, чи грають вони за ту саму команду, якщо її ніхто не збаламутить. Документи перевіряти не має права, отже, вони на неї не діють😉' },
  { id: 'suicider', name: 'Самогубець', faction: 'neutral', short: 'Виграє лише у смертельному голосуванні.', desc: 'Нейтральна роль, котра виграє тільки при перемозі у смертельному денному голосуванні (потрібно померти протягом дня). За наявності документів покаже чорну роль Слідчому, якщо хтось з Мафії живий. Обережність і планування — ключ до перемоги.' },
  { id: 'maniac', name: 'Маніяк', faction: 'neutral', short: 'Баланс між сторонами.', desc: 'Для перемоги Маніяку варто слідкувати як за Мирними, так і за Мафією, тримати баланс між обома сторонами. Його дії непередбачувані, тому інші гравці повинні бути уважними.' },
  { id: 'sorcerer', name: 'Чаклун', faction: 'neutral', short: 'Невразливий вночі.', desc: 'Нейтральна роль, яку неможливо вбити вночі. Але якщо хтось прийде до нього або сила якоїсь команди стане значно більшою за інших, Чаклун розпочне власне полювання. Його мотиви приховані, тому обережність обов’язкова.' },
  {id:'jack', name:'Джек-Різник', faction:'neutral', short:'Полює на Повію.', desc:'Полює на Повію. Виграє, якщо її вб’є. Його дії можуть лякати інших гравців, будьте уважні до того, хто лишився живим.'}, 
];

const rolesGrid = document.getElementById('rolesGrid');
roles.forEach(r=>{
  const el = document.createElement('div'); el.className='role'; el.tabIndex=0; el.dataset.id=r.id;
  el.innerHTML = `<div class="icon">${r.name.split(' ').map(s=>s[0]).slice(0,2).join('')}</div><h4>${r.name}</h4><p>${r.short}</p>`;
  el.addEventListener('click',()=>openModal(r));
  el.addEventListener('keydown',(e)=>{if(e.key==='Enter') openModal(r)});
  rolesGrid.appendChild(el);
});

// modal logic
const backdrop = document.getElementById('modalBackdrop');
const modalTitle = document.getElementById('modalTitle');
const modalSubtitle = document.getElementById('modalSubtitle');
const modalBody = document.getElementById('modalBody');
const modalIcon = document.getElementById('modalIcon');
const closeModal = document.getElementById('closeModal');

function openModal(r){
  modalTitle.textContent = r.name;
  modalSubtitle.textContent = r.faction;
  modalBody.innerHTML = `<p class="muted">${r.desc}</p>`;
  modalIcon.textContent = r.name.split(' ').map(s=>s[0]).slice(0,2).join('');
  backdrop.classList.add('open');
}
function hideModal(){ backdrop.classList.remove('open'); }
closeModal.addEventListener('click', hideModal);
backdrop.addEventListener('click',(e)=>{ if(e.target===backdrop) hideModal(); });
document.addEventListener('keydown',(e)=>{ if(e.key==='Escape') hideModal(); });

// Invite logic: try tg:// first, fallback to https
const inviteCode = 'HhW9yhiVMtRiZDM6';
function openTelegramInvite(){
  // Try native app first
  window.location.href = `tg://join?invite=${inviteCode}`;
  setTimeout(()=>{
    window.open(`https://t.me/+${inviteCode}`, '_blank');
  },800);
}

document.getElementById('joinBtn').addEventListener('click', openTelegramInvite);
document.getElementById('requestInvite').addEventListener('click', ()=>{
  const u = document.getElementById('username').value.trim();
  const status = document.getElementById('inviteStatus');
  if(!u || !/^@/.test(u)){ status.textContent='Введіть ваш @username (наприклад @ivan).'; return; }
  status.textContent='Запрошення відправлено — відкриваємо Telegram...';
  openTelegramInvite();
  setTimeout(()=>status.textContent='Посилання відкрито. Якщо Telegram не відкрився, натисніть ще раз.' ,1500);
});

// show-all placeholder
document.getElementById('showAllRoles').addEventListener('click', ()=>{
  alert('Тут можна відкрити повний список ролей або завантажити PDF з описами.');
});

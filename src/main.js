const asset = (name) => `${import.meta.env.BASE_URL}assets/${name}`;
const teams = [
  { name: '樱庭会', english: 'SAKURA', symbol: '樱', color: '#6e455c', accent: '#ef9bb1', points: 382.4, diff: '—', games: 20 },
  { name: '青山麻雀社', english: 'AOYAMA', symbol: '青', color: '#1e4c3d', accent: '#82aa86', points: 224.8, diff: 157.6, games: 20 },
  { name: '金曜会', english: 'GOLDEN', symbol: '金', color: '#645221', accent: '#c5ac68', points: 175.3, diff: 49.5, games: 20 },
  { name: '竹林队', english: 'BAMBOO', symbol: '竹', color: '#60712f', accent: '#a6be69', points: 142.6, diff: 32.7, games: 22 },
  { name: '风林社', english: 'WIND', symbol: '风', color: '#343434', accent: '#cf292d', points: 12.9, diff: 129.7, games: 22 },
  { name: '雷鸣会', english: 'THUNDER', symbol: '雷', color: '#ad8221', accent: '#e7ca54', points: -92.5, diff: 105.4, games: 20 },
  { name: '白虎社', english: 'TIGER', symbol: '虎', color: '#244867', accent: '#b9b27c', points: -116.2, diff: 23.7, games: 22 },
  { name: '青海队', english: 'OCEAN', symbol: '海', color: '#1990b8', accent: '#76c5e0', points: -141.8, diff: 25.6, games: 20 },
  { name: '赤羽会', english: 'PHOENIX', symbol: '羽', color: '#993b28', accent: '#e28b4f', points: -186.3, diff: 44.5, games: 20 },
  { name: '星河队', english: 'STELLAR', symbol: '星', color: '#174d3e', accent: '#d03146', points: -298.1, diff: 111.8, games: 22 },
];
const names = ['林知远', '陈清和', '周明川', '许望舒', '沈云岚', '陆景行', '苏晚晴', '顾星野', '唐予安', '叶若竹', '夏青禾', '程砚秋', '白书宁', '江月遥', '乔南风', '秦墨言', '方锦年', '宋怀瑾', '何清浅', '韩时雨', '温其羽', '杜知夏', '谢晚舟', '邵清野', '徐柏言', '李初霁', '孟见山', '严可宁', '萧念慈', '袁子衿', '贺星辰', '黎若溪', '易承泽', '陶远山', '尹澄月', '吴青松', '赵一诺', '郑松语', '梁牧云', '季知微'];
const heroGroups = [[4, 2, 6, 7], [0, 1, 8, 5]];
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function emblem(team) {
  return `<svg class="team-emblem" viewBox="0 0 160 150" aria-hidden="true" focusable="false"><path d="m80 9 20 26 34-4-9 30 25 22-33 11-6 34-31-17-31 17-6-34-33-11 25-22-9-30 34 4Z" fill="#141414" stroke="${team.accent}" stroke-width="4"/><path d="m80 21 18 25 25-4-8 22 22 17-29 7-5 25-23-14-23 14-5-25-29-7 22-17-8-22 25 4Z" fill="${team.color}" stroke="${team.accent}" stroke-width="2"/><path d="M36 88h88v31H36Z" fill="#121212" stroke="${team.accent}" stroke-width="3"/><text x="80" y="80" text-anchor="middle" font-family="serif" font-size="47" font-weight="bold" fill="#fff">${team.symbol}</text><text x="80" y="108" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" font-weight="900" letter-spacing="1" fill="${team.accent}">${team.english}</text><path d="m76 4 4-4 4 4-4 4Z" fill="${team.accent}"/><path d="m47 132 33-14 33 14M60 136l20-9 20 9" fill="none" stroke="${team.accent}" stroke-width="2"/></svg>`;
}

function avatar(index) {
  const skin = ['#e8b995', '#d8a482', '#f1c7aa', '#c99371'][index % 4];
  const shirt = teams[index % teams.length].color;
  const background = ['#e9e5ea', '#e5e9ed', '#e6e9e3'][index % 3];
  const longHair = index % 3 === 1;
  return `<svg class="avatar" viewBox="0 0 100 100" role="img" aria-label="${names[index % names.length]}的插画头像"><rect width="100" height="100" fill="${background}"/><path d="M10 105c0-24 13-35 40-35s40 11 40 35" fill="${shirt}"/><path d="m38 69 12 11 12-11-5 25H43Z" fill="#fafafa"/><path d="M43 57h14v19H43Z" fill="${skin}"/>${longHair ? '<path d="M23 45c0-31 12-36 27-36s27 12 27 36l5 37H18Z" fill="#292522"/>' : ''}<ellipse cx="50" cy="42" rx="23" ry="28" fill="${skin}"/><path d="M27 39C19 5 62 0 73 22l3 19-11-11-5-10-8 10-21 1Z" fill="#282523"/><path d="M38 41h5m14 0h5" stroke="#332a28" stroke-width="2.5" stroke-linecap="round"/><path d="M45 56q5 4 10 0" fill="none" stroke="#9b6656" stroke-width="2"/><path d="m21 82 11 20M79 82l-11 20" stroke="#fff" stroke-opacity=".25" stroke-width="3"/></svg>`;
}

$('#carousel-track').innerHTML = heroGroups.map((group, i) => `<div class="match-slide" role="group" aria-roledescription="幻灯片" aria-label="第 ${i + 1} 组，共 2 组" ${i ? 'inert' : ''}><ul class="match-cards">${group.map((id) => { const team = teams[id]; return `<li class="match-card" style="--team-color:${team.color}"><div class="match-emblem">${emblem(team)}</div><div class="match-card-label"><small>${team.english}</small>${team.name}</div></li>`; }).join('')}</ul></div>`).join('');
let currentSlide = 0;
function setSlide(index) {
  currentSlide = (index + heroGroups.length) % heroGroups.length;
  $('#carousel-track').style.transform = `translateX(-${currentSlide * 100}%)`;
  $$('.match-slide').forEach((slide, i) => { slide.inert = i !== currentSlide; });
  $$('[data-slide]').forEach((dot, i) => dot.setAttribute('aria-pressed', String(i === currentSlide)));
  $('#match-round').textContent = currentSlide ? '第二场' : '第一场';
  $('#carousel-status').textContent = `第 ${currentSlide + 1} 组对阵，共 2 组`;
}
$('.carousel-arrow.previous').addEventListener('click', () => setSlide(currentSlide - 1));
$('.carousel-arrow.next').addEventListener('click', () => setSlide(currentSlide + 1));
$$('[data-slide]').forEach((button) => button.addEventListener('click', () => setSlide(Number(button.dataset.slide))));
$('.carousel').addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); setSlide(currentSlide + (event.key === 'ArrowLeft' ? -1 : 1)); }
});
let swipeStart = null;
$('.carousel-window').addEventListener('pointerdown', (event) => { if (event.isPrimary) swipeStart = { x: event.clientX, y: event.clientY }; });
$('.carousel-window').addEventListener('pointerup', (event) => {
  if (!swipeStart) return;
  const dx = event.clientX - swipeStart.x;
  const dy = event.clientY - swipeStart.y;
  if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) setSlide(currentSlide + (dx < 0 ? 1 : -1));
  swipeStart = null;
});
$('.carousel-window').addEventListener('pointercancel', () => { swipeStart = null; });

$('#team-rankings').innerHTML = teams.map((team, i) => `<div class="team-table-row" role="row"><span role="cell" class="rank-badge ${i === 0 ? 'first' : i < 5 ? 'leading' : ''}" data-rank="${i + 1}">${i + 1}</span><span role="cell" class="rank-team">${emblem(team)}<span class="rank-team-name">${team.name}</span></span><span role="cell" class="rank-stat">${team.points.toFixed(1)}<small>pt</small></span><span role="cell" class="rank-stat">${team.diff}${team.diff === '—' ? '' : '<small>pt</small>'}</span><span role="cell" class="rank-stat">${team.games}/120</span></div>`).join('');

const metrics = [
  { title: '个人积分', unit: 'pt', score: (i) => (238.6 - i * 16.9).toFixed(1), offset: 0 },
  { title: '单局最高分', unit: '分', score: (i) => (82500 - i * 1900).toLocaleString('en-US'), offset: 7 },
  { title: '末位回避率', unit: '', score: (i) => Math.max(.2, 1 - Math.max(0, i - 5) * .0134).toFixed(4), offset: 12 },
  { title: '获胜场次', unit: '场', score: (i) => Math.max(0, 5 - Math.floor(i / 4)), offset: 20 },
];
function metricCard(metric, id) {
  return `<article class="metric-card" data-metric="${id}"><h3>${metric.title}</h3><table class="metric-table" aria-label="${metric.title}排行"><thead><tr><th scope="col">名次</th><th scope="col">成员</th><th scope="col">${metric.unit || '比率'}</th></tr></thead><tbody>${names.map((_, i) => { const person = (i + metric.offset) % names.length; return `<tr ${i === 0 ? 'class="top-record"' : ''} ${i >= 7 ? 'class="metric-extra" hidden' : ''}><td><span class="personal-number">${i + 1}</span></td><td><span class="personal-person">${avatar(person)}<span>${names[person]}</span></span></td><td>${metric.score(i)}</td></tr>`; }).join('')}</tbody></table><div class="metric-action"><button class="button more" type="button" aria-expanded="false" aria-label="展开${metric.title}第八名之后的排名" data-metric-toggle="${id}">查看第八名之后</button></div></article>`;
}
$('#personal-ranking').innerHTML = [0, 1].map((pair) => `<div class="ranking-pair" data-pair="${pair}"><div class="ranking-pair-grid">${metrics.slice(pair * 2, pair * 2 + 2).map((metric, i) => metricCard(metric, pair * 2 + i)).join('')}</div><div class="pair-action"><button class="button more" type="button" aria-expanded="false" aria-label="展开${metrics[pair * 2].title}与${metrics[pair * 2 + 1].title}的更多排名" data-pair-toggle="${pair}">查看第八名之后</button></div></div>`).join('');
function setMetric(id, expanded) {
  const card = $(`[data-metric="${id}"]`);
  card.dataset.expanded = String(expanded);
  [...card.querySelectorAll('.metric-extra')].forEach((row) => { row.hidden = !expanded; });
  const button = card.querySelector('[data-metric-toggle]');
  button.setAttribute('aria-expanded', String(expanded));
  button.textContent = expanded ? '收起排名' : '查看第八名之后';
  button.setAttribute('aria-label', `${expanded ? '收起' : '展开'}${metrics[id].title}第八名之后的排名`);
}
$$('[data-metric-toggle]').forEach((button) => button.addEventListener('click', () => {
  const id = Number(button.dataset.metricToggle);
  setMetric(id, button.getAttribute('aria-expanded') !== 'true');
  synchronizePair(Math.floor(id / 2));
}));
function synchronizePair(pair) {
  const button = $(`[data-pair-toggle="${pair}"]`);
  const expanded = $(`[data-metric="${pair * 2}"]`).dataset.expanded === 'true' && $(`[data-metric="${pair * 2 + 1}"]`).dataset.expanded === 'true';
  button.setAttribute('aria-expanded', String(expanded));
  button.textContent = expanded ? '收起排名' : '查看第八名之后';
}
$$('[data-pair-toggle]').forEach((button) => button.addEventListener('click', () => {
  const pair = Number(button.dataset.pairToggle);
  const expanded = button.getAttribute('aria-expanded') !== 'true';
  setMetric(pair * 2, expanded); setMetric(pair * 2 + 1, expanded); synchronizePair(pair);
  button.setAttribute('aria-label', `${expanded ? '收起' : '展开'}${metrics[pair * 2].title}与${metrics[pair * 2 + 1].title}的更多排名`);
}));

const matches = [
  { date: '10/5', day: '一', teamIds: [9, 4, 1, 2] },
  { date: '10/5', day: '一', teamIds: [3, 8, 6, 7] },
  { date: '10/6', day: '二', teamIds: [3, 4, 8, 5] },
  { date: '10/6', day: '二', teamIds: [9, 0, 1, 7] },
  { date: '10/8', day: '四', teamIds: [3, 4, 0, 6] },
  { date: '10/8', day: '四', teamIds: [9, 2, 5, 7] },
  { date: '10/9', day: '五', teamIds: heroGroups[0] },
  { date: '10/9', day: '五', teamIds: heroGroups[1] },
  { date: '10/12', day: '一', teamIds: [1, 3, 6, 9] },
  { date: '10/12', day: '一', teamIds: [0, 2, 4, 7] },
  { date: '10/13', day: '二', teamIds: [0, 5, 7, 9] },
  { date: '10/13', day: '二', teamIds: [1, 2, 6, 8] },
];
$('#schedule-list').innerHTML = matches.map((match, i) => `<li ${i >= 8 ? 'class="extra-match" hidden' : ''}><button class="schedule-row" type="button" data-match="${i}" aria-haspopup="dialog" aria-label="查看${match.date}星期${match.day}的${i < 6 ? '比赛结果' : '对阵信息'}"><span class="schedule-head"><span class="schedule-date">${match.date}<small>（${match.day}）</small></span><span class="schedule-logos">${match.teamIds.map((id, j) => `<span class="schedule-logo ${i < 6 && j !== i % 4 ? 'muted' : ''}">${emblem(teams[id])}<span>${teams[id].name.replace('麻雀', '')}</span></span>`).join('')}</span></span><span class="schedule-names">${match.teamIds.map((id) => teams[id].name).join(' / ')}<span class="schedule-state">${i < 6 ? '查看结果' : '即将开始'}</span></span></button></li>`).join('');
let scheduleExpanded = false;
$('#schedule-more').addEventListener('click', (event) => {
  scheduleExpanded = !scheduleExpanded;
  $$('.extra-match').forEach((row) => { row.hidden = !scheduleExpanded; });
  event.currentTarget.setAttribute('aria-expanded', String(scheduleExpanded));
  event.currentTarget.textContent = scheduleExpanded ? '收起赛程' : '更多赛程';
});

function updateScrollLock() {
  document.body.classList.toggle('menu-open', $('.navigation').classList.contains('open') || !!$('dialog[open]'));
}
function openDialog(dialog) { dialog.showModal(); updateScrollLock(); }
$$('dialog').forEach((dialog) => {
  dialog.querySelectorAll('[data-close]').forEach((button) => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('close', updateScrollLock);
  dialog.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
});
$$('[data-match]').forEach((button) => button.addEventListener('click', () => {
  const i = Number(button.dataset.match);
  const match = matches[i];
  const completed = i < 6;
  $('#results-title').innerHTML = `${match.date}<small>（${match.day}）</small>`;
  $('#result-columns').innerHTML = [0, 1].map((round) => `<section class="result-column"><h3>第${round ? '二' : '一'}场${completed ? '' : ' · 待开始'}</h3><ol class="result-list">${match.teamIds.map((id, j) => { const person = (i * 3 + j + round * 5) % names.length; const score = [63.2, 8.6, -20.4, -51.4][j] + round * (j === 0 ? .2 : -.1); return `<li><span class="rank-badge ${j === 0 ? 'first' : j < 3 ? 'leading' : ''}">${completed ? j + 1 : '·'}</span><span class="result-avatar">${avatar(person)}${emblem(teams[id])}</span><span class="result-name">${names[person]}<small>${completed ? `${score < 0 ? '▲' : ''}${Math.abs(score).toFixed(1)}pt` : teams[id].name}</small></span></li>`; }).join('')}</ol></section>`).join('');
  openDialog($('#results-dialog'));
}));

const news = [
  { title: '秋日牌局 · 城市交流会即将开启，和伙伴一起相聚桌前', date: '2026.10.02', image: 'news-autumn.svg', body: '秋日的第一场相聚，从一副麻将开始。城市交流会将在四个周末陆续举行，队伍与观众一起交流策略，分享竞技中的灵感与乐趣。期待与你在桌前相遇。' },
  { title: '新赛季，新的相遇。十支队伍准备就绪！', date: '2026.09.15', image: 'news-season.svg', body: '熟悉的热爱，崭新的征程。十支队伍将在这个赛季轮流登场，用各自的风格与团队默契带来精彩对局。新的故事，正等待下一张牌来揭晓。' },
  { title: '专注每一刻，感受每一局。全新赛季主题公开', date: '2026.09.11', image: 'news-focus.svg', body: '判断、勇气与默契，是牌局中的共同语言。本赛季以「专注每一刻」为主题，记录比赛中的细节，也记录为队伍加油的每一份热情。' },
  { title: '在变化中寻找答案：队伍训练日记', date: '2026.09.08', image: 'news-focus.svg', body: '从一次复盘到下一次选择，进步藏在每一处细节中。跟随队伍的训练日记，了解桌前的专注与桌后的思考。' },
  { title: '一起见证下一场精彩 · 联盟伙伴见面日', date: '2026.09.05', image: 'news-season.svg', body: '每一场精彩比赛背后，都有支持者的陪伴。联盟伙伴见面日，邀请大家一起分享这个赛季的期待。' },
  { title: '周末的好时光，从一场友谊牌局开始', date: '2026.09.01', image: 'news-autumn.svg', body: '相聚、交流、互相学习。用一个周末的时间，与伙伴一起感受麻将带来的乐趣。' },
];
$('#news-grid').innerHTML = news.map((article, i) => `<li ${i >= 3 ? 'class="extra-news" hidden' : ''}><button class="news-card" type="button" data-news="${i}" aria-haspopup="dialog"><span class="news-media"><img src="${asset(article.image)}" alt="${['秋日交流会绿色主题海报', '新赛季队伍集合插画', '黑白麻将主题海报'][i % 3]}" width="624" height="428" loading="lazy" /></span><time class="news-date" datetime="${article.date.replaceAll('.', '-')}">${article.date}</time><h3>${article.title}</h3></button></li>`).join('');
let newsExpanded = false;
$('#news-more').addEventListener('click', (event) => {
  newsExpanded = !newsExpanded;
  $$('.extra-news').forEach((card) => { card.hidden = !newsExpanded; });
  event.currentTarget.setAttribute('aria-expanded', String(newsExpanded));
  event.currentTarget.textContent = newsExpanded ? '收起资讯' : '更多资讯';
});
function showInfo(title, html) { $('#info-title').textContent = title; $('#info-body').innerHTML = html; openDialog($('#info-dialog')); }
$$('[data-news]').forEach((button) => button.addEventListener('click', () => {
  const article = news[Number(button.dataset.news)];
  showInfo(article.title, `<img src="${asset(article.image)}" alt="" /><p>${article.body}</p>`);
}));

const partnerMarks = [['晴空日报', ''], ['WIN / PLAY', 'italic'], ['VECTOR', 'serif'], ['森之味', 'serif'], ['QUANTUM', 'accent'], ['安信保障', ''], ['JT', 'large serif'], ['DAILY FOOD', 'spaced'], ['明日生活', ''], ['HEART / BEAT', 'spaced'], ['O.TICKET', ''], ['PAPER & INK', 'serif'], ['LUMI', ''], ['little room', 'italic'], ['好食光', '']];
const ownerMarks = [['EARTH', 'accent'], ['青山文化', ''], ['KINO', 'block'], ['RiverAgent', ''], ['PLAY SAMMY', ''], ['sky media', 'accent'], ['WEST', ''], ['白羽', ''], ['BS NEXT', 'block'], ['U · WAVE', '']];
$('#partner-grid').innerHTML = partnerMarks.map(([name, style], i) => `<li><span class="partner-wordmark ${style}">${name}${i % 3 === 0 ? '<small>OFFICIAL PARTNER</small>' : ''}</span></li>`).join('');
$('#owner-grid').innerHTML = ownerMarks.map(([name, style]) => `<li><span class="partner-wordmark ${style}">${name}</span></li>`).join('');
const info = {
  '联系我们': '欢迎分享你的观赛体验与建议。联盟服务将陆续开放，感谢你的关注与支持。',
  '隐私说明': '本页面不会向服务器发送会员表单内容，也不收集你的个人资料。',
  '使用条款': '本页面的队伍、成员、积分和资讯均为示例内容，仅供浏览与体验。',
  '常见问题': '如何查看排名？点击排行榜下方的按钮即可展开更多记录。如何查看赛程？点击对阵记录可打开当日信息，点击弹窗右上角即可返回。',
};
$$('[data-info]').forEach((button) => button.addEventListener('click', () => showInfo(button.dataset.info, `<p>${info[button.dataset.info]}</p>`)));
$$('[data-social]').forEach((button) => button.addEventListener('click', () => showInfo(button.dataset.social, '<p>精彩来自每一局，也来自每一位伙伴。欢迎关注联盟的新消息，与我们一起期待下一场相遇。</p>')));
$$('[data-login]').forEach((button) => button.addEventListener('click', () => { closeMenu(); openDialog($('#login-dialog')); }));
$('#login-form').addEventListener('submit', (event) => { event.preventDefault(); $('#login-feedback').textContent = '会员服务暂未开放，感谢你的关注。'; });

const menuButton = $('.menu-toggle');
const navigation = $('.navigation');
const mobileQuery = matchMedia('(max-width: 767px)');
function closeMenu(restoreFocus = false) {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', '打开导航菜单');
  updateScrollLock();
  if (restoreFocus) menuButton.focus();
}
menuButton.addEventListener('click', () => {
  const opening = !navigation.classList.contains('open');
  navigation.classList.toggle('open', opening);
  menuButton.setAttribute('aria-expanded', String(opening));
  menuButton.setAttribute('aria-label', opening ? '关闭导航菜单' : '打开导航菜单');
  updateScrollLock();
  if (opening) navigation.querySelector('button, a').focus();
});
navigation.addEventListener('click', (event) => { if (event.target === navigation || event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', (event) => {
  if (!navigation.classList.contains('open')) return;
  if (event.key === 'Escape') { event.preventDefault(); closeMenu(true); }
  if (event.key === 'Tab') {
    const focusable = [menuButton, ...navigation.querySelectorAll('a, button')];
    const first = focusable[0]; const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
mobileQuery.addEventListener('change', () => closeMenu());

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let parallaxPending = false;
function updateParallax() {
  parallaxPending = false;
  const y = window.scrollY;
  const mobile = mobileQuery.matches;
  const translate = reducedMotion.matches ? 0 : y / (mobile ? 10 : 2);
  const rotate = reducedMotion.matches ? 0 : y / (mobile ? 15 : 10);
  $('.flower-right img').style.transform = `translateY(${translate}px) rotate(${rotate}deg)`;
  $('.flower-left img').style.transform = `translateY(${translate}px) rotate(${-rotate}deg)`;
}
window.addEventListener('scroll', () => { if (!parallaxPending) { parallaxPending = true; requestAnimationFrame(updateParallax); } }, { passive: true });
mobileQuery.addEventListener('change', updateParallax);
reducedMotion.addEventListener('change', updateParallax);
updateParallax();

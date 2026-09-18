import { createScore } from './score.js';
import { createNarrator } from './narrator.js';
const $ = id => document.getElementById(id);
const defaultFields = ['origin', 'species'];
const fieldData = {
  origin: { label: 'Origine', value: 'Massif des Vosges', source: 'Gestionnaire forestier · déclaration du lot' },
  species: { label: 'Essence', value: 'Épicéa', source: 'Scierie · fiche de production' },
  price: { label: 'Prix d’achat', value: 'Montant fictif', source: 'Scierie · information commerciale' }
};
const chapters = [
  {name:'Les données', eyebrow:'PARTIR DES USAGES', title:'Du bois pour une école.<br><em>Une histoire à relier.</em>', subtitle:'De la forêt au bâtiment, chaque acteur produit des informations utiles aux autres.', duration:18,
   mode:'LES SYSTÈMES DE LA FILIÈRE',description:'Chaque acteur gère ses données.', label:'LE POINT DE DÉPART', heading:'Des outils pour chaque métier.', body:'Gestion forestière, suivi logistique, logiciel de scierie, maquette numérique : chacun travaille dans son environnement.', takeaway:'Relier ces informations pour agir ensemble.',
   narration:['Pour construire l’École des Tilleuls, il faut du bois. Et pour connaître ce bois, il faut relier son histoire.','Suivons le lot B-042. De la forêt à la scierie, puis au chantier, chaque acteur détient une partie des informations.'],panel:'actors'},
  {name:'La plateforme',eyebrow:'ORGANISER ET EXPLOITER',title:'Une plateforme<br><em>rassemble et outille.</em>',subtitle:'Un environnement centralisé peut réunir des données pour un usage précis.',duration:20,
   mode:'UN MODÈLE CENTRALISÉ ILLUSTRATIF',description:'Des données sont réunies dans un service commun.',label:'LA PLATEFORME DE DONNÉES',heading:'Une vue d’ensemble utile.',body:'Un opérateur organise les données et les services : suivi d’activité, tableaux de bord ou analyse des approvisionnements.',takeaway:'La plateforme facilite un usage métier dans un environnement organisé.',
   narration:['Les informations convergent vers une plateforme. Elle les rassemble pour produire un service utile.','Dans cet exemple, un tableau de bord permet de suivre l’approvisionnement en bois.'],panel:'platform'},
  {name:'La coopération',eyebrow:'CHANGER D’ÉCHELLE',title:'Quand plusieurs acteurs<br><em>veulent coopérer.</em>',subtitle:'Les questions portent aussi sur les décisions, les accès et la possibilité de changer d’outil.',duration:18,
   mode:'DES CONDITIONS À EXAMINER',description:'Les réponses dépendent des outils et des accords.',label:'LE BESOIN COLLECTIF',heading:'Qui fixe les règles ?',body:'À mesure que la coopération s’étend, il faut s’accorder sur les usages, la visibilité des échanges et les conditions de connexion.',takeaway:'Le nombre d’acteurs et la sensibilité des données orientent le choix.',
   narration:['Qui décide de l’accès ? Qui peut réutiliser une donnée ? Comment relier des outils différents ?','Ces questions dépendent de l’architecture et des accords. Elles deviennent centrales dans un projet de filière.'],panel:'questions'},
  {name:'Le DataSpace',eyebrow:'CONSTRUIRE LA CONFIANCE',title:'Des acteurs autonomes.<br><em>Des règles communes.</em>',subtitle:'Le futur DataSpace DataWood relierait les organisations et leurs outils dans un cadre de coopération partagé.',duration:22,
   mode:'UN ÉCOSYSTÈME FÉDÉRÉ',description:'Les outils restent chez les acteurs. Le cadre est commun.',label:'LE DATASPACE',heading:'La coopération s’organise.',body:'Les participants définissent les règles de participation, les responsabilités, les standards et le financement des services communs.',takeaway:'Un connecteur relie un système aux échanges autorisés.',
   narration:['Chaque acteur conserve ses outils. Des portes d’échange, les connecteurs, relient leurs systèmes.','Une gouvernance commune organise les règles. Les participants choisissent les accès à leurs données dans ce cadre.'],panel:'governance'},
  {name:'Le catalogue',eyebrow:'DÉCOUVRIR CE QUI EXISTE',title:'Trouver la donnée.<br><em>Connaître ses conditions.</em>',subtitle:'Pour son chantier, le constructeur cherche des informations sur un lot de bois.',duration:19,
   mode:'LE CATALOGUE DÉCRIT LES OFFRES',description:'Les pointillés représentent des descriptions de données.',label:'DÉCOUVERTE',heading:'Une fiche, une source.',body:'Le catalogue indique quelles données sont proposées, qui les fournit et comment demander l’accès.',takeaway:'Le catalogue référence les offres. Les sources restent gérées par leurs détenteurs.',
   narration:['Le constructeur repère la fiche du lot B-042, publiée par la scierie.','Il voit les informations disponibles et les conditions proposées. Il peut maintenant demander l’accès.'],panel:'catalogue'},
  {name:'Les accès',eyebrow:'CHOISIR CE QUE L’ON PARTAGE',title:'La bonne information.<br><em>Au bon destinataire.</em>',subtitle:'Vous êtes la scierie. Choisissez les champs accessibles au constructeur pour son chantier.',duration:24,
   mode:'DES ACCÈS SELON UN ACCORD',description:'La sélection détermine les données de l’échange simulé.',label:'À VOUS DE CHOISIR',heading:'Vous définissez les accès.',body:'Destinataire : constructeur identifié. Finalité : préparation du dossier du chantier « École des Tilleuls ».',takeaway:'Les conditions peuvent ensuite être appliquées automatiquement.',
   narration:['L’origine et l’essence sont proposées pour ce chantier. Le prix d’achat reste protégé par défaut.','Vous pouvez modifier ce choix. Seules les informations autorisées seront transmises dans la simulation.'],panel:'permission'},
  {name:'L’échange',eyebrow:'ÉCHANGER ET RETROUVER LA SOURCE',title:'Des outils compatibles.<br><em>Un échange traçable.</em>',subtitle:'Les champs autorisés alimentent le dossier du constructeur, avec leur provenance.',duration:22,
   mode:'UN ÉCHANGE ENTRE SYSTÈMES',description:'Les informations autorisées circulent entre les connecteurs.',label:'REÇU D’ÉCHANGE · SIMULATION',heading:'Le dossier se construit.',body:'Des formats et définitions partagés rendent les données compréhensibles par les outils du destinataire.',takeaway:'La trace documente l’échange. La qualité des informations reste à vérifier.',
   narration:['Le connecteur transmet les informations autorisées. Un langage commun permet au logiciel du constructeur de les comprendre.','Chaque information reçue conserve sa source. Les obligations d’usage reposent aussi sur les accords et les contrôles.'],panel:'receipt'},
  {name:'L’interconnexion',eyebrow:'COOPÉRER AU-DELÀ DE LA FILIÈRE',title:'Un espace forêt-bois.<br><em>Des connexions possibles.</em>',subtitle:'Des échanges pourraient relier DataWood à un espace de données de la construction ou des territoires.',duration:18,
   mode:'UNE INTERCONNEXION ENVISAGEABLE',description:'Standards compatibles et accords entre espaces.',label:'L’INTEROPÉRABILITÉ',heading:'Un pont à construire.',body:'La compatibilité technique, le sens des données et les accords d’usage rendent possible la coopération entre espaces.',takeaway:'L’interconnexion dépend de règles et de choix techniques compatibles.',
   narration:['Le réseau forêt-bois pourrait coopérer avec un espace de données de la construction.','Ce pont se construit avec des standards compatibles et des accords. Il représente ici une possibilité future.'],panel:'bridge'},
  {name:'La complémentarité',eyebrow:'RETENIR L’ESSENTIEL',title:'Des outils pour chacun.<br><em>Un espace pour coopérer.</em>',subtitle:'Les plateformes métier et le DataSpace apportent des fonctions complémentaires.',duration:19,
   mode:'LA CIBLE DATAWOOD',description:'Outils existants + cadre commun + échanges utiles.',label:'UNE TRAJECTOIRE COLLECTIVE',heading:'Construire sur l’existant.',body:'Les plateformes organisent les usages métier. Le DataSpace encadre la coopération entre plusieurs organisations et services.',takeaway:'DataWood prépare ce cadre collectif avec les acteurs de la filière.',
   narration:['Les plateformes restent utiles au quotidien. Le DataSpace permet de coopérer au-delà de chacune d’elles.','Pour DataWood : connecter les initiatives, définir les règles ensemble et rendre possibles des usages partagés.'],panel:'summary'}
];
let chapter=0,elapsed=0,playing=false,hasStarted=false,selected=[...defaultFields],shared=[...defaultFields],engine=null,last=performance.now(),motionTime=0,inspecting=false;
let reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let decisionConfirmed=false;
const score=createScore($('music'));
const narrator=createNarrator((active,label)=>{$('voice').textContent=label;$('voice').setAttribute('aria-pressed',String(active));});
document.body.dataset.started='false';
document.body.dataset.reduced=String(reduced);
function showDetails(open){document.body.dataset.details=String(open);$('details').setAttribute('aria-expanded',String(open));}
$('details').onclick=()=>{setPlaying(false);showDetails(document.body.dataset.details!=='true');};
$('close-details').onclick=()=>{showDetails(false);$('details').focus();};
$('voice').onclick=()=>narrator.toggle();
$('start-film').onclick=()=>setPlaying(true);
const total=chapters.reduce((n,c)=>n+c.duration,0);
const actorInfos=[
 ['Gestion forestière','Le gestionnaire renseigne l’origine et l’essence des lots dans ses outils. Il définit les conditions de mise à disposition.'],
 ['Transport','Le transporteur suit le chargement et la livraison dans son outil logistique. Il peut partager les informations convenues.'],
 ['Scierie','La scierie gère production, lots et informations commerciales. Les champs peuvent avoir des règles d’accès différentes.'],
 ['Construction','Le constructeur utilise ses propres logiciels et réunit les informations autorisées pour préparer ses dossiers.'],
 ['Expertise','Les organismes techniques apportent des méthodes et des référentiels. La provenance des données aide à les interpréter.']
];
const nav=$('chapters');
chapters.forEach((c,i)=>{const b=document.createElement('button');b.type='button';b.textContent=String(i+1).padStart(2,'0');b.title=c.name;b.setAttribute('aria-label',`Scène ${i+1} : ${c.name}`);b.onclick=()=>go(i,true);nav.append(b);});
function panelHTML(type){
 const rows=items=>`<ul class="rows">${items.map(([a,b])=>`<li><strong>${a}</strong><span>${b}</span></li>`).join('')}</ul>`;
 if(type==='actors')return rows([['Origine','Gestion forestière'],['Production','Scierie'],['Usage','Construction']]);
 if(type==='platform')return `<div class="data-card"><header>EXEMPLE DE SERVICE <span class="stamp">Plateforme</span></header><h3>Suivi des approvisionnements</h3>${rows([['Lots','Vue regroupée'],['Livraisons','Suivi commun'],['Activité','Tableau de bord']])}</div>`;
 if(type==='questions')return rows([['Décision','Qui fixe les règles ?'],['Visibilité','Qui accède à quoi ?'],['Portabilité','Comment changer d’outil ?']])+`<p class="small-note">Ces enjeux varient selon les plateformes et les contrats.</p>`;
 if(type==='governance')return rows([['Identités','Participants reconnus'],['Charte','Décisions et responsabilités'],['Standards','Langage et formats'],['Pérennité','Financement des services']]);
 if(type==='catalogue')return `<div class="data-card"><header>OFFRE DE DONNÉES <span class="stamp">Catalogue</span></header><h3>Lot B-042 · bois de structure</h3><p>Fournisseur : scierie participante</p>${rows([['Disponibles','Origine · essence'],['Accès','Sur accord d’usage']])}<p>Cette fiche décrit une offre ; elle contient un lien vers la source.</p></div>`;
 if(type==='permission')return `<form class="permission-form"><fieldset><legend>Informations accessibles au constructeur</legend>${Object.entries(fieldData).map(([id,f])=>`<label><input type="checkbox" value="${id}" ${selected.includes(id)?'checked':''}>${f.label}<span>${id==='price'?'Sensible':'Dossier chantier'}</span></label>`).join('')}</fieldset><button type="submit" ${selected.length?'':'disabled'}>Simuler l’échange →</button><p class="small-note" id="selection-status" role="status">${selected.length} champ(s) autorisé(s). Toute modification met le récit en pause.</p></form>`;
 if(type==='receipt')return `<div class="mapping">${shared.includes('species')?'essence <span>→</span> essence du produit':shared.includes('origin')?'origin <span>→</span> origine du lot':shared.includes('price')?'purchase_price <span>→</span> prix d’achat':'Aucun champ autorisé'}</div><div class="data-card"><header>LOT B-042 <span class="stamp">${shared.length?'Accord simulé':'Aucun partage'}</span></header>${Object.entries(fieldData).map(([id,f])=>shared.includes(id)?`<div class="receipt-row"><strong>${f.label}</strong><span>${f.value}</span><small>Source : ${f.source}</small></div>`:`<div class="receipt-row excluded"><span>${f.label}</span><span>Non transmis</span></div>`).join('')}<p>Scierie → Constructeur<br>Finalité : dossier du chantier</p></div>`;
 if(type==='bridge')return rows([['Formats','Compatibles'],['Définitions','Partagées'],['Accords','Entre participants']])+`<p class="small-note">Aucune connexion réelle ou conformité Gaia-X n’est annoncée.</p>`;
 return rows([['Les plateformes','Organiser les usages'],['Le DataSpace','Encadrer la coopération'],['Les participants','Choisir les accès']])+`<p class="small-note">Une cible à construire avec la filière.</p>`;
}
function renderPanel(){const c=chapters[chapter];$('insight-label').textContent=c.label;$('insight-title').textContent=c.heading;$('insight-body').textContent=c.body;$('takeaway').textContent=c.takeaway;$('panel').innerHTML=panelHTML(c.panel);if(c.panel==='permission'){
 const form=$('panel').querySelector('form');form.onchange=()=>{selected=[...form.querySelectorAll('input:checked')].map(x=>x.value);setPlaying(false);form.querySelector('button').disabled=selected.length===0;$('selection-status').textContent=selected.length?`${selected.length} champ(s) autorisé(s). Les autres restent protégés.`:'Aucune donnée autorisée. Sélectionnez un champ pour simuler un échange.';engine?.setSelection(selected);};
 form.onsubmit=e=>{e.preventDefault();if(!selected.length)return;shared=[...selected];decisionConfirmed=true;go(6,true);setPlaying(true);};
}}
function inspectActor(i){showDetails(true);setPlaying(false);inspecting=true;$('insight-label').textContent='ZOOM SUR UN PARTICIPANT';$('insight-title').textContent=actorInfos[i][0];$('insight-body').textContent=actorInfos[i][1];$('panel').innerHTML='<button class="inspect-close">Revenir à la scène</button>';$('panel').querySelector('button').onclick=()=>{inspecting=false;renderPanel();engine?.selectActor(-1);};engine?.selectActor(i);}
function updateUI(){const c=chapters[chapter];$('previous').disabled=chapter===0;$('next').disabled=chapter===chapters.length-1;$('play').innerHTML=playing?'Pause <span>Ⅱ</span>':chapter===8&&elapsed>=c.duration?'Rejouer <span>↺</span>':hasStarted?'Reprendre <span>▶</span>':'Lancer le récit <span>▶</span>';$('play').setAttribute('aria-label',playing?'Mettre le récit en pause':chapter===8&&elapsed>=c.duration?'Rejouer le récit':'Lire le récit');}
function setPlaying(value){if(value&&chapter===5&&elapsed>=chapters[5].duration&&!decisionConfirmed){$('panel').querySelector('button')?.focus();return;}playing=value;score.setPlaying(value);if(!value)narrator.pause();if(value){hasStarted=true;document.body.dataset.started='true';$('film-intro').hidden=true;inspecting=false;renderPanel();}updateUI();}
function go(index,manual=false){if(index<0||index>=chapters.length)return;if(chapter===5&&index===6&&!decisionConfirmed){setPlaying(false);$('panel').querySelector('button')?.focus();return;}narrator.cancel();showDetails(false);if(manual)setPlaying(false);if(chapter===5&&index===6)shared=[...selected];chapter=index;if(index===0)score.reset();if(index===5)decisionConfirmed=false;document.body.dataset.decision=String(index===5);if(index===6)showDetails(true);elapsed=0;inspecting=false;const c=chapters[chapter];$('stage').dataset.chapter=String(chapter);$('eyebrow').textContent=`${String(chapter+1).padStart(2,'0')} · ${c.eyebrow}`;$('title').innerHTML=c.title;const headline=document.querySelector('.headline');headline.classList.remove('reveal');void headline.offsetWidth;headline.classList.add('reveal');$('subtitle').textContent=c.subtitle;$('world-mode').textContent=c.mode;$('world-description').textContent=c.description;$('scene').setAttribute('aria-label',`${c.mode}. ${c.description}`);$('chapter-name').textContent=c.name;$('narration-index').textContent=String(chapter+1).padStart(2,'0');$('narration-text').textContent=c.narration[0];[...nav.children].forEach((b,i)=>{if(i===chapter)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});renderPanel();$('insight').scrollTop=0;engine?.setChapter(chapter,shared);engine?.selectActor(-1);updateUI();updateProgress();if(manual&&matchMedia('(max-width:740px)').matches)window.scrollTo({top:0,behavior:'instant'});}
function updateProgress(){let before=0;for(let i=0;i<chapter;i++)before+=chapters[i].duration;const seconds=Math.min(total,before+elapsed);const fmt=n=>`${String(Math.floor(n/60)).padStart(2,'0')}:${String(Math.floor(n%60)).padStart(2,'0')}`;$('time').textContent=`${fmt(seconds)} / ${fmt(total)}`;[...nav.children].forEach((b,i)=>b.style.setProperty('--fill',i<chapter?1:i===chapter?elapsed/chapters[i].duration:0));}
$('play').onclick=()=>{if(chapter===8&&elapsed>=chapters[8].duration){selected=[...defaultFields];shared=[...defaultFields];go(0);}setPlaying(!playing);};$('previous').onclick=()=>go(chapter-1,true);$('next').onclick=()=>go(chapter+1,true);
$('motion').setAttribute('aria-pressed',String(reduced));$('motion').onclick=()=>{reduced=!reduced;document.body.dataset.reduced=String(reduced);$('motion').setAttribute('aria-pressed',String(reduced));engine?.setReduced(reduced);};
$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{$('fullscreen').textContent='Plein écran indisponible';}};document.addEventListener('fullscreenchange',()=>{$('fullscreen').textContent=document.fullscreenElement?'Quitter le plein écran':'Plein écran';});
function toggleSources(open){$('sources').hidden=!open;$('sources-toggle').setAttribute('aria-expanded',String(open));if(open){setPlaying(false);$('sources').scrollIntoView({behavior:reduced?'instant':'smooth'});}else{$('sources-toggle').focus();}}$('sources-toggle').onclick=()=>toggleSources($('sources').hidden);$('sources-close').onclick=()=>toggleSources(false);
document.addEventListener('keydown',e=>{if(/INPUT|BUTTON|A|TEXTAREA|SELECT/.test(e.target.tagName)||e.altKey||e.ctrlKey||e.metaKey)return;if(e.code==='Space'){e.preventDefault();$('play').click();}if(e.code==='ArrowRight'){e.preventDefault();go(chapter+1,true);}if(e.code==='ArrowLeft'){e.preventDefault();go(chapter-1,true);}});
document.addEventListener('visibilitychange',()=>{last=performance.now();if(document.hidden)setPlaying(false);});
window.addEventListener('pagehide',()=>narrator.cancel());
function tick(now){
 requestAnimationFrame(tick);const dt=Math.min((now-last)/1000,.1);last=now;if(document.hidden)return;
 const c=chapters[chapter];const midpoint=c.duration*.51;
 if(playing){
  const part=elapsed>=midpoint?1:0;
  narrator.speak(c.narration[part],`${chapter}:${part}`);
  const boundary=part===0?midpoint:c.duration;
  elapsed=Math.min(elapsed+dt,narrator.busy?boundary-.001:boundary);
  motionTime+=dt;
  if(elapsed>=c.duration){
   if(chapter===5){setPlaying(false);$('selection-status').textContent='Le film attend votre choix. Validez les informations à transmettre.';$('panel').querySelector('button')?.focus();}
   else if(chapter<8)go(chapter+1);
   else setPlaying(false);
  }
  updateProgress();
 }
 const active=chapters[chapter];const caption=active.narration[elapsed>=active.duration*.51?1:0];
 if($('narration-text').textContent!==caption)$('narration-text').textContent=caption;
 score.render(dt,narrator.busy);
 engine?.setProgress(elapsed/active.duration);
 engine?.render(dt,motionTime,playing);
}

go(0);requestAnimationFrame(tick);
try{const {createWorld}=await import('./world.js');engine=createWorld({container:$('scene'),labels:$('scene-labels'),tag:$('flow-tag'),onActor:inspectActor,onFallback:()=>{$('fallback').hidden=false;},reduced});engine.setChapter(chapter,shared);}catch(error){console.error('La vue 3D est indisponible.',error);$('fallback').hidden=false;}

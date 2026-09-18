// Conducteur du film. La voix est l'horloge : chaque piste audio porte l'horodatage de
// ses segments, et tout ce que l'on voit — scène, texte à l'écran, gestes proposés —
// se déduit à chaque image de l'endroit où en est la voix.
import { creerMonde } from './monde.js';

const $ = id => document.getElementById(id);
const parametres = new URLSearchParams(location.search);
const essai = parametres.has('essai'); // banc d'essai : la boucle tourne même page masquée
const [manifeste, interactions] = await Promise.all(
  ['donnees/manifest.json', 'donnees/interactions.json'].map(u => fetch(u).then(r => r.json())));

const TABLEAUX = [
  { court: 'D’où vient ce bois ?', titre: '« D’où vient<br><em>ce bois ? »</em>', pieces: ['01'] },
  { court: 'La grosse base de données', titre: 'Pourquoi une grosse base de données<br><em>ne ferait pas l’affaire ?</em>', pieces: ['02'] },
  { court: 'Ne rien déplacer', titre: 'L’autre idée :<br><em>ne rien déplacer.</em>', pieces: ['03'] },
  { court: 'À vous de décider', titre: 'À vous<br><em>de décider.</em>', pieces: ['04-demandes', '04-resultat'] },
  { court: 'Retour à lundi matin', titre: 'Retour à<br><em>lundi matin.</em>', pieces: ['05'] },
  { court: 'Qui fixe les règles ?', titre: 'Qui fixe<br><em>les règles ?</em>', pieces: ['06'] },
];
const FICHES = {
  forestier: { titre: 'Le forestier', sait: ['Parcelle 12 · massif des Vosges', 'Coupe de février', 'Essence : épicéa'], ignore: 'Il ne sait pas où le bois a été livré, ni ce qu’il est devenu.' },
  transporteur: { titre: 'Le transporteur', sait: ['Chargé en forêt le 3 mars', '28 m³ livrés à la scierie'], ignore: 'Il ne sait pas de quelle parcelle vient le bois, ni à quel chantier il servira.' },
  scierie: { titre: 'La scierie — vous', sait: ['Lot B-042', 'Scié en 45 × 145', 'Vendu au constructeur de l’école'], ignore: 'Pour la parcelle d’origine, il vous faut appeler le forestier.' },
};
const DEMANDES = [
  { id: 'constructeur', qui: 'Le constructeur de l’école', court: 'Constructeur', veut: 'L’origine et l’essence du bois', pourquoi: 'Le dossier de son chantier', bulle: 'Origine et essence ?',
    champs: [{ id: 'origine', nom: 'Origine', valeur: 'Massif des Vosges' }, { id: 'essence', nom: 'Essence', valeur: 'Épicéa' }] },
  { id: 'negociant', qui: 'Un négociant voisin', court: 'Négociant', veut: 'Vos prix d’achat', pourquoi: 'Une étude de marché', bulle: 'Vos prix d’achat ?',
    champs: [{ id: 'prix', nom: 'Prix d’achat', valeur: 'montant fictif' }] },
  { id: 'interpro', qui: 'L’interprofession', court: 'Interprofession', veut: 'Vos volumes, sans votre nom', pourquoi: 'Son observatoire de filière', bulle: 'Vos volumes, sans votre nom ?',
    champs: [{ id: 'volumes', nom: 'Volumes sciés, anonymisés', valeur: '4 200 m³ sur l’année' }] },
];
const PAR_DEFAUT = { constructeur: ['origine', 'essence'], negociant: [], interpro: ['volumes'] };
const REGLES = ['On entre parce qu’on l’a choisi.', 'On peut refuser une demande, sans se justifier.', 'On sort quand on veut.', 'Les règles se décident entre participants.'];

// ── Pistes : segments, phrases et leurs instants ─────────────────────────────
const pieces = manifeste.pieces.map(p => ({
  ...p,
  segments: p.segments.map(s => {
    const phrases = s.text.split(/(?<=[.?!])\s+/), total = s.text.length, fin = Math.max(s.start + .4, s.end - .45);
    let cumul = 0;
    return { ...s, phrases: phrases.map(texte => { const debut = s.start + (fin - s.start) * cumul / total; cumul += texte.length + 1; return { texte, debut }; }) };
  }),
}));
const indexPiece = id => pieces.findIndex(p => p.piece === id);
const tableauDe = i => TABLEAUX.findIndex(t => t.pieces.includes(pieces[i].piece));
const dureeTotale = pieces.reduce((n, p) => n + p.duration, 0);
const pistes = pieces.map(p => { const a = new Audio(`audio/${p.file}`); a.preload = 'auto'; return a; });

// ── État ─────────────────────────────────────────────────────────────────────
let iPiece = 0, t = 0, enLecture = false, demarre = false, attente = null, finTraitee = false, panne = false;
let panneau = null, pauseParPanneau = false, cartesVisibles = 0, dernier = performance.now(), monde = null;
let projection = parametres.has('projection'), reduit = matchMedia('(prefers-reduced-motion: reduce)').matches, voixActive = true;
let pos = { iSeg: 0, iPhrase: 0 }, cleEcran = '', minuterieRetour = 0;
const etat = nouvelEtat();
function nouvelEtat() { return { visites: new Set(), verse: false, repris: false, fiches: new Set(), reponse: null, decisions: { constructeur: null, negociant: null, interpro: null }, decide: false, retraits: new Set(), gestes: new Set() }; }
const accorde = id => etat.decisions[id] || [];
const piece = () => pieces[iPiece];

function situer() {
  const p = piece();
  let iSeg = 0;
  p.segments.forEach((s, i) => { if (t >= s.start) iSeg = i; });
  let iPhrase = 0;
  p.segments[iSeg].phrases.forEach((ph, i) => { if (t >= ph.debut) iPhrase = i; });
  pos = { iSeg, iPhrase };
}
// Vrai dès que la voix a atteint cette phrase de ce segment (dans la piste en cours).
function vu(cle, phrase = 0) {
  const i = piece().segments.findIndex(s => s.key === cle);
  return i >= 0 && (pos.iSeg > i || (pos.iSeg === i && pos.iPhrase >= phrase));
}

// ── Mise en scène : ce que la scène doit montrer à cet instant ───────────────
function mise() {
  const m = { liens: {}, bulles: {}, marques: {}, ecran: [], camera: { x: 0, z: 0, envergure: 11 }, halo: [] };
  const id = piece().piece;
  const contexte = () => Object.assign(m, { ancres: true, annuaire: true, livret: true, anneau: true });

  if (id === '01') {
    m.camera = { x: -.4, z: .5, envergure: 10.4 };
    m.sonnerie = !vu('1b'); m.accent = 'scierie';
    m.bulles.constructeur = 'D’où vient ce bois ?'; m.liens['appel-client'] = 1;
    if (vu('1b', 1)) m.ecran.push('La réponse existe. Elle est éparpillée.');
    if (vu('1b', 2)) m.marques.forestier = 'La parcelle';
    if (vu('1b', 3)) m.marques.transporteur = 'La livraison';
    if (vu('1b', 4)) m.marques.scierie = 'Le sciage';
    if (vu('1c')) { m.liens['appel-forestier'] = 1; m.liens['appel-transporteur'] = 1; }
    if (vu('1c', 1)) m.ecran.push('Et la semaine prochaine, la même question.');
  }
  if (id === '02') {
    m.camera = { x: .4, z: -.7, envergure: 11.6 }; m.base = true; m.accent = 'scierie';
    const flux = vu('2d', 1) ? 0 : vu('2d') ? 1 : 2;
    ['forestier', 'transporteur', 'scierie', 'constructeur', 'negociant', 'interpro'].forEach(a => { m.liens[`verse-${a}`] = flux; });
    m.niveau = vu('2d', 1) ? .3 : vu('2d') ? .55 : vu('2c') ? .9 : vu('2b') ? .7 : .4;
    m.baseEtat = vu('2d', 1) ? 'à moitié vide' : vu('2c') ? 'le gestionnaire voit tout' : 'un seul gestionnaire';
    if (vu('2b', 2)) { m.ecran.push({ texte: '1. Tout donner d’avance', alerte: true }); m.marques.scierie = 'lots · volumes · prix'; }
    if (vu('2c')) m.ecran.push({ texte: '2. Le gestionnaire voit tout', alerte: true });
    if (vu('2c', 1)) m.ecran.push({ texte: '3. Impossible de revenir en arrière', alerte: true });
    if (vu('2d', 1)) { m.ecran.push('Résultat : la base reste à moitié vide.'); m.bulles.constructeur = 'Toujours pas de réponse…'; }
  }
  if (id === '03') {
    m.camera = { x: .3, z: -.5, envergure: 11 };
    m.ancres = vu('3a', 1); m.accent = 'scierie';
    if (vu('3a', 1)) m.ecran.push('On ne déplace rien.');
    if (vu('3a', 2)) m.marques.scierie = 'Vos données restent ici';
    m.annuaire = vu('3b', 1); m.livret = vu('3b', 2);
    if (vu('3b', 1) && !vu('3c')) ['forestier', 'transporteur', 'scierie', 'constructeur', 'negociant', 'interpro'].forEach(a => { m.liens[`fiche-${a}`] = 1; });
    if (vu('3b')) m.ecran.push('En commun : un annuaire et des règles. Pas les données.');
    if (vu('3c', 1) && !vu('3d')) { m.liens['demande-constructeur'] = 2; m.bulles.constructeur = 'Je cherche l’origine du lot B-042'; }
    if (vu('3c', 2) && !vu('3d')) m.liens['direct-constructeur'] = 2;
    m.anneau = vu('3d');
    if (vu('3d', 1)) m.ecran.push({ html: 'Un espace de données <small>data space</small>', nom: true });
  }
  if (id === '04-demandes') {
    contexte(); m.camera = { x: .6, z: .1, envergure: 10.6 }; m.accent = 'scierie';
    [[0, 'constructeur'], [2, 'negociant'], [3, 'interpro']].forEach(([phrase, qui]) => {
      if (!vu('4b', phrase)) return;
      m.liens[`demande-${qui}`] = 2;
      if (etat.decisions[qui] === null) m.bulles[qui] = DEMANDES.find(d => d.id === qui).bulle;
    });
  }
  if (id === '04-resultat') {
    contexte(); m.camera = { x: .6, z: .1, envergure: 10.6 }; m.accent = 'scierie'; m.marques.scierie = 'Vos données restent ici';
    DEMANDES.forEach(d => {
      const champs = accorde(d.id);
      if (champs.length && etat.retraits.has(d.id)) m.bulles[d.id] = 'Accès retiré · plus rien ne part';
      else if (champs.length && vu('4d', 1)) { m.liens[`direct-${d.id}`] = 2; m.bulles[d.id] = { texte: '✓ ' + d.champs.filter(c => champs.includes(c.id)).map(c => c.nom).join(' · '), ok: true }; }
      else if (!champs.length && vu('4d', 2)) m.bulles[d.id] = 'Information non communiquée';
    });
  }
  if (id === '05') {
    contexte(); m.camera = { x: -.4, z: .5, envergure: 10.4 }; m.accent = 'scierie';
    const champs = accorde('constructeur');
    if (champs.length && !etat.retraits.has('constructeur')) m.liens['direct-constructeur'] = 2;
    m.bulles.constructeur = champs.includes('origine') ? { texte: 'Origine : massif des Vosges ✓', ok: true } : champs.includes('essence') ? { texte: 'Essence : épicéa ✓', ok: true } : 'Origine : non communiquée';
    if (vu('5a', 2)) m.ecran.push('Cette fois, le téléphone ne sonne pas.');
    if (vu('5b', 1)) { m.ecran.push('Tenu à jour une fois. Chez vous.'); m.marques.scierie = 'À jour · chez vous'; }
  }
  if (id === '06') {
    contexte(); m.camera = { x: .4, z: vu('6b') ? .4 : -.9, envergure: vu('6b') ? 10 : 11 };
    m.rassemble = vu('6b') ? 1 : 0; m.table = vu('6b'); m.annuaire = !vu('6b');
    if (vu('6b', 1)) m.ecran.push('Pas une obligation venue d’en haut.');
    if (vu('6b', 2)) m.ecran.push('On y entre parce qu’on l’a choisi.');
    if (vu('6c')) m.ecran.push('On en sort quand on veut.');
    if (vu('6d')) m.ecran.push({ html: 'DataWood <small>l’espace de données forêt-bois</small>', nom: true });
  }
  const g = gesteCourant();
  if (g) m.halo = cibles(g);
  // Le titre occupe le haut gauche : la scène se cale en bas à droite, et se pousse quand un panneau s'ouvre.
  if (innerWidth > 820) { m.camera.x -= 3.1; m.camera.z -= 1.7; m.camera.envergure += 1; }
  else { m.camera.envergure -= 1.4; m.camera.z -= 4.4; } // en portrait : plus près, et sous le texte
  if (panneau && innerWidth > 820) { m.camera.x += 5.6; m.camera.envergure += 1.6; }
  return m;
}

// ── Gestes proposés ──────────────────────────────────────────────────────────
const cleGeste = g => `${g.piece}:${g.anchor}`;
const refuses = () => DEMANDES.filter(d => !accorde(d.id).length).map(d => d.id);
const ouverts = () => DEMANDES.filter(d => accorde(d.id).length && !etat.retraits.has(d.id)).map(d => d.id);
function cibles(g) {
  return { '01:1b': ['forestier', 'transporteur', 'scierie'], '02:2b': ['scierie'], '02:2c': ['base'], '03:3b': ['annuaire'],
    '04-resultat:4d': refuses(), '04-resultat:4e': ouverts(), '05:5a': ['constructeur'], '06:6b': ['livret'] }[cleGeste(g)] || [];
}
function gesteCourant() {
  if (projection || panneau || attente || !demarre) return null;
  let choisi = null;
  interactions.forEach(g => {
    if (g.piece !== piece().piece || g.anchor === 'fin' || g.mode === 'le film attend' || !vu(g.anchor) || etat.gestes.has(cleGeste(g))) return;
    if (cleGeste(g) === '04-resultat:4d' && !refuses().length) return;
    if (cleGeste(g) === '04-resultat:4e' && !ouverts().length) return;
    choisi = g;
  });
  return choisi;
}
function faireGeste(g) {
  etat.gestes.add(cleGeste(g));
  const cle = cleGeste(g);
  if (cle === '01:1b') ouvrirPanneau('acteur', { onglet: 'forestier' });
  else if (g.piece === '02') ouvrirPanneau('base');
  else if (cle === '03:3b') ouvrirPanneau('annuaire');
  else if (cle === '04-resultat:4d') ouvrirPanneau('resultat', { onglet: refuses()[0] });
  else if (cle === '04-resultat:4e') ouvrirPanneau('resultat', { onglet: ouverts()[0] });
  else if (cle === '05:5a') ouvrirPanneau('dossier');
  else if (cle === '06:6b') ouvrirPanneau('livret');
}
function surActeur(id) {
  const n = tableauDe(iPiece);
  if (!demarre || attente || projection) return;
  if (n === 0 && FICHES[id]) { etat.gestes.add('01:1b'); ouvrirPanneau('acteur', { onglet: id }); }
  else if (n === 1 && id === 'scierie') { etat.gestes.add('02:2b'); ouvrirPanneau('base'); }
  else if (piece().piece === '04-resultat' && DEMANDES.some(d => d.id === id)) ouvrirPanneau('resultat', { onglet: id });
  else if (n === 4 && id === 'constructeur') { etat.gestes.add('05:5a'); ouvrirPanneau('dossier'); }
}
function surObjet(id) {
  const n = tableauDe(iPiece);
  if (!demarre || attente || projection) return;
  if (id === 'base' && n === 1) { etat.gestes.add('02:2b'); etat.gestes.add('02:2c'); ouvrirPanneau('base'); }
  if (id === 'annuaire' && n === 2) { etat.gestes.add('03:3b'); ouvrirPanneau('annuaire'); }
  if (id === 'livret' && n === 5) { etat.gestes.add('06:6b'); ouvrirPanneau('livret'); }
}

// ── Panneaux ─────────────────────────────────────────────────────────────────
const lignes = items => `<ul class="lignes">${items.map(([a, b, c]) => `<li class="${c || ''}"><strong>${a}</strong><span>${b}</span></li>`).join('')}</ul>`;
const onglets = (liste, actif) => `<div class="onglets">${liste.map(([id, nom]) => `<button data-onglet="${id}" aria-pressed="${id === actif}">${nom}</button>`).join('')}</div>`;

const rendus = {
  acteur(o) {
    etat.visites.add(o.onglet);
    const f = FICHES[o.onglet], tout = etat.visites.size === 3;
    return `<p class="etiquette">CE QUE CHACUN SAIT DU LOT</p><h2>${f.titre}</h2>
      ${onglets(Object.entries(FICHES).map(([id, x]) => [id, x.titre.replace(' — vous', '')]), o.onglet)}
      <div class="fiche"><h3>Ce qu’il a dans ses outils</h3>${f.sait.map(s => `<p>${s}</p>`).join('')}<p class="manque">${f.ignore}</p></div>
      ${tout ? '<p class="verdict">Trois morceaux, trois endroits. Personne n’a la réponse complète.</p>' : '<p class="note">Regardez aussi ce que savent les deux autres.</p>'}`;
  },
  base() {
    const verse = etat.verse || vu('2c');
    const mes = [['Vos lots', 'lot B-042, sciages, clients'], ['Vos volumes', '4 200 m³ sur l’année'], ['Vos prix d’achat', 'fournisseur par fournisseur']];
    return `<p class="etiquette">VOUS ÊTES LA SCIERIE</p><h2>${verse ? 'Tout est dans la base.' : 'La base attend vos données.'}</h2>
      ${lignes(mes.map(([a, b]) => [a, verse ? 'dans la base' : b, verse ? 'parti' : '']))}
      ${verse ? `<p class="verdict non">${etat.verse ? 'Vous n’avez rien pu choisir. Tout est parti d’un bloc.' : 'La base a tout pris, d’un bloc.'}</p>
        <div class="fiche"><h3>Ce que voit le gestionnaire</h3><p>Forestier · parcelles et coupes</p><p>Transporteur · tournées et tonnages</p><p><strong>Scierie · lots, volumes et prix d’achat</strong></p><p>Négociant · stocks et marges</p></div>
        <button data-action="reprendre-prix" id="reprendre-prix">Reprendre mes prix</button>
        ${etat.repris ? '<p class="verdict non">Trop tard : une copie est déjà chez lui.</p>' : ''}`
      : '<p class="note">Un seul bouton, et aucune case à cocher : c’est tout, ou rien.</p><button class="principal" data-action="verser">Tout verser dans la base <span>→</span></button>'}`;
  },
  annuaire(o) {
    const fiches = [['forestier', 'Origine du lot B-042', 'le forestier', 'la parcelle elle-même'], ['transporteur', 'Livraison du lot B-042', 'le transporteur', 'le bon de livraison'], ['scierie', 'Sciage du lot B-042', 'la scierie — vous', 'votre fiche de production']];
    return `<p class="etiquette">L’ANNUAIRE DE LA FILIÈRE</p><h2>Qui sait d’où vient le lot B-042 ?</h2>
      ${fiches.map(([id, titre, qui, quoi]) => `<div class="fiche"><h3>${titre}</h3>${o.onglet === id
        ? `<p><strong>La fiche dit :</strong> détenue par ${qui} · communiquée sur demande, pour un usage précisé.</p><p class="manque">La fiche ne contient pas ${quoi} : elle est restée chez ${qui.replace(' — vous', '')}.</p>`
        : `<button data-onglet="${id}">Ouvrir la fiche</button>`}</div>`).join('')}
      ${etat.fiches.size ? '<p class="verdict">L’annuaire dit qui sait. Il ne dit pas quoi.</p>' : ''}`;
  },
  question() {
    const choix = [['commune', 'Dans une base commune'], ['gestionnaire', 'Chez le gestionnaire'], ['vous', 'Chez vous']];
    return `<p class="etiquette">UNE QUESTION AVANT DE CONTINUER</p><h2>Dans un espace de données, où sont vos données ?</h2>
      <div class="choix" style="flex-direction:column">${choix.map(([id, nom]) => `<button data-reponse="${id}" class="${etat.reponse && id === 'vous' ? 'juste' : ''}" aria-pressed="${etat.reponse === id}" ${etat.reponse ? 'disabled' : ''}>${etat.reponse && id === 'vous' ? '✓ ' : ''}${nom}</button>`).join('')}</div>
      ${etat.reponse === 'vous' ? '<p class="verdict">Chez vous. Elles n’ont pas bougé depuis le début du film.</p>' : etat.reponse ? '<p class="verdict non">Pas tout à fait. Dans un espace de données, rien n’est déplacé : vos données restent chez vous. Seuls l’annuaire et les règles sont communs.</p><button data-action="reecouter">Réécouter l’explication</button>' : ''}`;
  },
  decision() {
    return `<p class="etiquette">VOUS ÊTES LA SCIERIE</p><h2>Trois demandes vous arrivent.</h2>
      ${DEMANDES.slice(0, cartesVisibles).map(d => {
        const r = etat.decisions[d.id], partiel = r && r.length && r.length < d.champs.length, mode = r === null ? '' : !r.length ? 'non' : partiel ? 'partie' : 'oui';
        return `<div class="demande" data-reponse="${mode === 'non' ? 'non' : mode ? 'oui' : ''}"><h3>${d.qui}</h3>
          <dl><dt>Demande : </dt><dd>${d.veut}</dd><dt>Pour : </dt><dd>${d.pourquoi}</dd></dl>
          <div class="choix"><button data-decision="${d.id}:oui" aria-pressed="${mode === 'oui'}">Accepter</button>
          ${d.champs.length > 1 ? `<button data-decision="${d.id}:partie" aria-pressed="${mode === 'partie'}">En partie</button>` : ''}
          <button class="non" data-decision="${d.id}:non" aria-pressed="${mode === 'non'}">Refuser</button></div>
          ${mode === 'partie' ? `<div class="cases">${d.champs.map(c => `<label><input type="checkbox" data-champ="${d.id}:${c.id}" ${r.includes(c.id) ? 'checked' : ''}>${c.nom}</label>`).join('')}</div>` : ''}</div>`;
      }).join('')}
      <p class="note">Pour chaque demande, vous savez qui demande, quoi, et pour quoi faire.</p>`;
  },
  resultat(o) {
    const d = DEMANDES.find(x => x.id === o.onglet) || DEMANDES[0], champs = accorde(d.id), retire = etat.retraits.has(d.id);
    const corps = !champs.length
      ? `<div class="ecran-tiers"><strong>ÉCRAN DE : ${d.court.toUpperCase()}</strong>Demande envoyée à la scierie : ${d.veut.toLowerCase()}.<span class="reponse">Information non communiquée.</span></div><p class="verdict">Un refus, et c’est tout. Ni relance, ni signalement.</p>`
      : `<div class="fiche"><h3>Ce que reçoit ${d.qui.toLowerCase()}</h3>${lignes(d.champs.map(c => champs.includes(c.id) ? [c.nom, `${c.valeur} · source : scierie`] : [c.nom, 'non communiqué', 'absent']))}</div>
         ${retire ? '<p class="verdict">Plus rien ne part. Ce qui est déjà transmis reste encadré par votre accord.</p>' : '<button data-action="retirer" data-qui="' + d.id + '">Retirer cet accès</button><p class="note">Transmis directement, de vous à lui. Aucune copie ailleurs.</p>'}`;
    return `<p class="etiquette">CE QUE CHACUN REÇOIT</p><h2>${d.qui}</h2>${onglets(DEMANDES.map(x => [x.id, x.court]), d.id)}${corps}`;
  },
  dossier() {
    const champs = accorde('constructeur'), d = DEMANDES[0];
    return `<p class="etiquette">CÔTÉ CLIENT</p><h2>Dossier de chantier · École des Tilleuls</h2>
      <div class="fiche"><h3>Bois de structure · lot B-042</h3>${lignes([...d.champs.map(c => champs.includes(c.id) ? [c.nom, `${c.valeur} · source : scierie`] : [c.nom, 'non communiquée', 'absent']), ['Prix d’achat de la scierie', 'ne figure pas : jamais transmis', 'absent']])}</div>
      <p class="verdict${champs.length ? '' : ' non'}">${champs.length ? 'Il a sa réponse. Vous n’avez pas décroché le téléphone.' : 'Vous aviez refusé : il n’a rien reçu. C’était votre droit.'}</p>`;
  },
  livret() {
    return `<p class="etiquette">LE LIVRET DE RÈGLES</p><h2>Quatre règles, à titre d’exemple.</h2>
      <div class="fiche">${REGLES.map((r, i) => `<p><strong>${i + 1}.</strong> ${r}</p>`).join('')}</div>
      <p class="verdict">Ces règles restent à écrire. C’est l’objet du consortium.</p>`;
  },
};

function ouvrirPanneau(type, options = {}) {
  const bloquant = type === 'question' || (type === 'decision' && attente === 'decision');
  if (type === 'annuaire' && options.onglet) etat.fiches.add(options.onglet);
  panneau = { type, options };
  $('panneau-contenu').innerHTML = rendus[type](options);
  $('panneau').hidden = false; $('panneau').dataset.bloquant = String(bloquant || type === 'decision');
  $('panneau').classList.toggle('large', type === 'decision');
  document.body.dataset.panneau = 'true';
  const tousRepondus = DEMANDES.every(d => etat.decisions[d.id] !== null);
  $('reprendre').innerHTML = type === 'decision' ? 'Valider mes réponses <span>→</span>' : type === 'question' ? (etat.reponse ? 'Continuer <span>▶</span>' : 'Passer <span>▶</span>') : 'Reprendre le récit <span>▶</span>';
  $('reprendre').disabled = type === 'decision' && !tousRepondus;
  if (type !== 'decision' && enLecture) { pauseParPanneau = true; jouer(false); }
  $('geste').hidden = true;
}
function fermerPanneau() {
  const type = panneau?.type;
  panneau = null; $('panneau').hidden = true; document.body.dataset.panneau = 'false';
  if (type === 'decision') { etat.decide = true; attente = null; allerPiece(indexPiece('04-resultat')); jouer(true); return; }
  if (type === 'question') { attente = null; allerPiece(iPiece + 1); jouer(true); return; }
  const retour = { acteur: etat.visites.size === 3 && 'Trois morceaux, trois endroits. Personne n’a la réponse complète.', base: etat.repris && 'Trop tard : une copie est déjà chez lui.', annuaire: etat.fiches.size && 'L’annuaire dit qui sait. Il ne dit pas quoi.' }[type];
  if (retour) dire(retour);
  if (pauseParPanneau) { pauseParPanneau = false; jouer(true); }
}
function dire(texte) {
  $('retour').textContent = texte; $('retour').hidden = false;
  clearTimeout(minuterieRetour); minuterieRetour = setTimeout(() => { $('retour').hidden = true; }, 4200);
}
$('panneau').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b || b.id === 'reprendre' || b.id === 'fermer-panneau') return;
  const { onglet, action, reponse, decision, qui } = b.dataset;
  if (onglet) return ouvrirPanneau(panneau.type, { onglet });
  if (action === 'verser') etat.verse = true;
  if (action === 'reprendre-prix') { etat.repris = true; etat.gestes.add('02:2c'); }
  if (action === 'retirer') { etat.retraits.add(qui); etat.gestes.add('04-resultat:4e'); }
  if (action === 'reecouter') { panneau = null; $('panneau').hidden = true; document.body.dataset.panneau = 'false'; attente = null; etat.reponse = null; allerPiece(indexPiece('03')); return jouer(true); }
  if (reponse) etat.reponse = reponse;
  if (decision) { const [id, choix] = decision.split(':'), d = DEMANDES.find(x => x.id === id); etat.decisions[id] = choix === 'oui' ? d.champs.map(c => c.id) : choix === 'non' ? [] : [d.champs[0].id]; }
  ouvrirPanneau(panneau.type, panneau.options);
  if (action === 'reprendre-prix') { const el = $('reprendre-prix'); el.classList.add('secoue'); el.disabled = true; }
});
$('panneau').addEventListener('change', e => {
  const champ = e.target.dataset.champ; if (!champ) return;
  const [id, c] = champ.split(':'), actuel = new Set(accorde(id));
  e.target.checked ? actuel.add(c) : actuel.delete(c);
  etat.decisions[id] = [...actuel];
  ouvrirPanneau('decision');
});
$('reprendre').onclick = fermerPanneau;
$('fermer-panneau').onclick = fermerPanneau;
$('geste').onclick = () => { const g = gesteCourant(); if (g) faireGeste(g); };

// ── Déroulement ──────────────────────────────────────────────────────────────
function jouer(valeur) {
  if (valeur && attente) return;
  enLecture = valeur; musique.jouer(valeur);
  const piste = pistes[iPiece];
  if (valeur) {
    if (!demarre) { demarre = true; document.body.dataset.demarre = 'true'; $('ouverture').hidden = true; }
    if (!panne) piste.play().catch(() => { panne = true; });
  } else piste.pause();
  majCommandes();
}
function allerPiece(i) {
  if (i < 0 || i >= pieces.length) return;
  pistes[iPiece].pause();
  const changeTableau = tableauDe(i) !== tableauDe(iPiece) || !cleEcran;
  iPiece = i; t = 0; finTraitee = false; pistes[i].currentTime = 0; cartesVisibles = 0;
  situer();
  if (changeTableau) afficherTableau();
  majCommandes();
}
function allerTableau(n) {
  if (n < 0 || n >= TABLEAUX.length) return;
  const reprise = enLecture || attente === 'fin';
  attente = null; $('fin').hidden = true; panneau = null; $('panneau').hidden = true; document.body.dataset.panneau = 'false'; pauseParPanneau = false;
  if (n === 0) Object.assign(etat, nouvelEtat());
  if (n === 3) { etat.decisions = { constructeur: null, negociant: null, interpro: null }; etat.decide = false; etat.retraits = new Set(); ['04-resultat:4d', '04-resultat:4e'].forEach(c => etat.gestes.delete(c)); }
  if (n > 3 && !etat.decide) { etat.decisions = structuredClone(PAR_DEFAUT); etat.decide = true; }
  allerPiece(indexPiece(TABLEAUX[n].pieces[0]));
  if (reprise && demarre) jouer(true);
}
function afficherTableau() {
  const n = tableauDe(iPiece), bloc = $('bloc-titre');
  $('surtitre').textContent = `TABLEAU ${n + 1} SUR ${TABLEAUX.length}`;
  $('titre').innerHTML = TABLEAUX[n].titre; $('numero').textContent = n + 1; $('nom-tableau').textContent = TABLEAUX[n].court;
  $('ecran').innerHTML = ''; cleEcran = ' ';
  bloc.classList.remove('entree'); void bloc.offsetWidth; bloc.classList.add('entree');
  [...$('tableaux').children].forEach((b, i) => i === n ? b.setAttribute('aria-current', 'step') : b.removeAttribute('aria-current'));
}
function finDePiece() {
  const id = piece().piece;
  if (id === '03' && !projection && etat.reponse === null) { attente = 'question'; jouer(false); attente = 'question'; return ouvrirPanneau('question'); }
  if (id === '04-demandes' && !etat.decide) {
    if (projection) { etat.decisions = structuredClone(PAR_DEFAUT); etat.decide = true; }
    else { enLecture = false; pistes[iPiece].pause(); musique.jouer(false); attente = 'decision'; cartesVisibles = 3; majCommandes(); return ouvrirPanneau('decision'); }
  }
  if (id === '06') { attente = 'fin'; enLecture = false; musique.jouer(false); $('fin').hidden = false; return majCommandes(); }
  allerPiece(iPiece + 1);
  if (enLecture) pistes[iPiece].play().catch(() => { panne = true; });
}

// ── Affichage ────────────────────────────────────────────────────────────────
const minutes = n => `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(Math.floor(n % 60)).padStart(2, '0')}`;
function majCommandes() {
  $('precedent').disabled = tableauDe(iPiece) === 0; $('suivant').disabled = tableauDe(iPiece) === TABLEAUX.length - 1;
  $('lire').innerHTML = enLecture ? 'Pause <span>Ⅱ</span>' : attente === 'fin' ? 'Rejouer <span>↺</span>' : attente ? 'À vous de jouer' : demarre ? 'Reprendre <span>▶</span>' : 'Lancer le récit <span>▶</span>';
  $('lire').disabled = attente === 'question' || attente === 'decision';
}
function majEcran(m) {
  const cle = m.ecran.map(l => l.texte || l.html || l).join('|');
  if (cle === cleEcran) return;
  const liste = $('ecran'), deja = liste.children.length;
  if (!cle.startsWith(cleEcran.trim()) || m.ecran.length < deja) liste.innerHTML = '';
  m.ecran.slice(liste.children.length).forEach(l => {
    const li = document.createElement('li');
    if (l.html) li.innerHTML = l.html; else li.textContent = l.texte || l;
    if (l.alerte) li.className = 'alerte'; if (l.nom) li.className = 'nom';
    liste.append(li);
  });
  cleEcran = cle || ' ';
}
function majProgression() {
  const avant = pieces.slice(0, iPiece).reduce((n, p) => n + p.duration, 0);
  $('minutage').textContent = `${minutes(avant + Math.min(t, piece().duration))} / ${minutes(dureeTotale)}`;
  const n = tableauDe(iPiece);
  [...$('tableaux').children].forEach((b, i) => {
    let part = i < n ? 1 : 0;
    if (i === n) { const ids = TABLEAUX[n].pieces.map(indexPiece), total = ids.reduce((s, j) => s + pieces[j].duration, 0), fait = ids.filter(j => j < iPiece).reduce((s, j) => s + pieces[j].duration, 0) + Math.min(t, piece().duration); part = fait / total; }
    b.style.setProperty('--part', part);
  });
}
function image(maintenant) {
  if (!essai) requestAnimationFrame(image);
  const dt = Math.min((maintenant - dernier) / 1000, .1); dernier = maintenant;
  if (document.hidden && !essai) return;
  const piste = pistes[iPiece];
  if (enLecture) {
    t = panne ? t + dt : piste.currentTime;
    if (!finTraitee && (t >= piece().duration - .03 || piste.ended)) { finTraitee = true; t = piece().duration; situer(); finDePiece(); }
  }
  situer();
  const phrase = piece().segments[pos.iSeg].phrases[pos.iPhrase].texte;
  if ($('sous-titre').textContent !== phrase) $('sous-titre').textContent = phrase;
  if (piece().piece === '04-demandes' && !projection && demarre) {
    const n = vu('4b', 3) ? 3 : vu('4b', 2) ? 2 : vu('4b') ? 1 : 0;
    if (n > cartesVisibles) { cartesVisibles = n; if (!panneau || panneau.type === 'decision') ouvrirPanneau('decision'); }
  }
  const m = mise();
  majEcran(m); majProgression();
  const g = gesteCourant();
  $('geste').hidden = !g || !$('retour').hidden;
  if (g && $('geste-texte').textContent !== g.hint) $('geste-texte').textContent = g.hint;
  musique.rendre(dt, enLecture && !piste.paused);
  monde?.rendre(dt, m);
}

// ── Musique, réglages, commandes ─────────────────────────────────────────────
const musique = (() => {
  const piste = new Audio('assets/musique.mp3'); piste.loop = true; piste.preload = 'metadata'; piste.volume = 0;
  let active = true, joue = false, echec = false;
  const bouton = $('musique');
  const libelle = () => { bouton.textContent = echec ? 'Musique indisponible' : active ? 'Musique : activée' : 'Musique : coupée'; bouton.setAttribute('aria-pressed', String(active && !echec)); };
  const lancer = () => { if (active && joue && !echec && piste.paused) piste.play().catch(() => { echec = true; libelle(); }); };
  piste.onerror = () => { echec = true; libelle(); };
  bouton.onclick = () => { active = !active; if (!active) piste.pause(); else lancer(); libelle(); };
  libelle();
  return {
    jouer(v) { joue = v; if (v) lancer(); else piste.pause(); },
    rendre(dt, parle) { const cible = joue && active && !echec ? (parle ? .08 : .2) : 0; piste.volume = Math.min(1, Math.max(0, piste.volume + (cible - piste.volume) * (1 - Math.exp(-dt * 2.5)))); },
  };
})();

TABLEAUX.forEach((tab, i) => {
  const b = document.createElement('button'); b.type = 'button'; b.textContent = String(i + 1).padStart(2, '0'); b.title = tab.court;
  b.setAttribute('aria-label', `Tableau ${i + 1} : ${tab.court}`); b.onclick = () => allerTableau(i); $('tableaux').append(b);
  const li = document.createElement('li'), lien = document.createElement('button'); lien.textContent = `${i + 1}. ${tab.court}`; lien.onclick = () => { allerTableau(i); jouer(true); };
  li.append(lien); $('sommaire').append(li);
});
$('demarrer').onclick = () => jouer(true);
$('lire').onclick = () => { if (attente === 'fin') { allerTableau(0); return jouer(true); } jouer(!enLecture); };
$('precedent').onclick = () => allerTableau(tableauDe(iPiece) - 1);
$('suivant').onclick = () => allerTableau(tableauDe(iPiece) + 1);
$('revoir').onclick = () => { $('sommaire').hidden = !$('sommaire').hidden; };
$('voix').onclick = () => { voixActive = !voixActive; pistes.forEach(a => { a.muted = !voixActive; }); $('voix').textContent = voixActive ? 'Voix : activée' : 'Voix : coupée'; $('voix').setAttribute('aria-pressed', String(voixActive)); $('sous-titre').setAttribute('aria-live', voixActive ? 'off' : 'polite'); };
function reglerProjection(v) { projection = v; document.body.dataset.projection = String(v); $('projection').setAttribute('aria-pressed', String(v)); if (v && panneau && !attente) fermerPanneau(); }
$('projection').onclick = () => reglerProjection(!projection);
function reglerMouvement(v) { reduit = v; document.body.dataset.reduit = String(v); $('mouvement').setAttribute('aria-pressed', String(v)); monde?.setReduit(v); }
$('mouvement').onclick = () => reglerMouvement(!reduit);
$('plein-ecran').onclick = async () => { try { document.fullscreenElement ? await document.exitFullscreen() : await document.documentElement.requestFullscreen(); } catch { $('plein-ecran').textContent = 'Plein écran indisponible'; } };
document.addEventListener('fullscreenchange', () => { $('plein-ecran').textContent = document.fullscreenElement ? 'Quitter le plein écran' : 'Plein écran'; });
function aPropos(ouvert) { $('a-propos').hidden = !ouvert; $('ouvrir-a-propos').setAttribute('aria-expanded', String(ouvert)); if (ouvert) { jouer(false); $('a-propos').scrollIntoView({ behavior: reduit ? 'instant' : 'smooth' }); } else $('ouvrir-a-propos').focus(); }
$('ouvrir-a-propos').onclick = () => aPropos($('a-propos').hidden); $('fermer-a-propos').onclick = () => aPropos(false);
document.addEventListener('keydown', e => {
  if (/INPUT|BUTTON|A|TEXTAREA|SELECT/.test(e.target.tagName) || e.altKey || e.ctrlKey || e.metaKey) return;
  if (e.code === 'Space') { e.preventDefault(); $('lire').click(); }
  if (e.code === 'ArrowRight') { e.preventDefault(); $('suivant').click(); }
  if (e.code === 'ArrowLeft') { e.preventDefault(); $('precedent').click(); }
});
document.addEventListener('visibilitychange', () => { dernier = performance.now(); if (document.hidden && enLecture && !essai) jouer(false); });
pistes.forEach(a => { a.onerror = () => { panne = true; }; });

reglerProjection(projection); reglerMouvement(reduit);
allerPiece(0);
if (parametres.has('tableau')) allerTableau(Math.max(0, Math.min(TABLEAUX.length - 1, Number(parametres.get('tableau')) - 1)));
if (essai) setInterval(() => image(performance.now()), 40); else requestAnimationFrame(image);
// ?essai : se placer à un instant précis d'une piste, pour vérifier une mise en scène.
if (essai) document.body.dataset.essai = 'true';
if (essai) window.film = { audio: () => ({ piste: piece().piece, t: +pistes[iPiece].currentTime.toFixed(2), enPause: pistes[iPiece].paused, panne, attente }), etat, jouer, allerTableau, fermerPanneau, faireGeste, gesteCourant, placer(id, s) { demarre = true; document.body.dataset.demarre = 'true'; $('ouverture').hidden = true; allerPiece(indexPiece(id)); pistes[iPiece].currentTime = s; t = s; } };
try {
  monde = creerMonde({ conteneur: $('scene'), etiquettes: $('etiquettes'), surActeur, surObjet, surPanne: () => { $('repli').hidden = false; }, reduit });
} catch (erreur) {
  console.error('La vue 3D est indisponible.', erreur); $('repli').hidden = false;
}

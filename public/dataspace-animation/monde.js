// Scène 3D du film. Elle ne connaît pas le récit : le conducteur lui passe à chaque
// image une « mise en scène » (ce qui est visible, quels liens sont allumés) et elle
// s'en rapproche en douceur.
import * as THREE from './vendor/three.module.js';

export const ACTEURS = [
  { id: 'forestier', nom: 'Forestier', pos: [-6.3, -2.5], dessin: 'foret' },
  { id: 'transporteur', nom: 'Transporteur', pos: [-1.5, -4.7], dessin: 'camion' },
  { id: 'scierie', nom: 'Scierie · vous', pos: [-3.5, 2.6], dessin: 'scierie' },
  { id: 'constructeur', nom: 'Constructeur', pos: [4.5, 2.9], dessin: 'maison' },
  { id: 'negociant', nom: 'Négociant', pos: [3.5, -4.3], dessin: 'negoce' },
  { id: 'interpro', nom: 'Interprofession', pos: [6.9, -0.9], dessin: 'bureau' },
];
const CENTRE = [0.4, -0.9];

// id du lien → [départ, arrivée, genre]
const LIENS = {
  'appel-client': ['constructeur', 'scierie', 'appel'],
  'appel-forestier': ['scierie', 'forestier', 'appel'],
  'appel-transporteur': ['scierie', 'transporteur', 'appel'],
  'direct-constructeur': ['scierie', 'constructeur', 'donnee'],
  'direct-negociant': ['scierie', 'negociant', 'donnee'],
  'direct-interpro': ['scierie', 'interpro', 'donnee'],
  'demande-constructeur': ['constructeur', 'scierie', 'demande'],
  'demande-negociant': ['negociant', 'scierie', 'demande'],
  'demande-interpro': ['interpro', 'scierie', 'demande'],
};
ACTEURS.forEach(a => {
  LIENS[`verse-${a.id}`] = [a.id, 'centre', 'donnee'];
  LIENS[`fiche-${a.id}`] = [a.id, 'centre', 'fiche'];
});
const GENRES = {
  appel: { couleur: 0x475569, tirets: true, hauteur: 1.7, paquets: false },
  fiche: { couleur: 0x16a34a, tirets: true, hauteur: 1.9, paquets: false },
  demande: { couleur: 0x3b82f6, tirets: true, hauteur: 2.3, paquets: true },
  donnee: { couleur: 0xd97706, tirets: false, hauteur: 3.0, paquets: true },
};

export function creerMonde({ conteneur, etiquettes, surActeur, surObjet, surPanne, reduit: reduitInitial }) {
  let reduit = reduitInitial, largeur = 1, hauteur = 1, temps = 0;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0fdf4);
  const rendu = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'low-power' });
  rendu.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  rendu.outputColorSpace = THREE.SRGBColorSpace;
  rendu.toneMapping = THREE.ACESFilmicToneMapping;
  rendu.toneMappingExposure = 1.2;
  rendu.shadowMap.enabled = true;
  rendu.shadowMap.type = THREE.PCFSoftShadowMap;
  conteneur.append(rendu.domElement);
  rendu.domElement.addEventListener('webglcontextlost', e => { e.preventDefault(); surPanne(); });

  const camera = new THREE.OrthographicCamera(-10, 10, 7, -7, 0.1, 100);
  scene.add(new THREE.HemisphereLight(0xfffbe8, 0x839b85, 2));
  const soleil = new THREE.DirectionalLight(0xfff7e5, 2.7);
  soleil.position.set(-8, 17, 8);
  soleil.castShadow = true;
  soleil.shadow.mapSize.set(1024, 1024);
  Object.assign(soleil.shadow.camera, { left: -17, right: 17, top: 15, bottom: -15 });
  soleil.shadow.normalBias = 0.04;
  scene.add(soleil);

  const teintes = { foret: 0x15803d, feuilles: 0x4ade80, bois: 0xb18b57, ecorce: 0x7c603b, creme: 0xf1f5f9, toit: 0x334155, sombre: 0x0f172a, bleu: 0x64748b, socle: 0xdcfce7, ambre: 0xf59e0b, blanc: 0xf8fafc };
  const mat = Object.fromEntries(Object.entries(teintes).map(([k, v]) => [k, new THREE.MeshStandardMaterial({ color: v, roughness: 0.84 })]));
  const monde = new THREE.Group();
  scene.add(monde);

  function pose(geo, matiere, x = 0, y = 0, z = 0, parent = monde) {
    const m = new THREE.Mesh(geo, matiere);
    m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; parent.add(m);
    return m;
  }
  const boite = (l, h, p, m, x, y, z, parent) => pose(new THREE.BoxGeometry(l, h, p), m, x, y, z, parent);
  const cyl = (r1, r2, h, m, x, y, z, parent, seg = 24) => pose(new THREE.CylinderGeometry(r1, r2, h, seg), m, x, y, z, parent);

  const sol = pose(new THREE.PlaneGeometry(120, 120), new THREE.MeshStandardMaterial({ color: 0xf0fdf4, roughness: 1 }), 0, -0.22, 0);
  sol.rotation.x = -Math.PI / 2; sol.castShadow = false;
  const grille = new THREE.GridHelper(40, 40, 0xcbd5e1, 0xe2e8f0);
  grille.position.y = -0.205; grille.material.transparent = true; grille.material.opacity = 0.35;
  monde.add(grille);

  const dessins = {
    foret(g) { [[-.8, -.3], [0, -.5], [.65, -.3], [-.45, .48], [.5, .5]].forEach(([x, z], i) => { cyl(.075, .1, .55, mat.ecorce, x, .55, z, g, 7); pose(new THREE.ConeGeometry(.42 + (i % 2) * .09, 1.2 + (i % 2) * .22, 8), i % 2 ? mat.foret : mat.feuilles, x, 1.23, z, g); }); },
    camion(g) { boite(1.25, .65, .74, mat.creme, -.27, .76, 0, g); boite(.58, .58, .77, mat.foret, .69, .65, 0, g); boite(.05, .25, .65, mat.bleu, 1, .84, 0, g); [-.72, .65].forEach(x => [-.44, .44].forEach(z => { cyl(.2, .2, .12, mat.sombre, x, .39, z, g, 14).rotation.x = Math.PI / 2; })); for (let i = 0; i < 3; i++) cyl(.13, .13, 1.03, mat.bois, -.28, 1.2, i * .25 - .25, g, 10).rotation.z = Math.PI / 2; },
    scierie(g) { boite(1.5, .8, 1.04, mat.creme, 0, .64, 0, g); pose(new THREE.ConeGeometry(1.16, .5, 4), mat.toit, 0, 1.3, 0, g).rotation.y = Math.PI / 4; boite(.28, 1.12, .28, mat.ecorce, .5, 1.18, -.26, g); boite(.48, .5, .025, mat.foret, -.25, .55, .54, g); for (let i = 0; i < 3; i++) cyl(.13, .13, .9, mat.bois, -.65 + i * .32, .38, .94, g, 10).rotation.x = Math.PI / 2; },
    maison(g) { boite(1.4, 1.06, 1.03, mat.bois, 0, .71, 0, g); pose(new THREE.ConeGeometry(1.16, .68, 4), mat.toit, 0, 1.56, 0, g).rotation.y = Math.PI / 4; boite(.38, .7, .025, mat.creme, -.27, .56, .53, g); boite(.36, .33, .025, mat.bleu, .36, .85, .53, g); for (let i = 0; i < 5; i++) boite(1.42, .022, .025, mat.ecorce, 0, .29 + i * .19, .54, g); },
    negoce(g) { boite(1.7, .62, 1.0, mat.creme, 0, .52, -.1, g); boite(1.85, .1, 1.15, mat.toit, 0, .88, -.1, g); for (let i = 0; i < 3; i++) for (let j = 0; j < 3 - i; j++) boite(.62, .13, .3, mat.bois, -.45 + (j + i * .5) * .34 - .1, .3 + i * .14, .78, g); },
    bureau(g) { boite(1.35, .88, 1.04, mat.creme, 0, .63, 0, g); boite(1.55, .12, 1.2, mat.foret, 0, 1.12, 0, g); [-.42, 0, .42].forEach(x => boite(.24, .36, .025, mat.bleu, x, .84, .535, g)); },
  };

  function etiquette(html, classe, action) {
    const el = document.createElement(action ? 'button' : 'div');
    el.className = classe; el.innerHTML = html;
    if (action) { el.type = 'button'; el.onclick = action; }
    etiquettes.append(el);
    return el;
  }

  // Acteurs : un socle, un modèle, un bloc de données qui ne quittera jamais l'acteur.
  const matAncre = new THREE.MeshBasicMaterial({ color: 0x22c55e, transparent: true, opacity: 0.85 });
  const acteurs = Object.fromEntries(ACTEURS.map(def => {
    const g = new THREE.Group();
    g.position.set(def.pos[0], 0, def.pos[1]);
    monde.add(g);
    const socle = cyl(1.45, 1.53, .25, mat.socle, 0, .02, 0, g, 6);
    dessins[def.dessin](g);
    const donnees = new THREE.Group();
    donnees.position.set(1, .25, .6); g.add(donnees);
    for (let j = 0; j < 3; j++) cyl(.25, .25, .13, mat.foret, 0, .08 + j * .19, 0, donnees, 20);
    const ancre = pose(new THREE.TorusGeometry(.42, .035, 6, 40), matAncre, 1, .16, .6, g);
    ancre.rotation.x = -Math.PI / 2; ancre.castShadow = false;
    return [def.id, {
      def, g, socle, ancre, cible: new THREE.Vector3(def.pos[0], 0, def.pos[1]),
      nom: etiquette(def.nom, 'acteur-nom', () => surActeur(def.id)),
      bulle: etiquette('', 'bulle'), marque: etiquette('', 'marque'),
    }];
  }));

  // La grosse base : des baies de serveurs, et une jauge qui dit si elle se remplit.
  const base = new THREE.Group(); base.position.set(CENTRE[0], 0, CENTRE[1]); monde.add(base);
  cyl(2.1, 2.25, .23, mat.socle, 0, .04, 0, base, 32);
  for (let i = 0; i < 4; i++) { boite(1.9, .53, 1.35, mat.bleu, -.35, .5 + i * .62, 0, base); boite(1.2, .06, .015, mat.blanc, -.35, .52 + i * .62, .69, base); for (let j = 0; j < 4; j++) cyl(.035, .035, .02, mat.ambre, -.85 + j * .2, .64 + i * .62, .7, base, 8).rotation.x = Math.PI / 2; }
  const tube = cyl(.34, .34, 2.5, new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: .28, roughness: .2 }), 1.35, 1.48, .2, base, 24);
  tube.castShadow = false;
  const jauge = cyl(.27, .27, 2.4, mat.ambre, 1.35, 1.48, .2, base, 24);
  const baseNom = etiquette('Grosse base de données<small>un seul gestionnaire</small>', 'objet-nom', () => surObjet('base'));

  const annuaire = new THREE.Group(); annuaire.position.set(CENTRE[0] - 1.05, .1, CENTRE[1] + .2); monde.add(annuaire);
  cyl(.95, 1.02, .14, mat.socle, 0, .02, 0, annuaire, 32);
  for (let j = 0; j < 4; j++) boite(.85, .05, .62, mat.blanc, j * .1 - .15, .22 + j * .12, j * .03, annuaire).rotation.z = -.08;
  const annuaireNom = etiquette('Annuaire<small>qui sait quoi</small>', 'objet-nom', () => surObjet('annuaire'));

  const livret = new THREE.Group(); livret.position.set(CENTRE[0] + 1.05, .1, CENTRE[1] + .2); monde.add(livret);
  cyl(.95, 1.02, .14, mat.socle, 0, .02, 0, livret, 32);
  for (let j = 0; j < 3; j++) boite(.94, .07, .68, mat.blanc, j * .035, .23 + j * .14, 0, livret);
  boite(.055, .4, .08, mat.foret, -.55, .4, 0, livret);
  const livretNom = etiquette('Règles communes<small>écrites ensemble</small>', 'objet-nom', () => surObjet('livret'));

  const table = new THREE.Group(); table.position.set(CENTRE[0], 0, CENTRE[1]); monde.add(table);
  cyl(2.35, 2.35, .16, mat.bois, 0, .62, 0, table, 40); cyl(.35, .5, .62, mat.ecorce, 0, .3, 0, table, 16);

  const anneau = pose(new THREE.TorusGeometry(8.6, .03, 6, 120), new THREE.MeshBasicMaterial({ color: 0x22c55e, transparent: true, opacity: .62 }), CENTRE[0], .03, CENTRE[1]);
  anneau.rotation.x = -Math.PI / 2; anneau.castShadow = false;

  const sonnerie = [0, 1].map(() => { const t = pose(new THREE.TorusGeometry(1, .03, 6, 60), new THREE.MeshBasicMaterial({ color: 0xd97706, transparent: true, opacity: .8 }), 0, .2, 0); t.rotation.x = -Math.PI / 2; t.castShadow = false; t.visible = false; return t; });

  // Tout ce qui apparaît et disparaît en grandissant.
  const echelles = new Map([[base, 0], [annuaire, 0], [livret, 0], [table, 0], [anneau, 0], ...Object.values(acteurs).map(a => [a.ancre, 0])]);
  echelles.forEach((_, objet) => { objet.scale.setScalar(.001); objet.visible = false; });
  let niveau = 0;

  const point = new THREE.Vector3();
  function ancrage(id, cible) {
    if (id === 'centre') return cible.set(CENTRE[0], 1.5, CENTRE[1]);
    const g = acteurs[id].g;
    return cible.set(g.position.x, 1.05, g.position.z + .3);
  }
  const liens = Object.fromEntries(Object.entries(LIENS).map(([id, [de, vers, genre]]) => {
    const style = GENRES[genre];
    const geometrie = new THREE.BufferGeometry();
    geometrie.setAttribute('position', new THREE.BufferAttribute(new Float32Array(41 * 3), 3));
    const matiere = style.tirets
      ? new THREE.LineDashedMaterial({ color: style.couleur, dashSize: .16, gapSize: .13, transparent: true, opacity: 0 })
      : new THREE.LineBasicMaterial({ color: style.couleur, transparent: true, opacity: 0 });
    const ligne = new THREE.Line(geometrie, matiere); ligne.visible = false; monde.add(ligne);
    const paquets = style.paquets ? [0, 1].map(() => { const g = new THREE.Group(); boite(.16, .23, .06, genre === 'demande' ? mat.bleu : mat.ambre, 0, 0, 0, g); boite(.09, .02, .012, mat.blanc, 0, .04, .036, g); g.visible = false; monde.add(g); return g; }) : [];
    const courbe = new THREE.QuadraticBezierCurve3(new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3());
    return [id, { de, vers, genre, style, ligne, geometrie, paquets, courbe, opacite: 0, mode: 0 }];
  }));

  let envergure = 11, cameraX = 0, cameraZ = 0;
  function cadrer() {
    const ratio = largeur / hauteur;
    const e = Math.max(envergure * (ratio > 1.2 ? 1.1 : 1), 5.6 * ratio);
    camera.left = -e; camera.right = e; camera.top = e / ratio; camera.bottom = -e / ratio;
    camera.updateProjectionMatrix();
  }
  function redimensionner() {
    largeur = Math.max(conteneur.clientWidth, 1); hauteur = Math.max(conteneur.clientHeight, 1);
    rendu.setSize(largeur, hauteur); cadrer();
  }
  new ResizeObserver(redimensionner).observe(conteneur);
  redimensionner();

  function placer(el, x, y, z, decalage = 0) {
    point.set(x, y, z).project(camera);
    el.style.transform = `translate(${(point.x + 1) * largeur / 2}px,${(1 - point.y) * hauteur / 2 + decalage}px) translate(-50%,-50%)`;
  }
  function texte(el, contenu) {
    const valeur = contenu || '';
    if (el.dataset.texte !== valeur) { el.dataset.texte = valeur; el.innerHTML = valeur; }
    el.hidden = !valeur;
  }

  function rendre(dt, m) {
    temps += dt;
    const k = reduit ? 1 : 1 - Math.exp(-dt * 4.2);

    // Acteurs : à leur place, ou rapprochés autour de la table.
    Object.values(acteurs).forEach(a => {
      const [x, z] = a.def.pos, r = m.rassemble || 0;
      a.cible.set(x + (CENTRE[0] + (x - CENTRE[0]) * .8 - x) * r, 0, z + (CENTRE[1] + (z - CENTRE[1]) * .8 - z) * r);
      a.g.position.lerp(a.cible, k);
      a.socle.material = m.accent === a.def.id ? mat.feuilles : mat.socle;
    });

    echelles.set(base, m.base ? 1 : 0); echelles.set(annuaire, m.annuaire ? 1 : 0); echelles.set(livret, m.livret ? 1 : 0);
    echelles.set(table, m.table ? .72 : 0); echelles.set(anneau, m.anneau ? (m.rassemble ? .84 : 1) : 0);
    Object.values(acteurs).forEach(a => echelles.set(a.ancre, m.ancres ? 1 : 0));
    echelles.forEach((cible, objet) => {
      const s = objet.scale.x + (cible - objet.scale.x) * k;
      objet.scale.setScalar(Math.max(.001, s)); objet.visible = s > .006 || cible > 0;
    });
    livret.position.y += ((m.table ? .55 : .1) - livret.position.y) * k;
    livret.position.x += ((m.table ? CENTRE[0] : CENTRE[0] + 1.05) - livret.position.x) * k;
    niveau += ((m.niveau || 0) - niveau) * (reduit ? 1 : 1 - Math.exp(-dt * 1.6));
    jauge.scale.y = Math.max(.02, niveau); jauge.position.y = .28 + 1.2 * Math.max(.02, niveau);

    sonnerie.forEach((t, i) => {
      t.visible = !!m.sonnerie;
      if (!t.visible) return;
      const phase = reduit ? .5 + i * .3 : (temps * .8 + i * .5) % 1, s = acteurs.scierie.g.position;
      t.position.set(s.x, .25, s.z); t.scale.setScalar(1.2 + phase * 1.6); t.material.opacity = .8 * (1 - phase);
    });

    Object.entries(liens).forEach(([id, l]) => {
      l.mode = (m.liens && m.liens[id]) || 0;
      l.opacite += ((l.mode ? .8 : 0) - l.opacite) * k;
      l.ligne.visible = l.opacite > .02; l.ligne.material.opacity = l.opacite;
      l.paquets.forEach(p => { p.visible = l.ligne.visible && l.mode === 2; });
      if (!l.ligne.visible) return;
      ancrage(l.de, l.courbe.v0); ancrage(l.vers, l.courbe.v2);
      l.courbe.v1.copy(l.courbe.v0).lerp(l.courbe.v2, .5); l.courbe.v1.y = l.style.hauteur;
      const attr = l.geometrie.attributes.position;
      for (let j = 0; j <= 40; j++) { l.courbe.getPoint(j / 40, point); attr.setXYZ(j, point.x, point.y, point.z); }
      attr.needsUpdate = true; l.geometrie.computeBoundingSphere();
      if (l.style.tirets) l.ligne.computeLineDistances();
      l.paquets.forEach((p, i) => { p.position.copy(l.courbe.getPoint(reduit ? .35 + i * .3 : (temps / 3.6 + i * .5) % 1)); p.rotation.y = .25; });
    });

    envergure += ((m.camera?.envergure || 11) - envergure) * k;
    cameraX += ((m.camera?.x || 0) - cameraX) * k; cameraZ += ((m.camera?.z || 0) - cameraZ) * k;
    cadrer();
    const derive = reduit ? 0 : Math.sin(temps * .12) * .7;
    camera.position.set(7 + cameraX + derive, 18, 23 + cameraZ);
    camera.lookAt(cameraX, .6, cameraZ);

    const halos = [].concat(m.halo || []);
    Object.values(acteurs).forEach(a => {
      const p = a.g.position;
      placer(a.nom, p.x, .08, p.z + 1.6);
      a.nom.classList.toggle('halo', halos.includes(a.def.id));
      a.nom.classList.toggle('vous', a.def.id === 'scierie');
      const bulle = m.bulles?.[a.def.id];
      texte(a.bulle, bulle?.texte ?? bulle); a.bulle.classList.toggle('ok', !!bulle?.ok);
      if (!a.bulle.hidden) placer(a.bulle, p.x, 2.7, p.z, -14);
      texte(a.marque, m.marques?.[a.def.id]); if (!a.marque.hidden) placer(a.marque, p.x + 1, .95, p.z + .6, -10);
    });
    const objets = [[baseNom, m.base, 'base', CENTRE[0], CENTRE[1] + 2.35], [annuaireNom, m.annuaire && !m.table, 'annuaire', annuaire.position.x, annuaire.position.z + 1.15], [livretNom, m.livret, 'livret', livret.position.x, livret.position.z + (m.table ? 2.6 : 1.15)]];
    objets.forEach(([el, visible, id, x, z]) => {
      el.hidden = !visible; if (!visible) return;
      placer(el, x, .1, z); el.classList.toggle('halo', halos.includes(id));
    });
    if (m.base && baseNom.dataset.etat !== (m.baseEtat || '')) { baseNom.dataset.etat = m.baseEtat || ''; baseNom.innerHTML = `Grosse base de données<small>${m.baseEtat || 'un seul gestionnaire'}</small>`; }
    rendu.render(scene, camera);
  }

  return { rendre, setReduit(v) { reduit = v; } };
}

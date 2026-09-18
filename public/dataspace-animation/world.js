import * as THREE from './vendor/three.module.js';

export function createWorld({container,labels,tag,onActor,onFallback,reduced:falseMotion}) {
  let reduced=falseMotion,chapter=0,fields=['origin','species'],width=1,height=1,dirty=true,settling=true;
  const scene=new THREE.Scene();
  scene.background=new THREE.Color(0xf0fdf4);
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.2;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  container.append(renderer.domElement);
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();onFallback();});
  const camera=new THREE.OrthographicCamera(-10,10,7,-7,.1,100);
  camera.position.set(7,18,23);camera.lookAt(0,0,0);
  scene.add(new THREE.HemisphereLight(0xfffbe8,0x839b85,2));
  const sun=new THREE.DirectionalLight(0xfff7e5,2.7);sun.position.set(-8,17,8);sun.castShadow=true;
  sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-17,right:17,top:15,bottom:-15});sun.shadow.normalBias=.04;scene.add(sun);
  const palette={forest:0x15803d,leaves:0x4ade80,wood:0xb18b57,bark:0x7c603b,cream:0xf1f5f9,roof:0x334155,dark:0x0f172a,blue:0x64748b,plate:0xdcfce7,amber:0xf59e0b,white:0xf8fafc};
  const materials=Object.fromEntries(Object.entries(palette).map(([k,v])=>[k,new THREE.MeshStandardMaterial({color:v,roughness:.84})]));
  const world=new THREE.Group();scene.add(world);
  function add(geo,material,x=0,y=0,z=0,parent=world){const m=new THREE.Mesh(geo,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
  const box=(w,h,d,mat,x,y,z,parent)=>add(new THREE.BoxGeometry(w,h,d),mat,x,y,z,parent);
  const cyl=(r1,r2,h,mat,x,y,z,parent,seg=24)=>add(new THREE.CylinderGeometry(r1,r2,h,seg),mat,x,y,z,parent);
  const ground=add(new THREE.PlaneGeometry(120,120),new THREE.MeshStandardMaterial({color:0xf0fdf4,roughness:1}),0,-.22,0);ground.rotation.x=-Math.PI/2;ground.castShadow=false;
  // A fine ground grid gives spatial continuity during the topology changes.
  const grid=new THREE.GridHelper(36,36,0xcbd5e1,0xe2e8f0);grid.position.y=-.205;grid.material.transparent=true;grid.material.opacity=.35;world.add(grid);
  const names=['Forêt','Transport','Scierie','Construction','Expertise'];
  const tools=['Gestion forestière','Outil logistique','Production · ERP','BIM · dossier chantier','Référentiels'];
  const base=[[-5,-2.6],[0,-4.2],[5,-2.3],[3.7,3.6],[-4.2,3.4]];
  function label(html,cls='actor-label',callback){const el=document.createElement(callback?'button':'div');el.className=cls;el.innerHTML=html;if(callback){el.type='button';el.onclick=callback;}labels.append(el);return el;}
  function drawForest(parent){[[-.8,-.3],[0,-.5],[.65,-.3],[-.45,.48],[.5,.5]].forEach(([x,z],i)=>{cyl(.075,.1,.55,materials.bark,x,.55,z,parent,7);add(new THREE.ConeGeometry(.42+(i%2)*.09,1.2+(i%2)*.22,8),i%2?materials.forest:materials.leaves,x,1.23,z,parent);});}
  function drawTruck(parent){box(1.25,.65,.74,materials.cream,-.27,.76,0,parent);box(.58,.58,.77,materials.forest,.69,.65,0,parent);box(.05,.25,.65,materials.blue,1,.84,0,parent);[-.72,.65].forEach(x=>[-.44,.44].forEach(z=>{const w=cyl(.2,.2,.12,materials.dark,x,.39,z,parent,14);w.rotation.x=Math.PI/2;}));for(let i=0;i<3;i++){const log=cyl(.13,.13,1.03,materials.wood,-.28,1.2,i*.25-.25,parent,10);log.rotation.z=Math.PI/2;}}
  function drawMill(parent){box(1.5,.8,1.04,materials.cream,0,.64,0,parent);const roof=add(new THREE.ConeGeometry(1.16,.5,4),materials.roof,0,1.3,0,parent);roof.rotation.y=Math.PI/4;box(.28,1.12,.28,materials.bark,.5,1.18,-.26,parent);box(.48,.5,.025,materials.forest,-.25,.55,.54,parent);for(let i=0;i<3;i++){const log=cyl(.13,.13,.9,materials.wood,-.65+i*.32,.38,.94,parent,10);log.rotation.x=Math.PI/2;}}
  function drawHouse(parent){box(1.4,1.06,1.03,materials.wood,0,.71,0,parent);const roof=add(new THREE.ConeGeometry(1.16,.68,4),materials.roof,0,1.56,0,parent);roof.rotation.y=Math.PI/4;box(.38,.7,.025,materials.cream,-.27,.56,.53,parent);box(.36,.33,.025,materials.blue,.36,.85,.53,parent);for(let i=0;i<5;i++)box(1.42,.022,.025,materials.bark,0,.29+i*.19,.54,parent);}
  function drawLab(parent){box(1.35,.88,1.04,materials.cream,0,.63,0,parent);box(1.55,.12,1.2,materials.forest,0,1.12,0,parent);[-.42,0,.42].forEach(x=>box(.24,.36,.025,materials.blue,x,.84,.535,parent));}
  function database(parent,x=1,y=.25,z=.6,mat=materials.forest){const g=new THREE.Group();g.position.set(x,y,z);parent.add(g);for(let j=0;j<3;j++)cyl(.25,.25,.13,mat,0,.08+j*.19,0,g,20);return g;}
  const actors=base.map(([x,z],i)=>{const g=new THREE.Group();g.position.set(x,0,z);world.add(g);cyl(1.45,1.53,.25,materials.plate,0,.02,0,g,6);[drawForest,drawTruck,drawMill,drawHouse,drawLab][i](g);const db=database(g);const screen=new THREE.Group();screen.position.set(-1,.48,.69);g.add(screen);box(.52,.4,.07,materials.dark,0,.2,0,screen);box(.43,.28,.012,materials.blue,0,.22,.046,screen);box(.07,.22,.09,materials.dark,0,-.09,0,screen);const connector=new THREE.Group();connector.position.set(0,.18,1.42);g.add(connector);box(.08,.51,.11,materials.forest,-.28,.3,0,connector);box(.08,.51,.11,materials.forest,.28,.3,0,connector);box(.64,.08,.11,materials.forest,0,.59,0,connector);const el=label(`${names[i]}<small>${tools[i]}</small>`,'actor-label',()=>onActor(i));return {g,db,screen,connector,el,target:new THREE.Vector3(x,0,z)};});
  // The platform is a service scenario, not a claim about every platform architecture.
  const platform=new THREE.Group();world.add(platform);cyl(1.7,1.85,.23,materials.plate,0,.04,0,platform,32);
  for(let i=0;i<3;i++){box(1.35,.53,1.05,materials.blue,0,.5+i*.65,0,platform);box(.8,.06,.015,materials.white,0,.52+i*.65,.54,platform);for(let j=0;j<3;j++)cyl(.035,.035,.02,materials.amber,-.4+j*.2,.65+i*.65,.56,platform,8).rotation.x=Math.PI/2;}
  const platformLabel=label('Plateforme<small>Agrégation · services</small>','service-label');
  const compactPlatform=new THREE.Group();actors[2].g.add(compactPlatform);compactPlatform.position.set(-1.05,.45,-.8);for(let j=0;j<2;j++)box(.4,.24,.36,materials.blue,0,j*.29,0,compactPlatform);
  const charter=new THREE.Group();world.add(charter);cyl(.88,.96,.14,materials.plate,0,.04,0,charter,32);for(let j=0;j<3;j++)box(.94,.07,.68,materials.white,j*.035,.23+j*.14,0,charter);box(.055,.4,.08,materials.forest,-.55,.4,0,charter);
  const charterLabel=label('Cadre commun<small>Charte · décisions · standards</small>','service-label');
  const catalog=new THREE.Group();world.add(catalog);catalog.position.set(0,.2,-.3);for(let j=0;j<3;j++){const page=box(.8,.055,.65,materials.white,j*.13,.3+j*.13,j*.03,catalog);page.rotation.z=-.08;}
  const catalogLabel=label('Catalogue<small>Descriptions et conditions</small>','service-label');
  const ruleMaterial=new THREE.MeshBasicMaterial({color:0x22c55e,transparent:true,opacity:.62});
  const ruleRing=add(new THREE.TorusGeometry(6.05,.024,6,100),ruleMaterial,0,.02,0);ruleRing.rotation.x=-Math.PI/2;
  const remote=new THREE.Group();remote.position.set(7,0,.2);world.add(remote);const remoteRing=add(new THREE.TorusGeometry(2.2,.028,6,70),new THREE.MeshBasicMaterial({color:0x3b82f6}),0,.04,0,remote);remoteRing.rotation.x=-Math.PI/2;
  [[-1.1,-.4],[.8,-.6],[0,1]].forEach(([x,z],i)=>{const small=new THREE.Group();small.position.set(x,0,z);small.scale.setScalar(.5);remote.add(small);cyl(1.4,1.5,.2,materials.plate,0,.04,0,small,6);i===1?drawLab(small):drawHouse(small);});
  const remoteLabel=label('Espace construction<small>Exemple d’interconnexion</small>','remote-label');
  const routes=[];
  function makeRoute(start,end,kind='data',min=0,max=8){const pts=new Float32Array(41*3),geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(pts,3));const mat=kind==='meta'?new THREE.LineDashedMaterial({color:0x16a34a,dashSize:.15,gapSize:.13,transparent:true,opacity:.7}):new THREE.LineBasicMaterial({color:kind==='bridge'?0x3b82f6:0xd97706,transparent:true,opacity:.75});const line=new THREE.Line(geometry,mat);world.add(line);const packets=[];if(kind!=='meta')for(let i=0;i<2;i++){const g=new THREE.Group();box(.14,.21,.055,kind==='bridge'?materials.blue:materials.amber,0,0,0,g);box(.08,.018,.012,materials.white,0,.035,.033,g);world.add(g);packets.push(g);}const curve=new THREE.QuadraticBezierCurve3(new THREE.Vector3(),new THREE.Vector3(),new THREE.Vector3());const result={start,end,kind,min,max,line,geometry,curve,packets};routes.push(result);return result;}
  const actorPoint=i=>{const g=actors[i].g;return new THREE.Vector3(g.position.x,1.03,g.position.z+.3);};
  const centerPoint=()=>new THREE.Vector3(0,1.35,0);
  actors.forEach((a,i)=>makeRoute(()=>actorPoint(i),centerPoint,'data',1,2));
  actors.forEach((a,i)=>makeRoute(()=>actorPoint(i),()=>new THREE.Vector3(0,.9,-.3),'meta',4,4));
  const originExchange=makeRoute(()=>actorPoint(0),()=>actorPoint(2),'data',6,6);
  const mainExchange=makeRoute(()=>actorPoint(2),()=>actorPoint(3),'data',6,6);
  makeRoute(()=>actorPoint(4),()=>actorPoint(3),'data',8,8);
  makeRoute(()=>actorPoint(0),()=>actorPoint(2),'data',8,8);
  makeRoute(()=>actorPoint(2),()=>actorPoint(3),'data',8,8);
  makeRoute(()=>new THREE.Vector3(actors[2].g.position.x,1.4,actors[2].g.position.z),()=>new THREE.Vector3(6,1.35,.4),'bridge',7,7);
  const coords=new THREE.Vector3();
  function positionLabel(el,point){coords.copy(point).project(camera);const x=(coords.x+1)*width/2,y=(1-coords.y)*height/2-(el===tag?22:0);el.style.transform=`translate(${x}px,${y}px) translate(-50%,-50%)`;}
  const animated=[platform,charter,catalog,ruleRing,remote,...actors.map(a=>a.connector)].map(object=>{object.scale.setScalar(.001);object.visible=false;return {object,target:0};});
  function aim(object,target){const a=animated.find(a=>a.object===object);a.target=target;if(target>0)object.visible=true;}
  let span=10.1,targetSpan=10.1,progress=0;
  const cameraTarget=new THREE.Vector3();
  function resize(){width=Math.max(container.clientWidth,1);height=Math.max(container.clientHeight,1);renderer.setSize(width,height);updateCamera();dirty=true;}
  function updateCamera(){const ratio=width/height;const fittedSpan=Math.max(span*(ratio>1.2?1.12:1),5.4*ratio);camera.left=-fittedSpan;camera.right=fittedSpan;camera.top=fittedSpan/ratio;camera.bottom=-fittedSpan/ratio;camera.updateProjectionMatrix();}
  new ResizeObserver(resize).observe(container);resize();
  function projectLabels(){actors.forEach(a=>positionLabel(a.el,new THREE.Vector3(a.g.position.x,.08,a.g.position.z+1.55)));positionLabel(platformLabel,new THREE.Vector3(0,.2,1.72));positionLabel(charterLabel,new THREE.Vector3(chapter===7?-3.2:0,.55,chapter===7?.5:.15));positionLabel(catalogLabel,new THREE.Vector3(0,.55,.95));positionLabel(remoteLabel,new THREE.Vector3(7,.1,2.85));if(!tag.hidden){const p=mainExchange.curve.getPoint(.51);positionLabel(tag,p);}}
  function applyVisible(){
    const platformOn=chapter===1||chapter===2, charterOn=chapter===3||chapter===7||chapter===8;
    aim(platform,platformOn?1:0);platformLabel.hidden=!platformOn;
    aim(charter,charterOn?1:0);charter.position.x=chapter===7?-3.2:0;charterLabel.hidden=!charterOn||chapter===7;
    aim(catalog,chapter===4?1:0);catalogLabel.hidden=chapter!==4;
    aim(ruleRing,chapter>=3?(chapter===7?.64:1):0);
    aim(remote,chapter===7?1:0);remoteLabel.hidden=chapter!==7;
    compactPlatform.visible=chapter===8;
    actors.forEach(a=>{aim(a.connector,chapter>=3?1:0);a.db.visible=true;a.screen.visible=true;});
    tag.hidden=chapter!==6||!fields.length;tag.style.left='0';tag.style.top='0';
    tag.textContent=fields.includes('origin')?'Origine · Lot B-042':fields.includes('species')?'Essence · Lot B-042':'Prix · accès autorisé';
    routes.forEach(r=>{let visible=chapter>=r.min&&chapter<=r.max;if(chapter===6&&!fields.length)visible=false;if(r===originExchange&&!fields.includes('origin'))visible=false;r.line.visible=visible;r.packets.forEach(p=>p.visible=visible);});
  }
  function updateRoutes(time){routes.forEach(r=>{if(!r.line.visible)return;r.curve.v0.copy(r.start());r.curve.v2.copy(r.end());r.curve.v1.copy(r.curve.v0).lerp(r.curve.v2,.5);r.curve.v1.y=r.kind==='meta'?1.8:2.9;const attr=r.geometry.attributes.position;for(let j=0;j<=40;j++){r.curve.getPoint(j/40,coords);attr.setXYZ(j,coords.x,coords.y,coords.z);}attr.needsUpdate=true;r.geometry.computeBoundingSphere();if(r.kind==='meta')r.line.computeLineDistances();r.packets.forEach((p,i)=>{const t=reduced?.35+i*.35:(time/5.8+i*.5)%1;p.position.copy(r.curve.getPoint(t));p.rotation.y=.25;});});}
  function setChapter(index,nextFields=fields){chapter=index;fields=[...nextFields];actors.forEach((a,i)=>{const [x,z]=base[i];a.target.set(index===7?x*.61-3.2:index===1||index===2?x*1.07:x,0,index===7?z*.65:index===1||index===2?z*1.07:z);});targetSpan=index===7?11.8:10.1;ruleRing.position.x=index===7?-3.2:0;applyVisible();settling=true;dirty=true;}
  function render(dt,time,playing){if(!dirty&&!settling&&!playing)return;let diff=0;const factor=reduced?1:1-Math.exp(-dt*4.7);actors.forEach(a=>{a.g.position.lerp(a.target,factor);diff+=a.g.position.distanceTo(a.target);});animated.forEach(a=>{const current=a.object.scale.x,next=current+(a.target-current)*factor;a.object.scale.setScalar(next<.003&&a.target===0?0:Math.max(.001,next));a.object.visible=next>.005||a.target>0;diff+=Math.abs(a.target-a.object.scale.x);});span+=(targetSpan-span)*factor;diff+=Math.abs(targetSpan-span);settling=diff>.002;if(reduced||settling)updateCamera();// Slow travelling shots follow the narrative without rotating the whole map.
    const t=reduced?.5:progress;
    const shots=[[0,0],[0,0],[0,0],[0,0],[.7,-.2],[1.5,0],[1.5,1],[0,0],[0,0]];
    const [sx,sz]=shots[chapter];
    cameraTarget.set(sx,.65,sz);
    const drift=reduced?0:Math.sin(t*Math.PI)*1.2;
    camera.position.set(7+sx+drift,18-t*.7,23+sz);
    camera.lookAt(cameraTarget);
    updateRoutes(time);projectLabels();renderer.render(scene,camera);dirty=false;}
  function selectActor(index){actors.forEach((a,i)=>{a.el.dataset.selected=String(i===index);a.g.children[0].material=i===index?materials.leaves:materials.plate;});dirty=true;}
  return {render,setChapter,selectActor,setProgress(value){progress=value;},setSelection(next){fields=[...next];dirty=true;},setReduced(value){reduced=value;settling=true;dirty=true;}};
}

'use client';
/* Le récit intégré (spec § 10) : dock sous le pouce sur téléphone, rail à droite sur ordinateur.
   Il ne bloque jamais l'interface : il cercle l'élément à toucher et attend le geste. */
import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { ACTS, STEPS } from '@/lib/data';
import { useStore } from '@/lib/store';

function useSpot(target: string | null | undefined, key: string) {
  const scrolled = useRef('');
  useEffect(() => {
    let cur: HTMLElement | null = null;
    let raf = 0;
    const apply = () => {
      const el = target ? target.split('|').map(id => document.getElementById(id)).find(Boolean) ?? null : null;
      if (el !== cur) { cur?.classList.remove('spot'); cur = el; cur?.classList.add('spot'); }
      if (el && scrolled.current !== key) {
        scrolled.current = key;
        const r = el.getBoundingClientRect(), dock = window.innerWidth < 1024 ? 150 : 24;
        if (r.top < 70 || r.bottom > window.innerHeight - dock) window.scrollBy({ top: r.top - window.innerHeight / 3, behavior: 'smooth' });
      }
    };
    apply();
    const mo = new MutationObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(apply); });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { mo.disconnect(); cancelAnimationFrame(raf); cur?.classList.remove('spot'); };
  }, [target, key]);
}

export function RecitHost() {
  const r = useStore(s => s.recit);
  const hydrated = useStore(s => s.hydrated);
  const nodes = useStore(s => s.nodes);
  const { recitBegin, recitNext, recitPrev, recitSkip, recitStop, recitCollapse, recitStart, setNode } = useStore.getState();
  const router = useRouter();
  const path = usePathname();
  const step = STEPS[r.step - 1];
  const act = ACTS[step.act - 1];
  const done = r.done.length >= step.completeOn.length;
  const active = hydrated && r.on;
  useSpot(active && !r.intro && !done && !r.finished && !r.collapsed ? step.target[r.done.length] : null, `${r.step}:${r.done.length}`);

  useEffect(() => {
    document.body.classList.toggle('has-recit', active && !r.collapsed);
    return () => document.body.classList.remove('has-recit');
  }, [active, r.collapsed]);

  if (!hydrated) return null;
  if (!r.on) {
    if (r.step > 1 && !r.finished) return <button className="recit-resume" onClick={() => useStore.setState(s => ({ recit: { ...s.recit, on: true } }))}><Icon n="book-open" />Reprendre le récit · {r.step}/{STEPS.length}</button>;
    return null;
  }
  if (r.collapsed) return <button className="recit-resume" onClick={() => recitCollapse(false)}><Icon n="book-open" />Récit · étape {r.step}/{STEPS.length}</button>;

  const go = (route: string) => { if (path.replace(/\/$/, '') !== route) router.push(route); };
  const next = () => {
    if (r.step >= STEPS.length) { recitNext(); go('/architecture'); return; }
    const n = STEPS[r.step];
    recitNext();
    go(n.route);
  };
  const prev = () => { const p = STEPS[Math.max(0, r.step - 2)]; recitPrev(); go(p.route); };
  const demo = () => setNode('iqc', !nodes.iqc.online);
  const demoLabel = nodes.iqc.online ? step.demoAction : 'Rétablir la source';
  const seg = STEPS.map((x, k) => <span key={k} className={`${k < r.step - 1 || (k === r.step - 1 && done) ? 'done' : k === r.step - 1 ? 'cur' : ''}${k > 0 && STEPS[k - 1].act !== x.act ? ' gap' : ''}`} />);
  const plain = step.plain && <div className="rc-clair"><div className="rc-lab"><Icon n="book-open" />En clair</div><p><b>{step.plain[0]}</b> : {step.plain[1]}</p></div>;

  if (r.finished) {
    return <>
      <aside className="rc-dock done open" aria-label="Récit terminé"><div className="rc-prog">{seg}</div>
        <div className="rc-row"><span className="av sm"><Icon n="check" /></span><div className="grow"><div className="rc-meta">Épilogue</div><div className="rc-t">Vous avez vu le passeport de bout en bout</div></div></div>
        <div className="rc-gain"><Icon n="sparkle" /><p>{r.gestures} gestes, quatre métiers, aucune donnée copiée dans une base centrale. Rejouez le scan ci-dessus pour voir le mécanisme.</p></div>
        <div className="rc-fin"><button className="btn sm" onClick={() => { recitStart(); router.push('/scan'); }}><Icon n="rotate-ccw" />Recommencer</button><button className="btn p sm" onClick={recitStop}>Explorer librement</button></div></aside>
      <aside className="rc-rail" aria-label="Récit terminé"><div className="rc-rail-h"><div><div className="rc-kicker">L&apos;histoire d&apos;un passeport</div><div className="rc-count">Épilogue</div></div></div>
        <div className="rc-prog">{seg}</div>
        <div className="rc-card done"><h2 className="rc-t">Vous avez vu le passeport de bout en bout</h2>
          <div className="rc-gain"><div className="rc-lab"><Icon n="sparkle" />Ce que vous avez vu</div><p>{r.gestures} gestes, quatre métiers : le chantier, le contrôle, l&apos;exploitation, la publication. Chaque donnée est restée chez l&apos;entreprise qui l&apos;émet.</p></div>
          <div className="rc-block"><div className="rc-lab"><Icon n="cpu" />Sous le capot</div><p>Cette page montre le mécanisme : rejouez un scan, coupez une source.</p></div></div>
        <div className="rc-foot"><button className="btn g sm" onClick={() => { recitStart(); router.push('/scan'); }}><Icon n="rotate-ccw" />Recommencer</button><button className="btn p sm" onClick={recitStop}>Explorer librement</button></div></aside>
    </>;
  }

  const todo = step.todo.map((t, k) => <li key={k} className={k < r.done.length ? 'ok' : ''}><Icon n={k < r.done.length ? 'circle-check' : 'circle-dashed'} /><span>{t}</span></li>);
  const demoBtn = step.demoAction && !done && <button className="btn sm rc-demo" onClick={demo}><Icon n={nodes.iqc.online ? 'unplug' : 'plug-zap'} />{demoLabel}</button>;

  return <>
    <aside className={`rc-dock${done ? ' done' : ''}${r.intro ? ' open' : ''}`} aria-label="Récit de la démonstration" aria-live="polite">
      <div className="rc-prog">{seg}</div>
      <div className="rc-row">
        <span className="av sm">{act.initials}</span>
        <div className="grow"><div className="rc-meta">Acte {act.n} · {act.title} · <span className="num">{r.step}/{STEPS.length}</span></div><div className="rc-t">{r.intro ? `Vous êtes ${act.who}` : step.title}</div></div>
        <button className="btn g sm ic" aria-label="Détails de l'étape" onClick={e => (e.currentTarget.closest('.rc-dock') as HTMLElement).classList.toggle('open')}><Icon n="chevron-up" /></button>
        <button className="btn g sm ic" aria-label="Quitter le récit" onClick={recitStop}><Icon n="x" /></button>
      </div>
      {r.intro ? <>
        <div className="rc-more" style={{ display: 'block' }}><p className="rc-obj"><b>{act.role}, {act.org}.</b> {act.pitch}</p></div>
        <button className="btn p w" onClick={recitBegin}>C&apos;est parti<Icon n="arrow-right" /></button>
      </> : <>
        <div className="rc-more"><p className="rc-obj"><b>Objectif.</b> {step.objective}</p>{plain}
          <div className="rc-mini"><button onClick={prev} disabled={r.step === 1}>Étape précédente</button>{!done && <button onClick={recitSkip}>Passer l&apos;étape</button>}</div></div>
        {done ? <><div className="rc-gain"><Icon n="sparkle" /><p>{step.gain}</p></div><button className="btn p w" onClick={next}>{r.step === STEPS.length ? 'Voir comment ça marche' : 'Continuer'}<Icon n="arrow-right" /></button></>
          : <div className="rc-do"><Icon n="pointer" /><span>{step.todo[r.done.length]}</span>{demoBtn}</div>}
      </>}
    </aside>

    <aside className="rc-rail" aria-label="Récit de la démonstration">
      <div className="rc-rail-h"><div><div className="rc-kicker">L&apos;histoire d&apos;un passeport</div><div className="rc-count num">Étape {r.step} sur {STEPS.length}</div></div>
        <div style={{ display: 'flex', gap: 2 }}><button className="btn g sm ic" aria-label="Réduire le récit" onClick={() => recitCollapse(true)}><Icon n="panel-right-close" /></button><button className="btn g sm ic" aria-label="Quitter le récit" onClick={recitStop}><Icon n="x" /></button></div></div>
      <div className="rc-prog">{seg}</div>
      <ol className="rc-acts">{ACTS.map(a => {
        const cur = a.n === step.act;
        return <li key={a.n} className={`rc-act${cur ? ' cur' : ''}${a.n < step.act ? ' past' : ''}`}>
          <div className="rc-act-h"><span className="av sm">{a.initials}</span><div><div className="rc-act-t">Acte {a.n} · {a.title}</div><div className="rc-act-d">{a.who}, {a.role.toLowerCase()}</div></div></div>
          {cur && <ol className="rc-steps">{STEPS.filter(s => s.act === a.n).map(s => <li key={s.n} className={s.n < r.step || (s.n === r.step && done) ? 'past' : s.n === r.step ? 'cur' : ''}><span className="n">{s.n < r.step || (s.n === r.step && done) ? <Icon n="check" /> : s.n}</span>{s.title}</li>)}</ol>}
        </li>;
      })}</ol>
      <div className={`rc-card${done ? ' done' : ''}`}>
        <div className="rc-persona"><Icon n="user-round" /><span>Vous êtes <b>{act.who}</b>, {act.role.toLowerCase()} chez {act.org}</span></div>
        {r.intro ? <>
          <h2 className="rc-t">Acte {act.n} · {act.title}</h2>
          <div className="rc-block"><p>{act.pitch}</p></div>
          <button className="btn p sm" onClick={recitBegin}>C&apos;est parti<Icon n="arrow-right" /></button>
        </> : <>
          <h2 className="rc-t">{step.title}</h2>
          <div className="rc-block"><div className="rc-lab"><Icon n="target" />Objectif</div><p>{step.objective}</p></div>
          <div className="rc-block"><div className="rc-lab"><Icon n="pointer" />À faire</div><ul className="rc-todo">{todo}</ul>{demoBtn}</div>
          {done ? <div className="rc-gain"><div className="rc-lab"><Icon n="sparkle" />Ce que vous y gagnez</div><p>{step.gain}</p></div>
            : <div className="rc-block dim"><div className="rc-lab"><Icon n="sparkle" />Ce que vous y gagnez</div><p>Se révèle après le geste.</p></div>}
          {plain}
          {step.underTheHood && <details className="rc-capot"><summary><Icon n="cpu" />Sous le capot</summary><p>{step.underTheHood}</p></details>}
        </>}
      </div>
      <div className="rc-foot"><button className="btn g sm" onClick={prev} disabled={r.step === 1}><Icon n="arrow-left" />Précédent</button>
        {done ? <button className="btn p sm" onClick={next}>{r.step === STEPS.length ? 'Épilogue' : 'Continuer'}<Icon n="arrow-right" /></button>
          : <button className="btn sm" onClick={recitSkip}>Passer l&apos;étape<Icon n="skip-forward" /></button>}</div>
    </aside>
  </>;
}

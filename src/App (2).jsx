import { useState, useRef, useEffect } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&display=swap');
  *{box-sizing:border-box;} body{margin:0;background:#0a0f12;}
  ::placeholder{color:#3a5a64;opacity:1;}
  input,textarea,select{font-family:'Cormorant Garamond',Georgia,serif!important;}
  ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-track{background:#0a0f12;}
  ::-webkit-scrollbar-thumb{background:#1e6b78;border-radius:2px;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
  @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}
  .sergio-msg b, .sergio-msg strong{color:#3dd6e8;}
  .sergio-msg em{color:#a0c4cc;font-style:italic;}
`;

const inp = {
  width:"100%", background:"#0a1417", border:"1px solid #1a2e38",
  borderRadius:2, padding:"0.75rem 1rem", color:"#e8f4f7",
  fontSize:"0.95rem", outline:"none", transition:"border-color 0.2s",
};

const LANGS = {
  "en": { flag:"🇺🇸", label:"English" },
  "pt": { flag:"🇧🇷", label:"Português" },
  "es": { flag:"🇪🇸", label:"Español" },
  "fr": { flag:"🇫🇷", label:"Français" },
  "de": { flag:"🇩🇪", label:"Deutsch" },
  "zh": { flag:"🇨🇳", label:"中文" },
};

function renderMarkdown(text) {
  if (!text) return "";
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}

function MsgText({ text }) {
  return (
    <span
      className="sergio-msg"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }}
    />
  );
}

const T = {
  pt: {
    tagline:"Mediação e arbitragem por IA",
    subtitle:"O melhor juiz é a sensatez",
    body:"Existem diversas soluções para um mesmo problema. Escolha a que te traz paz.",
    bluePhrase:"Sergio existe para solucionar disputas com lógica, consenso e justiça.",
    cta:"Acione o Juiz Sergio",
    sessionLabel:"Código da Sessão", sessionPlaceholder:"ex: CASO-2024",
    sessionBtn:"Acessar →", sessionHint:"Primeira vez? Crie qualquer código e compartilhe com a outra parte.",
    formTitle:"Sua perspectiva", formSubtitle:"Informações confidenciais. O Sergio usa apenas para mediar com imparcialidade.",
    nameLabel:"Seu nome", namePh:"Como você se chama?",
    emailLabel:"Seu e-mail", emailPh:"seu@email.com",
    relationLabel:"Sua relação com a outra parte", relationPh:"ex: cônjuge, sócio, colega...",
    otherLabel:"Nome da outra parte", otherPh:"Como se chama a outra pessoa?",
    topicLabel:"Tema central do conflito", topicPh:"Descreva brevemente o assunto...",
    contextLabel:"Contexto detalhado", contextPh:"O que aconteceu, como você se sente, o que espera da mediação...",
    submitBtn:"Enviar ao Sergio →",
    invitedBy:"Você foi convidado(a) por", invitedAbout:"para uma mediação. Suas respostas são confidenciais.",
    recordBtn:"GRAVAR", stopBtn:"PARAR", orRecord:"ou grave um áudio",
    mediationTitle:"MEDIAÇÃO E ARBITRAGEM POR INTELIGÊNCIA ARTIFICIAL",
    part:"PARTE", privateSession:"SESSÃO PRIVADA",
    ponderation:"PONDERAÇÃO PÓS-OITIVA", secondRound:"SEGUNDA RODADA",
    nextStep:"PRÓXIMO PASSO — CONVIDAR A OUTRA PARTE",
    inviteMsg:"Mensagem de convite para copiar e enviar:",
    inviteLink:"Link da sessão:",
    copyMsg:"⎘ Copiar mensagem", copiedMsg:"✓ Copiado!", copyLink:"⎘ Copiar link",
    waitingRoom:"Ir para sala de espera →",
    bDoneTitle:"OITIVA CONCLUÍDA", waitingTitle:"Aguardando a outra parte",
    ponderATitle:"O Sergio quer conversar com você",
    ponderBTitle:"O Sergio precisa ouvir você novamente",
    consensusTitle:"Mediação concluída",
    startPonder:"INICIAR PONDERAÇÃO →", continueBtn:"CONTINUAR →", viewConsensus:"VER CONSENSO →",
    checking:"Verificando...", needBTitle:"SEGUNDA RODADA ACIONADA",
    readyTitle:"◆ MEDIAÇÃO COMPLETA", generateConsensus:"GERAR CONSENSO FINAL →",
    officialDoc:"◆ DOCUMENTO OFICIAL ◆", consensusDocTitle:"Consenso de Mediação",
    writing:"Sergio está redigindo o consenso...",
    printBtn:"↓ IMPRIMIR / PDF", copyTextBtn:"⎘ COPIAR TEXTO",
    footer:"Documento gerado por Sergio — mediador por inteligência artificial.\nRecomenda-se validação jurídica quando aplicável.",
    loading:"CARREGANDO...",
  },
  en: {
    tagline:"Mediation and arbitration by AI",
    subtitle:"The best judge is good sense",
    body:"There are many solutions to the same problem. Choose the one that brings you peace.",
    bluePhrase:"Sergio exists to resolve disputes with logic, consensus and justice.",
    cta:"Engage Judge Sergio",
    sessionLabel:"Session Code", sessionPlaceholder:"e.g. CASE-2024",
    sessionBtn:"Access →", sessionHint:"First time? Create any code and share it with the other party.",
    formTitle:"Your perspective", formSubtitle:"Confidential information. Sergio uses it only to mediate impartially.",
    nameLabel:"Your name", namePh:"What's your name?",
    emailLabel:"Your email", emailPh:"your@email.com",
    relationLabel:"Your relationship with the other party", relationPh:"e.g. spouse, partner, colleague...",
    otherLabel:"Other party's name", otherPh:"What is the other person's name?",
    topicLabel:"Central topic of the conflict", topicPh:"Briefly describe the matter...",
    contextLabel:"Detailed context", contextPh:"What happened, how you feel, what you expect from mediation...",
    submitBtn:"Send to Sergio →",
    invitedBy:"You were invited by", invitedAbout:"for a mediation. Your answers are confidential.",
    recordBtn:"RECORD", stopBtn:"STOP", orRecord:"or record audio",
    mediationTitle:"MEDIATION AND ARBITRATION BY ARTIFICIAL INTELLIGENCE",
    part:"PART", privateSession:"PRIVATE SESSION",
    ponderation:"POST-HEARING PONDERATION", secondRound:"SECOND ROUND",
    nextStep:"NEXT STEP — INVITE THE OTHER PARTY",
    inviteMsg:"Invitation message to copy and send:", inviteLink:"Session link:",
    copyMsg:"⎘ Copy message", copiedMsg:"✓ Copied!", copyLink:"⎘ Copy link",
    waitingRoom:"Go to waiting room →",
    bDoneTitle:"HEARING CONCLUDED", waitingTitle:"Waiting for the other party",
    ponderATitle:"Sergio wants to talk with you",
    ponderBTitle:"Sergio needs to hear you again",
    consensusTitle:"Mediation concluded",
    startPonder:"START PONDERATION →", continueBtn:"CONTINUE →", viewConsensus:"VIEW CONSENSUS →",
    checking:"Checking...", needBTitle:"SECOND ROUND TRIGGERED",
    readyTitle:"◆ MEDIATION COMPLETE", generateConsensus:"GENERATE FINAL CONSENSUS →",
    officialDoc:"◆ OFFICIAL DOCUMENT ◆", consensusDocTitle:"Mediation Consensus",
    writing:"Sergio is drafting the consensus...",
    printBtn:"↓ PRINT / PDF", copyTextBtn:"⎘ COPY TEXT",
    footer:"Document generated by Sergio — artificial intelligence mediator.\nLegal validation is recommended when applicable.",
    loading:"LOADING...",
  },
  es: {
    tagline:"Mediación y arbitraje por IA",
    subtitle:"El mejor juez es la sensatez",
    body:"Existen diversas soluciones para un mismo problema. Elige la que te traiga paz.",
    bluePhrase:"Sergio existe para resolver disputas con lógica, consenso y justicia.",
    cta:"Acionar al Juez Sergio",
    sessionLabel:"Código de Sesión", sessionPlaceholder:"ej: CASO-2024",
    sessionBtn:"Acceder →", sessionHint:"¿Primera vez? Crea cualquier código y compártelo con la otra parte.",
    formTitle:"Tu perspectiva", formSubtitle:"Información confidencial. Sergio la usa solo para mediar con imparcialidad.",
    nameLabel:"Tu nombre", namePh:"¿Cómo te llamas?",
    emailLabel:"Tu correo", emailPh:"tu@correo.com",
    relationLabel:"Tu relación con la otra parte", relationPh:"ej: cónyuge, socio, colega...",
    otherLabel:"Nombre de la otra parte", otherPh:"¿Cómo se llama la otra persona?",
    topicLabel:"Tema central del conflicto", topicPh:"Describe brevemente el asunto...",
    contextLabel:"Contexto detallado", contextPh:"Qué pasó, cómo te sientes, qué esperas de la mediación...",
    submitBtn:"Enviar a Sergio →",
    invitedBy:"Fuiste invitado/a por", invitedAbout:"para una mediación. Tus respuestas son confidenciales.",
    recordBtn:"GRABAR", stopBtn:"PARAR", orRecord:"o graba un audio",
    mediationTitle:"MEDIACIÓN Y ARBITRAJE POR INTELIGENCIA ARTIFICIAL",
    part:"PARTE", privateSession:"SESIÓN PRIVADA",
    ponderation:"PONDERACIÓN POST-AUDIENCIA", secondRound:"SEGUNDA RONDA",
    nextStep:"SIGUIENTE PASO — INVITAR A LA OTRA PARTE",
    inviteMsg:"Mensaje de invitación para copiar y enviar:", inviteLink:"Enlace de sesión:",
    copyMsg:"⎘ Copiar mensaje", copiedMsg:"✓ Copiado!", copyLink:"⎘ Copiar enlace",
    waitingRoom:"Ir a sala de espera →",
    bDoneTitle:"AUDIENCIA CONCLUIDA", waitingTitle:"Esperando a la otra parte",
    ponderATitle:"Sergio quiere hablar contigo",
    ponderBTitle:"Sergio necesita escucharte de nuevo",
    consensusTitle:"Mediación concluida",
    startPonder:"INICIAR PONDERACIÓN →", continueBtn:"CONTINUAR →", viewConsensus:"VER CONSENSO →",
    checking:"Verificando...", needBTitle:"SEGUNDA RONDA ACTIVADA",
    readyTitle:"◆ MEDIACIÓN COMPLETA", generateConsensus:"GENERAR CONSENSO FINAL →",
    officialDoc:"◆ DOCUMENTO OFICIAL ◆", consensusDocTitle:"Consenso de Mediación",
    writing:"Sergio está redactando el consenso...",
    printBtn:"↓ IMPRIMIR / PDF", copyTextBtn:"⎘ COPIAR TEXTO",
    footer:"Documento generado por Sergio — mediador por inteligencia artificial.\nSe recomienda validación jurídica cuando corresponda.",
    loading:"CARGANDO...",
  },
  fr: {
    tagline:"Médiation et arbitrage par IA",
    subtitle:"Le meilleur juge est le bon sens",
    body:"Il existe de nombreuses solutions au même problème. Choisissez celle qui vous apporte la paix.",
    bluePhrase:"Sergio existe pour résoudre les différends avec logique, consensus et justice.",
    cta:"Activer le Juge Sergio",
    sessionLabel:"Code de Session", sessionPlaceholder:"ex: AFFAIRE-2024",
    sessionBtn:"Accéder →", sessionHint:"Première fois ? Créez un code et partagez-le avec l'autre partie.",
    formTitle:"Votre perspective", formSubtitle:"Informations confidentielles. Sergio les utilise uniquement pour médier impartialement.",
    nameLabel:"Votre nom", namePh:"Comment vous appelez-vous ?",
    emailLabel:"Votre e-mail", emailPh:"votre@email.com",
    relationLabel:"Votre relation avec l'autre partie", relationPh:"ex: conjoint, associé, collègue...",
    otherLabel:"Nom de l'autre partie", otherPh:"Comment s'appelle l'autre personne ?",
    topicLabel:"Sujet central du conflit", topicPh:"Décrivez brièvement la situation...",
    contextLabel:"Contexte détaillé", contextPh:"Ce qui s'est passé, ce que vous ressentez, ce que vous attendez de la médiation...",
    submitBtn:"Envoyer à Sergio →",
    invitedBy:"Vous avez été invité(e) par", invitedAbout:"pour une médiation. Vos réponses sont confidentielles.",
    recordBtn:"ENREGISTRER", stopBtn:"ARRÊTER", orRecord:"ou enregistrez un audio",
    mediationTitle:"MÉDIATION ET ARBITRAGE PAR INTELLIGENCE ARTIFICIELLE",
    part:"PARTIE", privateSession:"SESSION PRIVÉE",
    ponderation:"PONDÉRATION POST-AUDITION", secondRound:"DEUXIÈME TOUR",
    nextStep:"PROCHAINE ÉTAPE — INVITER L'AUTRE PARTIE",
    inviteMsg:"Message d'invitation à copier et envoyer :", inviteLink:"Lien de session :",
    copyMsg:"⎘ Copier le message", copiedMsg:"✓ Copié !", copyLink:"⎘ Copier le lien",
    waitingRoom:"Aller en salle d'attente →",
    bDoneTitle:"AUDITION TERMINÉE", waitingTitle:"En attente de l'autre partie",
    ponderATitle:"Sergio veut vous parler",
    ponderBTitle:"Sergio a besoin de vous entendre à nouveau",
    consensusTitle:"Médiation terminée",
    startPonder:"DÉMARRER LA PONDÉRATION →", continueBtn:"CONTINUER →", viewConsensus:"VOIR LE CONSENSUS →",
    checking:"Vérification...", needBTitle:"DEUXIÈME TOUR DÉCLENCHÉ",
    readyTitle:"◆ MÉDIATION COMPLÈTE", generateConsensus:"GÉNÉRER LE CONSENSUS FINAL →",
    officialDoc:"◆ DOCUMENT OFFICIEL ◆", consensusDocTitle:"Consensus de Médiation",
    writing:"Sergio rédige le consensus...",
    printBtn:"↓ IMPRIMER / PDF", copyTextBtn:"⎘ COPIER LE TEXTE",
    footer:"Document généré par Sergio — médiateur par intelligence artificielle.\nUne validation juridique est recommandée le cas échéant.",
    loading:"CHARGEMENT...",
  },
  de: {
    tagline:"Mediation und Schiedsverfahren durch KI",
    subtitle:"Der beste Richter ist die Vernunft",
    body:"Es gibt viele Lösungen für dasselbe Problem. Wählen Sie die, die Ihnen Frieden bringt.",
    bluePhrase:"Sergio existiert, um Streitigkeiten mit Logik, Konsens und Gerechtigkeit zu lösen.",
    cta:"Richter Sergio einschalten",
    sessionLabel:"Sitzungscode", sessionPlaceholder:"z.B. FALL-2024",
    sessionBtn:"Zugriff →", sessionHint:"Zum ersten Mal? Erstellen Sie einen Code und teilen Sie ihn mit der anderen Partei.",
    formTitle:"Ihre Perspektive", formSubtitle:"Vertrauliche Informationen. Sergio verwendet sie nur zur unparteiischen Vermittlung.",
    nameLabel:"Ihr Name", namePh:"Wie heißen Sie?",
    emailLabel:"Ihre E-Mail", emailPh:"ihre@email.de",
    relationLabel:"Ihre Beziehung zur anderen Partei", relationPh:"z.B. Ehepartner, Partner, Kollege...",
    otherLabel:"Name der anderen Partei", otherPh:"Wie heißt die andere Person?",
    topicLabel:"Hauptthema des Konflikts", topicPh:"Beschreiben Sie die Situation kurz...",
    contextLabel:"Detaillierter Kontext", contextPh:"Was ist passiert, wie fühlen Sie sich, was erwarten Sie von der Mediation...",
    submitBtn:"An Sergio senden →",
    invitedBy:"Sie wurden eingeladen von", invitedAbout:"zur Mediation. Ihre Antworten sind vertraulich.",
    recordBtn:"AUFNEHMEN", stopBtn:"STOPPEN", orRecord:"oder Audio aufnehmen",
    mediationTitle:"MEDIATION UND SCHIEDSVERFAHREN DURCH KÜNSTLICHE INTELLIGENZ",
    part:"PARTEI", privateSession:"PRIVATE SITZUNG",
    ponderation:"NACHANHÖRUNG", secondRound:"ZWEITE RUNDE",
    nextStep:"NÄCHSTER SCHRITT — ANDERE PARTEI EINLADEN",
    inviteMsg:"Einladungsnachricht zum Kopieren:", inviteLink:"Sitzungslink:",
    copyMsg:"⎘ Nachricht kopieren", copiedMsg:"✓ Kopiert!", copyLink:"⎘ Link kopieren",
    waitingRoom:"Zum Wartezimmer →",
    bDoneTitle:"ANHÖRUNG ABGESCHLOSSEN", waitingTitle:"Warten auf die andere Partei",
    ponderATitle:"Sergio möchte mit Ihnen sprechen",
    ponderBTitle:"Sergio muss Sie erneut hören",
    consensusTitle:"Mediation abgeschlossen",
    startPonder:"NACHANHÖRUNG STARTEN →", continueBtn:"WEITER →", viewConsensus:"KONSENS ANZEIGEN →",
    checking:"Überprüfen...", needBTitle:"ZWEITE RUNDE AUSGELÖST",
    readyTitle:"◆ MEDIATION ABGESCHLOSSEN", generateConsensus:"ENDKONSENS GENERIEREN →",
    officialDoc:"◆ OFFIZIELLES DOKUMENT ◆", consensusDocTitle:"Mediationskonsens",
    writing:"Sergio erstellt den Konsens...",
    printBtn:"↓ DRUCKEN / PDF", copyTextBtn:"⎘ TEXT KOPIEREN",
    footer:"Dokument erstellt von Sergio — KI-Mediator.\nRechtliche Validierung wird empfohlen.",
    loading:"LADEN...",
  },
  zh: {
    tagline:"人工智能调解与仲裁",
    subtitle:"最好的法官是理性",
    body:"同一个问题有多种解决方案。选择能给您带来平静的那个。",
    bluePhrase:"Sergio的存在是为了以逻辑、共识和公正解决争议。",
    cta:"启动Sergio法官",
    sessionLabel:"会话代码", sessionPlaceholder:"例: CASE-2024",
    sessionBtn:"访问 →", sessionHint:"第一次？创建任何代码并与另一方共享。",
    formTitle:"您的观点", formSubtitle:"保密信息。Sergio仅用于公正调解。",
    nameLabel:"您的姓名", namePh:"您叫什么名字？",
    emailLabel:"您的电子邮件", emailPh:"your@email.com",
    relationLabel:"您与对方的关系", relationPh:"例: 配偶、合伙人、同事...",
    otherLabel:"对方姓名", otherPh:"对方叫什么名字？",
    topicLabel:"冲突的核心议题", topicPh:"请简要描述情况...",
    contextLabel:"详细背景", contextPh:"发生了什么，您的感受，您对调解的期望...",
    submitBtn:"发送给Sergio →",
    invitedBy:"您被邀请者:", invitedAbout:"邀请参加调解。您的回答将保密。",
    recordBtn:"录音", stopBtn:"停止", orRecord:"或录制音频",
    mediationTitle:"人工智能调解与仲裁",
    part:"方", privateSession:"私人会话",
    ponderation:"听证后深思", secondRound:"第二轮",
    nextStep:"下一步 — 邀请另一方",
    inviteMsg:"复制并发送的邀请消息:", inviteLink:"会话链接:",
    copyMsg:"⎘ 复制消息", copiedMsg:"✓ 已复制!", copyLink:"⎘ 复制链接",
    waitingRoom:"前往等候室 →",
    bDoneTitle:"听证完成", waitingTitle:"等待另一方",
    ponderATitle:"Sergio想与您交谈",
    ponderBTitle:"Sergio需要再次听取您的意见",
    consensusTitle:"调解完成",
    startPonder:"开始深思 →", continueBtn:"继续 →", viewConsensus:"查看共识 →",
    checking:"检查中...", needBTitle:"第二轮已触发",
    readyTitle:"◆ 调解完成", generateConsensus:"生成最终共识 →",
    officialDoc:"◆ 官方文件 ◆", consensusDocTitle:"调解共识书",
    writing:"Sergio正在起草共识...",
    printBtn:"↓ 打印 / PDF", copyTextBtn:"⎘ 复制文本",
    footer:"本文件由AI调解员Sergio生成。\n必要时建议进行法律验证。",
    loading:"加载中...",
  },
};

const store = {
  async get(key) {
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get", key }),
      });
      const d = await r.json();
      return d.value ? JSON.parse(d.value) : null;
    } catch { return null; }
  },
  async set(key, val) {
    try {
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "set", key, value: JSON.stringify(val) }),
      });
    } catch {}
  },
};

function useTyping(text, speed=14) {
  const [out,setOut]=useState(""); const [done,setDone]=useState(false);
  useEffect(()=>{
    setOut(""); setDone(false); if(!text) return;
    let i=0;
    const t=setInterval(()=>{ i++; setOut(text.slice(0,i)); if(i>=text.length){clearInterval(t);setDone(true);} },speed);
    return ()=>clearInterval(t);
  },[text]);
  return {out,done};
}

function Logo({size=64}) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="30" fill="none" stroke="#1e6b78" strokeWidth="1.5"/>
      <circle cx="32" cy="32" r="24" fill="none" stroke="#26909f" strokeWidth="0.5" opacity="0.4"/>
      <line x1="16" y1="32" x2="48" y2="32" stroke="#3dd6e8" strokeWidth="1"/>
      <circle cx="16" cy="32" r="4" fill="#1e6b78"/>
      <circle cx="48" cy="32" r="4" fill="#1e6b78"/>
      <circle cx="32" cy="32" r="6" fill="#2bb5c8" opacity="0.9"/>
    </svg>
  );
}

function CodeEntry({onEnter}) {
  const [code,setCode]=useState("");
  const [err,setErr]=useState("");
  const [shake,setShake]=useState(false);
  const [loading,setLoading]=useState(false);
  const [lang,setLang]=useState("pt");
  const t=T[lang];

  const go=async()=>{
    const c=code.trim().toUpperCase();
    if(c.length<3){setErr("Mínimo 3 caracteres.");setShake(true);setTimeout(()=>setShake(false),500);return;}
    setLoading(true);
    const session=await store.get(`session:${c}`);
    setLoading(false);
    onEnter(c, session, lang);
  };

  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:"2rem",background:"radial-gradient(ellipse at 50% 30%,#0e2028 0%,#0a0f12 70%)",fontFamily:"'Cormorant Garamond',Georgia,serif"}}>
      <style>{css}</style>
      <div style={{position:"absolute",top:"1.5rem",right:"1.5rem",display:"flex",gap:"0.5rem",flexWrap:"wrap",justifyContent:"flex-end",maxWidth:320}}>
        {Object.entries(LANGS).map(([k,v])=>(
          <button key={k} onClick={()=>setLang(k)} style={{background:lang===k?"#1e6b7833":"transparent",border:`1px solid ${lang===k?"#1e6b78":"#1a2e38"}`,borderRadius:20,padding:"0.3rem 0.7rem",color:lang===k?"#3dd6e8":"#5a7d89",fontSize:"0.72rem",cursor:"pointer",fontFamily:"inherit",transition:"all 0.2s"}}>
            {v.flag} {v.label}
          </button>
        ))}
      </div>
      <Logo size={64}/>
      <div style={{marginTop:"1.5rem",fontSize:"0.58rem",letterSpacing:"0.35em",color:"#5a7d89",textTransform:"uppercase"}}>{t.tagline}</div>
      <h1 style={{fontSize:"clamp(2.5rem,6vw,4rem)",fontWeight:300,letterSpacing:"0.1em",color:"#e8f4f7",margin:"0.4rem 0 0"}}>SERGIO</h1>
      <div style={{fontSize:"0.95rem",color:"#c8dde2",letterSpacing:"0.03em",marginTop:"0.4rem",fontStyle:"italic"}}>{t.subtitle}</div>
      <div style={{height:1,width:50,background:"linear-gradient(90deg,transparent,#3dd6e8,transparent)",margin:"1rem auto"}}/>
      <p style={{color:"#5a7d89",fontSize:"0.88rem",textAlign:"center",maxWidth:400,lineHeight:1.9,marginBottom:"0.8rem"}}>{t.body}</p>
      <p style={{color:"#2bb5c8",fontSize:"0.88rem",textAlign:"center",maxWidth:400,lineHeight:1.9,marginBottom:"2rem",fontStyle:"italic"}}>{t.bluePhrase}</p>
      <div style={{background:"#111c22",border:"1px solid #1a2e38",borderRadius:4,padding:"2rem 2.5rem",width:"100%",maxWidth:380,animation:shake?"shake 0.4s ease":"none"}}>
        <label style={{fontSize:"0.62rem",letterSpacing:"0.2em",color:"#5a7d89",textTransform:"uppercase",display:"block",marginBottom:"0.5rem"}}>{t.sessionLabel}</label>
        <input value={code} onChange={e=>{setCode(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&go()}
          placeholder={t.sessionPlaceholder} style={{...inp,fontSize:"1.1rem",letterSpacing:"0.12em"}}
          onFocus={e=>e.target.style.borderColor="#26909f"} onBlur={e=>e.target.style.borderColor="#1a2e38"}/>
        {err&&<div style={{color:"#e84040",fontSize:"0.75rem",marginTop:"0.4rem"}}>{err}</div>}
        <button onClick={go} disabled={loading} style={{marginTop:"1.2rem",width:"100%",background:"linear-gradient(135deg,#1e6b78,#26909f)",border:"none",borderRadius:2,padding:"0.85rem",color:"#e8f4f7",fontSize:"0.78rem",letterSpacing:"0.2em",textTransform:"uppercase",cursor:"pointer",fontFamily:"inherit",opacity:loading?0.6:1}}>
          {loading?"...":t.cta}
        </button>
        <div style={{textAlign:"center",marginTop:"1rem",fontSize:"0.72rem",color:"#3a5a64",lineHeight:1.6}}>{t.sessionHint}</div>
      </div>
    </div>
  );
}

function IntakeForm({sessionCode, existingSession, onSubmit, lang}) {
  const t=T[lang]||T["pt"];
  const nameRef=useRef(), emailRef=useRef(), contextRef=useRef();
  const relationRef=useRef(), otherRef=useRef(), topicRef=useRef();
  const [audioBlob,setAudioBlob]=useState(null),[audioURL,setAudioURL]=useState(null);
  const [recording,setRecording]=useState(false),[recTime,setRecTime]=useState(0),[recErr,setRecErr]=useState("");
  const mediaRef=useRef(), chunksRef=useRef([]), timerRef=useRef();
  const isPartB = existingSession?.partA && !existingSession?.partB;
  const partLabel = isPartB ? "B" : "A";
  const fmt=s=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const startRec=async()=>{
    setRecErr("");
    try {
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});
      const mr=new MediaRecorder(stream); mediaRef.current=mr; chunksRef.current=[];
      mr.ondataavailable=e=>chunksRef.current.push(e.data);
      mr.onstop=()=>{const blob=new Blob(chunksRef.current,{type:"audio/webm"});setAudioBlob(blob);setAudioURL(URL.createObjectURL(blob));stream.getTracks().forEach(tr=>tr.stop());};
      mr.start(); setRecording(true); setRecTime(0);
      timerRef.current=setInterval(()=>setRecTime(t=>t+1),1000);
    } catch { setRecErr("Permissão de microfone negada."); }
  };
  const stopRec=()=>{mediaRef.current?.stop();setRecording(false);clearInterval(timerRef.current);};
  const fo=e=>e.target.style.borderColor="#26909f";
  const bl=e=>e.target.style.borderColor="#1a2e38";
  const lbl={fontSize:"0.62rem",letterSpacing:"0.2em",color:"#5a7d89",textTransform:"uppercase",display:"block",marginBottom:"0.5rem"};
  const fw={marginBottom:"1.4rem"};
  const handleSubmit=()=>{
    const v={
      name:nameRef.current?.value?.trim(),
      email:emailRef.current?.value?.trim(),
      relation:isPartB?existingSession.partA.relation:relationRef.current?.value?.trim(),
      otherName:isPartB?existingSession.partA.name:otherRef.current?.value?.trim(),
      topic:isPartB?existingSession.topic:topicRef.current?.value?.trim(),
      context:contextRef.current?.value?.trim(),
    };
    if(!v.name||!v.email||(!v.context&&!audioBlob)){alert("Preencha todos os campos obrigatórios.");return;}
    onSubmit({...v,audioBlob,sessionCode,partLabel,lang});
  };
  return (
    <div style={{minHeight:"100vh",background:"radial-gradient(ellipse at 30% 0%,#0e2028 0%,#0a0f12 60%)",padding:"2rem 1rem",fontFamily:"'Cormorant Garamond',Georgia,serif"}}>
      <style>{css}</style>
      <div style={{maxWidth:560,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"center",gap:"1rem",marginBottom:"2.5rem",paddingBottom:"1.5rem",borderBottom:"1px solid #1a2e38"}}>
          <Logo size={36}/>
          <div>
            <div style={{fontSize:"1.2rem",color:"#e8f4f7",letterSpacing:"0.05em"}}>SERGIO</div>
            <div style={{fontSize:"0.62rem",letterSpacing:"0.2em",color:"#5a7d89"}}>SESSION · {sessionCode} · {t.part} {partLabel}</div>
          </div>
        </div>
        {isPartB&&(
          <div style={{background:"#1e6b7811",border:"1px solid #1e6b7844",borderRadius:4,padding:"1rem 1.2rem",marginBottom:"1.8rem",fontSize:"0.9rem",color:"#5a7d89",lineHeight:1.7}}>
            {t.invitedBy} <strong style={{color:"#c8dde2"}}>{existingSession.partA.name}</strong> {t.invitedAbout}
            <div style={{marginTop:"0.8rem",padding:"0.8rem",background:"#0a1417",borderRadius:2,fontSize:"0.82rem",color:"#5a7d89",borderLeft:"2px solid #1e6b78"}}>
              <div style={{fontSize:"0.6rem",letterSpacing:"0.15em",color:"#3dd6e8",marginBottom:"0.3rem"}}>TEMA</div>
              {existingSession.topic}
            </div>
          </div>
        )}
        <h2 style={{fontSize:"1.8rem",fontWeight:300,color:"#e8f4f7",marginBottom:"0.4rem"}}>{t.formTitle}</h2>
        <p style={{color:"#5a7d89",fontSize:"0.9rem",marginBottom:"2rem",lineHeight:1.7}}>{t.formSubtitle}</p>
        <div style={fw}><label style={lbl}>{t.nameLabel}</label><input ref={nameRef} defaultValue="" placeholder={t.namePh} style={inp} onFocus={fo} onBlur={bl}/></div>
        <div style={fw}><label style={lbl}>{t.emailLabel}</label><input ref={emailRef} defaultValue="" type="email" placeholder={t.emailPh} style={inp} onFocus={fo} onBlur={bl}/></div>
        {!isPartB&&<div style={fw}><label style={lbl}>{t.relationLabel}</label><input ref={relationRef} defaultValue="" placeholder={t.relationPh} style={inp} onFocus={fo} onBlur={bl}/></div>}
        {!isPartB&&<div style={fw}><label style={lbl}>{t.otherLabel}</label><input ref={otherRef} defaultValue="" placeholder={t.otherPh} style={inp} onFocus={fo} onBlur={bl}/></div>}
        {!isPartB&&<div style={fw}><label style={lbl}>{t.topicLabel}</label><input ref={topicRef} defaultValue="" placeholder={t.topicPh} style={inp} onFocus={fo} onBlur={bl}/></div>}
        <div style={fw}>
          <label style={lbl}>{t.contextLabel}</label>
          <textarea ref={contextRef} defaultValue="" placeholder={t.contextPh} rows={5} style={{...inp,resize:"vertical",lineHeight:1.6}} onFocus={fo} onBlur={bl}/>
          <div style={{marginTop:"0.8rem",display:"flex",alignItems:"center",gap:"0.8rem",flexWrap:"wrap"}}>
            <span style={{fontSize:"0.68rem",color:"#3a5a64"}}>{t.orRecord}</span>
            {!recording&&!audioURL&&<button onClick={startRec} style={{background:"transparent",border:"1px solid #1e6b78",borderRadius:2,padding:"0.4rem 1rem",color:"#2bb5c8",fontSize:"0.72rem",letterSpacing:"0.15em",cursor:"pointer",fontFamily:"inherit"}}>{t.recordBtn}</button>}
            {recording&&<button onClick={stopRec} style={{background:"#e8404022",border:"1px solid #e84040",borderRadius:2,padding:"0.4rem 1rem",color:"#e84040",fontSize:"0.72rem",cursor:"pointer",fontFamily:"inherit"}}>{fmt(recTime)} · {t.stopBtn}</button>}
            {audioURL&&!recording&&<div style={{display:"flex",alignItems:"center",gap:"0.6rem"}}><audio src={audioURL} controls style={{height:28}}/><button onClick={()=>{setAudioURL(null);setAudioBlob(null);}} style={{background:"transparent",border:"none",color:"#3a5a64",cursor:"pointer",fontFamily:"inherit"}}>✕</button></div>}
            {recErr&&<div style={{color:"#e84040",fontSize:"0.75rem",width:"100%"}}>{recErr}</div>}
          </div>
        </div>
        <button onClick={handleSubmit} style={{width:"100%",background:"linear-gradient(135deg,#1e6b78,#26909f)",border:"none",borderRadius:2,padding:"1rem",color:"#e8f4f7",fontSize:"0.78rem",letterSpacing:"0.2em",textTransform:"uppercase",cursor:"pointer",fontFamily:"inherit"}}>
          {t.submitBtn}
        </button>
      </div>
    </div>
  );
}

function SergioChat({intake, sessionData, onDone, onWait}) {
  const lang=intake.lang||"pt";
  const t=T[lang]||T["pt"];
  const [messages,setMessages]=useState([]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const [phase,setPhase]=useState("chat");
  const [linkCopied,setLinkCopied]=useState(false);
  const [msgCopied,setMsgCopied]=useState(false);
  const [inviteMessage,setInviteMessage]=useState("");
  const bottomRef=useRef(), initRef=useRef(false);
  const messagesRef=useRef([]);
  const isPartA=intake.partLabel==="A";
  const isPondering=sessionData?.phase==="pondering_a"&&isPartA;
  const isPonderingB=sessionData?.phase==="pondering_b"&&!isPartA;
  const setMsgs=(updater)=>{
    setMessages(prev=>{
      const next=typeof updater==="function"?updater(prev):updater;
      messagesRef.current=next;
      return next;
    });
  };
  useEffect(()=>{
    if(initRef.current)return; initRef.current=true;
    if(isPondering){const prev=sessionData?.chatA||[];setMsgs(prev);callSergio("__ponder__",prev);}
    else if(isPonderingB){const prev=sessionData?.chatB||[];setMsgs(prev);callSergio("__ponder_b__",prev);}
    else{callSergio("__init__",[]);}
  },[]);
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[messages,loading]);
  const langName={pt:"Brazilian Portuguese",en:"English",es:"Spanish",fr:"French",de:"German",zh:"Mandarin Chinese"}[lang]||"Brazilian Portuguese";

  const buildSystem=()=>{
    const otherName=isPartA?intake.otherName:(sessionData?.partA?.name||intake.otherName);
    if(isPondering) return `You are Sergio, an experienced and impartial AI mediator. ALWAYS respond in ${langName}.
You have already heard both parties privately:
— ${sessionData.partA.name}: "${sessionData.partA.context}"
— ${sessionData.partB.name}: "${sessionData.partB.context}"
Now is the POST-HEARING PONDERATION with ${sessionData.partA.name}.
Use the Socratic/maieutic method: ask questions that guide ${sessionData.partA.name} to arrive at a middle ground on their own. NEVER reveal what ${sessionData.partB.name} said directly.
If their answer is compatible with what ${sessionData.partB.name} would accept, explore that point and build the agreement there.
Maximum 3 rounds. After 2-4 exchanges with enough convergence, say EXACTLY: "Tenho o que preciso para elaborar o consenso." (in ${langName})
If you need B again: "Preciso conversar com ${sessionData.partB.name} mais uma vez." (in ${langName})
Respond in ${langName}. Empathetic, 2-3 paragraphs.`;
    if(isPonderingB) return `You are Sergio, an experienced and impartial AI mediator. ALWAYS respond in ${langName}.
SECOND ROUND with ${sessionData.partB.name}. Use the Socratic method. Never reveal what ${sessionData.partA.name} said.
After 2-4 exchanges: "Tenho o que preciso para elaborar o consenso final." (in ${langName})
Respond in ${langName}. Empathetic, 2-3 paragraphs.`;
    const partAContext=isPartA?"": `\nYou already know ${sessionData?.partA?.name}'s side: "${sessionData?.partA?.context}". Use this to ask strategic questions — without revealing what they said.`;
    return `You are Sergio, an impartial AI mediator — "The Impartial Judge". ALWAYS respond in ${langName}.
Tagline: "Mediation and arbitration by AI. The best judge is good sense."
CONFIDENTIAL: ${intake.name} (${intake.relation}) in conflict with ${otherName} about "${intake.topic||sessionData?.topic}". Context: "${intake.context||"(audio recorded)"}"
${partAContext}
${isPartA
  ?`FIRST HEARING — Party A. Ask 3-5 precise questions to deeply understand ${intake.name}'s perspective, feelings, and desired outcome.
When you have a thorough understanding (after at least 2-3 exchanges), conclude with EXACTLY this phrase (translated to ${langName}):
"Obrigado [name]. Compreendo profundamente sua perspectiva. Vou agora ouvir [other] em privado e, após isso, retornarei para uma conversa de ponderação com você."
IMPORTANT: Do NOT say this in your first message. Only say it after you have asked your questions and received answers.`
  :`FIRST HEARING — Party B. Ask 3-5 strategic questions.
When done (after at least 2-3 exchanges), conclude with EXACTLY (in ${langName}):
"Obrigado [name]. Ouvi ambas as partes e retornarei agora para [partA] na etapa de ponderação."
IMPORTANT: Do NOT say this in your first message.`
}
Respond in ${langName}. 2-3 paragraphs. Never use conclusion phrases in your opening message.`;
  };

  const callSergio=async(userMsg, histOverride)=>{
    const isInit=["__init__","__ponder__","__ponder_b__"].includes(userMsg);
    const currentMsgs=histOverride!==undefined?histOverride:messagesRef.current;
    if(!isInit) setMsgs(m=>[...m,{role:"user",text:userMsg}]);
    setLoading(true);
    const sys=buildSystem();
    const hist=isInit?[]:currentMsgs.map(m=>({role:m.role==="user"?"user":"assistant",content:m.text}));
    let prompt;
    if(userMsg==="__init__") prompt=`Greet ${intake.name} warmly and ask your FIRST question about "${intake.topic||sessionData?.topic}". This is your opening message — do NOT say you will return or conclude. Just greet and ask. Respond in ${langName}.`;
    else if(userMsg==="__ponder__") prompt=`Start the ponderation with ${sessionData.partA.name}. Briefly reintroduce and begin Socratic exploration toward compromise. Respond in ${langName}.`;
    else if(userMsg==="__ponder_b__") prompt=`Start second round with ${sessionData.partB.name}. Use Socratic method to explore convergences. Respond in ${langName}.`;
    else prompt=userMsg;
    try {
      const r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:sys,messages:[...hist,{role:"user",content:prompt}]})});
      const d=await r.json();
      const reply=d.content?.map(b=>b.text||"").join("")||"Erro de conexão.";
      setMsgs(m=>[...(isInit?[]:m),{role:"sergio",text:reply}]);

      // Só detecta encerramento se não for mensagem inicial E houver pelo menos 1 troca real
      const hasRealExchange = currentMsgs.filter(m=>m.role==="user").length > 0;

      if(!isInit && hasRealExchange){
        // Fim oitiva A
        const donePhrasesA=["conversa de ponderação","ponderation conversation","conversación de ponderación","conversation de pondération","Nachdenkgespräch","深思阶段"];
        if(isPartA&&!isPondering&&donePhrasesA.some(p=>reply.includes(p))){
          setPhase("show_link");
          const updatedMsgs=[...currentMsgs,{role:"sergio",text:reply}];
          const existing=await store.get(`session:${intake.sessionCode}`)||{};
          await store.set(`session:${intake.sessionCode}`,{
            ...existing,
            partA:{name:intake.name,email:intake.email,relation:intake.relation,context:intake.context||"(audio)"},
            topic:intake.topic, chatA:updatedMsgs, phase:"waiting_b", lang,
          });
          generateInviteMessage(intake,lang);
        }

        // Fim oitiva B
        const donePhrasesBpt=["etapa de ponderação","ponderation stage","etapa de ponderación","étape de pondération","Pondierungsphase","深思环节"];
        if(!isPartA&&!isPonderingB&&donePhrasesBpt.some(p=>reply.includes(p))){
          setPhase("b_done");
          const existing=await store.get(`session:${intake.sessionCode}`)||{};
          await store.set(`session:${intake.sessionCode}`,{
            ...existing,
            partB:{name:intake.name,email:intake.email,relation:intake.relation,context:intake.context||"(audio)"},
            chatB:[...currentMsgs,{role:"sergio",text:reply}],
            phase:"pondering_a",
          });
        }
      }

      // Consenso pronto
      const consensusPhrases=["Tenho o que preciso para elaborar o consenso","I have what I need to elaborate","Tengo lo que necesito","J'ai ce qu'il me faut","Ich habe, was ich brauche","我已获得"];
      if(isPondering&&consensusPhrases.some(p=>reply.includes(p))){
        setPhase("consensus_ready");
        const existing=await store.get(`session:${intake.sessionCode}`)||{};
        await store.set(`session:${intake.sessionCode}`,{...existing,chatPonderA:[...currentMsgs,{role:"sergio",text:reply}],phase:"ready_consensus"});
      }
      const needBPhrases=["Preciso conversar com","I need to speak with","Necesito hablar con","J'ai besoin de parler","Ich muss noch einmal","需要再次"];
      if(isPondering&&needBPhrases.some(p=>reply.includes(p))){
        setPhase("need_b_again");
        const existing=await store.get(`session:${intake.sessionCode}`)||{};
        await store.set(`session:${intake.sessionCode}`,{...existing,chatPonderA:[...currentMsgs,{role:"sergio",text:reply}],phase:"pondering_b"});
      }
      if(isPonderingB&&consensusPhrases.some(p=>reply.includes(p))){
        setPhase("consensus_ready");
        const existing=await store.get(`session:${intake.sessionCode}`)||{};
        await store.set(`session:${intake.sessionCode}`,{...existing,chatPonderB:[...currentMsgs,{role:"sergio",text:reply}],phase:"ready_consensus"});
      }
    } catch { setMsgs(m=>[...m,{role:"sergio",text:"Erro de conexão. Tente novamente."}]); }
    setLoading(false);
  };

  const generateInviteMessage=async(intake,lang)=>{
    const langName2={pt:"Brazilian Portuguese",en:"English",es:"Spanish",fr:"French",de:"German",zh:"Mandarin Chinese"}[lang]||"Brazilian Portuguese";
    try {
      const r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:300,messages:[{role:"user",content:
          `Write a short, warm invitation message in ${langName2} for ${intake.otherName} to join a mediation session on Sergio (an AI mediator).
Topic: "${intake.topic}". Relationship: ${intake.relation}.
- Warm and neutral
- Briefly explain Sergio ("The Impartial Judge - AI for mediation and arbitration")
- Invite them to share their perspective privately
- Do NOT reveal anything ${intake.name} said
- 3-4 sentences max. No link.
Write ONLY the message.`}]})});
      const d=await r.json();
      setInviteMessage(d.content?.map(b=>b.text||"").join("")||"");
    } catch { setInviteMessage(""); }
  };

  const send=()=>{
    if(!input.trim()||loading)return;
    const m=input.trim(); setInput(""); callSergio(m,undefined);
  };
  const sessionUrl=`${window.location.origin}${window.location.pathname}?session=${intake.sessionCode}`;

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",background:"#0a0f12",fontFamily:"'Cormorant Garamond',Georgia,serif"}}>
      <style>{css}</style>
      <div style={{padding:"0.9rem 1.4rem",borderBottom:"1px solid #1a2e38",background:"#0d1519",display:"flex",alignItems:"center",gap:"0.9rem",flexShrink:0}}>
        <div style={{width:38,height:38,borderRadius:"50%",background:"linear-gradient(135deg,#1e6b78,#26909f)",display:"flex",alignItems:"center",justifyContent:"center",color:"#e8f4f7",boxShadow:"0 0 14px #1e6b7866",fontSize:"1rem"}}>S</div>
        <div>
          <div style={{color:"#e8f4f7",fontSize:"0.95rem",letterSpacing:"0.06em"}}>Sergio</div>
          <div style={{fontSize:"0.6rem",color:"#2bb5c8",letterSpacing:"0.12em",display:"flex",alignItems:"center",gap:"0.3rem"}}>
            <span style={{width:5,height:5,borderRadius:"50%",background:"#2bb5c8",display:"inline-block",animation:"pulse 2s infinite"}}/>
            {isPondering?t.ponderation:isPonderingB?t.secondRound:`${t.privateSession} · ${t.part} ${intake.partLabel}`}
          </div>
        </div>
        <div style={{marginLeft:"auto",fontSize:"0.6rem",color:"#3a5a64"}}>{intake.sessionCode}</div>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"1.4rem",display:"flex",flexDirection:"column",gap:"1.1rem"}}>
        {messages.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",animation:"fadeUp 0.3s ease"}}>
            {m.role==="sergio"&&<div style={{width:26,height:26,borderRadius:"50%",background:"#1e6b7833",border:"1px solid #1e6b78",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.7rem",color:"#3dd6e8",marginRight:"0.5rem",flexShrink:0,marginTop:2}}>S</div>}
            <div style={{maxWidth:"72%",background:m.role==="user"?"#26909f18":"#111c22",border:`1px solid ${m.role==="user"?"#26909f44":"#1a2e38"}`,borderRadius:m.role==="user"?"12px 12px 2px 12px":"12px 12px 12px 2px",padding:"0.8rem 1rem",fontSize:"0.93rem",lineHeight:1.8,whiteSpace:"pre-wrap",color:"#c8dde2"}}>
              {m.role==="sergio"?<MsgText text={m.text}/>:m.text}
            </div>
          </div>
        ))}
        {loading&&(
          <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
            <div style={{width:26,height:26,borderRadius:"50%",background:"#1e6b7833",border:"1px solid #1e6b78",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.7rem",color:"#3dd6e8"}}>S</div>
            <div style={{display:"flex",gap:4,padding:"0.6rem 0.9rem",background:"#111c22",border:"1px solid #1a2e38",borderRadius:"12px 12px 12px 2px"}}>
              {[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:"#1e6b78",animation:`pulse 1.2s ${i*0.2}s infinite`}}/>)}
            </div>
          </div>
        )}
        {phase==="show_link"&&(
          <div style={{background:"#111c22",border:"1px solid #1e6b7844",borderTop:"2px solid #1e6b78",borderRadius:4,padding:"1.5rem",animation:"fadeUp 0.4s ease"}}>
            <div style={{fontSize:"0.62rem",letterSpacing:"0.25em",color:"#2bb5c8",marginBottom:"1rem"}}>{t.nextStep}</div>
            {inviteMessage&&(
              <div style={{marginBottom:"1.2rem"}}>
                <div style={{fontSize:"0.62rem",letterSpacing:"0.15em",color:"#5a7d89",marginBottom:"0.5rem"}}>{t.inviteMsg}</div>
                <div style={{background:"#0a1417",border:"1px solid #1a2e38",borderRadius:2,padding:"1rem",fontSize:"0.88rem",color:"#c8dde2",lineHeight:1.8,whiteSpace:"pre-wrap",marginBottom:"0.6rem"}}>{inviteMessage}</div>
                <button onClick={()=>{navigator.clipboard.writeText(inviteMessage+"\n\n"+sessionUrl);setMsgCopied(true);setTimeout(()=>setMsgCopied(false),2500);}}
                  style={{background:msgCopied?"#2e9e6b22":"transparent",border:`1px solid ${msgCopied?"#2e9e6b":"#1e6b78"}`,borderRadius:2,padding:"0.5rem 1.2rem",color:msgCopied?"#2e9e6b":"#2bb5c8",fontSize:"0.72rem",letterSpacing:"0.15em",cursor:"pointer",fontFamily:"inherit",transition:"all 0.2s"}}>
                  {msgCopied?t.copiedMsg:t.copyMsg}
                </button>
              </div>
            )}
            <div style={{fontSize:"0.62rem",letterSpacing:"0.15em",color:"#5a7d89",marginBottom:"0.4rem"}}>{t.inviteLink}</div>
            <div style={{background:"#0a1417",border:"1px solid #1a2e38",borderRadius:2,padding:"0.75rem 1rem",fontSize:"0.78rem",color:"#5a7d89",wordBreak:"break-all",marginBottom:"0.6rem",fontFamily:"monospace"}}>{sessionUrl}</div>
            <button onClick={()=>{navigator.clipboard.writeText(sessionUrl);setLinkCopied(true);setTimeout(()=>setLinkCopied(false),2500);}}
              style={{background:linkCopied?"#2e9e6b22":"transparent",border:`1px solid ${linkCopied?"#2e9e6b":"#1a2e38"}`,borderRadius:2,padding:"0.5rem 1.2rem",color:linkCopied?"#2e9e6b":"#5a7d89",fontSize:"0.72rem",letterSpacing:"0.15em",cursor:"pointer",fontFamily:"inherit",transition:"all 0.2s"}}>
              {linkCopied?t.copiedMsg:t.copyLink}
            </button>
            <div style={{marginTop:"1rem"}}>
              <button onClick={onWait} style={{background:"transparent",border:"1px solid #1a2e38",borderRadius:2,padding:"0.6rem 1.4rem",color:"#5a7d89",fontSize:"0.72rem",letterSpacing:"0.15em",cursor:"pointer",fontFamily:"inherit"}}>{t.waitingRoom}</button>
            </div>
          </div>
        )}
        {phase==="b_done"&&(
          <div style={{background:"#111c22",border:"1px solid #1e6b7844",borderTop:"2px solid #1e6b78",borderRadius:4,padding:"1.5rem",animation:"fadeUp 0.4s ease"}}>
            <div style={{fontSize:"0.62rem",letterSpacing:"0.25em",color:"#2bb5c8",marginBottom:"0.8rem"}}>{t.bDoneTitle}</div>
            <p style={{color:"#c8dde2",fontSize:"0.9rem",lineHeight:1.8}}>Sergio → <strong>{sessionData?.partA?.name||intake.otherName}</strong></p>
          </div>
        )}
        {phase==="need_b_again"&&(
          <div style={{background:"#111c22",border:"1px solid #c9a84c44",borderTop:"2px solid #c9a84c",borderRadius:4,padding:"1.5rem",animation:"fadeUp 0.4s ease"}}>
            <div style={{fontSize:"0.62rem",letterSpacing:"0.25em",color:"#c9a84c",marginBottom:"0.8rem"}}>{t.needBTitle}</div>
            <p style={{color:"#c8dde2",fontSize:"0.9rem",lineHeight:1.8}}>Sergio → <strong>{sessionData?.partB?.name}</strong></p>
          </div>
        )}
        {phase==="consensus_ready"&&(
          <div style={{background:"#111c22",border:"1px solid #c9a84c44",borderTop:"2px solid #c9a84c",borderRadius:4,padding:"1.5rem",animation:"fadeUp 0.4s ease"}}>
            <div style={{fontSize:"0.62rem",letterSpacing:"0.25em",color:"#c9a84c",marginBottom:"0.8rem"}}>{t.readyTitle}</div>
            <p style={{color:"#c8dde2",fontSize:"0.9rem",lineHeight:1.8,marginBottom:"1.2rem"}}>Sergio</p>
            <button onClick={()=>onDone(messagesRef.current)} style={{background:"linear-gradient(135deg,#c9a84c33,#c9a84c11)",border:"1px solid #c9a84c",borderRadius:2,padding:"0.85rem 2rem",color:"#c9a84c",fontSize:"0.78rem",letterSpacing:"0.2em",cursor:"pointer",fontFamily:"inherit"}}>
              {t.generateConsensus}
            </button>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {phase==="chat"&&(
        <div style={{padding:"0.9rem 1.4rem",borderTop:"1px solid #1a2e38",background:"#0d1519",display:"flex",gap:"0.7rem",flexShrink:0}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()}
            placeholder="..." style={{...inp,flex:1}} onFocus={e=>e.target.style.borderColor="#26909f"} onBlur={e=>e.target.style.borderColor="#1a2e38"}/>
          <button onClick={send} disabled={!input.trim()||loading}
            style={{background:input.trim()&&!loading?"linear-gradient(135deg,#1e6b78,#26909f)":"#111c22",border:"none",borderRadius:2,padding:"0 1.1rem",color:input.trim()&&!loading?"#e8f4f7":"#3a5a64",cursor:input.trim()&&!loading?"pointer":"not-allowed",fontSize:"1.1rem"}}>→</button>
        </div>
      )}
    </div>
  );
}

function WaitingRoom({sessionCode, intake, onReady}) {
  const lang=intake?.lang||"pt";
  const t=T[lang]||T["pt"];
  const [sessionPhase,setSessionPhase]=useState(null);
  const [polls,setPolls]=useState(0);
  useEffect(()=>{
    const check=async()=>{
      const s=await store.get(`session:${sessionCode}`);
      if(s?.phase) setSessionPhase(s.phase);
      setPolls(c=>c+1);
    };
    check();
    const timer=setInterval(check,5000);
    return ()=>clearInterval(timer);
  },[]);
  const isPartA=intake?.partLabel==="A";
  let status="waiting";
  if(isPartA&&sessionPhase==="pondering_a") status="ponder_a";
  if(!isPartA&&sessionPhase==="pondering_b") status="ponder_b";
  if(sessionPhase==="ready_consensus") status="consensus";
  const configs={
    waiting:{color:"#2bb5c8",icon:"○",title:t.waitingTitle,btn:null},
    ponder_a:{color:"#c9a84c",icon:"◈",title:t.ponderATitle,btn:{label:t.startPonder,fn:()=>onReady("ponder_a")}},
    ponder_b:{color:"#c9a84c",icon:"◈",title:t.ponderBTitle,btn:{label:t.continueBtn,fn:()=>onReady("ponder_b")}},
    consensus:{color:"#c9a84c",icon:"◆",title:t.consensusTitle,btn:{label:t.viewConsensus,fn:()=>onReady("consensus")}},
  };
  const cfg=configs[status];
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:"2rem",background:"radial-gradient(ellipse at 50% 30%,#0e2028 0%,#0a0f12 70%)",fontFamily:"'Cormorant Garamond',Georgia,serif"}}>
      <style>{css}</style>
      <div style={{background:"#111c22",border:`1px solid ${cfg.color}33`,borderTop:`2px solid ${cfg.color}`,borderRadius:4,padding:"2.5rem",maxWidth:440,width:"100%",textAlign:"center"}}>
        <div style={{fontSize:"1.8rem",color:cfg.color,marginBottom:"1rem"}}>{cfg.icon}</div>
        <div style={{fontSize:"0.58rem",letterSpacing:"0.3em",color:cfg.color,marginBottom:"0.8rem"}}>SESSION · {sessionCode} · {t.part} {intake?.partLabel}</div>
        <h2 style={{fontSize:"1.5rem",fontWeight:300,color:"#e8f4f7",marginBottom:"0.8rem",lineHeight:1.3}}>{cfg.title}</h2>
        {status==="waiting"&&(
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem",color:"#3a5a64",fontSize:"0.72rem",marginBottom:"1rem"}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:"#2bb5c8",display:"inline-block",animation:"pulse 1.5s infinite"}}/>
            {t.checking} ({polls}×)
          </div>
        )}
        {cfg.btn&&(
          <button onClick={cfg.btn.fn} style={{background:`${cfg.color}22`,border:`1px solid ${cfg.color}`,borderRadius:2,padding:"0.85rem 2rem",color:cfg.color,fontSize:"0.78rem",letterSpacing:"0.2em",cursor:"pointer",fontFamily:"inherit"}}>
            {cfg.btn.label}
          </button>
        )}
      </div>
    </div>
  );
}

function ConsensusView({intake, sessionCode}) {
  const lang=intake?.lang||"pt";
  const t=T[lang]||T["pt"];
  const langName={pt:"Brazilian Portuguese",en:"English",es:"Spanish",fr:"French",de:"German",zh:"Mandarin Chinese"}[lang]||"Brazilian Portuguese";
  const [text,setText]=useState(""),[loading,setLoading]=useState(true);
  const {out,done}=useTyping(text);
  useEffect(()=>{
    (async()=>{
      const sd=await store.get(`session:${sessionCode}`)||{};
      const sections=[
        sd.chatA&&`=== FIRST HEARING — ${sd.partA?.name} ===\n${sd.chatA.map(m=>`[${m.role==="user"?sd.partA?.name:"Sergio"}]: ${m.text}`).join("\n\n")}`,
        sd.chatB&&`=== FIRST HEARING — ${sd.partB?.name} ===\n${sd.chatB.map(m=>`[${m.role==="user"?sd.partB?.name:"Sergio"}]: ${m.text}`).join("\n\n")}`,
        sd.chatPonderA&&`=== PONDERATION — ${sd.partA?.name} ===\n${sd.chatPonderA.map(m=>`[${m.role==="user"?sd.partA?.name:"Sergio"}]: ${m.text}`).join("\n\n")}`,
        sd.chatPonderB&&`=== SECOND ROUND — ${sd.partB?.name} ===\n${sd.chatPonderB.map(m=>`[${m.role==="user"?sd.partB?.name:"Sergio"}]: ${m.text}`).join("\n\n")}`,
      ].filter(Boolean).join("\n\n---\n\n");
      try {
        const r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},
          body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1500,messages:[{role:"user",content:
            `You are Sergio, the impartial AI mediator. Based on the complete mediation transcript, issue a FORMAL MEDIATION CONSENSUS document.
${sections}
Parties: ${sd.partA?.name||"Party A"} and ${sd.partB?.name||"Party B"}. Relationship: ${sd.partA?.relation}. Topic: ${sd.topic}.
Tone: empathetic with the party that did not prevail, no moral judgments, recognizes merit on all sides, invites the winner to walk toward the other, logical, fair, pragmatic.
Structure (ENTIRELY in ${langName}):
1) SÍNTESE DO CONFLITO
2) PERSPECTIVA DE ${sd.partA?.name||"PARTE A"}
3) PERSPECTIVA DE ${sd.partB?.name||"PARTE B"}
4) PONTOS DE CONVERGÊNCIA
5) RECOMENDAÇÕES (3-4 pontos concretos e equitativos)
6) PRÓXIMOS PASSOS PARA CADA PARTE
7) Assinatura — Sergio, O Juiz Imparcial
Write ENTIRELY in ${langName}.`}]})});
        const d=await r.json();
        setText(d.content?.map(b=>b.text||"").join("")||"Erro ao gerar consenso.");
      } catch { setText("Não foi possível gerar o consenso."); }
      setLoading(false);
    })();
  },[]);
  return (
    <div style={{minHeight:"100vh",background:"radial-gradient(ellipse at 50% 0%,#0e2028 0%,#0a0f12 60%)",padding:"2rem 1rem",fontFamily:"'Cormorant Garamond',Georgia,serif"}}>
      <style>{css}</style>
      <div style={{maxWidth:640,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:"2.5rem"}}>
          <Logo size={40}/>
          <div style={{fontSize:"0.6rem",letterSpacing:"0.3em",color:"#c9a84c",margin:"1.2rem 0 0.5rem"}}>{t.officialDoc}</div>
          <h1 style={{fontSize:"clamp(1.8rem,4vw,2.6rem)",fontWeight:300,color:"#e8f4f7",margin:"0 0 0.3rem"}}>{t.consensusDocTitle}</h1>
          <div style={{fontSize:"0.82rem",color:"#5a7d89"}}>{sessionCode} · {new Date().toLocaleDateString("pt-BR",{year:"numeric",month:"long",day:"numeric"})}</div>
          <div style={{height:1,background:"linear-gradient(90deg,transparent,#c9a84c88,transparent)",marginTop:"1.4rem"}}/>
        </div>
        <div style={{background:"#111c22",border:"1px solid #1a2e38",borderTop:"2px solid #c9a84c44",borderRadius:4,padding:"2rem",minHeight:240}}>
          {loading
            ?<div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"3rem",gap:"1rem"}}>
              <div style={{display:"flex",gap:6}}>{[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:"#1e6b78",animation:`pulse 1.2s ${i*0.2}s infinite`}}/>)}</div>
              <div style={{fontSize:"0.78rem",color:"#5a7d89",letterSpacing:"0.1em"}}>{t.writing}</div>
            </div>
            :<div style={{fontSize:"0.93rem",lineHeight:1.95,color:"#c8dde2",whiteSpace:"pre-wrap"}}>{out}{!done&&<span style={{animation:"blink 1s infinite",color:"#3dd6e8"}}>▎</span>}</div>
          }
        </div>
        {done&&(
          <div style={{marginTop:"1.5rem",display:"flex",gap:"0.9rem",flexWrap:"wrap"}}>
            <button onClick={()=>window.print()} style={{flex:1,background:"transparent",border:"1px solid #1e6b78",borderRadius:2,padding:"0.8rem",color:"#2bb5c8",fontSize:"0.72rem",letterSpacing:"0.2em",cursor:"pointer",fontFamily:"inherit"}}>{t.printBtn}</button>
            <button onClick={()=>navigator.clipboard.writeText(text)} style={{flex:1,background:"transparent",border:"1px solid #1a2e38",borderRadius:2,padding:"0.8rem",color:"#5a7d89",fontSize:"0.72rem",letterSpacing:"0.2em",cursor:"pointer",fontFamily:"inherit"}}>{t.copyTextBtn}</button>
          </div>
        )}
        <div style={{textAlign:"center",marginTop:"1.8rem",fontSize:"0.68rem",color:"#3a5a64",lineHeight:1.9,whiteSpace:"pre-line"}}>{t.footer}</div>
      </div>
    </div>
  );
}

export default function App() {
  const [screen,setScreen]=useState("loading");
  const [sessionCode,setSessionCode]=useState("");
  const [sessionData,setSessionData]=useState(null);
  const [intake,setIntake]=useState(null);
  const [lang,setLang]=useState("pt");

  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    const s=params.get("session");
    if(s){
      const code=s.toUpperCase();
      store.get(`session:${code}`).then(data=>{
        setSessionCode(code); setSessionData(data); setLang(data?.lang||"pt");
        const isPartB=data?.partA&&!data?.partB;
        if(isPartB){setScreen("intake");return;}
        const ph=data?.phase;
        if(ph==="pondering_a"||ph==="pondering_b"||ph==="ready_consensus"||ph==="waiting_b"){setScreen("waiting");return;}
        setScreen("intake");
      });
    } else { setScreen("code"); }
  },[]);

  const handleCode=async(code,existing,selectedLang)=>{
    setSessionCode(code); setSessionData(existing); setLang(selectedLang||"pt");
    if(existing){
      const isPartB=existing.partA&&!existing.partB;
      if(isPartB){setScreen("intake");return;}
      const ph=existing.phase;
      if(ph==="pondering_a"||ph==="pondering_b"||ph==="ready_consensus"||ph==="waiting_b"){setScreen("waiting");return;}
    }
    setScreen("intake");
  };

  const handleIntake=async(data)=>{
    setIntake(data);
    if(data.partLabel==="A"){
      await store.set(`session:${data.sessionCode}`,{
        partA:{name:data.name,email:data.email,relation:data.relation,context:data.context||"(audio)"},
        topic:data.topic, phase:"intake_a", lang:data.lang,
      });
    }
    const fresh=await store.get(`session:${data.sessionCode}`);
    setSessionData(fresh);
    setScreen("chat");
  };

  const handleWaiting=async(mode)=>{
    const fresh=await store.get(`session:${sessionCode}`);
    setSessionData(fresh);
    if(mode==="consensus"){setScreen("consensus");}
    else{setScreen("chat");}
  };

  if(screen==="loading") return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"#0a0f12",fontFamily:"'Cormorant Garamond',Georgia,serif",color:"#5a7d89",fontSize:"0.8rem",letterSpacing:"0.2em"}}>
      <style>{css}</style>
      <span style={{animation:"pulse 1.5s infinite"}}>{T[lang]?.loading||"CARREGANDO..."}</span>
    </div>
  );

  return (
    <>
      {screen==="code"      && <CodeEntry onEnter={handleCode}/>}
      {screen==="intake"    && <IntakeForm sessionCode={sessionCode} existingSession={sessionData} onSubmit={handleIntake} lang={lang}/>}
      {screen==="chat"      && intake && <SergioChat intake={intake} sessionData={sessionData} onDone={()=>setScreen("consensus")} onWait={()=>setScreen("waiting")}/>}
      {screen==="waiting"   && <WaitingRoom sessionCode={sessionCode} intake={intake} onReady={handleWaiting}/>}
      {screen==="consensus" && <ConsensusView intake={intake} sessionCode={sessionCode}/>}
    </>
  );
}

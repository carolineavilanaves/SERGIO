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
`;

const inp = {
  width:"100%", background:"#0a1417", border:"1px solid #1a2e38",
  borderRadius:2, padding:"0.75rem 1rem", color:"#e8f4f7",
  fontSize:"0.95rem", outline:"none", transition:"border-color 0.2s",
};

const LANGS = {
  "pt": { flag:"🇧🇷", label:"Português" },
  "en": { flag:"🇺🇸", label:"English" },
  "es": { flag:"🇪🇸", label:"Español" },
  "fr": { flag:"🇫🇷", label:"Français" },
  "it": { flag:"🇮🇹", label:"Italiano" },
  "ja": { flag:"🇯🇵", label:"日本語" },
  "zh": { flag:"🇨🇳", label:"中文" },
};

const T = {
  pt: {
    tagline:"A IA de se buscar a paz",
    subtitle:"As IAs estão sendo usadas para brigar. O Sergio existe para construir acordos.",
    sessionLabel:"Código da Sessão",
    sessionPlaceholder:"ex: CASO-2024",
    sessionBtn:"Acessar →",
    sessionHint:"Primeira vez? Crie qualquer código e compartilhe com a outra parte.",
    formTitle:"Sua perspectiva",
    formSubtitle:"Informações confidenciais. O Sergio usa apenas para mediar com imparcialidade.",
    nameLabel:"Seu nome", namePh:"Como você se chama?",
    emailLabel:"Seu e-mail", emailPh:"seu@email.com",
    relationLabel:"Sua relação com a outra parte", relationPh:"ex: cônjuge, sócio, colega...",
    otherLabel:"Nome da outra parte", otherPh:"Como se chama a outra pessoa?",
    topicLabel:"Tema central do conflito", topicPh:"Descreva brevemente o assunto...",
    contextLabel:"Contexto detalhado", contextPh:"O que aconteceu, como você se sente, o que espera da mediação...",
    submitBtn:"Enviar ao Sergio →",
    invitedBy:"Você foi convidado(a) por",
    invitedAbout:"para uma mediação. Suas respostas são confidenciais.",
    recordBtn:"GRAVAR", stopBtn:"PARAR",
    orRecord:"ou grave um áudio",
    mediationTitle:"MEDIAÇÃO POR INTELIGÊNCIA ARTIFICIAL",
    judgeTitle:"O JUIZ IMPARCIAL",
    part:"PARTE",
    privateSession:"SESSÃO PRIVADA",
    ponderation:"PONDERAÇÃO PÓS-OITIVA",
    secondRound:"SEGUNDA RODADA",
    nextStep:"PRÓXIMO PASSO — CONVIDAR A OUTRA PARTE",
    inviteMsg:"Mensagem de convite para copiar e enviar:",
    inviteLink:"Link da sessão:",
    copyMsg:"⎘ Copiar mensagem", copiedMsg:"✓ Copiado!",
    copyLink:"⎘ Copiar link",
    waitingRoom:"Ir para sala de espera →",
    bDoneTitle:"OITIVA CONCLUÍDA",
    waitingTitle:"Aguardando a outra parte",
    ponderATitle:"O Sergio quer conversar com você",
    ponderBTitle:"O Sergio precisa ouvir você novamente",
    consensusTitle:"Mediação concluída",
    startPonder:"INICIAR PONDERAÇÃO →",
    continueBtn:"CONTINUAR →",
    viewConsensus:"VER CONSENSO →",
    checking:"Verificando...",
    needBTitle:"SEGUNDA RODADA ACIONADA",
    readyTitle:"◆ MEDIAÇÃO COMPLETA",
    generateConsensus:"GERAR CONSENSO FINAL →",
    officialDoc:"◆ DOCUMENTO OFICIAL ◆",
    consensusDocTitle:"Consenso de Mediação",
    writing:"Sergio está redigindo o consenso...",
    printBtn:"↓ IMPRIMIR / PDF",
    copyTextBtn:"⎘ COPIAR TEXTO",
    footer:"Documento gerado por Sergio — mediador por inteligência artificial.\nRecomenda-se validação jurídica quando aplicável.",
    loading:"CARREGANDO...",
    chooseLanguage:"Escolha seu idioma",
  },
  en: {
    tagline:"The AI for seeking peace",
    subtitle:"AIs are being used to fight. Sergio exists to build agreements.",
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
    invitedBy:"You were invited by",
    invitedAbout:"for a mediation. Your answers are confidential.",
    recordBtn:"RECORD", stopBtn:"STOP", orRecord:"or record audio",
    mediationTitle:"MEDIATION BY ARTIFICIAL INTELLIGENCE",
    judgeTitle:"THE IMPARTIAL JUDGE",
    part:"PART", privateSession:"PRIVATE SESSION",
    ponderation:"POST-HEARING PONDERATION", secondRound:"SECOND ROUND",
    nextStep:"NEXT STEP — INVITE THE OTHER PARTY",
    inviteMsg:"Invitation message to copy and send:",
    inviteLink:"Session link:",
    copyMsg:"⎘ Copy message", copiedMsg:"✓ Copied!",
    copyLink:"⎘ Copy link",
    waitingRoom:"Go to waiting room →",
    bDoneTitle:"HEARING CONCLUDED",
    waitingTitle:"Waiting for the other party",
    ponderATitle:"Sergio wants to talk with you",
    ponderBTitle:"Sergio needs to hear you again",
    consensusTitle:"Mediation concluded",
    startPonder:"START PONDERATION →",
    continueBtn:"CONTINUE →",
    viewConsensus:"VIEW CONSENSUS →",
    checking:"Checking...",
    needBTitle:"SECOND ROUND TRIGGERED",
    readyTitle:"◆ MEDIATION COMPLETE",
    generateConsensus:"GENERATE FINAL CONSENSUS →",
    officialDoc:"◆ OFFICIAL DOCUMENT ◆",
    consensusDocTitle:"Mediation Consensus",
    writing:"Sergio is drafting the consensus...",
    printBtn:"↓ PRINT / PDF", copyTextBtn:"⎘ COPY TEXT",
    footer:"Document generated by Sergio — artificial intelligence mediator.\nLegal validation is recommended when applicable.",
    loading:"LOADING...", chooseLanguage:"Choose your language",
  },
  es: {
    tagline:"La IA para buscar la paz",
    subtitle:"Las IAs se usan para pelear. Sergio existe para construir acuerdos.",
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
    invitedBy:"Fuiste invitado/a por",
    invitedAbout:"para una mediación. Tus respuestas son confidenciales.",
    recordBtn:"GRABAR", stopBtn:"PARAR", orRecord:"o graba un audio",
    mediationTitle:"MEDIACIÓN POR INTELIGENCIA ARTIFICIAL",
    judgeTitle:"EL JUEZ IMPARCIAL",
    part:"PARTE", privateSession:"SESIÓN PRIVADA",
    ponderation:"PONDERACIÓN POST-AUDIENCIA", secondRound:"SEGUNDA RONDA",
    nextStep:"SIGUIENTE PASO — INVITAR A LA OTRA PARTE",
    inviteMsg:"Mensaje de invitación para copiar y enviar:",
    inviteLink:"Enlace de sesión:",
    copyMsg:"⎘ Copiar mensaje", copiedMsg:"✓ Copiado!",
    copyLink:"⎘ Copiar enlace",
    waitingRoom:"Ir a sala de espera →",
    bDoneTitle:"AUDIENCIA CONCLUIDA",
    waitingTitle:"Esperando a la otra parte",
    ponderATitle:"Sergio quiere hablar contigo",
    ponderBTitle:"Sergio necesita escucharte de nuevo",
    consensusTitle:"Mediación concluida",
    startPonder:"INICIAR PONDERACIÓN →",
    continueBtn:"CONTINUAR →",
    viewConsensus:"VER CONSENSO →",
    checking:"Verificando...",
    needBTitle:"SEGUNDA RONDA ACTIVADA",
    readyTitle:"◆ MEDIACIÓN COMPLETA",
    generateConsensus:"GENERAR CONSENSO FINAL →",
    officialDoc:"◆ DOCUMENTO OFICIAL ◆",
    consensusDocTitle:"Consenso de Mediación",
    writing:"Sergio está redactando el consenso...",
    printBtn:"↓ IMPRIMIR / PDF", copyTextBtn:"⎘ COPIAR TEXTO",
    footer:"Documento generado por Sergio — mediador por inteligencia artificial.\nSe recomienda validación jurídica cuando corresponda.",
    loading:"CARGANDO...", chooseLanguage:"Elige tu idioma",
  },
  fr: {
    tagline:"L'IA pour chercher la paix",
    subtitle:"Les IAs sont utilisées pour se disputer. Sergio existe pour construire des accords.",
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
    invitedBy:"Vous avez été invité(e) par",
    invitedAbout:"pour une médiation. Vos réponses sont confidentielles.",
    recordBtn:"ENREGISTRER", stopBtn:"ARRÊTER", orRecord:"ou enregistrez un audio",
    mediationTitle:"MÉDIATION PAR INTELLIGENCE ARTIFICIELLE",
    judgeTitle:"LE JUGE IMPARTIAL",
    part:"PARTIE", privateSession:"SESSION PRIVÉE",
    ponderation:"PONDÉRATION POST-AUDITION", secondRound:"DEUXIÈME TOUR",
    nextStep:"PROCHAINE ÉTAPE — INVITER L'AUTRE PARTIE",
    inviteMsg:"Message d'invitation à copier et envoyer :",
    inviteLink:"Lien de session :",
    copyMsg:"⎘ Copier le message", copiedMsg:"✓ Copié !",
    copyLink:"⎘ Copier le lien",
    waitingRoom:"Aller en salle d'attente →",
    bDoneTitle:"AUDITION TERMINÉE",
    waitingTitle:"En attente de l'autre partie",
    ponderATitle:"Sergio veut vous parler",
    ponderBTitle:"Sergio a besoin de vous entendre à nouveau",
    consensusTitle:"Médiation terminée",
    startPonder:"DÉMARRER LA PONDÉRATION →",
    continueBtn:"CONTINUER →",
    viewConsensus:"VOIR LE CONSENSUS →",
    checking:"Vérification...",
    needBTitle:"DEUXIÈME TOUR DÉCLENCHÉ",
    readyTitle:"◆ MÉDIATION COMPLÈTE",
    generateConsensus:"GÉNÉRER LE CONSENSUS FINAL →",
    officialDoc:"◆ DOCUMENT OFFICIEL ◆",
    consensusDocTitle:"Consensus de Médiation",
    writing:"Sergio rédige le consensus...",
    printBtn:"↓ IMPRIMER / PDF", copyTextBtn:"⎘ COPIER LE TEXTE",
    footer:"Document généré par Sergio — médiateur par intelligence artificielle.\nUne validation juridique est recommandée le cas échéant.",
    loading:"CHARGEMENT...", chooseLanguage:"Choisissez votre langue",
  },
  it: {
    tagline:"L'IA per cercare la pace",
    subtitle:"Le IA vengono usate per litigare. Sergio esiste per costruire accordi.",
    sessionLabel:"Codice Sessione", sessionPlaceholder:"es: CASO-2024",
    sessionBtn:"Accedi →", sessionHint:"Prima volta? Crea un codice e condividilo con l'altra parte.",
    formTitle:"La tua prospettiva", formSubtitle:"Informazioni riservate. Sergio le usa solo per mediare con imparzialità.",
    nameLabel:"Il tuo nome", namePh:"Come ti chiami?",
    emailLabel:"La tua email", emailPh:"tua@email.com",
    relationLabel:"Il tuo rapporto con l'altra parte", relationPh:"es: coniuge, socio, collega...",
    otherLabel:"Nome dell'altra parte", otherPh:"Come si chiama l'altra persona?",
    topicLabel:"Tema centrale del conflitto", topicPh:"Descrivi brevemente la situazione...",
    contextLabel:"Contesto dettagliato", contextPh:"Cosa è successo, come ti senti, cosa ti aspetti dalla mediazione...",
    submitBtn:"Invia a Sergio →",
    invitedBy:"Sei stato/a invitato/a da",
    invitedAbout:"per una mediazione. Le tue risposte sono riservate.",
    recordBtn:"REGISTRA", stopBtn:"FERMA", orRecord:"o registra un audio",
    mediationTitle:"MEDIAZIONE PER INTELLIGENZA ARTIFICIALE",
    judgeTitle:"IL GIUDICE IMPARZIALE",
    part:"PARTE", privateSession:"SESSIONE PRIVATA",
    ponderation:"PONDERAZIONE POST-UDIENZA", secondRound:"SECONDO ROUND",
    nextStep:"PROSSIMO PASSO — INVITARE L'ALTRA PARTE",
    inviteMsg:"Messaggio di invito da copiare e inviare:",
    inviteLink:"Link sessione:",
    copyMsg:"⎘ Copia messaggio", copiedMsg:"✓ Copiato!",
    copyLink:"⎘ Copia link",
    waitingRoom:"Vai alla sala d'attesa →",
    bDoneTitle:"UDIENZA CONCLUSA",
    waitingTitle:"In attesa dell'altra parte",
    ponderATitle:"Sergio vuole parlare con te",
    ponderBTitle:"Sergio ha bisogno di sentirti di nuovo",
    consensusTitle:"Mediazione conclusa",
    startPonder:"INIZIA PONDERAZIONE →",
    continueBtn:"CONTINUA →",
    viewConsensus:"VEDI CONSENSO →",
    checking:"Verifica...",
    needBTitle:"SECONDO ROUND ATTIVATO",
    readyTitle:"◆ MEDIAZIONE COMPLETA",
    generateConsensus:"GENERA CONSENSO FINALE →",
    officialDoc:"◆ DOCUMENTO UFFICIALE ◆",
    consensusDocTitle:"Consenso di Mediazione",
    writing:"Sergio sta redigendo il consenso...",
    printBtn:"↓ STAMPA / PDF", copyTextBtn:"⎘ COPIA TESTO",
    footer:"Documento generato da Sergio — mediatore per intelligenza artificiale.\nSi raccomanda la validazione legale ove applicabile.",
    loading:"CARICAMENTO...", chooseLanguage:"Scegli la tua lingua",
  },
  ja: {
    tagline:"平和を求めるAI",
    subtitle:"AIは争いに使われています。Sergioは合意を築くために存在します。",
    sessionLabel:"セッションコード", sessionPlaceholder:"例: CASE-2024",
    sessionBtn:"アクセス →", sessionHint:"初めての方？コードを作成して相手と共有してください。",
    formTitle:"あなたの視点", formSubtitle:"機密情報です。Sergioは公平な調停のためだけに使用します。",
    nameLabel:"お名前", namePh:"お名前を入力してください",
    emailLabel:"メールアドレス", emailPh:"your@email.com",
    relationLabel:"相手との関係", relationPh:"例: 配偶者、パートナー、同僚...",
    otherLabel:"相手の名前", otherPh:"相手の方のお名前",
    topicLabel:"紛争の主なテーマ", topicPh:"状況を簡単に説明してください...",
    contextLabel:"詳細な状況", contextPh:"何が起きたか、どう感じているか、調停に何を期待するか...",
    submitBtn:"Sergioに送信 →",
    invitedBy:"招待者:",
    invitedAbout:"による調停に招待されました。回答は機密として扱われます。",
    recordBtn:"録音", stopBtn:"停止", orRecord:"または音声を録音",
    mediationTitle:"人工知能による調停",
    judgeTitle:"公平な審判者",
    part:"パート", privateSession:"プライベートセッション",
    ponderation:"審問後熟考", secondRound:"第2ラウンド",
    nextStep:"次のステップ — 相手を招待",
    inviteMsg:"コピーして送る招待メッセージ:",
    inviteLink:"セッションリンク:",
    copyMsg:"⎘ メッセージをコピー", copiedMsg:"✓ コピーしました!",
    copyLink:"⎘ リンクをコピー",
    waitingRoom:"待合室へ →",
    bDoneTitle:"審問完了",
    waitingTitle:"相手方を待っています",
    ponderATitle:"Sergioがあなたと話したがっています",
    ponderBTitle:"Sergioが再度あなたの意見を聞く必要があります",
    consensusTitle:"調停完了",
    startPonder:"熟考を開始 →",
    continueBtn:"続ける →",
    viewConsensus:"合意を見る →",
    checking:"確認中...",
    needBTitle:"第2ラウンド開始",
    readyTitle:"◆ 調停完了",
    generateConsensus:"最終合意を生成 →",
    officialDoc:"◆ 公式文書 ◆",
    consensusDocTitle:"調停合意書",
    writing:"Sergioが合意書を作成しています...",
    printBtn:"↓ 印刷 / PDF", copyTextBtn:"⎘ テキストをコピー",
    footer:"このドキュメントはAI調停者Sergioによって生成されました。\n必要に応じて法的検証をお勧めします。",
    loading:"読み込み中...", chooseLanguage:"言語を選択",
  },
  zh: {
    tagline:"寻求和平的AI",
    subtitle:"AI正被用于争吵。Sergio的存在是为了构建协议。",
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
    invitedBy:"您被邀请者:",
    invitedAbout:"邀请参加调解。您的回答将保密。",
    recordBtn:"录音", stopBtn:"停止", orRecord:"或录制音频",
    mediationTitle:"人工智能调解",
    judgeTitle:"公正的裁判者",
    part:"方", privateSession:"私人会话",
    ponderation:"听证后深思", secondRound:"第二轮",
    nextStep:"下一步 — 邀请另一方",
    inviteMsg:"复制并发送的邀请消息:",
    inviteLink:"会话链接:",
    copyMsg:"⎘ 复制消息", copiedMsg:"✓ 已复制!",
    copyLink:"⎘ 复制链接",
    waitingRoom:"前往等候室 →",
    bDoneTitle:"听证完成",
    waitingTitle:"等待另一方",
    ponderATitle:"Sergio想与您交谈",
    ponderBTitle:"Sergio需要再次听取您的意见",
    consensusTitle:"调解完成",
    startPonder:"开始深思 →",
    continueBtn:"继续 →",
    viewConsensus:"查看共识 →",
    checking:"检查中...",
    needBTitle:"第二轮已触发",
    readyTitle:"◆ 调解完成",
    generateConsensus:"生成最终共识 →",
    officialDoc:"◆ 官方文件 ◆",
    consensusDocTitle:"调解共识书",
    writing:"Sergio正在起草共识...",
    printBtn:"↓ 打印 / PDF", copyTextBtn:"⎘ 复制文本",
    footer:"本文件由AI调解员Sergio生成。\n必要时建议进行法律验证。",
    loading:"加载中...", chooseLanguage:"选择您的语言",
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

// ── Tela de entrada ───────────────────────────────────────────────────────────
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

      {/* Seletor de idioma */}
      <div style={{position:"absolute",top:"1.5rem",right:"1.5rem",display:"flex",gap:"0.5rem",flexWrap:"wrap",justifyContent:"flex-end",maxWidth:280}}>
        {Object.entries(LANGS).map(([k,v])=>(
          <button key={k} onClick={()=>setLang(k)} style={{background:lang===k?"#1e6b7833":"transparent",border:`1px solid ${lang===k?"#1e6b78":"#1a2e38"}`,borderRadius:20,padding:"0.3rem 0.7rem",color:lang===k?"#3dd6e8":"#5a7d89",fontSize:"0.72rem",cursor:"pointer",fontFamily:"inherit",transition:"all 0.2s"}}>
            {v.flag} {v.label}
          </button>
        ))}
      </div>

      <Logo size={64}/>
      <div style={{marginTop:"1.5rem",fontSize:"0.58rem",letterSpacing:"0.35em",color:"#5a7d89"}}>{t.mediationTitle}</div>
      <h1 style={{fontSize:"clamp(2.5rem,6vw,4rem)",fontWeight:300,letterSpacing:"0.1em",color:"#e8f4f7",margin:"0.4rem 0 0"}}>SERGIO</h1>
      <div style={{fontSize:"0.9rem",color:"#2bb5c8",letterSpacing:"0.05em",marginTop:"0.3rem",fontStyle:"italic"}}>{t.tagline}</div>
      <div style={{height:1,width:50,background:"linear-gradient(90deg,transparent,#3dd6e8,transparent)",margin:"1rem auto 1rem"}}/>
      <p style={{color:"#5a7d89",fontSize:"0.85rem",textAlign:"center",maxWidth:380,lineHeight:1.8,marginBottom:"2rem"}}>{t.subtitle}</p>

      <div style={{background:"#111c22",border:"1px solid #1a2e38",borderRadius:4,padding:"2rem 2.5rem",width:"100%",maxWidth:380,animation:shake?"shake 0.4s ease":"none"}}>
        <label style={{fontSize:"0.62rem",letterSpacing:"0.2em",color:"#5a7d89",textTransform:"uppercase",display:"block",marginBottom:"0.5rem"}}>{t.sessionLabel}</label>
        <input value={code} onChange={e=>{setCode(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&go()}
          placeholder={t.sessionPlaceholder} style={{...inp,fontSize:"1.1rem",letterSpacing:"0.12em"}}
          onFocus={e=>e.target.style.borderColor="#26909f"} onBlur={e=>e.target.style.borderColor="#1a2e38"}/>
        {err&&<div style={{color:"#e84040",fontSize:"0.75rem",marginTop:"0.4rem"}}>{err}</div>}
        <button onClick={go} disabled={loading} style={{marginTop:"1.2rem",width:"100%",background:"linear-gradient(135deg,#1e6b78,#26909f)",border:"none",borderRadius:2,padding:"0.85rem",color:"#e8f4f7",fontSize:"0.78rem",letterSpacing:"0.2em",textTransform:"uppercase",cursor:"pointer",fontFamily:"inherit",opacity:loading?0.6:1}}>
          {loading?"...":t.sessionBtn}
        </button>
        <div style={{textAlign:"center",marginTop:"1rem",fontSize:"0.72rem",color:"#3a5a64",lineHeight:1.6}}>{t.sessionHint}</div>
      </div>
    </div>
  );
}

// ── Formulário de intake ──────────────────────────────────────────────────────
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
    } catch { setRecErr("Mic permission denied."); }
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
      relation:isPartB ? existingSession.partA.relation : relationRef.current?.value?.trim(),
      otherName:isPartB ? existingSession.partA.name : otherRef.current?.value?.trim(),
      topic:isPartB ? existingSession.topic : topicRef.current?.value?.trim(),
      context:contextRef.current?.value?.trim(),
    };
    if(!v.name||!v.email||(!v.context&&!audioBlob)){
      alert("Fill in all required fields.");return;
    }
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

// ── Chat ──────────────────────────────────────────────────────────────────────
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
    if(isPondering){ const prev=sessionData?.chatA||[]; setMsgs(prev); callSergio("__ponder__",prev); }
    else if(isPonderingB){ const prev=sessionData?.chatB||[]; setMsgs(prev); callSergio("__ponder_b__",prev); }
    else { callSergio("__init__",[]); }
  },[]);

  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[messages,loading]);

  const langName = {pt:"Brazilian Portuguese",en:"English",es:"Spanish",fr:"French",it:"Italian",ja:"Japanese",zh:"Mandarin Chinese"}[lang]||"Brazilian Portuguese";

  const buildSystem=()=>{
    const otherName=isPartA?intake.otherName:(sessionData?.partA?.name||intake.otherName);

    if(isPondering) return `You are Sergio, an experienced and impartial AI mediator. ALWAYS respond in ${langName}.
You have already heard both parties privately:
— ${sessionData.partA.name} (your current interlocutor): "${sessionData.partA.context}"
— ${sessionData.partB.name}: "${sessionData.partB.context}"

Now is the POST-HEARING PONDERATION with ${sessionData.partA.name}.
Your goal: use what you know from BOTH sides to guide ${sessionData.partA.name} toward a middle ground.
- You KNOW what ${sessionData.partB.name} thinks and feels — use this knowledge strategically to ask questions and suggest compromises
- DO NOT reveal what ${sessionData.partB.name} said directly — maintain absolute confidentiality
- Explore whether ${sessionData.partA.name} is willing to concede on key points
- Suggest possible middle-ground solutions based on what you heard from both sides
After 2-4 exchanges, decide: if there's enough convergence, say exactly: "Tenho o que preciso para elaborar o consenso." / "I have what I need to elaborate the consensus." (in ${langName})
If you need to hear ${sessionData.partB.name} again, say: "Preciso conversar com ${sessionData.partB.name} mais uma vez." / "I need to speak with ${sessionData.partB.name} once more." (in ${langName})
Respond in ${langName}. Empathetic, 2-3 paragraphs.`;

    if(isPonderingB) return `You are Sergio, an experienced and impartial AI mediator. ALWAYS respond in ${langName}.
SECOND ROUND with ${sessionData.partB.name}.
You already heard ${sessionData.partA.name} in the ponderation. You know their position deeply.
Use that knowledge to guide ${sessionData.partB.name} toward convergence — without revealing confidential details from the other party.
Suggest compromise solutions. After 2-4 exchanges, say: "Tenho o que preciso para elaborar o consenso final." (in ${langName})
Respond in ${langName}. Empathetic, 2-3 paragraphs.`;

    const partAContext = isPartA ? "" : `\nYou already know ${sessionData?.partA?.name}'s side: "${sessionData?.partA?.context}". Use this knowledge to ask strategic questions to ${intake.name} and explore middle-ground solutions — without revealing what ${sessionData?.partA?.name} said.`;

    return `You are Sergio, an impartial AI mediator known as "The Impartial Judge". ALWAYS respond in ${langName}.
Tagline: "The AI for seeking peace. While AIs are used to fight, Sergio exists to build agreements."
CONFIDENTIAL context: ${intake.name} (${intake.relation}) in conflict with ${otherName} about "${intake.topic||sessionData?.topic}". Their context: "${intake.context||"(audio recorded)"}"
${partAContext}
${isPartA
  ? `FIRST HEARING — Party A. Speak privately with ${intake.name}. Ask 3-5 precise questions to deeply understand their perspective, feelings, and desired outcome. When you understand well, say exactly (in ${langName}): "Thank you ${intake.name}. I deeply understand your perspective. I will now hear ${otherName} privately and, after that, I will return to you for a ponderation conversation."`
  : `FIRST HEARING — Party B. Speak privately with ${intake.name}. Ask 3-5 strategic questions — use your knowledge of the other side to probe for possible middle ground. When you understand well, say exactly (in ${langName}): "Thank you ${intake.name}. I have now heard both parties and will return to ${sessionData?.partA?.name} for the ponderation stage."`
}
Respond in ${langName}. 2-3 paragraphs. Absolute confidentiality about the other party's specific words.`;
  };

  const callSergio=async(userMsg, histOverride)=>{
    const isInit=["__init__","__ponder__","__ponder_b__"].includes(userMsg);
    const currentMsgs=histOverride!==undefined?histOverride:messagesRef.current;
    if(!isInit) setMsgs(m=>[...m,{role:"user",text:userMsg}]);
    setLoading(true);

    const sys=buildSystem();
    const hist=isInit?[]:currentMsgs.map(m=>({role:m.role==="user"?"user":"assistant",content:m.text}));
    let prompt;
    if(userMsg==="__init__") prompt=`Greet ${intake.name} warmly and ask your first question about "${intake.topic||sessionData?.topic}". Respond in ${langName}.`;
    else if(userMsg==="__ponder__") prompt=`Return to speak with ${sessionData.partA.name} in the ponderation. Briefly reintroduce yourself and start exploring compromise possibilities. Respond in ${langName}.`;
    else if(userMsg==="__ponder_b__") prompt=`Return to speak with ${sessionData.partB.name} in the second round. Explore convergences. Respond in ${langName}.`;
    else prompt=userMsg;

    try {
      const r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:sys,messages:[...hist,{role:"user",content:prompt}]})});
      const d=await r.json();
      const reply=d.content?.map(b=>b.text||"").join("")||"Connection error.";
      setMsgs(m=>[...(isInit?[]:m),{role:"sergio",text:reply}]);

      // Detectar fim da oitiva A e gerar mensagem de convite
      const donePhrasesA=["retornarei","retornar","voltarei","voltar","return","volveré","volvere","reviendrai","tornerò","戻","回来","aguarde","wait","espere","ouvir","ouvirei","escutarei","hear","escuchar"];
      if(isPartA&&!isPondering&&donePhrasesA.some(p=>reply.includes(p))){
        setPhase("show_link");
        const updatedMsgs=[...currentMsgs,{role:"sergio",text:reply}];
        const existing=await store.get(`session:${intake.sessionCode}`)||{};
        await store.set(`session:${intake.sessionCode}`,{
          ...existing,
          partA:{name:intake.name,email:intake.email,relation:intake.relation,context:intake.context||"(audio)"},
          topic:intake.topic,
          chatA:updatedMsgs,
          phase:"waiting_b",
          lang,
        });
        generateInviteMessage(intake, lang);
      }

      const donePhrasesBpt=["retornarei a","I have now heard","he escuchado a ambas","j'ai maintenant entendu","ho ora ascoltato","両者の","我已听取"];
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

      const consensusPhrases=["Tenho o que preciso","I have what I need","Tengo lo que necesito","J'ai ce qu'il me faut","Ho quello che mi serve","必要な情報が","我已获得"];
      if(isPondering&&consensusPhrases.some(p=>reply.includes(p))){
        setPhase("consensus_ready");
        const existing=await store.get(`session:${intake.sessionCode}`)||{};
        await store.set(`session:${intake.sessionCode}`,{...existing,chatPonderA:[...currentMsgs,{role:"sergio",text:reply}],phase:"ready_consensus"});
      }

      const needBPhrases=["Preciso conversar com","I need to speak with","Necesito hablar con","J'ai besoin de parler","Ho bisogno di parlare","もう一度","需要再次"];
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
    } catch { setMsgs(m=>[...m,{role:"sergio",text:"Connection error. Please try again."}]); }
    setLoading(false);
  };

  const generateInviteMessage=async(intake, lang)=>{
    const langName2={pt:"Brazilian Portuguese",en:"English",es:"Spanish",fr:"French",it:"Italian",ja:"Japanese",zh:"Mandarin Chinese"}[lang]||"Brazilian Portuguese";
    try {
      const r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:300,messages:[{role:"user",content:
          `Write a short, warm invitation message in ${langName2} for ${intake.otherName} to join a mediation session on Sergio (an AI mediator). 
The topic is: "${intake.topic}". Their relationship: ${intake.relation}.
The message should:
- Be warm and neutral (not taking sides)
- Explain briefly what Sergio is ("The Impartial Judge - AI for seeking peace")
- Say they are invited to share their perspective privately
- NOT reveal anything ${intake.name} said
- Be 3-4 sentences max
- Do NOT include the link (it will be added separately)
Write ONLY the message, no explanations.`
        }]})});
      const d=await r.json();
      const msg=d.content?.map(b=>b.text||"").join("")||"";
      setInviteMessage(msg);
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
      {/* Header */}
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

      {/* Mensagens */}
      <div style={{flex:1,overflowY:"auto",padding:"1.4rem",display:"flex",flexDirection:"column",gap:"1.1rem"}}>
        {messages.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",animation:"fadeUp 0.3s ease"}}>
            {m.role==="sergio"&&<div style={{width:26,height:26,borderRadius:"50%",background:"#1e6b7833",border:"1px solid #1e6b78",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.7rem",color:"#3dd6e8",marginRight:"0.5rem",flexShrink:0,marginTop:2}}>S</div>}
            <div style={{maxWidth:"72%",background:m.role==="user"?"#26909f18":"#111c22",border:`1px solid ${m.role==="user"?"#26909f44":"#1a2e38"}`,borderRadius:m.role==="user"?"12px 12px 2px 12px":"12px 12px 12px 2px",padding:"0.8rem 1rem",fontSize:"0.93rem",lineHeight:1.8,whiteSpace:"pre-wrap",color:"#c8dde2"}}>{m.text}</div>
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
              <button onClick={onWait} style={{background:"transparent",border:"1px solid #1a2e38",borderRadius:2,padding:"0.6rem 1.4rem",color:"#5a7d89",fontSize:"0.72rem",letterSpacing:"0.15em",cursor:"pointer",fontFamily:"inherit"}}>
                {t.waitingRoom}
              </button>
            </div>
          </div>
        )}

        {phase==="b_done"&&(
          <div style={{background:"#111c22",border:"1px solid #1e6b7844",borderTop:"2px solid #1e6b78",borderRadius:4,padding:"1.5rem",animation:"fadeUp 0.4s ease"}}>
            <div style={{fontSize:"0.62rem",letterSpacing:"0.25em",color:"#2bb5c8",marginBottom:"0.8rem"}}>{t.bDoneTitle}</div>
            <p style={{color:"#c8dde2",fontSize:"0.9rem",lineHeight:1.8}}>
              Sergio {t.part} → <strong>{sessionData?.partA?.name||intake.otherName}</strong>
            </p>
          </div>
        )}

        {phase==="need_b_again"&&(
          <div style={{background:"#111c22",border:"1px solid #c9a84c44",borderTop:"2px solid #c9a84c",borderRadius:4,padding:"1.5rem",animation:"fadeUp 0.4s ease"}}>
            <div style={{fontSize:"0.62rem",letterSpacing:"0.25em",color:"#c9a84c",marginBottom:"0.8rem"}}>{t.needBTitle}</div>
            <p style={{color:"#c8dde2",fontSize:"0.9rem",lineHeight:1.8}}>
              Sergio → <strong>{sessionData?.partB?.name}</strong>
            </p>
          </div>
        )}

        {phase==="consensus_ready"&&(
          <div style={{background:"#111c22",border:"1px solid #c9a84c44",borderTop:"2px solid #c9a84c",borderRadius:4,padding:"1.5rem",animation:"fadeUp 0.4s ease"}}>
            <div style={{fontSize:"0.62rem",letterSpacing:"0.25em",color:"#c9a84c",marginBottom:"0.8rem"}}>{t.readyTitle}</div>
            <p style={{color:"#c8dde2",fontSize:"0.9rem",lineHeight:1.8,marginBottom:"1.2rem"}}>
              Sergio
            </p>
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
            placeholder="..."
            style={{...inp,flex:1}} onFocus={e=>e.target.style.borderColor="#26909f"} onBlur={e=>e.target.style.borderColor="#1a2e38"}/>
          <button onClick={send} disabled={!input.trim()||loading}
            style={{background:input.trim()&&!loading?"linear-gradient(135deg,#1e6b78,#26909f)":"#111c22",border:"none",borderRadius:2,padding:"0 1.1rem",color:input.trim()&&!loading?"#e8f4f7":"#3a5a64",cursor:input.trim()&&!loading?"pointer":"not-allowed",fontSize:"1.1rem"}}>→</button>
        </div>
      )}
    </div>
  );
}

// ── Sala de Espera ────────────────────────────────────────────────────────────
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
  const isPartB=intake?.partLabel==="B";
  let status="waiting";
  if(isPartA&&sessionPhase==="pondering_a") status="ponder_a";
  if(isPartB&&sessionPhase==="pondering_b") status="ponder_b";
  if(sessionPhase==="ready_consensus") status="consensus";

  const configs={
    waiting:{color:"#2bb5c8",icon:"○",title:t.waitingTitle,body:`Sergio... ${intake?.email}`,btn:null},
    ponder_a:{color:"#c9a84c",icon:"◈",title:t.ponderATitle,body:"",btn:{label:t.startPonder,fn:()=>onReady("ponder_a")}},
    ponder_b:{color:"#c9a84c",icon:"◈",title:t.ponderBTitle,body:"",btn:{label:t.continueBtn,fn:()=>onReady("ponder_b")}},
    consensus:{color:"#c9a84c",icon:"◆",title:t.consensusTitle,body:"",btn:{label:t.viewConsensus,fn:()=>onReady("consensus")}},
  };
  const cfg=configs[status];

  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:"2rem",background:"radial-gradient(ellipse at 50% 30%,#0e2028 0%,#0a0f12 70%)",fontFamily:"'Cormorant Garamond',Georgia,serif"}}>
      <style>{css}</style>
      <div style={{background:"#111c22",border:`1px solid ${cfg.color}33`,borderTop:`2px solid ${cfg.color}`,borderRadius:4,padding:"2.5rem",maxWidth:440,width:"100%",textAlign:"center"}}>
        <div style={{fontSize:"1.8rem",color:cfg.color,marginBottom:"1rem"}}>{cfg.icon}</div>
        <div style={{fontSize:"0.58rem",letterSpacing:"0.3em",color:cfg.color,marginBottom:"0.8rem"}}>SESSION · {sessionCode} · {t.part} {intake?.partLabel}</div>
        <h2 style={{fontSize:"1.5rem",fontWeight:300,color:"#e8f4f7",marginBottom:"0.8rem",lineHeight:1.3}}>{cfg.title}</h2>
        {cfg.body&&<p style={{color:"#5a7d89",fontSize:"0.9rem",lineHeight:1.8,marginBottom:"1.5rem"}}>{cfg.body}</p>}
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

// ── Consenso Final ────────────────────────────────────────────────────────────
function ConsensusView({intake, sessionCode}) {
  const lang=intake?.lang||"pt";
  const t=T[lang]||T["pt"];
  const langName={pt:"Brazilian Portuguese",en:"English",es:"Spanish",fr:"French",it:"Italian",ja:"Japanese",zh:"Mandarin Chinese"}[lang]||"Brazilian Portuguese";
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
            `You are Sergio, the impartial AI mediator ("The Impartial Judge - The AI for seeking peace"). Based on the complete mediation transcript below, issue a FORMAL MEDIATION CONSENSUS document.

${sections}

Parties: ${sd.partA?.name||"Party A"} and ${sd.partB?.name||"Party B"}. Relationship: ${sd.partA?.relation}. Topic: ${sd.topic}.

Required structure (write ENTIRELY in ${langName}):
1) CONFLICT SYNTHESIS
2) ${sd.partA?.name||"PARTY A"}'S PERSPECTIVE (without revealing confidential details from the other party's private session)
3) ${sd.partB?.name||"PARTY B"}'S PERSPECTIVE (same)
4) CONVERGENCE POINTS
5) RECOMMENDATIONS (3-4 concrete, equitable points)
6) NEXT STEPS FOR EACH PARTY
7) Formal signature — Sergio, The Impartial Judge

Write ENTIRELY in ${langName}. Formal, empathetic, solution-oriented tone.`
          }]})});
        const d=await r.json();
        setText(d.content?.map(b=>b.text||"").join("")||"Error generating consensus.");
      } catch { setText("Could not generate consensus. Please try again."); }
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

// ── App ───────────────────────────────────────────────────────────────────────
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
        setSessionCode(code);
        setSessionData(data);
        setLang(data?.lang||"pt");

        // ── CORRIGIDO: roteamento correto para Parte B ──────────────────────
        // Parte B é quem chega pelo link quando partA já existe mas partB ainda não
        const isPartB = data?.partA && !data?.partB;

        if (isPartB) {
          // Parte B sempre vai para o intake, independente do phase
          setScreen("intake");
          return;
        }

        // Parte A voltando pelo link (ou outros casos)
        const ph = data?.phase;
        if (ph === "pondering_a" || ph === "pondering_b" || ph === "ready_consensus" || ph === "waiting_b") {
          setScreen("waiting");
          return;
        }

        setScreen("intake");
      });
    } else {
      setScreen("code");
    }
  },[]);

  const handleCode=async(code,existing,selectedLang)=>{
    setSessionCode(code); setSessionData(existing); setLang(selectedLang||"pt");
    if(existing){
      const ph=existing.phase;
      // Parte B chegando pela tela de código (não pelo link)
      const isPartB = existing.partA && !existing.partB;
      if(isPartB){
        setScreen("intake"); return;
      }
      if(ph==="pondering_a"||ph==="pondering_b"||ph==="ready_consensus"||ph==="waiting_b"){
        setScreen("waiting"); return;
      }
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
    if(mode==="consensus"){ setScreen("consensus"); }
    else { setScreen("chat"); }
  };

  if(screen==="loading") return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"#0a0f12",fontFamily:"'Cormorant Garamond',Georgia,serif",color:"#5a7d89",fontSize:"0.8rem",letterSpacing:"0.2em"}}>
      <style>{css}</style>
      <span style={{animation:"pulse 1.5s infinite"}}>{T[lang]?.loading||"LOADING..."}</span>
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

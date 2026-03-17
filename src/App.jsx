import { useState, useRef, useEffect } from "react";

const C = {
  bg:"#0a0f12", surface:"#0d1519", card:"#111c22", border:"#1a2e38",
  teal:"#1e6b78", tealB:"#26909f", tealG:"#2bb5c8", accent:"#3dd6e8",
  text:"#c8dde2", muted:"#5a7d89", dim:"#3a5a64",
  white:"#e8f4f7", red:"#e84040", gold:"#c9a84c", green:"#2e9e6b",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&display=swap');
  *{box-sizing:border-box;} body{margin:0;background:#0a0f12;}
  ::placeholder{color:#3a5a64;opacity:1;}
  input,textarea{font-family:'Cormorant Garamond',Georgia,serif!important;}
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

const store = {
  async get(key) {
    try { const r = await window.storage.get(key, true); return r ? JSON.parse(r.value) : null; }
    catch { return null; }
  },
  async set(key, val) {
    try { await window.storage.set(key, JSON.stringify(val), true); } catch {}
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

// ── Logo SVG ─────────────────────────────────────────────────────────────────
function Logo({size=64}) {
  const s=size;
  return (
    <svg width={s} height={s} viewBox="0 0 64 64">
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

  const go=async()=>{
    const c=code.trim().toUpperCase();
    if(c.length<3){setErr("Mínimo 3 caracteres.");setShake(true);setTimeout(()=>setShake(false),500);return;}
    setLoading(true);
    const session=await store.get(`session:${c}`);
    setLoading(false);
    onEnter(c, session);
  };

  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:"2rem",background:"radial-gradient(ellipse at 50% 30%,#0e2028 0%,#0a0f12 70%)",fontFamily:"'Cormorant Garamond',Georgia,serif"}}>
      <style>{css}</style>
      <Logo size={64}/>
      <div style={{marginTop:"1.5rem",fontSize:"0.62rem",letterSpacing:"0.35em",color:"#5a7d89"}}>MEDIAÇÃO POR INTELIGÊNCIA ARTIFICIAL</div>
      <h1 style={{fontSize:"clamp(2.5rem,6vw,4rem)",fontWeight:300,letterSpacing:"0.1em",color:"#e8f4f7",margin:"0.4rem 0 0"}}>SERGIO</h1>
      <div style={{height:1,width:50,background:"linear-gradient(90deg,transparent,#3dd6e8,transparent)",margin:"1rem auto 1.8rem"}}/>
      <p style={{color:"#5a7d89",fontSize:"0.9rem",textAlign:"center",maxWidth:340,lineHeight:1.8,marginBottom:"2rem"}}>
        Insira o código privado da sessão ou crie um novo para iniciar uma mediação.
      </p>
      <div style={{background:"#111c22",border:"1px solid #1a2e38",borderRadius:4,padding:"2rem 2.5rem",width:"100%",maxWidth:380,animation:shake?"shake 0.4s ease":"none"}}>
        <label style={{fontSize:"0.62rem",letterSpacing:"0.2em",color:"#5a7d89",textTransform:"uppercase",display:"block",marginBottom:"0.5rem"}}>Código da Sessão</label>
        <input value={code} onChange={e=>{setCode(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&go()}
          placeholder="ex: CASO-2024" style={{...inp,fontSize:"1.1rem",letterSpacing:"0.12em"}}
          onFocus={e=>e.target.style.borderColor="#26909f"} onBlur={e=>e.target.style.borderColor="#1a2e38"}/>
        {err&&<div style={{color:"#e84040",fontSize:"0.75rem",marginTop:"0.4rem"}}>{err}</div>}
        <button onClick={go} disabled={loading} style={{marginTop:"1.2rem",width:"100%",background:"linear-gradient(135deg,#1e6b78,#26909f)",border:"none",borderRadius:2,padding:"0.85rem",color:"#e8f4f7",fontSize:"0.78rem",letterSpacing:"0.2em",textTransform:"uppercase",cursor:"pointer",fontFamily:"inherit",opacity:loading?0.6:1}}>
          {loading?"Verificando...":"Acessar Sessão →"}
        </button>
        <div style={{textAlign:"center",marginTop:"1rem",fontSize:"0.72rem",color:"#3a5a64",lineHeight:1.6}}>
          Primeira vez? Crie qualquer código e compartilhe com a outra parte.
        </div>
      </div>
    </div>
  );
}

// ── Formulário de intake ──────────────────────────────────────────────────────
function IntakeForm({sessionCode, existingSession, onSubmit}) {
  const nameRef=useRef(), emailRef=useRef(), relationRef=useRef();
  const otherRef=useRef(), topicRef=useRef(), contextRef=useRef();
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
      mr.onstop=()=>{const blob=new Blob(chunksRef.current,{type:"audio/webm"});setAudioBlob(blob);setAudioURL(URL.createObjectURL(blob));stream.getTracks().forEach(t=>t.stop());};
      mr.start(); setRecording(true); setRecTime(0);
      timerRef.current=setInterval(()=>setRecTime(t=>t+1),1000);
    } catch { setRecErr("Permissão de microfone negada."); }
  };
  const stopRec=()=>{mediaRef.current?.stop();setRecording(false);clearInterval(timerRef.current);};

  const fo=e=>e.target.style.borderColor="#26909f";
  const bl=e=>e.target.style.borderColor="#1a2e38";

  const handleSubmit=()=>{
    const v={
      name:nameRef.current?.value?.trim(),
      email:emailRef.current?.value?.trim(),
      relation:relationRef.current?.value?.trim(),
      otherName:isPartB ? existingSession.partA.name : otherRef.current?.value?.trim(),
      topic:isPartB ? existingSession.topic : topicRef.current?.value?.trim(),
      context:contextRef.current?.value?.trim(),
    };
    if(!v.name||!v.email||!v.relation||!v.otherName||!v.topic||(!v.context&&!audioBlob)){
      alert("Preencha todos os campos obrigatórios.");return;
    }
    onSubmit({...v,audioBlob,sessionCode,partLabel});
  };

  const lbl={fontSize:"0.62rem",letterSpacing:"0.2em",color:"#5a7d89",textTransform:"uppercase",display:"block",marginBottom:"0.5rem"};
  const fw={marginBottom:"1.4rem"};

  return (
    <div style={{minHeight:"100vh",background:"radial-gradient(ellipse at 30% 0%,#0e2028 0%,#0a0f12 60%)",padding:"2rem 1rem",fontFamily:"'Cormorant Garamond',Georgia,serif"}}>
      <style>{css}</style>
      <div style={{maxWidth:560,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"center",gap:"1rem",marginBottom:"2.5rem",paddingBottom:"1.5rem",borderBottom:"1px solid #1a2e38"}}>
          <Logo size={36}/>
          <div>
            <div style={{fontSize:"1.2rem",color:"#e8f4f7",letterSpacing:"0.05em"}}>SERGIO</div>
            <div style={{fontSize:"0.62rem",letterSpacing:"0.2em",color:"#5a7d89"}}>SESSÃO · {sessionCode} · PARTE {partLabel}</div>
          </div>
        </div>

        {isPartB&&(
          <div style={{background:"#1e6b7811",border:"1px solid #1e6b7844",borderRadius:4,padding:"1rem 1.2rem",marginBottom:"1.8rem",fontSize:"0.9rem",color:"#5a7d89",lineHeight:1.7}}>
            Você foi convidado(a) por <strong style={{color:"#c8dde2"}}>{existingSession.partA.name}</strong> para uma mediação sobre <em style={{color:"#c8dde2"}}>"{existingSession.topic}"</em>. Suas respostas são confidenciais.
          </div>
        )}

        <h2 style={{fontSize:"1.8rem",fontWeight:300,color:"#e8f4f7",marginBottom:"0.4rem"}}>Sua perspectiva</h2>
        <p style={{color:"#5a7d89",fontSize:"0.9rem",marginBottom:"2rem",lineHeight:1.7}}>Informações confidenciais. O Sergio usa apenas para mediar com imparcialidade.</p>

        <div style={fw}><label style={lbl}>Seu nome</label><input ref={nameRef} defaultValue="" placeholder="Como você se chama?" style={inp} onFocus={fo} onBlur={bl}/></div>
        <div style={fw}><label style={lbl}>Seu e-mail (para notificações)</label><input ref={emailRef} defaultValue="" type="email" placeholder="seu@email.com" style={inp} onFocus={fo} onBlur={bl}/></div>
        <div style={fw}><label style={lbl}>Sua relação com a outra parte</label><input ref={relationRef} defaultValue="" placeholder="ex: cônjuge, sócio, colega..." style={inp} onFocus={fo} onBlur={bl}/></div>
        {!isPartB&&<div style={fw}><label style={lbl}>Nome da outra parte</label><input ref={otherRef} defaultValue="" placeholder="Como se chama a outra pessoa?" style={inp} onFocus={fo} onBlur={bl}/></div>}
        {!isPartB&&<div style={fw}><label style={lbl}>Tema central do conflito</label><input ref={topicRef} defaultValue="" placeholder="Descreva brevemente o assunto..." style={inp} onFocus={fo} onBlur={bl}/></div>}

        <div style={fw}>
          <label style={lbl}>Contexto detalhado</label>
          <textarea ref={contextRef} defaultValue="" placeholder="O que aconteceu, como você se sente, o que espera da mediação..." rows={5} style={{...inp,resize:"vertical",lineHeight:1.6}} onFocus={fo} onBlur={bl}/>
          <div style={{marginTop:"0.8rem",display:"flex",alignItems:"center",gap:"0.8rem",flexWrap:"wrap"}}>
            <span style={{fontSize:"0.68rem",color:"#3a5a64"}}>ou grave um áudio</span>
            {!recording&&!audioURL&&<button onClick={startRec} style={{background:"transparent",border:"1px solid #1e6b78",borderRadius:2,padding:"0.4rem 1rem",color:"#2bb5c8",fontSize:"0.72rem",letterSpacing:"0.15em",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:"0.4rem"}}><span style={{width:7,height:7,borderRadius:"50%",background:"#e84040",display:"inline-block"}}/>GRAVAR</button>}
            {recording&&<button onClick={stopRec} style={{background:"#e8404022",border:"1px solid #e84040",borderRadius:2,padding:"0.4rem 1rem",color:"#e84040",fontSize:"0.72rem",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:"0.5rem"}}><span style={{width:7,height:7,borderRadius:"50%",background:"#e84040",display:"inline-block",animation:"pulse 1s infinite"}}/>{fmt(recTime)} · PARAR</button>}
            {audioURL&&!recording&&<div style={{display:"flex",alignItems:"center",gap:"0.6rem"}}><audio src={audioURL} controls style={{height:28}}/><button onClick={()=>{setAudioURL(null);setAudioBlob(null);}} style={{background:"transparent",border:"none",color:"#3a5a64",cursor:"pointer",fontFamily:"inherit"}}>✕</button></div>}
            {recErr&&<div style={{color:"#e84040",fontSize:"0.75rem",width:"100%"}}>{recErr}</div>}
          </div>
        </div>

        <button onClick={handleSubmit} style={{width:"100%",background:"linear-gradient(135deg,#1e6b78,#26909f)",border:"none",borderRadius:2,padding:"1rem",color:"#e8f4f7",fontSize:"0.78rem",letterSpacing:"0.2em",textTransform:"uppercase",cursor:"pointer",fontFamily:"inherit"}}>
          Enviar ao Sergio →
        </button>
      </div>
    </div>
  );
}

// ── Chat com Sergio ───────────────────────────────────────────────────────────
function SergioChat({intake, sessionData, onDone, onWait}) {
  const [messages,setMessages]=useState([]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const [phase,setPhase]=useState("chat");
  const [linkCopied,setLinkCopied]=useState(false);
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

  const buildSystem=()=>{
    const otherName=isPartA?intake.otherName:(sessionData?.partA?.name||intake.otherName);
    if(isPondering) return `Você é Sergio, mediador experiente e imparcial.
Você já ouviu as duas partes em sessões privadas:
— ${sessionData.partA.name}: "${sessionData.partA.context}"
— ${sessionData.partB.name}: "${sessionData.partB.context}"
Agora é a PONDERAÇÃO PÓS-OITIVA com ${sessionData.partA.name}. Explore possibilidades de consenso SEM revelar o que ${sessionData.partB.name} disse (sigilo absoluto).
Após 2-4 trocas, decida e anuncie explicitamente: se houver convergência, diga "Tenho o que preciso para elaborar o consenso." Se precisar ouvir ${sessionData.partB.name} novamente, diga "Preciso conversar com ${sessionData.partB.name} mais uma vez antes de finalizar."
Português brasileiro, empático, 2-3 parágrafos.`;

    if(isPonderingB) return `Você é Sergio, mediador experiente e imparcial.
SEGUNDA RODADA com ${sessionData.partB.name}. Você já ouviu ${sessionData.partA.name} na ponderação. Explore convergências com ${sessionData.partB.name} SEM revelar detalhes confidenciais da outra parte.
Após 2-4 trocas, diga: "Tenho o que preciso para elaborar o consenso final."
Português brasileiro, empático, 2-3 parágrafos.`;

    return `Você é Sergio, mediador experiente, sereno e imparcial.
Contexto CONFIDENCIAL: ${intake.name} (${intake.relation}) em conflito com ${otherName} sobre "${intake.topic||sessionData?.topic}". Contexto: ${intake.context||"(áudio gravado)"}
${isPartA
  ? `PRIMEIRA OITIVA — Parte A. Converse em privado com ${intake.name}. Faça 3-5 perguntas precisas. Quando compreender bem, diga: "Obrigado, ${intake.name}. Compreendo sua perspectiva com profundidade. Vou agora ouvir ${otherName} em particular e, após isso, retornarei a você para uma conversa de ponderação."`
  : `PRIMEIRA OITIVA — Parte B. Converse em privado com ${intake.name}. Faça 3-5 perguntas. Quando compreender bem, diga: "Obrigado, ${intake.name}. Já ouvi as duas partes e retornarei a ${sessionData?.partA?.name} para a etapa de ponderação."`
}
Português brasileiro. 2-3 parágrafos. Sigilo absoluto sobre a outra parte.`;
  };

  const callSergio=async(userMsg, histOverride)=>{
    const isInit=["__init__","__ponder__","__ponder_b__"].includes(userMsg);
    const currentMsgs=histOverride!==undefined?histOverride:messagesRef.current;

    if(!isInit) setMsgs(m=>[...m,{role:"user",text:userMsg}]);
    setLoading(true);

    const sys=buildSystem();
    const hist=isInit?[]:currentMsgs.map(m=>({role:m.role==="user"?"user":"assistant",content:m.text}));
    let prompt;
    if(userMsg==="__init__") prompt=`Cumprimente ${intake.name} e faça a primeira pergunta sobre "${intake.topic||sessionData?.topic}".`;
    else if(userMsg==="__ponder__") prompt=`Retorne para conversar com ${sessionData.partA.name} na ponderação. Reintroduza-se brevemente e explore possibilidades de consenso sem revelar o que ${sessionData.partB.name} disse.`;
    else if(userMsg==="__ponder_b__") prompt=`Retorne para conversar com ${sessionData.partB.name} na segunda rodada. Explore convergências.`;
    else prompt=userMsg;

    try {
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:sys,messages:[...hist,{role:"user",content:prompt}]})});
      const d=await r.json();
      const reply=d.content?.map(b=>b.text||"").join("")||"Erro na conexão.";

      setMsgs(m=>[...(isInit?[]:m),{role:"sergio",text:reply}]);

      // Detectar transições de fase
      if(isPartA&&!isPondering&&reply.includes("retornarei a você")){
        setPhase("show_link");
        const updatedMsgs=[...currentMsgs,{role:"sergio",text:reply}];
        const existing=await store.get(`session:${intake.sessionCode}`)||{};
        await store.set(`session:${intake.sessionCode}`,{
          ...existing,
          partA:{name:intake.name,email:intake.email,relation:intake.relation,context:intake.context||"(áudio)"},
          topic:intake.topic,
          chatA:updatedMsgs,
          phase:"waiting_b",
        });
      }
      if(!isPartA&&!isPonderingB&&reply.includes("retornarei a")){
        setPhase("b_done");
        const existing=await store.get(`session:${intake.sessionCode}`)||{};
        await store.set(`session:${intake.sessionCode}`,{
          ...existing,
          partB:{name:intake.name,email:intake.email,relation:intake.relation,context:intake.context||"(áudio)"},
          chatB:[...currentMsgs,{role:"sergio",text:reply}],
          phase:"pondering_a",
        });
      }
      if(isPondering&&reply.includes("Tenho o que preciso")){
        setPhase("consensus_ready");
        const existing=await store.get(`session:${intake.sessionCode}`)||{};
        await store.set(`session:${intake.sessionCode}`,{...existing,chatPonderA:[...currentMsgs,{role:"sergio",text:reply}],phase:"ready_consensus"});
      }
      if(isPondering&&reply.includes("Preciso conversar com")){
        setPhase("need_b_again");
        const existing=await store.get(`session:${intake.sessionCode}`)||{};
        await store.set(`session:${intake.sessionCode}`,{...existing,chatPonderA:[...currentMsgs,{role:"sergio",text:reply}],phase:"pondering_b"});
      }
      if(isPonderingB&&reply.includes("Tenho o que preciso")){
        setPhase("consensus_ready");
        const existing=await store.get(`session:${intake.sessionCode}`)||{};
        await store.set(`session:${intake.sessionCode}`,{...existing,chatPonderB:[...currentMsgs,{role:"sergio",text:reply}],phase:"ready_consensus"});
      }
    } catch { setMsgs(m=>[...m,{role:"sergio",text:"Erro de conexão. Tente novamente."}]); }
    setLoading(false);
  };

  const send=()=>{
    if(!input.trim()||loading)return;
    const m=input.trim(); setInput(""); callSergio(m,undefined);
  };

  const sessionUrl=`${window.location.origin}${window.location.pathname}?session=${intake.sessionCode}`;
  const copyLink=()=>{ navigator.clipboard.writeText(sessionUrl); setLinkCopied(true); setTimeout(()=>setLinkCopied(false),2500); };

  const chatPhase=phase==="chat";

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
            {isPondering?"PONDERAÇÃO PÓS-OITIVA":isPonderingB?"SEGUNDA RODADA":`SESSÃO PRIVADA · PARTE ${intake.partLabel}`}
          </div>
        </div>
        <div style={{marginLeft:"auto",fontSize:"0.6rem",color:"#3a5a64",letterSpacing:"0.1em"}}>{intake.sessionCode}</div>
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

        {/* Parte A: link para B */}
        {phase==="show_link"&&(
          <div style={{background:"#111c22",border:"1px solid #1e6b7844",borderTop:"2px solid #1e6b78",borderRadius:4,padding:"1.5rem",animation:"fadeUp 0.4s ease"}}>
            <div style={{fontSize:"0.62rem",letterSpacing:"0.25em",color:"#2bb5c8",marginBottom:"0.8rem"}}>PRÓXIMO PASSO — CONVIDAR A OUTRA PARTE</div>
            <p style={{color:"#c8dde2",fontSize:"0.9rem",lineHeight:1.8,marginBottom:"1rem"}}>
              Envie o link abaixo para <strong>{intake.otherName}</strong> acessar a sessão e dar a perspectiva dele(a):
            </p>
            <div style={{background:"#0a1417",border:"1px solid #1a2e38",borderRadius:2,padding:"0.75rem 1rem",fontSize:"0.8rem",color:"#5a7d89",wordBreak:"break-all",marginBottom:"0.8rem",fontFamily:"monospace",lineHeight:1.6}}>
              {sessionUrl}
            </div>
            <button onClick={copyLink} style={{background:linkCopied?"#2e9e6b22":"transparent",border:`1px solid ${linkCopied?"#2e9e6b":"#1e6b78"}`,borderRadius:2,padding:"0.6rem 1.4rem",color:linkCopied?"#2e9e6b":"#2bb5c8",fontSize:"0.72rem",letterSpacing:"0.15em",cursor:"pointer",fontFamily:"inherit",transition:"all 0.2s"}}>
              {linkCopied?"✓ Copiado!":"⎘ Copiar link"}
            </button>
            <p style={{color:"#3a5a64",fontSize:"0.75rem",marginTop:"1rem",lineHeight:1.7}}>
              Quando {intake.otherName} concluir, você receberá uma notificação em <strong style={{color:"#5a7d89"}}>{intake.email}</strong> para retornar à ponderação. Você também pode voltar aqui com o mesmo código a qualquer momento para verificar o status.
            </p>
            <button onClick={onWait} style={{marginTop:"0.8rem",background:"transparent",border:"1px solid #1a2e38",borderRadius:2,padding:"0.6rem 1.4rem",color:"#5a7d89",fontSize:"0.72rem",letterSpacing:"0.15em",cursor:"pointer",fontFamily:"inherit"}}>
              Ir para sala de espera →
            </button>
          </div>
        )}

        {/* Parte B: oitiva concluída */}
        {phase==="b_done"&&(
          <div style={{background:"#111c22",border:"1px solid #1e6b7844",borderTop:"2px solid #1e6b78",borderRadius:4,padding:"1.5rem",animation:"fadeUp 0.4s ease"}}>
            <div style={{fontSize:"0.62rem",letterSpacing:"0.25em",color:"#2bb5c8",marginBottom:"0.8rem"}}>OITIVA CONCLUÍDA</div>
            <p style={{color:"#c8dde2",fontSize:"0.9rem",lineHeight:1.8,marginBottom:"0.5rem"}}>
              O Sergio retornará agora a <strong>{sessionData?.partA?.name||intake.otherName}</strong> para a ponderação pós-oitiva.
            </p>
            <p style={{color:"#3a5a64",fontSize:"0.75rem",lineHeight:1.7}}>
              Caso necessário, você receberá uma notificação em <strong style={{color:"#5a7d89"}}>{intake.email}</strong> para uma segunda rodada. Fique atento(a).
            </p>
          </div>
        )}

        {/* Ponderação: precisa de B novamente */}
        {phase==="need_b_again"&&(
          <div style={{background:"#111c22",border:"1px solid #c9a84c44",borderTop:"2px solid #c9a84c",borderRadius:4,padding:"1.5rem",animation:"fadeUp 0.4s ease"}}>
            <div style={{fontSize:"0.62rem",letterSpacing:"0.25em",color:"#c9a84c",marginBottom:"0.8rem"}}>SEGUNDA RODADA ACIONADA</div>
            <p style={{color:"#c8dde2",fontSize:"0.9rem",lineHeight:1.8,marginBottom:"0.5rem"}}>
              O Sergio entende que precisa ouvir <strong>{sessionData?.partB?.name}</strong> mais uma vez antes de emitir o consenso.
            </p>
            <p style={{color:"#3a5a64",fontSize:"0.75rem",lineHeight:1.7}}>
              Uma notificação será enviada para <strong style={{color:"#5a7d89"}}>{sessionData?.partB?.email}</strong>. Você será notificado(a) em <strong style={{color:"#5a7d89"}}>{intake.email}</strong> quando o processo estiver concluído.
            </p>
          </div>
        )}

        {/* Consenso liberado */}
        {phase==="consensus_ready"&&(
          <div style={{background:"#111c22",border:"1px solid #c9a84c44",borderTop:"2px solid #c9a84c",borderRadius:4,padding:"1.5rem",animation:"fadeUp 0.4s ease"}}>
            <div style={{fontSize:"0.62rem",letterSpacing:"0.25em",color:"#c9a84c",marginBottom:"0.8rem"}}>◆ MEDIAÇÃO COMPLETA</div>
            <p style={{color:"#c8dde2",fontSize:"0.9rem",lineHeight:1.8,marginBottom:"1.2rem"}}>
              O Sergio ouviu e ponderou com ambas as partes. O consenso formal pode ser gerado agora.
            </p>
            <button onClick={()=>onDone(messagesRef.current)} style={{background:"linear-gradient(135deg,#c9a84c33,#c9a84c11)",border:"1px solid #c9a84c",borderRadius:2,padding:"0.85rem 2rem",color:"#c9a84c",fontSize:"0.78rem",letterSpacing:"0.2em",cursor:"pointer",fontFamily:"inherit"}}>
              GERAR CONSENSO FINAL →
            </button>
          </div>
        )}

        <div ref={bottomRef}/>
      </div>

      {/* Input */}
      {chatPhase&&(
        <div style={{padding:"0.9rem 1.4rem",borderTop:"1px solid #1a2e38",background:"#0d1519",display:"flex",gap:"0.7rem",flexShrink:0}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()}
            placeholder="Escreva sua resposta ao Sergio..."
            style={{...inp,flex:1}} onFocus={e=>e.target.style.borderColor="#26909f"} onBlur={e=>e.target.style.borderColor="#1a2e38"}/>
          <button onClick={send} disabled={!input.trim()||loading}
            style={{background:input.trim()&&!loading?"linear-gradient(135deg,#1e6b78,#26909f)":"#111c22",border:"none",borderRadius:2,padding:"0 1.1rem",color:input.trim()&&!loading?"#e8f4f7":"#3a5a64",cursor:input.trim()&&!loading?"pointer":"not-allowed",fontSize:"1.1rem",transition:"all 0.2s"}}>→</button>
        </div>
      )}
    </div>
  );
}

// ── Sala de Espera ────────────────────────────────────────────────────────────
function WaitingRoom({sessionCode, intake, onReady}) {
  const [sessionPhase,setSessionPhase]=useState(null);
  const [polls,setPolls]=useState(0);

  useEffect(()=>{
    const check=async()=>{
      const s=await store.get(`session:${sessionCode}`);
      if(s?.phase) setSessionPhase(s.phase);
      setPolls(c=>c+1);
    };
    check();
    const t=setInterval(check,5000);
    return ()=>clearInterval(t);
  },[]);

  const isPartA=intake?.partLabel==="A";
  const isPartB=intake?.partLabel==="B";

  let status="waiting";
  if(isPartA&&sessionPhase==="pondering_a") status="ponder_a";
  if(isPartB&&sessionPhase==="pondering_b") status="ponder_b";
  if(sessionPhase==="ready_consensus") status="consensus";

  const configs={
    waiting:{color:"#2bb5c8",icon:"○",title:"Aguardando a outra parte",body:`O Sergio está ouvindo a perspectiva da outra parte. Você receberá uma notificação em ${intake?.email} quando for sua vez de retornar.`,btn:null},
    ponder_a:{color:"#c9a84c",icon:"◈",title:"O Sergio quer conversar com você",body:"O Sergio já ouviu as duas partes e está pronto para a etapa de ponderação com você.",btn:{label:"INICIAR PONDERAÇÃO →",fn:()=>onReady("ponder_a")}},
    ponder_b:{color:"#c9a84c",icon:"◈",title:"O Sergio precisa ouvir você novamente",body:"Após a ponderação com a outra parte, o Sergio entende que precisa conversar com você mais uma vez.",btn:{label:"CONTINUAR →",fn:()=>onReady("ponder_b")}},
    consensus:{color:"#c9a84c",icon:"◆",title:"Mediação concluída",body:"O Sergio ouviu todas as partes e está pronto para emitir o consenso formal.",btn:{label:"VER CONSENSO →",fn:()=>onReady("consensus")}},
  };

  const cfg=configs[status];

  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:"2rem",background:"radial-gradient(ellipse at 50% 30%,#0e2028 0%,#0a0f12 70%)",fontFamily:"'Cormorant Garamond',Georgia,serif"}}>
      <style>{css}</style>
      <div style={{background:"#111c22",border:`1px solid ${cfg.color}33`,borderTop:`2px solid ${cfg.color}`,borderRadius:4,padding:"2.5rem",maxWidth:440,width:"100%",textAlign:"center"}}>
        <div style={{fontSize:"1.8rem",color:cfg.color,marginBottom:"1rem",letterSpacing:"0.1em"}}>{cfg.icon}</div>
        <div style={{fontSize:"0.58rem",letterSpacing:"0.3em",color:cfg.color,marginBottom:"0.8rem"}}>SESSÃO · {sessionCode} · PARTE {intake?.partLabel}</div>
        <h2 style={{fontSize:"1.5rem",fontWeight:300,color:"#e8f4f7",marginBottom:"0.8rem",lineHeight:1.3}}>{cfg.title}</h2>
        <p style={{color:"#5a7d89",fontSize:"0.9rem",lineHeight:1.8,marginBottom:"1.5rem"}}>{cfg.body}</p>
        {status==="waiting"&&(
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem",color:"#3a5a64",fontSize:"0.72rem",marginBottom:"1rem"}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:"#2bb5c8",display:"inline-block",animation:"pulse 1.5s infinite"}}/>
            Verificando status... ({polls}×)
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
  const [text,setText]=useState(""),[loading,setLoading]=useState(true);
  const {out,done}=useTyping(text);

  useEffect(()=>{
    (async()=>{
      const sd=await store.get(`session:${sessionCode}`)||{};
      const sections=[
        sd.chatA&&`=== PRIMEIRA OITIVA — ${sd.partA?.name} ===\n${sd.chatA.map(m=>`[${m.role==="user"?sd.partA?.name:"Sergio"}]: ${m.text}`).join("\n\n")}`,
        sd.chatB&&`=== PRIMEIRA OITIVA — ${sd.partB?.name} ===\n${sd.chatB.map(m=>`[${m.role==="user"?sd.partB?.name:"Sergio"}]: ${m.text}`).join("\n\n")}`,
        sd.chatPonderA&&`=== PONDERAÇÃO PÓS-OITIVA — ${sd.partA?.name} ===\n${sd.chatPonderA.map(m=>`[${m.role==="user"?sd.partA?.name:"Sergio"}]: ${m.text}`).join("\n\n")}`,
        sd.chatPonderB&&`=== SEGUNDA RODADA — ${sd.partB?.name} ===\n${sd.chatPonderB.map(m=>`[${m.role==="user"?sd.partB?.name:"Sergio"}]: ${m.text}`).join("\n\n")}`,
      ].filter(Boolean).join("\n\n---\n\n");

      try {
        const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
          body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1500,messages:[{role:"user",content:
            `Você é Sergio, mediador. Com base em todo o processo de mediação transcrito abaixo, emita um CONSENSO FORMAL DE MEDIAÇÃO.\n\n${sections}\n\nPartes: ${sd.partA?.name||"Parte A"} e ${sd.partB?.name||"Parte B"}. Relação: ${sd.partA?.relation}. Tema: ${sd.topic}.\n\nEstrutura obrigatória:\n1) SÍNTESE DO CONFLITO\n2) PERSPECTIVA DE ${sd.partA?.name||"PARTE A"}\n3) PERSPECTIVA DE ${sd.partB?.name||"PARTE B"}\n4) PONTOS DE CONVERGÊNCIA\n5) RECOMENDAÇÕES (3-4 pontos concretos)\n6) PRÓXIMOS PASSOS PARA CADA PARTE\n7) Assinatura formal — Sergio, Mediador\n\nPortuguês formal, empático, resolutivo. Mantenha sigilo: não cite detalhes confidenciais que uma parte revelou que a outra não saiba.`
          }]})});
        const d=await r.json();
        setText(d.content?.map(b=>b.text||"").join("")||"Erro ao gerar.");
      } catch { setText("Não foi possível gerar o consenso. Tente novamente."); }
      setLoading(false);
    })();
  },[]);

  return (
    <div style={{minHeight:"100vh",background:"radial-gradient(ellipse at 50% 0%,#0e2028 0%,#0a0f12 60%)",padding:"2rem 1rem",fontFamily:"'Cormorant Garamond',Georgia,serif"}}>
      <style>{css}</style>
      <div style={{maxWidth:640,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:"2.5rem"}}>
          <Logo size={40}/>
          <div style={{fontSize:"0.6rem",letterSpacing:"0.3em",color:"#c9a84c",margin:"1.2rem 0 0.5rem"}}>◆ DOCUMENTO OFICIAL ◆</div>
          <h1 style={{fontSize:"clamp(1.8rem,4vw,2.6rem)",fontWeight:300,color:"#e8f4f7",margin:"0 0 0.3rem"}}>Consenso de Mediação</h1>
          <div style={{fontSize:"0.82rem",color:"#5a7d89"}}>{sessionCode} · {new Date().toLocaleDateString("pt-BR",{year:"numeric",month:"long",day:"numeric"})}</div>
          <div style={{height:1,background:"linear-gradient(90deg,transparent,#c9a84c88,transparent)",marginTop:"1.4rem"}}/>
        </div>

        <div style={{background:"#111c22",border:"1px solid #1a2e38",borderTop:"2px solid #c9a84c44",borderRadius:4,padding:"2rem",minHeight:240}}>
          {loading
            ?<div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"3rem",gap:"1rem"}}>
              <div style={{display:"flex",gap:6}}>{[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:"#1e6b78",animation:`pulse 1.2s ${i*0.2}s infinite`}}/>)}</div>
              <div style={{fontSize:"0.78rem",color:"#5a7d89",letterSpacing:"0.1em"}}>Sergio está redigindo o consenso...</div>
            </div>
            :<div style={{fontSize:"0.93rem",lineHeight:1.95,color:"#c8dde2",whiteSpace:"pre-wrap"}}>{out}{!done&&<span style={{animation:"blink 1s infinite",color:"#3dd6e8"}}>▎</span>}</div>
          }
        </div>

        {done&&(
          <div style={{marginTop:"1.5rem",display:"flex",gap:"0.9rem",flexWrap:"wrap",animation:"fadeUp 0.4s ease"}}>
            <button onClick={()=>window.print()} style={{flex:1,background:"transparent",border:"1px solid #1e6b78",borderRadius:2,padding:"0.8rem",color:"#2bb5c8",fontSize:"0.72rem",letterSpacing:"0.2em",cursor:"pointer",fontFamily:"inherit"}}>↓ IMPRIMIR / PDF</button>
            <button onClick={()=>navigator.clipboard.writeText(text)} style={{flex:1,background:"transparent",border:"1px solid #1a2e38",borderRadius:2,padding:"0.8rem",color:"#5a7d89",fontSize:"0.72rem",letterSpacing:"0.2em",cursor:"pointer",fontFamily:"inherit"}}>⎘ COPIAR TEXTO</button>
          </div>
        )}
        <div style={{textAlign:"center",marginTop:"1.8rem",fontSize:"0.68rem",color:"#3a5a64",lineHeight:1.9}}>
          Documento gerado por Sergio — mediador por inteligência artificial.<br/>Recomenda-se validação jurídica quando aplicável.
        </div>
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

  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    const s=params.get("session");
    if(s){
      const code=s.toUpperCase();
      store.get(`session:${code}`).then(data=>{
        setSessionCode(code); setSessionData(data); setScreen("intake");
      });
    } else { setScreen("code"); }
  },[]);

  const handleCode=async(code,existing)=>{
    setSessionCode(code); setSessionData(existing);
    if(existing){
      const ph=existing.phase;
      if(ph==="pondering_a"||ph==="pondering_b"||ph==="ready_consensus"){
        setScreen("waiting"); return;
      }
      if(ph==="waiting_b"&&existing.partA){ setScreen("waiting"); return; }
    }
    setScreen("intake");
  };

  const handleIntake=async(data)=>{
    setIntake(data);
    if(data.partLabel==="A"){
      await store.set(`session:${data.sessionCode}`,{
        partA:{name:data.name,email:data.email,relation:data.relation,context:data.context||"(áudio)"},
        topic:data.topic, phase:"intake_a",
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
      <span style={{animation:"pulse 1.5s infinite"}}>CARREGANDO...</span>
    </div>
  );

  return (
    <>
      {screen==="code"      && <CodeEntry onEnter={handleCode}/>}
      {screen==="intake"    && <IntakeForm sessionCode={sessionCode} existingSession={sessionData} onSubmit={handleIntake}/>}
      {screen==="chat"      && intake && <SergioChat intake={intake} sessionData={sessionData} onDone={()=>setScreen("consensus")} onWait={()=>setScreen("waiting")}/>}
      {screen==="waiting"   && <WaitingRoom sessionCode={sessionCode} intake={intake} onReady={handleWaiting}/>}
      {screen==="consensus" && <ConsensusView intake={intake} sessionCode={sessionCode}/>}
    </>
  );
}

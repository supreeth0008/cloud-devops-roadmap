import { useState, useEffect, useRef } from 'react';

export default function NoteEditor({ topicId, sessionId, note='', onSave }) {
  const [text, setText]   = useState(note);
  const [saved,  setSaved] = useState(false);
  const timer = useRef(null);

  useEffect(()=>{ setText(note); },[note]);

  const onChange = val => {
    setText(val); setSaved(false);
    clearTimeout(timer.current);
    timer.current = setTimeout(()=>{ onSave(topicId, val); setSaved(true); setTimeout(()=>setSaved(false),2000); }, 800);
  };

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
        <span className="label" style={{fontSize:8,color:'var(--ghost3)'}}>MARKDOWN · AUTO-SAVED</span>
        {saved&&<span className="label" style={{fontSize:8,color:'var(--acid)',animation:'fadeIn 0.3s ease'}}>✓ SAVED TO INDEXEDDB</span>}
      </div>
      <textarea
        value={text}
        onChange={e=>onChange(e.target.value)}
        rows={9}
        placeholder={'# My notes\n\n- Key insight\n\n```bash\nkubectl get pods\n```'}
        style={{width:'100%',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:2,padding:'14px 16px',color:'rgba(255,255,255,0.78)',fontSize:12,fontFamily:'var(--font-m)',lineHeight:1.85,resize:'vertical',outline:'none',boxSizing:'border-box',transition:'border-color 0.2s'}}
        onFocus={e=>e.target.style.borderColor='rgba(200,255,0,0.35)'}
        onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.09)'}
      />
    </div>
  );
}

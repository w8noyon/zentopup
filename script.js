// SM TOPUP — extracted application JavaScript
/* ═══════════════════ FIREBASE ═══════════════════ */
const firebaseConfig = {
  apiKey: "AIzaSyAA6lc6-CFTn56ApNnnATiMUheDpqCaSkQ",
  authDomain: "sm-topup-f5ae0.firebaseapp.com",
  databaseURL: "https://sm-topup-f5ae0-default-rtdb.firebaseio.com",
  projectId: "sm-topup-f5ae0",
  storageBucket: "sm-topup-f5ae0.firebasestorage.app",
  messagingSenderId: "27891330556",
  appId: "1:27891330556:web:844ca508cdc734caacd679"
};
const DEFAULT_METHOD_LOGO = {
  bkash: "https://i.ibb.co.com/9kCCTNsx/1656227518bkash-logo-png.png",
  nagad: "https://i.ibb.co.com/VcqJTvpn/Nagad-Logo-horizontally-og.png",
  rocket: "https://i.ibb.co.com/wFZkNM48/rocket-color-logo-mobile-banking-icon-free-png.png"
};
const METHODS = {
  bkash: { name: "bKash", ussd: "*247#", heroBg: "linear-gradient(135deg,#e2136e,#ff4b8b)", instBg: "linear-gradient(135deg,#d81b60,#e91e63)", verify: "linear-gradient(135deg,#4338ca,#7c3aed)" },
  nagad: { name: "Nagad", ussd: "*167#", heroBg: "linear-gradient(135deg,#ec1c24,#ff5a5a)", instBg: "linear-gradient(135deg,#c81010,#ec1c24)", verify: "linear-gradient(135deg,#4338ca,#7c3aed)" },
  rocket: { name: "Rocket", ussd: "*322#", heroBg: "linear-gradient(135deg,#6638e8,#8b6df0)", instBg: "linear-gradient(135deg,#5b2cc4,#7c3aed)", verify: "linear-gradient(135deg,#4338ca,#7c3aed)" }
};
const DEFAULT_RANKS = [
  { name: "Bronze", min: 0, max: 100, tagline: "Start your journey", color: "#b45309", icon: "fa-medal", png: "" },
  { name: "Silver", min: 101, max: 1000, tagline: "Keep grinding", color: "#64748b", icon: "fa-medal", png: "" },
  { name: "Gold", min: 1001, max: 5000, tagline: "Shine brighter", color: "#f59e0b", icon: "fa-crown", png: "" },
  { name: "Platinum", min: 5001, max: 10000, tagline: "Elite status", color: "#0891b2", icon: "fa-gem", png: "" },
  { name: "Diamond", min: 10001, max: 25000, tagline: "Premium glow", color: "#a855f7", icon: "fa-gem", png: "" },
  { name: "Heroic", min: 25001, max: 50000, tagline: "Legendary", color: "#ef4444", icon: "fa-dragon", png: "" },
  { name: "Master", min: 50001, max: 100000, tagline: "Top tier", color: "#8b5cf6", icon: "fa-crown", png: "" },
  { name: "Grand Master", min: 100001, max: 999999999, tagline: "Ultimate", color: "#eab308", icon: "fa-crown", png: "" }
];
const INPUT_TYPES = {
  uid: { label: "Player ID / UID", placeholder: "Enter your ID", icon: "fa-id-card", help: "সঠিক UID দিন।" },
  freefire: { label: "Free Fire UID", placeholder: "e.g. 2535040417", icon: "fa-fire", help: "Free Fire এর UID দিন।" },
  pubg: { label: "PUBG Player ID", placeholder: "e.g. 5123456789", icon: "fa-crosshairs", help: "PUBG Player ID দিন।" },
  custom: { label: "Your Information", placeholder: "Enter here", icon: "fa-keyboard", help: "" }
};
const BD_NAMES = ["Rakib Hasan","Tanvir Ahmed","Sabbir Rahman","Arif Hossain","Rafi Islam","Noyon Mia","Shimul Khan","Rifat Chowdhury","Sajid Ali","Nayem Sheikh","Farhan Kabir","Mehedi Hasan","Sumaiya Akter","Tanjila Rahman","Mim Akter","Israt Jahan","Nusrat Jahan","Sanjida Islam","Jui Akter","Rima Begum"];
const AVATAR_COLORS=['linear-gradient(135deg,#4338ca,#6366f1)','linear-gradient(135deg,#7c3aed,#a855f7)','linear-gradient(135deg,#059669,#10b981)','linear-gradient(135deg,#f59e0b,#fbbf24)','linear-gradient(135deg,#dc2626,#ef4444)','linear-gradient(135deg,#0891b2,#06b6d4)','linear-gradient(135deg,#be185d,#ec4899)','linear-gradient(135deg,#4f46e5,#7c3aed)'];

let db, auth;
try { if (!firebase.apps.length) firebase.initializeApp(firebaseConfig); db=firebase.firestore(); auth=firebase.auth(); } catch(e){ console.error("Firebase init error:", e); }

/* ═══════════════════ STATE ═══════════════════ */
let currentUser=null, userData={};
let userBalance=0, totalSpend=0, weeklySpend=0;
let selectedProduct=null, selectedGameId=null, selectedGameName="";
let selectedPayOption='wallet', selectedPayMethod='bkash';
let allCategories=[], allGames=[], gamesData={};
let paymentNumbers={}, paymentLogos={};
let supportItems=[], supportOpen=false;
let ranksList=[], currentRank=null, nextRank=null;
let listenersStarted=false;
let globalWalletLogo='', globalInstantLogo='';
let addmoneyAmount=0;
let amSelectedMethod='bkash';
let fakeOrderTimer=null, fakeOrdersList=[];
let liveActivityConfig={enabled:true,initial:20,interval:120};
let playerApiConfig={url:'',namePath:'player.name',levelPath:'',avatarPath:'',uidPath:'',likesPath:'',diamondsPath:'',valuationPath:'',method:'GET'};
let accountPricing={basePrice:100,levelPrice:2,likePrice:0.5,diamondPrice:0.8};
let currentPlayerName='';
let currentPlayerUid='';
let avcCurrentData=null;
let activeSearchId=0;
let activeAbortController=null;
let sliderIdx=0, sliderCount=0, sliderTimer=null;
let touchStartX=0, touchStartY=0, touchEndX=0, isSwiping=false;

const $=(id)=>document.getElementById(id);
const setText=(id,v)=>{const el=$(id); if(el) el.textContent=v;};
const toast=(icon,title)=>Swal.fire({toast:true,icon,title,position:'top',showConfirmButton:false,timer:1700});

function lockBodyScroll(){const y=window.scrollY; document.body.style.top=`-${y}px`; document.body.classList.add('modal-open');}
function unlockBodyScroll(){const y=document.body.style.top; document.body.classList.remove('modal-open'); document.body.style.top=''; if(y) window.scrollTo(0,parseInt(y||'0')*-1);}

/* ═══════════════════ SAFE HELPERS ═══════════════════ */
function getNestedValSafe(obj, path){
  if(!obj || !path) return undefined;
  if(typeof path!=='string') return undefined;
  const parts=path.split('.'); let cur=obj;
  for(let i=0;i<parts.length;i++){ if(cur==null || typeof cur!=='object') return undefined; cur=cur[parts[i]]; }
  return cur;
}
function numOrNull(v){ if(v===undefined || v===null || v==='') return null; const n=Number(v); return isFinite(n) ? n : null; }
function isInvalidName(name){ if(!name || typeof name!=='string') return true; const n=name.trim().toLowerCase(); if(!n) return true; const invalid=['unknown player','player not found','not found','unknown','n/a','null','undefined','-','--','error','no data','no player','invalid']; return invalid.includes(n); }

/* ═══════════════════ PLAYER API ═══════════════════ */
function buildPlayerApiUrl(config, uid){
  if(!config || !config.url || !String(config.url).trim()) return {ok:false, error:'API URL not configured'};
  const cleanUid=String(uid||'').replace(/\D/g,'');
  if(!cleanUid || cleanUid.length<5) return {ok:false, error:'Invalid UID'};
  const rawUrl=String(config.url).trim();
  try{
    if(rawUrl.indexOf('{uid}')!==-1){ const finalUrl=rawUrl.split('{uid}').join(encodeURIComponent(cleanUid)); new URL(finalUrl); return {ok:true, url:finalUrl, method:(config.method||'GET').toUpperCase(), uid:cleanUid}; }
    else { const parsed=new URL(rawUrl); if(!parsed.searchParams.get('uid')) parsed.searchParams.set('uid', cleanUid); if(config.apiKeyName && config.apiKey) parsed.searchParams.set(config.apiKeyName, config.apiKey); return {ok:true, url:parsed.toString(), method:(config.method||'GET').toUpperCase(), uid:cleanUid}; }
  } catch(e){ return {ok:false, error:'URL invalid'}; }
}
async function fetchPlayerData(config, uid, timeoutMs){
  timeoutMs=timeoutMs||15000;
  const built=buildPlayerApiUrl(config, uid);
  if(!built.ok) return {ok:false, type:'config', message:built.error};
  const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(), timeoutMs);
  const opts={ method:built.method, headers:{Accept:'application/json'}, signal:controller.signal };
  if(built.method==='POST'){ opts.headers['Content-Type']='application/json'; opts.body=JSON.stringify({uid:built.uid}); }
  try{
    const response=await fetch(built.url, opts); clearTimeout(timer);
    if(response.status===401 || response.status===403) return {ok:false,type:'auth',status:response.status,message:'Authentication failed ('+response.status+')'};
    if(response.status===404) return {ok:false,type:'not_found',status:404,message:'Player not found (404)'};
    if(response.status===429) return {ok:false,type:'rate_limit',status:429,message:'Rate limited. Wait 30s'};
    if(response.status>=500) return {ok:false,type:'server',status:response.status,message:'Server error ('+response.status+')'};
    if(!response.ok) return {ok:false,type:'http',status:response.status,message:'HTTP '+response.status};
    const ct=response.headers.get('content-type')||'';
    let data;
    if(ct.indexOf('json')!==-1){ try{ data=await response.json(); }catch(e){ return {ok:false,type:'parse',message:'Invalid JSON'}; } }
    else { const txt=await response.text(); try{ data=JSON.parse(txt); }catch(e){ return {ok:false,type:'parse',message:'Response is not JSON'}; } }
    if(data && data.success===false) return {ok:false,type:'api',message:data.error||data.message||'API returned failure'};
    return {ok:true, data:data, url:built.url, requestUid:built.uid};
  } catch(err){
    clearTimeout(timer);
    if(err && err.name==='AbortError') return {ok:false,type:'timeout',message:'Timed out'};
    const msg=String((err && err.message)||'unknown');
    if(msg.toLowerCase().indexOf('cors')!==-1 || msg.toLowerCase().indexOf('failed to fetch')!==-1) return {ok:false,type:'cors_network',message:'Network/CORS error.'};
    return {ok:false,type:'network',message:'Network error'};
  }
}
function extractPlayerData(data, config, inputUid){
  const cfg=config||{};
  function tryGet(path, fallbacks){ if(path){ const v=getNestedValSafe(data, path); if(v!==undefined) return v; } for(const fb of (fallbacks||[])){ const v=getNestedValSafe(data, fb); if(v!==undefined && v!==null && v!=='') return v; } return undefined; }
  const name = tryGet(cfg.namePath, ['player.name','player.nickname','data.player.name','data.name','data.nickname','account.name','name','nickname']);
  const uid = tryGet(cfg.uidPath, ['player.uid','player.account_id','data.uid','uid','account_id','account.uid']);
  const level = tryGet(cfg.levelPath, ['player.level','data.level','level','player.account_level']);
  const likes = tryGet(cfg.likesPath, ['player.likes','data.likes','likes','player.like_count']);
  const diamonds = tryGet(cfg.diamondsPath, ['player.diamonds','player.total_diamonds','data.diamonds','diamonds']);
  const valuation = cfg.valuationPath ? getNestedValSafe(data, cfg.valuationPath) : (getNestedValSafe(data,'valuation') || getNestedValSafe(data,'player.valuation'));
  const result = {name:null, uid:null, level:null, likes:null, diamonds:null, valuation:valuation||null, raw:data};
  if(typeof name==='string' && !isInvalidName(name)) result.name=name.trim();
  if(uid!==undefined && uid!==null) result.uid=String(uid).trim();
  result.level=numOrNull(level); result.likes=numOrNull(likes); result.diamonds=numOrNull(diamonds);
  result.inputUid=String(inputUid||'').replace(/\D/g,'');
  result.uidMatches = result.uid ? (result.uid===result.inputUid) : null;
  return result;
}
function calculateValuationSafe(playerData){
  const breakdown=[]; let total=0; let hasData=false; const cfg=accountPricing||{};
  const base=numOrNull(cfg.basePrice); if(base!==null && base>=0){ total+=base; breakdown.push({label:'Base Price', value:base, count:null, rate:null}); hasData=true; }
  if(playerData.level!==null && playerData.level>=0){ const rate=numOrNull(cfg.levelPrice)||0; const contrib=playerData.level*rate; total+=contrib; breakdown.push({label:'Level', value:playerData.level, rate:rate, count:contrib}); hasData=true; } else { breakdown.push({label:'Level', value:null, note:'missing'}); }
  if(playerData.likes!==null && playerData.likes>=0){ const rate=numOrNull(cfg.likePrice)||0; const contrib=playerData.likes*rate; total+=contrib; breakdown.push({label:'Likes', value:playerData.likes, rate:rate, count:contrib}); hasData=true; } else { breakdown.push({label:'Likes', value:null, note:'missing'}); }
  if(playerData.diamonds!==null && playerData.diamonds>=0){ const rate=numOrNull(cfg.diamondPrice)||0; const contrib=playerData.diamonds*rate; total+=contrib; breakdown.push({label:'Diamonds', value:playerData.diamonds, rate:rate, count:contrib}); hasData=true; } else { breakdown.push({label:'Diamonds', value:null, note:'missing'}); }
  const apiVal=playerData.valuation||{}; let bdt=null, usd=null, rarity=null;
  if(apiVal && (apiVal.bdt!==undefined || apiVal.usd!==undefined)){ const apiBdt=numOrNull(apiVal.bdt); const apiUsd=numOrNull(apiVal.usd); if(apiBdt!==null && apiBdt>0){ bdt=apiBdt; usd=apiUsd!==null?apiUsd:apiBdt/120; rarity=apiVal.rarity_tier||apiVal.tier||null; breakdown.push({label:'(From API)', value:'override', note:'using API-provided valuation'}); } }
  if(bdt===null && hasData){ bdt=Math.round(total); usd=+(bdt/120).toFixed(2); rarity= bdt>10000?'Legendary': bdt>5000?'Epic': bdt>2000?'Rare': bdt>500?'Uncommon':'Standard'; }
  return {bdt:bdt, usd:usd, rarity:rarity, breakdown:breakdown, hasData:hasData};
}

/* ═══════════════════ AUTH UI ═══════════════════ */
function renderLoginLogo(url){ const box=$('login-logo-container'); if(!box) return; if(url&&url.trim()){ box.innerHTML='<img src="'+url.trim()+'" class="login-logo" alt="Logo" onerror="handleLoginLogoError(this)">'; } else { box.innerHTML='<div class="login-logo-placeholder"><i class="fas fa-bolt"></i><span>SM TOPUP</span></div>'; } }
function handleLoginLogoError(img){ img.onerror=null; $('login-logo-container').innerHTML='<div class="login-logo-placeholder"><i class="fas fa-bolt"></i><span>SM TOPUP</span></div>'; }
function renderHeaderLogo(url){ const img=$('header-logo-img'),txt=$('header-brand-text'); if(url&&url.trim()){ img.onerror=function(){this.style.display='none';txt.style.display='block';}; img.src=url.trim(); img.style.display='block'; txt.style.display='none'; } else { img.style.display='none'; txt.style.display='block'; } }

function toggleAuth(v){const l=$('login-form'),r=$('register-form'); if(v==='login'){l.classList.remove('hidden');r.classList.add('hidden');$('btn-login-view').classList.add('on');$('btn-reg-view').classList.remove('on');}else{l.classList.add('hidden');r.classList.remove('hidden');$('btn-reg-view').classList.add('on');$('btn-login-view').classList.remove('on');}}
function togglePass(id,btn){const inp=$(id),i=btn.querySelector('i'); if(inp.type==='password'){inp.type='text';i.classList.replace('fa-eye','fa-eye-slash');}else{inp.type='password';i.classList.replace('fa-eye-slash','fa-eye');}}
function handleRegister(){ const name=$('reg-name').value.trim(),email=$('reg-email').value.trim(),phone=$('reg-phone').value.trim(),pass=$('reg-pass').value; if(!name||!email||!phone||!pass) return Swal.fire('Error','সব ফিল্ড পূরণ করুন','error'); if(pass.length<6) return Swal.fire('Error','পাসওয়ার্ড কমপক্ষে ৬ অক্ষর','error'); Swal.showLoading(); auth.createUserWithEmailAndPassword(email,pass).then(c=>db.collection('users').doc(c.user.uid).set({name,email,phone,balance:0,totalSpend:0,weeklySpend:0,totalOrders:0,supportPin:Math.floor(10000+Math.random()*90000),createdAt:new Date()})).then(()=>Swal.fire('Success','Account Created!','success')).catch(e=>Swal.fire('Error',e.message,'error')); }
function handleLogin(){ const e=$('login-email').value.trim(),p=$('login-pass').value; if(!e||!p) return Swal.fire('Error','ইমেইল ও পাসওয়ার্ড দিন','warning'); Swal.showLoading(); auth.signInWithEmailAndPassword(e,p).catch(e=>Swal.fire('Login Failed',e.message,'error')); }
function handleLogout(){Swal.fire({title:'Log Out?',icon:'question',showCancelButton:true,confirmButtonText:'Yes',confirmButtonColor:'#7c3aed'}).then(r=>{if(r.isConfirmed)auth.signOut().then(()=>location.reload());});}
function hideNotice(){const el=$('notice-bar'); if(el) el.style.display='none';}

/* ═══════════════════ NAV / SECTION ═══════════════════ */
function showSec(id){ 
  try {
    document.querySelectorAll('main > section').forEach(s=>s.classList.add('hidden')); 
    document.querySelectorAll('.nvi').forEach(n=>n.classList.remove('on')); 
    const sec=$(id+'-sec'); if(sec) sec.classList.remove('hidden'); 
    const btn=$('nav-'+id); if(btn) btn.classList.add('on'); 
    window.scrollTo({top:0,behavior:'smooth'}); 
    if(id==='orders') loadMyOrders(); 
    if(id==='codes') loadMyCodes(); 
    if(id==='account'){ computeRank(); } 
    if(id==='addmoney') resetAddMoneyView(); 
  } catch(e) { console.error("Error navigating:", e); }
}
function refreshBalance(){toast('success','Balance refreshed');}
function resetAddMoneyView(){$('am-view-1').classList.remove('hidden'); $('am-view-2').classList.add('hidden');}
function getWalletLogo(){ return (globalWalletLogo && globalWalletLogo.trim()) ? globalWalletLogo.trim() : 'https://placehold.co/220x90/4338ca/ffffff?text=Wallet+Pay'; }
function getInstantLogo(){ return (globalInstantLogo && globalInstantLogo.trim()) ? globalInstantLogo.trim() : 'https://placehold.co/220x90/4338ca/ffffff?text=Instant+Pay'; }
function getMethodLogo(k){ return (paymentLogos[k] && paymentLogos[k].trim()) ? paymentLogos[k].trim() : DEFAULT_METHOD_LOGO[k]; }

function getPkgIcon(name){
  if(!name) return {icon:'fa-gem',color:'#6366f1',bg:'linear-gradient(135deg,#eef2ff,#c7d2fe)'};
  const n=name.toLowerCase();
  if(n.includes('diamond')||n.includes('dia')||n.includes('gem')) return {icon:'fa-gem',color:'#4338ca',bg:'linear-gradient(135deg,#e0e7ff,#c7d2fe)'};
  if(n.includes('robux')) return {icon:'fa-cube',color:'#16a34a',bg:'linear-gradient(135deg,#dcfce7,#bbf7d0)'};
  if(n.includes('uc')) return {icon:'fa-star',color:'#f59e0b',bg:'linear-gradient(135deg,#fef3c7,#fde68a)'};
  if(n.includes('coin')||n.includes('gold')) return {icon:'fa-coins',color:'#d97706',bg:'linear-gradient(135deg,#fef3c7,#fcd34d)'};
  if(n.includes('weekly')||n.includes('week')) return {icon:'fa-calendar-week',color:'#7c3aed',bg:'linear-gradient(135deg,#ede9fe,#c4b5fd)'};
  if(n.includes('pass')||n.includes('bp')||n.includes('royal')) return {icon:'fa-ticket',color:'#0891b2',bg:'linear-gradient(135deg,#cffafe,#a5f3fc)'};
  if(n.includes('vip')) return {icon:'fa-crown',color:'#eab308',bg:'linear-gradient(135deg,#fef9c3,#fde047)'};
  return {icon:'fa-gem',color:'#6366f1',bg:'linear-gradient(135deg,#eef2ff,#c7d2fe)'};
}

/* ═══════════════════ TOPUP ═══════════════════ */
function openTopUpPage(gameId){
  const game=gamesData[gameId]; if(!game) return;
  selectedGameId=gameId; selectedGameName=game.name; selectedProduct=null; currentPlayerName=''; currentPlayerUid='';
  setText('total-price','0'); setText('topup-balance',userBalance);
  $('game-player-id').value=''; $('player-name-box').classList.remove('show','name-box-error');
  setText('topup-game-title',game.name); setText('topup-sub-title',game.name); $('topup-game-img').src=game.image;
  const cfg=INPUT_TYPES[(game.inputType||'uid').toLowerCase()]||INPUT_TYPES.uid;
  setText('input-field-label',game.inputLabel||cfg.label); setText('input-field-help',game.inputHelp||cfg.help);
  const inp=$('game-player-id'); if(inp) inp.placeholder=game.inputPlaceholder||cfg.placeholder;
  if($('input-field-icon')) $('input-field-icon').className='fas '+cfg.icon+' absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs';
  const rulesBox=$('game-rules-box'),rulesList=$('game-rules-text');
  if(game.rules && game.rules.trim()){ rulesList.innerHTML=game.rules.split('\n').map(x=>x.trim()).filter(Boolean).map(l=>'<div class="rule-item"><div class="rule-bullet"></div><p>'+l+'</p></div>').join(''); rulesBox.classList.remove('hidden'); } else rulesBox.classList.add('hidden');
  const gw=(game.walletLogo&&game.walletLogo.trim())?game.walletLogo.trim():getWalletLogo();
  $('wallet-opt-logo').src=gw; $('wallet-opt-logo').onerror=function(){this.src='https://placehold.co/220x90/4338ca/ffffff?text=Wallet+Pay';};
  const gi=(game.instantLogo&&game.instantLogo.trim())?game.instantLogo.trim():getInstantLogo();
  $('instant-opt-logo').src=gi; $('instant-opt-logo').onerror=function(){this.src='https://placehold.co/220x90/4338ca/ffffff?text=Instant+Pay';};
  selectPayOption('wallet'); showSec('topup');
  const grid=$('products-grid'),loader=$('product-loader');
  grid.innerHTML=''; loader.classList.remove('hidden');
  db.collection('services').doc(gameId).collection('products').orderBy('price','asc').get().then(snap=>{
    loader.classList.add('hidden');
    if(snap.empty){grid.innerHTML='<div class="col-span-2 text-center text-gray-400 py-8 text-sm">No packages available</div>'; return;}
    const frag=document.createDocumentFragment();
    snap.forEach(doc=>{
      const p=doc.data(); const card=document.createElement('div');
      const inStock=p.stock!==false && p.stock!=='out';
      card.className="pkg-card"+(inStock?'':' out-of-stock');
      const auto=getPkgIcon(p.name);
      let iconHtml;
      if(p.icon && p.icon.trim()){ iconHtml='<div class="pkg-icon-box" style="background:'+auto.bg+'"><img src="'+p.icon+'" onerror="this.outerHTML=\'<i class=&quot;fas '+auto.icon+'&quot; style=&quot;color:'+auto.color+'&quot;></i>\'"></div>'; }
      else { iconHtml='<div class="pkg-icon-box" style="background:'+auto.bg+'"><i class="fas '+auto.icon+'" style="color:'+auto.color+'"></i></div>'; }
      card.innerHTML=iconHtml+'<div class="pkg-title">'+(p.name||'-')+'</div><div class="pkg-price">৳ '+p.price+'</div><div class="pkg-stock-pill'+(inStock?'':' out')+'"><i class="fas fa-circle"></i> '+(inStock?'In Stock':'Out')+'</div>';
      if(inStock){card.onclick=()=>selectProduct(card,p,doc.id);} else {card.onclick=()=>toast('warning','Stock Out!');}
      frag.appendChild(card);
    });
    grid.appendChild(frag);
  }).catch(err=>{loader.classList.add('hidden'); grid.innerHTML='<div class="col-span-2 text-center text-red-400 py-6 text-xs">'+err.message+'</div>';});
}

async function checkPlayerName(){
  const uid=$('game-player-id').value.trim().replace(/\D/g,'');
  const btn=$('check-name-btn'), txt=$('check-name-txt'), box=$('player-name-box');
  if(!uid || uid.length<5) return Swal.fire({icon:'warning',title:'UID দিন',text:'সঠিক UID দিন (কমপক্ষে ৫ সংখ্যা)'});
  if(!playerApiConfig || !playerApiConfig.url || !playerApiConfig.url.trim()){ return Swal.fire({icon:'info',title:'API Not Configured',text:'Admin এখনো Player API সেট করেনি'}); }
  if(activeAbortController) activeAbortController.abort();
  const mySearchId=++activeSearchId; activeAbortController=new AbortController();
  btn.disabled=true; txt.textContent='Checking...'; box.classList.remove('show','name-box-error');
  const result=await fetchPlayerData(playerApiConfig, uid, 15000);
  if(mySearchId!==activeSearchId) return;
  if(!result.ok){
    btn.disabled=false; txt.textContent='Check Player Name';
    const av=$('name-box-avatar'); av.textContent='!'; av.classList.add('error');
    $('name-box-value').textContent = result.message || 'Lookup failed'; $('name-box-value').classList.add('error');
    $('name-box-level').textContent = ''; setText('name-box-label-txt','Lookup Failed');
    box.classList.add('show','name-box-error'); return;
  }
  const player=extractPlayerData(result.data, playerApiConfig, uid);
  if(!player.name){
    btn.disabled=false; txt.textContent='Check Player Name';
    const av=$('name-box-avatar'); av.textContent='?'; av.classList.add('error');
    $('name-box-value').textContent='Player name not found in API'; $('name-box-value').classList.add('error');
    $('name-box-level').textContent=''; setText('name-box-label-txt','Name Missing');
    box.classList.add('show','name-box-error'); return;
  }
  if(player.uidMatches===false){
    btn.disabled=false; txt.textContent='Check Player Name';
    const av=$('name-box-avatar'); av.textContent='!'; av.classList.add('error');
    $('name-box-value').textContent='UID mismatch — got '+player.uid; $('name-box-value').classList.add('error');
    $('name-box-level').textContent=''; setText('name-box-label-txt','UID Mismatch');
    box.classList.add('show','name-box-error'); return;
  }
  currentPlayerName=player.name; currentPlayerUid=player.uid || uid;
  $('name-box-value').textContent=player.name; $('name-box-value').classList.remove('error');
  $('name-box-level').textContent = player.level!==null ? ('Level '+player.level) : '';
  const av=$('name-box-avatar'); av.classList.remove('error');
  const avUrl=getNestedValSafe(result.data, playerApiConfig.avatarPath||'player.avatar');
  if(avUrl && typeof avUrl==='string'){ av.innerHTML='<img src="'+avUrl+'" alt="avatar" onerror="this.parentNode.textContent=\''+player.name.charAt(0).toUpperCase()+'\'">'; } else { av.textContent=player.name.charAt(0).toUpperCase(); }
  setText('name-box-label-txt', player.uidMatches===true ? 'Player Verified' : 'Player Found');
  box.classList.add('show'); btn.disabled=false; txt.textContent='Check Player Name';
  toast('success', player.name + (player.uidMatches===true ? ' ✓' : ''));
}

/* ═══════════════════ ORDER FLOW ═══════════════════ */
function selectProduct(el,prod,id){ if(prod.stock===false||prod.stock==='out') return toast('warning','Stock Out!'); document.querySelectorAll('.pkg-card').forEach(c=>c.classList.remove('on')); el.classList.add('on'); selectedProduct={id:id,name:prod.name,price:parseInt(prod.price||0)}; setText('total-price',selectedProduct.price); }
function selectPayOption(o){selectedPayOption=o; document.querySelectorAll('.pay-option').forEach(e=>e.classList.remove('on')); const el=$('pay-opt-'+o); if(el) el.classList.add('on');}

function buyNowClick(){
  const pid=$('game-player-id').value.trim();
  if(!pid) return Swal.fire({icon:'warning',title:'Missing',text:'আইডি / তথ্য দিন!'});
  if(!selectedProduct) return Swal.fire({icon:'warning',title:'Select Package',text:'একটি প্যাকেজ সিলেক্ট করুন!'});
  if(selectedPayOption==='wallet'){
    if(userBalance<selectedProduct.price){ return Swal.fire({icon:'error',title:'Low Balance',html:'ব্যালেন্স: <b>৳'+userBalance+'</b><br>প্রয়োজন: <b>৳'+selectedProduct.price+'</b>',showCancelButton:true,confirmButtonText:'Add Money',cancelButtonText:'Cancel',confirmButtonColor:'#7c3aed'}).then(r=>{if(r.isConfirmed) showSec('addmoney');}); }
    confirmWalletOrder();
  } else { openPaymentPage(); }
}
function confirmWalletOrder(){
  const pid=$('game-player-id').value.trim();
  Swal.fire({title:'Confirm Order?',html:'<div style="text-align:left;font-size:13px;line-height:1.9;padding:6px 0"><b>Game:</b> '+selectedGameName+'<br><b>ID:</b> '+pid+'<br><b>Package:</b> '+selectedProduct.name+'<br><b>Price:</b> ৳'+selectedProduct.price+'<br><b>Payment:</b> Wallet</div>',icon:'question',showCancelButton:true,confirmButtonColor:'#7c3aed',confirmButtonText:'Confirm'}).then(res=>{
    if(!res.isConfirmed) return; Swal.showLoading();
    const orderData={userId:currentUser.uid,userName:userData.name||currentUser.email,userEmail:currentUser.email,gameId:selectedGameId,gameName:selectedGameName,playerId:pid,playerName:currentPlayerName||'',productId:selectedProduct.id,productName:selectedProduct.name,price:selectedProduct.price,status:'pending',paymentType:'wallet',paymentMethod:'wallet',trxId:'',date:new Date()};
    const newBal=userBalance-selectedProduct.price, newSpend=totalSpend+selectedProduct.price, newWeekly=weeklySpend+selectedProduct.price, newOrders=(userData.totalOrders||0)+1;
    db.collection('users').doc(currentUser.uid).update({balance:newBal,totalSpend:newSpend,weeklySpend:newWeekly,totalOrders:newOrders}).then(()=>db.collection('orders').add(orderData)).then(()=>{Swal.fire({icon:'success',title:'Order Placed!',text:'Admin verify করবে।',timer:2200,showConfirmButton:false}); showSec('home');}).catch(e=>Swal.fire('Error',e.message,'error'));
  });
}
function openPaymentPage(){setText('pp-amount',selectedProduct.price);setText('pp-amount-2',selectedProduct.price);renderPpTabs();selectPpMethod('bkash');showSec('payment');}
function renderPpTabs(){ const box=$('pp-method-tabs'); if(!box) return; box.innerHTML=''; ['bkash','nagad','rocket'].forEach(k=>{const logo=getMethodLogo(k);const btn=document.createElement('div');btn.className='method-tab'+(k==='bkash'?' on':'');btn.dataset.method=k;btn.onclick=()=>selectPpMethod(k);btn.innerHTML='<img src="'+logo+'" onerror="this.style.display=\'none\'"><div class="mname">'+METHODS[k].name+'</div>';box.appendChild(btn);}); }
function selectPpMethod(k){ selectedPayMethod=k; const m=METHODS[k]; document.querySelectorAll('#pp-method-tabs .method-tab').forEach(t=>t.classList.toggle('on',t.dataset.method===k)); $('pp-hero-bg').style.background=m.heroBg; $('pp-inst-bg').style.background=m.instBg; $('pp-verify-btn').style.background=m.verify; const logo=getMethodLogo(k); $('pp-brand-logo').src=logo; $('pp-brand-logo').onerror=function(){this.src=DEFAULT_METHOD_LOGO[k];}; setText('pp-ussd',m.ussd); setText('pp-m1',m.name); setText('pp-number',paymentNumbers[k]||"01XXXXXXXXX"); $('pp-trx').value=''; }
function copyPpNumber(btn){navigator.clipboard.writeText($('pp-number').textContent).then(()=>{const orig=btn.innerHTML;btn.innerHTML='<i class="fas fa-check"></i> কপি';setTimeout(()=>btn.innerHTML=orig,1200);});}
function submitInstantOrder(){
  const trx=$('pp-trx').value.trim();
  if(!trx) return Swal.fire('Warning','Transaction ID দিন','warning');
  if(trx.length<4) return Swal.fire('Warning','সঠিক TrxID দিন','warning');
  const pid=$('game-player-id').value.trim();
  Swal.fire({title:'Confirm Order?',html:'<div style="text-align:left;font-size:13px;line-height:1.9;padding:6px 0"><b>Game:</b> '+selectedGameName+'<br><b>ID:</b> '+pid+'<br><b>Package:</b> '+selectedProduct.name+'<br><b>Price:</b> ৳'+selectedProduct.price+'<br><b>Method:</b> '+METHODS[selectedPayMethod].name+'</div>',icon:'question',showCancelButton:true,confirmButtonColor:'#7c3aed',confirmButtonText:'Confirm'}).then(res=>{
    if(!res.isConfirmed) return; Swal.showLoading();
    db.collection('orders').add({userId:currentUser.uid,userName:userData.name||currentUser.email,userEmail:currentUser.email,gameId:selectedGameId,gameName:selectedGameName,playerId:pid,playerName:currentPlayerName||'',productId:selectedProduct.id,productName:selectedProduct.name,price:selectedProduct.price,status:'pending',paymentType:'direct',paymentMethod:selectedPayMethod,trxId:trx,date:new Date()}).then(()=>{Swal.fire({icon:'success',title:'Submitted!',text:'Admin verify করবে।',timer:2400,showConfirmButton:false});showSec('home');}).catch(e=>Swal.fire('Error',e.message,'error'));
  });
}
function backFromPaymentPage(){showSec('topup');}

/* ═══════════════════ ADD MONEY ═══════════════════ */
function quickAmt(a){const i=$('dep-amount'); if(i) i.value=(parseInt(i.value)||0)+a;}
function goToAmountNext(){ const amt=parseInt($('dep-amount').value); if(!amt||amt<10) return Swal.fire('Warning','সর্বনিম্ন ১০ টাকা দিন','warning'); addmoneyAmount=amt; setText('am-amount-show',amt); $('am-view-1').classList.add('hidden'); $('am-view-2').classList.remove('hidden'); renderAmMethods(); window.scrollTo({top:0,behavior:'smooth'}); }
function backToAmount(){$('am-view-2').classList.add('hidden'); $('am-view-1').classList.remove('hidden'); window.scrollTo({top:0,behavior:'smooth'});}
function renderAmMethods(){ const box=$('am-methods-list'); if(!box) return; box.innerHTML=''; ['bkash','nagad','rocket'].forEach((k,i)=>{const logo=getMethodLogo(k);const div=document.createElement('div');div.className='method-row'+(i===0?' on':'');div.dataset.method=k;div.onclick=()=>openAmPayment(k);div.innerHTML='<div class="m-logo"><img src="'+logo+'" onerror="this.src=\''+DEFAULT_METHOD_LOGO[k]+'\'"></div><div class="m-info"><div class="m-name">'+METHODS[k].name+'</div><div class="m-sub">Tap to continue</div></div><div class="m-arrow"><i class="fas fa-chevron-right"></i></div>';box.appendChild(div);}); }
function openAmPayment(k){amSelectedMethod=k;setText('ap-amount',addmoneyAmount);setText('ap-amount-2',addmoneyAmount);renderApTabs();selectApMethod(k);showSec('am-payment');}
function renderApTabs(){ const box=$('ap-method-tabs'); if(!box) return; box.innerHTML=''; ['bkash','nagad','rocket'].forEach(k=>{const logo=getMethodLogo(k);const btn=document.createElement('div');btn.className='method-tab'+(k===amSelectedMethod?' on':'');btn.dataset.method=k;btn.onclick=()=>selectApMethod(k);btn.innerHTML='<img src="'+logo+'" onerror="this.style.display=\'none\'"><div class="mname">'+METHODS[k].name+'</div>';box.appendChild(btn);}); }
function selectApMethod(k){ amSelectedMethod=k; const m=METHODS[k]; document.querySelectorAll('#ap-method-tabs .method-tab').forEach(t=>t.classList.toggle('on',t.dataset.method===k)); $('ap-hero-bg').style.background=m.heroBg; $('ap-inst-bg').style.background=m.instBg; $('ap-verify-btn').style.background=m.verify; const logo=getMethodLogo(k); $('ap-brand-logo').src=logo; $('ap-brand-logo').onerror=function(){this.src=DEFAULT_METHOD_LOGO[k];}; setText('ap-ussd',m.ussd); setText('ap-m1',m.name); setText('ap-number',paymentNumbers[k]||"01XXXXXXXXX"); $('ap-trx').value=''; }
function copyApNumber(btn){navigator.clipboard.writeText($('ap-number').textContent).then(()=>{const orig=btn.innerHTML;btn.innerHTML='<i class="fas fa-check"></i> কপি';setTimeout(()=>btn.innerHTML=orig,1200);});}
function backFromAmPayment(){showSec('addmoney');}
function submitAddMoney(){
  const sender=$('ap-sender').value.trim();
  const trx=$('ap-trx').value.trim().toUpperCase();
  if(!addmoneyAmount||addmoneyAmount<10) return Swal.fire('Warning','সর্বনিম্ন ১০ টাকা দিন','warning');
  if(!/^01\d{9}$/.test(sender)) return Swal.fire('Warning','সঠিক ১১ ডিজিটের Sender Number দিন','warning');
  if(!trx||trx.length<4) return Swal.fire('Warning','সঠিক Transaction ID দিন','warning');
  Swal.showLoading();
  db.collection('deposits').add({userId:currentUser.uid,userEmail:currentUser.email,amount:addmoneyAmount,sender:sender,trxId:trx,method:METHODS[amSelectedMethod].name,methodKey:amSelectedMethod,status:'pending',date:new Date()}).then(()=>{ Swal.fire({icon:'success',title:'Request Submitted!',html:'Admin verify করবে ৫-১০ মিনিটে।',confirmButtonColor:'#7c3aed'}); $('dep-amount').value=''; $('ap-sender').value=''; $('ap-trx').value=''; showSec('addmoney'); backToAmount(); }).catch(e=>Swal.fire('Error',e.message,'error'));
}

/* ═══════════════════ ORDERS / CODES ═══════════════════ */
function loadMyOrders(){
  const list=$('my-orders-list'); if(!list||!currentUser) return;
  list.innerHTML='<div class="text-center py-8"><div class="spinner"></div></div>';
  db.collection('orders').where('userId','==',currentUser.uid).limit(50).get().then(snap=>{
    if(snap.empty){list.innerHTML='<div class="empty-state"><i class="fas fa-bag-shopping"></i><p>No orders yet</p></div>'; return;}
    let arr=[]; snap.forEach(d=>arr.push(Object.assign({id:d.id},d.data())));
    arr.sort((a,b)=>{const da=a.date&&a.date.toDate?a.date.toDate():new Date(a.date||0);const db2=b.date&&b.date.toDate?b.date.toDate():new Date(b.date||0);return db2-da;});
    const frag=document.createDocumentFragment();
    arr.forEach(d=>{
      const st=(d.status||'pending').toLowerCase(); let s='';
      if(['success','complete','completed'].includes(st)) s='<span class="bdg-done"><i class="fas fa-circle-check"></i> Completed</span>';
      else if(['cancel','canceled','rejected','refunded'].includes(st)) s='<span class="bdg-cancel"><i class="fas fa-circle-xmark"></i> '+st+'</span>';
      else s='<span class="bdg-pend"><i class="fas fa-clock"></i> Pending</span>';
      let ds='N/A'; if(d.date){const dt=d.date.toDate?d.date.toDate():new Date(d.date); ds=dt.toLocaleString('en-GB',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:true});}
      const card=document.createElement('div'); card.className='od-card';
      card.innerHTML='<div class="od-head"><div class="flex items-center gap-2"><i class="fas fa-cube text-violet-400"></i><h4 class="font-black text-[#0b0d1a] text-sm f-display">Order #'+d.id.slice(-6).toUpperCase()+'</h4></div>'+s+'</div><div class="od-row border-t border-dashed border-gray-200"><span class="lbl"><i class="fas fa-box"></i> Package</span><span class="val">'+(d.productName||'-')+'</span></div><div class="od-row"><span class="lbl"><i class="fas fa-money-bill-wave"></i> Price</span><span class="val">৳'+(d.price||0).toLocaleString()+'</span></div><div class="od-row"><span class="lbl"><i class="fas fa-user"></i> Player ID</span><span class="val font-mono">'+(d.playerId||'-')+'</span></div>'+(d.playerName?'<div class="od-row"><span class="lbl"><i class="fas fa-id-badge"></i> Player</span><span class="val">'+d.playerName+'</span></div>':'')+'<div class="od-row"><span class="lbl"><i class="fas fa-calendar"></i> Date</span><span class="val text-[10px]">'+ds+'</span></div>';
      frag.appendChild(card);
    });
    list.innerHTML=''; list.appendChild(frag);
  }).catch(e=>{list.innerHTML='<div class="text-center text-red-500 py-6 text-xs">'+e.message+'</div>';});
}
function loadMyCodes(){
  const list=$('codes-list'); if(!list||!currentUser) return;
  db.collection('codes').where('usedBy','==',currentUser.uid).get().then(snap=>{
    if(snap.empty){list.innerHTML='<div style="background:#fff;border-radius:24px;border:1px solid #eceef5;padding:32px 20px;text-align:center;box-shadow:var(--shadow)"><div style="width:64px;height:64px;margin:0 auto 16px;border-radius:20px;background:linear-gradient(135deg,#fef3c7,#fde68a);display:flex;align-items:center;justify-content:center"><i class="fas fa-ticket" style="color:#d97706;font-size:26px"></i></div><p style="font-size:16px;font-weight:900;color:#0b0d1a;margin-bottom:16px;font-family:Sora,sans-serif">No code data found!</p><button type="button" onclick="showSec(\'home\')" style="background:linear-gradient(135deg,#4338ca,#7c3aed);color:#fff;padding:12px 32px;border-radius:14px;font-weight:800;font-size:13px">ORDER NOW</button></div>'; return;}
    const frag=document.createDocumentFragment();
    snap.forEach(doc=>{const d=doc.data(); const div=document.createElement('div'); div.className='code-tile'; div.innerHTML='<div class="code-tile-ic"><i class="fas fa-ticket"></i></div><div style="flex:1;min-width:0"><p style="font-weight:900;color:#0b0d1a;font-size:13.5px;font-family:monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+d.code+'</p><p style="font-size:10.5px;color:#9ca3af;margin-top:3px;font-weight:600">Amount: ৳'+(d.amount||0)+'</p></div><span class="bdg-done"><i class="fas fa-circle-check text-[10px]"></i> Used</span>'; frag.appendChild(div);});
    list.innerHTML=''; list.appendChild(frag);
  }).catch(()=>{});
}
function openRedeemModal(){$('redeem-modal').classList.remove('hidden'); $('redeem-code').value=''; lockBodyScroll();}
function closeRedeemModal(){$('redeem-modal').classList.add('hidden'); unlockBodyScroll();}
async function redeemCode(){
  const code=$('redeem-code').value.trim().toUpperCase();
  if(!code) return Swal.fire('Warning','Enter code','warning'); Swal.showLoading();
  try {
    const snap=await db.collection('codes').where('code','==',code).limit(1).get();
    if(snap.empty) return Swal.fire('Invalid','Code not found','error');
    const r=snap.docs[0], data=r.data();
    if(data.used) return Swal.fire('Used','Already used','warning');
    const amt=parseInt(data.amount||0); if(amt<=0) return Swal.fire('Error','Invalid amount','error');
    await db.collection('users').doc(currentUser.uid).update({balance:userBalance+amt});
    await r.ref.update({used:true,usedBy:currentUser.uid,usedAt:new Date()});
    Swal.fire({icon:'success',title:'Success!',html:'৳'+amt+' added',confirmButtonColor:'#7c3aed'});
    closeRedeemModal(); loadMyCodes();
  } catch(e){Swal.fire('Error',e.message,'error');}
}

/* ═══════════════════ RANK SYSTEM ═══════════════════ */
function computeRank(){
  try {
    if(!ranksList || ranksList.length === 0) return;
    let cur = ranksList[0], nxt = null;
    for(let i = 0; i < ranksList.length; i++){
      const r = ranksList[i]; 
      const mn = parseInt(r.min)||0, mx = parseInt(r.max)||999999999;
      if(totalSpend >= mn && totalSpend <= mx){ cur = r; nxt = ranksList[i+1] || null; break; }
    }
    currentRank = cur; nextRank = nxt; 
    const heroImg = $('acc-hero-rank-img');
    const heroFa = $('acc-hero-rank-fa');
    if(currentRank.png && currentRank.png.trim()){
      if(heroImg){ heroImg.src = currentRank.png; heroImg.style.display = 'block'; }
      if(heroFa) heroFa.style.display = 'none';
    } else {
      if(heroImg) heroImg.style.display = 'none';
      if(heroFa){ heroFa.className = 'fas ' + (currentRank.icon || 'fa-medal'); heroFa.style.display = 'block'; }
    }
    const rankIdx = ranksList.findIndex(r => r.name === currentRank.name);
    setText('acc-hero-rank-lvl', 'Level ' + (rankIdx >= 0 ? rankIdx + 1 : 1));
    setText('acc-hero-rank-name', currentRank.name);
    setText('acc-hero-rank-desc', currentRank.tagline || '');
    setText('acc-hero-rank-range', parseInt(currentRank.min).toLocaleString() + ' - ' + parseInt(currentRank.max).toLocaleString() + ' Tk');
    const mn = parseInt(currentRank.min)||0, mx = parseInt(currentRank.max)||100;
    const pct = Math.min(100, Math.max(0, Math.round(((totalSpend - mn) / Math.max(1, mx - mn)) * 100)));
    setText('acc-hero-rank-pct', pct + '%');
    const bar = $('acc-hero-rank-prog'); if(bar) bar.style.width = pct + '%';
    if(nextRank){
      const need = Math.max(0, parseInt(nextRank.min) - totalSpend).toLocaleString();
      const el = $('acc-hero-rank-need');
      if(el) el.innerHTML = 'Need only <b>' + need + ' Tk</b> to unlock ' + nextRank.name;
    } else {
      const el = $('acc-hero-rank-need');
      if(el) el.innerHTML = 'You have reached the <b>Maximum Rank!</b>';
    }
    setText('acc-stat-rank', currentRank.name);
    renderRankJourney();
  } catch (e) { console.error('Error computing rank:', e); }
}
function renderRankJourney() {
  try {
    const container = $('rank-journey-list');
    if (!container || !ranksList || ranksList.length === 0) return;
    const sorted = ranksList.slice().sort((a,b) => (a.min||0) - (b.min||0));
    let unlockedCount = 0; let html = '';
    sorted.forEach((r, i) => {
      const isUnlocked = totalSpend >= (r.min || 0);
      const isCurrent = currentRank && currentRank.name === r.name;
      if (isUnlocked) unlockedCount++;
      let statusClass = isCurrent ? 'current' : (isUnlocked ? 'unlocked' : 'locked');
      let badgeHtml = isCurrent ? '<span class="rj-badge current"><i class="fas fa-check"></i> Current</span>' : 
                      (isUnlocked ? '<span class="rj-badge unlocked"><i class="fas fa-check"></i> Unlocked</span>' : 
                      '<span class="rj-badge locked"><i class="fas fa-lock"></i> Locked</span>');
      let iconHtml = '';
      if (r.png && r.png.trim()) {
        iconHtml = `<img src="${r.png}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                    <i class="fas ${r.icon || 'fa-medal'}" style="display:none; color:${r.color || '#ccc'}; font-size:20px;"></i>`;
      } else {
        iconHtml = `<i class="fas ${r.icon || 'fa-medal'}" style="color:${r.color || '#ccc'}; font-size:20px;"></i>`;
      }
      html += `<div class="rj-item ${statusClass}"><div class="rj-line"></div><div class="rj-node">${iconHtml}</div><div class="rj-content"><div class="rj-info"><div class="rj-name">${r.name}</div><div class="rj-req">${(r.min||0).toLocaleString()} - ${(r.max||0).toLocaleString()} Tk</div></div>${badgeHtml}</div></div>`;
    });
    container.innerHTML = html;
    const cnt = $('acc-rank-journey-count');
    if(cnt) cnt.textContent = `${unlockedCount}/${sorted.length}`;
  } catch (e) { console.error('Error rendering rank journey:', e); }
}

/* ═══════════════════ UID CHECKER ═══════════════════ */
function updateAvcNoapiBanner(){ const el=$('avc-noapi'); if(!el) return; if(!playerApiConfig||!playerApiConfig.url||!playerApiConfig.url.trim()) el.style.display='flex'; else el.style.display='none'; }
function openAccountValue(){ const o=$('acc-value-checker'); if(!o) return; o.classList.add('show'); document.body.style.overflow='hidden'; updateAvcNoapiBanner(); }
function closeAccountValue(){ const o=$('acc-value-checker'); if(!o) return; o.classList.remove('show'); document.body.style.overflow=''; }

async function avcCheckPlayer(){
  const uid=$('avc-uid-input').value.trim().replace(/\D/g,'');
  if(!uid || uid.length<5){ return Swal.fire({icon:'warning',title:'UID দিন',text:'সঠিক Free Fire UID দিন (কমপক্ষে ৫ সংখ্যা)'}); }
  if(!playerApiConfig||!playerApiConfig.url||!playerApiConfig.url.trim()){ return Swal.fire({icon:'info',title:'API Not Configured',text:'Admin এখনো Player API সেট করেনি'}); }
  const loading=$('avc-loading'), error=$('avc-error'), results=$('avc-results');
  const btn=$('avc-check-btn'), txt=$('avc-check-txt');
  loading.classList.add('show'); error.classList.remove('show'); results.classList.remove('show');
  btn.disabled=true; txt.textContent='Checking...';
  if(activeAbortController) activeAbortController.abort();
  const mySearchId=++activeSearchId;
  activeAbortController=new AbortController();
  const result=await fetchPlayerData(playerApiConfig, uid, 15000);
  if(mySearchId!==activeSearchId) return;
  btn.disabled=false; txt.textContent='Check Account';
  loading.classList.remove('show');
  if(!result.ok){
    $('avc-error-title').textContent = result.type==='not_found' ? 'Player Not Found' : result.type==='timeout' ? 'Request Timeout' : result.type==='cors_network' ? 'Network / CORS Error' : result.type==='auth' ? 'Authentication Failed' : result.type==='rate_limit' ? 'Rate Limited' : 'Lookup Failed';
    $('avc-error-msg').textContent = result.message || 'Unable to fetch player data';
    error.classList.add('show'); return;
  }
  const player=extractPlayerData(result.data, playerApiConfig, uid);
  if(!player.name){ $('avc-error-title').textContent='Name Missing'; $('avc-error-msg').textContent='API response did not contain a valid player name.'; error.classList.add('show'); return; }
  if(player.uidMatches===false){ $('avc-error-title').textContent='UID Mismatch'; $('avc-error-msg').textContent='API returned UID '+player.uid+' but searched '+uid+'.'; error.classList.add('show'); return; }
  avcCurrentData=result.data;
  avcRenderResults(result.data, player);
  results.classList.add('show');
  setTimeout(()=>{ results.scrollIntoView({behavior:'smooth',block:'start'}); }, 100);
}
function avcRenderResults(data, player){
  const p=data.player || data;
  const letter=(player.name||'?').charAt(0).toUpperCase();
  const avEl=$('avc-avatar');
  const avUrl=getNestedValSafe(data, playerApiConfig.avatarPath||'player.avatar');
  if(avUrl && typeof avUrl==='string'){ avEl.innerHTML='<img src="'+avUrl+'" alt="'+player.name+'" onerror="this.parentNode.textContent=\''+letter+'\'">'; }
  else { avEl.textContent=letter; }
  $('avc-lvl').textContent='LV. '+(player.level!==null?player.level:'?');
  $('avc-pname').textContent=player.name;
  $('avc-uid').textContent=player.uid||player.inputUid;
  const flag=p.region_flag || '🌐';
  const rname=String(p.region_name || p.region || 'GLOBAL').toUpperCase();
  $('avc-region').textContent=flag+' '+rname;
  const primeEl=$('avc-prime');
  if(p.prime_level>0){ primeEl.classList.remove('hidden'); primeEl.textContent='Prime Lv. '+p.prime_level; } else primeEl.classList.add('hidden');
  const verEl=$('avc-verified'); const unverEl=$('avc-unverified');
  if(player.uidMatches===true){ verEl.classList.remove('hidden'); unverEl.classList.add('hidden'); }
  else if(player.uidMatches===false){ verEl.classList.add('hidden'); unverEl.classList.remove('hidden'); }
  else { verEl.classList.add('hidden'); unverEl.classList.remove('hidden'); }
  $('avc-likes').textContent = player.likes!==null ? Number(player.likes).toLocaleString() : '—';
  $('avc-exp').textContent = p.exp ? Number(p.exp).toLocaleString() : '—';
  const bioCard = $('avc-bio-card');
  if(p.signature || p.bio){ bioCard.style.display='block'; $('avc-signature').textContent = p.signature || p.bio; } else bioCard.style.display='none';
  const val=calculateValuationSafe(player);
  $('avc-val-bdt').textContent = val.bdt!==null ? Math.round(val.bdt).toLocaleString()+' ৳' : '—';
  $('avc-val-usd').textContent = val.usd!==null ? '$'+val.usd.toFixed(2) : '—';
  $('avc-val-rarity').textContent = val.rarity || '—';
  $('avc-val-age').textContent = p.days_old!==undefined ? p.days_old+' Days' : '—';
  const bd=$('avc-breakdown');
  if(bd){
    if(!val.hasData){ bd.innerHTML='<div style="font-size:11px;color:rgba(255,255,255,.5);text-align:center;padding:8px">Insufficient data for valuation</div>'; }
    else {
      bd.innerHTML=val.breakdown.map(b=>{
        if(b.value===null && b.note){ return '<div class="breakdown-row"><span class="l">'+b.label+'</span><span class="r" style="color:#f87171">'+b.note+'</span></div>'; }
        if(b.rate!==undefined && b.rate!==null){ return '<div class="breakdown-row"><span class="l">'+b.label+' ('+b.value+' × ৳'+b.rate+')</span><span class="r">৳'+(b.count||0).toFixed(0)+'</span></div>'; }
        if(b.value==='override'){ return '<div class="breakdown-row"><span class="l">'+b.label+'</span><span class="r" style="color:#34d399">override</span></div>'; }
        return '<div class="breakdown-row"><span class="l">'+b.label+'</span><span class="r">৳'+b.value.toFixed(0)+'</span></div>';
      }).join('') + '<div class="breakdown-row"><span class="l">Total Estimate</span><span class="r">৳'+(val.bdt||0).toLocaleString()+'</span></div>';
    }
  }
  const br=p.battle_royale || {};
  $('avc-br-tier').textContent=br.tier||p.br_rank||'Unranked';
  $('avc-br-pts').textContent=br.points?Number(br.points).toLocaleString()+' pts':'0 pts';
  $('avc-br-current').textContent=br.current_rank||br.tier||'-';
  $('avc-br-peak').textContent=br.max_rank||'-';
  $('avc-br-vis').textContent=br.show_rank?'Public':'Private';
  const cs=p.clash_squad || {};
  $('avc-cs-tier').textContent=cs.tier||p.cs_rank||'Unranked';
  $('avc-cs-pts').textContent=cs.points?Number(cs.points).toLocaleString()+' Stars':'0 Stars';
  $('avc-cs-current').textContent=cs.current_rank||cs.tier||'-';
  $('avc-cs-peak').textContent=cs.max_rank||'-';
  $('avc-meta-season').textContent=p.season_id?'Season '+p.season_id:'-';
  $('avc-meta-type').textContent=p.account_type?'Type '+p.account_type:'Standard';
  $('avc-meta-credit').textContent=(p.credit_score||p.honor_score||100)+' / 100';
  $('avc-meta-version').textContent=p.release_version||p.most_recent_ob||'Latest';
  $('avc-meta-region').textContent=p.region_name||p.region||'Global';
  const pet=p.pet || {};
  $('avc-pet-name').textContent=pet.name||(pet.id?'Unnamed Pet':'No Pet');
  $('avc-pet-level').textContent=pet.level?'Lv. '+pet.level:'-';
  $('avc-pet-exp').textContent=pet.exp?Number(pet.exp).toLocaleString():'-';
  const g=p.guild || {};
  $('avc-guild-name').textContent=g.name||(g.id?'Unnamed Guild':'No Guild');
  $('avc-guild-id').textContent=g.id||'-';
  $('avc-guild-level').textContent=g.level||'-';
  $('avc-guild-members').textContent=(g.member_count&&g.capacity)?g.member_count+' / '+g.capacity:'-';
  const eq=p.equipment || {};
  avcRenderChips('avc-weapons', eq.weapons, 'Weapon');
  avcRenderChips('avc-outfits', eq.outfits, 'Outfit');
  avcRenderChips('avc-skills', eq.skills, 'Skill');
  const fidMap={avatar:'avatar_id',banner:'banner_id',pin:'pin_id',badge:'badge_id',head:'head_id',top:'top_id',bottom:'bottom_id',shoe:'shoe_id'};
  for(const k in fidMap){ const el=$('avc-fid-'+k); if(el) el.textContent=eq[fidMap[k]]||'-'; }
  const allF=p.all_fields||p.full_properties||data;
  avcRenderAllFields(allF);
}
function avcRenderChips(id, list, prefix){ const box=$(id); if(!box) return; box.innerHTML=''; if(Array.isArray(list)&&list.length){ list.slice(0,30).forEach(x=>{ const s=document.createElement('span'); s.className='avc-gchip'; s.textContent=prefix+' #'+x; box.appendChild(s); }); } else { const s=document.createElement('span'); s.className='avc-empty'; s.textContent='No data'; box.appendChild(s); } }
function avcRenderAllFields(obj){ const list=$('avc-allfields-list'); if(!list) return; if(!obj||typeof obj!=='object'){ list.innerHTML='<div style="padding:20px;text-align:center;color:rgba(255,255,255,.4);font-size:12px">No fields available</div>'; $('avc-fields-count').textContent='0'; return; } const keys=Object.keys(obj).sort(); $('avc-fields-count').textContent=keys.length; list.innerHTML=keys.map(k=>{ let v=obj[k]; if(v===null||v===undefined) v='-'; else if(typeof v==='object') v=JSON.stringify(v); else v=String(v); if(v.length>300) v=v.substring(0,300)+'...'; const esc=String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); return '<div class="avc-field"><div class="fk">'+k+'</div><div class="fv">'+esc+'</div></div>'; }).join(''); }
function avcCopyUid(){ const u=$('avc-uid').textContent; if(!u||u==='0') return; navigator.clipboard.writeText(u).then(()=>toast('success','UID copied!')); }
function avcCopyAll(){ if(!avcCurrentData) return; navigator.clipboard.writeText(JSON.stringify(avcCurrentData,null,2)).then(()=>toast('success','All data copied!')); }
function avcDownload(){ if(!avcCurrentData) return; const uid=$('avc-uid').textContent; const blob=new Blob([JSON.stringify(avcCurrentData,null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='account_'+uid+'.json'; document.body.appendChild(a); a.click(); document.body.removeChild(a); setTimeout(()=>URL.revokeObjectURL(url),1000); toast('success','Downloaded!'); }

/* ═══════════════════ USER LISTENER ═══════════════════ */
function listenUser(uid){
  db.collection('users').doc(uid).onSnapshot(doc=>{
    if(!doc.exists) return;
    const d=doc.data(); userData=d;
    userBalance=parseInt(d.balance||0); totalSpend=parseInt(d.totalSpend||0); weeklySpend=parseInt(d.weeklySpend||0);
    const firstLetter=(d.name||'U').charAt(0).toUpperCase();
    setText('header-balance',userBalance); setText('header-avatar',firstLetter);
    setText('topup-balance',userBalance);
    setText('prof-avatar', firstLetter);
    setText('prof-name', d.name || 'SM Topup User');
    setText('prof-email', d.email || 'No email');
    setText('prof-pin', d.supportPin || uid.slice(-5).toUpperCase());
    setText('prof-phone', d.phone || 'Not set');
    setText('acc-wallet-balance', userBalance);
    setText('acc-stat-orders', d.totalOrders||0);
    setText('acc-stat-spend', totalSpend.toLocaleString()+' Tk');
    setText('acc-stat-weekly', weeklySpend.toLocaleString()+' Tk');
    computeRank();
  }, err => { console.error("User snapshot error:", err); });
}

/* ═══════════════════ APP LISTENERS ═══════════════════ */
function startAppListeners(){
  if(listenersStarted) return;
  listenersStarted=true;

  db.collection('settings').doc('general').onSnapshot(doc=>{
    const d=doc.exists?doc.data():{};
    const loginUrl=d.userLoginUrl||d.logoUrl||''; const homeUrl=d.userLogoUrl||d.logoUrl||''; const siteName=d.siteName||'SM TOPUP';
    renderLoginLogo(loginUrl); renderHeaderLogo(homeUrl);
    setText('auth-site-name',siteName); setText('auth-tagline',d.tagline||'Premium Top-Up Service');
    setText('footer-site-name',siteName); setText('footer-site-name-2',siteName);
    setText('header-brand-text',siteName); setText('home-site-name',siteName);
    document.title=siteName;
    if(d.notice) setText('notice-text',d.notice);
    
    /* HERO DYNAMIC */
    const heroTxtEl = $('hero-title-txt');
    if(heroTxtEl){ heroTxtEl.innerHTML = (d.heroPrefix || 'Welcome to') + ' <span id="home-site-name">' + siteName + '</span>'; }
    const heroSubEl = $('hero-title-sub');
    if(heroSubEl) heroSubEl.textContent = d.heroSubtitle || 'Instant & trusted game top-up service';
    
    /* AUTH BADGE */
    const authBadge = $('auth-brand-badge');
    if(authBadge) authBadge.innerHTML = '<i class="fas fa-bolt"></i> ' + (d.authBadge || 'Premium Service');
    
    /* FOOTER DESCRIPTION */
    const footerDesc = $('footer-desc-text');
    if(footerDesc && d.footerDesc) footerDesc.innerHTML = d.footerDesc;
    
    /* SUPPORT CENTER BLOCK */
    const supportTitle = $('ft-support-title');
    const supportSubtitle = $('ft-support-subtitle');
    if(supportTitle) supportTitle.textContent = d.supportTitle || 'Help line [9AM-12PM]';
    if(supportSubtitle) supportSubtitle.textContent = d.supportSubtitle || 'টেলিগ্রামে সাপোর্ট';
    
    globalWalletLogo=d.walletLogo||''; globalInstantLogo=d.instantLogo||'';
    if($('wallet-opt-logo') && globalWalletLogo) $('wallet-opt-logo').src=globalWalletLogo;
    if($('instant-opt-logo') && globalInstantLogo) $('instant-opt-logo').src=globalInstantLogo;
    const tg=d.telegram||'#'; const sh=(id,u)=>{const e=$(id);if(e)e.href=u;};
    sh('ft-fb',d.facebook||'#'); sh('ft-insta',d.instagram||'#'); sh('ft-yt',d.youtube||'#');
    sh('ft-support',tg); sh('ft-mail','mailto:'+(d.email||''));
    sh('home-support-tg',tg); sh('home-group',d.groupLink||tg);
    if(d.popupEnabled && d.popupImage && !sessionStorage.getItem('promoShown')){ setTimeout(()=>showPromo(d),1400); }
  }, err=>{ console.warn('General listener:',err); });

  db.collection('settings').doc('support').onSnapshot(doc=>{ supportItems=(doc.exists&&Array.isArray(doc.data().items))?doc.data().items:[]; renderSupportBubbles(); });
  
  db.collection('settings').doc('playerApi').onSnapshot(doc=>{
    const d=doc.exists?doc.data():{};
    playerApiConfig={ url:d.url||'', namePath:d.namePath||'player.name', levelPath:d.levelPath||'', avatarPath:d.avatarPath||'', uidPath:d.uidPath||'', likesPath:d.likesPath||'', diamondsPath:d.diamondsPath||'', valuationPath:d.valuationPath||'', method:d.method||'GET' };
    updateAvcNoapiBanner();
  }, err=>{ console.warn('PlayerApi listener:', err); });
  
  db.collection('settings').doc('accountPricing').onSnapshot(doc=>{ accountPricing = doc.exists ? doc.data() : {basePrice:100,levelPrice:2,likePrice:0.5,diamondPrice:0.8}; });
  
  db.collection('settings').doc('ranks').onSnapshot(doc=>{ 
    if(doc.exists&&Array.isArray(doc.data().ranks)&&doc.data().ranks.length>0) { ranksList=doc.data().ranks; } 
    else { ranksList=DEFAULT_RANKS; }
    computeRank(); 
  }, err=>{ console.warn('Ranks listener:', err); computeRank(); });

  /* LIVE ACTIVITY CONFIG */
  db.collection('settings').doc('liveActivity').onSnapshot(doc=>{
    liveActivityConfig = doc.exists ? doc.data() : {enabled:true, initial:20, interval:120};
    const c = $('recent-orders-list');
    if(!c) return;
    if(liveActivityConfig.enabled === false){
      if(fakeOrderTimer) clearTimeout(fakeOrderTimer);
      c.innerHTML = '<div class="empty-state" style="padding:24px"><i class="fas fa-signal" style="font-size:30px;opacity:.22"></i><p style="font-size:11.5px">Live activity paused</p></div>';
    } else {
      loadRecentOrders();
    }
  });

  db.collection('admin').doc('payment').onSnapshot(doc=>{ if(doc.exists){const d=doc.data(); paymentNumbers={bkash:d.bkash||'',nagad:d.nagad||'',rocket:d.rocket||''}; paymentLogos={bkash:d.logoBkash||'',nagad:d.logoNagad||'',rocket:d.logoRocket||''}; } });
  db.collection('categories').orderBy('order','asc').onSnapshot(snap=>{allCategories=[]; snap.forEach(doc=>allCategories.push(Object.assign({id:doc.id},doc.data()))); renderCategories();});
  db.collection('services').onSnapshot(snap=>{ allGames=[]; gamesData={}; snap.forEach(doc=>{const d=doc.data();gamesData[doc.id]=d;allGames.push(Object.assign({id:doc.id},d));}); renderCategories(); });
  db.collection('banners').onSnapshot(snap=>{
    const w=$('slider-wrapper'),dt=$('slider-dots'); if(!w||!dt) return;
    const banners=[]; snap.forEach(doc=>{ const img=doc.data().image; if(img) banners.push(img); });
    if(banners.length===0){ w.innerHTML='<div class="slide-item" style="background:#e2e5f0"></div>'; dt.innerHTML=''; sliderCount=0; clearInterval(sliderTimer); return; }
    let h='', dh='';
    banners.forEach((img,i)=>{ h+='<div class="slide-item"><img src="'+img+'" alt="Banner '+(i+1)+'" loading="'+(i===0?'eager':'lazy')+'" onerror="this.style.display=\'none\'"></div>'; dh+='<button type="button" class="slider-dot'+(i===0?' on':'')+'" onclick="goToSlide('+i+')" aria-label="Slide '+(i+1)+'"></button>'; });
    w.innerHTML=h; dt.innerHTML=dh; startSlider();
  });
}

/* ═══════════════════ AUTH STATE ═══════════════════ */
auth.onAuthStateChanged(user=>{
  if(user){
    currentUser=user;
    $('auth-sec').classList.add('hidden');
    $('app-content').classList.remove('hidden');
    listenUser(user.uid);
    startAppListeners();
  } else {
    currentUser=null;
    $('auth-sec').classList.remove('hidden');
    $('app-content').classList.add('hidden');
  }
});

document.addEventListener('DOMContentLoaded',()=>{
  const y=new Date().getFullYear();
  setText('footer-year',y); setText('footer-year-2',y); setText('auth-footer-year',y);
  ranksList=DEFAULT_RANKS;
  renderLoginLogo('');
  renderHeaderLogo('');
  initSliderSwipe();
  updateAvcNoapiBanner();
});

/* ═══════════════════ MISC ═══════════════════ */
function showPromo(d){ if($('promo-img')) $('promo-img').src=d.popupImage; setText('promo-title',d.popupTitle||"Special Offer"); setText('promo-desc',d.popupDesc||""); const b=$('promo-btn'); if(b){ if(d.popupLink){b.href=d.popupLink;b.style.display='flex';} else b.style.display='none'; } $('promo-modal').classList.remove('hidden'); lockBodyScroll(); sessionStorage.setItem('promoShown','1'); }
function closePromo(){$('promo-modal').classList.add('hidden'); unlockBodyScroll();}
function toggleSupport(){const box=$('support-bubbles'),ic=$('support-icon'); supportOpen=!supportOpen; if(supportOpen){box.classList.add('bubbles-open');ic.classList.replace('fa-headset','fa-xmark');}else{box.classList.remove('bubbles-open');ic.classList.replace('fa-xmark','fa-headset');}}

function renderCategories(){
  const c=$('categories-container'); if(!c) return;
  const grouped={}; allGames.forEach(g=>{const cn=(g.category||'Other').trim(); if(!grouped[cn]) grouped[cn]=[]; grouped[cn].push(g);});
  const ordered=[]; allCategories.forEach(x=>{if(grouped[x.name]){ordered.push({name:x.name,items:grouped[x.name]}); delete grouped[x.name];}}); Object.keys(grouped).forEach(k=>ordered.push({name:k,items:grouped[k]}));
  if(ordered.length===0){c.innerHTML='<div class="empty-state"><i class="fas fa-gamepad"></i><p>No products available</p></div>'; return;}
  const frag=document.createDocumentFragment();
  ordered.forEach(cat=>{ const section=document.createElement('div'); let h=''; cat.items.forEach(it=>{ h+='<div onclick="openTopUpPage(\''+it.id+'\')" class="gcard"><div style="position:relative"><img src="'+it.image+'" class="gimg" onerror="this.src=\'https://placehold.co/220/4338ca/ffffff?text=Game\'">'+(it.badge?'<span class="gbadge '+(it.badgeType==='new'?'new':it.badgeType==='hot'?'hot':'')+'">'+it.badge+'</span>':'')+'</div><div class="gname">'+it.name+'</div></div>'; }); section.innerHTML='<div class="sec-head"><div class="sec-head-line"></div><div class="sec-title-c"><i class="fas fa-gamepad"></i> '+cat.name+'</div><div class="sec-head-line"></div></div><div class="grid grid-cols-3 gap-3 pb-2">'+h+'</div>'; frag.appendChild(section); });
  c.innerHTML=''; c.appendChild(frag);
}
function updateSliderPosition(){ const w=$('slider-wrapper'); if(!w) return; w.style.transform='translateX(-'+(sliderIdx*100)+'%)'; const dots=document.querySelectorAll('#slider-dots .slider-dot'); dots.forEach((d,i)=>d.classList.toggle('on',i===sliderIdx)); }
function goToSlide(idx){ if(!sliderCount) return; sliderIdx=((idx%sliderCount)+sliderCount)%sliderCount; updateSliderPosition(); restartSliderAuto(); }
function restartSliderAuto(){ clearInterval(sliderTimer); if(sliderCount<2) return; sliderTimer=setInterval(()=>{ sliderIdx=(sliderIdx+1)%sliderCount; updateSliderPosition(); },4500); }
function startSlider(){ clearInterval(sliderTimer); const w=$('slider-wrapper'); if(!w) return; const slides=w.querySelectorAll('.slide-item'); sliderCount=slides.length; if(sliderCount<1) return; sliderIdx=0; updateSliderPosition(); restartSliderAuto(); }
function handleSliderSwipe(){ if(!sliderCount||sliderCount<2) return; const diff=touchStartX-touchEndX; if(Math.abs(diff)<40) return; if(diff>0){ sliderIdx=(sliderIdx+1)%sliderCount; } else { sliderIdx=(sliderIdx-1+sliderCount)%sliderCount; } updateSliderPosition(); restartSliderAuto(); }
function initSliderSwipe(){ const shell=$('slider-shell'); if(!shell) return; shell.addEventListener('touchstart',e=>{ touchStartX=e.changedTouches[0].screenX; touchStartY=e.changedTouches[0].screenY; isSwiping=false; },{passive:true}); shell.addEventListener('touchmove',e=>{ const dx=Math.abs(e.changedTouches[0].screenX-touchStartX); const dy=Math.abs(e.changedTouches[0].screenY-touchStartY); if(dx>dy && dx>15) isSwiping=true; },{passive:true}); shell.addEventListener('touchend',e=>{ touchEndX=e.changedTouches[0].screenX; if(isSwiping) handleSliderSwipe(); },{passive:true}); }
function pickRandom(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function generateFakeOrder(){
  const games=allGames.length>0?allGames:[]; if(games.length===0) return null;
  const game=pickRandom(games); const gameName=(game.name||'').toLowerCase();
  const packages={"free fire":[["25 Diamonds",22],["50 Diamonds",42],["115 Diamonds",90],["240 Diamonds",180],["610 Diamonds",440],["1240 Diamonds",880],["Weekly Membership",160]],"pubg":[["60 UC",85],["325 UC",420],["660 UC",840],["1800 UC",2200],["Royal Pass",850]],"default":[["50 Diamonds",45],["100 Diamonds",88],["500 Diamonds",420],["1000 Diamonds",820],["Weekly Pack",160]]};
  let pool=packages.default; for(const key of Object.keys(packages)){ if(gameName.includes(key)){ pool=packages[key]; break; } }
  const picked=pickRandom(pool); const name=pickRandom(BD_NAMES); const colors=pickRandom(AVATAR_COLORS);
  return { name, game: game.name, productName: picked[0], price: picked[1], colors, secondsAgo: Math.floor(20+Math.random()*600) };
}
function timeAgoText(sec){ if(sec<60) return 'just now'; const m=Math.floor(sec/60); if(m<60) return m+' min ago'; const h=Math.floor(m/60); return h+'h ago'; }
function fakeOrderRowHTML(o){ const initial=o.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase(); return '<div class="ord-item"><div class="ord-av" style="background:'+o.colors+'">'+initial+'<span class="ord-live-pill">LIVE</span></div><div style="flex:1;min-width:0"><p style="font-weight:800;color:#0b0d1a;font-size:12.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+o.name+'</p><p style="color:#4338ca;font-size:11.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:3px;font-weight:800">'+o.productName+' <span style="color:#9ca3af;font-weight:600">· ৳'+o.price+'</span></p><p style="color:#9ca3af;font-size:9.5px;margin-top:2px;font-weight:700"><i class="fas fa-clock" style="font-size:8px;margin-right:2px"></i>'+timeAgoText(o.secondsAgo)+'</p></div><span class="bdg-done"><i class="fas fa-circle-check"></i> Done</span></div>'; }
function loadRecentOrders(){
  const c=$('recent-orders-list'); if(!c) return;
  if(liveActivityConfig.enabled === false){
    if(fakeOrderTimer) clearTimeout(fakeOrderTimer);
    c.innerHTML = '<div class="empty-state" style="padding:24px"><i class="fas fa-signal" style="font-size:30px;opacity:.22"></i><p style="font-size:11.5px">Live activity paused</p></div>';
    return;
  }
  if(fakeOrderTimer) clearTimeout(fakeOrderTimer);
  buildInitialFakeOrders();
  renderFakeOrders(c);
  setInterval(()=>{ document.querySelectorAll('.ord-item').forEach((el,idx)=>{ const o=fakeOrdersList[idx]; if(o){ const p=el.querySelector('p:last-child'); if(p){ o.secondsAgo+=30; p.innerHTML='<i class="fas fa-clock" style="font-size:8px;margin-right:2px"></i>'+timeAgoText(o.secondsAgo); } } }); }, 30000);
  const scheduleNext=()=>{ 
    if(liveActivityConfig.enabled === false) return;
    const intervalSec = Math.max(120, parseInt(liveActivityConfig.interval)||120);
    const next = (intervalSec * 1000) + Math.floor(Math.random()*60000); 
    fakeOrderTimer=setTimeout(()=>{ 
      if(liveActivityConfig.enabled === false) return;
      const o=generateFakeOrder(); 
      if(o){ 
        o.secondsAgo=0; 
        fakeOrdersList.unshift(o); 
        if(fakeOrdersList.length>30) fakeOrdersList=fakeOrdersList.slice(0,30); 
        const wrap=document.createElement('div'); 
        wrap.innerHTML=fakeOrderRowHTML(o); 
        c.insertBefore(wrap.firstChild, c.firstChild); 
        while(c.children.length>30) c.removeChild(c.lastChild); 
      } 
      scheduleNext(); 
    }, next); 
  }; 
  scheduleNext(); 
}
function buildInitialFakeOrders(){
  fakeOrdersList=[];
  const initial = Math.max(1, parseInt(liveActivityConfig.initial)||20);
  for(let i=0;i<initial;i++){ const o=generateFakeOrder(); if(o){ o.secondsAgo=i*180+Math.floor(Math.random()*120)+20; fakeOrdersList.push(o); } }
  fakeOrdersList.sort((a,b)=>a.secondsAgo-b.secondsAgo);
}
function renderFakeOrders(c){ if(fakeOrdersList.length===0){ c.innerHTML='<div class="empty-state" style="padding:24px"><i class="fas fa-inbox" style="font-size:30px"></i><p style="font-size:11.5px">Loading...</p></div>'; return; } c.innerHTML=fakeOrdersList.slice(0,25).map(o=>fakeOrderRowHTML(o)).join(''); }
function renderSupportBubbles(){ const box=$('support-bubbles'); if(!box) return; const items = Array.isArray(supportItems) ? supportItems.filter(s=>s && s.name && s.link) : []; if(items.length === 0){ box.innerHTML=''; return; } const frag=document.createDocumentFragment(); items.forEach(s=>{ const a=document.createElement('a'); a.href=s.link; a.target='_blank'; a.rel='noopener'; a.className='bubble-wrap support-bubble'; a.innerHTML='<span class="s-label">'+s.name+' <i class="fas fa-arrow-up" style="font-size:9px;opacity:.5"></i></span><div class="s-icon"><img src="'+(s.logo||'')+'" onerror="this.src=\'https://placehold.co/64?text=?\'"></div>'; frag.appendChild(a); }); box.innerHTML=''; box.appendChild(frag); }

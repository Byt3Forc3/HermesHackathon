(function(){"use strict";function Q(){const e=document.createElement("style");e.id="simplify-style",e.textContent=`
        footer, nav { display: none !important; }   /* Hide the footer and navigation bar */

        /* Link styling */
        a, a:visited {
            color: #1565C0 !important;
            font-weight: bold;
            text-decoration: underline !important;
            background-color: unset !important;
        }
        a:hover, a:focus {
            color: #0D47A1 !important;
            background-color: rgba(187, 222, 251, 0.3) !important;
            transition: background-color 0.25s, color 0.25s;
        }

        /* Paragraph focus system: the focused paragraph is fully visible, others are faded */
        p.adhd-focus { opacity: 1 !important; color: #111 !important; }
        p:not(.adhd-focus) {
            opacity: 0.4 !important;
            color: transparent !important;
            text-shadow: 0 0 8px #aaa !important;
            transition: opacity 0.25s, color 0.25s;
        }

        /* Make images fully visible and remove filters/shadows */
        figure, figure *, img { opacity: 1 !important; filter: none !important; text-shadow: none !important; }

        body { background: unset !important; }

        /* Table of Contents container */
        #adhd-summary {
            border: 1px solid #ccc;
            padding: 16px;
            margin-bottom: 24px;
            background: unset;
            font-family: sans-serif;
            border-radius: 8px;
            max-width: 600px;
        }
        #adhd-summary h2 { margin-top: 0; font-size: 1.4em; color: #1565C0; }
        #adhd-summary table { width: 100%; border-collapse: collapse; }
        #adhd-summary tr { border-bottom: 1px solid #ddd; transition: background 0.2s; }
        #adhd-summary tr:hover { background: rgba(21, 101, 192, 0.05); }
        #adhd-summary td {
            padding: 6px 12px;
            vertical-align: middle;
            font-size: 0.95em;
            color: unset;
        }
        /* Indent headers according to level */
        #adhd-summary td[data-level="1"] { padding-left: 0px; font-weight: bold; }
        #adhd-summary td[data-level="2"] { padding-left: 16px; font-weight: 600; }
        #adhd-summary td[data-level="3"] { padding-left: 32px; font-weight: 500; }
        #adhd-summary td[data-level="4"] { padding-left: 48px; font-weight: 500; font-style: italic; }
    `,document.head.appendChild(e);const t=document.createElement("div");t.id="adhd-summary";const n=document.createElement("h2");n.innerText="Summary",t.appendChild(n);const i=document.createElement("table");Array.from(document.querySelectorAll("h1, h2, h3, h4")).forEach(u=>{const s=document.createElement("tr"),m=document.createElement("td"),p=parseInt(u.tagName.substring(1));m.dataset.level=p;const a=u.innerText,l=a.indexOf(".")>0?a.split(". "):[a];m.innerHTML=l.map(E=>`• ${E}`).join("<br>"),s.appendChild(m),i.appendChild(s)}),t.appendChild(i);const r=document.body.firstElementChild;document.body.insertBefore(t,r);const d=Array.from(document.querySelectorAll("p"));if(d.length){let s=function(l){d.forEach((E,c)=>E.classList.toggle("adhd-focus",c===l)),d[l].scrollIntoView({behavior:"smooth",block:"center"})},m=function(){u<d.length-1&&(u++,s(u))},p=function(){u>0&&(u--,s(u))},u=0;s(u),window.addEventListener("keydown",l=>{(l.key==="ArrowDown"||l.key==="PageDown")&&(m(),l.preventDefault()),(l.key==="ArrowUp"||l.key==="PageUp")&&(p(),l.preventDefault())});let a=0;window.addEventListener("wheel",l=>{const E=Date.now();E-a<300||(l.deltaY>0?m():p(),a=E)},{passive:!1})}function f(u){return new Promise(s=>{const m=document.createElement("canvas"),p=m.getContext("2d"),a=new Image;a.crossOrigin="anonymous",a.src=u.src,a.onload=()=>{m.width=a.width,m.height=a.height;try{p.drawImage(a,0,0),s(m.toDataURL("image/png"))}catch{s(null)}},a.onerror=()=>s(null)})}function h(u){var m,p,a;if(u.dataset.gif)return u.dataset.gif;if((m=u.dataset.src)!=null&&m.endsWith(".gif"))return u.dataset.src;if((p=u.dataset.original)!=null&&p.endsWith(".gif"))return u.dataset.original;if((a=u.dataset.preview)!=null&&a.endsWith(".gif"))return u.dataset.preview;if(u.src.includes("giphy.com/media")&&u.src.includes("_s."))return u.src.replace("_s.",".");const s=u.closest("picture");if(s){const l=s.querySelector("source[srcset*='.gif'], source[type='image/gif']");if(l)return l.srcset.split(" ")[0]}return u.src}async function g(u){if(u.dataset.gifReplaced==="true")return;u.dataset.gifReplaced="true";const s=h(u),m=await f(u),p=document.createElement("div");p.style.position="relative",p.style.display="inline-block",p.style.cursor="pointer",p.dataset.epilepsyWrapper="true";const a=document.createElement("img");a.src=m||u.src,a.style.width=u.width+"px",a.style.pointerEvents="none";const l=document.createElement("div");l.innerText="⚠ GIF – Hover pentru a porni",l.style.position="absolute",l.style.top="0",l.style.left="0",l.style.width="100%",l.style.height="100%",l.style.background="rgba(0,0,0,0.55)",l.style.color="white",l.style.display="flex",l.style.alignItems="center",l.style.justifyContent="center",l.style.fontSize="14px",l.style.textAlign="center",l.style.pointerEvents="none",p.appendChild(a),p.appendChild(l),u.replaceWith(p);let E=!1;p.addEventListener("mouseenter",()=>{E||(a.src=s,l.style.background="rgba(0,0,0,0.35)",l.innerText="✋ GIF activ",E=!0)}),p.addEventListener("mouseleave",()=>{E&&(a.src=m,l.style.background="rgba(0,0,0,0.55)",l.innerText="⚠ GIF – Hover pentru a porni",E=!1)}),p.addEventListener("click",c=>c.preventDefault())}function y(){var s,m,p;const u=Array.from(document.querySelectorAll("img"));for(const a of u){if(a.closest("[data-epilepsy-wrapper]")||a.dataset.gifReplaced==="true")continue;const l=((s=a.src)==null?void 0:s.toLowerCase())||"";(l.endsWith(".gif")||a.dataset.gif||((m=a.dataset.src)==null?void 0:m.endsWith(".gif"))||((p=a.dataset.original)==null?void 0:p.endsWith(".gif"))||l.includes("giphy.com/media"))&&g(a)}}function b(){y(),new MutationObserver(()=>y()).observe(document.body,{childList:!0,subtree:!0})}b()}const ee=Object.freeze(Object.defineProperty({__proto__:null,apply:Q},Symbol.toStringTag,{value:"Module"}));function te(e){globalThis.__HERMES_PLATFORM__=e}function k(){const e=globalThis.__HERMES_PLATFORM__;if(!e)throw new Error("HermesPlatform not initialized");return e}function ne(e){const{siteId:t,apiBase:n}=e,i=typeof e.getPublishableKey=="function"?e.getPublishableKey:()=>"",o=n.replace(/\/$/,""),r=`hermes:${t}:`;return{kind:"embed",siteId:t,apiBase:o,resolveAsset(d){const f=globalThis.__HERMES_CDN_BASE__||globalThis.__HERMES_EMBED_BASE__||"",h=d.replace(/^\//,"");if(!f)return new URL(h,location.origin).href;const g=f.endsWith("/")?f:`${f}/`;return new URL(h,g).href},storage:{local:{get(d,f){const h=oe(d),g={};for(const y of h){const b=localStorage.getItem(r+y);if(b!==null)try{g[y]=JSON.parse(b)}catch{g[y]=b}}f(g)},set(d,f){for(const[h,g]of Object.entries(d))localStorage.setItem(r+h,typeof g=="string"?g:JSON.stringify(g));f&&f()}},sync:{get(d,f){return this.local.get(d,f)},set(d,f){return this.local.set(d,f)}}},async requestAI({action:d,text:f}){const h=i(),g=await fetch(`${o}/v1/ai`,{method:"POST",headers:{"Content-Type":"application/json",...h?{Authorization:`Bearer ${h}`}:{}},body:JSON.stringify({action:d,text:f})}),y=await g.json().catch(()=>({}));if(!g.ok)throw new Error(y.error||g.statusText||"AI request failed");if(y.success===!1)throw new Error(y.error||"AI request failed");return y.result}}}function oe(e){return e==null?[]:typeof e=="string"?[e]:Array.isArray(e)?e:Object.keys(e)}function ie(){console.log("Autism module activated: applying color-reduction styles");const e="autism-color-reduction-style";function t(){document.documentElement.classList.add("autism-hide-extras")}function n(){document.documentElement.classList.remove("autism-hide-extras")}function i(){document.documentElement.classList.toggle("autism-hide-extras")}function o(){document.documentElement.classList.add("autism-vertical-layout")}function r(){document.documentElement.classList.remove("autism-vertical-layout")}function d(){document.documentElement.classList.toggle("autism-vertical-layout")}function f(c){if(!c)return[];const v=c.match(/[^.!?\n]+[.!?\n]*/g);return v?v.map(w=>w.trim()).filter(Boolean):[c.trim()]}function h(c,v){return c.split(/\s+/).slice(0,v).join(" ").trim()}function g(c){const v=f(c);if(v.length>0){const w=v[0];if(w.length>=40||v.length===1)return w.length>220?h(w,30)+"…":w;if(v.length>1){const x=(v[0]+" "+v[1]).trim();return x.length>220?h(x,30)+"…":x}}return h(c,25)+(c.split(/\s+/).length>25?"…":"")}function y(){const c="main, article, #content, .article";let v=[];const w=document.querySelectorAll(c);w&&w.length?w.forEach(x=>v.push(...Array.from(x.querySelectorAll("p")))):v=Array.from(document.querySelectorAll("p")).slice(0,200),v.forEach(x=>{if(!(x instanceof HTMLElement)||x.closest&&x.closest("header, footer, nav, aside, form"))return;const _=(x.textContent||"").trim();if(!_||_.length<40||(x.dataset.autismSummaryHandler||(x.dataset.autismSummaryHandler="1",x.addEventListener("click",function(R){if(!document.documentElement.classList.contains("autism-paragraph-summaries-enabled")||x.dataset.autismSummary==="1"||R&&R.target&&R.target!==x)return;const Z=g(_);Z&&b(x,Z)})),x.dataset.autismSummary==="1"))return;const F=g(_);F&&b(x,F)})}function b(c,v){const w=c.style.position||"";getComputedStyle(c).position==="static"&&(c.style.position="relative",c.dataset.autismOriginalPosition=w);const x=document.createElement("div");x.className="autism-paragraph-summary-box",x.setAttribute("role","note"),x.setAttribute("tabindex","0"),x.setAttribute("title","Click or press Enter to reveal full paragraph"),x.textContent=v,x.addEventListener("click",function(_){_&&_.stopPropagation&&_.stopPropagation();try{x.remove(),c.dataset.autismOriginalPosition!==void 0&&(c.style.position=c.dataset.autismOriginalPosition||"",delete c.dataset.autismOriginalPosition),delete c.dataset.autismSummary}catch{}}),x.addEventListener("keydown",function(_){(_.key==="Enter"||_.key===" ")&&(_.preventDefault(),this.click())}),c.dataset.autismSummary="1",c.insertBefore(x,c.firstChild)}function u(){Array.from(document.querySelectorAll(".autism-paragraph-summary-box")).forEach(v=>{const w=v.closest("p");if(!w){v.remove();return}v.remove(),w.dataset.autismOriginalPosition!==void 0&&(w.style.position=w.dataset.autismOriginalPosition||"",delete w.dataset.autismOriginalPosition),delete w.dataset.autismSummary})}function s(){document.documentElement.classList.add("autism-paragraph-summaries-enabled"),y()}function m(){document.documentElement.classList.remove("autism-paragraph-summaries-enabled"),u()}function p(){document.documentElement.classList.contains("autism-paragraph-summaries-enabled")?m():s()}function a(){if(document.getElementById(e))return;const c=document.createElement("link");c.id=e,c.rel="stylesheet",c.href=k().resolveAsset("affections/autism/styles.css"),document.head.appendChild(c),document.documentElement.classList.add("autism-color-reduced"),t(),o(),s()}function l(){const c=document.getElementById(e);c&&c.remove(),document.documentElement.classList.remove("autism-color-reduced"),n(),r(),m()}function E(){document.getElementById(e)?l():a()}try{window.__autismAccessibility=window.__autismAccessibility||{},window.__autismAccessibility.enable=a,window.__autismAccessibility.disable=l,window.__autismAccessibility.toggle=E,window.__autismAccessibility.enabled=()=>!!document.getElementById(e),window.__autismAccessibility.enableHideExtras=t,window.__autismAccessibility.disableHideExtras=n,window.__autismAccessibility.toggleHideExtras=i,window.__autismAccessibility.hideExtrasEnabled=()=>document.documentElement.classList.contains("autism-hide-extras"),window.__autismAccessibility.enableVerticalLayout=o,window.__autismAccessibility.disableVerticalLayout=r,window.__autismAccessibility.toggleVerticalLayout=d,window.__autismAccessibility.verticalLayoutEnabled=()=>document.documentElement.classList.contains("autism-vertical-layout"),window.__autismAccessibility.enableParagraphSummaries=s,window.__autismAccessibility.disableParagraphSummaries=m,window.__autismAccessibility.toggleParagraphSummaries=p,window.__autismAccessibility.paragraphSummariesEnabled=()=>document.documentElement.classList.contains("autism-paragraph-summaries-enabled")}catch{}a()}const se=Object.freeze(Object.defineProperty({__proto__:null,apply:ie},Symbol.toStringTag,{value:"Module"}));function re(){console.log("Base accessibility module activated"),fetch(k().resolveAsset("affections/base/styles.css")).then(e=>e.text()).then(e=>{const t=document.createElement("style");t.textContent=e,document.head.appendChild(t)})}const ae=Object.freeze(Object.defineProperty({__proto__:null,apply:re},Symbol.toStringTag,{value:"Module"}));let M=!1,T=null;document.getElementById("color-blindness-filters")||document.body.insertAdjacentHTML("beforeend",`<svg xmlns="http://www.w3.org/2000/svg" style="display:none;" id="color-blindness-filters">
  <filter id="protanopia-filter">
    <feColorMatrix type="matrix" values="0.567,0.433,0,0,0
                                         0.558,0.442,0,0,0
                                         0,0.242,0.758,0,0
                                         0,0,0,1,0"/>
  </filter>
  <filter id="deuteranopia-filter">
    <feColorMatrix type="matrix" values="0.625,0.375,0,0,0
                                         0.7,0.3,0,0,0
                                         0,0.3,0.7,0,0
                                         0,0,0,1,0"/>
  </filter>
  <filter id="tritanopia-filter">
    <feColorMatrix type="matrix" values="0.95,0.05,0,0,0
                                         0,0.433,0.567,0,0
                                         0,0.475,0.525,0,0
                                         0,0,0,1,0"/>
  </filter>
  <filter id="none-filter">
    <feColorMatrix type="matrix" values="1,0,0,0,0
                                         0,1,0,0,0
                                         0,0,1,0,0
                                         0,0,0,1,0"/>
  </filter>
</svg>`);function q(){!M||!T||(j(T),new MutationObserver(()=>{M&&j(T)}).observe(document.body,{childList:!0,subtree:!0}))}function j(e){let t="none-filter";e==="protanopia"&&(t="protanopia-filter"),e==="deuteranopia"&&(t="deuteranopia-filter"),e==="tritanopia"&&(t="tritanopia-filter"),document.documentElement.style.filter=`url(#${t})`}function le(){T=null,document.documentElement.style.filter="none"}function ce(){if(document.getElementById("colorblind-menu"))return;const e=document.createElement("div");e.id="colorblind-menu",e.style=`
        position: fixed;
        bottom: 80px;
        right: 20px;
        padding: 14px;
        background: rgba(30,30,30,0.85);
        border-radius: 10px;
        color: white;
        font-family: sans-serif;
        width: 180px;
        display: none;
        z-index: 999999999999;
    `,e.innerHTML=`
        <div style="font-size:14px; margin-bottom:8px; font-weight:bold;">
            Color Blindness Mode
        </div>

        <button data-type="protanopia" class="cb-btn">Protanopia</button>
        <button data-type="deuteranopia" class="cb-btn">Deuteranopia</button>
        <button data-type="tritanopia" class="cb-btn">Tritanopia</button>
    `,document.body.appendChild(e),document.querySelectorAll(".cb-btn").forEach(t=>{t.style=`
            width: 100%;
            padding: 8px;
            margin-bottom: 6px;
            background: #555;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
        `,t.addEventListener("click",()=>{T=t.dataset.type,q()})})}function de(){if(document.getElementById("colorblind-toggle"))return;const e=document.createElement("button");e.id="colorblind-toggle",e.innerText="Color Blind: OFF",e.style=`
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 10px 14px;
        border-radius: 8px;
        border: none;
        font-size: 14px;
        background: #444;
        color: white;
        z-index: 999999999999;
        cursor: pointer;
    `,document.body.appendChild(e),e.addEventListener("click",()=>{M=!M;const t=document.getElementById("colorblind-menu");M?(e.innerText="Color Blind: ON",e.style.background="#2a8f2a",t.style.display="block",T&&q()):(e.innerText="Color Blind: OFF",e.style.background="#444",t.style.display="none",le())})}function ue(){de(),ce()}const pe=Object.freeze(Object.defineProperty({__proto__:null,apply:ue},Symbol.toStringTag,{value:"Module"}));let B=!1,O=0;const D=["rgba(197, 184, 149, 0.7)"],me=["ON"];function fe(){const e=document.getElementById("dyslexia-calming-filter"),t=document.getElementById("dyslexia-toggle-btn");!e||!t||(B?(e.style.display="block",e.style.backgroundColor=D[O],t.innerText=`Filter: ${me[O]}`,t.style.background="#2a8f2a"):(e.style.display="none",t.innerText="Filter: OFF",t.style.background="#444"))}function ye(){if(document.getElementById("dyslexia-calming-filter"))return;const e=document.createElement("div");e.id="dyslexia-calming-filter",e.style.cssText=`
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        pointer-events: none !important;
        z-index: 2147483647 !important;
        mix-blend-mode: multiply !important;
        display: none;
    `,document.documentElement.appendChild(e)}function he(){if(document.getElementById("dyslexia-toggle-btn"))return;const e=document.createElement("button");e.id="dyslexia-toggle-btn",e.innerText="Dyslexia Filter: OFF",e.style.cssText=`
        position: fixed !important;
        bottom: 20px !important;
        right: 20px !important;
        padding: 10px 14px !important;
        border-radius: 8px !important;
        border: none !important;
        background: #444 !important;
        color: white !important;
        cursor: pointer !important;
        z-index: 2147483647 !important;
        font-family: sans-serif !important;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3) !important;
    `,document.documentElement.appendChild(e),e.addEventListener("click",()=>{B?(O++,O>=D.length&&(B=!1)):(B=!0,O=0),fe()})}function ge(){document.querySelectorAll("html.dyslexia-mode p").forEach(t=>{if(t.dataset.splitProcessed==="true"||t.innerText.length<250)return;const i=t.innerText.match(/[^.!?]+[.!?]+/g);if(i&&i.length>3){t.innerHTML="",t.dataset.splitProcessed="true";for(let o=0;o<i.length;o+=2){const r=i.slice(o,o+2).join(" "),d=document.createElement("span");d.innerText=r,d.style.display="block",d.style.marginBottom="1.8em",t.appendChild(d)}}})}let P=!1;function be(){let e=document.getElementById("dyslexia-sentence-focus-btn");e||(e=document.createElement("button"),e.id="dyslexia-sentence-focus-btn",e.innerText="🔍 Focus",e.style.cssText=`
            position: absolute;
            display: none;
            z-index: 2147483647;
            padding: 6px 12px;
            background: #001f41;
            color: white;
            border: 2px solid #ffe877;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            pointer-events: auto;
        `,document.documentElement.appendChild(e)),document.addEventListener("mouseup",()=>{if(P)return;const t=window.getSelection();if(t.toString().trim().length>0){const o=t.getRangeAt(0).getBoundingClientRect();e.style.top=`${window.scrollY+o.top-45}px`,e.style.left=`${window.scrollX+o.left}px`,e.style.display="block"}else e.style.display="none"}),e.addEventListener("click",t=>{if(t.stopPropagation(),P)return;const n=window.getSelection();if(!n.rangeCount)return;P=!0,e.style.display="none";const i=n.getRangeAt(0),o=[];let r=i.startContainer.parentElement.closest("p, li, h1, h2, h3, blockquote"),d=i.endContainer.parentElement.closest("p, li, h1, h2, h3, blockquote");if(!r||!d){P=!1;return}let f=r;for(;f&&f!==d.nextElementSibling;)f.matches("p, li, h1, h2, h3, blockquote")&&o.push(f),f=f.nextElementSibling;const h=[];o.forEach(y=>{const b=document.createRange();y===r&&y===d?(b.setStart(i.startContainer,i.startOffset),b.setEnd(i.endContainer,i.endOffset)):y===r?(b.setStart(i.startContainer,i.startOffset),b.setEndAfter(y.lastChild)):y===d?(b.setStartBefore(y.firstChild),b.setEnd(i.endContainer,i.endOffset)):b.selectNodeContents(y);const u=document.createElement("span");u.className="dyslexia-focused-text";try{u.appendChild(b.extractContents()),b.insertNode(u),h.push({span:u,container:y});const s=document.createTreeWalker(y,NodeFilter.SHOW_TEXT,null,!1);let m;const p=[];for(;m=s.nextNode();)!m.textContent.trim()||u.contains(m)||p.push(m);p.forEach(a=>{const l=document.createElement("span");l.className="dyslexia-blurred-text",a.parentNode&&(a.parentNode.insertBefore(l,a),l.appendChild(a))})}catch(s){console.error("Eroare la procesarea containerului:",s)}}),n.removeAllRanges();const g=()=>{o.forEach(y=>{y.querySelectorAll(".dyslexia-blurred-text").forEach(s=>{for(;s.firstChild;)s.parentNode.insertBefore(s.firstChild,s);s.remove()}),y.querySelectorAll(".dyslexia-focused-text").forEach(s=>{for(;s.firstChild;)s.parentNode.insertBefore(s.firstChild,s);s.remove()}),y.normalize()}),P=!1,document.removeEventListener("click",g)};setTimeout(()=>document.addEventListener("click",g),200)})}function xe(){document.documentElement.classList.add("dyslexia-mode");const e=k().resolveAsset("affections/dyslexia/OpenDyslexicFonts/OpenDyslexic-Regular.otf");if(!document.getElementById("dyslexia-dynamic-style")){const t=document.createElement("style");t.id="dyslexia-dynamic-style",t.textContent=`

            @font-face {
                font-family: 'OpenDyslexic';
                src: url('${e}') format('opentype');
            }
            @import url('https://fonts.googleapis.com/css2?family=Lexend&display=swap');



            html.dyslexia-mode body,
            html.dyslexia-mode p,
            html.dyslexia-mode span,
            html.dyslexia-mode li,
            html.dyslexia-mode h1, html.dyslexia-mode h2, html.dyslexia-mode h3,
            html.dyslexia-mode div {
                font-family: 'OpenDyslexic', 'Lexend', sans-serif !important;
                font-size: 18px !important;
                word-spacing: 0.3em !important;
                line-height: 1.9 !important;
                /* color: #000000 !important; */
            }

            html.dyslexia-mode a {
                /* color: #002247 !important; */
                text-decoration: none !important;
                font-weight: bold !important;
                font-family: 'OpenDyslexic', 'Lexend', sans-serif !important;
            }


            /* Focus system styles */
            .dyslexia-blurred-text {
                filter: blur(4px) opacity(0.5);
                transition: filter 0.3s ease;
            }

            .dyslexia-focused-text {
                background: rgba(255, 232, 119, 0.19);
                padding: 2px 0;
                border-radius: 3px;
            }
        `,document.head.appendChild(t)}ye(),he(),ge(),be()}const ve=Object.freeze(Object.defineProperty({__proto__:null,apply:xe},Symbol.toStringTag,{value:"Module"}));function Ee(e){return new Promise(t=>{const n=document.createElement("canvas"),i=n.getContext("2d"),o=new Image;o.crossOrigin="anonymous",o.src=e.src,o.onload=()=>{n.width=o.width,n.height=o.height;try{i.drawImage(o,0,0),t(n.toDataURL("image/png"))}catch{t(null)}},o.onerror=()=>t(null)})}function we(e){var n,i,o;if(e.dataset.gif)return e.dataset.gif;if((n=e.dataset.src)!=null&&n.endsWith(".gif"))return e.dataset.src;if((i=e.dataset.original)!=null&&i.endsWith(".gif"))return e.dataset.original;if((o=e.dataset.preview)!=null&&o.endsWith(".gif"))return e.dataset.preview;if(e.src.includes("giphy.com/media")&&e.src.includes("_s."))return e.src.replace("_s.",".");const t=e.closest("picture");if(t){const r=t.querySelector("source[srcset*='.gif'], source[type='image/gif']");if(r)return r.srcset.split(" ")[0]}return e.src}async function Se(e){if(e.dataset.gifReplaced==="true")return;e.dataset.gifReplaced="true";const t=we(e),n=await Ee(e),i=document.createElement("div");i.style.position="relative",i.style.display="inline-block",i.style.cursor="pointer",i.dataset.epilepsyWrapper="true";const o=document.createElement("img");o.src=n||e.src,o.style.width=e.width+"px",o.style.pointerEvents="none";const r=document.createElement("div");r.innerText="⚠ GIF – Hover pentru a porni",r.style.position="absolute",r.style.top="0",r.style.left="0",r.style.width="100%",r.style.height="100%",r.style.background="rgba(0,0,0,0.55)",r.style.color="white",r.style.display="flex",r.style.alignItems="center",r.style.justifyContent="center",r.style.fontSize="14px",r.style.textAlign="center",r.style.pointerEvents="none",i.appendChild(o),i.appendChild(r),e.replaceWith(i);let d=!1;i.addEventListener("mouseenter",()=>{d||(o.src=t,r.innerText="✋ GIF activ",r.style.background="rgba(0,0,0,0.35)",d=!0)}),i.addEventListener("mouseleave",()=>{d&&(o.src=n,r.innerText="⚠ GIF – Hover pentru a porni",r.style.background="rgba(0,0,0,0.55)",d=!1)}),i.addEventListener("click",f=>f.preventDefault())}function N(){var t,n,i;const e=Array.from(document.querySelectorAll("img"));for(const o of e){if(o.closest("[data-epilepsy-wrapper]")||o.dataset.gifReplaced==="true")continue;const r=((t=o.src)==null?void 0:t.toLowerCase())||"";(r.endsWith(".gif")||o.dataset.gif||((n=o.dataset.src)==null?void 0:n.endsWith(".gif"))||((i=o.dataset.original)==null?void 0:i.endsWith(".gif"))||r.includes("giphy.com/media"))&&Se(o)}}function _e(){N(),new MutationObserver(()=>N()).observe(document.body,{childList:!0,subtree:!0})}function Ce(e="⚠ VIDEO – Click pentru a porni"){const t=document.createElement("div");return t.innerText=e,t.style.position="absolute",t.style.top="0",t.style.left="0",t.style.width="100%",t.style.height="100%",t.style.background="rgba(0,0,0,0.55)",t.style.color="white",t.style.display="flex",t.style.alignItems="center",t.style.justifyContent="center",t.style.fontSize="16px",t.style.fontFamily="sans-serif",t.style.textAlign="center",t.style.zIndex="99999",t.style.cursor="pointer",t}function ke(e){if(e.dataset.epilepsyWrapped==="true")return;e.dataset.epilepsyWrapped="true";const t=document.createElement("div");t.style.position="relative",t.style.display="inline-block",t.style.width=e.clientWidth+"px",t.style.cursor="pointer";const n=Ce();e.parentNode.insertBefore(t,e),t.appendChild(e),t.appendChild(n),e.autoplay=!1,e.pause(),e.muted=!1;let i=!1;n.addEventListener("click",()=>{i=!0,e.play(),n.style.display="none"}),e.addEventListener("click",()=>{i&&(e.pause(),i=!1,n.innerText="✋ VIDEO – Click pentru a porni din nou",n.style.display="flex")}),e.addEventListener("ended",()=>{i=!1,n.innerText="⚠ VIDEO – Click pentru a porni",n.style.display="flex"})}function $(){document.querySelectorAll("video").forEach(ke)}function Ae(){$(),new MutationObserver(()=>{$()}).observe(document.body,{childList:!0,subtree:!0})}function H(){const e=[[300,250],[728,90],[160,600],[468,60],[970,250],[300,600],[250,250],[320,50],[336,280],[180,150],[234,60]];document.querySelectorAll("div, section, aside, iframe").forEach(t=>{const n=t.getBoundingClientRect();e.forEach(([i,o])=>{Math.abs(n.width-i)<5&&Math.abs(n.height-o)<5&&t.remove()})}),document.querySelectorAll("div, aside, section").forEach(t=>{const n=window.getComputedStyle(t),i=n.position==="fixed"||n.position==="sticky",o=(parseInt(n.top)<50||parseInt(n.bottom)<50)&&(parseInt(n.left)<50||parseInt(n.right)<50);i&&o&&t.remove()}),document.querySelectorAll("video").forEach(t=>{(t.autoplay||t.hasAttribute("autoplay"))&&(t.closest("div, section, aside")||t).remove()}),document.querySelectorAll("iframe").forEach(t=>{var o;const n=((o=t.src)==null?void 0:o.toLowerCase())||"";["doubleclick","googlesyndication","adnxs","outbrain","taboola","teads","revcontent","zemanta","opendsp"].some(r=>n.includes(r))&&t.remove()}),document.querySelectorAll("div, p, span").forEach(t=>{t.innerText.trim().toLowerCase()==="advertisement"&&(t.closest("div, section, aside")||t).remove()})}function Le(){H(),new MutationObserver(()=>H()).observe(document.body,{childList:!0,subtree:!0})}function z(){document.querySelectorAll("video").forEach(e=>{const t=getComputedStyle(e),n=t.position==="fixed"||t.position==="sticky"||e.closest("[style*='position:fixed']")||e.closest("[style*='position: sticky']"),i=e.autoplay||e.hasAttribute("autoplay")||e.getAttribute("muted")==="muted";if(n||i){const o=e.closest("div");o?o.remove():e.remove()}}),document.querySelectorAll("div").forEach(e=>{const t=getComputedStyle(e),n=t.position==="fixed"||t.position==="sticky",i=e.innerText.trim()==="×"||e.querySelector("button")||e.querySelector("[role='button']");n&&i&&e.remove()}),document.querySelectorAll("iframe").forEach(e=>{var n;const t=((n=e.src)==null?void 0:n.toLowerCase())??"";(t.includes("doubleclick")||t.includes("googlesyndication")||t.includes("adnxs")||t.includes("outbrain")||t.includes("taboola")||t.includes("teads"))&&e.remove()})}function Te(){z(),new MutationObserver(()=>z()).observe(document.body,{subtree:!0,childList:!0})}function Me(){const e=document.createElement("style");e.textContent=`
        * {
            animation: none !important;
            animation-duration: 0s !important;
            animation-iteration-count: 1 !important;
            transition: none !important;
            scroll-behavior: auto !important;
        }
    `,document.documentElement.appendChild(e);const t=new CSSStyleSheet;t.replaceSync(`
        * {
            animation: none !important;
            transition: none !important;
        }
    `),document.adoptedStyleSheets=[...document.adoptedStyleSheets,t];function n(i){try{i.style.setProperty("animation","none","important"),i.style.setProperty("transition","none","important"),i.style.setProperty("scroll-behavior","auto","important")}catch{}}document.querySelectorAll("*").forEach(n),new MutationObserver(i=>{for(const o of i)o.addedNodes&&o.addedNodes.forEach(r=>{var d;r.nodeType===1&&(n(r),(d=r.querySelectorAll)==null||d.call(r,"*").forEach(n))})}).observe(document.documentElement,{childList:!0,subtree:!0})}let I=!1;function W(){I&&(V(),G(),Oe(),new MutationObserver(()=>{I&&(V(),G())}).observe(document.body,{subtree:!0,childList:!0,attributes:!0}))}function V(){const e=[["#ffffff","#fdfdfb"],["rgb(255, 255, 255)","rgb(253,253,251)"],["#000000","#222222"],["rgb(0, 0, 0)","rgb(34,34,34)"]];document.querySelectorAll("*").forEach(t=>{const n=getComputedStyle(t);e.forEach(([i,o])=>{n.backgroundColor.toLowerCase()===i&&(t.style.backgroundColor=o),n.color.toLowerCase()===i&&(t.style.color=o)})})}function G(){const e=/(rgb|hsl)a?\(([^)]+)\)/;document.querySelectorAll("*").forEach(t=>{const n=getComputedStyle(t);["color","backgroundColor","borderColor"].forEach(i=>{const o=n[i];if(!o||!e.test(o))return;let r=o.match(/\d+/g);if(!r)return;let[d,f,h]=r.map(Number);if(d>240||f>240||h>240){const y=`rgb(${d*.7}, ${f*.7}, ${h*.7})`;t.style[i]=y}})})}function Oe(){if(document.getElementById("epilepsy-light-filter"))return;const e=document.createElement("div");e.id="epilepsy-light-filter",e.style.position="fixed",e.style.top="0",e.style.left="0",e.style.width="100vw",e.style.height="100vh",e.style.pointerEvents="none",e.style.zIndex="999999999",e.style.backdropFilter="brightness(0.98) saturate(0.95)",e.style.background="rgba(255,255,240,0.015)",document.body.appendChild(e)}function Pe(){const e=document.getElementById("epilepsy-light-filter");e&&e.remove(),document.querySelectorAll("*").forEach(t=>{t.style.backgroundColor="",t.style.color="",t.style.borderColor=""})}function Ie(){if(document.getElementById("color-safety-toggle"))return;const e=document.createElement("button");e.id="color-safety-toggle",e.innerText="Color Safe: OFF",e.style.position="fixed",e.style.bottom="20px",e.style.right="20px",e.style.padding="10px 14px",e.style.borderRadius="8px",e.style.border="none",e.style.fontSize="14px",e.style.color="#fff",e.style.background="#444",e.style.zIndex="9999999999999",e.style.cursor="pointer",e.style.boxShadow="0 2px 6px rgba(0,0,0,0.2)",document.body.appendChild(e),e.addEventListener("click",()=>{I=!I,I?(e.innerText="Color Safe: ON",e.style.background="#2a8f2a",W()):(e.innerText="Color Safe: OFF",e.style.background="#444",Pe())})}function Be(){_e(),Ae(),Te(),Le(),Me(),W(),Ie()}const Fe=Object.freeze(Object.defineProperty({__proto__:null,apply:Be},Symbol.toStringTag,{value:"Module"}));let A=!1,L=null,S=null,C=null;function Re(){A&&(qe(),je())}function qe(){L||(L=document.createElement("div"),L.id="pv-mask",Object.assign(L.style,{position:"fixed",inset:"0",background:"rgba(0,0,0,0.88)",zIndex:"999999998",pointerEvents:"none"}),document.body.appendChild(L))}function je(){let e=0,t=0,n=0,i=0;document.addEventListener("mousedown",o=>{A&&(e=o.clientX,t=o.clientY,S&&S.remove(),C&&C.remove(),De())}),document.addEventListener("mousemove",o=>{if(!A||!S)return;n=o.clientX,i=o.clientY;const r=Math.min(e,n),d=Math.min(t,i),f=Math.abs(e-n),h=Math.abs(t-i);Ne(r,d,f,h)}),document.addEventListener("mouseup",()=>{if(!A||!S)return;const o=S.getBoundingClientRect();$e(o),S.remove(),S=null})}function De(){S=document.createElement("div"),S.id="pv-selection",Object.assign(S.style,{position:"fixed",border:"2px solid #00ffcc",background:"transparent",zIndex:"999999999",pointerEvents:"none",borderRadius:"12px"}),document.body.appendChild(S)}function Ne(e,t,n,i){S.style.left=e+"px",S.style.top=t+"px",S.style.width=n+"px",S.style.height=i+"px"}function $e(e){C=document.createElement("div"),C.id="pv-iframe-container",Object.assign(C.style,{position:"fixed",left:e.left+"px",top:e.top+"px",width:e.width+"px",height:e.height+"px",overflow:"hidden",zIndex:"999999999",borderRadius:"12px"});const t=document.createElement("iframe");t.src=window.location.href,Object.assign(t.style,{width:"100%",height:"100%",border:"none",background:"white"}),C.appendChild(t),document.body.appendChild(C)}function He(){A=!1,L&&L.remove(),S&&S.remove(),C&&C.remove(),L=null,S=null,C=null}function ze(){if(document.getElementById("partialvision-toggle"))return;const e=document.createElement("button");e.id="partialvision-toggle",e.innerText="Partial Vision: OFF",Object.assign(e.style,{position:"fixed",bottom:"60px",right:"20px",padding:"10px 15px",background:"#333",color:"white",border:"none",borderRadius:"8px",zIndex:"999999999999",cursor:"pointer"}),document.body.appendChild(e),e.addEventListener("click",()=>{A=!A,A?(e.innerText="Partial Vision: ON",e.style.background="#008c8c",Re()):(e.innerText="Partial Vision: OFF",e.style.background="#333",He())})}function We(){ze(),console.log("Partial Vision (Iframe Mode) loaded.")}const Ve=Object.freeze(Object.defineProperty({__proto__:null,apply:We},Symbol.toStringTag,{value:"Module"}));function Ge(){console.log("Reader Mode activated"),document.readyState==="complete"?U():window.addEventListener("load",U)}function U(){console.log("Extracting clean text...");const e=Ue(),t=Ke(e.innerHTML);document.body.innerHTML="";const n=document.createElement("div");n.id="reader-container",n.innerHTML=t,document.body.appendChild(n),Xe()}function Ue(){const e=["#mw-content-text","#content","#main","article","[role='main']",".content",".main"];for(const t of e){const n=document.querySelector(t);if(n)return n.cloneNode(!0)}return document.body.cloneNode(!0)}function Ke(e){let t=document.createElement("div");return t.innerHTML=e,t.querySelectorAll("img, table, figure, nav, footer, aside, header, form").forEach(n=>n.remove()),t.querySelectorAll("a").forEach(n=>{const i=document.createTextNode(n.textContent);n.replaceWith(i)}),t.innerHTML=t.innerHTML.replace(/\[[^\]]*?\]/g,""),t.querySelectorAll("div, span").forEach(n=>{n.textContent.trim()||n.remove()}),t.innerHTML}function Xe(){fetch(k().resolveAsset("affections/reader_mode/styles.css")).then(e=>e.text()).then(e=>{const t=document.createElement("style");t.textContent=e,document.head.appendChild(t)})}const Ye=Object.freeze(Object.defineProperty({__proto__:null,apply:Ge},Symbol.toStringTag,{value:"Module"}));class Je{static async getSettings(){return new Promise(t=>{k().storage.sync.get(["simplifySettings"],n=>{t(n.simplifySettings||{fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',textColor:"#333",enabled:!0})})})}}function Ze(){document.readyState==="complete"?K():window.addEventListener("load",K)}async function K(){const e=await Je.getSettings();e.enabled&&(Qe(e),tt(e),et(e))}function Qe(e){const t=`
        /* Consistent fonts everywhere */
        * {
            font-family: ${e.fontFamily} !important;
            letter-spacing: ${e.letterSpacing}px !important;
        }
    `,n=document.createElement("style");n.textContent=t,document.head.appendChild(n)}function et(e){const t=`
        /* Comfortable line height and text spacing */
        body {
            line-height: ${e.lineHeight} !important;
        }
        
        p {
            margin-bottom: 1.2em !important;
        }
        
        h1, h2, h3, h4, h5, h6 {
            line-height: 1.3 !important;
            margin-top: 1.5em !important;
            margin-bottom: 0.8em !important;
        }
    `,n=document.createElement("style");n.textContent=t,document.head.appendChild(n)}function tt(e){const t=`
        /* Better text contrast and readability */
        body {
            color: ${e.textColor} !important;
            background: white !important;
        }
        
        h1, h2, h3, h4, h5, h6 {
            color: #000 !important;
        }
        
        a {
            color: #0066cc !important;
        }
        
        a:hover {
            opacity: 0.8 !important;
        }
    `,n=document.createElement("style");n.textContent=t,document.head.appendChild(n)}const nt=Object.freeze(Object.defineProperty({__proto__:null,apply:Ze},Symbol.toStringTag,{value:"Module"}));function ot(){if(document.getElementById("tts-widget"))return;const e=document.createElement("link");e.rel="stylesheet",e.href=k().resolveAsset("affections/text_to_speech/styles.css"),document.head.appendChild(e),it()}function it(){const e=document.createElement("div");e.id="tts-widget",e.innerHTML=`
        <div class="tts-header">
            <span>Text to Speech</span>
            <button id="tts-close" title="Close">×</button>
        </div>
        <div class="tts-controls">
            <button id="tts-prev" title="Previous Sentence">⏮</button>
            <button id="tts-play" title="Play">▶</button>
            <button id="tts-pause" title="Pause" style="display:none;">⏸</button>
            <button id="tts-stop" title="Stop">⏹</button>
            <button id="tts-next" title="Next Sentence">⏭</button>
        </div>
        <div class="tts-settings">
            <label for="tts-speed">Speed: <span id="tts-speed-val">1.0</span>x</label>
            <input type="range" id="tts-speed" min="0.5" max="2.0" step="0.1" value="1.0">
        </div>
        <div id="tts-status">Ready</div>
    `,document.body.appendChild(e);let t=null,n=!1,i=[],o=0;const r=e.querySelector("#tts-play"),d=e.querySelector("#tts-pause"),f=e.querySelector("#tts-stop"),h=e.querySelector("#tts-prev"),g=e.querySelector("#tts-next"),y=e.querySelector("#tts-close"),b=e.querySelector("#tts-speed"),u=e.querySelector("#tts-speed-val"),s=e.querySelector("#tts-status");e.querySelectorAll("button").forEach(c=>{c.addEventListener("mousedown",v=>v.preventDefault())});function m(){return window.getSelection().toString().trim()||document.body.innerText}function p(c){return c.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[c]}function a(){if(n){window.speechSynthesis.resume(),n=!1,E(!0),s.textContent="Speaking...";return}window.speechSynthesis.cancel();const c=m();if(!c){s.textContent="No text found";return}i=p(c),o>=i.length&&(o=0),l()}function l(){if(o>=i.length){s.textContent="Finished",E(!1);return}const c=i[o];t=new SpeechSynthesisUtterance(c),t.rate=parseFloat(b.value),t.onend=()=>{o++,!n&&o<i.length?l():o>=i.length&&(s.textContent="Finished",E(!1))},t.onerror=v=>{console.error("TTS Error",v),v.error!=="interrupted"&&(s.textContent="Error: "+v.error)},s.textContent=`Reading ${o+1}/${i.length}`,window.speechSynthesis.speak(t),E(!0)}function E(c){c?(r.style.display="none",d.style.display="inline-block"):(r.style.display="inline-block",d.style.display="none")}r.addEventListener("click",a),d.addEventListener("click",()=>{window.speechSynthesis.pause(),n=!0,E(!1),s.textContent="Paused"}),f.addEventListener("click",()=>{window.speechSynthesis.cancel(),n=!1,o=0,E(!1),s.textContent="Stopped"}),g.addEventListener("click",()=>{window.speechSynthesis.cancel(),o++,o>=i.length&&(o=0),l()}),h.addEventListener("click",()=>{window.speechSynthesis.cancel(),o--,o<0&&(o=0),l()}),b.addEventListener("input",c=>{u.textContent=c.target.value,window.speechSynthesis.speaking&&(window.speechSynthesis.cancel(),l())}),y.addEventListener("click",()=>{window.speechSynthesis.cancel(),e.remove()})}const st=Object.freeze(Object.defineProperty({__proto__:null,apply:ot},Symbol.toStringTag,{value:"Module"})),X=["dyslexia","adhd","autism","color_blindness","partially_blindness","epilepsy","simplify","reader_mode","text_to_speech"],rt={dyslexia:["OpenDyslexic font with increased spacing and line height","Reading ruler and paragraph focus","Long paragraphs split for easier scanning"],adhd:["Navigation and footer de-emphasized","Paragraph focus: one block at a time","Optional table of contents for scanning"],autism:["Reduced visual noise and calmer palette","Optional vertical layout and simplified chrome","Short on-page summaries per paragraph (when enabled)"],color_blindness:["Color filters for protanopia, deuteranopia, or tritanopia","Adjustable simulation and correction modes"],partially_blindness:["Selectable region shown in a high-contrast mini view","Rest of the page dimmed to reduce clutter"],epilepsy:["GIFs and animations paused until interaction","Videos require deliberate play; flashing reduced","Aggressive motion and transitions toned down"],simplify:["Consistent fonts, spacing, and contrast from your settings","Uses saved Simplify preferences (Customize in extension)"],reader_mode:["Main article extracted into a clean reading column","Sidebars, ads, and chrome stripped from content"],text_to_speech:["Play, pause, and step through sentences","Adjustable speed for the selected content"]};let Y=!1;function at(e={}){if(Y)return;Y=!0;const t=e.context||"extension",n=document.createElement("div");n.id="hermes-brilliant-shell",document.documentElement.appendChild(n);const i=k(),o=document.createElement("link");o.rel="stylesheet",o.href=i.resolveAsset("lib/hermes/sideShell.css"),document.head.appendChild(o);const r=typeof localStorage<"u"&&localStorage.getItem("hermes_shell_collapsed")==="1";n.classList.toggle("hermes-panel-collapsed",r),n.innerHTML=`
        <button type="button" id="hermes-shell-handle" aria-expanded="${!r}">Brilliant Mind</button>
        <div id="hermes-shell-panel" role="region" aria-label="Brilliant Mind accessibility">
            <h3>Brilliant Mind</h3>
            <p class="hermes-sub">Choose one experience for this site. The page reloads when you change it.</p>
            <div class="hermes-section-title">Experience</div>
            <div class="hermes-module-list" id="hermes-module-list"></div>
            <div class="hermes-section-title">What this does</div>
            <ul class="hermes-mods-list" id="hermes-mods-list"></ul>
        </div>
    `;const d=n.querySelector("#hermes-module-list"),f=n.querySelector("#hermes-mods-list"),h=n.querySelector("#hermes-shell-handle");function g(s,m){const p=document.createElement("label"),a=document.createElement("input");a.type="radio",a.name="hermes-module",a.value=s,a.id=`hermes-mod-${s||"off"}`;const l=document.createElement("span");l.textContent=m,p.appendChild(a),p.appendChild(l),d.appendChild(p)}g("","None (standard page)"),X.forEach(s=>{g(s,y(s))});function y(s){return s.split("_").map(m=>m.charAt(0).toUpperCase()+m.slice(1)).join(" ")}function b(s){if(f.innerHTML="",!s){const p=document.createElement("li");p.textContent="No Brilliant Mind mode is active. Pick an experience above to adapt this site.",f.appendChild(p);return}(rt[s]||["Accessibility adjustments applied for this mode."]).forEach(p=>{const a=document.createElement("li");a.textContent=p,f.appendChild(a)})}function u(s){const p="site_"+location.hostname;i.storage.local.get(p,a=>{const E=(a[p]||[])[0]||null;s(E)})}u(s=>{const m=n.querySelector("#hermes-mod-off");m&&(m.checked=!s),X.forEach(p=>{const a=n.querySelector(`#hermes-mod-${p}`);a&&(a.checked=s===p)}),b(s)}),d.addEventListener("change",s=>{const m=s.target;if(m&&m.name==="hermes-module"&&m.checked){const p=m.value;b(p);const l="site_"+location.hostname,E=p?[p]:[];i.storage.local.set({[l]:E},()=>{t==="extension"?chrome.runtime.sendMessage({type:"reload_active_tab"}):location.reload()})}}),h.addEventListener("click",()=>{const s=!n.classList.contains("hermes-panel-collapsed");n.classList.toggle("hermes-panel-collapsed",s),h.setAttribute("aria-expanded",String(!s));try{localStorage.setItem("hermes_shell_collapsed",s?"1":"0")}catch{}})}function lt(e){return e.charAt(0).toUpperCase()+e.slice(1)}function ct(e){if(e&&e.src){const t=new URL(e.src);t.hash="",t.search="";const n=t.href.replace(/[^/]+$/,"");globalThis.__HERMES_CDN_BASE__=`${n}extension/`}else globalThis.__HERMES_CDN_BASE__=`${window.location.origin}/extension/`}function dt(){var e;return document.currentScript&&((e=document.currentScript.dataset)==null?void 0:e.siteId)!=null?document.currentScript:document.querySelector("script[data-brilliantmind][data-site-id]")}const J=Object.assign({"../../../extension/affections/adhd/applyADHD.js":ee,"../../../extension/affections/autism/applyAutism.js":se,"../../../extension/affections/base/applyBase.js":ae,"../../../extension/affections/color_blindness/applyColor_blindness.js":pe,"../../../extension/affections/dyslexia/applyDyslexia.js":ve,"../../../extension/affections/epilepsy/applyEpilepsy.js":Fe,"../../../extension/affections/partially_blindness/applyPartially_blindness.js":Ve,"../../../extension/affections/reader_mode/applyReader_mode.js":Ye,"../../../extension/affections/simplify/applySimplify.js":nt,"../../../extension/affections/text_to_speech/applyText_to_speech.js":st});function ut(e){const t=`/${e}/apply${lt(e)}.js`,n=Object.keys(J).find(i=>i.replace(/\\/g,"/").endsWith(t));return n?J[n]:null}async function pt(e,t){const n=`${e}/v1/sites/${encodeURIComponent(t)}/config`,i=await fetch(n,{credentials:"omit",headers:{Accept:"application/json"}});if(!i.ok)throw new Error(`Config failed: ${i.status}`);return i.json()}async function mt(){var y,b,u;const e=dt(),t=((y=e==null?void 0:e.dataset)==null?void 0:y.siteId)||"demo",n=(((b=e==null?void 0:e.dataset)==null?void 0:b.apiBase)||"http://127.0.0.1:8787").replace(/\/$/,""),i=((u=e==null?void 0:e.dataset)==null?void 0:u.siteKey)||"";ct(e),te(ne({siteId:t,apiBase:n,getPublishableKey:()=>i})),at({context:"embed"});let o;try{o=await pt(n,t)}catch(s){console.warn("[BrilliantMind] config fetch failed, using defaults:",s),o={allowedModules:["dyslexia","adhd","autism","color_blindness","partially_blindness","epilepsy","simplify","reader_mode","text_to_speech"],defaultModule:null}}const d=`site_${location.hostname}`,f=await new Promise(s=>{k().storage.local.get(d,m=>{s(m[d])})});let h=Array.isArray(f)&&f[0]||o.defaultModule||null;if(h&&o.allowedModules&&!o.allowedModules.includes(h)&&(h=o.defaultModule||null),!h)return;const g=ut(h);if(!g){console.error("[BrilliantMind] Unknown module:",h);return}typeof g.apply=="function"&&g.apply()}mt().catch(e=>console.error("[BrilliantMind]",e))})();

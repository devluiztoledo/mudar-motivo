
// ==UserScript==
// @name         A6 Atalho: Alterar Motivo do Atendimento + Criar Atendimento - Luiz Toledo
// @namespace    http://tampermonkey.net/
// @version      7.5
// @description  Adiciona botões para alterar motivo e painéis de criação de atendimento conforme host
// @author       Luiz Toledo
// @match        *://integrator6.gegnet.com.br/*
// @match        https://integrator6.acessoline.net.br/*
// @grant        none
// @icon         https://raw.githubusercontent.com/devluiztoledo/copiar-dados-ONT/main/icon.png
// @updateURL    https://raw.githubusercontent.com/devluiztoledo/mudar-motivo/main/mudar-motivo.user.js
// @downloadURL  https://raw.githubusercontent.com/devluiztoledo/mudar-motivo/main/mudar-motivo.user.js
// ==/UserScript==

(function () {
    'use strict';

    const host = window.location.host;
    const isGegnet = host.includes('gegnet.com.br');
    const isAcessoLine = host.includes('acessoline.net.br');

    //////////// ALTERAR ATENDIMENTO ////////////
    const motivos = {
        "Lentidão":      "SUP RES - Lentidão",
        "Sem acesso":    "SUP RES - Sem conexão/Indisponibilidade",
        "Massiva":       "SUP RES - Massiva",
        "Alterar senha": "SUP RES - Troca /Informações senha",
        "Streaming TV":  "SUP RES - Streaming TV",
        "Alterar Configurações Equipamento": "SUP RES -  Alterar Configuração equipamento",
        "Visita técnica": "SUP RES - Visita técnica"
    };

    const delay = ms => new Promise(res => setTimeout(res, ms));
    function clickMudar() { const btn = Array.from(document.querySelectorAll('a.ui-menuitem-link')).find(a => a.textContent.trim()==='Mudar'); if(btn)btn.click(); }
    function clickMenu(label) { const item = Array.from(document.querySelectorAll('span.ui-menuitem-text')).find(s=>s.textContent.trim()===label); if(item) item.click(); }
    function clickSpan(text){ const el = Array.from(document.querySelectorAll('span.ng-star-inserted')).find(e=>e.textContent.trim()===text); if(el)el.click(); }
    function clickSalvar(){ const btn=document.querySelector('div.modal-footer button.btn-success')||document.querySelector('button.btn-success'); if(btn)btn.click(); }

    const altFlows = {
        tipoSemAcesso: async()=>{clickMudar();await delay(200);clickMenu('Tipo');await delay(150);clickSpan('SUPORTE RESIDENCIAL');await delay(150);clickSpan('SUP RES - INTERNET SEM ACESSO');await delay(150);clickSalvar();},
        semAcesso: async()=>{clickMudar();await delay(200);clickMenu('Categoria');await delay(150);clickMenu('Técnico');await delay(150);clickMenu('Motivo');await delay(150);document.querySelector('.ui-dropdown-trigger')?.click();await delay(150);clickSpan('SUP RES - Sem conexão / Indisponibilidade');await delay(150);clickSalvar();},
        tipoLentidao: async()=>{clickMudar();await delay(200);clickMenu('Tipo');await delay(150);clickSpan('SUPORTE RESIDENCIAL');await delay(150);clickSpan('SUP RES - INTERNET LENTIDÃO');await delay(150);clickSalvar();},
        lentidao: async()=>{clickMudar();await delay(200);clickMenu('Categoria');await delay(150);clickMenu('Técnico');await delay(150);clickMenu('Motivo');await delay(150);document.querySelector('.ui-dropdown-trigger')?.click();await delay(150);clickSpan('SUP RES - Lentidão');await delay(150);clickSalvar();},
        massiva: async()=>{clickMudar();await delay(200);clickMenu('Categoria');await delay(150);clickMenu('Técnico');await delay(150);clickMenu('Motivo');await delay(150);document.querySelector('.ui-dropdown-trigger')?.click();await delay(150);clickSpan('SUP RES - Massiva');await delay(150);clickSalvar();},
        req: async()=>{clickMudar();await delay(200);clickMenu('Tipo');await delay(150);clickSpan('REQUERIMENTO RES');await delay(150);clickSalvar();}
    };
    const gegFlows = { default: async label=>{clickMudar();await delay(200);clickMenu('Categoria');await delay(150);clickMenu('Técnico');await delay(150);clickMenu('Motivo');await delay(150);document.querySelector('.ui-dropdown-trigger')?.click();await delay(150);clickSpan(label);await delay(150);clickSalvar();}, supPF: altFlows.req, req: async()=>{clickMudar();await delay(200);clickMenu('Tipo');await delay(150);clickSpan('REQUERIMENTO CLIENTE');await delay(150);clickSalvar();} };
    function criarBotao(nome,action){const btn=document.createElement('button');btn.textContent=nome;btn.id='btn-'+nome.replace(/\s+/g,'').toLowerCase();Object.assign(btn.style,{margin:'5px',padding:'6px 10px',background:'rgb(26, 66, 138)',color:'#fff',border:'none',borderRadius:'5px',cursor:'pointer'});btn.addEventListener('click',action);return btn;}
    function inserirBotoes(){const campo=document.querySelector('input[formcontrolname="descri_mvis"]'); if(!campo||document.querySelector('#btn-alterar-motivo'))return; const c=document.createElement('div');c.id='btn-alterar-motivo';c.style.margin='15px 0'; if(isAcessoLine){c.appendChild(criarBotao('TIPO - SEM ACESSO',altFlows.tipoSemAcesso));c.appendChild(criarBotao('Sem Acesso',altFlows.semAcesso));c.appendChild(criarBotao('TIPO - Lentidão',altFlows.tipoLentidao));c.appendChild(criarBotao('Lentidão',altFlows.lentidao));c.appendChild(criarBotao('Massiva',altFlows.massiva));c.appendChild(criarBotao('REQ',altFlows.req));}else if(isGegnet){Object.entries(motivos).forEach(([n,l])=>c.appendChild(criarBotao(n,()=>gegFlows.default(l))));c.appendChild(criarBotao('SUP - PF',gegFlows.supPF));c.appendChild(criarBotao('REQ',gegFlows.req));} campo.parentElement.prepend(c);}
    new MutationObserver(inserirBotoes).observe(document.body,{childList:true,subtree:true});
    window.addEventListener('hashchange',()=>setTimeout(inserirBotoes,500));

    // Criar Atendimento (Gegnet)
    if(isGegnet){ (function(){const d=ms=>new Promise(r=>setTimeout(r,ms)); function clickItem(t){const el=Array.from(document.querySelectorAll('span.ng-star-inserted')).filter(e=>e.offsetParent!==null).find(s=>s.textContent.trim()===t);if(el)el.click();else console.warn(`Item '${t}' não encontrado`);}async function selectDropdown(n,l){const trig=document.querySelector(`p-dropdown[formcontrolname="${n}"] .ui-dropdown-trigger`);if(!trig)return;trig.click();await d(200);const opt=Array.from(document.querySelectorAll('li.ui-dropdown-item')).find(li=>li.getAttribute('aria-label')===l&&li.offsetParent!==null);if(opt)opt.click();else console.warn(`Opção '${l}' no '${n}' não encontrada`);await d(200);}const f={semAcessoSuporte:async()=>{const pf=Array.from(document.querySelectorAll('span.ng-star-inserted')).filter(e=>e.offsetParent!==null).some(s=>s.textContent.trim()==='SUPORTE TÉCNICO - PF');if(!pf){clickItem('SUPORTE TÉCNICO RESIDENCIAL');await d(100);clickItem('SUPORTE TÉCNICO - PF');await d(200);}await selectDropdown('codcatoco','Técnico');await selectDropdown('codmvis','SUP RES - Sem conexão/Indisponibilidade');},semAcessoDigital:async()=>{await f.semAcessoSuporte();await selectDropdown('user_cargo','CSA - Digital');},lentidaoSuporte:async()=>{const pf=Array.from(document.querySelectorAll('span.ng-star-inserted')).filter(e=>e.offsetParent!==null).some(s=>s.textContent.trim()==='SUPORTE TÉCNICO - PF');if(!pf){clickItem('SUPORTE TÉCNICO RESIDENCIAL');await d(100);clickItem('SUPORTE TÉCNICO - PF');await d(200);}await selectDropdown('codcatoco','Técnico');await selectDropdown('codmvis','SUP RES - Lentidão');},lentidaoDigital:async()=>{await f.lentidaoSuporte();await selectDropdown('user_cargo','CSA - Digital');},senhaWifi:async()=>{const pf=Array.from(document.querySelectorAll('span.ng-star-inserted')).filter(e=>e.offsetParent!==null).some(s=>s.textContent.trim()==='SUPORTE TÉCNICO - PF');if(!pf){clickItem('SUPORTE TÉCNICO RESIDENCIAL');await d(100);clickItem('SUPORTE TÉCNICO - PF');await d(200);}await selectDropdown('codcatoco','Técnico');await selectDropdown('codmvis','SUP RES - Troca /Informações senha');await selectDropdown('user_cargo','CSA - Digital');}};function cp(){const b=document.querySelector('div.box-formulario');if(!b||document.getElementById('tm-panel'))return;const p=document.createElement('div');p.id='tm-panel';p.style.cssText='margin:10px 0;display:flex;gap:8px';const m={'Sem Acesso Suporte':'semAcessoSuporte','Sem Acesso Digital':'semAcessoDigital','Lentidão Suporte':'lentidaoSuporte','Lentidão Digital':'lentidaoDigital','Senha Wi‑Fi':'senhaWifi'};for(const[l,k]of Object.entries(m)){const btn=document.createElement('button');btn.textContent=l;btn.className='btn btn-primary';btn.style.padding='4px 10px';btn.addEventListener('click',f[k]);p.appendChild(btn);}b.prepend(p);}new MutationObserver(cp).observe(document.body,{childList:true,subtree:true});window.addEventListener('hashchange',()=>setTimeout(cp,300));setTimeout(cp,500);})();}

    // Criar Atendimento ( Acessoline)
    if(isAcessoLine){ (function(){
            const delay = ms => new Promise(r => setTimeout(r, ms));
            function clickItem(text) {
                const el = Array.from(document.querySelectorAll('span.ng-star-inserted'))
                    .filter(e => e.offsetParent !== null)
                    .find(s => s.textContent.trim() === text);
                if (el) el.click();
                else console.warn(`Item '${text}' não encontrado ou não visível`);
            }
            async function selectDropdown(name, label) {
                const dropdown = document.querySelector(`p-dropdown[formcontrolname="${name}"]`);
                if (!dropdown) return console.warn(`Dropdown '${name}' não encontrado`);
                const trigger = dropdown.querySelector('.ui-dropdown-trigger');
                if (!trigger) return console.warn(`Trigger '${name}' não encontrado`);
                trigger.click(); await delay(200);
                const option = Array.from(document.querySelectorAll('li.ui-dropdown-item'))
                    .filter(li => li.offsetParent !== null)
                    .find(li => li.getAttribute('aria-label') === label);
                if (option) option.click();
                else console.warn(`Opção '${label}' no '${name}' não encontrada`);
                await delay(200);
            }
            async function expandSuporteResidencialSeNecessario() {
                const subSelecionados = [
                    'SUP RES - CLIENTE CRÍTICO',
                    'SUP RES - INTERNET LENTIDÃO',
                    'SUP RES - INTERNET SEM ACESSO',
                    'SUP RES - STREAMING TV',
                    'SUP RES - TELEFONE',
                    'SUP RES - VISITA CONSULTIVA'
                ];
                const anySub = Array.from(document.querySelectorAll('span.ng-star-inserted'))
                    .filter(e => e.offsetParent !== null)
                    .some(s => subSelecionados.includes(s.textContent.trim()));
                if (!anySub) {
                    const node = Array.from(document.querySelectorAll('div.ui-treenode-content'))
                        .find(div => div.querySelector('span.ng-star-inserted')?.textContent.trim() === 'SUPORTE RESIDENCIAL');
                    if (node) {
                        const toggler = node.querySelector('.ui-tree-toggler.pi-caret-right');
                        if (toggler) { toggler.click(); await delay(150); }
                    }
                    clickItem('SUPORTE RESIDENCIAL'); await delay(150);
                }
            }
            async function atendimentoSemAcesso() {
                await expandSuporteResidencialSeNecessario();
                clickItem('SUP RES - INTERNET SEM ACESSO'); await delay(200);
                await selectDropdown('codcatoco','Tecnico');
                await selectDropdown('codmvis','SUP RES - Sem conexão / Indisponibilidade');
            }
            async function atendimentoLentidao() {
                await expandSuporteResidencialSeNecessario();
                clickItem('SUP RES - INTERNET LENTIDÃO'); await delay(200);
                await selectDropdown('codcatoco','Tecnico');
                await selectDropdown('codmvis','SUP RES - Lentidão');
            }
            function createALPanel() {
                const box = document.querySelector('div.box-formulario');
                if (!box || document.getElementById('al-panel')) return;
                const panel = document.createElement('div'); panel.id='al-panel'; panel.style.cssText='margin:10px 0;display:flex;gap:10px';
                const botao=(lbl,onClick,cor)=>{const b=document.createElement('button');b.textContent=lbl;b.style.cssText=`padding:6px 12px;background:${cor};color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:bold;`;b.addEventListener('click',onClick);return b;};
                panel.appendChild(botao('Sem acesso',atendimentoSemAcesso,'#1a428a'));
                panel.appendChild(botao('Lentidão',atendimentoLentidao,'#a02121'));
                box.prepend(panel);
            }
            new MutationObserver(createALPanel).observe(document.body,{childList:true,subtree:true});
            window.addEventListener('hashchange',()=>setTimeout(createALPanel,300));
            setTimeout(createALPanel,500);
        })();
    }
})();

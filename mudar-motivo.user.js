// ==UserScript==
// @name         A6 Atalho: Alterar Motivo do Atendimento - Luiz Toledo
// @namespace    http://tampermonkey.net/
// @version      6.1
// @description  Adiciona botões para alterar automaticamente o motivo de atendimento no Integrator 6
// @author       Luiz Toledo
// @match        *://integrator6.gegnet.com.br/*
// @grant        none
// @icon         https://raw.githubusercontent.com/devluiztoledo/copiar-dados-ONT/main/icon.png
// @updateURL    https://raw.githubusercontent.com/devluiztoledo/mudar-motivo/main/mudar-motivo.user.js
// @downloadURL  https://raw.githubusercontent.com/devluiztoledo/mudar-motivo/main/mudar-motivo.user.js
// ==/UserScript==

(function () {
    'use strict';

    const motivos = {
        "Lentidão":      "SUP - Lentidão",
        "Sem acesso":    "SUP - Sem conexão/Indisponibilidade",
        "Massiva":       "SUP - Massiva",
        "Alterar senha": "SUP - Troca /informações senha Wifi",
        "Streaming TV":  "SUP - Streaming TV",
        "Alterar Configurações Equipamento": "SUP-  Alterar Configuração equipamento",
        "Visita técnica": "SUP - Visita técnica"
    };

    const delay = ms => new Promise(res => setTimeout(res, ms));

    function clickMudar() {
        const btn = Array.from(document.querySelectorAll('a.ui-menuitem-link'))
            .find(a => a.textContent.trim() === 'Mudar');
        if (btn) btn.click();
    }
    function clickMenu(label) {
        const item = Array.from(document.querySelectorAll('span.ui-menuitem-text'))
            .find(span => span.textContent.trim() === label);
        if (item) item.click();
    }
    function clickSpan(text) {
        const el = Array.from(document.querySelectorAll('span.ng-star-inserted'))
            .find(e => e.textContent.trim() === text);
        if (el) el.click();
    }
    function clickSalvar() {
        const btn = document.querySelector('div.modal-footer button.btn-success') || document.querySelector('button.btn-success');
        if (btn) btn.click();
    }

    const flows = {
        default: async motivoLabel => {
            clickMudar(); await delay(200);
            clickMenu('Categoria'); await delay(150);
            clickMenu('Técnico'); await delay(150);
            clickMenu('Motivo'); await delay(150);
            const trg = document.querySelector('.ui-dropdown-trigger');
            if (trg) { trg.click(); await delay(150); }
            clickSpan(motivoLabel); await delay(150);
            clickSalvar();
        },
        supPF: async () => {
            clickMudar(); await delay(200);
            clickMenu('Tipo'); await delay(150);
            clickSpan('SUPORTE TÉCNICO RESIDENCIAL'); await delay(150);
            clickSpan('SUPORTE TÉCNICO - PF'); await delay(150);
            clickSalvar();
        },
        supPJ: async () => {
            clickMudar(); await delay(200);
            clickMenu('Tipo'); await delay(150);
            clickSpan('SUPORTE TÉCNICO RESIDENCIAL'); await delay(150);
            clickSpan('SUPORTE TÉCNICO - PJ'); await delay(150);
            clickSalvar();
        },
        req: async () => {
            clickMudar(); await delay(200);
            clickMenu('Tipo'); await delay(150);
            clickSpan('REQUERIMENTO CLIENTE'); await delay(150);
            clickSalvar();
        }
    };

    function criarBotao(nome, action) {
        const btn = document.createElement('button');
        btn.textContent = nome;
        btn.id = 'btn-' + nome.replace(/\s+/g, '').toLowerCase();
        Object.assign(btn.style, {
            margin: '5px', padding: '6px 10px',
            background: 'rgb(26, 66, 138)', color: '#fff',
            border: 'none', borderRadius: '5px', cursor: 'pointer'
        });
        btn.addEventListener('click', action);
        return btn;
    }

    function inserirBotoes() {
        const campo = document.querySelector('input[formcontrolname="descri_mvis"]');
        if (!campo) return;
        let container = document.querySelector('#btn-alterar-motivo');
        if (container) return;

        container = document.createElement('div');
        container.id = 'btn-alterar-motivo';
        container.style.margin = '15px 0';

        Object.entries(motivos).forEach(([nome, label]) => {
            container.appendChild(criarBotao(nome, () => flows.default(label)));
        });
        container.appendChild(criarBotao('SUP - PF', flows.supPF));
        container.appendChild(criarBotao('SUP - PJ', flows.supPJ));
        container.appendChild(criarBotao('REQ', flows.req));

        campo.parentElement.prepend(container);
    }


    new MutationObserver(inserirBotoes).observe(document.body, { childList: true, subtree: true });


    window.addEventListener('hashchange', () => setTimeout(inserirBotoes, 500));
})();

//Criar Atendimento
(function() {
    'use strict';
    const delay = ms => new Promise(r => setTimeout(r, ms));

    function clickItem(text) {
        const el = Array.from(document.querySelectorAll('span.ng-star-inserted'))
            .filter(e => e.offsetParent !== null)
            .find(s => s.textContent.trim() === text);
        if (el) el.click(); else console.warn(`Item '${text}' não encontrado`);
    }

    async function selectDropdown(name, label) {
        const trigger = document.querySelector(`p-dropdown[formcontrolname="${name}"] .ui-dropdown-trigger`);
        if (!trigger) { console.warn(`Dropdown ${name} não encontrado`); return; }
        trigger.click(); await delay(200);
        const option = Array.from(document.querySelectorAll('li.ui-dropdown-item'))
            .find(li => li.getAttribute('aria-label') === label && li.offsetParent !== null);
        if (option) option.click(); else console.warn(`Opção '${label}' no ${name} não encontrada`);
        await delay(200);
    }

    const flows = {
        semAcessoSuporte: async () => {

            const pfSelecionado = Array.from(document.querySelectorAll('span.ng-star-inserted'))
                .filter(e => e.offsetParent !== null)
                .some(s => s.textContent.trim() === 'SUPORTE TÉCNICO - PF');
            if (!pfSelecionado) {
                clickItem('SUPORTE TÉCNICO RESIDENCIAL'); await delay(100);
                clickItem('SUPORTE TÉCNICO - PF'); await delay(200);
            }
            await selectDropdown('codcatoco','Técnico');
            await selectDropdown('codmvis','SUP - Sem conexão/Indisponibilidade');
        },
        semAcessoDigital: async () => {
            await flows.semAcessoSuporte();
            await selectDropdown('user_cargo','CSA - Digital');
        },
        lentidaoSuporte: async () => {
            const pfSelecionado = Array.from(document.querySelectorAll('span.ng-star-inserted'))
                .filter(e => e.offsetParent !== null)
                .some(s => s.textContent.trim() === 'SUPORTE TÉCNICO - PF');
            if (!pfSelecionado) {
                clickItem('SUPORTE TÉCNICO RESIDENCIAL'); await delay(100);
                clickItem('SUPORTE TÉCNICO - PF'); await delay(200);
            }
            await selectDropdown('codcatoco','Técnico');
            await selectDropdown('codmvis','SUP - Lentidão');
        },
        lentidaoDigital: async () => {
            await flows.lentidaoSuporte();
            await selectDropdown('user_cargo','CSA - Digital');
        },
        senhaWifi: async () => {
            const pfSelecionado = Array.from(document.querySelectorAll('span.ng-star-inserted'))
                .filter(e => e.offsetParent !== null)
                .some(s => s.textContent.trim() === 'SUPORTE TÉCNICO - PF');
            if (!pfSelecionado) {
                clickItem('SUPORTE TÉCNICO RESIDENCIAL'); await delay(100);
                clickItem('SUPORTE TÉCNICO - PF'); await delay(200);
            }
            await selectDropdown('codcatoco','Técnico');
            await selectDropdown('codmvis','SUP - Troca /informações senha Wifi');
            await selectDropdown('user_cargo','CSA - Digital');
        }
    };

    function createPanel() {
        const box = document.querySelector('div.box-formulario'); if (!box || document.getElementById('tm-panel')) return;
        const panel = document.createElement('div'); panel.id = 'tm-panel'; panel.style.cssText = 'margin:10px 0;display:flex;gap:8px';
        const map = {
            'Sem Acesso Suporte':'semAcessoSuporte',
            'Sem Acesso Digital':'semAcessoDigital',
            'Lentidão Suporte':'lentidaoSuporte',
            'Lentidão Digital':'lentidaoDigital',
            'Senha Wi‑Fi':'senhaWifi'
        };
        for (const [lbl, key] of Object.entries(map)) {
            const btn = document.createElement('button');
            btn.textContent = lbl;
            btn.className = 'btn btn-primary';
            btn.style.padding = '4px 10px';
            btn.addEventListener('click', flows[key]);
            panel.appendChild(btn);
        }
        box.prepend(panel);
    }

    new MutationObserver(createPanel).observe(document.body, { childList: true, subtree: true });
    window.addEventListener('hashchange', () => setTimeout(createPanel, 300));
    setTimeout(createPanel, 500);
})();

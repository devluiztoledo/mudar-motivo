// ==UserScript==
// @name         A6 Atalho: Alterar Motivo do Atendimento - Luiz Toledo
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Adiciona botões para alterar automaticamente o motivo de atendimento no Integrator 6, seleciona o motivo correto e clica em Salvar automaticamente.
// @author       Você
// @match        *://integrator6.gegnet.com.br/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/devluiztoledo/mudar-motivo/main/mudar-motivo.user.js
// @downloadURL  https://raw.githubusercontent.com/devluiztoledo/mudar-motivo/main/mudar-motivo.user.js
// @icon         https://raw.githubusercontent.com/devluiztoledo/mudar-motivo/main/icon.png
// ==/UserScript==

(function () {
    'use strict';

    const motivos = {
        "Lentidão":      "SUP - Lentidão",
        "Sem acesso":    "SUP - Sem conexão/Indisponibilidade",
        "Massiva":       "SUP - Massiva",
        "Alterar senha": "SUP - Troca /informações senha Wifi",
        "Streaming TV":  "SUP - Streaming TV",
        "Alterar Configurações Equipamento": "SUP- Alterar Configuração equipamento",
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
            const input = document.querySelector('input[formcontrolname="descri_mvis"]');
            const atual = input?.value.trim();
            clickMudar(); await delay(200);

            clickMenu('Categoria'); await delay(200);
            clickMenu('Técnico'); await delay(200);

            clickMenu('Motivo'); await delay(200);
            const trigger = document.querySelector('.ui-dropdown-trigger');
            if (trigger) { trigger.click(); await delay(200); }
            clickSpan(motivoLabel); await delay(200);
            clickSalvar();
        },
        supPF: async () => {
            clickMudar(); await delay(200);
            clickMenu('Tipo'); await delay(200);
            clickSpan('SUPORTE TÉCNICO RESIDENCIAL'); await delay(200);
            clickSpan('SUPORTE TÉCNICO - PF'); await delay(200);
            clickSalvar();
        },
        supPJ: async () => {
            clickMudar(); await delay(200);
            clickMenu('Tipo'); await delay(200);
            clickSpan('SUPORTE TÉCNICO RESIDENCIAL'); await delay(200);
            clickSpan('SUPORTE TÉCNICO - PJ'); await delay(200);
            clickSalvar();
        },
        req: async () => {
            clickMudar(); await delay(200);
            clickMenu('Tipo'); await delay(200);
            clickSpan('REQUERIMENTO CLIENTE'); await delay(200);
            clickSalvar();
        }
    };

    function criarBotao(nome, action) {
        const btn = document.createElement('button');
        btn.textContent = nome;
        btn.id = 'btn-' + nome.replace(/\s+/g, '').toLowerCase();
        btn.style.margin = '5px';
        btn.style.padding = '6px 10px';
        btn.style.background = 'rgb(26, 66, 138)';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';
        btn.addEventListener('click', action);
        return btn;
    }

    function inserirBotoes() {
        const campo = document.querySelector('input[formcontrolname="descri_mvis"]');
        if (!campo || document.querySelector('#btn-alterar-motivo')) return;

        const container = document.createElement('div');
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
})();

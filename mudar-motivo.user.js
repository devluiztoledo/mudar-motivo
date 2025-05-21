// ==UserScript==
// @name         A6 Atalho: Alterar Motivo do Atendimento - Luiz Toledo
// @namespace    http://tampermonkey.net/
// @version      2.0
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
        "Alterar senha": "SUP - Troca /informações senha Wifi"
    };

    function criarBotao(nome, motivoLabel) {
        const btn = document.createElement('button');
        btn.innerText = nome;
        btn.style.margin = '5px';
        btn.style.padding = '6px 10px';
        btn.style.background = '#1a428a';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';

        btn.onclick = async () => {
            const esperar = ms => new Promise(r => setTimeout(r, ms));


            const btnMudar = [...document.querySelectorAll('a.ui-menuitem-link')]
                .find(a => a.innerText.trim() === 'Mudar');
            if (!btnMudar) return alert('Botão Mudar não encontrado');
            btnMudar.click();
            await esperar(300);


            const catMenuItem = [...document.querySelectorAll('li.ui-menuitem')]
                .find(li => li.querySelector('span.ui-menuitem-text')?.innerText.trim() === 'Categoria');
            if (!catMenuItem) return alert('Item Categoria não encontrado');

            catMenuItem.querySelector('a.ui-menuitem-link').click();
            await esperar(300);


            const tecnicoItem = [...catMenuItem.querySelectorAll('p-menubarsub ul.ui-submenu-list li.ui-menuitem')]
                .find(li => li.querySelector('span.ui-menuitem-text')?.innerText.trim() === 'Técnico');
            if (!tecnicoItem) return alert('Categoria "Técnico" não encontrada');
            tecnicoItem.querySelector('a.ui-menuitem-link').click();
            await esperar(300);


            const motivoMenuItem = [...document.querySelectorAll('li.ui-menuitem')]
                .find(li => li.querySelector('span.ui-menuitem-text')?.innerText.trim() === 'Motivo');
            if (!motivoMenuItem) return alert('Item Motivo não encontrado');
            motivoMenuItem.querySelector('a.ui-menuitem-link').click();
            await esperar(300);


            const dropdownTrigger = document.querySelector('.ui-dropdown-trigger');
            if (!dropdownTrigger) return alert('Dropdown de motivo não encontrado');
            dropdownTrigger.click();
            await esperar(300);
            const escolhaMot = [...document.querySelectorAll('.ui-dropdown-item')]
                .find(el => el.innerText.trim() === motivoLabel);
            if (!escolhaMot) return alert(`Motivo "${motivoLabel}" não encontrado`);
            escolhaMot.click();
            await esperar(300);


            const btnSalvar = document.querySelector('div.modal-footer button.btn-success');
            if (!btnSalvar) return alert('Botão Salvar não encontrado');
            btnSalvar.click();
        };

        return btn;
    }

    function inserirBotoes() {
        const motivoCampo = document.querySelector('input[formcontrolname="descri_mvis"]');
        if (!motivoCampo || document.querySelector('#btn-alterar-motivo')) return;

        const container = document.createElement('div');
        container.id = 'btn-alterar-motivo';
        container.style.margin = '15px 0';

        for (const [nome, label] of Object.entries(motivos)) {
            container.appendChild(criarBotao(nome, label));
        }

        motivoCampo.parentElement.prepend(container);
    }

    new MutationObserver(inserirBotoes)
        .observe(document.body, { childList: true, subtree: true });
})();

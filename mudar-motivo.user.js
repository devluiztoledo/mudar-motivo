// ==UserScript==
// @name         A6 Atalho: Alterar Motivo do Atendimento - Luiz Toledo
// @namespace    http://tampermonkey.net/
// @version      4.0
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
        "Alterar Configurações Equipamento": "SUP- Alterar Configuração equipamento"
    };

    const templates = {
        "Lentidão": `TESTES REALIZADOS PELO CSA
---------------------------------------------------------------------------------------------------------
[RELATO DO CLIENTE]
Cliente entrou em contato relatando estar com lentidão e instabilidade
---------------------------------------------------------------------------------------------------------
[DISPOSITIVOS AFETADOS]

---------------------------------------------------------------------------------------------------------
[CONFIGURAÇÕES DO ROTEADOR]
Cliente possui um
DNS LAN habilitado no padrão
Priorizar 5G Desativado
IPv6 Habilitado em SLAAC em SLAAC
UPnP Desativado
Rede 2.4GHz com canal em X e largura em x Mhz
Rede 5.8GHz com canal em X e largura em x Mhz
Total de dispositivos conectados: 0 (Wi-Fi: 0, Wired: 0
Uptime:

---------------------------------------------------------------------------------------------------------
[ALTERAÇÕES REALIZADAS]

---------------------------------------------------------------------------------------------------------
[DADOS DA ONU]
Local:
Link:
Service Port:
VLAN:
Modelo:
Serial:
Firmware:
Rx ONU:
Rx OLT:
Uptime:
---------------------------------------------------------------------------------------------------------
[ATENDIMENTOS]
Cliente possui um total de 0 atendimentos nos ultimos 3 meses
---------------------------------------------------------------------------------------------------------
[INFORMAÇÕES PARA A OS]
---------------------------------------------------------------------------------------------------------`,

        "Sem acesso": `TESTES REALIZADOS PELO CSA
---------------------------------------------------------------------------------------------------------
[RELATO DO CLIENTE]
Cliente entrou em contato relatando estar sem acesso

---------------------------------------------------------------------------------------------------------
[DISPOSITIVOS AFETADOS]
---------------------------------------------------------------------------------------------------------
[CONFIGURAÇÕES DO ROTEADOR]
Cliente possui um
DNS LAN habilitado no padrão
Priorizar 5G Desativado
IPv6 Habilitado em SLAAC em SLAAC
UPnP Desativado
Rede 2.4GHz com canal em X e largura em x Mhz
Rede 5.8GHz com canal em X e largura em x Mhz
Total de dispositivos conectados: 0 (Wi-Fi: 0, Wired: 0
Uptime:
---------------------------------------------------------------------------------------------------------
[ALTERAÇÕES REALIZADAS]

---------------------------------------------------------------------------------------------------------
[DADOS DA ONU]
Local:
Link:
Service Port:
VLAN:
Modelo:
Serial:
Firmware:
Rx ONU:
Rx OLT:
Uptime:
---------------------------------------------------------------------------------------------------------
[ATENDIMENTOS]
Cliente possui um total de 0 atendimentos nos ultimos 3 meses
---------------------------------------------------------------------------------------------------------
[INFORMAÇÕES PARA A OS]
---------------------------------------------------------------------------------------------------------`,

        "Massiva": `TESTES REALIZADOS PELO CSA
---------------------------------------------------------------------------------------------------------
[RELATO DO CLIENTE]
Cliente entrou em contato relatando ocorrência massiva de falhas
---------------------------------------------------------------------------------------------------------
[DISPOSITIVOS AFETADOS]

---------------------------------------------------------------------------------------------------------
[CONFIGURAÇÕES DO ROTEADOR]
Cliente possui um
DNS LAN habilitado no padrão
Priorizar 5G Desativado
IPv6 Habilitado em SLAAC em SLAAC
UPnP Desativado
Rede 2.4GHz com canal em X e largura em x Mhz
Rede 5.8GHz com canal em X e largura em x Mhz
Total de dispositivos conectados: 0 (Wi-Fi: 0, Wired: 0
Uptime:

---------------------------------------------------------------------------------------------------------
[ALTERAÇÕES REALIZADAS]

---------------------------------------------------------------------------------------------------------
[DADOS DA ONU]
Local:
Link:
Service Port:
VLAN:
Modelo:
Serial:
Firmware:
Rx ONU:
Rx OLT:
Uptime:
---------------------------------------------------------------------------------------------------------
[ATENDIMENTOS]
Cliente possui um total de 0 atendimentos nos ultimos 3 meses
---------------------------------------------------------------------------------------------------------
[INFORMAÇÕES PARA A OS]
---------------------------------------------------------------------------------------------------------`,

        "Alterar senha": `TESTES REALIZADOS PELO CSA
---------------------------------------------------------------------------------------------------------
[RELATO DO CLIENTE]
Cliente entrou em contato solicitando a troca de senha
---------------------------------------------------------------------------------------------------------
[CONFIGURAÇÕES DO ROTEADOR]
Cliente possui um
DNS LAN habilitado no padrão
Priorizar 5G Desativado
IPv6 Habilitado em SLAAC em SLAAC
UPnP Desativado
Rede 2.4GHz com canal em X e largura em x Mhz
Rede 5.8GHz com canal em X e largura em x Mhz
Total de dispositivos conectados: 0 (Wi-Fi: 0, Wired: 0
Uptime:
---------------------------------------------------------------------------------------------------------
[ALTERAÇÕES REALIZADAS]
Alterado/criado/informado senha
Senha nova:
Senha Antiga:

---------------------------------------------------------------------------------------------------------
[DADOS DA ONU]
Local:
Link:
Service Port:
VLAN:
Modelo:
Serial:
Firmware:
Rx ONU:
Rx OLT:
Uptime:
---------------------------------------------------------------------------------------------------------
[ATENDIMENTOS]
Cliente possui um total de 0 atendimentos nos ultimos 3 meses
---------------------------------------------------------------------------------------------------------`,

        "Streaming TV": `Cliente entrou em contato solicitando acesso na sua Sky+/Paramount, o mesmo foi informado do login e senha da plataforma e enviado os vídeos informativos.
Após ser informado a dificuldade do cliente foi solucionada.`,

        "Alterar Configurações Equipamento": `TESTES REALIZADOS PELO CSA
---------------------------------------------------------------------------------------------------------
[RELATO DO CLIENTE]
Cliente solicitou auxílio em configurações do equipamento
---------------------------------------------------------------------------------------------------------
[DISPOSITIVOS AFETADOS]

---------------------------------------------------------------------------------------------------------
[CONFIGURAÇÕES DO ROTEADOR]
Cliente possui um
DNS LAN habilitado no padrão
Priorizar 5G Desativado
IPv6 Habilitado em SLAAC em SLAAC
UPnP Desativado
Rede 2.4GHz com canal em X e largura em x Mhz
Rede 5.8GHz com canal em X e largura em x Mhz
Total de dispositivos conectados: 0 (Wi-Fi: 0, Wired: 0
Uptime:

---------------------------------------------------------------------------------------------------------
[ALTERAÇÕES REALIZADAS]
Realizadas configurações solicitadas no equipamento
---------------------------------------------------------------------------------------------------------
[DADOS DA ONU]
Local:
Link:
Service Port:
VLAN:
Modelo:
Serial:
Firmware:
Rx ONU:
Rx OLT:
Uptime:
---------------------------------------------------------------------------------------------------------
[ATENDIMENTOS]
Cliente possui um total de 0 atendimentos nos ultimos 3 meses
---------------------------------------------------------------------------------------------------------
[INFORMAÇÕES PARA A OS]
---------------------------------------------------------------------------------------------------------`
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


            if (templates[nome]) {
                await navigator.clipboard.writeText(templates[nome]);
            }

            const inputMotivo = document.querySelector('input[formcontrolname="descri_mvis"]');
            const atual = inputMotivo?.value?.trim();



            const btnMudar = Array.from(document.querySelectorAll('a.ui-menuitem-link'))
                .find(a => a.innerText.trim() === 'Mudar');
            if (!btnMudar) return;
            btnMudar.click();
            await esperar(300);


            const catItem = Array.from(document.querySelectorAll('li.ui-menuitem'))
                .find(li => li.querySelector('span.ui-menuitem-text')?.innerText.trim() === 'Categoria');
            if (catItem) {
                catItem.querySelector('a.ui-menuitem-link').click();
                await esperar(300);
                const tecnico = Array.from(catItem.querySelectorAll('p-menubarsub ul.ui-submenu-list li.ui-menuitem'))
                    .find(li => li.querySelector('span.ui-menuitem-text')?.innerText.trim() === 'Técnico');
                if (tecnico) {
                    tecnico.querySelector('a.ui-menuitem-link').click();
                    await esperar(300);
                }
            }


            if (atual !== motivoLabel) {
                const motItem = Array.from(document.querySelectorAll('li.ui-menuitem'))
                    .find(li => li.querySelector('span.ui-menuitem-text')?.innerText.trim() === 'Motivo');
                if (motItem) {
                    motItem.querySelector('a.ui-menuitem-link').click();
                    await esperar(300);
                    const trg = document.querySelector('.ui-dropdown-trigger');
                    if (trg) {
                        trg.click();
                        await esperar(300);
                        const escolha = Array.from(document.querySelectorAll('.ui-dropdown-item'))
                            .find(el => el.innerText.trim() === motivoLabel);
                        if (escolha) {
                            escolha.click();
                            await esperar(300);
                        }
                    }
                }
            }

            const btnSalvar = document.querySelector('div.modal-footer button.btn-success');
            if (btnSalvar) {
                btnSalvar.click();
            }
        };

        return btn;
    }

    function inserirBotoes() {
        const motivoCampo = document.querySelector('input[formcontrolname="descri_mvis"]');
        if (!motivoCampo || document.querySelector('#btn-alterar-motivo')) return;

        const container = document.createElement('div');
        container.id = 'btn-alterar-motivo';
        container.style.margin = '15px 0';

        Object.entries(motivos).forEach(([nome, label]) => {
            container.appendChild(criarBotao(nome, label));
        });

        motivoCampo.parentElement.prepend(container);
    }

    new MutationObserver(inserirBotoes)
        .observe(document.body, { childList: true, subtree: true });
})();

(function() {
    'use strict';

    const delay = ms => new Promise(res => setTimeout(res, ms));

    function clickSpan(text) {
        const el = Array.from(document.querySelectorAll('span.ng-star-inserted'))
            .find(e => e.textContent.trim() === text);
        if (el) el.click();
        else console.warn(`span '${text}' não encontrado`);
    }

    async function selectDropdown(formcontrolname, optionLabel) {
        const dropdown = document.querySelector(`p-dropdown[formcontrolname="${formcontrolname}"]`);
        if (!dropdown) return console.warn(`dropdown ${formcontrolname} não encontrado`);
        const trigger = dropdown.querySelector('.ui-dropdown-trigger');
        if (!trigger) return console.warn(`trigger ${formcontrolname} não encontrado`);
        trigger.click();
        await delay(300);
        const item = Array.from(document.querySelectorAll('li.ui-dropdown-item'))
            .find(li => li.getAttribute('aria-label') === optionLabel);
        if (item) item.click();
        else console.warn(`item '${optionLabel}' no ${formcontrolname} não encontrado`);
        await delay(200);
    }

    const flows = {
        semAcessoSuporte: async () => {
            clickSpan('SUPORTE TÉCNICO RESIDENCIAL');
            await delay(100);
            clickSpan('SUPORTE TÉCNICO - PF');
            await delay(300);
            await selectDropdown('codcatoco', 'Técnico');
            await selectDropdown('codmvis', 'SUP - Sem conexão/Indisponibilidade');
        },
        semAcessoDigital: async () => {
            clickSpan('SUPORTE TÉCNICO RESIDENCIAL');
            await delay(100);
            clickSpan('SUPORTE TÉCNICO - PF');
            await delay(300);
            await selectDropdown('codcatoco', 'Técnico');
            await selectDropdown('codmvis', 'SUP - Sem conexão/Indisponibilidade');
            await selectDropdown('user_cargo', 'CSA - Digital');
        },
        lentidaoSuporte: async () => {
            clickSpan('SUPORTE TÉCNICO RESIDENCIAL');
            await delay(100);
            clickSpan('SUPORTE TÉCNICO - PF');
            await delay(300);
            await selectDropdown('codcatoco', 'Técnico');
            await selectDropdown('codmvis', 'SUP - Lentidão');
        },
        lentidaoDigital: async () => {
            clickSpan('SUPORTE TÉCNICO RESIDENCIAL');
            await delay(100);
            clickSpan('SUPORTE TÉCNICO - PF');
            await delay(300);
            await selectDropdown('codcatoco', 'Técnico');
            await selectDropdown('codmvis', 'SUP - Lentidão');
            await selectDropdown('user_cargo', 'CSA - Digital');
        },
        senhaWifi: async () => {
            clickSpan('SUPORTE TÉCNICO RESIDENCIAL');
            await delay(100);
            clickSpan('SUPORTE TÉCNICO - PF');
            await delay(300);
            await selectDropdown('codcatoco', 'Técnico');
            await selectDropdown('codmvis', 'SUP - Troca /informações senha Wifi');
            await selectDropdown('user_cargo', 'CSA - Digital');
        }
    };

    function createPanel() {
        const container = document.querySelector('div.box-formulario');
        if (!container || document.getElementById('tm-panel')) return;
        const panel = document.createElement('div');
        panel.id = 'tm-panel';
        panel.style.cssText = 'margin:10px 0; padding:4px 0; border:none; display:flex; flex-wrap:wrap; gap:8px';

        Object.entries({
            'Sem Acesso Suporte':'semAcessoSuporte',
            'Sem Acesso Digital':'semAcessoDigital',
            'Lentidão Suporte':'lentidaoSuporte',
            'Lentidão Digital':'lentidaoDigital',
            'Senha Wi-Fi':'senhaWifi'
        }).forEach(([label, key]) => {
            const btn = document.createElement('button');
            btn.textContent = label;
            btn.className = 'btn btn-primary';
            btn.style.fontSize = '13px';
            btn.style.padding = '4px 10px';
            btn.addEventListener('click', flows[key]);
            panel.appendChild(btn);
        });
        container.prepend(panel);
    }

    new MutationObserver(createPanel).observe(document.body, { childList: true, subtree: true });
    window.addEventListener('hashchange', () => setTimeout(createPanel, 300));
    setTimeout(createPanel, 500);
})();

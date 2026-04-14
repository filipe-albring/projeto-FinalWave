document.addEventListener('DOMContentLoaded', () => {
    const storageKeyTema = 'finalwave-theme';
    const root = document.documentElement;
    const themeToggles = document.querySelectorAll('[data-theme-toggle]');
    const btnContainer = document.getElementById('btn-container');
    const header = document.getElementById('menu-superior');
    const heroSection = document.getElementById('inicio');
    const heroBgLayers = [
        document.querySelector('.hero-bg-a'),
        document.querySelector('.hero-bg-b')
    ].filter(Boolean);
    const distanciaHeader = 15;
    const intervaloTrocaMs = 5000;
    const fundosHero = [
        'imgs/fundo1.png',
        'imgs/fundo2.png',
        'imgs/fundo3.png',
        'imgs/fundo4.png',
        'imgs/fundo5.png',
        'imgs/fundo6.png'
    ];
    let ultimoFundo = '';
    let indiceLayerAtiva = 0;

    function lerTemaSalvo() {
        try {
            const tema = window.localStorage.getItem(storageKeyTema);

            if (tema === 'light' || tema === 'dark') {
                return tema;
            }
        } catch (error) {}

        return root.dataset.theme === 'light' ? 'light' : 'dark';
    }

    function salvarTema(tema) {
        try {
            window.localStorage.setItem(storageKeyTema, tema);
        } catch (error) {}
    }

    function atualizarBotoesTema(temaAtual) {
        const proximoTema = temaAtual === 'light' ? 'dark' : 'light';
        const proximoRotulo = proximoTema === 'light' ? 'MODO CLARO' : 'MODO ESCURO';
        const proximoTitulo = proximoTema === 'light' ? 'Ativar tema claro' : 'Ativar tema escuro';

        themeToggles.forEach((toggle) => {
            const label = toggle.querySelector('[data-theme-label]');

            toggle.setAttribute('aria-pressed', String(temaAtual === 'light'));
            toggle.setAttribute('title', proximoTitulo);

            if (label) {
                label.textContent = proximoRotulo;
            }
        });
    }

    function atualizarOffsetHeader() {
        if (!header) return;

        const limiteFixacao = header.offsetHeight + distanciaHeader;
        root.style.setProperty('--cta-top-offset', `${limiteFixacao}px`);
        root.style.setProperty('--hero-top-offset', `${header.offsetHeight}px`);
    }

    function checarPosicaoBotao() {
        if (!btnContainer || !header) return;

        const topoDoContainer = btnContainer.getBoundingClientRect().top;
        const limiteFixacao = header.offsetHeight + distanciaHeader;

        if (topoDoContainer <= limiteFixacao) {
            btnContainer.classList.add('fixado-topo');
        } else {
            btnContainer.classList.remove('fixado-topo');
        }
    }

    function montarBackgroundHero(caminhoFundo) {
        const estilos = getComputedStyle(root);
        const overlayTopo = estilos.getPropertyValue('--hero-overlay-top').trim();
        const overlayBase = estilos.getPropertyValue('--hero-overlay-bottom').trim();

        return `linear-gradient(${overlayTopo}, ${overlayBase}), url("${caminhoFundo}")`;
    }

    function sincronizarFundoHeroComTema() {
        if (!heroSection || !ultimoFundo) return;

        if (heroBgLayers.length < 2) {
            heroSection.style.backgroundImage = montarBackgroundHero(ultimoFundo);
            return;
        }

        const layerAtiva = heroBgLayers[indiceLayerAtiva];

        if (layerAtiva) {
            layerAtiva.style.backgroundImage = montarBackgroundHero(ultimoFundo);
        }
    }

    function aplicarTema(tema, salvarPreferencia = true) {
        const temaNormalizado = tema === 'light' ? 'light' : 'dark';

        root.dataset.theme = temaNormalizado;
        root.style.colorScheme = temaNormalizado;
        atualizarBotoesTema(temaNormalizado);
        sincronizarFundoHeroComTema();

        if (salvarPreferencia) {
            salvarTema(temaNormalizado);
        }
    }

    function aplicarFundoHero(caminhoFundo) {
        if (!heroSection) return;

        if (heroBgLayers.length < 2) {
            heroSection.style.backgroundImage = montarBackgroundHero(caminhoFundo);
            ultimoFundo = caminhoFundo;
            return;
        }

        const proximaLayerIndex = indiceLayerAtiva === 0 ? 1 : 0;
        const layerAtual = heroBgLayers[indiceLayerAtiva];
        const proximaLayer = heroBgLayers[proximaLayerIndex];

        proximaLayer.style.backgroundImage = montarBackgroundHero(caminhoFundo);

        requestAnimationFrame(() => {
            proximaLayer.classList.add('ativa');
            layerAtual.classList.remove('ativa');
            indiceLayerAtiva = proximaLayerIndex;
        });

        ultimoFundo = caminhoFundo;
    }

    function definirFundoInicial() {
        if (!heroSection || fundosHero.length === 0) return;

        const indiceInicial = Math.floor(Math.random() * fundosHero.length);
        const fundoInicial = fundosHero[indiceInicial];

        if (heroBgLayers.length >= 2) {
            heroBgLayers[0].style.backgroundImage = montarBackgroundHero(fundoInicial);
            heroBgLayers[0].classList.add('ativa');
            heroSection.style.backgroundImage = 'none';
            indiceLayerAtiva = 0;
            ultimoFundo = fundoInicial;
            return;
        }

        heroSection.style.backgroundImage = montarBackgroundHero(fundoInicial);
        ultimoFundo = fundoInicial;
    }

    function sortearNovoFundo() {
        if (!heroSection || fundosHero.length === 0) return;

        let opcoesDisponiveis = fundosHero;

        if (fundosHero.length > 1 && ultimoFundo) {
            opcoesDisponiveis = fundosHero.filter((fundo) => fundo !== ultimoFundo);
        }

        const indiceAleatorio = Math.floor(Math.random() * opcoesDisponiveis.length);
        aplicarFundoHero(opcoesDisponiveis[indiceAleatorio]);
    }

    function precarregarFundos() {
        fundosHero.forEach((fundo) => {
            const imagem = new Image();
            imagem.src = fundo;
        });
    }

    aplicarTema(lerTemaSalvo(), false);

    themeToggles.forEach((toggle) => {
        toggle.addEventListener('click', () => {
            const proximoTema = root.dataset.theme === 'light' ? 'dark' : 'light';
            aplicarTema(proximoTema);
        });
    });

    atualizarOffsetHeader();
    window.addEventListener('scroll', checarPosicaoBotao);
    window.addEventListener('resize', () => {
        atualizarOffsetHeader();
        checarPosicaoBotao();
    });
    checarPosicaoBotao();

    if (heroSection) {
        precarregarFundos();
        definirFundoInicial();
        window.setInterval(sortearNovoFundo, intervaloTrocaMs);
    }
});

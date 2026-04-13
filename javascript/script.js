document.addEventListener('DOMContentLoaded', () => {
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
        return `linear-gradient(rgba(10, 10, 10, 0.35), rgba(10, 10, 10, 0.72)), url("${caminhoFundo}")`;
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

    precarregarFundos();
    definirFundoInicial();
    window.addEventListener('scroll', checarPosicaoBotao);
    window.addEventListener('resize', checarPosicaoBotao);
    checarPosicaoBotao();
    window.setInterval(sortearNovoFundo, intervaloTrocaMs);
});

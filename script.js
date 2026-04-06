// Aguarda o carregamento completo do HTML antes de executar o script
document.addEventListener('DOMContentLoaded', () => {
    
    const btnContainer = document.getElementById('btn-container');
    const heroSection = document.getElementById('inicio');
    const header = document.getElementById('menu-superior');

    // Função que checa a posição do scroll da página
    function checarPosicaoBotao() {
        // Pega as dimensões da seção Hero (primeira tela)
        const heroRect = heroSection.getBoundingClientRect();
        // Altura do menu superior
        const headerHeight = header.offsetHeight;
        
        // Se a base da primeira tela encostar ou passar da altura do menu + espaço extra
        // significa que o usuário "passou" da primeira tela.
        if (heroRect.bottom <= headerHeight + 85) {
            // Adiciona a classe que fixa o botão no topo da tela
            btnContainer.classList.add('fixado-topo');
        } else {
            // Remove a classe, devolvendo o botão para a base da primeira tela
            btnContainer.classList.remove('fixado-topo');
        }
    }

    // Monitora o evento de rolagem (scroll) do mouse/toque na tela
    window.addEventListener('scroll', checarPosicaoBotao);
    
    // Roda a checagem uma vez ao carregar, caso o usuário recarregue a página já no meio dela
    checarPosicaoBotao();
});
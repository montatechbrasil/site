// Galeria Interativa - Lightbox
document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const closeBtn = document.querySelector('.lightbox-close');

    // Função para obter o texto da legenda
    function getCaption(item) {
        const overlay = item.querySelector('.gallery-overlay');
        const badge = overlay.querySelector('.gallery-badge')?.innerText || '';
        const title = overlay.querySelector('h3')?.innerText || '';
        const desc = overlay.querySelector('p')?.innerText || '';
        
        return `${badge} - ${title}${desc ? ': ' + desc : ''}`;
    }

    // Abrir lightbox ao clicar na imagem
    galleryItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const imgSrc = this.getAttribute('data-image');
            const caption = getCaption(this);
            
            lightboxImg.src = imgSrc;
            lightboxCaption.textContent = caption;
            lightbox.style.display = 'block';
            
            // Prevenir scroll do body
            document.body.style.overflow = 'hidden';
        });
    });

    // Fechar lightbox
    function closeLightbox() {
        lightbox.style.display = 'none';
        lightboxImg.src = '';
        lightboxCaption.textContent = '';
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeLightbox);
    
    // Fechar ao clicar fora da imagem
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Fechar com tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.style.display === 'block') {
            closeLightbox();
        }
    });

    // Lazy loading adicional para melhor performance
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src') || img.src;
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('.gallery-item img').forEach(img => {
            imageObserver.observe(img);
        });
    }
});

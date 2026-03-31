// ============================================
// GALERIA CARROSSEL COM LIGHTBOX NAVEGÁVEL
// ============================================

class CarrosselGaleria {
    constructor() {
        this.container = document.getElementById('carouselContainer');
        this.track = document.getElementById('carouselTrack');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.dotsContainer = document.getElementById('carouselDots');
        
        this.images = IMAGENS.slice(0, MAX_IMAGENS);
        this.currentIndex = 0;
        
        this.isDragging = false;
        this.startX = 0;
        this.scrollLeft = 0;
        this.autoplayInterval = null;
        this.isAutoplayActive = true;
        this.autoplaySpeed = 3000;
        
        this.init();
    }
    
    init() {
        this.createGallery();
        this.createDots();
        this.updateActiveDot();
        this.setupEventListeners();
        this.startAutoplay();
    }
    
    createGallery() {
        this.track.innerHTML = '';
        
        this.images.forEach((img, index) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            slide.setAttribute('data-index', index);
            
            slide.innerHTML = `
                <img src="${img.url}" 
                     alt="${img.titulo || 'Montagem de móveis'}"
                     title="${img.titulo || ''}"
                     loading="lazy"
                     width="640"
                     height="480">
                ${MOSTRAR_TEXTO ? `
                <div class="slide-info">
                    <span class="slide-badge">Trabalho Realizado</span>
                    <h3>${img.titulo || 'Montagem Profissional'}</h3>
                    <p>${img.descricao || 'Montagem em Valparaíso de Goiás'}</p>
                </div>
                ` : ''}
            `;
            
            this.track.appendChild(slide);
        });
    }
    
    createDots() {
        const slideCount = this.images.length;
        this.dotsContainer.innerHTML = '';
        
        for (let i = 0; i < slideCount; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            dot.addEventListener('click', () => this.scrollToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
    }
    
    updateActiveDot() {
        const scrollPosition = this.container.scrollLeft;
        const firstSlide = this.track.children[0];
        if (!firstSlide) return;
        
        const slideWidth = firstSlide.offsetWidth + 20;
        const activeIndex = Math.round(scrollPosition / slideWidth);
        
        const dots = this.dotsContainer.children;
        Array.from(dots).forEach((dot, index) => {
            dot.classList.toggle('active', index === activeIndex);
        });
    }
    
    scrollToSlide(index) {
        const firstSlide = this.track.children[0];
        if (!firstSlide) return;
        
        const slideWidth = firstSlide.offsetWidth + 20;
        this.container.scrollTo({
            left: slideWidth * index,
            behavior: 'smooth'
        });
    }
    
    scrollNext() {
        const firstSlide = this.track.children[0];
        if (!firstSlide) return;
        
        const slideWidth = firstSlide.offsetWidth + 20;
        const currentScroll = this.container.scrollLeft;
        const maxScroll = this.container.scrollWidth - this.container.clientWidth;
        let newScroll = currentScroll + slideWidth;
        
        if (newScroll > maxScroll) {
            newScroll = 0;
        }
        
        this.container.scrollTo({
            left: newScroll,
            behavior: 'smooth'
        });
    }
    
    scrollPrev() {
        const firstSlide = this.track.children[0];
        if (!firstSlide) return;
        
        const slideWidth = firstSlide.offsetWidth + 20;
        const currentScroll = this.container.scrollLeft;
        let newScroll = currentScroll - slideWidth;
        
        if (newScroll < 0) {
            newScroll = this.container.scrollWidth - this.container.clientWidth;
        }
        
        this.container.scrollTo({
            left: newScroll,
            behavior: 'smooth'
        });
    }
    
    startAutoplay() {
        if (this.autoplayInterval) clearInterval(this.autoplayInterval);
        
        this.autoplayInterval = setInterval(() => {
            if (this.isAutoplayActive && !this.isDragging) {
                this.scrollNext();
            }
        }, this.autoplaySpeed);
    }
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
    
    // Lightbox com navegação
    openLightbox(index) {
        this.currentIndex = index;
        this.updateLightboxImage();
        
        const lightbox = document.getElementById('lightbox');
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    updateLightboxImage() {
        const img = this.images[this.currentIndex];
        const lightboxImg = document.getElementById('lightboxImg');
        const lightboxCaption = document.getElementById('lightboxCaption');
        
        // Pega a URL sem os parâmetros de redimensionamento para o lightbox
        const fullUrl = img.url.replace('w_640,h_480,c_fill,q_auto,f_auto/', '');
        lightboxImg.src = fullUrl;
        
        if (MOSTRAR_TEXTO && img.titulo) {
            lightboxCaption.textContent = `${img.titulo}${img.descricao ? ' - ' + img.descricao : ''}`;
        } else {
            lightboxCaption.textContent = 'MontaTech Brasil - Montagem de Móveis';
        }
    }
    
    nextLightboxImage() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateLightboxImage();
    }
    
    prevLightboxImage() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateLightboxImage();
    }
    
    closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
    }
    
    setupEventListeners() {
        // Botões do carrossel
        this.prevBtn.addEventListener('click', () => {
            this.stopAutoplay();
            this.scrollPrev();
            if (this.isAutoplayActive) this.startAutoplay();
        });
        
        this.nextBtn.addEventListener('click', () => {
            this.stopAutoplay();
            this.scrollNext();
            if (this.isAutoplayActive) this.startAutoplay();
        });
        
        // Drag com mouse
        this.container.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.startX = e.pageX - this.container.offsetLeft;
            this.scrollLeft = this.container.scrollLeft;
            this.container.style.cursor = 'grabbing';
            this.stopAutoplay();
        });
        
        this.container.addEventListener('mouseleave', () => {
            this.isDragging = false;
            this.container.style.cursor = 'grab';
            if (this.isAutoplayActive && !this.autoplayInterval) this.startAutoplay();
        });
        
        this.container.addEventListener('mouseup', () => {
            this.isDragging = false;
            this.container.style.cursor = 'grab';
            if (this.isAutoplayActive && !this.autoplayInterval) this.startAutoplay();
        });
        
        this.container.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            e.preventDefault();
            const x = e.pageX - this.container.offsetLeft;
            const walk = (x - this.startX) * 2;
            this.container.scrollLeft = this.scrollLeft - walk;
        });
        
        // Touch para mobile
        this.container.addEventListener('touchstart', (e) => {
            this.isDragging = true;
            this.startX = e.touches[0].pageX - this.container.offsetLeft;
            this.scrollLeft = this.container.scrollLeft;
            this.stopAutoplay();
        });
        
        this.container.addEventListener('touchend', () => {
            this.isDragging = false;
            if (this.isAutoplayActive && !this.autoplayInterval) this.startAutoplay();
        });
        
        this.container.addEventListener('touchmove', (e) => {
            if (!this.isDragging) return;
            const x = e.touches[0].pageX - this.container.offsetLeft;
            const walk = (x - this.startX) * 2;
            this.container.scrollLeft = this.scrollLeft - walk;
        });
        
        this.container.addEventListener('scroll', () => {
            this.updateActiveDot();
        });
        
        // Abrir lightbox ao clicar no slide
        this.track.addEventListener('click', (e) => {
            const slide = e.target.closest('.carousel-slide');
            if (slide) {
                const index = parseInt(slide.getAttribute('data-index'));
                this.openLightbox(index);
            }
        });
        
        // Controles do lightbox
        const lightbox = document.getElementById('lightbox');
        const closeBtn = document.querySelector('.lightbox-close');
        const prevLightbox = document.getElementById('lightboxPrev');
        const nextLightbox = document.getElementById('lightboxNext');
        
        closeBtn.addEventListener('click', () => this.closeLightbox());
        prevLightbox.addEventListener('click', () => this.prevLightboxImage());
        nextLightbox.addEventListener('click', () => this.nextLightboxImage());
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) this.closeLightbox();
        });
        
        document.addEventListener('keydown', (e) => {
            if (lightbox.style.display !== 'block') return;
            
            if (e.key === 'Escape') this.closeLightbox();
            if (e.key === 'ArrowLeft') this.prevLightboxImage();
            if (e.key === 'ArrowRight') this.nextLightboxImage();
        });
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    new CarrosselGaleria();
});

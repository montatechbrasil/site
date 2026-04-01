class CarrosselGaleria {
    constructor() {
        this.container = document.getElementById('carouselContainer');
        this.track = document.getElementById('carouselTrack');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.dotsContainer = document.getElementById('carouselDots');
        
        this.isDragging = false;
        this.startX = 0;
        this.scrollLeft = 0;
        this.autoplayInterval = null;
        this.isAutoplayActive = true;
        this.autoplaySpeed = 3000;
        
        // Para o lightbox com navegação
        this.currentImageIndex = 0;
        this.totalImages = 0;
        
        this.init();
    }
    
    init() {
        this.createDots();
        this.updateActiveDot();
        this.setupEventListeners();
        this.startAutoplay();
        this.totalImages = this.track.children.length;
    }
    
    createDots() {
        const slides = this.track.children;
        const slideCount = slides.length;
        
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
    
    // ========== LIGHTBOX COM NAVEGAÇÃO ==========
    openLightbox(index) {
        this.currentImageIndex = index;
        this.updateLightboxImage();
        
        const lightbox = document.getElementById('lightbox');
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    updateLightboxImage() {
        const slide = this.track.children[this.currentImageIndex];
        if (!slide) return;
        
        const img = slide.querySelector('img');
        const info = slide.querySelector('.slide-info');
        const lightboxImg = document.getElementById('lightboxImg');
        const lightboxCaption = document.getElementById('lightboxCaption');
        
        // Pega a URL original sem redimensionamento para o lightbox
        let fullUrl = img.src;
        fullUrl = fullUrl.replace('w_640,h_480,c_fill,q_auto,f_auto/', '');
        lightboxImg.src = fullUrl;
        
        // Pega o texto se existir
        if (info) {
            const badge = info.querySelector('.slide-badge')?.innerText || '';
            const title = info.querySelector('h3')?.innerText || '';
            const desc = info.querySelector('p')?.innerText || '';
            lightboxCaption.textContent = `${badge}${badge && title ? ' - ' : ''}${title}${desc ? ': ' + desc : ''}`;
        } else {
            lightboxCaption.textContent = 'MontaTech Brasil - Montagem de Móveis';
        }
    }
    
    nextLightboxImage() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.totalImages;
        this.updateLightboxImage();
    }
    
    prevLightboxImage() {
        this.currentImageIndex = (this.currentImageIndex - 1 + this.totalImages) % this.totalImages;
        this.updateLightboxImage();
    }
    
    closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
    }
    // ==========================================
    
    setupEventListeners() {
        // Botões de navegação do carrossel
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
        
        // Drag/Swipe com mouse
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
        
        // Touch/Swipe para mobile
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
        
        // Atualizar dots ao rolar
        this.container.addEventListener('scroll', () => {
            this.updateActiveDot();
        });
        
        // Abrir lightbox ao clicar nos slides
        this.track.addEventListener('click', (e) => {
            const slide = e.target.closest('.carousel-slide');
            if (slide) {
                const index = Array.from(this.track.children).indexOf(slide);
                this.openLightbox(index);
            }
        });
        
        // ========== CONTROLES DO LIGHTBOX ==========
        const lightbox = document.getElementById('lightbox');
        const closeBtn = document.querySelector('.lightbox-close');
        const prevLightbox = document.getElementById('lightboxPrev');
        const nextLightbox = document.getElementById('lightboxNext');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeLightbox());
        }
        
        if (prevLightbox) {
            prevLightbox.addEventListener('click', () => this.prevLightboxImage());
        }
        
        if (nextLightbox) {
            nextLightbox.addEventListener('click', () => this.nextLightboxImage());
        }
        
        if (lightbox) {
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) this.closeLightbox();
            });
        }
        
        // Teclado: ESC fecha, ← → navega
        document.addEventListener('keydown', (e) => {
            const lightbox = document.getElementById('lightbox');
            if (!lightbox || lightbox.style.display !== 'block') return;
            
            if (e.key === 'Escape') this.closeLightbox();
            if (e.key === 'ArrowLeft') this.prevLightboxImage();
            if (e.key === 'ArrowRight') this.nextLightboxImage();
        });
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new CarrosselGaleria();
});

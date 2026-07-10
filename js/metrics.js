// ============================================
// MÉTRICAS - Google Analytics & Ads
// MontaTech Brasil - Carregamento Atrasado
// ============================================
(function() {
    setTimeout(function() {
        const scripts = [
            'https://www.googletagmanager.com/gtag/js?id=G-71WQ023PX4',
            'https://www.googletagmanager.com/gtag/js?id=AW-17641071678'
        ];
        
        scripts.forEach(function(src) {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            document.head.appendChild(script);
        });
        
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-71WQ023PX4');
        gtag('config', 'AW-17641071678');
    }, 4000);
})();

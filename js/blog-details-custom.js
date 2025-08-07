// 스크롤 확대 효과
document.addEventListener('DOMContentLoaded', function() {
    // 배경 이미지 설정
    const bgElements = document.querySelectorAll('[data-bg]');
    bgElements.forEach(function(element) {
        const bgImage = element.getAttribute('data-bg');
        if (bgImage) {
            element.style.backgroundImage = 'url(' + bgImage + ')';
        }
    });
    
    // 스크롤 확대 효과
    const scrollZoomElements = document.querySelectorAll('.scroll-zoom-in');
    
    window.addEventListener('scroll', function() {
        scrollZoomElements.forEach(function(element) {
            const scrollPosition = window.pageYOffset;
            const zoomLevel = 1 + scrollPosition * 0.0005;
            element.style.transform = 'scale(' + zoomLevel + ')';
        });
    });
});
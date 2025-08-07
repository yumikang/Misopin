// 스크롤 확대 효과
document.addEventListener('DOMContentLoaded', function() {
    const scrollZoomElements = document.querySelectorAll('.scroll-zoom-in');
    
    window.addEventListener('scroll', function() {
        scrollZoomElements.forEach(function(element) {
            const scrollPosition = window.pageYOffset;
            const zoomLevel = 1 + scrollPosition * 0.0005;
            element.style.transform = 'scale(' + zoomLevel + ')';
        });
    });
});
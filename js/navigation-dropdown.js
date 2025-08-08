// 네비게이션 드롭다운 메뉴 JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // 스크롤시 헤더 스타일 변경
    const header = document.getElementById('header') || document.querySelector('.header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // 서브메뉴 링크 클릭 이벤트 활성화 (데스크톱)
    const submenuLinks = document.querySelectorAll('.submenu li a');
    submenuLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            // 링크가 # 이 아닌 경우에만 페이지 이동
            if (this.getAttribute('href') && this.getAttribute('href') !== '#') {
                e.stopPropagation(); // 이벤트 버블링 방지
                // 기본 동작 허용 (페이지 이동)
            } else {
                e.preventDefault();
            }
        });
    });
    
    // 모바일 드롭다운 메뉴 토글
    if (window.innerWidth <= 768) {
        const submenuParents = document.querySelectorAll('.has-submenu > a');
        
        submenuParents.forEach(function(parent) {
            parent.addEventListener('click', function(e) {
                e.preventDefault();
                const submenu = this.nextElementSibling;
                const parentLi = this.parentElement;
                
                // 다른 서브메뉴 닫기
                document.querySelectorAll('.has-submenu').forEach(function(li) {
                    if (li !== parentLi) {
                        li.classList.remove('active');
                        const otherSubmenu = li.querySelector('.submenu');
                        if (otherSubmenu) {
                            otherSubmenu.style.display = 'none';
                        }
                    }
                });
                
                // 현재 서브메뉴 토글
                parentLi.classList.toggle('active');
                if (submenu) {
                    submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
                }
            });
        });
    }
    
    // 드롭다운 외부 클릭시 닫기
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.menu_list')) {
            document.querySelectorAll('.has-submenu').forEach(function(li) {
                li.classList.remove('active');
                const submenu = li.querySelector('.submenu');
                if (submenu && window.innerWidth <= 768) {
                    submenu.style.display = 'none';
                }
            });
        }
    });
});
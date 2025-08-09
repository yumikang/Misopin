// mi_about_runtime_fix.js - 모바일 ScrollTrigger 애니메이션 완전 복구
// about.min.js 이후에 실행되어야 함

(function() {
  'use strict';
  
  // GSAP과 ScrollTrigger가 로드되었는지 확인
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP or ScrollTrigger not loaded');
    return;
  }

  // 모바일 여부 확인
  const isMobile = window.innerWidth <= 1000;
  
  // 1) ScrollTrigger 기본 설정
  gsap.registerPlugin(ScrollTrigger);
  
  // 모바일 주소창 리사이즈 노이즈 무시
  ScrollTrigger.config({ 
    ignoreMobileResize: true,
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load,resize"
  });

  // 2) 모든 애니메이션 요소들을 초기화하고 재설정
  function initAllAnimations() {
    
    // SplitText가 있는지 확인
    const hasSplitText = typeof SplitText !== 'undefined';
    
    // .t_split 텍스트 분할 애니메이션
    const splitElements = document.querySelectorAll('.t_split, .h2.t_split, .h3.t_split');
    splitElements.forEach(el => {
      if (!el._gsapInitialized) {
        el._gsapInitialized = true;
        
        // PC와 동일한 애니메이션 설정
        if (hasSplitText) {
          const split = new SplitText(el, {type: "lines, words, chars"});
          
          gsap.set(el, {perspective: 200});
          gsap.from(split.lines, {
            opacity: 0,
            duration: 1.25,
            y: 250,
            scaleY: 2,
            stagger: 0.15,
            transformOrigin: "0% 0% 0%",
            rotation: 15,
            rotationX: -45,
            ease: "power3",
            scrollTrigger: {
              trigger: el,
              start: isMobile ? "top bottom-=100" : "top bottom-=200",
              once: true,
              invalidateOnRefresh: true
            }
          });
        } else {
          // SplitText 없이 기본 애니메이션
          gsap.from(el, {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: isMobile ? "top bottom-=50" : "top bottom-=100",
              once: true
            }
          });
        }
      }
    });

    // .t_split_up 텍스트 애니메이션
    const splitUpElements = document.querySelectorAll('.t_split_up, .txt.t_split_up');
    splitUpElements.forEach(el => {
      if (!el._gsapInitialized) {
        el._gsapInitialized = true;
        
        if (hasSplitText) {
          const split = new SplitText(el, {type: "lines, words"});
          
          gsap.from(split.words, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            stagger: 0.02,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: isMobile ? "top bottom-=50" : "top bottom-=100",
              once: true
            }
          });
        } else {
          gsap.from(el, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: isMobile ? "top bottom-=50" : "top bottom-=100",
              once: true
            }
          });
        }
      }
    });

    // .up 클래스 애니메이션 (이미지, 텍스트 등)
    const upElements = document.querySelectorAll('.up, .d_img.up, .txt.up, .t.up');
    upElements.forEach(el => {
      if (!el._gsapInitialized) {
        el._gsapInitialized = true;
        
        gsap.fromTo(el, 
          {
            y: 25,
            autoAlpha: 0
          },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1.25,
            ease: "power1.inOut",
            scrollTrigger: {
              trigger: el,
              start: isMobile ? "top bottom-=50" : "center bottom",
              end: "center center",
              once: true
            }
          }
        );
      }
    });

    // .h2m 애니메이션 (특별한 헤딩)
    const h2mElements = document.querySelectorAll('.h2m');
    h2mElements.forEach(el => {
      if (!el._gsapInitialized) {
        el._gsapInitialized = true;
        
        const letters = el.querySelectorAll('.h2ltr');
        if (letters.length > 0) {
          gsap.from(letters, {
            y: 20,
            x: 50,
            rotation: 30,
            rotationX: 90,
            opacity: 0,
            duration: 1,
            stagger: 0.025,
            transformOrigin: "0% 100%",
            ease: "Quint.easeOut",
            scrollTrigger: {
              trigger: el,
              start: isMobile ? "top bottom-=100" : "top center",
              once: true
            }
          });
        }
      }
    });

    // .lnk_rtt 링크 회전 애니메이션
    const linkElements = document.querySelectorAll('.lnk_rtt');
    linkElements.forEach(el => {
      if (!el._gsapInitialized) {
        el._gsapInitialized = true;
        
        gsap.set(el, {y: 20, rotation: 15, opacity: 0});
        gsap.to(el, {
          y: 0,
          rotation: 0,
          opacity: 1,
          duration: 1,
          transformOrigin: "0% 100%",
          ease: "Quint.easeOut",
          scrollTrigger: {
            trigger: el,
            start: isMobile ? "top bottom-=150" : "top bottom-=300",
            once: true
          }
        });
      }
    });

    // PC 갤러리 이미지 패럴랙스 효과
    if (document.querySelector('.glry_rows')) {
      const glryRows = document.querySelector('.glry_rows');
      const topCols = glryRows.querySelectorAll('.cols_tp');
      const bottomCols = glryRows.querySelectorAll('.cols_bp');
      
      if (topCols.length || bottomCols.length) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: glryRows,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
        
        if (topCols.length) {
          tl.to(topCols, {
            y: isMobile ? -45 : -145,
            ease: "none"
          }, 0);
        }
        
        if (bottomCols.length) {
          tl.to(bottomCols, {
            y: isMobile ? 45 : 145,
            ease: "none"
          }, 0);
        }
      }
    }

    // 모바일 갤러리 이미지 애니메이션 (mob_glry_rows)
    if (document.querySelector('.mob_glry_rows')) {
      const mobGlryRows = document.querySelector('.mob_glry_rows');
      const images = mobGlryRows.querySelectorAll('.lt_col_img');
      
      if (images.length > 0) {
        // 각 이미지에 개별 애니메이션 적용
        images.forEach((img, index) => {
          // 초기 상태 설정
          gsap.set(img, {
            opacity: 0,
            y: 30,
            scale: 0.95
          });
          
          // 스크롤 트리거 애니메이션
          gsap.to(img, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: img,
              start: "top bottom-=100",
              once: true
            }
          });
        });
        
        // 전체 컨테이너에 패럴랙스 효과 추가 (선택사항)
        if (isMobile) {
          gsap.to(mobGlryRows, {
            y: -50,
            ease: "none",
            scrollTrigger: {
              trigger: mobGlryRows,
              start: "top bottom",
              end: "bottom top",
              scrub: 1
            }
          });
        }
      }
    }

    // ms_bg 섹션 특별 애니메이션
    const msBgSection = document.querySelector('.ms_bg');
    if (msBgSection && !msBgSection._gsapInitialized) {
      msBgSection._gsapInitialized = true;
      
      // 이미지 애니메이션
      const images = msBgSection.querySelectorAll('.d_img');
      images.forEach((img, index) => {
        gsap.from(img, {
          scale: 0.8,
          opacity: 0,
          duration: 1,
          delay: index * 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: img,
            start: isMobile ? "top bottom-=50" : "top bottom-=100",
            once: true
          }
        });
      });
    }

    // choose_gift_coupon 카드 애니메이션
    const giftCard = document.querySelector('.gift_card');
    if (giftCard && !isMobile && !giftCard._gsapInitialized) {
      giftCard._gsapInitialized = true;
      
      gsap.to(giftCard, {
        y: "200px",
        ease: "none",
        scrollTrigger: {
          trigger: ".gc01",
          start: "top bottom",
          end: "+=1500",
          scrub: true
        }
      });
    }
  }

  // 3) 초기화 타이밍 설정
  function initializeAnimations() {
    // ScrollTrigger 리프레시
    ScrollTrigger.refresh();
    
    // 애니메이션 초기화
    initAllAnimations();
    
    // 추가 리프레시 (안전장치)
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  }

  // 4) 다양한 시점에서 초기화 시도
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAnimations);
  } else {
    // DOM이 이미 로드된 경우
    setTimeout(initializeAnimations, 100);
  }

  // window load 이벤트에서도 실행
  window.addEventListener('load', () => {
    setTimeout(() => {
      ScrollTrigger.refresh();
      initAllAnimations();
    }, 200);
  });

  // 폰트 로딩 완료 후
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    });
  }

  // 이미지 로딩 완료 감지
  const images = document.querySelectorAll('img');
  let loadedImages = 0;
  const totalImages = images.length;
  
  if (totalImages > 0) {
    images.forEach(img => {
      if (img.complete) {
        loadedImages++;
      } else {
        img.addEventListener('load', () => {
          loadedImages++;
          if (loadedImages === totalImages) {
            setTimeout(() => {
              ScrollTrigger.refresh();
            }, 100);
          }
        });
        img.addEventListener('error', () => {
          loadedImages++;
        });
      }
    });
  }

  // 5) 모바일 특별 처리
  if (isMobile) {
    // 터치 이벤트 최적화
    ScrollTrigger.normalizeScroll({
      allowNestedScroll: true,
      lockAxis: false,
      type: "touch,wheel,pointer"
    });
    
    // 스크롤 부드럽게
    ScrollTrigger.config({
      syncInterval: 40
    });
  }

  // 6) 리사이즈 이벤트 처리
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);
  });

  // 7) 최종 안전장치 - 3초 후 마지막 리프레시
  setTimeout(() => {
    ScrollTrigger.refresh();
    console.log('Final ScrollTrigger refresh completed');
  }, 3000);

})();
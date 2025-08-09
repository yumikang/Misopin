// mi_about_runtime_fix.js - 모바일 ScrollTrigger 애니메이션 활성화
// about.min.js 이후에 실행되어야 함

(function() {
  'use strict';
  
  // GSAP과 ScrollTrigger가 로드되었는지 확인
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP or ScrollTrigger not loaded');
    return;
  }

  // 1) 터치 스크롤/커스텀 스크롤러 처리
  gsap.registerPlugin(ScrollTrigger);

  const scroller = document.querySelector('.scroller');
  if (scroller) {
    ScrollTrigger.scrollerProxy(scroller, {
      scrollTop(v) { 
        if(arguments.length) scroller.scrollTop = v; 
        return scroller.scrollTop; 
      },
      getBoundingClientRect() { 
        return {top:0, left:0, width:window.innerWidth, height:window.innerHeight}; 
      },
      pinType: getComputedStyle(scroller).transform !== 'none' ? 'transform' : 'fixed'
    });
    ScrollTrigger.defaults({ scroller });
    scroller.addEventListener('scroll', () => ScrollTrigger.update(), { passive:true });
  }

  // 모바일 주소창 리사이즈 노이즈 무시
  ScrollTrigger.config({ ignoreMobileResize: true });

  // 2) 초기화 타이밍 보강 (폰트/이미지 로딩 끝난 뒤 리프레시)
  const lateRefresh = () => { 
    try { 
      ScrollTrigger.refresh(); 
    } catch(_) {} 
  };

  // DOM 준비 + about.min.js가 트리거 만든 뒤 한 박자 늦게
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(lateRefresh, 50);
  } else {
    document.addEventListener('DOMContentLoaded', () => setTimeout(lateRefresh, 50));
  }

  // window.load, fonts, <img> 완료 후 추가 refresh
  window.addEventListener('load', () => setTimeout(lateRefresh, 80));
  
  // 웹폰트 로딩 완료 대기
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => setTimeout(lateRefresh, 80));
  }

  // 이미지 로딩 완료 대기
  (() => {
    const imgs = [...document.images];
    const pending = imgs.filter(img => !img.complete);
    
    if (!pending.length) {
      setTimeout(lateRefresh, 120);
      return;
    }
    
    let done = 0;
    pending.forEach(img => {
      const callback = () => {
        if (++done === pending.length) {
          setTimeout(lateRefresh, 120);
        }
      };
      img.addEventListener('load', callback);
      img.addEventListener('error', callback);
    });
    
    // background-image 안전판
    setTimeout(lateRefresh, 400);
  })();

  // 3) 모바일 전용 경량 타이밍 + 동적 start 사용
  const startNearBottom = () => {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    return `top ${Math.round(vh * 0.85)}px`;
  };
  
  const startMid = () => {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    return `top ${Math.round(vh * 0.80)}px`;
  };

  // 미디어 매칭으로 모바일/데스크톱 구분
  const mm = ScrollTrigger.matchMedia({
    '(pointer: coarse)': function() { // 모바일 (터치 디바이스)
      initUp({ y: 28, dur: 0.55, stg: 0.04 });
      initSplitUp({ y: 18, dur: 0.45, stg: 0.025, granularity: 'word' });
    },
    '(pointer: fine)': function() { // 데스크톱 (마우스)
      initUp({ y: 60, dur: 0.8, stg: 0.08 });
      initSplitUp({ y: 30, dur: 0.6, stg: 0.05, granularity: 'word-or-existing' });
    },
    // 폴백: pointer 미지원 브라우저용
    '(max-width: 768px)': function() { // 모바일
      initUp({ y: 28, dur: 0.55, stg: 0.04 });
      initSplitUp({ y: 18, dur: 0.45, stg: 0.025, granularity: 'word' });
    },
    '(min-width: 769px)': function() { // 데스크톱
      initUp({ y: 60, dur: 0.8, stg: 0.08 });
      initSplitUp({ y: 30, dur: 0.6, stg: 0.05, granularity: 'word-or-existing' });
    }
  });

  // up 클래스 애니메이션 초기화
  function initUp(options) {
    const elements = document.querySelectorAll('.up, .d_img.up, .txt.up, .t.up, .t_split_up.up');
    
    elements.forEach(el => {
      // 초기 상태 설정
      gsap.set(el, { autoAlpha: 0, y: options.y });
      
      // 애니메이션 설정
      gsap.to(el, {
        autoAlpha: 1,
        y: 0,
        duration: options.dur,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: startNearBottom,
          once: true,
          invalidateOnRefresh: true,
          fastScrollEnd: true
        }
      });
    });
  }

  // 텍스트 분할 애니메이션 초기화
  function initSplitUp(options) {
    const elements = document.querySelectorAll('.t_split, .t_split_up, .h3.t_split, .h2.t_split');
    
    elements.forEach(root => {
      // 이미 분할된 요소가 있는지 확인
      let targets = root.querySelectorAll('span.t-ch, span.text-line, span');
      
      // 분할되지 않은 경우, 텍스트를 분할
      if (!targets.length && options.granularity && root.textContent.trim()) {
        const text = root.textContent;
        root.innerHTML = '';
        const fragment = document.createDocumentFragment();
        
        // 모바일: 단어 단위로만 쪼개기 (부하 감소)
        if (options.granularity === 'word') {
          text.split(/(\s+)/).forEach(word => {
            if (word.trim() === '') {
              fragment.appendChild(document.createTextNode(word));
            } else {
              const span = document.createElement('span');
              span.className = 't-ch';
              span.textContent = word;
              fragment.appendChild(span);
            }
          });
        } else {
          // 데스크톱: 기존 방식 또는 단어 단위
          text.split(/(\s+)/).forEach(word => {
            if (word.trim() === '') {
              fragment.appendChild(document.createTextNode(word));
            } else {
              const span = document.createElement('span');
              span.className = 't-ch';
              span.textContent = word;
              fragment.appendChild(span);
            }
          });
        }
        
        root.appendChild(fragment);
        targets = root.querySelectorAll('.t-ch');
      }
      
      // 애니메이션 적용
      if (targets.length) {
        gsap.set(targets, { autoAlpha: 0, y: options.y });
        
        gsap.to(targets, {
          autoAlpha: 1,
          y: 0,
          duration: options.dur,
          ease: 'power2.out',
          stagger: options.stg,
          scrollTrigger: {
            trigger: root,
            start: startMid,
            once: true,
            invalidateOnRefresh: true,
            fastScrollEnd: true
          }
        });
      }
    });
  }

  // 추가 안전장치: 3초 후 최종 refresh
  setTimeout(() => {
    lateRefresh();
    // 혹시 놓친 요소들 재확인
    ScrollTrigger.getAll().forEach(st => st.refresh());
  }, 3000);

})();
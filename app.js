(() => {
  'use strict';
  const email = 'bjsong@oxus.co.kr';
  const street = '서울시 광진구 광나루로56길 85';
  const address = street + ', 2층 5호 (구의동 강변테크노마트)';
  const getUrl = () => {
    const canonical = document.querySelector('link[rel="canonical"]').getAttribute('href');
    if (/^https?:\/\//.test(canonical) && !canonical.includes('__SITE_URL__')) return canonical;
    return location.href.split(/[?#]/)[0];
  };
  const toast = document.getElementById('toast');
  let toastTimer;
  function notify(message) {
    (document.querySelector('dialog[open]') || document.body).appendChild(toast);
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 3200);
  }
  function openDialog(id) {
    const dialog = document.getElementById(id);
    if (typeof dialog.showModal === 'function') dialog.showModal();
  }
  for (const [trigger, id] of [['email-trigger','email-dialog'],['map-trigger','map-dialog'],['share-trigger','share-dialog']]) {
    document.getElementById(trigger).addEventListener('click', event => {
      if (typeof document.getElementById(id).showModal !== 'function') return;
      event.preventDefault();
      openDialog(id);
    });
  }
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.addEventListener('close', () => { if (dialog.contains(toast)) document.body.appendChild(toast); });
    dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
  });
  async function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (_) { /* Fall back in embedded browsers. */ }
    const input = document.createElement('textarea');
    input.value = text;
    input.setAttribute('readonly', '');
    input.style.cssText = 'position:fixed;top:0;left:0;width:2px;height:2px;opacity:0;font-size:16px';
    (document.querySelector('dialog[open]') || document.body).appendChild(input);
    input.focus(); input.select(); input.setSelectionRange(0, text.length);
    let copied = false;
    try { copied = document.execCommand('copy'); } catch (_) {}
    input.remove();
    if (!copied) {
      openDialog('copy-dialog');
      const manual = document.getElementById('copy-value');
      manual.value = text; manual.focus(); manual.select();
    }
    return copied;
  }
  document.querySelectorAll('[data-copy]').forEach(button => {
    button.addEventListener('click', async () => {
      const kind = button.dataset.copy;
      if (kind === 'url' && location.protocol === 'file:') {
        notify('웹에 공개한 뒤 명함 링크를 공유할 수 있어요.');
        return;
      }
      const text = kind === 'email' ? email : kind === 'address' ? address : getUrl();
      if (await copyText(text)) {
        notify(kind === 'email' ? '메일 주소를 복사했어요.' : kind === 'address' ? '주소를 복사했어요.' : '명함 링크를 복사했어요. 카톡에 붙여넣어 주세요.');
        button.focus();
      }
    });
  });
  const nativeShare = document.getElementById('native-share');
  if (navigator.share && location.protocol !== 'file:') {
    nativeShare.hidden = false;
    nativeShare.addEventListener('click', async () => {
      try {
        await navigator.share({title:'옥서스 송병주 차장',text:'Brian Song · Sales Manager',url:getUrl()});
      } catch (error) {
        if (error.name !== 'AbortError') notify('공유가 열리지 않으면 명함 링크를 복사해 주세요.');
      }
    });
  }
  const mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  function bindMap(id, scheme, fallback, androidPackage) {
    const element = document.getElementById(id);
    element.href = fallback;
    if (!mobile) {
      element.querySelector('small').textContent = '웹 지도에서 보기';
      return;
    }
    element.addEventListener('click', event => {
      event.preventDefault();
      if (/Android/i.test(navigator.userAgent)) {
        const [protocol, resource] = scheme.split('://');
        location.href = 'intent://' + resource + '#Intent;scheme=' + protocol + ';package=' + androidPackage + ';S.browser_fallback_url=' + encodeURIComponent(fallback) + ';end';
        return;
      }
      let timer;
      const cleanup = () => { clearTimeout(timer); document.removeEventListener('visibilitychange', onVisibility); window.removeEventListener('pagehide', cleanup); };
      const onVisibility = () => { if (document.hidden) cleanup(); };
      document.addEventListener('visibilitychange', onVisibility);
      window.addEventListener('pagehide', cleanup, {once:true});
      timer = setTimeout(() => { cleanup(); if (!document.hidden) location.assign(fallback); }, 1800);
      location.href = scheme;
    });
  }
  const query = encodeURIComponent(street);
  bindMap('naver-map','nmap://search?query=' + query + '&appname=' + encodeURIComponent(location.origin),'https://map.naver.com/p/search/' + query,'com.nhn.android.nmap');
  bindMap('kakao-map','kakaomap://search?q=' + query,'https://map.kakao.com/link/search/' + query,'net.daum.android.map');

  const key = window.CARD_CONFIG?.kakaoJavaScriptKey?.trim();
  if (key && location.protocol !== 'file:') {
    const script = document.createElement('script');
    script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.8.5/kakao.min.js';
    script.integrity = 'sha384-v6JKY3z4FUkWq21oZDHZe74YvuPk/WUrVLrDHTBojHXClOSa3iXy7sCXPY1jkFbj';
    script.crossOrigin = 'anonymous';
    script.onload = () => {
      try {
        if (!Kakao.isInitialized()) Kakao.init(key);
        const button = document.getElementById('kakao-share');
        button.hidden = false;
        button.addEventListener('click', () => {
          try {
            Kakao.Share.sendDefault({objectType:'feed',content:{title:'옥서스 송병주 차장 | Brian Song',description:'Sales Manager · 사회복지사 · 요양보호사',imageUrl:new URL('assets/reference-card.png',getUrl()).href,imageWidth:566,imageHeight:998,link:{mobileWebUrl:getUrl(),webUrl:getUrl()}},buttons:[{title:'명함 보기',link:{mobileWebUrl:getUrl(),webUrl:getUrl()}},{title:'홈페이지',link:{mobileWebUrl:'https://www.oxus.co.kr/',webUrl:'https://www.oxus.co.kr/'}}]});
          } catch (_) { notify('카카오톡 공유가 열리지 않으면 명함 링크를 복사해 주세요.'); }
        });
      } catch (_) { /* Keep working link-sharing options available. */ }
    };
    document.head.appendChild(script);
  }
})();

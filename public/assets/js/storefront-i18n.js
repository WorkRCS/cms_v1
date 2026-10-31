(() => {
  'use strict';

  const STORAGE_KEY = 'field-found-language';
  const languageCodes = { en: 'en-IN', bn: 'bn-IN', hi: 'hi-IN' };
  const select = document.getElementById('siteLanguageSelect');
  const originalDocumentTitle = document.title;

  // Only storefront interface copy is translated. Seller-entered product data is
  // deliberately excluded from the translation pass.
  let activeDictionary = {
    entries: {},
    stateNames: {},
    fieldLabels: {},
    categoryTranslations: {}
  };
  let loadedLanguage = 'en';
  let dictionaryRequest = null;

  const ignoredSelector = [
    '[data-i18n-ignore]',
    '[data-product-name]',
    '[data-product-short]',
    '[data-product-description]',
    '[data-product-attributes]',
    '[data-account-name]',
    '[data-account-email]',
    '.brand-mark',
    '.product-card h3',
    '.product-card-media img',
    '[data-product-main]',
    '.product-thumbnails img',
    '[data-product-video-stage]',
    '.video-story-player',
    '.video-story-copy h3',
    '.video-story-copy p',
    '.cart-row img',
    '.cart-row h5',
    '.cart-row img',
    '.seller-product-cell',
    'script',
    'style',
    'noscript',
    'svg',
    'input',
    'textarea'
  ].join(',');

  const textCache = new WeakMap();
  const attributeCache = new WeakMap();
  let currentLanguage = 'en';

  function safeLanguage(value) {
    return Object.prototype.hasOwnProperty.call(languageCodes, value) ? value : 'en';
  }

  function localizedFieldLabel(rawField, language) {
    const normalized = String(rawField || '').replace(/ field$/i, '').replace(/[. ]/g, '_');
    const labels = activeDictionary.fieldLabels[normalized];
    return labels ? labels[language === 'bn' ? 0 : 1] : String(rawField || '');
  }

  function translateValue(source, language) {
    const lang = safeLanguage(language);
    if (lang === 'en' || !source) return source;
    const value = String(source);
    const trimmed = value.trim();
    const leading = value.match(/^\s*/)[0];
    const trailing = value.match(/\s*$/)[0];

    let translated = activeDictionary.entries[trimmed] || null;
    if (!translated && activeDictionary.stateNames[trimmed]) {
      translated = activeDictionary.stateNames[trimmed];
    }

    if (!translated) {
      let match = trimmed.match(/^(\d[\d,]*) items?$/i);
      if (match) translated = lang === 'bn' ? match[1] + 'টি পণ্য' : match[1] + ' आइटम';
      if (!translated) {
        match = trimmed.match(/^(\d[\d,]*) in stock$/i);
        if (match) translated = lang === 'bn' ? match[1] + 'টি মজুত' : 'स्टॉक में ' + match[1];
      }
      if (!translated) {
        match = trimmed.match(/^(\d+)% off$/i);
        if (match) translated = lang === 'bn' ? match[1] + '% ছাড়' : match[1] + '% की छूट';
      }
      if (!translated) {
        match = trimmed.match(/^View product image (\d+)$/i);
        if (match) translated = (lang === 'bn' ? 'পণ্যের ছবি দেখুন ' : 'उत्पाद की तस्वीर देखें ') + match[1];
      }
      if (!translated) {
        match = trimmed.match(/^Play (.+)$/);
        if (match) translated = (lang === 'bn' ? 'চালান ' : 'चलाएँ ') + match[1];
      }
      if (!translated) {
        match = trimmed.match(/^(.+) each$/);
        if (match) translated = lang === 'bn' ? match[1] + ' প্রতি পিস' : match[1] + ' प्रति इकाई';
      }
      if (!translated) {
        match = trimmed.match(/^© (\d{4}) Field & Found\. Demo storefront\.$/);
        if (match) translated = lang === 'bn'
          ? '© ' + match[1] + ' Field & Found। ডেমো অনলাইন স্টোর।'
          : '© ' + match[1] + ' Field & Found। डेमो ऑनलाइन स्टोर।';
      }
      if (!translated) {
        match = trimmed.match(/^For questions about these terms, contact (.+)\. Grievance contact: (.+)\. Replace these configuration placeholders with monitored business contact details before launch\.$/);
        if (match) translated = lang === 'bn'
          ? 'এই শর্তাবলি সম্পর্কে প্রশ্ন থাকলে যোগাযোগ করুন ' + match[1] + '। অভিযোগের যোগাযোগ: ' + match[2] + '। চালুর আগে এই অস্থায়ী যোগাযোগের তথ্যের পরিবর্তে পর্যবেক্ষণ করা হয় এমন ব্যবসায়িক যোগাযোগের তথ্য দিন।'
          : 'इन शर्तों के बारे में सवालों के लिए ' + match[1] + ' पर संपर्क करें। शिकायत संपर्क: ' + match[2] + '। लॉन्च से पहले इन अस्थायी विवरणों की जगह निगरानी वाले व्यावसायिक संपर्क विवरण दें।';
      }
      if (!translated) {
        match = trimmed.match(/^Contact (.*?) to ask about access to, correction of or deletion of account information, or to raise a privacy concern\. Requests will be handled subject to identity verification, applicable law and any lawful retention requirement\. The production store should implement a documented request-handling and grievance process before launch\.$/);
        if (match) translated = lang === 'bn'
          ? 'অ্যাকাউন্টের তথ্য দেখা, সংশোধন বা মুছে ফেলার বিষয়ে জানতে অথবা গোপনীয়তার উদ্বেগ জানাতে ' + match[1] + ' যোগাযোগ করুন। পরিচয় যাচাই, প্রযোজ্য আইন ও আইনসম্মত তথ্য সংরক্ষণের শর্ত অনুযায়ী অনুরোধের ব্যবস্থা নেওয়া হবে। চালুর আগে প্রকৃত স্টোরে নথিভুক্ত অনুরোধ-পরিচালনা ও অভিযোগ নিষ্পত্তির প্রক্রিয়া চালু করা উচিত।'
          : 'खाते की जानकारी देखने, सुधारने या हटाने के बारे में पूछने या गोपनीयता संबंधी चिंता बताने के लिए ' + match[1] + ' पर संपर्क करें। अनुरोधों पर पहचान सत्यापन, लागू कानून और किसी भी वैध डेटा-रखरखाव की शर्त के अनुसार कार्रवाई होगी। लॉन्च से पहले वास्तविक दुकान में अनुरोध संभालने और शिकायत निवारण की लिखित प्रक्रिया लागू होनी चाहिए।';
      }
      if (!translated) {
        match = trimmed.match(/^This notice may be updated as the website's functionality and legal obligations change\. For privacy questions, contact (.+)\. Grievance contact: (.+)\.$/);
        if (match) translated = lang === 'bn'
          ? 'ওয়েবসাইটের কার্যকারিতা ও আইনি দায়িত্ব পরিবর্তিত হলে এই বিজ্ঞপ্তি হালনাগাদ হতে পারে। গোপনীয়তা সংক্রান্ত প্রশ্নের জন্য যোগাযোগ করুন ' + match[1] + '। অভিযোগের যোগাযোগ: ' + match[2] + '।'
          : 'वेबसाइट की सुविधाओं और कानूनी दायित्वों में बदलाव के अनुसार यह सूचना अपडेट की जा सकती है। गोपनीयता संबंधी सवालों के लिए ' + match[1] + ' पर संपर्क करें। शिकायत संपर्क: ' + match[2] + '।';
      }
      if (!translated) {
        match = trimmed.match(/^The (.+) field is required\.$/i);
        if (match) {
          const field = localizedFieldLabel(match[1], lang);
          translated = lang === 'bn' ? field + ' ঘরটি পূরণ করা বাধ্যতামূলক।' : field + ' फ़ील्ड भरना आवश्यक है।';
        }
      }
      if (!translated) {
        match = trimmed.match(/^The (.+?)(?: field)? must be a valid email address\.$/i);
        if (match) translated = lang === 'bn' ? 'সঠিক ইমেল ঠিকানা দিতে হবে।' : 'एक मान्य ईमेल पता दर्ज करना होगा।';
      }
      if (!translated) {
        match = trimmed.match(/^The (.+) field confirmation does not match\.$/i);
        if (match) translated = lang === 'bn' ? 'পাসওয়ার্ড নিশ্চিতকরণ মিলছে না।' : 'पासवर्ड की पुष्टि मेल नहीं खाती।';
      }
      if (!translated) {
        match = trimmed.match(/^The (.+?)(?: field)? must be at least (\d+) characters?\.$/i);
        if (match) {
          const field = localizedFieldLabel(match[1], lang);
          translated = lang === 'bn'
            ? field + ' কমপক্ষে ' + match[2] + ' অক্ষরের হতে হবে।'
            : field + ' कम से कम ' + match[2] + ' वर्णों का होना चाहिए।';
        }
      }
      if (!translated) {
        match = trimmed.match(/^The (.+) field must not be greater than (\d+) characters?\.$/i);
        if (match) {
          const field = localizedFieldLabel(match[1], lang);
          translated = lang === 'bn'
            ? field + ' সর্বোচ্চ ' + match[2] + ' অক্ষরের হতে পারে।'
            : field + ' अधिकतम ' + match[2] + ' वर्णों का हो सकता है।';
        }
      }
      if (!translated) {
        match = trimmed.match(/^The (.+) field must have at least (\d+) items?\.$/i);
        if (match) {
          const field = localizedFieldLabel(match[1], lang);
          translated = lang === 'bn'
            ? field + ' অন্তত ' + match[2] + 'টি দিতে হবে।'
            : field + ' कम से कम ' + match[2] + ' देने होंगे।';
        }
      }
      if (!translated) {
        match = trimmed.match(/^The (.+) field must be a valid URL\.$/i);
        if (match) translated = lang === 'bn' ? 'সঠিক URL দিতে হবে।' : 'एक मान्य URL दर्ज करना होगा।';
      }
      if (!translated) {
        match = trimmed.match(/^The (.+) must be greater than or equal to the (.+)\.$/i);
        if (match) translated = lang === 'bn' ? 'তুলনামূলক দাম বিক্রয়মূল্যের সমান বা বেশি হতে হবে।' : 'तुलना मूल्य बिक्री मूल्य के बराबर या उससे अधिक होना चाहिए।';
      }
    }

    return translated ? leading + translated + trailing : value;
  }

  function isIgnored(element) {
    return Boolean(element && element.closest && element.closest(ignoredSelector));
  }

  function processTextNode(node) {
    if (!node || !node.parentElement || isIgnored(node.parentElement)) return;
    const visibleText = node.data;
    if (!visibleText.trim()) return;

    let record = textCache.get(node);
    if (!record || visibleText !== record.applied) {
      record = { source: visibleText, applied: null };
    }
    const option = node.parentElement;
    if (option.tagName === 'OPTION' && option.closest('#addressState') && !option.hasAttribute('value')) {
      option.setAttribute('value', record.source.trim());
    }

    const categoryNode = node.parentElement.closest('[data-category-name]');
    const categorySlug = categoryNode
      ? (categoryNode.getAttribute('data-category-slug') || categoryNode.getAttribute('data-category') || '')
      : '';
    const categoryCopy = activeDictionary.categoryTranslations[categorySlug];
    if (categoryNode && categorySlug) {
      const categoryText = currentLanguage === 'en'
        ? record.source
        : (categoryCopy || record.source);
      if (node.data !== categoryText) node.data = categoryText;
      record.applied = categoryText;
      textCache.set(node, record);
      return;
    }

    const next = translateValue(record.source, currentLanguage);
    if (node.data !== next) node.data = next;
    record.applied = next;
    textCache.set(node, record);
  }

  const translatableAttributes = ['placeholder', 'aria-label', 'title', 'alt'];
  function processElement(element) {
    if (!element || element.nodeType !== 1 || isIgnored(element)) return;
    let records = attributeCache.get(element);
    if (!records) {
      records = {};
      attributeCache.set(element, records);
    }
    translatableAttributes.forEach((name) => {
      if (!element.hasAttribute(name)) return;
      const value = element.getAttribute(name);
      let record = records[name];
      if (!record || value !== record.applied) record = { source: value, applied: null };
      const next = translateValue(record.source, currentLanguage);
      if (value !== next) element.setAttribute(name, next);
      record.applied = next;
      records[name] = record;
    });
  }

  function translateTree(root) {
    if (!root) return;
    if (root.nodeType === 3) {
      processTextNode(root);
      return;
    }
    if (root.nodeType !== 1 && root !== document.body) return;
    if (root.nodeType === 1) processElement(root);

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) processTextNode(node);
    if (root.querySelectorAll) root.querySelectorAll('*').forEach(processElement);
  }

  function translateDocumentTitle() {
    const suffix = ' — Field & Found';
    const base = originalDocumentTitle.endsWith(suffix) ? originalDocumentTitle.slice(0, -suffix.length) : originalDocumentTitle;
    const translated = translateValue(base, currentLanguage);
    document.title = translated + (originalDocumentTitle.endsWith(suffix) ? suffix : '');
  }

  const languageOptionLabels = {
    en: { en: 'English', bn: 'Bengali', hi: 'Hindi' },
    bn: { en: 'ইংরেজি', bn: 'বাংলা', hi: 'হিন্দি' },
    hi: { en: 'अंग्रेज़ी', bn: 'बंगाली', hi: 'हिंदी' }
  };

  function updateLanguageOptions(language) {
    if (!select) return;
    const labels = languageOptionLabels[safeLanguage(language)];
    select.querySelectorAll('option').forEach((option) => {
      if (labels[option.value]) option.textContent = labels[option.value];
    });
  }

  function updateCountryField(language) {
    const country = document.getElementById('addressCountry');
    if (!country) return;
    if (['India', 'ভারত', 'भारत'].includes(String(country.value || '').trim())) {
      country.value = translateValue('India', language);
    }
  }

  function syncYouTubePlayerLanguage() {
    const language = currentLanguage;
    document.querySelectorAll('iframe[src*="youtube-nocookie.com/embed/"]').forEach((frame) => {
      try {
        const source = frame.getAttribute('src') || frame.src;
        const url = new URL(source, window.location.href);
        url.searchParams.set('hl', language);
        const localizedSource = url.toString();
        if (frame.src !== localizedSource) frame.src = localizedSource;
      } catch (_) {
        // Keep a video playable if a browser cannot parse an embed URL.
      }
    });
  }

  async function loadLanguageDictionary(language) {
    if (language === 'en') {
      activeDictionary = { entries: {}, stateNames: {}, fieldLabels: {}, categoryTranslations: {} };
      loadedLanguage = 'en';
      dictionaryRequest = null;
      return;
    }
    if (loadedLanguage === language) return;
    if (dictionaryRequest && dictionaryRequest.language === language) {
      await dictionaryRequest.promise;
      return;
    }

    const promise = fetch('/assets/lang/' + language + '.json', {
      method: 'GET',
      credentials: 'same-origin',
      cache: 'force-cache',
      headers: { Accept: 'application/json' }
    }).then((response) => {
      if (!response.ok) throw new Error('Language dictionary could not be loaded.');
      return response.json();
    }).then((dictionary) => {
      if (!dictionary || typeof dictionary !== 'object' ||
          !dictionary.entries || !dictionary.stateNames ||
          !dictionary.fieldLabels || !dictionary.categoryTranslations) {
        throw new Error('Language dictionary is invalid.');
      }
      activeDictionary = dictionary;
      loadedLanguage = language;
    }).finally(() => {
      if (dictionaryRequest && dictionaryRequest.language === language) dictionaryRequest = null;
    });

    dictionaryRequest = { language, promise };
    await promise;
  }

  async function applyLanguage(language, initialLoad) {
    currentLanguage = safeLanguage(language);
    document.documentElement.lang = languageCodes[currentLanguage];
    document.documentElement.dir = 'ltr';
    if (select && select.value !== currentLanguage) select.value = currentLanguage;
    updateLanguageOptions(currentLanguage);

    try {
      window.localStorage.setItem(STORAGE_KEY, currentLanguage);
    } catch (_) {
      // Language still applies for this page when storage is unavailable.
    }

    try {
      await loadLanguageDictionary(currentLanguage);
    } catch (_) {
      currentLanguage = 'en';
      document.documentElement.lang = languageCodes.en;
      if (select) select.value = 'en';
      updateLanguageOptions('en');
      await loadLanguageDictionary('en');
    }

    translateTree(document.body);
    updateCountryField(currentLanguage);
    syncYouTubePlayerLanguage();
    translateDocumentTitle();
    document.documentElement.removeAttribute('data-language-pending');
    window.dispatchEvent(new CustomEvent('storefront:language-changed', { detail: { language: currentLanguage } }));
  }

  let savedLanguage = 'en';
  try {
    savedLanguage = safeLanguage(window.localStorage.getItem(STORAGE_KEY) || 'en');
  } catch (_) {
    savedLanguage = 'en';
  }

  if (select) {
    select.value = savedLanguage;
    select.addEventListener('change', () => { void applyLanguage(select.value, false); });
  }

  void applyLanguage(savedLanguage, true);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'characterData') processTextNode(mutation.target);
      if (mutation.type === 'attributes') processElement(mutation.target);
      mutation.addedNodes && mutation.addedNodes.forEach((node) => translateTree(node));
    });
  });
  observer.observe(document.body, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: translatableAttributes
  });

  window.storefrontTranslate = (value) => translateValue(value, currentLanguage);
  window.storefrontLanguage = () => currentLanguage;
})();

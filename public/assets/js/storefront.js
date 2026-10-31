(() => {
  'use strict';
  const API = '/api/v1';
  const CART_KEY = 'field-found-cart';
  let csrfToken = null;

  // A default Trusted Types policy sanitizes every dynamic HTML sink used by
  // the storefront templates before the browser parses it.
  if (window.trustedTypes && window.DOMPurify) {
    try {
      window.trustedTypes.createPolicy('default', {
        createHTML: (input) => window.DOMPurify.sanitize(input, { RETURN_TRUSTED_TYPE: false })
      });
    } catch (_) {
      // The policy can already exist when another page module initialized it.
    }
  }

  const escapeHtml = (value) => String(value == null ? '' : value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
  const money = (minor) => new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 2
  }).format((Number(minor) || 0) / 100);
  const imageFor = (product) => {
    const images = Array.isArray(product && product.images) ? product.images : [];
    const image = images.find((item) => item && item.is_primary) || images[0];
    return (image && image.variants && image.variants.medium) || (image && image.url) ||
      'https://placehold.co/640x720/f0f0e9/6c7868?text=Product';
  };
  const notify = (message, success) => {
    const modalNode = document.getElementById('feedbackModal');
    const messageNode = document.getElementById('feedbackModalMessage');
    const titleNode = document.getElementById('feedbackModalTitle');
    const iconNode = document.getElementById('feedbackModalIcon');
    if (modalNode && messageNode && titleNode && window.bootstrap) {
      messageNode.textContent = String(message || '');
      titleNode.textContent = success === true ? 'Done' : (success === false ? 'Please note' : 'Notice');
      if (iconNode) {
        iconNode.classList.toggle('is-success', Boolean(success));
        iconNode.classList.toggle('is-error', success === false);
        iconNode.classList.toggle('is-neutral', success == null);
      }
      bootstrap.Modal.getOrCreateInstance(modalNode, { backdrop: true, keyboard: true }).show();
      return;
    }
    const fallback = document.getElementById('appToastMessage');
    const toast = document.getElementById('appToast');
    if (toast && fallback && window.bootstrap) {
      fallback.textContent = String(message || '');
      bootstrap.Toast.getOrCreateInstance(toast, { delay: 3000 }).show();
    }
  };
  async function getCsrfToken() {
    if (csrfToken) return csrfToken;
    const response = await fetch(API + '/csrf-token', {
      credentials: 'same-origin', headers: { Accept: 'application/json' }
    });
    if (!response.ok) throw new Error('Could not start a secure session. Refresh and try again.');
    csrfToken = (await response.json()).token;
    return csrfToken;
  }
  async function apiRequest(path, options) {
    options = options || {};
    const headers = new Headers(options.headers || {});
    headers.set('Accept', 'application/json');
    if (options.body && !(options.body instanceof FormData)) headers.set('Content-Type', 'application/json');
    if (!['GET', 'HEAD'].includes((options.method || 'GET').toUpperCase())) {
      headers.set('X-CSRF-TOKEN', await getCsrfToken());
    }
    const response = await fetch(API + path, Object.assign({}, options, {
      headers, credentials: 'same-origin'
    }));
    const data = (response.headers.get('content-type') || '').includes('application/json') ? await response.json() : {};
    if (!response.ok) {
      const errors = data.errors ? Object.values(data.errors).flat() : [];
      throw new Error(errors[0] || data.message || 'Something went wrong. Please try again.');
    }
    return data;
  }
  function getCart() {
    try {
      const value = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
      return Array.isArray(value) ? value : [];
    } catch (_) { return []; }
  }
  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
  }
  function updateCartCount() {
    const count = getCart().reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
    document.querySelectorAll('[data-cart-count]').forEach((node) => { node.textContent = String(count); });
  }
  function askConfirm(message) {
    const node = document.getElementById('confirmActionModal');
    const messageNode = document.getElementById('confirmActionMessage');
    const approve = document.getElementById('confirmActionApprove');
    if (!node || !messageNode || !approve || !window.bootstrap) {
      return Promise.resolve(window.confirm(message));
    }

    return new Promise((resolve) => {
      let settled = false;
      const instance = bootstrap.Modal.getOrCreateInstance(node, { backdrop: true, keyboard: true });
      const finish = (result) => {
        if (settled) return;
        settled = true;
        approve.removeEventListener('click', onApprove);
        node.removeEventListener('hidden.bs.modal', onHidden);
        if (result) instance.hide();
        resolve(result);
      };
      const onApprove = () => finish(true);
      const onHidden = () => finish(false);

      messageNode.textContent = String(message || '');
      approve.addEventListener('click', onApprove);
      node.addEventListener('hidden.bs.modal', onHidden);
      instance.show();
    });
  }

  function addToCart(product, quantity) {
    const cart = getCart();
    const existing = cart.find((item) => item.slug === product.slug);
    const available = product.track_inventory === false ? 999 : Math.max(0, Number(product.stock) || 0);
    if (available < 1) { notify('This product is currently out of stock.'); return; }
    if (existing) existing.quantity = Math.min(available, existing.quantity + quantity);
    else cart.push({
      slug: product.slug, name: product.name, price_minor: Number(product.price_minor) || 0,
      image: imageFor(product), quantity: Math.max(1, Math.min(available, quantity))
    });
    saveCart(cart);
    notify('Added to your cart.', true);
  }
  function productCard(product) {
    const type = product.product_type === 'agriculture' ? 'Farm & garden' : 'Everyday goods';
    const discount = Number(product.compare_at_price_minor) > Number(product.price_minor);
    return '<div class="col-6 col-md-4 col-xl-3"><article class="product-card">' +
      '<a class="product-card-media" href="/product/' + encodeURIComponent(product.slug) + '">' +
      '<img src="' + escapeHtml(imageFor(product)) + '" alt="' + escapeHtml(product.name) + '" data-i18n-ignore loading="lazy">' +
      '<span class="product-tag">' + type + '</span></a><div class="product-card-body">' +
      '<div class="product-card-type"' + (product.brand ? ' data-i18n-ignore' : '') + '>' + escapeHtml(product.brand || type) + '</div>' +
      '<h3><a href="/product/' + encodeURIComponent(product.slug) + '">' + escapeHtml(product.name) + '</a></h3>' +
      '<div class="product-card-price">' + money(product.price_minor) +
      (discount ? '<del>' + money(product.compare_at_price_minor) + '</del>' : '') +
      '</div></div></article></div>';
  }

  async function loadHome() {
    const categoriesNode = document.querySelector('[data-category-grid]');
    const featuredNode = document.querySelector('[data-featured-grid]');
    const latestNode = document.querySelector('[data-latest-grid]');
    if (!categoriesNode && !featuredNode && !latestNode) return;
    if ([categoriesNode, featuredNode, latestNode].filter(Boolean).every((node) => node.dataset.serverRendered === 'true')) return;
    const images = {
      'fresh-produce':'photo-1542838132-92c53300491e',
      'seeds-saplings':'photo-1574323347407-f5e1ad6d020b',
      'organic-farm-inputs':'photo-1416879595882-3373a0480b5b',
      'gardening-tools':'photo-1585320806297-9794b3e4eeae',
      'apparel':'photo-1521572163474-6864f9cf17ab',
      'electronics':'photo-1505740420928-5e560c06d30e',
      'watches':'photo-1523275335684-37898b6baf30',
      'bags-travel':'photo-1553062407-98eeb64c6a62'
    };
    try {
      const results = await Promise.all([
        categoriesNode ? apiRequest('/categories') : Promise.resolve({data:[]}),
        featuredNode ? apiRequest('/products?featured=1&per_page=4') : Promise.resolve({data:[]}),
        latestNode ? apiRequest('/products?per_page=8&sort=latest') : Promise.resolve({data:[]})
      ]);
      if (categoriesNode) {
        categoriesNode.innerHTML = (results[0].data || []).map((category) => {
          const photo = images[category.slug];
          const bg = photo ? 'https://images.unsplash.com/' + photo + '?w=700&q=80' : '';
          const type = category.product_type === 'agriculture' ? 'Farm & garden' : 'Everyday goods';
          return '<a class="category-card" data-category-slug="' + escapeHtml(category.slug) + '" href="/shop?category=' + encodeURIComponent(category.slug) +
            '" style="--category-image:url(\'' + bg + '\')"><div><h3 data-category-name data-category-slug="' + escapeHtml(category.slug) + '">' + escapeHtml(category.name) +
            '</h3><p>' + type + '</p></div></a>';
        }).join('') || '<div class="empty-state">Categories will appear here soon.</div>';
      }
      if (featuredNode) featuredNode.innerHTML = (results[1].data || []).map(productCard).join('') ||
        '<div class="col-12"><div class="empty-state">No featured products yet.</div></div>';
      if (latestNode) latestNode.innerHTML = (results[2].data || []).map(productCard).join('') ||
        '<div class="col-12"><div class="empty-state">Products will appear here soon.</div></div>';
    } catch (_) {
      [categoriesNode, featuredNode, latestNode].filter(Boolean).forEach((node) => {
        node.innerHTML = '<div class="col-12"><div class="empty-state">Could not load store data. Check PHP, Composer and MongoDB.</div></div>';
      });
    }
  }

  function initShop() {
    const grid = document.querySelector('[data-shop-grid]');
    if (!grid) return;
    const search = document.getElementById('shopSearch');
    const type = document.getElementById('shopType');
    const sort = document.getElementById('shopSort');
    const categoryWrap = document.querySelector('[data-shop-categories]');
    const pagination = document.querySelector('[data-shop-pagination]');
    const countNode = document.querySelector('[data-result-count]');
    const params = new URLSearchParams(window.location.search);
    let activeCategory = params.get('category') || '';
    const hasServerRenderedProducts = grid.dataset.serverRendered === 'true';
    let currentPage = Number(grid.dataset.currentPage) || Number(params.get('page')) || 1;
    type.value = params.get('product_type') || '';
    sort.value = params.get('sort') || 'latest';

    async function loadCategories() {
      const data = await apiRequest('/categories' + (type.value ? '?product_type=' + encodeURIComponent(type.value) : ''));
      categoryWrap.innerHTML = '<button class="category-filter-btn ' + (!activeCategory ? 'active' : '') +
        '" data-category="">All categories</button>' + (data.data || []).map((category) =>
          '<button class="category-filter-btn ' + (activeCategory === category.slug ? 'active' : '') +
          '" data-category="' + escapeHtml(category.slug) + '" data-category-name>' + escapeHtml(category.name) + '</button>'
        ).join('');
    }
    async function loadProducts() {
      grid.innerHTML = '<div class="col-12"><div class="loading-line">Finding good things…</div></div>';
      const query = new URLSearchParams({per_page:'12', sort:sort.value, page:String(currentPage)});
      if (search.value.trim()) query.set('q', search.value.trim());
      if (type.value) query.set('product_type', type.value);
      if (activeCategory) query.set('category', activeCategory);
      if (params.get('featured') === '1') query.set('featured', '1');
      try {
        const result = await apiRequest('/products?' + query.toString());
        const data = result.data || [];
        grid.innerHTML = data.length ? data.map(productCard).join('') :
          '<div class="col-12"><div class="empty-state">No products match those filters. Try another search.</div></div>';
        countNode.textContent = (result.meta && result.meta.total != null ? result.meta.total : data.length) + ' items';
        const pages = Number(result.meta && result.meta.last_page) || 1;
        pagination.innerHTML = Array.from({length:pages}, (_, index) => {
          const page = index + 1;
          return '<li class="page-item ' + (page === currentPage ? 'active' : '') +
            '"><button class="page-link" type="button" data-page="' + page + '">' + page + '</button></li>';
        }).join('');
      } catch (error) {
        grid.innerHTML = '<div class="col-12"><div class="empty-state">' + escapeHtml(error.message) + '</div></div>';
      }
    }
    categoryWrap.addEventListener('click', (event) => {
      const button = event.target.closest('[data-category]');
      if (!button) return;
      activeCategory = button.dataset.category || '';
      currentPage = 1;
      categoryWrap.querySelectorAll('button').forEach((node) => node.classList.toggle('active', node === button));
      loadProducts();
    });
    pagination.addEventListener('click', (event) => {
      const button = event.target.closest('[data-page]');
      if (!button) return;
      currentPage = Number(button.dataset.page) || 1;
      loadProducts();
      window.scrollTo({top:grid.getBoundingClientRect().top + window.scrollY - 120, behavior:'smooth'});
    });
    type.addEventListener('change', () => { activeCategory = ''; currentPage = 1; loadCategories().then(loadProducts); });
    sort.addEventListener('change', () => { currentPage = 1; loadProducts(); });
    let searchTimer;
    search.addEventListener('input', () => {
      window.clearTimeout(searchTimer);
      searchTimer = window.setTimeout(() => { currentPage = 1; loadProducts(); }, 300);
    });
    if (!hasServerRenderedProducts) {
      loadCategories().then(loadProducts).catch((error) => {
        grid.innerHTML = '<div class="col-12"><div class="empty-state">' + escapeHtml(error.message) + '</div></div>';
      });
    }
  }

  async function initProduct() {
    const root = document.getElementById('productDetail');
    if (!root) return;
    try {
      const initialProductData = document.getElementById('initialProductData');
      let product = null;
      if (initialProductData) {
        product = JSON.parse(initialProductData.textContent || 'null');
      } else {
        const result = await apiRequest('/products/' + encodeURIComponent(root.dataset.productSlug));
        product = result.data;
      }
      if (!product) throw new Error('This product could not be found.');
      const images = Array.isArray(product.images) ? product.images : [];
      const main = document.querySelector('[data-product-main]');
      const imageStage = document.querySelector('[data-product-image-stage]');
      const videoStage = document.querySelector('[data-product-video-stage]');
      const thumbnails = document.querySelector('[data-product-thumbnails]');
      const video = product.video && typeof product.video === 'object' ? product.video : null;
      const isYoutubeVideo = Boolean(video && video.type === 'youtube' && /^[A-Za-z0-9_-]{11}$/.test(String(video.video_id || '')));
      const isUploadedVideo = Boolean(video && video.url && !isYoutubeVideo);
      const hasGalleryVideo = isYoutubeVideo || isUploadedVideo;
      const videoLayout = video && video.layout === 'shorts' ? 'shorts' : 'standard';

      const primaryImage = images.find((image) => image && image.is_primary) || images[0];
      main.src = (primaryImage && primaryImage.variants && primaryImage.variants.large) || (primaryImage && primaryImage.url) || imageFor(product);
      main.alt = (primaryImage && primaryImage.alt) || product.name || 'Product image';
      document.querySelector('[data-product-name]').textContent = product.name || 'Product';
      document.querySelector('[data-product-type]').textContent = product.product_type === 'agriculture' ? 'FARM & GARDEN' : 'EVERYDAY GOODS';
      document.querySelector('[data-product-price]').textContent = money(product.price_minor);
      document.querySelector('[data-product-short]').textContent = product.short_description || '';
      document.querySelector('[data-product-description]').textContent = product.description || '';
      document.querySelector('[data-product-stock]').textContent = product.track_inventory === false ? 'Available' :
        (Number(product.stock) > 0 ? product.stock + ' in stock' : 'Out of stock');
      const oldPrice = document.querySelector('[data-product-old-price]');
      const discount = document.querySelector('[data-product-discount]');
      if (Number(product.compare_at_price_minor) > Number(product.price_minor)) {
        oldPrice.textContent = money(product.compare_at_price_minor);
        discount.hidden = false;
        discount.textContent = Math.round((1 - product.price_minor / product.compare_at_price_minor) * 100) + '% off';
      } else { oldPrice.textContent = ''; discount.hidden = true; }

      const imageButtons = images.map((image, index) =>
        '<button class="product-thumb ' + (index === 0 ? 'active' : '') + '" type="button" data-image-index="' + index +
        '" aria-label="View product image ' + (index + 1) + '" aria-pressed="' + (index === 0 ? 'true' : 'false') + '"><img src="' +
        escapeHtml((image.variants && image.variants.thumbnail) || (image.variants && image.variants.medium) || image.url || imageFor(product)) +
        '" alt="' + escapeHtml(image.alt || ((product.name || 'Product') + ' image ' + (index + 1))) +
        '" loading="lazy" decoding="async" width="82" height="82"></button>'
      );

      if (hasGalleryVideo) {
        const videoThumbnail = video.thumbnail_url || (isYoutubeVideo
          ? 'https://i.ytimg.com/vi/' + encodeURIComponent(video.video_id) + '/hqdefault.jpg'
          : imageFor(product));
        const videoTitle = video.title || ((product.name || 'Product') + ' video');
        imageButtons.push(
          '<button class="product-thumb product-video-thumb ' + (videoLayout === 'shorts' ? 'product-video-thumb--shorts' : '') +
          '" type="button" data-video-select aria-pressed="false" aria-label="Play ' + escapeHtml(videoTitle) + '">' +
          '<img src="' + escapeHtml(videoThumbnail) + '" alt="" width="82" height="82" loading="lazy" decoding="async">' +
          '<span class="product-video-play" aria-hidden="true"><svg class="icon"><use href="#i-play"/></svg></span>' +
          '<span class="product-video-label">Video</span></button>'
        );
      }
      thumbnails.innerHTML = imageButtons.join('');

      const stopAndHideVideo = () => {
        videoStage.innerHTML = '';
        videoStage.hidden = true;
        imageStage.hidden = false;
      };
      const showProductVideo = () => {
        if (!hasGalleryVideo) return;
        imageStage.hidden = true;
        videoStage.hidden = false;
        videoStage.className = 'product-main-video product-video-frame product-video-frame--' + videoLayout;
        videoStage.innerHTML = '';

        if (isYoutubeVideo) {
          const frame = document.createElement('iframe');
          const playerLanguage = window.storefrontLanguage ? window.storefrontLanguage() : 'en';
          frame.src = 'https://www.youtube-nocookie.com/embed/' + video.video_id + '?playsinline=1&rel=0&hl=' + encodeURIComponent(playerLanguage);
          frame.title = video.title || ((product.name || 'Product') + ' video');
          frame.loading = 'lazy';
          frame.referrerPolicy = 'strict-origin-when-cross-origin';
          frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
          frame.allowFullscreen = true;
          frame.setAttribute('allowfullscreen', '');
          frame.setAttribute('frameborder', '0');
          videoStage.appendChild(frame);
        } else {
          const player = document.createElement('video');
          player.src = video.url;
          player.controls = true;
          player.preload = 'none';
          player.playsInline = true;
          player.setAttribute('aria-label', video.title || ((product.name || 'Product') + ' video'));
          videoStage.appendChild(player);
        }
        thumbnails.querySelectorAll('.product-thumb').forEach((node) => {
          const selected = node.hasAttribute('data-video-select');
          node.classList.toggle('active', selected);
          node.setAttribute('aria-pressed', selected ? 'true' : 'false');
        });
      };

      thumbnails.addEventListener('click', (event) => {
        const videoButton = event.target.closest('[data-video-select]');
        if (videoButton) {
          showProductVideo();
          return;
        }
        const button = event.target.closest('[data-image-index]');
        if (!button) return;
        const selected = images[Number(button.dataset.imageIndex)];
        if (!selected) return;
        stopAndHideVideo();
        main.src = (selected.variants && selected.variants.large) || (selected.variants && selected.variants.medium) || selected.url || imageFor(product);
        main.alt = selected.alt || product.name || 'Product image';
        thumbnails.querySelectorAll('.product-thumb').forEach((node) => {
          const selected = node === button;
          node.classList.toggle('active', selected);
          node.setAttribute('aria-pressed', selected ? 'true' : 'false');
        });
      });
      document.querySelector('[data-product-attributes]').innerHTML = Object.entries(product.attributes || {}).map(([key, value]) =>
        '<div class="attribute-chip"><small>' + escapeHtml(key.replace(/[_-]/g, ' ')) +
        '</small><strong>' + escapeHtml(value) + '</strong></div>').join('');
      document.querySelector('[data-qty-minus]').addEventListener('click', () => {
        const input = document.getElementById('productQty');
        input.value = Math.max(1, Number(input.value || 1) - 1);
      });
      document.querySelector('[data-qty-plus]').addEventListener('click', () => {
        const input = document.getElementById('productQty');
        input.value = Math.max(1, Number(input.value || 1) + 1);
      });
      document.querySelector('[data-add-to-cart]').addEventListener('click', () => {
        addToCart(product, Math.max(1, Number(document.getElementById('productQty').value || 1)));
      });
    } catch (error) {
      root.innerHTML = '<div class="empty-state"><h2>Product unavailable</h2><p>' + escapeHtml(error.message) +
        '</p><a href="/shop" class="btn btn-dark rounded-pill">Back to shop</a></div>';
    }
  }

  function renderCart() {
    const root = document.querySelector('[data-cart-items]');
    if (!root) return;
    const cart = getCart();
    if (!cart.length) {
      root.innerHTML = '<div class="empty-state"><h3>Your cart is taking a little rest.</h3><p>Find something good to bring home.</p><a class="btn btn-dark rounded-pill mt-2" href="/shop">Explore the shop</a></div>';
    } else {
      root.innerHTML = cart.map((item) => '<div class="cart-row" data-cart-slug="' + escapeHtml(item.slug) + '">' +
        '<img src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.name) + '">' +
        '<div><h5><a href="/product/' + encodeURIComponent(item.slug) + '">' + escapeHtml(item.name) + '</a></h5>' +
        '<small>' + money(item.price_minor) + ' each</small><div class="cart-row-actions">' +
        '<div class="quantity-control"><button type="button" data-cart-decrease aria-label="Decrease quantity">−</button>' +
        '<span class="px-2 small">' + Number(item.quantity) + '</span>' +
        '<button type="button" data-cart-increase aria-label="Increase quantity">+</button></div>' +
        '<button type="button" data-cart-remove>Remove</button></div></div>' +
        '<div class="cart-row-price">' + money(item.price_minor * item.quantity) + '</div></div>').join('');
    }
    const subtotal = cart.reduce((sum, item) => sum + (Number(item.price_minor) || 0) * (Number(item.quantity) || 0), 0);
    document.querySelectorAll('[data-cart-subtotal], [data-cart-total]').forEach((node) => { node.textContent = money(subtotal); });
  }
  function initCart() {
    const root = document.querySelector('[data-cart-items]');
    if (!root) return;
    renderCart();
    root.addEventListener('click', (event) => {
      const row = event.target.closest('[data-cart-slug]');
      if (!row) return;
      const cart = getCart();
      const item = cart.find((entry) => entry.slug === row.dataset.cartSlug);
      if (!item) return;
      if (event.target.closest('[data-cart-remove]')) {
        saveCart(cart.filter((entry) => entry.slug !== item.slug));
      } else if (event.target.closest('[data-cart-decrease]')) {
        item.quantity = Math.max(1, item.quantity - 1); saveCart(cart);
      } else if (event.target.closest('[data-cart-increase]')) {
        item.quantity = Math.min(99, item.quantity + 1); saveCart(cart);
      } else return;
      renderCart();
    });
  }
  function setFormMessage(form, message, success) {
    const node = form.querySelector('[data-form-message]');
    if (node) {
      node.textContent = '';
      node.classList.remove('success');
    }
    if (message) notify(message, success);
  }
  function initAuthForms() {
    const login = document.getElementById('loginForm');
    if (login) login.addEventListener('submit', async (event) => {
      event.preventDefault();
      const button = login.querySelector('button[type="submit"]');
      button.disabled = true; setFormMessage(login, '');
      try {
        const result = await apiRequest('/auth/login', {
          method:'POST',
          body:JSON.stringify({
            email:login.elements.email.value.trim(),
            password:login.elements.password.value
          })
        });
        window.location.href = result.user && result.user.role === 'seller' ? '/admin' : '/account';
      } catch (error) { setFormMessage(login, error.message); button.disabled = false; }
    });

    const register = document.getElementById('registerForm');
    if (register) register.addEventListener('submit', async (event) => {
      event.preventDefault();
      const button = register.querySelector('button[type="submit"]');
      button.disabled = true; setFormMessage(register, '');
      try {
        await apiRequest('/auth/register', {
          method:'POST',
          body:JSON.stringify({
            name:register.elements.name.value.trim(),
            email:register.elements.email.value.trim(),
            phone:register.elements.phone.value.trim(),
            password:register.elements.password.value,
            password_confirmation:register.elements.password_confirmation.value
          })
        });
        window.location.href = '/account';
      } catch (error) { setFormMessage(register, error.message); button.disabled = false; }
    });
  }
  function initAccount() {
    const name = document.querySelector('[data-account-name]');
    if (!name) return;

    const profileForm = document.getElementById('profileForm');
    const setField = (fieldName, value) => {
      const field = profileForm && profileForm.querySelector('[name="' + fieldName + '"]');
      if (!field) return;
      let displayValue = value == null ? '' : String(value);
      if (fieldName === 'address.country' && displayValue === 'India' && window.storefrontTranslate) {
        displayValue = window.storefrontTranslate('India');
      }
      field.value = displayValue;
    };

    apiRequest('/auth/me').then((result) => {
      const user = result.user || {};
      const address = user.address || {};

      name.textContent = user.name || 'Customer';
      document.querySelector('[data-account-email]').textContent = user.email || '';
      document.querySelector('[data-account-role]').textContent = user.role || 'customer';

      if (profileForm) {
        setField('name', user.name);
        setField('phone', user.phone);
        setField('address.label', address.label);
        setField('address.full_name', address.full_name);
        setField('address.phone', address.phone);
        setField('address.house_flat', address.house_flat);
        setField('address.street_area', address.street_area);
        setField('address.landmark', address.landmark);
        setField('address.locality', address.locality);
        setField('address.city', address.city);
        setField('address.district', address.district);
        setField('address.state', address.state);
        setField('address.postal_code', address.postal_code);
        setField('address.country', address.country || 'India');
        setField('name', user.name);
        const email = document.getElementById('profileEmail');
        if (email) email.value = user.email || '';
      }
    }).catch(() => { window.location.href = '/login'; });

    if (profileForm) {
      profileForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const button = profileForm.querySelector('button[type="submit"]');
        const nameField = profileForm.querySelector('[name="name"]');
        const phoneField = profileForm.querySelector('[name="phone"]');
        const address = {};

        profileForm.querySelectorAll('[name^="address."]').forEach((field) => {
          address[field.name.slice(8)] = field.value.trim() || null;
        });

        const localizedIndia = window.storefrontTranslate ? window.storefrontTranslate('India') : 'India';
        if (address.country && address.country === localizedIndia) address.country = 'India';

        const payload = {
          name: nameField.value.trim(),
          phone: phoneField.value.trim() || null,
          address
        };

        button.disabled = true;
        setFormMessage(profileForm, '');

        try {
          const result = await apiRequest('/auth/profile', {
            method: 'PATCH',
            body: JSON.stringify(payload)
          });

          const updatedUser = result.user || {};
          name.textContent = updatedUser.name || 'Customer';
          setFormMessage(profileForm, result.message || 'Profile and address saved successfully.', true);
        } catch (error) {
          setFormMessage(profileForm, error.message);
        } finally {
          button.disabled = false;
        }
      });
    }

    document.querySelector('[data-logout]')?.addEventListener('click', async () => {
      try { await apiRequest('/auth/logout', {method:'POST', body:'{}'}); window.location.href = '/'; }
      catch (error) { notify(error.message); }
    });
  }

  function initSeller() {
    const root = document.querySelector('[data-seller-products]');
    if (!root) return;

    const summary = document.querySelector('[data-seller-summary]');
    const typeSelect = document.getElementById('productTypeInput');
    const categorySelect = document.getElementById('productCategoryInput');
    const form = document.getElementById('sellerProductForm');
    const imagesInput = document.getElementById('productImagesInput');
    const preview = document.querySelector('[data-upload-preview]');
    const productPagination = document.querySelector('[data-seller-product-pagination]');
    const customersRoot = document.querySelector('[data-admin-customers]');
    const customerPagination = document.querySelector('[data-admin-customer-pagination]');
    const customerSearch = document.getElementById('adminCustomerSearch');
    const editForm = document.getElementById('editProductForm');
    const editModalNode = document.getElementById('editProductModal');
    const editTypeSelect = document.getElementById('editProductType');
    const editCategorySelect = document.getElementById('editProductCategory');
    const editVideoFile = document.getElementById('editProductVideoFile');
    const editVideoUrl = document.getElementById('editProductVideoUrl');
    const productRecords = new Map();
    let currentProductPage = 1;
    let currentCustomerPage = 1;
    let customerQuery = '';
    let searchTimer = null;
    let editProductId = null;
    let productsRequestSequence = 0;
    let customersRequestSequence = 0;

    const byId = (id) => document.getElementById(id);
    const textValue = (value) => value == null ? '' : String(value);
    const translate = (value) => window.storefrontTranslate ? window.storefrontTranslate(value) : value;

    async function loadCategories(targetSelect, productType, selectedId) {
      const result = await apiRequest('/categories?product_type=' + encodeURIComponent(productType));
      targetSelect.innerHTML = '<option value="">Choose a category</option>' + (result.data || []).map((category) =>
        '<option value="' + escapeHtml(category.id || category._id) + '" data-category-slug="' + escapeHtml(category.slug) + '" data-category-name>' + escapeHtml(category.name) + '</option>'
      ).join('');
      if (selectedId) targetSelect.value = String(selectedId);
    }

    async function loadDashboard() {
      const result = await apiRequest('/seller/dashboard');
      const s = result.summary || {};
      const metrics = [
        ['Total products', s.total_products],
        ['Published products', s.published_products],
        ['Draft products', s.draft_products],
        ['Low stock products', s.low_stock_products],
        ['Total customers', s.total_customers],
        ['Active customer accounts', s.active_customer_accounts],
        ['Farm & garden', s.agriculture_products],
        ['Everyday goods', s.general_products]
      ];
      summary.innerHTML = metrics.map((metric) =>
        '<div class="col-6 col-lg-3"><div class="metric-card"><span>' + metric[0] +
        '</span><strong>' + (Number(metric[1]) || 0) + '</strong></div></div>').join('');
    }

    function renderPagination(container, current, last, attribute) {
      if (!container) return;
      const pages = Math.max(1, Number(last) || 1);
      const active = Math.min(pages, Math.max(1, Number(current) || 1));
      if (pages <= 1) {
        container.replaceChildren();
        container.hidden = true;
        return;
      }

      const visible = new Set([1, pages]);
      for (let page = Math.max(1, active - 2); page <= Math.min(pages, active + 2); page += 1) {
        visible.add(page);
      }
      const sorted = Array.from(visible).sort((a, b) => a - b);
      const items = [];
      let previous = 0;
      sorted.forEach((page) => {
        if (previous && page - previous > 1) {
          items.push('<li class="page-item disabled"><span class="page-link" aria-hidden="true">…</span></li>');
        }
        items.push('<li class="page-item ' + (page === active ? 'active' : '') + '">' +
          '<button class="page-link" type="button" data-admin-page="' + attribute + '" data-page="' + page + '"' +
          (page === active ? ' aria-current="page"' : '') + '>' + page + '</button></li>');
        previous = page;
      });

      container.innerHTML = items.join('');
      container.hidden = false;
    }

    async function loadProducts(page) {
      currentProductPage = Math.max(1, Number(page) || 1);
      const requestSequence = ++productsRequestSequence;
      root.innerHTML = '<tr><td colspan="6" class="text-center py-5 text-secondary">Loading products…</td></tr>';
      const result = await apiRequest('/seller/products?page=' + currentProductPage);
      if (requestSequence !== productsRequestSequence) return;
      const rows = result.data || [];
      productRecords.clear();

      root.innerHTML = rows.map((product) => {
        const id = String(product.id || product._id || '');
        productRecords.set(id, product);
        const type = product.product_type === 'agriculture' ? 'Farm & garden' : 'Everyday goods';
        const state = product.status === 'published' ? 'Published' : (product.status || 'draft');
        return '<tr><td><div class="seller-product-cell"><img src="' + escapeHtml(imageFor(product)) +
          '" alt=""><div><strong>' + escapeHtml(product.name) + '</strong><small>' + escapeHtml(product.slug) +
          '</small></div></div></td><td>' + type + '</td><td>' + money(product.price_minor) +
          '</td><td>' + (Number(product.stock) || 0) + '</td><td><span class="badge text-bg-light">' +
          escapeHtml(state) + '</span></td><td><div class="admin-row-actions">' +
          '<button type="button" class="btn btn-sm btn-outline-dark rounded-pill" data-edit-product="' + escapeHtml(id) + '">Edit</button>' +
          (product.status === 'archived' ? '' : '<button type="button" class="btn btn-sm btn-link text-danger text-decoration-none" data-archive-product="' + escapeHtml(id) + '">Archive</button>') +
          '</div></td></tr>';
      }).join('') || '<tr><td colspan="6" class="text-center py-5 text-secondary">No products yet. Add your first product above.</td></tr>';

      renderPagination(productPagination, result.meta && result.meta.current_page, result.meta && result.meta.last_page, 'products');
    }

    async function loadCustomers(page) {
      currentCustomerPage = Math.max(1, Number(page) || 1);
      if (!customersRoot) return;
      customersRoot.innerHTML = '<tr><td colspan="6" class="text-center py-5 text-secondary">Loading customers…</td></tr>';
      const requestSequence = ++customersRequestSequence;
      const params = new URLSearchParams({ page: String(currentCustomerPage), per_page: '25' });
      if (customerQuery) params.set('q', customerQuery);
      const result = await apiRequest('/seller/customers?' + params.toString());
      if (requestSequence !== customersRequestSequence) return;
      customersRoot.innerHTML = (result.data || []).map((customer) => {
        const joined = customer.created_at ? new Date(customer.created_at).toLocaleDateString('en-IN') : '—';
        const status = customer.is_active ? 'Active' : 'Disabled';
        const address = Object.values(customer.address || {}).filter((part) => typeof part === 'string' && part.trim()).join(', ');
        return '<tr><td><strong>' + escapeHtml(customer.name || '—') + '</strong></td>' +
          '<td>' + escapeHtml(customer.email || '—') + '</td>' +
          '<td>' + escapeHtml(customer.phone || '—') + '</td>' +
          '<td class="admin-customer-address">' + escapeHtml(address || '—') + '</td>' +
          '<td><span class="badge ' + (customer.is_active ? 'text-bg-success' : 'text-bg-secondary') + '">' + status + '</span></td>' +
          '<td>' + escapeHtml(joined) + '</td></tr>';
      }).join('') || '<tr><td colspan="6" class="text-center py-5 text-secondary">No customer accounts found.</td></tr>';
      renderPagination(customerPagination, result.meta && result.meta.current_page, result.meta && result.meta.last_page, 'customers');
    }

    function openEditProduct(product) {
      if (!editForm || !editModalNode) return;
      editProductId = String(product.id || product._id || '');
      const set = (name, value) => {
        const field = editForm.elements[name];
        if (field) field.value = textValue(value);
      };

      set('id', editProductId);
      set('name', product.name);
      set('product_type', product.product_type || 'agriculture');
      set('price', (Number(product.price_minor) / 100).toFixed(2));
      set('compare_at_price', product.compare_at_price_minor ? (Number(product.compare_at_price_minor) / 100).toFixed(2) : '');
      set('stock', Number(product.stock) || 0);
      set('brand', product.brand);
      set('short_description', product.short_description);
      set('description', product.description);
      set('status', product.status || 'draft');
      set('video_title', product.video && product.video.title);
      set('video_layout', product.video && product.video.layout || 'auto');
      set('video_youtube_url', product.video && product.video.type === 'youtube' ? product.video.url : '');

      editForm.elements.is_featured.checked = Boolean(product.is_featured);
      editForm.elements.remove_video.checked = false;
      editForm.elements.video.value = '';
      byId('editProductImages').value = '';
      if (editVideoUrl) editVideoUrl.value = product.video && product.video.type === 'youtube' ? product.video.url : '';

      loadCategories(editCategorySelect, product.product_type || 'agriculture', product.category_id)
        .then(() => bootstrap.Modal.getOrCreateInstance(editModalNode).show())
        .catch((error) => notify(error.message, false));
    }

    typeSelect.addEventListener('change', () => {
      loadCategories(categorySelect, typeSelect.value).catch((error) => notify(error.message, false));
    });

    imagesInput.addEventListener('change', () => {
      preview.replaceChildren();
      Array.from(imagesInput.files || []).slice(0, 8).forEach((file) => {
        const img = document.createElement('img');
        img.alt = translate('Selected product preview');
        img.src = URL.createObjectURL(file);
        img.addEventListener('load', () => URL.revokeObjectURL(img.src), { once: true });
        preview.appendChild(img);
      });
    });

    root.addEventListener('click', async (event) => {
      const editButton = event.target.closest('[data-edit-product]');
      if (editButton) {
        const product = productRecords.get(editButton.dataset.editProduct);
        if (product) openEditProduct(product);
        return;
      }

      const archiveButton = event.target.closest('[data-archive-product]');
      if (!archiveButton || !await askConfirm(translate('Archive this product? It will no longer appear in the public shop.'))) return;
      try {
        await apiRequest('/seller/products/' + encodeURIComponent(archiveButton.dataset.archiveProduct), { method: 'DELETE', body: '{}' });
        notify('Product archived.', true);
        await Promise.all([loadDashboard(), loadProducts(currentProductPage)]);
      } catch (error) {
        notify(error.message, false);
      }
    });

    if (productPagination) {
      productPagination.addEventListener('click', (event) => {
        const button = event.target.closest('[data-admin-page="products"]');
        if (button) loadProducts(button.dataset.page).catch((error) => notify(error.message, false));
      });
    }
    if (customerPagination) {
      customerPagination.addEventListener('click', (event) => {
        const button = event.target.closest('[data-admin-page="customers"]');
        if (button) loadCustomers(button.dataset.page).catch((error) => notify(error.message, false));
      });
    }
    if (customerSearch) {
      customerSearch.addEventListener('input', () => {
        window.clearTimeout(searchTimer);
        searchTimer = window.setTimeout(() => {
          customerQuery = customerSearch.value.trim();
          loadCustomers(1).catch((error) => notify(error.message, false));
        }, 300);
      });
    }

    editTypeSelect?.addEventListener('change', () => {
      loadCategories(editCategorySelect, editTypeSelect.value).catch((error) => notify(error.message, false));
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const button = form.querySelector('button[type="submit"]');
      const files = Array.from(imagesInput.files || []);
      const videoFile = form.elements.video.files && form.elements.video.files[0];
      const youtubeUrl = form.elements.video_youtube_url.value.trim();
      if (files.length < 1 || files.length > 8) {
        setFormMessage(form, 'Choose between 1 and 8 images.');
        return;
      }
      if (videoFile && youtubeUrl) {
        setFormMessage(form, 'Choose either a YouTube URL or an uploaded video, not both.');
        return;
      }

      const payload = new FormData();
      ['name', 'category_id', 'product_type', 'brand', 'short_description', 'description'].forEach((key) => payload.append(key, form.elements[key].value));
      payload.append('price_minor', String(Math.round(Number(form.elements.price.value) * 100)));
      if (form.elements.compare_at_price.value) payload.append('compare_at_price_minor', String(Math.round(Number(form.elements.compare_at_price.value) * 100)));
      payload.append('stock', String(Math.max(0, Number(form.elements.stock.value) || 0)));
      payload.append('track_inventory', '1');
      payload.append('is_featured', form.elements.is_featured.checked ? '1' : '0');
      payload.append('status', 'published');
      files.forEach((file, index) => payload.append('images[' + index + ']', file));
      if (videoFile) payload.append('video', videoFile);
      if (youtubeUrl) payload.append('video_youtube_url', youtubeUrl);
      payload.append('video_layout', form.elements.video_layout.value || 'auto');
      if (form.elements.video_title.value.trim()) payload.append('video_title', form.elements.video_title.value.trim());

      button.disabled = true;
      try {
        await apiRequest('/seller/products', { method: 'POST', body: payload });
        form.reset();
        preview.replaceChildren();
        await Promise.all([loadCategories(categorySelect, typeSelect.value), loadDashboard(), loadProducts(1)]);
        bootstrap.Collapse.getOrCreateInstance(document.getElementById('productEditor')).hide();
        notify('Product published successfully.', true);
      } catch (error) {
        setFormMessage(form, error.message);
      } finally {
        button.disabled = false;
      }
    });

    editForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const button = editForm.querySelector('button[type="submit"]');
      const imageFiles = Array.from(byId('editProductImages').files || []);
      const removeVideo = editForm.elements.remove_video.checked;
      const videoFile = removeVideo ? null : (editForm.elements.video.files && editForm.elements.video.files[0]);
      const youtubeUrl = removeVideo ? '' : editForm.elements.video_youtube_url.value.trim();

      if (imageFiles.length > 8) {
        notify('Choose between 1 and 8 images.', false);
        return;
      }
      if (videoFile && youtubeUrl) {
        notify('Choose either a YouTube URL or an uploaded video, not both.', false);
        return;
      }

      const payload = new FormData();
      payload.append('_method', 'PUT');
      ['name', 'category_id', 'product_type', 'brand', 'short_description', 'description', 'status'].forEach((key) => payload.append(key, editForm.elements[key].value));
      payload.append('price_minor', String(Math.round(Number(editForm.elements.price.value) * 100)));
      payload.append('compare_at_price_minor', editForm.elements.compare_at_price.value
        ? String(Math.round(Number(editForm.elements.compare_at_price.value) * 100)) : '');
      payload.append('stock', String(Math.max(0, Number(editForm.elements.stock.value) || 0)));
      payload.append('track_inventory', '1');
      payload.append('is_featured', editForm.elements.is_featured.checked ? '1' : '0');
      imageFiles.forEach((file, index) => payload.append('images[' + index + ']', file));
      if (videoFile) payload.append('video', videoFile);
      if (youtubeUrl) payload.append('video_youtube_url', youtubeUrl);
      payload.append('video_layout', editForm.elements.video_layout.value || 'auto');
      if (editForm.elements.video_title.value.trim()) payload.append('video_title', editForm.elements.video_title.value.trim());
      payload.append('remove_video', editForm.elements.remove_video.checked ? '1' : '0');

      button.disabled = true;
      try {
        await apiRequest('/seller/products/' + encodeURIComponent(editProductId), { method: 'POST', body: payload });
        bootstrap.Modal.getOrCreateInstance(editModalNode).hide();
        notify('Product updated successfully.', true);
        await Promise.all([loadDashboard(), loadProducts(currentProductPage)]);
      } catch (error) {
        const node = editForm.querySelector('[data-edit-form-message]');
        if (node) node.textContent = '';
        notify(error.message, false);
      } finally {
        button.disabled = false;
      }
    });

    Promise.all([
      loadCategories(categorySelect, typeSelect.value),
      loadDashboard(),
      loadProducts(1),
      loadCustomers(1)
    ]).catch((error) => notify(error.message, false));
  }

  function initProductShare() {
    const button = document.querySelector('[data-product-share]');
    if (!button) return;

    button.addEventListener('click', async () => {
      const titleNode = document.querySelector('[data-product-name]');
      const title = titleNode ? titleNode.textContent.trim() : document.title;
      const shareData = { title, text: title, url: window.location.href };

      try {
        if (navigator.share) {
          await navigator.share(shareData);
          return;
        }
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(window.location.href);
        } else {
          const field = document.createElement('textarea');
          field.value = window.location.href;
          field.setAttribute('readonly', '');
          field.style.position = 'fixed';
          field.style.opacity = '0';
          document.body.appendChild(field);
          field.select();
          const copied = document.execCommand('copy');
          field.remove();
          if (!copied) throw new Error('Copy failed');
        }
        notify('Product link copied.', true);
      } catch (error) {
        if (error && error.name !== 'AbortError') notify('The product link could not be shared. Copy the page address instead.');
      }
    });
  }

  function initNewsletter() {
    document.querySelectorAll('[data-newsletter-form]').forEach((form) => {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        notify('Thanks for your interest! Newsletter signup will be connected soon.', true);
        form.reset();
      });
    });
  }

  function initHomeVideoRails() {
    const tracks = Array.from(document.querySelectorAll('[data-home-video-track]'));
    if (!tracks.length) return;

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let resizeFrame = null;

    const measureTracks = () => {
      tracks.forEach((track) => {
        if (track.classList.contains('is-finished')) return;

        const rail = track.closest('[data-home-video-rail]');
        if (!rail) return;

        const travel = Math.max(rail.clientWidth, track.scrollWidth - rail.clientWidth);
        track.style.setProperty('--rail-travel', travel + 'px');

        const duration = Math.min(180, Math.max(18, travel / 42));
        track.style.setProperty('--rail-duration', duration + 's');

        track.classList.remove('is-ready');
        if (motionPreference.matches || travel < 24) {
          track.style.animation = 'none';
          track.style.transform = 'none';
          track.classList.add('is-finished');
          return;
        }

        track.style.animation = 'none';
        void track.offsetWidth;
        track.style.animation = '';
        track.classList.add('is-ready');
      });
    };

    tracks.forEach((track) => {
      track.addEventListener('animationend', (event) => {
        if (event.target !== track) return;
        track.classList.remove('is-ready');
        track.classList.add('is-finished');
      });
    });

    measureTracks();
    window.addEventListener('resize', () => {
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(() => {
        resizeFrame = null;
        measureTracks();
      });
    }, { passive: true });

    motionPreference.addEventListener?.('change', () => {
      tracks.forEach((track) => {
        track.classList.remove('is-finished');
        track.style.animation = '';
        track.style.transform = '';
      });
      measureTracks();
    });
  }

  function initHomeVideoPlayers() {
    const root = document.querySelector('[data-home-video-rails]');
    if (!root) return;

    function playVideo(button) {
      const card = button.closest('.home-video-card');
      const stage = card && card.querySelector('[data-home-video-player]');
      if (!stage || stage.dataset.playing === 'true') return;

      const title = stage.dataset.videoTitle || 'Product video';
      const type = stage.dataset.videoType;
      let player;

      if (type === 'youtube') {
        const embedUrl = stage.dataset.videoEmbedUrl || '';
        if (!/^https:\/\/www\.youtube-nocookie\.com\/embed\/[A-Za-z0-9_-]{11}(?:\?.*)?$/.test(embedUrl)) {
          notify('This video link is not valid.');
          return;
        }

        player = document.createElement('iframe');
        const playerUrl = new URL(embedUrl);
        playerUrl.searchParams.set('hl', window.storefrontLanguage ? window.storefrontLanguage() : 'en');
        playerUrl.searchParams.set('autoplay', '1');
        player.src = playerUrl.toString();
        player.title = title;
        player.loading = 'lazy';
        player.referrerPolicy = 'strict-origin-when-cross-origin';
        player.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        player.allowFullscreen = true;
        player.setAttribute('allowfullscreen', '');
        player.setAttribute('frameborder', '0');
      } else {
        const videoUrl = stage.dataset.videoUrl || '';
        let parsedUrl;
        try {
          parsedUrl = new URL(videoUrl, window.location.origin);
        } catch (_) {
          notify('This uploaded video cannot be opened.');
          return;
        }
        if (parsedUrl.origin !== window.location.origin || !/^https?:$/.test(parsedUrl.protocol)) {
          notify('This uploaded video cannot be opened.');
          return;
        }

        player = document.createElement('video');
        player.src = parsedUrl.toString();
        player.controls = true;
        player.playsInline = true;
        player.preload = 'metadata';
        player.setAttribute('aria-label', title);
      }

      stage.dataset.playing = 'true';
      stage.replaceChildren(player);
      if (player.tagName === 'VIDEO') player.play().catch(() => {});
    }

    root.addEventListener('click', (event) => {
      const button = event.target.closest('[data-home-video-play]');
      if (!button) return;
      event.preventDefault();
      playVideo(button);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    loadHome();
    initShop();
    initProduct();
    initCart();
    initAuthForms();
    initAccount();
    initSeller();
    initHomeVideoRails();
    initHomeVideoPlayers();
    initProductShare();
    initNewsletter();
  });
})();

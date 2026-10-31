(() => {
  'use strict';
  const API = '/api/v1';
  const CART_KEY = 'field-found-cart';
  let csrfToken = null;

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
  const notify = (message) => {
    const node = document.getElementById('appToast');
    const text = document.getElementById('appToastMessage');
    if (node && text && window.bootstrap) {
      text.textContent = message;
      bootstrap.Toast.getOrCreateInstance(node, { delay: 2600 }).show();
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
    notify('Added to your cart.');
  }
  function productCard(product) {
    const type = product.product_type === 'agriculture' ? 'Farm & garden' : 'Everyday goods';
    const discount = Number(product.compare_at_price_minor) > Number(product.price_minor);
    return '<div class="col-6 col-md-4 col-xl-3"><article class="product-card">' +
      '<a class="product-card-media" href="/product/' + encodeURIComponent(product.slug) + '">' +
      '<img src="' + escapeHtml(imageFor(product)) + '" alt="' + escapeHtml(product.name) + '" loading="lazy">' +
      '<span class="product-tag">' + type + '</span></a><div class="product-card-body">' +
      '<div class="product-card-type">' + escapeHtml(product.brand || type) + '</div>' +
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
          return '<a class="category-card" href="/shop?category=' + encodeURIComponent(category.slug) +
            '" style="--category-image:url(\'' + bg + '\')"><div><h3>' + escapeHtml(category.name) +
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
          '" data-category="' + escapeHtml(category.slug) + '">' + escapeHtml(category.name) + '</button>'
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
          '" type="button" data-video-select aria-label="Play ' + escapeHtml(videoTitle) + '">' +
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
          frame.src = 'https://www.youtube-nocookie.com/embed/' + video.video_id + '?playsinline=1&rel=0';
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
      if (product.video && product.video.url) {
        document.querySelector('[data-product-video-player]').src = product.video.url;
        document.querySelector('[data-product-video]').hidden = false;
      }
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
    if (!node) return;
    node.textContent = message;
    node.classList.toggle('success', Boolean(success));
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
        window.location.href = result.user && result.user.role === 'seller' ? '/seller' : '/account';
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
      if (field) field.value = value == null ? '' : String(value);
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
          notify('Profile details saved.');
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

    async function loadCategories() {
      const result = await apiRequest('/categories?product_type=' + encodeURIComponent(typeSelect.value));
      categorySelect.innerHTML = '<option value="">Choose a category</option>' + (result.data || []).map((category) =>
        '<option value="' + escapeHtml(category.id || category._id) + '">' + escapeHtml(category.name) + '</option>'
      ).join('');
    }
    async function loadSellerData() {
      const results = await Promise.all([apiRequest('/seller/dashboard'), apiRequest('/seller/products')]);
      const s = results[0].summary || {};
      const metrics = [
        ['Total products',s.total_products], ['Published',s.published_products],
        ['Farm & garden',s.agriculture_products], ['Everyday goods',s.general_products]
      ];
      summary.innerHTML = metrics.map((metric) =>
        '<div class="col-6 col-lg-3"><div class="metric-card"><span>' + metric[0] +
        '</span><strong>' + (Number(metric[1]) || 0) + '</strong></div></div>').join('');
      root.innerHTML = (results[1].data || []).map((product) => {
        const type = product.product_type === 'agriculture' ? 'Farm & garden' : 'Everyday';
        const state = product.status === 'published' ? 'Published' : product.status;
        const id = product.id || product._id;
        return '<tr><td><div class="seller-product-cell"><img src="' + escapeHtml(imageFor(product)) +
          '" alt=""><div><strong>' + escapeHtml(product.name) + '</strong><small>' + escapeHtml(product.slug) +
          '</small></div></div></td><td>' + type + '</td><td>' + money(product.price_minor) +
          '</td><td>' + (Number(product.stock) || 0) + '</td><td><span class="badge text-bg-light">' +
          escapeHtml(state) + '</span></td><td><button type="button" class="btn btn-link text-decoration-none p-0" data-archive-product="' +
          escapeHtml(id) + '">Archive</button></td></tr>';
      }).join('') || '<tr><td colspan="6" class="text-center py-5 text-secondary">No products yet. Add your first product above.</td></tr>';
    }

    typeSelect.addEventListener('change', () => loadCategories().catch((error) => notify(error.message)));
    imagesInput.addEventListener('change', () => {
      preview.innerHTML = '';
      Array.from(imagesInput.files || []).slice(0, 8).forEach((file) => {
        const img = document.createElement('img');
        img.alt = 'Selected product preview'; img.src = URL.createObjectURL(file); preview.appendChild(img);
      });
    });
    root.addEventListener('click', async (event) => {
      const button = event.target.closest('[data-archive-product]');
      if (!button || !window.confirm('Archive this product? It will no longer appear in the public shop.')) return;
      try {
        await apiRequest('/seller/products/' + encodeURIComponent(button.dataset.archiveProduct), {method:'DELETE', body:'{}'});
        notify('Product archived.'); await loadSellerData();
      } catch (error) { notify(error.message); }
    });
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const button = form.querySelector('button[type="submit"]');
      const price = Math.round(Number(form.elements.price.value) * 100);
      const oldPrice = form.elements.compare_at_price.value ? Math.round(Number(form.elements.compare_at_price.value) * 100) : '';
      const files = Array.from(imagesInput.files || []);
      if (files.length < 1 || files.length > 8) { setFormMessage(form, 'Choose between 1 and 8 images.'); return; }
      const payload = new FormData();
      ['name','category_id','product_type','brand','short_description','description'].forEach((key) => payload.append(key, form.elements[key].value));
      payload.append('price_minor', String(price));
      if (oldPrice !== '') payload.append('compare_at_price_minor', String(oldPrice));
      payload.append('stock', String(Math.max(0, Number(form.elements.stock.value) || 0)));
      payload.append('track_inventory', '1');
      payload.append('is_featured', form.elements.is_featured.checked ? '1' : '0');
      payload.append('status', 'published');
      files.forEach((file, index) => payload.append('images[' + index + ']', file));
      const video = form.elements.video.files && form.elements.video.files[0];
      const youtubeUrl = form.elements.video_youtube_url.value.trim();
      if (video && youtubeUrl) {
        setFormMessage(form, 'Choose either a YouTube URL or an uploaded video, not both.');
        return;
      }
      if (video) payload.append('video', video);
      if (youtubeUrl) payload.append('video_youtube_url', youtubeUrl);
      payload.append('video_layout', form.elements.video_layout.value || 'auto');
      if (form.elements.video_title.value.trim()) {
        payload.append('video_title', form.elements.video_title.value.trim());
      }
      button.disabled = true; setFormMessage(form, '');
      try {
        await apiRequest('/seller/products', {method:'POST', body:payload});
        form.reset(); preview.innerHTML = '';
        await loadCategories(); await loadSellerData();
        bootstrap.Collapse.getOrCreateInstance(document.getElementById('productEditor')).hide();
        notify('Product published successfully.');
      } catch (error) { setFormMessage(form, error.message); }
      finally { button.disabled = false; }
    });
    Promise.all([loadCategories(), loadSellerData()]).catch((error) => {
      root.innerHTML = '<tr><td colspan="6" class="text-center text-danger py-5">' +
        escapeHtml(error.message) + '</td></tr>';
      notify('Could not load seller data. Please sign in again.');
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
  });
})();

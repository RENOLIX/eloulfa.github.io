const BASE = location.hostname.endsWith('github.io') && location.pathname.startsWith('/eloulfa.github.io') ? '/eloulfa.github.io' : '';
const link = path => /^(?:https?:|data:|blob:)/.test(path) ? path : BASE + path;
const CART_KEY = 'eloulfa-cart-v1';
const LEGACY_CART_KEY = 'eloulfa-cart-legacy';
const PRODUCTS = [
  {
    "id": "kaftan-safran-terracotta",
    "name": "Robe Safran",
    "short": "Robe Safran",
    "description": "Une robe orientale lumineuse dans un ton terracotta orangé. Ses rayures ton sur ton soulignent la matière satinée, tandis que son encolure arrondie et fendue est mise en valeur par un large galon ivoire doré. Sa coupe ample et ses manches généreuses composent une allure à la fois traditionnelle et décontractée.",
    "details": "Teinte terracotta orangé. Motif à rayures ton sur ton. Encolure arrondie avec fente et galon contrastant. Manches amples soulignées d’un galon. Aspect satiné. Les photographies présentées sont celles du modèle fourni par la boutique. Composition et mesures exactes à confirmer.",
    "color": "Terracotta",
    "swatch": "#c34d31",
    "sizes": [
      "34",
      "36",
      "38",
      "40",
      "42",
      "44",
      "46",
      "48",
      "50",
      "52",
      "54",
      "56",
      "58"
    ],
    "price": 80,
    "sku": "EO-SAFRAN",
    "images": [
      "/assets/robe-safran-face.webp",
      "/assets/robe-safran-pose.webp"
    ],
    "url": "/produit/kaftan-safran-terracotta/",
    "category": "kaftans"
  },
  {
    "id": "kaftan-amethyste-prune",
    "name": "Robe Améthyste",
    "short": "Robe Améthyste",
    "description": "La robe orientale Améthyste joue avec un fond prune profond et des reflets dorés au motif marbré. Son encolure sobre bordée de prune et ses larges manches laissent toute leur place aux nuances de la matière. Une tenue ample et expressive, pour apporter une touche singulière à vos moments de fête.",
    "details": "Teinte prune et reflets dorés. Motif marbré. Encolure et poignets bordés d’un galon prune. Manches longues et amples. Les photographies présentées sont celles du modèle fourni par la boutique. Composition et mesures exactes à confirmer.",
    "color": "Prune & or",
    "swatch": "#573343",
    "sizes": [
      "34",
      "36",
      "38",
      "40",
      "42",
      "44",
      "46",
      "48",
      "50",
      "52",
      "54",
      "56",
      "58"
    ],
    "price": 80,
    "sku": "EO-AMETHYSTE",
    "images": [
      "/assets/robe-amethyste-face.webp",
      "/assets/robe-amethyste-detail.webp"
    ],
    "url": "/produit/kaftan-amethyste-prune/",
    "category": "kaftans"
  }
];
PRODUCTS.forEach(p => { p._source = {name:p.name,short:p.short,description:p.description,details:p.details,color:p.color}; });
const byId = id => PRODUCTS.find(p => p.id === id);
function availableCartItems(items) {
  return items.flatMap(item => {
    const product=byId(item.id),stock=null;
    if(!product||product.active===false||!product.sizes.includes(item.size)||!Number.isInteger(item.quantity)||item.quantity<=0||stock===0)return [];
    return [{...item,quantity:Math.min(item.quantity,stock===null?99:stock,99)}];
  });
}
const money = n => new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR',maximumFractionDigits:2}).format(n);
const svgPaths = {
  search:'<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>',
  bag:'<path d="M4 8h16l-1 13H5L4 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/>',
  menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',
  close:'<path d="M5 5l14 14M19 5 5 19"/>',
  arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
  chevron:'<path d="m15 18-6-6 6-6"/>',
  check:'<path d="m4 12 5 5L20 6"/>'
};
const svg = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${svgPaths[name]}</svg>`;
const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function cartItems() {
  try {
    let raw = JSON.parse(localStorage.getItem(CART_KEY));
    if (!Array.isArray(raw)) {
      const old = JSON.parse(localStorage.getItem(LEGACY_CART_KEY) || '[]');
      raw = Array.isArray(old) && PRODUCTS[0] ? old.map(x => ({id:PRODUCTS[0].id,size:x.size,quantity:x.quantity})) : [];
      localStorage.setItem(CART_KEY, JSON.stringify(raw));
    }
    return availableCartItems(raw);
  } catch { return []; }
}
function saveCart(items) {
  const previous = cartItems();
  const next = availableCartItems(items);
  localStorage.setItem(CART_KEY, JSON.stringify(next));
  updateCount();
  next.forEach(item => {
    const before = previous.find(old => old.id === item.id && old.size === item.size)?.quantity || 0;
    const added = item.quantity - before;
    if (added > 0) {
      const product = byId(item.id);
      window.dispatchEvent(new CustomEvent('kb:added-to-cart', {detail:{productId:item.id,quantity:added,unitPrice:product.price}}));
    }
  });
}
function cartCount() { return cartItems().reduce((sum,item)=>sum+item.quantity,0); }
function cartTotal() { return cartItems().reduce((sum,item)=>sum+byId(item.id).price*item.quantity,0); }
function updateCount() { document.querySelectorAll('[data-cart-count]').forEach(el=>el.textContent=cartCount()); }


function productCard(p) { return `<article class="product-card"><a href="${p.url}" class="card-image"><img src="${p.images[0]}" alt="${p.name}" loading="lazy"></a><div class="card-details"><div class="small-label">EL OULFA CRÉATION</div><a class="card-name" href="${p.url}">${p.name}</a><div class="card-price">${money(p.price)}</div><div class="color-label"><span class="color-dot" style="background:${p.swatch};border-color:${p.swatch}"></span> ${p.color}</div></div></article>`; }
function productGrid(list=PRODUCTS.filter(p=>p.active!==false)) { return `<div class="product-grid products-two">${list.map(productCard).join('')}</div>`; }
function homePage() {
  return `<main class="home-v3"><section class="hero-mosaic" aria-label="Sélection mode El Oulfa"><div class="mosaic-stack mosaic-left">
    <a href="/robes-orientales/" style="--tile:url('/assets/matiere-chic.webp')"><span>L’ÉLÉGANCE EN MOUVEMENT</span></a>
    <a href="/nouveautes/" style="--tile:url('/assets/silhouette-abstraite.webp')"><span>NOUVEAUTÉS</span></a>
    <a href="/la-maison/" style="--tile:url('/assets/atelier-chic.webp')"><span>LA BOUTIQUE</span></a></div>
    <div class="mosaic-center"><div class="hero-slide active" data-slide="0"><img src="/assets/campagne-chic.webp" alt="Composition de rubans sculpturaux ivoire et noir"><div class="hero-slide-copy"><span>TENUES TRADITIONNELLES DU MAGHREB</span><h1>ROBES ORIENTALES</h1><a class="button button-dark" href="/robes-orientales/">DÉCOUVRIR LA COLLECTION</a></div></div>
    <div class="hero-slide" data-slide="1"><img src="/assets/matiere-chic.webp" alt="Composition minimaliste de matières et de lumière"><div class="hero-slide-copy"><span>NOUVEAUTÉ</span><h2>PRUNE<br>& OR</h2><a class="button button-dark" href="${(PRODUCTS[1]?.url||'/robes-orientales/')}">VOIR LA ROBE</a></div></div>
    <button class="slide-arrow slide-prev" data-direction="-1" aria-label="Bannière précédente">${svg('chevron')}</button><button class="slide-arrow slide-next" data-direction="1" aria-label="Bannière suivante">${svg('chevron')}</button><div class="slide-dots"><button class="active" data-go="0" aria-label="Bannière 1"></button><button data-go="1" aria-label="Bannière 2"></button></div></div>
    <div class="mosaic-stack mosaic-right"><a href="${(PRODUCTS[0]?.url||'/robes-orientales/')}" style="--tile:url('/assets/silhouette-abstraite.webp')"><span>L’ESPRIT CRÉATION</span></a><a href="${(PRODUCTS[1]?.url||'/robes-orientales/')}" style="--tile:url('/assets/matiere-chic.webp')"><span>JEUX DE MATIÈRES</span></a><a href="/guide-tailles/" style="--tile:url('/assets/atelier-chic.webp')"><span>DU 34 AU 58</span></a></div></section>
    <div class="home-ribbon"><span>L’HÉRITAGE DU MAGHREB</span><span>DEUX CRÉATIONS · 80 €</span><span>LIVRAISON EN EUROPE</span></div>
    <section class="section-wrap home-products"><div class="home-title"><div><span class="kicker">DÉCOUVREZ</span><h2>LES NOUVEAUTÉS</h2></div><a href="/nouveautes/">VOIR TOUT ${svg('arrow')}</a></div>${productGrid()}</section>
    <section class="dual-campaign"><a href="${(PRODUCTS[1]?.url||'/robes-orientales/')}"><img src="/assets/matiere-chic.webp" alt="Ruban noir sculptural sur pierre claire"><span>AMÉTHYSTE <b>DÉCOUVRIR ${svg('arrow')}</b></span></a><a href="${(PRODUCTS[0]?.url||'/robes-orientales/')}"><img src="/assets/silhouette-abstraite.webp" alt="Composition de soie ivoire et métal champagne"><span>SAFRAN <b>DÉCOUVRIR ${svg('arrow')}</b></span></a></section>
    <section class="section-wrap home-inspiration"><div class="home-title"><div><span class="kicker">DÉTAILS DE STYLE</span><h2>À CHAQUE ROBE SON ÉCLAT</h2></div></div><div class="inspiration-grid"><a href="${(PRODUCTS[0]?.url||'/robes-orientales/')}"><img src="/assets/silhouette-abstraite.webp" alt="Étoffes ivoire et détails champagne"><span>LES LIGNES</span></a><a href="${(PRODUCTS[1]?.url||'/robes-orientales/')}"><img src="/assets/matiere-chic.webp" alt="Composition abstraite de matières et de lumière"><span>LES MATIÈRES</span></a><a href="/la-maison/"><img src="/assets/atelier-chic.webp" alt="Matières sculpturales ivoire et noir"><span>L’UNIVERS EL OULFA</span></a></div><p class="campaign-disclaimer">Une collection de robes orientales, inspirée de l’élégance et des traditions du Maghreb.</p></section></main>`;
}
function pageIntro(label,title,description) { return `<div class="page-intro"><span>${label}</span><h1>${title}</h1><p>${description}</p></div>`; }

function collectionPage() { const q=new URLSearchParams(location.search).get('q')?.trim().toLocaleLowerCase('fr')||''; const list=q?PRODUCTS.filter(p=>p.active!==false).filter(p=>`${p.name} ${p.description} ${p.color}`.toLocaleLowerCase('fr').includes(q)):PRODUCTS.filter(p=>p.active!==false); return `<main class="section-wrap extra-page">${pageIntro('EL OULFA CRÉATION',({'kaftans':'KAFTANS','robes-de-ceremonie':'ROBES DE CÉRÉMONIE','grandes-tailles':'DU 34 AU 58'}[location.pathname.split('/').filter(Boolean).pop()]||'ROBES ORIENTALES'),q?`Résultats pour « ${escapeHtml(q)} »`:'Découvrez les robes actuellement disponibles dans la collection.')}<div class="listing-toolbar"><span>${list.length} ARTICLE${list.length>1?'S':''}</span><span>TRIER : NOUVEAUTÉS</span></div>${list.length?`<div class="listing-grid">${list.map(productCard).join('')}</div>`:'<div class="empty-state"><h2>Aucune robe trouvée</h2><a class="button button-dark" href="/robes-orientales/">VOIR TOUTES LES ROBES</a></div>'}</main>`; }
function newPage() { const list=PRODUCTS.filter(p=>p.active!==false).slice().reverse();return `<main class="section-wrap extra-page">${pageIntro('JUSTE ARRIVÉES','NOUVEAUTÉS','Deux créations, une même élégance. Du 34 au 58, à 80 € chacune.')}<div class="listing-toolbar"><span>${list.length} ARTICLE${list.length>1?'S':''}</span><span>COLLECTION SOIRÉE</span></div><div class="listing-grid">${list.map(productCard).join('')}</div></main>`; }



function productPage(p) { return `<main class="product-main section-wrap"><div class="breadcrumbs"><a href="/">Accueil</a><span>/</span><a href="/robes-orientales/">Robes orientales</a><span>/</span><span>${p.short}</span></div><div class="product-layout"><div class="gallery"><div class="thumbs">${p.images.map((src,i)=>`<button class="thumb ${i===0?'active':''}" data-image="${i}" aria-label="Voir l’image ${i+1}"><img src="${src}" alt=""></button>`).join('')}</div><div class="main-image"><img id="main-product-image" src="${p.images[0]}" alt="${p.name}"></div></div><div class="product-info"><div class="eyebrow">EL OULFA CRÉATION · ROBES ORIENTALES</div><h1>${p.name}</h1><div class="sku">Réf. ${p.sku||p.id}</div><div class="product-price">${money(p.price)}</div><div class="rule"></div><p class="product-description">${p.description}</p><div class="field-title">COULEUR : <strong>${p.color.toUpperCase()}</strong></div><div class="swatch" aria-label="${p.color} sélectionné"><span style="background:${p.swatch}"></span></div><div class="field-title size-title">TAILLE : <strong id="selected-size">Sélectionnez une taille</strong></div><div class="size-options">${p.sizes.map(size=>`<button type="button" data-size="${size}" aria-pressed="false">${size}</button>`).join('')}</div><p class="field-error" id="size-error" role="alert"></p><div class="quantity-wrap"><span class="field-title">QUANTITÉ</span><div class="qty-control"><button type="button" data-qty="minus" aria-label="Diminuer la quantité">−</button><span id="product-qty">1</span><button type="button" data-qty="plus" aria-label="Augmenter la quantité">+</button></div></div><button class="button button-dark add-cart" id="add-cart">AJOUTER AU PANIER ${svg('bag')}</button><p class="product-note">Tailles européennes du 34 au 58. Livraison exclusivement en Europe.</p><div class="detail-accordion"><details open><summary>DESCRIPTION</summary><p>${p.description}</p></details><details><summary>DÉTAILS</summary><p>${p.details} Tailles : ${p.sizes.join(', ')}.</p></details></div></div></div><section class="more-section"><div class="section-heading"><div><span class="eyebrow">À DÉCOUVRIR</span><h2>Dans la collection</h2></div></div>${productGrid(PRODUCTS.filter(item=>item.id!==p.id&&item.active!==false))}</section></main>`; }
function cartPage() { const items=cartItems(); if(!items.length)return `<main class="simple-page section-wrap"><h1>Mon panier</h1><div class="empty-state">${svg('bag')}<h2>Votre panier est vide</h2><p>Découvrez notre collection de robes orientales.</p><a class="button button-dark" href="/robes-orientales/">VOIR LES ROBES</a></div></main>`; return `<main class="simple-page section-wrap"><h1>Mon panier <span>(${cartCount()})</span></h1><div class="cart-layout"><div class="cart-items">${items.map(item=>{const p=byId(item.id);return `<article class="cart-item"><a href="${p.url}"><img src="${p.images[0]}" alt="${p.name}"></a><div><a class="cart-item-name" href="${p.url}">${p.name}</a><p>Couleur : ${p.color}<br>Taille : ${item.size}</p><strong>${money(p.price*item.quantity)}</strong><div class="cart-item-actions"><div class="qty-control"><button data-cart-change="minus" data-id="${p.id}" data-size="${item.size}" aria-label="Diminuer la quantité">−</button><span>${item.quantity}</span><button data-cart-change="plus" data-id="${p.id}" data-size="${item.size}" aria-label="Augmenter la quantité">+</button></div><button class="remove-link" data-cart-remove="${p.id}" data-size="${item.size}">Supprimer</button></div></div></article>`}).join('')}</div><aside class="summary"><h2>RÉCAPITULATIF</h2><div><span>Articles (${cartCount()})</span><strong>${money(cartTotal())}</strong></div><div><span>Livraison</span><strong>À préciser avant règlement</strong></div><hr><div class="total"><span>Sous-total</span><strong>${money(cartTotal())}</strong></div><a class="button button-dark" href="/commande/">PASSER COMMANDE ${svg('arrow')}</a><a class="continue-link" href="/robes-orientales/">Continuer mes achats</a></aside></div></main>`; }

function renderDrawer() { const items=cartItems(); document.querySelector('#drawer-body').innerHTML=items.length?items.map(item=>{const p=byId(item.id);return `<article class="drawer-item"><img src="${link(p.images[0])}" alt="${p.name}"><div><a href="${link(p.url)}">${p.name}</a><p>${p.color} · Taille ${item.size} · Qté ${item.quantity}</p><strong>${money(p.price*item.quantity)}</strong></div></article>`}).join(''):`<div class="drawer-empty">${svg('bag')}<h3>VOTRE PANIER EST VIDE</h3><p>Découvrez nos robes orientales.</p><a href="${link('/robes-orientales/')}">VOIR LA COLLECTION</a></div>`;document.querySelector('#drawer-total').textContent=money(cartTotal());document.querySelector('.drawer-foot').style.display=items.length?'block':'none'; }
function setupShell() { const drawer=document.querySelector('#cart-drawer'), overlay=document.querySelector('#drawer-overlay'); const close=()=>{drawer.classList.remove('open');drawer.setAttribute('aria-hidden','true');overlay.hidden=true;document.body.classList.remove('drawer-open')};document.querySelector('#cart-toggle').addEventListener('click',()=>{renderDrawer();drawer.classList.add('open');drawer.setAttribute('aria-hidden','false');overlay.hidden=false;document.body.classList.add('drawer-open');document.querySelector('#cart-close').focus()});document.querySelector('#cart-close').addEventListener('click',close);overlay.addEventListener('click',close);document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});document.querySelector('#menu-toggle').addEventListener('click',()=>document.querySelector('#main-nav').classList.toggle('open'));document.querySelector('#search-toggle').addEventListener('click',()=>{const panel=document.querySelector('#search-form');panel.hidden=!panel.hidden;if(!panel.hidden)panel.querySelector('input').focus()});document.querySelectorAll('#header-search,#search-form').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();const q=form.querySelector('input').value.trim();location.href=link('/robes-orientales/')+(q?`?q=${encodeURIComponent(q)}`:'')})); }
function setupHero() { const slides=[...document.querySelectorAll('.hero-slide')],dots=[...document.querySelectorAll('[data-go]')];if(!slides.length)return;let current=0;const show=i=>{current=(i+slides.length)%slides.length;slides.forEach((el,n)=>{el.classList.toggle('active',n===current);el.setAttribute('aria-hidden',String(n!==current))});dots.forEach((el,n)=>el.classList.toggle('active',n===current))};document.querySelectorAll('[data-direction]').forEach(button=>button.addEventListener('click',()=>show(current+Number(button.dataset.direction))));dots.forEach(button=>button.addEventListener('click',()=>show(Number(button.dataset.go))));show(0); }
function setupProduct(p) { let selected=null,quantity=1;const showImage=i=>{const index=(i+p.images.length)%p.images.length;document.querySelectorAll('.thumb').forEach((el,n)=>el.classList.toggle('active',n===index));const image=document.querySelector('#main-product-image');image.src=link(p.images[index]);image.alt=p.name};document.querySelectorAll('[data-image]').forEach(button=>button.addEventListener('click',()=>showImage(Number(button.dataset.image))));const mainImage=document.querySelector('.main-image');if(mainImage&&p.images.length>1){let startX=0,startY=0;mainImage.addEventListener('touchstart',event=>{const touch=event.changedTouches[0];startX=touch.clientX;startY=touch.clientY},{passive:true});mainImage.addEventListener('touchend',event=>{const touch=event.changedTouches[0];const dx=touch.clientX-startX,dy=touch.clientY-startY;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)){const current=Number(document.querySelector('.thumb.active')?.dataset.image||0);showImage(current+(dx<0?1:-1))}},{passive:true})}document.querySelectorAll('[data-size]').forEach(button=>button.addEventListener('click',()=>{selected=button.dataset.size;document.querySelectorAll('[data-size]').forEach(el=>el.setAttribute('aria-pressed',String(el===button)));document.querySelector('#selected-size').textContent=selected;document.querySelector('#size-error').textContent=''}));document.querySelectorAll('[data-qty]').forEach(button=>button.addEventListener('click',()=>{quantity=Math.max(1,Math.min(99,quantity+(button.dataset.qty==='plus'?1:-1)));document.querySelector('#product-qty').textContent=quantity}));document.querySelector('#add-cart').addEventListener('click',()=>{if(!selected){document.querySelector('#size-error').textContent='Veuillez choisir une taille.';return}const items=cartItems(),existing=items.find(x=>x.id===p.id&&x.size===selected);if(existing)existing.quantity=Math.min(99,existing.quantity+quantity);else items.push({id:p.id,size:selected,quantity});saveCart(items);location.href=link('/panier/')}); }
function setupCart() { document.querySelectorAll('[data-cart-change]').forEach(button=>button.addEventListener('click',()=>{const items=cartItems(),item=items.find(x=>x.id===button.dataset.id&&x.size===button.dataset.size);if(item)item.quantity+=button.dataset.cartChange==='plus'?1:-1;saveCart(items.filter(x=>x.quantity>0));render()}));document.querySelectorAll('[data-cart-remove]').forEach(button=>button.addEventListener('click',()=>{saveCart(cartItems().filter(x=>!(x.id===button.dataset.cartRemove&&x.size===button.dataset.size)));render()})); }



const COUNTRIES = [['FR','France'],['BE','Belgique'],['DE','Allemagne'],['AT','Autriche'],['BG','Bulgarie'],['CY','Chypre'],['HR','Croatie'],['DK','Danemark'],['ES','Espagne'],['EE','Estonie'],['FI','Finlande'],['GR','Grèce'],['HU','Hongrie'],['IE','Irlande'],['IT','Italie'],['LV','Lettonie'],['LT','Lituanie'],['LU','Luxembourg'],['MT','Malte'],['NL','Pays-Bas'],['PL','Pologne'],['PT','Portugal'],['CZ','Tchéquie'],['RO','Roumanie'],['SK','Slovaquie'],['SI','Slovénie'],['SE','Suède'],['CH','Suisse'],['GB','Royaume-Uni'],['NO','Norvège'],['IS','Islande'],['LI','Liechtenstein'],['MC','Monaco'],['AD','Andorre'],['SM','Saint-Marin']];
function shellHeader(){
  const nav=[['/','ACCUEIL'],['/robes-orientales/','ROBES ORIENTALES'],['/kaftans/','KAFTANS'],['/robes-de-ceremonie/','CÉRÉMONIE'],['/nouveautes/','NOUVEAUTÉS'],['/la-maison/','LA MAISON'],['/guide-tailles/','GUIDE DES TAILLES']];
  return `<div class="benefit-bar"><span>TENUES TRADITIONNELLES DU MAGHREB</span><span>DU 34 AU 58</span><span>EUROPE · PRIX EN EUROS</span></div><header class="site-header header-inner-page"><div class="header-inner"><button class="icon-button mobile-menu" id="menu-toggle" aria-label="Ouvrir le menu" aria-expanded="false">${svg('menu')}</button><a class="brand" href="/" aria-label="El Oulfa Création, accueil"><img src="/assets/logo-transparent.png" alt="El Oulfa Création"><span class="brand-wordmark"><strong>EL OULFA</strong><em>CRÉATION</em></span></a><form class="header-search" id="header-search" role="search"><input name="q" type="search" placeholder="Une robe, une couleur, une envie…" aria-label="Rechercher une robe"><button aria-label="Rechercher">${svg('search')}</button></form><div class="header-actions"><span class="euro-label">EUR €</span><button class="icon-button search-toggle" id="search-toggle" aria-label="Rechercher">${svg('search')}</button><button class="icon-button bag-link" id="cart-toggle" aria-label="Ouvrir le panier">${svg('bag')}<span class="bag-count" data-cart-count>0</span></button></div></div><nav class="main-nav" id="main-nav" aria-label="Navigation principale">${nav.map(([url,label])=>`<a href="${url}">${label}</a>`).join('')}</nav><form class="search-panel" id="search-form" role="search" hidden><label for="search-input">Rechercher une robe</label><div><input id="search-input" name="q" type="search" placeholder="Terracotta, prune, kaftan…"><button type="submit">RECHERCHER</button></div></form></header><div class="drawer-overlay" id="drawer-overlay" hidden></div><aside class="cart-drawer" id="cart-drawer" role="dialog" aria-modal="true" aria-label="Mon panier" aria-hidden="true"><div class="drawer-head"><h2>MON PANIER <span data-cart-count>0</span></h2><button class="icon-button" id="cart-close" aria-label="Fermer le panier">${svg('close')}</button></div><div class="drawer-body" id="drawer-body"></div><div class="drawer-foot"><div class="drawer-total"><span>Sous-total</span><strong id="drawer-total">0 €</strong></div><a class="button button-dark" href="/commande/">COMMANDER ${svg('arrow')}</a><a class="button button-outline" href="/panier/">ACCÉDER AU PANIER</a></div></aside><nav class="bottom-nav" aria-label="Navigation mobile"><a href="/">${svg('search')}<span>Accueil</span></a><a href="/robes-orientales/">${svg('menu')}<span>Collection</span></a><a href="/nouveautes/">${svg('arrow')}<span>Nouveautés</span></a><a href="/panier/">${svg('bag')}<span>Panier</span></a><a href="/profil/">${svg('check')}<span>Mon espace</span></a></nav>`;
}
function shellFooter(){return `<footer class="footer"><div class="footer-grid"><div><a class="footer-brand" href="/"><img src="/assets/logo-transparent.png" alt="El Oulfa Création"></a><p>L’héritage du Maghreb.<br>L’élégance d’aujourd’hui.</p></div><div><h3>LA COLLECTION</h3><a href="/robes-orientales/">Robes orientales</a><a href="/kaftans/">Kaftans</a><a href="/robes-de-ceremonie/">Robes de cérémonie</a><a href="/grandes-tailles/">Du 34 au 58</a></div><div><h3>LA MAISON</h3><a href="/la-maison/">Notre univers</a><a href="/guide-tailles/">Guide des tailles</a><a href="/aide/">Questions fréquentes</a><a href="/contact/">Contact</a></div><div><h3>VOTRE BOUTIQUE EN EUROPE</h3><p>Une sélection de tenues orientales, disponible du 34 au 58.</p><p>Prix en euros · 80 € par modèle</p><a href="/livraison-retours/">Livraison & retours</a></div></div><div class="footer-legal"><a href="/mentions-legales/">Mentions légales</a><a href="/conditions-generales-vente/">Conditions de vente</a><a href="/confidentialite/">Confidentialité</a><a href="/cookies/">Cookies</a></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} EL OULFA CRÉATION</span><span>TENUES TRADITIONNELLES DU MAGHREB</span></div></footer>`;}
function guidePage(){return `<main class="section-wrap extra-page info-page size-guide">${pageIntro('DU 34 AU 58','GUIDE DES TAILLES','Une belle allure commence par une coupe dans laquelle on se sent bien.')}<div class="guide-intro"><div><span class="eyebrow">PRENDRE SES MESURES</span><h2>Trouvez votre juste mesure.</h2><p>Utilisez un mètre ruban souple, sans serrer. Mesurez le tour de poitrine au point le plus fort, le tour de taille au creux naturel et le tour de hanches à la partie la plus large.</p><p>Nos deux modèles sont proposés dans toutes les tailles paires du 34 au 58.</p></div><img src="/assets/matiere-chic.webp" alt="Étoffes ivoire et détails champagne"></div><div class="guide-table-scroll"><table><caption>Repères indicatifs de mensurations du corps, en centimètres</caption><thead><tr><th>Taille FR</th><th>Poitrine</th><th>Taille</th><th>Hanches</th></tr></thead><tbody>${Array.from({length:13},(_,i)=>`<tr><th scope="row">${34+i*2}</th><td>${80+i*4}</td><td>${62+i*4}</td><td>${86+i*4}</td></tr>`).join('')}</tbody></table></div><p class="guide-note">Ce tableau est indicatif : ce ne sont pas les mesures du vêtement. Les mesures exactes de chaque modèle seront confirmées avant toute commande définitive. Entre deux tailles, privilégiez la mesure la plus forte.</p><a class="button button-dark" href="/robes-orientales/">DÉCOUVRIR LES ROBES ${svg('arrow')}</a></main>`;}
function aboutPage(){return `<main class="extra-page about-page"><div class="about-hero"><img src="/assets/campagne-chic.webp" alt="Composition de matières ivoire, noir et champagne"><div><span>EL OULFA CRÉATION</span><h1>L’HÉRITAGE DU MAGHREB,<br>L’ÉLÉGANCE D’AUJOURD’HUI.</h1><p>Des tenues qui donnent une âme à vos plus beaux moments.</p></div></div><div class="section-wrap about-story"><div><span>NOTRE UNIVERS</span><h2>Un lien entre les cultures.<br>Une allure qui vous ressemble.</h2></div><div><p>El Oulfa Création célèbre la richesse des tenues traditionnelles du Maghreb. Des lignes fluides, des couleurs profondes et la lumière des détails composent un vestiaire oriental pensé pour les fêtes et les instants précieux.</p><p>Notre première sélection se décline en deux créations : Safran et Améthyste. Disponibles du 34 au 58, elles invitent chaque femme à trouver son allure. Notre boutique s’adresse exclusivement à l’Europe, avec des prix en euros.</p></div></div><section class="atelier-story section-wrap"><img src="/assets/atelier-chic.webp" alt="Étoffes et motifs de broderie orientale"><div><span class="kicker">LE SENS DU DÉTAIL</span><h2>Des reflets.<br>Des lignes. Une émotion.</h2><p>Un tissu qui capte la lumière, une encolure délicatement dessinée, une manche qui accompagne le geste. Notre inspiration commence dans ces détails.</p><a class="button button-dark" href="/robes-orientales/">EXPLORER LA COLLECTION</a></div></section><section class="section-wrap home-products"><div class="home-title"><div><span class="kicker">LA COLLECTION</span><h2>LES CRÉATIONS EL OULFA</h2></div></div>${productGrid()}</section></main>`;}
function helpPage(){return `<main class="section-wrap extra-page info-page">${pageIntro('À VOTRE ÉCOUTE','QUESTIONS FRÉQUENTES','Tout pour préparer votre sélection.')}<div class="faq-list">${[
 ['Quels modèles proposez-vous ?','Deux robes orientales : Safran en terracotta, et Améthyste en prune et or. Chacun est proposé à 80 €.'],
 ['Quelles tailles sont disponibles ?','Toutes les tailles paires du 34 au 58 sont proposées sur chaque fiche produit. Consultez notre guide des tailles pour des repères indicatifs.'],
 ['Dans quels pays livrez-vous ?','La boutique est destinée exclusivement à l’Europe. Les pays proposés figurent dans le formulaire de commande. Les frais et délais seront précisés avant règlement définitif.'],
 ['Dans quelle devise sont les prix ?','Tous les prix sont affichés en euros. Aucun changement de devise n’est nécessaire.'],
 ['Comment préparer une commande ?','Choisissez un modèle et une taille, ajoutez-le au panier puis renseignez vos coordonnées. Le paiement en ligne sera activé prochainement : aucun montant n’est débité et aucune commande commerciale n’est transmise actuellement.'],
 ['Comment fonctionne la saisie de carte ?','Le formulaire reconnaît Visa, Mastercard et American Express pendant la saisie et vérifie le format des champs. Aucun paiement n’est traité : le numéro, l’expiration et le cryptogramme ne sont ni enregistrés ni transmis. Le réseau CB éventuel sera confirmé par le futur prestataire de paiement.'],
 ['Puis-je modifier mon panier ?','Oui. Vous pouvez modifier les quantités ou supprimer une robe à tout moment depuis le panier.']
 ].map(([q,a],i)=>`<details ${i===0?'open':''}><summary>${q}</summary><p>${a}</p></details>`).join('')}</div></main>`;}
function contactPage(){return `<main class="section-wrap pro-page">${pageIntro('EL OULFA CRÉATION','CONTACT & CONSEILS','Une question sur une taille, une tenue ou la livraison ?')}<div class="profile-grid"><section class="pro-card"><h2>CHOISIR SA TAILLE</h2><p>Retrouvez les repères pour les tailles 34 à 58 et nos conseils pour prendre vos mesures.</p><a class="button button-outline" href="/guide-tailles/">GUIDE DES TAILLES</a></section><section class="pro-card"><h2>LIVRAISON EN EUROPE</h2><p>Consultez les informations concernant les destinations, les frais et les retours.</p><a class="button button-outline" href="/livraison-retours/">EN SAVOIR PLUS</a></section><section class="pro-card"><h2>JOINDRE LA MAISON</h2><p>Les coordonnées officielles de la maison seront communiquées ici à l’ouverture des commandes.</p><a class="button button-outline" href="/aide/">CONSULTER L’AIDE</a></section></div></main>`;}
function profilePage(){return `<main class="section-wrap pro-page">${pageIntro('EL OULFA CRÉATION','MON ESPACE','Retrouvez votre sélection et vos liens utiles.')}<div class="profile-grid"><section class="pro-card"><h2>MON PANIER</h2><p>${cartCount()} article${cartCount()>1?'s':''} dans votre sélection.</p><a class="button button-dark" href="/panier/">VOIR MON PANIER</a></section><section class="pro-card"><h2>MA DERNIÈRE SÉLECTION</h2><p>Le récapitulatif de votre dernier parcours reste disponible dans cet onglet.</p><a class="button button-outline" href="/merci/">VOIR LE RÉCAPITULATIF</a></section><section class="pro-card"><h2>PRÉPARER MON ACHAT</h2><p>Une collection du 34 au 58, à 80 € par robe, exclusivement pour l’Europe.</p><a class="button button-outline" href="/guide-tailles/">MES CONSEILS TAILLE</a></section></div></main>`;}
function checkoutPage(){
 const items=cartItems();
 if(!items.length)return `<main class="simple-page section-wrap"><h1>Ma commande</h1><div class="empty-state"><h2>Votre panier est vide</h2><a class="button button-dark" href="/robes-orientales/">DÉCOUVRIR LA COLLECTION</a></div></main>`;
 return `<main class="simple-page section-wrap pro-checkout"><div class="breadcrumbs"><a href="/panier/">Panier</a><span>/</span>Commande</div><h1>Finaliser ma sélection</h1><div class="checkout-steps"><span>01 · PANIER</span><span class="active">02 · COORDONNÉES</span><span>03 · CONFIRMATION</span></div><div class="cart-layout"><form id="checkout-form" class="checkout-form"><h2>VOS COORDONNÉES</h2><div class="form-grid"><label>Prénom *<input name="firstName" autocomplete="given-name" required maxlength="80"></label><label>Nom *<input name="lastName" autocomplete="family-name" required maxlength="80"></label><label>E-mail *<input name="email" type="email" autocomplete="email" required maxlength="150"></label><label>Téléphone *<input name="phone" type="tel" autocomplete="tel" required maxlength="30" minlength="6"></label></div><h2>ADRESSE DE LIVRAISON</h2><label>Pays européen *<select name="country" autocomplete="country" required><option value="">Choisir votre pays</option>${COUNTRIES.map(([code,name])=>`<option value="${code}">${name}</option>`).join('')}</select></label><label>Adresse *<input name="address" autocomplete="street-address" required maxlength="200"></label><div class="form-grid"><label>Code postal *<input name="postalCode" autocomplete="postal-code" required maxlength="15"></label><label>Ville *<input name="city" autocomplete="address-level2" required maxlength="100"></label></div><label>Précisions facultatives<textarea name="notes" rows="3" maxlength="500" placeholder="Une précision sur votre sélection…"></textarea></label><h2>PAIEMENT PAR CARTE</h2>${window.EOPayment.fields()}<p class="checkout-note">Les frais de livraison seront précisés avant le règlement définitif. Vos coordonnées restent dans ce formulaire et ne sont pas transmises.</p><button class="button button-dark checkout-submit" type="submit">VALIDER MA SÉLECTION ${svg('arrow')}</button></form><aside class="summary checkout-summary"><h2>VOTRE SÉLECTION</h2>${items.map(item=>{const p=byId(item.id);return `<div class="checkout-item"><img src="${p.images[0]}" alt="${p.short}"><p>${p.short}<small>${p.color} · Taille ${item.size} · Qté ${item.quantity}</small></p><strong>${money(p.price*item.quantity)}</strong></div>`}).join('')}<hr><div><span>Articles (${cartCount()})</span><strong>${money(cartTotal())}</strong></div><div><span>Livraison</span><span>À préciser</span></div><hr><div class="total"><span>Sous-total</span><strong>${money(cartTotal())}</strong></div><p class="summary-note">Prix en euros · Livraison en Europe<br>Aucun débit à cette étape.</p></aside></div></main>`;
}
function setupCheckout(){
 const form=document.querySelector('#checkout-form');if(!form)return;
 const payment=window.EOPayment.setup(form);
 form.addEventListener('submit',event=>{
  event.preventDefault();if(!payment.validate()||!form.reportValidity())return;
  if(!COUNTRIES.some(([code])=>code===form.elements.country.value))return;
  const items=cartItems();if(!items.length){render();return;}
  const selection={reference:'EO-'+crypto.randomUUID().slice(0,8).toUpperCase(),items,total:cartTotal(),currency:'EUR',country:form.elements.country.value,createdAt:new Date().toISOString()};
  try{sessionStorage.setItem('eloulfa-selection',JSON.stringify(selection));}catch{form.insertAdjacentHTML('beforeend','<p role="alert">Votre navigateur bloque l’enregistrement du récapitulatif. Autorisez le stockage pour continuer.</p>');return;}
  payment.clear();saveCart([]);location.href=link('/merci/');
 });
}
function thanksPage(){
 let selection;try{selection=JSON.parse(sessionStorage.getItem('eloulfa-selection')||'null');}catch{}
 if(!selection||!Array.isArray(selection.items))return `<main class="simple-page section-wrap thanks-page"><h1>Votre prochaine belle occasion.</h1><p>Aucune sélection enregistrée dans cet onglet.</p><a class="button button-dark" href="/robes-orientales/">DÉCOUVRIR LA COLLECTION</a></main>`;
 return `<main class="section-wrap simple-page thanks-page"><div class="thanks-mark">${svg('check')}</div><span class="kicker">EL OULFA CRÉATION</span><h1>Votre sélection est prête.</h1><p class="thanks-lead">Merci d’avoir découvert notre univers. Votre récapitulatif est enregistré dans cet onglet. Aucun paiement n’a été effectué et aucune commande n’a été transmise à la boutique.</p><div class="thanks-reference"><span>RÉFÉRENCE DE VOTRE SÉLECTION</span><strong>${escapeHtml(selection.reference)}</strong></div><div class="selection-recap">${selection.items.map(item=>{const p=byId(item.id);return p?`<p>${escapeHtml(p.short)} · Taille ${escapeHtml(item.size)} · Qté ${escapeHtml(item.quantity)} <strong>${money(p.price*item.quantity)}</strong></p>`:''}).join('')}<hr><p>Sous-total <strong>${money(selection.total)}</strong></p></div><a class="button button-dark" href="/robes-orientales/">CONTINUER MA VISITE ${svg('arrow')}</a></main>`;
}
function legalPage(){
 const slug=location.pathname.split('/').filter(Boolean).pop();
 const content={
 'mentions-legales':['MENTIONS LÉGALES','El Oulfa Création présente une collection de robes orientales et de kaftans à destination de l’Europe.','Les informations d’identification de l’entreprise, l’adresse du siège, le numéro d’immatriculation et les coordonnées de contact seront ajoutés avant l’ouverture des ventes. Aucun achat avec paiement n’est actuellement possible.','Hébergement : GitHub Pages, service fourni par GitHub. Les visuels de présentation ont été créés pour cette vitrine ; les caractéristiques définitives des articles seront confirmées avant commercialisation.'],
 'conditions-generales-vente':['CONDITIONS DE VENTE','La collection comprend deux modèles proposés à 80 € chacun, dans les tailles paires du 34 au 58. Les prix sont affichés en euros.','Le parcours permet de préparer une sélection. Il ne forme actuellement aucun contrat de vente : aucun paiement n’est traité et aucune commande commerciale n’est transmise. Les frais, délais de livraison, modalités de règlement, informations fiscales et coordonnées du vendeur seront présentés avant l’activation des achats.','À l’ouverture des ventes, les conditions applicables et les droits légaux du consommateur seront précisés avant la validation d’une commande.'],
 'livraison-retours':['LIVRAISON & RETOURS','La boutique est destinée exclusivement à l’Europe. Les destinations disponibles figurent dans le formulaire de préparation de commande.','Les tarifs de livraison et les délais ne sont pas encore fixés. Ils seront affichés avant tout règlement définitif. Aucune expédition n’est déclenchée par le parcours actuel.','Pour les consommateurs européens, les droits légaux applicables, notamment le délai de rétractation de 14 jours lorsqu’il s’applique, seront respectés. L’adresse de retour, les modalités et les éventuelles exceptions seront précisées avant l’ouverture des ventes.'],
 'confidentialite':['CONFIDENTIALITÉ','Le panier est conservé dans le stockage local de votre navigateur. Le récapitulatif de votre sélection est conservé uniquement pour l’onglet courant.','Les coordonnées renseignées restent dans le formulaire : elles ne sont envoyées à aucun serveur et ne sont pas conservées dans le récapitulatif. Les informations de carte saisies restent uniquement dans les champs du formulaire, sans transmission ni enregistrement. Elles sont effacées à la validation ou en quittant la page. Fermer l’onglet efface le récapitulatif de session ; supprimer les données du site efface le panier.','Aucun outil de publicité ou de mesure d’audience n’est installé. L’hébergement GitHub Pages et le service Google Fonts peuvent recevoir les informations techniques nécessaires au chargement des pages. Les informations du futur responsable de traitement seront complétées avant l’ouverture commerciale.'],
 'cookies':['COOKIES & STOCKAGE','Cette boutique ne dépose aucun cookie publicitaire ni cookie de mesure d’audience.','Le stockage local mémorise les articles de votre panier. Le stockage de session conserve le dernier récapitulatif dans cet onglet. Ces fonctions permettent le fonctionnement du parcours.','Vous pouvez supprimer ces données dans les réglages de votre navigateur. Cette suppression réinitialise votre panier et votre sélection.']
 };
 const [title,...paragraphs]=content[slug]||content['mentions-legales'];
 return `<main class="section-wrap extra-page info-page legal-copy">${pageIntro('INFORMATIONS',title,'El Oulfa Création')}${paragraphs.map(p=>`<p>${p}</p>`).join('')}<a class="text-link" href="/aide/">CONSULTER LES QUESTIONS FRÉQUENTES ${svg('arrow')}</a></main>`;
}
function render(){
 const page=document.body.dataset.page;
 const p=byId(document.body.dataset.productId||new URLSearchParams(location.search).get('id'));
 const views={home:homePage,collection:collectionPage,new:newPage,guide:guidePage,about:aboutPage,help:helpPage,cart:cartPage,checkout:checkoutPage,thanks:thanksPage,profile:profilePage,contact:contactPage,legal:legalPage};
 const body=page==='product'?(p?productPage(p):`<main class="simple-page section-wrap"><h1>Robe indisponible</h1><a href="/robes-orientales/">Voir la collection</a></main>`):(views[page]||homePage)();
 document.querySelector('#app').innerHTML=(shellHeader()+body+shellFooter()).replace(/(href|src)="\//g,`$1="${BASE}/`).replace(/url\('\/assets/g,`url('${BASE}/assets`);
 updateCount();setupShell();if(page==='home')setupHero();if(page==='product'&&p)setupProduct(p);if(page==='cart')setupCart();if(page==='checkout')setupCheckout();
 const menu=document.querySelector('#menu-toggle');menu.addEventListener('click',()=>menu.setAttribute('aria-expanded',String(document.querySelector('#main-nav').classList.contains('open'))));
}
document.addEventListener('DOMContentLoaded',render);

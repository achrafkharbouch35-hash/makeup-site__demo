/* =====================================================
   ÉLÉA BEAUTY — JAVASCRIPT
===================================================== */

const SHOP_NAME = "ÉLÉA BEAUTY";
const WHATSAPP_NUMBER = "212600000000";
const INSTAGRAM_URL = "https://instagram.com/.beauty";

const PRODUCTS = [
 {id:1,name:"Velvet Nude Lipstick",category:"Lèvres",price:129,oldPrice:159,badge:"Best-seller",image:"https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=85",description:"Un rouge à lèvres crémeux et élégant avec une finition douce et confortable."},
 {id:2,name:"Rose Glow Blush",category:"Blush",price:119,oldPrice:null,badge:"Nouveau",image:"https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=85",description:"Un blush lumineux pour donner instantanément un effet bonne mine."},
 {id:3,name:"Luxury Eyeshadow Palette",category:"Yeux",price:199,oldPrice:239,badge:"Best-seller",image:"https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=85",description:"Une palette polyvalente avec des teintes faciles à porter au quotidien."},
 {id:4,name:"Perfect Skin Foundation",category:"Teint",price:179,oldPrice:null,badge:"Nouveau",image:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=85",description:"Un fond de teint léger avec une couvrance modulable et un fini naturel."},
 {id:5,name:"Soft Pink Lip Gloss",category:"Lèvres",price:99,oldPrice:119,badge:"Promo",image:"https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=85",description:"Un gloss brillant pour des lèvres naturellement pulpeuses."},
 {id:6,name:"Creamy Peach Blush",category:"Blush",price:109,oldPrice:null,badge:"",image:"https://images.unsplash.com/photo-1590156221829-32a4d7c5a1a5?auto=format&fit=crop&w=800&q=85",description:"Une texture crémeuse facile à appliquer pour un teint frais."},
 {id:7,name:"Essential Eye Palette",category:"Yeux",price:169,oldPrice:null,badge:"",image:"https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=85",description:"Une palette essentielle pour créer facilement différents looks."},
 {id:8,name:"Natural Glow Skin",category:"Teint",price:149,oldPrice:179,badge:"Promo",image:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=85",description:"Une base légère pour un teint naturel et lumineux."}
];

let cart = JSON.parse(localStorage.getItem("eleaCart")) || [];
let favorites = JSON.parse(localStorage.getItem("eleaFavorites")) || [];
let currentFilter = "Tous";
let currentProduct = null;
let modalQuantity = 1;

const productsGrid=document.getElementById("productsGrid");
const cartCount=document.getElementById("cartCount");
const cartPanel=document.getElementById("cart");
const cartItems=document.getElementById("cartItems");
const cartTotal=document.getElementById("cartTotal");
const cartOverlay=document.getElementById("cartOverlay");
const productModal=document.getElementById("productModal");
const modalOverlay=document.getElementById("modalOverlay");
const toast=document.getElementById("toast");

document.addEventListener("DOMContentLoaded",()=>{setupLinks();renderProducts();updateCart();setupEvents();});

function setupLinks(){
 ["instagramLink","heroInstagram","instagramBottom","footerInstagram"].forEach(id=>{const e=document.getElementById(id);if(e)e.href=INSTAGRAM_URL;});
 const w=document.getElementById("footerWhatsApp");if(w)w.href=`https://wa.me/${WHATSAPP_NUMBER}`;
}
function setupEvents(){
 document.getElementById("mobileMenuBtn").addEventListener("click",()=>document.getElementById("mobileMenu").classList.toggle("active"));
 document.getElementById("searchBtn").addEventListener("click",openSearch);
 document.getElementById("closeSearch").addEventListener("click",closeSearch);
 document.getElementById("searchInput").addEventListener("input",e=>searchProducts(e.target.value));
 document.querySelectorAll(".filter-btn").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".filter-btn").forEach(x=>x.classList.remove("active"));b.classList.add("active");currentFilter=b.dataset.filter;renderProducts();}));
 document.querySelectorAll(".category-card").forEach(c=>c.addEventListener("click",()=>{currentFilter=c.dataset.category;document.querySelectorAll(".filter-btn").forEach(b=>b.classList.toggle("active",b.dataset.filter===currentFilter));renderProducts();document.getElementById("shop").scrollIntoView({behavior:"smooth"});}));
 document.getElementById("cartBtn").addEventListener("click",openCart);
 document.getElementById("closeCart").addEventListener("click",closeCart);
 cartOverlay.addEventListener("click",closeCart);
 document.getElementById("clearCart").addEventListener("click",()=>{cart=[];saveCart();updateCart();});
 document.getElementById("checkoutBtn").addEventListener("click",checkout);
 document.getElementById("modalClose").addEventListener("click",closeModal);
 modalOverlay.addEventListener("click",closeModal);
 document.getElementById("minusQuantity").addEventListener("click",()=>{if(modalQuantity>1){modalQuantity--;updateModalQuantity();}});
 document.getElementById("plusQuantity").addEventListener("click",()=>{modalQuantity++;updateModalQuantity();});
 document.getElementById("modalAddCart").addEventListener("click",()=>{if(currentProduct){addToCart(currentProduct.id,modalQuantity);closeModal();}});
 document.getElementById("modalWhatsApp").addEventListener("click",orderCurrentProduct);
 document.getElementById("newsletterForm").addEventListener("submit",e=>{e.preventDefault();document.getElementById("newsletterMessage").textContent="Merci ! Vous êtes maintenant inscrit(e).";e.target.reset();});
 document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeSearch();closeModal();closeCart();}});
}
function renderProducts(list=null){
 const products=list||PRODUCTS.filter(p=>currentFilter==="Tous"||p.category===currentFilter);
 productsGrid.innerHTML="";
 if(!products.length){productsGrid.innerHTML='<p style="grid-column:1/-1;text-align:center;padding:50px;">Aucun produit trouvé.</p>';return;}
 products.forEach(product=>{
  const fav=favorites.includes(product.id);
  const card=document.createElement("article");card.className="product-card";
  card.innerHTML=`<div class="product-image"><img src="${product.image}" alt="${product.name}" loading="lazy">${product.badge?`<span class="product-badge">${product.badge}</span>`:""}<button class="favorite ${fav?"active":""}" data-favorite="${product.id}">${fav?"♥":"♡"}</button></div><div class="product-info"><div class="product-category">${product.category}</div><h3 class="product-name">${product.name}</h3><div class="product-price">${product.price} DH ${product.oldPrice?`<span class="old-price">${product.oldPrice} DH</span>`:""}</div><div class="product-actions"><button class="add-btn" data-add="${product.id}">Ajouter au panier</button><button class="quick-btn" data-view="${product.id}">♡</button></div></div>`;
  card.querySelector(".product-image").addEventListener("click",e=>{if(!e.target.closest(".favorite"))openProduct(product.id);});
  card.querySelector(".product-name").addEventListener("click",()=>openProduct(product.id));
  card.querySelector("[data-add]").addEventListener("click",e=>{e.stopPropagation();addToCart(product.id);});
  card.querySelector("[data-favorite]").addEventListener("click",e=>{e.stopPropagation();toggleFavorite(product.id);});
  card.querySelector("[data-view]").addEventListener("click",e=>{e.stopPropagation();openProduct(product.id);});
  productsGrid.appendChild(card);
 });
}
function openSearch(){document.getElementById("searchOverlay").classList.add("active");setTimeout(()=>document.getElementById("searchInput").focus(),100);}
function closeSearch(){document.getElementById("searchOverlay").classList.remove("active");}
function searchProducts(query){query=query.trim().toLowerCase();if(!query){renderProducts();return;}renderProducts(PRODUCTS.filter(p=>p.name.toLowerCase().includes(query)||p.category.toLowerCase().includes(query)));}
function toggleFavorite(id){favorites.includes(id)?favorites=favorites.filter(x=>x!==id):(favorites.push(id),showToast("Ajouté aux favoris ♥"));localStorage.setItem("eleaFavorites",JSON.stringify(favorites));renderProducts();}
function addToCart(id,quantity=1){const item=cart.find(x=>x.id===id);item?item.quantity+=quantity:cart.push({id,quantity});saveCart();updateCart();showToast("Produit ajouté au panier ✓");}
function saveCart(){localStorage.setItem("eleaCart",JSON.stringify(cart));}
function updateCart(){
 cartCount.textContent=cart.reduce((s,i)=>s+i.quantity,0);cartItems.innerHTML="";
 if(!cart.length){cartItems.innerHTML='<div class="empty-cart">Votre panier est vide.</div>';cartTotal.textContent="0 DH";return;}
 let total=0;
 cart.forEach(item=>{const p=PRODUCTS.find(x=>x.id===item.id);if(!p)return;total+=p.price*item.quantity;const el=document.createElement("div");el.className="cart-item";el.innerHTML=`<div class="cart-item-image" style="background-image:url('${p.image}')"></div><div><h4>${p.name}</h4><p>${p.price} DH</p><div class="cart-quantity"><button data-minus="${p.id}">−</button><span>${item.quantity}</span><button data-plus="${p.id}">+</button></div></div><button class="remove-item" data-remove="${p.id}">×</button>`;el.querySelector("[data-minus]").addEventListener("click",()=>changeQuantity(p.id,-1));el.querySelector("[data-plus]").addEventListener("click",()=>changeQuantity(p.id,1));el.querySelector("[data-remove]").addEventListener("click",()=>removeFromCart(p.id));cartItems.appendChild(el);});
 cartTotal.textContent=`${total} DH`;
}
function changeQuantity(id,amount){const item=cart.find(x=>x.id===id);if(!item)return;item.quantity+=amount;if(item.quantity<=0)cart=cart.filter(x=>x.id!==id);saveCart();updateCart();}
function removeFromCart(id){cart=cart.filter(x=>x.id!==id);saveCart();updateCart();}
function openCart(){cartPanel.classList.add("active");cartOverlay.classList.add("active");}
function closeCart(){cartPanel.classList.remove("active");cartOverlay.classList.remove("active");}
function openProduct(id){
 const p=PRODUCTS.find(x=>x.id===id);if(!p)return;currentProduct=p;modalQuantity=1;
 document.getElementById("modalProductImage").style.backgroundImage=`url("${p.image}")`;
 document.getElementById("modalCategory").textContent=p.category;
 document.getElementById("modalName").textContent=p.name;
 document.getElementById("modalPrice").innerHTML=`${p.price} DH ${p.oldPrice?`<span class="old-price">${p.oldPrice} DH</span>`:""}`;
 document.getElementById("modalDescription").textContent=p.description;updateModalQuantity();productModal.classList.add("active");document.body.style.overflow="hidden";
}
function closeModal(){productModal.classList.remove("active");document.body.style.overflow="";}
function updateModalQuantity(){document.getElementById("quantityValue").textContent=modalQuantity;}
function orderCurrentProduct(){if(!currentProduct)return;openWhatsApp(`Bonjour, je souhaite commander :\n\nProduit : ${currentProduct.name}\nPrix : ${currentProduct.price} DH\nQuantité : ${modalQuantity}\nTotal : ${currentProduct.price*modalQuantity} DH\n\nNom :\nVille :\nAdresse :`);}
function checkout(){
 if(!cart.length){showToast("Votre panier est vide.");return;}
 let message="Bonjour, je souhaite commander :\n\n",total=0;
 cart.forEach(item=>{const p=PRODUCTS.find(x=>x.id===item.id);if(!p)return;const sub=p.price*item.quantity;total+=sub;message+=`• ${p.name} x${item.quantity} = ${sub} DH\n`;});
 message+=`\nTotal : ${total} DH\n\nNom :\nVille :\nAdresse :`;openWhatsApp(message);
}
function openWhatsApp(message){window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,"_blank");}
let toastTimeout;
function showToast(message){toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>toast.classList.remove("show"),2500);}

import {cart,addtocart} from '../data/cart.js';
import {products, loadProducts} from '../data/products.js';
import {formatCurrency} from './utils/money.js';

loadProducts(renderProductsGrid);

function renderProductsGrid(){
  let productsHtml = '';

  const url = new URL(window.location.href);
  const search = url.searchParams.get('search');

  let filteredProducts = products;

  // If a search exists in the URL parameters,
  // filter the products that match the search.
  if (search) {
    filteredProducts = products.filter((product) => {
      let matchingKeyword = false;

      product.keywords.forEach((keyword) =>{
        if(keyword.toLowerCase().includes(search
          .toLowerCase())){
          matchingKeyword = true;
        }
      });
    
      return matchingKeyword ||
      product.name.toLowerCase().includes(search.toLowerCase());
    });
    document.querySelector('.js-search-bar').value = search;
  }

  filteredProducts.forEach((product) => {
    productsHtml +=`
    <div class="product-container">
          <div class="product-image-container">
            <img class="product-image"
              src="${product.image}">
          </div>

          <div class="product-name limit-text-to-2-lines">
            ${product.name}
          </div>

          <div class="product-rating-container">
            <img class="product-rating-stars"
              src="${product.getStarsUrl()}">
            <div class="product-rating-count link-primary">
              ${product.rating.count} 
            </div>
          </div>

          <div class="product-price">
            $${product.getPrice()}
          </div>

          <div class="product-quantity-container">
            <select>
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

          ${product.extraInfoHTML()}

          <div class="product-spacer"></div>

          <div class="added-to-cart">
            <img src="images/icons/checkmark.png">
            Added
          </div>

          <button class="add-to-cart-button button-primary js-add-to-cart"
          data-product-id="${product.id}">
            Add to Cart
          </button>
      </div>
    `;
  });

  document.querySelector('.js-products-grid').innerHTML = productsHtml;

  function updateCartQuantity(){
      let cartQuantity = 0;
      cart.forEach((cartItem) =>{
      cartQuantity += cartItem.quantity;
      });

      localStorage.setItem('cartQuantity', cartQuantity);

    document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
  }
  updateCartQuantity();

  document.querySelectorAll('.js-add-to-cart').forEach((button) =>{
    button.addEventListener('click', () =>{
    const productId = button.dataset.productId;
    const h1 = document.querySelector('.added-to-cart');
    
    h1.style.opacity = 1;
    setTimeout(() => {
      h1.style.opacity = 0;
    }, 3000);

    addtocart(productId);
    updateCartQuantity();
   });
  });

  document.querySelector('.js-search-button')
    .addEventListener('click',() =>{
    callSearch();
  });
  

  function callSearch(){
    const search = document.querySelector('.js-search-bar').value;
    window.location.href = `amazon.html?search=${search}`;
  }
  
  document.querySelector('.js-search-bar')
    .addEventListener('keydown',(event)=>{
      if(event.key === 'Enter'){
        callSearch();
      }
    });

  
  // function loadCartQuantity (){
    
  //   let storedQuantity = localStorage.getItem('cartQuantity');
  
  //   if (storedQuantity !== null) {
  //     document.querySelector('.js-cart-quantity').innerHTML = storedQuantity;
  //   }
  // }
  
}
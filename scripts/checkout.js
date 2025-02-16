import {renderOrderSummary} from "./checkout/orderSummary.js";
import {renderPaymentSummary} from "./checkout/paymentSummary.js";
import { loadProducts, loadProductsFetch } from "../data/products.js";
import { cart,loadCart} from "../data/cart.js";
//import '../data/cart-class.js';
// import '../data/backend-practise.js';


async function loadPage() {
  try {
    await loadProductsFetch();

    const value = await new Promise((resolve) => {
        loadCart(resolve);
    });

  } catch (error) {
    console.log('Unexpected error. Please try again later.');
  }

  renderOrderSummary();
  renderPaymentSummary();
  updateCheckoutCartQuantity();
}
loadPage();



export function updateCheckoutCartQuantity() {
  let cartQuantity = 0;
  cart.forEach((item) => {
    cartQuantity += item.quantity;
  });
  
  const quantityElement = document.querySelector('.js-cart-quantity');
  quantityElement.innerHTML = `${cartQuantity} ${cartQuantity === 1 ? 'item' : 'items'}`;
}


/*
Promise.all([
  loadProductsFetch(),
  new Promise((resolve) =>{
    loadCart(() =>{
      resolve();
    });
  })

]).then(() =>{
  renderOrderSummary();
  renderPaymentSummary();
});
*/



// new Promise((resolve) =>{
//   loadProducts(() =>{
//     resolve();
//   });

// }).then(() =>{
//   return new Promise((resolve) =>{
//     loadCart(() =>{
//       resolve();
//     });
//   });

// }).then(() =>{
//   renderOrderSummary();
//   renderPaymentSummary();
// });






// loadProducts(() => {
//   loadCart(() =>{
//     renderOrderSummary();
//     renderPaymentSummary();
//   });
// });



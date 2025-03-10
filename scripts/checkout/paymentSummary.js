import {cart,resetCart} from '../../data/cart.js';
import { getProduct, loadProductsFetch } from '../../data/products.js';
import { getDeliveryOption } from '../../data/deliveryOptions.js';
import { formatCurrency } from '../utils/money.js';
import { addOrder } from '../../data/orders.js';

export function renderPaymentSummary(){
  let productPriceCents = 0;
  let shippingPriceCents = 0;

  cart.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    //console.log(product);
    productPriceCents += product.priceCents * cartItem.quantity;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents;

  });
  // console.log(productPriceCents);
  // console.log(shippingPriceCents);
  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;

  const taxCents = totalBeforeTaxCents * 0.1;
  const totalCents = totalBeforeTaxCents + taxCents;

  const paymentSummaryHTML = `
      <div class="payment-summary-title">
        Order Summary
      </div>

      <div class="payment-summary-row">
        <div>Items (3):</div>
        <div class="payment-summary-money">
        $${formatCurrency(productPriceCents)}
        </div>
      </div>

      <div class="payment-summary-row">
        <div>Shipping &amp; handling:</div>
        <div class="payment-summary-money">
        $${formatCurrency(shippingPriceCents)}
        </div>
      </div>

      <div class="payment-summary-row subtotal-row">
        <div>Total before tax:</div>
        <div class="payment-summary-money">
        $${formatCurrency(totalBeforeTaxCents)}
        </div>
      </div>

      <div class="payment-summary-row">
        <div>Estimated tax (10%):</div>
        <div class="payment-summary-money">
        $${formatCurrency(taxCents)}
        </div>
      </div>

      <div class="payment-summary-row total-row">
        <div>Order total:</div>
        <div class="payment-summary-money">
        $${formatCurrency(totalCents)}
        </div>
      </div>

      <button class="place-order-button button-primary js-place-order">
        Place your order
      </button>
  `;
  
  document.querySelector('.js-payment-summary')
    .innerHTML = paymentSummaryHTML;

    const placeOrderButton = document.querySelector('.js-place-order');

    function updatePlaceOrderButton() {
      if (cart.length === 0) {
        placeOrderButton.disabled = true; 
        placeOrderButton.classList.add('disabled'); // Optional: Add a class for styling
      } else {
        placeOrderButton.disabled = false;
        placeOrderButton.classList.remove('disabled');
      }
    }
    console.log(placeOrderButton)
    
    // Call this function initially to set the button state
    updatePlaceOrderButton();
    
    // Add event listener
    placeOrderButton.addEventListener('click', async () => {
      if (cart.length === 0) return; // Prevents clicking if cart is empty
    
      try {
        const response = await fetch('https://supersimplebackend.dev/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ cart })
        });
    
        const order = await response.json();
        addOrder(order);
        
        // Empty the cart and update the button state
        resetCart();
        updatePlaceOrderButton();
    
        window.location.href = 'orders.html';
      } catch (error) {
        console.log(error);
      }
    });
    
}
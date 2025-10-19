// src/pages/Cart.jsx
import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import '../stayles/estiloCart.css';

const Cart = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal 
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <h1>Carrito de Compras</h1>
        <div className="empty-cart">
          <p>Tu carrito está vacío</p>
          <Link to="/productos" className="continue-shopping">
            Continuar Comprando
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Carrito de Compras</h1>
      
      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.imagen} alt={item.nombre} />
              <div className="item-details">
                <h3>{item.nombre}</h3>
                <p>${item.precio}</p>
              </div>
              <div className="quantity-controls">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              <div className="item-total">
                ${(item.precio * item.quantity).toFixed(2)}
              </div>
              <button 
                onClick={() => removeFromCart(item.id)}
                className="remove-btn"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Resumen del Pedido</h2>
          <div className="summary-details">
            <div className="subtotal">
              <span>Subtotal:</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
            <div className="shipping">
              <span>Envío:</span>
              <span>$0.00</span>
            </div>
            <div className="total">
              <span>Total:</span>
              <span>${(getCartTotal() + 0).toFixed(2)}</span>
            </div>
          </div>

          <div className="payment-methods">
            <h3>Métodos de Pago</h3>
            <div className="payment-options">
              <label>
                <input type="radio" name="payment" value="card" defaultChecked />
                Tarjeta de Crédito/Débito
              </label>
              <label>
                <input type="radio" name="payment" value="paypal" />
                PayPal
              </label>
              <label>
                <input type="radio" name="payment" value="transfer" />
                Transferencia Bancaria
              </label>
            </div>
          </div>

          <div className="cart-actions">
            <button className="checkout-btn">
              Proceder al Pago
            </button>
            <button onClick={clearCart} className="clear-cart-btn">
              Vaciar Carrito
            </button>
            <Link to="/productos" className="continue-shopping">
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
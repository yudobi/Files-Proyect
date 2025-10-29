import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import PayPalPayment from '../components/componentesGenerales/PayPalPayment';
import '../stayles/estiloCart.css';
import { registerOrder } from '../api/order';
//import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal 
  } = useCart();

  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [showPayPal, setShowPayPal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('idle'); // 'idle', 'processing', 'success', 'error'

  const subtotal = getCartTotal();
  const shipping = 5.00;
  const total = subtotal + shipping;

  //const navigate = useNavigate();

  const handlePaymentSuccess = async (details) => {
  try {
    // Crear el array de productos para enviar al backend
    const items = cartItems.map(item => ({
      product: item.id,    // ID del producto en tu DB
      quantity: item.quantity,
      price_at_purchase: item.precio
    }));

    const orderData = {
      customer_name: "Nombre del Cliente", // o usar tu estado de usuario
      customer_email: "correo@cliente.com", // o tu estado de usuario
      address: "Dirección del cliente",
      payment_method: "PayPal",
      payment_status: "COMPLETED",
      paypal_order_id: details.id, // ID de PayPal
      items: items
    };

    await registerOrder(orderData);

    alert("✅ Compra registrada y correo enviado");
    clearCart();
    //navigate("/order-confirmation"); // Página de confirmación

  } catch (error) {
    console.error("Error registrando la orden:", error);
    alert("❌ Hubo un error registrando la orden.");
  }
};

  const handlePaymentError = (error) => {
    console.error('Error en el pago:', error);
    setPaymentStatus('error');
  };

  const handleProceedToPayment = () => {
    setShowPayPal(true);
    setPaymentStatus('processing');
  };

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
          <h2>Productos ({cartItems.length})</h2>
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <img 
                src={item.imagen} 
                alt={item.nombre}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/80';
                }}
              />
              <div className="item-details">
                <h3>{item.nombre}</h3>
                <p className="item-price">Precio unitario: ${item.precio}</p>
              </div>
              <div className="quantity-controls">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span className="quantity">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              <div className="item-total">
                <strong>${(item.precio * item.quantity).toFixed(2)}</strong>
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
              <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} productos):</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="shipping">
              <span>Envío:</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="total">
              <span><strong>Total:</strong></span>
              <span><strong>${total.toFixed(2)}</strong></span>
            </div>
          </div>

          <div className="payment-methods">
            <h3>Métodos de Pago</h3>
            <div className="payment-options">
              
              <label>
                <input type="radio" name="payment" value="paypal" />
                PayPal
              </label>
              
            </div>
          </div>

          <div className="cart-actions">
            {!showPayPal ? (
              <>
                <button 
                  className="checkout-btn"
                  onClick={handleProceedToPayment}
                >
                  Proceder al Pago - ${total.toFixed(2)}
                </button>
                <button onClick={clearCart} className="clear-cart-btn">
                  Vaciar Carrito
                </button>
                <Link to="/productos" className="continue-shopping">
                  Continuar Comprando
                </Link>
              </>
            ) : (
              <div className="payment-section">
                {paymentStatus === 'error' && (
                  <div className="payment-error">
                    ❌ Error en el pago. Por favor, intenta nuevamente.
                  </div>
                )}
                <PayPalPayment 
                  total={total}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                />
                <button 
                  onClick={() => setShowPayPal(false)}
                  className="back-to-cart-btn"
                >
                  ← Volver al carrito
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

/*// src/pages/Cart.jsx
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

export default Cart;*/
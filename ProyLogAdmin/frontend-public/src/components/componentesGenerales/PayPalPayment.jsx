// src/components/PayPalPayment.jsx
import React, { useState } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import '../../stayles/estiloPaypal.css';

const PayPalPayment = ({ total, onPaymentSuccess, onPaymentError }) => {
  const [{ isPending }] = usePayPalScriptReducer();
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: total.toString(),
            currency_code: "MXN", // Cambia según tu moneda
          },
          description: `Compra en MiTienda - ${new Date().toLocaleDateString()}`,
        },
      ],
      application_context: {
        shipping_preference: "NO_SHIPPING", // O "SET_PROVIDED_ADDRESS" si manejas envíos
      },
    });
  };

  const onApprove = async (data, actions) => {
    try {
      const details = await actions.order.capture();
      console.log("Pago completado:", details);
      setPaymentCompleted(true);
      onPaymentSuccess(details);
    } catch (error) {
      console.error("Error en el pago:", error);
      onPaymentError(error);
    }
  };

  const onError = (error) => {
    console.error("Error de PayPal:", error);
    onPaymentError(error);
  };

  if (isPending) {
    return (
      <div className="paypal-loading">
        <div className="spinner"></div>
        <p>Cargando PayPal...</p>
      </div>
    );
  }

  return (
    <div className="paypal-payment">
      {!paymentCompleted ? (
        <>
          <h4>Pagar con PayPal</h4>
          <PayPalButtons
            createOrder={createOrder}
            onApprove={onApprove}
            onError={onError}
            style={{
              layout: "vertical",
              color: "blue",
              shape: "rect",
              label: "paypal",
            }}
          />
        </>
      ) : (
        <div className="payment-success">
          <div className="success-icon">✓</div>
          <h4>¡Pago Completado!</h4>
          <p>Tu pedido ha sido procesado exitosamente.</p>
        </div>
      )}
    </div>
  );
};

export default PayPalPayment;
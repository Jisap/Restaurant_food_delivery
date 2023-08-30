"use client"

import { LinkAuthenticationElement, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import AddressForm from "./AddressForm";

const CheckoutForm = () => { // se encarga de manejar el formulario de pago y realizar la comunicación con la API de Stripe para procesar los pagos

  const stripe = useStripe();
  const elements = useElements();

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get( // Se obtiene el clientSecret de la url
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => { // Stripe recibe el clientSecret y devuelve 
      switch (paymentIntent?.status) {                                       // una intención de pago cuyo status se analiza.
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { // Envio de la data de formulario
    e.preventDefault();

    if (!stripe || !elements) { // Sino se cargo stripe o los elements finalizamos el Checkout
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({ // Confirmación del pago, enviandole 
      elements,                                     // elements que contiene el clientSecret y los datos del formulario
      confirmParams: {
        return_url: "http://localhost:3000/success", // Si el pago fue exitoso redirigimos a la página de success
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message || "Something went wrong!");
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    
      <form
        id="payment-form"
        onSubmit={handleSubmit}
        className="min-h-[calc(100vh-6rem)] md:min-h-[calc(100vh-15rem)] p-4 lg:px-20 xl:px-40 flex flex-col gap-8"
      >
        <LinkAuthenticationElement id="link-authentication-element" />
        <PaymentElement                                                   // Se usa para ingresar detalles el pago
          id="payment-element"
          options={{
            layout: "tabs",
          }}
        />
        {/* Se usa para obtener las direcciones del pagador */}
        <AddressForm />              
        <button 
          disabled={isLoading || !stripe || !elements} 
          id="submit" 
          className="bg-red-500 text-white p-4 rounded-md w-28"
        >
          <span id="button-text">
            {isLoading 
              ? <div className="spinner" id="spinner"></div> 
              : "Pay now"
            }
          </span>
        </button>
        {/* Show any error or success messages */}
        {message && <div id="payment-message">{message}</div>}
      </form>
    
  )
}

export default CheckoutForm
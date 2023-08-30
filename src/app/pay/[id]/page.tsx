"use client"

import CheckoutForm from "@/components/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);


const PayPage = ({ params }:{ params: { id:string }}) => { // orderId

  const[clientSecret, setClientSecret] = useState("");

  const {id} = params;
  
  useEffect(() => {
    console.log('params-PayPage', id)
    const makeRequest = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/create-intent/${id}`,
          {
            method:"POST",
          }
        );
        const data = await res.json();
        setClientSecret(data.clientSecret);
      
      } catch (error) {
        console.log(error)
      }
    }
    makeRequest();
  },[id]);

  const options:StripeElementsOptions={
    clientSecret,
    appearance:{
      theme: "stripe"
    } 
  }

  return (
    <div>
      {clientSecret && (

        // Elements es como un provider para el objeto stripe, cuando se entra a CheckoutForm se le pasa el clientSecret en la url
        <Elements options={options} stripe={stripePromise}> 
          <CheckoutForm />
        </Elements>
      
      )}
    </div>
  )
}

export default PayPage
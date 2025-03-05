import React, { useState } from "react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Button } from "@headlessui/react";
import { useMutation } from "@apollo/client";
import { CREATE_PAYMENT_MUTATION } from "@/graphql/checkout/mutation";
import { CustomerAddressFormData } from "@/types/customer/types";
import { CartItem } from "@/redux/cartSlice";
import Swal from "sweetalert2";

interface PaymentFormProps {
  customerId?: string;
  cartItems: CartItem[];
  customerAddress?: CustomerAddressFormData | null;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  customerId,
  cartItems = [],
  customerAddress,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [createPayment] = useMutation(CREATE_PAYMENT_MUTATION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!customerAddress) {
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please provide your address!",
      });
      return;
    }

    setIsProcessing(true);

    // Confirm payment with Stripe (using redirect: "if_required" to capture paymentIntent data)
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/checkout/success",
      },
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message || "An unexpected error occurred.");
      setIsProcessing(false);
      return;
    }

    try {
      const { data } = await createPayment({
        variables: {
          input: {
            customerId,
            cartItems,
            customerAddress,
            paymentIntentId: paymentIntent?.id,
          },
        },
      });
      console.log("Order created:", data.createPayment);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(error.message || "Failed to create order.");
      } else {
        setMessage("Failed to create order.");
      }
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <PaymentElement className="mb-4" />
      <Button
        disabled={!stripe || isProcessing}
        className="w-full rounded-md bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        onClick={handleSubmit}
      >
        {isProcessing ? "Processing..." : "Pay Now"}
      </Button>
      {message && <div className="mt-4 text-red-500">{message}</div>}
    </form>
  );
};

export default PaymentForm;

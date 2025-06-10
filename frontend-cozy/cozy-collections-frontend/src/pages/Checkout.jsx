import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getUserCart, clearCart } from "../store/slices/cartSlice";
import { createPaymentIntent } from "../store/slices/orderSlice";
import { placeOrder } from "../store/slices/orderSlice";

const Checkout = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const cart = useSelector((state) => state.cart);
  const stripe = useStripe();
  const elements = useElements();

  const [cardError, setCardError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getUserCart(userId));
  }, [dispatch, userId]);

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",

    addresses: [
      {
        country: "",
        city: "",
        street: "",
        zip: "",
      },
    ],
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    addresses: Yup.array().of(
      Yup.object().shape({
        country: Yup.string().required("Required"),
        city: Yup.string().required("Required"),
        street: Yup.string().required("Required"),
        zip: Yup.string().required("Required"),
      })
    ),
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    if (!stripe || !elements) {
      alert("Stripe not loaded yet");
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      const { clientSecret } = await dispatch(
        createPaymentIntent({
          amount: cart.totalAmount,
          currency: "eur", 
        })
      ).unwrap();

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: `${values.firstName} ${values.lastName}`,
              email: values.email,
              address: {
                line1: values.addresses[0].street,
                city: values.addresses[0].city,
                country: values.addresses[0].country,
                postal_code: values.addresses[0].zip,
              },
            },
          },
        }
      );

      if (error) {
        setCardError(error.message);
        setLoading(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        await dispatch(placeOrder({ userId })).unwrap();
        dispatch(clearCart());
        alert("Payment successful! Order placed.");
        setTimeout(() => {
          window.location.href = `/user-profile/${userId}/profile`;
        }, 3000);
      }
    } catch (err) {
      alert("Payment failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-6">Checkout</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>First Name</label>
              <Field name="firstName" className="input" />
              <ErrorMessage
                name="firstName"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div>
              <label>Last Name</label>
              <Field name="lastName" className="input" />
              <ErrorMessage
                name="lastName"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label>Email</label>
            <Field name="email" type="email" className="input" />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <fieldset className="border p-4 rounded-md">
            <legend className="font-semibold">Billing Address</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <label>Street</label>
                <Field name="addresses[0].street" className="input" />
                <ErrorMessage
                  name="addresses[0].street"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div>
                <label>City</label>
                <Field name="addresses[0].city" className="input" />
                <ErrorMessage
                  name="addresses[0].city"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div>
                <label>Country</label>
                <Field as="select" name="addresses[0].country" className="input">
                  <option value="">Select country</option>
                  <option value="BE">Belgium</option>
                  <option value="TR">Turkey</option>
                  <option value="US">United States</option>
                  
                </Field>
                <ErrorMessage
                  name="addresses[0].country"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div>
                <label>Zip Code</label>
                <Field name="addresses[0].zip" className="input" />
                <ErrorMessage
                  name="addresses[0].zip"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
            </div>
          </fieldset>

          <div>
            <label>Card Details</label>
            <div className="p-3 border border-gray-300 rounded-md">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#5e5eb3",
                      "::placeholder": {
                        color: "#c2d0df",
                      },
                    },
                    invalid: {
                      color: "#f75939",
                      iconColor: "#fa755a",
                    },
                  },
                  hidePostalCode: true,
                }}
                onChange={(e) => setCardError(e.error ? e.error.message : "")}
              />
            </div>
            {cardError && (
              <p className="text-red-600 text-sm mt-1">{cardError}</p>
            )}
          </div>

          <div className="mt-6">
            <p className="text-lg font-medium mb-3">
              Total:{" "}
              <span className="text-#02c002-600">
                €{cart.totalAmount.toFixed(2)}
              </span>
            </p>
            <button
              type="submit"
              disabled={!stripe || loading}
              className={`w-full py-3 rounded-md text-white font-semibold ${
                loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Processing..." : "Pay"}
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default Checkout;

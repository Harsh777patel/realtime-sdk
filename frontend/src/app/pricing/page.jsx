'use client';
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Pricing = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      name: "Basic",
      price: "₹499",
      desc: "Best for beginners starting out.",
      features: ["✔️ 1 Project", "✔️ Basic Support", "✔️ Access to Community"],
    },
    {
      name: "Pro",
      price: "₹999",
      desc: "Perfect for professionals.",
      features: ["✔️ 5 Projects", "✔️ Priority Support", "✔️ Access to Tutorials", "✔️ Free Updates"],
    },
    {
      name: "Enterprise",
      price: "₹1999",
      desc: "For teams and businesses.",
      features: ["✔️ Unlimited Projects", "✔️ 24/7 Support", "✔️ Dedicated Manager", "✔️ Advanced Analytics"],
    }
  ];

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      plan: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      plan: Yup.string().required("Please select a plan"),
    }),
    onSubmit: (values) => {
      alert(`✅ Order placed!\nName: ${values.name}\nEmail: ${values.email}\nPlan: ${values.plan}`);
    },
  });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-900 flex flex-col items-center py-12 px-4">
      <div className="max-w-5xl w-full text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Pricing Plans</h1>
        <p className="text-gray-600 dark:text-neutral-400 mt-2">
          Choose a plan and checkout below.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mb-12">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`p-6 rounded-2xl shadow-lg border dark:border-neutral-700
              ${plan.name === "Pro"
                ? "bg-blue-600 text-white scale-105"
                : "bg-white dark:bg-neutral-800 text-gray-800 dark:text-white"}`}
          >
            <h2 className="text-2xl font-semibold">{plan.name}</h2>
            <p className="text-4xl font-bold my-4">
              {plan.price} <span className="text-base font-normal">/month</span>
            </p>
            <p className={`mb-6 ${plan.name === "Pro" ? "text-blue-100" : "text-gray-500 dark:text-neutral-400"}`}>
              {plan.desc}
            </p>
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
            <button
              onClick={() => setSelectedPlan(plan.name)}
              className={`w-full py-3 px-4 rounded-lg font-medium
                ${plan.name === "Pro"
                  ? "bg-white text-blue-600 hover:bg-gray-100"
                  : "bg-blue-600 text-white hover:bg-blue-700"}`}
            >
              Choose {plan.name}
            </button>
          </div>
        ))}
      </div>

      {/* Checkout Form with Formik */}
      {selectedPlan && (
        <form
          onSubmit={formik.handleSubmit}
          className="w-full max-w-lg bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6"
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            Checkout - {selectedPlan} Plan
          </h2>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Name</label>
            <input
              type="text"
              name="name"
              {...formik.getFieldProps('name')}
              className="mt-1 block w-full p-2 border rounded-md"
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-sm">{formik.errors.name}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              {...formik.getFieldProps('email')}
              className="mt-1 block w-full p-2 border rounded-md"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm">{formik.errors.email}</p>
            )}
          </div>

          <input type="hidden" name="plan" value={selectedPlan} onChange={formik.handleChange} />

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Confirm & Pay
          </button>
        </form>
      )}
    </div>
  );
};

export default Pricing;

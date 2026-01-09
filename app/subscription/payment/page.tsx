



// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';

// type PlanId = '1Y' | '2Y' | '3Y';

// declare global {
//   interface Window {
//     Razorpay: any;
//   }
// }

// export default function PaymentPage() {
//   const router = useRouter();

//   const API_URL = process.env.NEXT_PUBLIC_API_URL!;
//   const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY!;

//   const [planId, setPlanId] = useState<PlanId>('1Y');
//   const [enteredStudents, setEnteredStudents] = useState<number>(0);
//   const [futureStudents, setFutureStudents] = useState<number>(0);
//   const [couponCode, setCouponCode] = useState('');
//   const [price, setPrice] = useState<any>(null);
//   const [loading, setLoading] = useState(false);

//   /* ===============================
//      LOAD RAZORPAY SCRIPT
//   =============================== */
//   const loadRazorpay = () => {
//     return new Promise<boolean>((resolve) => {
//       if (window.Razorpay) return resolve(true);

//       const script = document.createElement('script');
//       script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//   /* ===============================
//      PRICE PREVIEW
//   =============================== */
//   const previewPrice = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_URL}/api/subscription/price-preview`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           planId,
//           enteredStudents,
//           futureStudents,
//           couponCode: couponCode || undefined
//         })
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);

//       setPrice(data);
//     } catch (err: any) {
//       alert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ===============================
//      PAY NOW
//   =============================== */
//   const payNow = async () => {
//     if (!price) {
//       alert('Please preview price first');
//       return;
//     }

//     setLoading(true);

//     try {
//       const loaded = await loadRazorpay();
//       if (!loaded) {
//         alert('Failed to load Razorpay');
//         return;
//       }

//       /* 1️⃣ Create Razorpay order (backend decides amount) */
//       const res = await fetch(`${API_URL}/api/subscription/create-payment`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           planId,
//           enteredStudents,
//           futureStudents,
//           couponCode: couponCode || undefined
//         })
//       });

//       const order = await res.json();
//       if (!res.ok) throw new Error(order.message);

//       /* 1️⃣.5️⃣ Create PaymentIntent (CRITICAL STEP) */
//       await fetch(`${API_URL}/api/payment/create-intent`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           orderId: order.orderId,
//           planId,
//           enteredStudents,
//           futureStudents,
//           couponCode: couponCode || undefined
//         })
//       });

//       /* 2️⃣ Open Razorpay Checkout */
//       const rzp = new window.Razorpay({
//         key: RAZORPAY_KEY,
//         amount: order.paidAmount * 100,
//         currency: 'INR',
//         order_id: order.orderId,
//         name: 'Attendance SaaS',
//         description: 'School Subscription',

//         handler: async function (response: any) {
//           /* 3️⃣ Verify payment */
//           const verifyRes = await fetch(
//             `${API_URL}/api/payment/verify`,
//             {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({
//                 razorpay_order_id: response.razorpay_order_id,
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_signature: response.razorpay_signature
//               })
//             }
//           );

//           const verifyData = await verifyRes.json();

//           if (!verifyRes.ok || !verifyData.success) {
//             alert('Payment verification failed');
//             return;
//           }

//           /* 4️⃣ Redirect to registration */
//           router.push(
//             `/auth/register?orderId=${verifyData.orderId}&paymentId=${verifyData.paymentId}`
//           );
//         },

//         theme: { color: '#2563eb' }
//       });

//       rzp.open();
//     } catch (err: any) {
//       alert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-lg mx-auto p-6 space-y-4">
//       <h1 className="text-2xl font-bold">Complete Your Payment</h1>

//       <select
//         value={planId}
//         onChange={e => setPlanId(e.target.value as PlanId)}
//         className="border p-2 w-full"
//       >
//         <option value="1Y">1 Year Plan</option>
//         <option value="2Y">2 Year Plan</option>
//         <option value="3Y">3 Year Plan</option>
//       </select>

//       <input
//         type="number"
//         placeholder="Current students"
//         className="border p-2 w-full"
//         min={1}
//         onChange={e => setEnteredStudents(+e.target.value)}
//       />

//       <input
//         type="number"
//         placeholder="Future students"
//         className="border p-2 w-full"
//         min={0}
//         onChange={e => setFutureStudents(+e.target.value)}
//       />

//       <input
//         type="text"
//         placeholder="Coupon code (optional)"
//         className="border p-2 w-full"
//         onChange={e => setCouponCode(e.target.value)}
//       />

//       <button
//         onClick={previewPrice}
//         disabled={loading}
//         className="bg-blue-600 text-white px-4 py-2 rounded w-full"
//       >
//         Preview Price
//       </button>

//       {price && (
//         <div className="border p-4 rounded">
//           <p>Original: ₹{price.originalAmount}</p>
//           <p>Discount: ₹{price.discountAmount}</p>
//           <p className="font-bold text-lg">
//             Payable: ₹{price.paidAmount}
//           </p>
//         </div>
//       )}

//       <button
//         onClick={payNow}
//         disabled={!price || loading}
//         className="bg-green-600 text-white px-4 py-2 rounded w-full"
//       >
//         {loading ? 'Processing...' : 'Pay Securely'}
//       </button>
//     </div>
//   );
// }


'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
type PlanMeta = {
  label: string;
  price: number;
  duration: string;
  save?: string; // ✅ optional
};


type PlanId = '1Y' | '2Y' | '3Y';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PLAN_META: Record<PlanId, PlanMeta> = {
  '1Y': {
    label: '1 Year Plan',
    price: 120,
    duration: 'for 1 Year'
  },
  '2Y': {
    label: '2 Year Plan',
    price: 200,
    duration: 'for 2 Years',
    save: 'Save 17%'
  },
  '3Y': {
    label: '3 Year Plan',
    price: 270,
    duration: 'for 3 Years',
    save: 'Save 25%'
  }
};


export default function PaymentPage() {
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL!;
  const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY!;

  const [planId, setPlanId] = useState<PlanId>('1Y');
  const [enteredStudents, setEnteredStudents] = useState<number>(100);
  const [futureStudents, setFutureStudents] = useState<number>(0);
  const [couponCode, setCouponCode] = useState('');
  const [price, setPrice] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  /* ===============================
     LOAD RAZORPAY SCRIPT
  =============================== */
  const loadRazorpay = () => {
    return new Promise<boolean>((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  /* ===============================
     AUTO PRICE PREVIEW
  =============================== */
  useEffect(() => {
    if (enteredStudents < 10) return;
    previewPrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planId, enteredStudents, futureStudents]);

  const previewPrice = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/subscription/price-preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          enteredStudents,
          futureStudents,
          couponCode: couponCode || undefined
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setPrice(data);
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     PAY NOW
  =============================== */
  const payNow = async () => {
    if (!price) return alert('Please preview price first');
    setLoading(true);

    try {
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error('Razorpay SDK failed');

      const res = await fetch(`${API_URL}/api/subscription/create-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          enteredStudents,
          futureStudents,
          couponCode: couponCode || undefined
        })
      });

      const order = await res.json();
      if (!res.ok) throw new Error(order.message);

      await fetch(`${API_URL}/api/payment/create-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.orderId,
          planId,
          enteredStudents,
          futureStudents,
          couponCode: couponCode || undefined
        })
      });

      const rzp = new window.Razorpay({
        key: RAZORPAY_KEY,
        amount: order.paidAmount * 100,
        currency: 'INR',
        order_id: order.orderId,
        name: 'AttendEase',
        description: 'School Subscription',
        handler: async (response: any) => {
          const verifyRes = await fetch(`${API_URL}/api/payment/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response)
          });

          const verifyData = await verifyRes.json();
          if (!verifyRes.ok || !verifyData.success)
            return alert('Payment verification failed');

          router.push(
            `/auth/register?orderId=${verifyData.orderId}&paymentId=${verifyData.paymentId}`
          );
        },
        theme: { color: '#2563eb' }
      });

      rzp.open();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-bg min-h-screen py-14">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold dashboard-text">
            Choose Your Subscription Plan
          </h1>
          <p className="dashboard-text-muted mt-2">
            Full access to attendance, reports & analytics
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2 dashboard-card shadow-dashboard-lg rounded-xl p-6 space-y-6">
            <h2 className="text-xl font-semibold dashboard-text">
              Select Your Plan
            </h2>

            {Object.entries(PLAN_META).map(([id, plan]) => (
              <label
                key={id}
                className={`dashboard-card border rounded-lg p-4 flex justify-between items-center cursor-pointer transition-dashboard ${
                  planId === id ? 'border-accent-blue' : ''
                }`}
              >
                <div className="flex gap-3 items-start">
                  <input
                    type="radio"
                    checked={planId === id}
                    onChange={() => setPlanId(id as PlanId)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-semibold dashboard-text">
                      {plan.label}
                    </p>
                    <p className="dashboard-text-muted text-sm">
                      ₹{plan.price}/student {plan.duration}
                    </p>
                  </div>
                </div>
                {plan.save && (
                  <span className="badge-success">{plan.save}</span>
                )}
              </label>
            ))}

            {/* Students */}
            <div>
              <label className="font-medium dashboard-text">
                Number of Students
              </label>
              <input
                type="number"
                min={10}
                value={enteredStudents}
                onChange={(e) => setEnteredStudents(+e.target.value)}
                className="dashboard-input w-full mt-2 rounded-md px-3 py-2"
              />
              <p className="text-xs dashboard-text-muted mt-1">
                Minimum 10 students required
              </p>
            </div>

            {/* Future */}
            <div>
              <label className="font-medium dashboard-text">
                Future Students (optional)
              </label>
              <input
                type="number"
                min={0}
                value={futureStudents}
                onChange={(e) => setFutureStudents(+e.target.value)}
                className="dashboard-input w-full mt-2 rounded-md px-3 py-2"
              />
            </div>

            {/* Coupon */}
            <div>
              <label className="font-medium dashboard-text">Coupon Code</label>
              <div className="flex gap-2 mt-2">
                <input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon"
                  className="dashboard-input flex-1 rounded-md px-3 py-2"
                />
                <button
                  onClick={previewPrice}
                  className="btn-secondary"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="dashboard-card shadow-dashboard-lg rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold dashboard-text">
              Order Summary
            </h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Plan</span>
                <span>{PLAN_META[planId].label}</span>
              </div>
              <div className="flex justify-between">
                <span>Students</span>
                <span>{enteredStudents}</span>
              </div>
              <div className="flex justify-between">
                <span>Price / Student</span>
                <span>₹{PLAN_META[planId].price}</span>
              </div>
            </div>

            <hr className="border-border" />

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-accent-blue">
                ₹{price?.paidAmount ?? '--'}
              </span>
            </div>

            <button
              onClick={payNow}
              disabled={loading || !price}
              className="btn-primary w-full mt-4"
            >
              {loading ? 'Processing…' : 'Continue to Payment'}
            </button>

            <ul className="text-sm dashboard-text-muted space-y-1 mt-4">
              <li>✔ Full access to all features</li>
              <li>✔ Unlimited teachers & classes</li>
              <li>✔ Priority support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

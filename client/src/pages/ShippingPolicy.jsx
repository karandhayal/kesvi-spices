import React, { useEffect } from 'react';

const ShippingPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-parosa-bg min-h-screen py-12 md:py-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-16 shadow-sm border border-gray-100">
        
        <div className="text-center mb-12 border-b border-gray-100 pb-8">
          <h1 className="text-3xl md:text-5xl font-serif text-parosa-dark mb-4">Shipping Policy</h1>
        </div>

        <div className="space-y-8 text-gray-700 text-sm md:text-base leading-relaxed font-sans">
          
          <section>
            <h2 className="text-xl font-serif text-parosa-dark mb-3">1. Delivery Method</h2>
            <p>
              [cite_start]The orders for the user are shipped through registered domestic courier companies and/or speed post only[cite: 120]. [cite_start]Delivery of all orders will be made to the address provided by the buyer at the time of purchase[cite: 123].
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-parosa-dark mb-3">2. Shipping Timelines</h2>
            <p>
              [cite_start]Orders are shipped within <strong>6 days</strong> from the date of the order and/or payment or as per the delivery date agreed at the time of order confirmation and delivering of the shipment, subject to courier company/post office norms[cite: 121].
            </p>
             <p className="mt-2">
               [cite_start]Delivery of our services will be confirmed on your email ID as specified at the time of registration[cite: 124].
             </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-parosa-dark mb-3">3. Disclaimer</h2>
            <p>
              [cite_start]Platform Owner shall not be liable for any delay in delivery by the courier company / postal authority[cite: 122].
            </p>
             <p className="mt-2">
               [cite_start]If there are any shipping cost(s) levied by the seller or the Platform Owner (as the case be), the same is not refundable[cite: 125].
             </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
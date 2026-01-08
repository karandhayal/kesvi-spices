import React, { useEffect } from 'react';

const RefundPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-parosa-bg min-h-screen py-12 md:py-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-16 shadow-sm border border-gray-100">
        
        <div className="text-center mb-12 border-b border-gray-100 pb-8">
          <h1 className="text-3xl md:text-5xl font-serif text-parosa-dark mb-4">Refund & Cancellation Policy</h1>
        </div>

        <div className="space-y-8 text-gray-700 text-sm md:text-base leading-relaxed font-sans">
          
          <section>
            <h2 className="text-xl font-serif text-parosa-dark mb-3">1. Cancellation Policy</h2>
            <p>
              [cite_start]Cancellations will only be considered if the request is made <strong>within 1 day</strong> of placing the order[cite: 99]. [cite_start]However, cancellation requests may not be entertained if the orders have been communicated to sellers/merchants and they have initiated the process of shipping them, or the product is out for delivery[cite: 100]. [cite_start]In such an event, you may choose to reject the product at the doorstep[cite: 101].
            </p>
            <p className="mt-2">
              [cite_start]Dhayal Industries does not accept cancellation requests for perishable items like flowers, eatables, etc[cite: 102]. [cite_start]However, refund/replacement can be made if the user establishes that the quality of the product delivered is not good[cite: 102].
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-parosa-dark mb-3">2. Damaged or Defective Items</h2>
            <p>
              [cite_start]In case of receipt of damaged or defective items, please report to our customer service team[cite: 103]. [cite_start]This should be reported <strong>within 1 day</strong> of receipt of products[cite: 105]. [cite_start]The request would be entertained once the seller/merchant has checked and determined the same at its own end[cite: 104].
            </p>
            <p className="mt-2">
              [cite_start]In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service <strong>within 1 day</strong> of receiving the product[cite: 106]. [cite_start]The customer service team after looking into your complaint will take an appropriate decision[cite: 107].
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-parosa-dark mb-3">3. Refund Processing</h2>
            <p>
              [cite_start]In case of any refunds approved by Dhayal Industries, it will take <strong>3 days</strong> for the refund to be processed to you[cite: 109].
            </p>
          </section>

           <section className="border-t border-gray-100 pt-8">
            <h2 className="text-xl font-serif text-parosa-dark mb-3">4. Return Policy</h2>
             <p>
               [cite_start]We offer refund/exchange within the first <strong>1 day</strong> from the date of your purchase[cite: 111]. [cite_start]If 1 day has passed since your purchase, you will not be offered a return, exchange, or refund of any kind[cite: 112].
             </p>
             [cite_start]<h3 className="font-bold mt-4 mb-2">Eligibility for Return/Exchange[cite: 113]:</h3>
             <ul className="list-disc pl-5 space-y-1">
               <li>The purchased item should be unused and in the same condition as you received it.</li>
               <li>The item must have original packaging.</li>
               [cite_start]<li>Only items found defective or damaged are replaced by us (based on an exchange request)[cite: 114].</li>
             </ul>
             <p className="mt-4">
               [cite_start]Once your returned product is received and inspected by us, we will notify you about the receipt[cite: 117]. [cite_start]If approved after the quality check, your request will be processed in accordance with our policies[cite: 118].
             </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
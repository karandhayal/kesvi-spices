import React, { useEffect } from 'react';

const TermsOfService = () => {
  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-parosa-bg min-h-screen py-12 md:py-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-16 shadow-sm border border-gray-100">
        
        {/* HEADER */}
        <div className="text-center mb-12 border-b border-gray-100 pb-8">
          <h1 className="text-3xl md:text-5xl font-serif text-parosa-dark mb-4">Terms of Service</h1>
          <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">
            Last Updated: December 29, 2025
          </p>
        </div>

        {/* CONTENT */}
        <div className="space-y-8 text-gray-700 text-sm md:text-base leading-relaxed font-sans">
          
          {/* SECTION 1 */}
          <section>
            <h2 className="text-xl font-serif text-parosa-dark mb-3">1. Overview</h2>
            <p>
              This website is operated by <strong>Dhayal Industries</strong> under the trademark <strong>Parosa</strong>. 
              Throughout the site, the terms “we”, “us”, and “our” refer to Dhayal Industries. 
              By visiting our site and/or purchasing something from us, you engage in our “Service” and agree to be bound by the following terms and conditions (“Terms of Service”, “Terms”).
            </p>
            <p className="mt-2">
              Please read these Terms of Service carefully before accessing or using our website. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any services.
            </p>
          </section>

          {/* SECTION 2 */}
          <section>
            <h2 className="text-xl font-serif text-parosa-dark mb-3">2. Eligibility</h2>
            <p>
              By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence (18 years in India). 
              You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws).
            </p>
          </section>

          {/* SECTION 3 */}
          <section>
            <h2 className="text-xl font-serif text-parosa-dark mb-3">3. Products and Services</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Nature of Goods:</strong> Our products (Spices, Flours, Oils) are agricultural produce. Slight variations in color, texture, and taste may occur due to seasonal changes. This is a characteristic of natural, non-chemically treated products and is not a defect.
              </li>
              <li>
                <strong>Accuracy:</strong> We have made every effort to display as accurately as possible the colors and images of our products. We cannot guarantee that your computer monitor's display of any color will be accurate.
              </li>
              <li>
                <strong>Availability:</strong> All products are subject to availability. We reserve the right to discontinue any product at any time.
              </li>
            </ul>
          </section>

          {/* SECTION 4 */}
          <section>
            <h2 className="text-xl font-serif text-parosa-dark mb-3">4. Accuracy of Billing and Account Information</h2>
            <p>
              We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household, or per order. 
              In the event that we make a change to or cancel an order, we may attempt to notify you by contacting the email and/or billing address/phone number provided at the time the order was made.
            </p>
            <p className="mt-2">
              You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store.
            </p>
          </section>

          {/* SECTION 5 */}
          <section>
            <h2 className="text-xl font-serif text-parosa-dark mb-3">5. Pricing and Modifications</h2>
            <p>
              Prices for our products are subject to change without notice. 
              We shall not be liable to you or to any third-party for any modification, price change, suspension, or discontinuance of the Service.
            </p>
          </section>

          {/* SECTION 6 */}
          <section>
            <h2 className="text-xl font-serif text-parosa-dark mb-3">6. Third-Party Links & Payment Gateways</h2>
            <p>
              We use third-party payment gateways (e.g., Razorpay, PhonePe) to process transactions. 
              We do not store your banking details. You agree to read and abide by the Terms of Service of such third-party providers. 
              We are not responsible for any harm or damages related to the purchase or use of goods, services, resources, content, or any other transactions made in connection with any third-party websites.
            </p>
          </section>

          {/* SECTION 7 */}
          <section>
            <h2 className="text-xl font-serif text-parosa-dark mb-3">7. User Comments and Feedback</h2>
            <p>
              If, at our request, you send certain specific submissions (for example contest entries) or without a request from us you send creative ideas, suggestions, proposals, plans, or other materials, whether online, by email, by postal mail, or otherwise (collectively, 'comments'), you agree that we may, at any time, without restriction, edit, copy, publish, distribute, translate and otherwise use in any medium any comments that you forward to us.
            </p>
          </section>

          {/* SECTION 8 */}
          <section>
            <h2 className="text-xl font-serif text-parosa-dark mb-3">8. Disclaimer of Warranties; Limitation of Liability</h2>
            <div className="bg-gray-50 p-4 border-l-4 border-parosa-accent">
              <p className="italic mb-2 font-bold text-gray-900">IMPORTANT:</p>
              <p>
                In no case shall <strong>Dhayal Industries</strong>, our directors, officers, employees, affiliates, agents, contractors, interns, suppliers, service providers or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind, arising from your use of any of the service or any products procured using the service.
              </p>
            </div>
            <p className="mt-4">
              Our liability is strictly limited to the monetary value of the product purchased.
            </p>
          </section>

          {/* SECTION 9 */}
          <section>
            <h2 className="text-xl font-serif text-parosa-dark mb-3">9. Indemnification</h2>
            <p>
              You agree to indemnify, defend and hold harmless Dhayal Industries and our parent, subsidiaries, affiliates, partners, officers, directors, agents, contractors, licensors, service providers, subcontractors, suppliers, interns and employees, harmless from any claim or demand, including reasonable attorneys’ fees, made by any third-party due to or arising out of your breach of these Terms of Service.
            </p>
          </section>

          {/* SECTION 10 */}
          <section>
            <h2 className="text-xl font-serif text-parosa-dark mb-3">10. Governing Law</h2>
            <p>
              These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of <strong>India</strong>. 
              Any disputes shall be subject to the exclusive jurisdiction of the courts located in <strong>Sri Vijaynagar, Rajasthan</strong>.
            </p>
          </section>

          {/* SECTION 11 */}
          <section className="border-t border-gray-200 pt-8 mt-8">
            <h2 className="text-xl font-serif text-parosa-dark mb-4">11. Contact Information</h2>
            <p className="mb-4">
              Questions about the Terms of Service should be sent to us at:
            </p>
            
            <address className="not-italic bg-gray-50 p-6 rounded-sm">
              <strong className="block text-lg mb-2 text-parosa-dark">Dhayal Industries</strong>
              <p className="mb-1">Sri Vijaynagar, Rajasthan - 335704</p>
              <p className="mb-1">Email: <a href="mailto:support@parosa.com" className="text-blue-600 underline">support@parosa.com</a></p>
            </address>
          </section>

        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
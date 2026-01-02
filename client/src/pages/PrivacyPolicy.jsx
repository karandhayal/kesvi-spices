import React, { useEffect } from 'react';

const PrivacyPolicy = () => {
  // Ensure page starts at the top when loaded
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-parosa-bg min-h-screen py-12 md:py-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-16 shadow-sm border border-gray-100">
        
        {/* HEADER */}
        <div className="text-center mb-12 border-b border-gray-100 pb-8">
          <h1 className="text-3xl md:text-5xl font-serif text-parosa-dark mb-4">Privacy Policy</h1>
          <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">
            Effective Date: December 26, 2025
          </p>
        </div>

        {/* CONTENT */}
        <div className="space-y-8 text-gray-700 text-sm md:text-base leading-relaxed font-sans">
          
          {/* SECTION 1 */}
          <section>
            <h2 className="text-xl font-serif text-parosa-dark mb-3">1. Introduction</h2>
            <p>
              Welcome to <strong>Parosa</strong>, a trademark brand owned and operated by <strong>Dhayal Industries</strong>. 
              We are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website 
              and purchase our products.
            </p>
            <p className="mt-2">
              By accessing our website and using our services, you consent to the data practices described in this policy.
            </p>
          </section>

          {/* SECTION 2 */}
          <section>
            <h2 className="text-xl font-serif text-parosa-dark mb-3">2. Information We Collect</h2>
            <p>We collect information that allows us to serve you better, process your orders, and communicate with you.</p>
            
            <h3 className="font-bold text-gray-900 mt-4 mb-2">A. Personal Information</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Full Name</strong></li>
              <li><strong>Phone Number</strong> (for order updates and delivery coordination)</li>
              <li><strong>Email Address</strong> (for invoices and promotional updates)</li>
              <li><strong>Shipping and Billing Address</strong> (including Pin Code)</li>
            </ul>

            <h3 className="font-bold text-gray-900 mt-4 mb-2">B. Payment Information</h3>
            <p>
              We <strong>do not</strong> store your credit/debit card numbers, CVV, or net banking passwords. 
              All payment transactions are processed through secure third-party payment gateways (e.g., PhonePe, Razorpay). 
              These processors adhere to the standards set by PCI-DSS.
            </p>

            <h3 className="font-bold text-gray-900 mt-4 mb-2">C. Technical Data</h3>
            <p>We automatically collect certain information when you visit our site, including IP Address, Browser Type, Device Type, and pages visited.</p>
          </section>

          {/* SECTION 3 */}
          <section>
            <h2 className="text-xl font-serif text-parosa-dark mb-3">3. How We Use Your Information</h2>
            
            <div className="mb-4">
              <h3 className="font-bold text-gray-900 mb-1">A. Order Fulfillment</h3>
              <p>To process and deliver your orders and communicate regarding shipment status.</p>
            </div>

            <div className="mb-4 bg-gray-50 p-4 border-l-4 border-parosa-accent">
              <h3 className="font-bold text-gray-900 mb-1">B. Marketing and Promotions (Important)</h3>
              <p className="italic mb-2">
                By providing your contact details, you agree that Dhayal Industries (Parosa) may use your Name, Email, and Phone Number to send you promotional materials.
              </p>
              <p>
                This includes newsletters, special offers, new product launches, festival discounts, and SMS/WhatsApp marketing alerts. 
                You may opt-out of these communications at any time.
              </p>
            </div>

            <div className="mb-4">
              <h3 className="font-bold text-gray-900 mb-1">C. Improvement of Services</h3>
              <p>To analyze website traffic and user behavior to improve our website layout and product offerings, and to prevent fraud.</p>
            </div>
          </section>

          {/* SECTION 4 */}
          <section>
            <h2 className="text-xl font-serif text-parosa-dark mb-3">4. Sharing of Information</h2>
            <p>
              We do not sell, trade, or rent your personal identification information to others. However, we may share data with trusted third parties for specific reasons:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li><strong>Logistics Partners:</strong> We share your Name, Address, and Phone Number with courier services (e.g., Shiprocket, Delhivery) strictly to ensure delivery.</li>
              <li><strong>Payment Processors:</strong> To facilitate secure payments.</li>
              <li><strong>Legal Compliance:</strong> If required by law or valid requests by public authorities.</li>
            </ul>
          </section>

          {/* SECTION 5 */}
          <section>
            <h2 className="text-xl font-serif text-parosa-dark mb-3">5. Cookies and Tracking</h2>
            <p>
              Our website uses "cookies" to enhance user experience (e.g., keeping you logged in). 
              You can choose to set your web browser to refuse cookies, but note that the Shopping Cart may not function properly without them.
            </p>
          </section>

          {/* SECTION 6 */}
          <section>
            <h2 className="text-xl font-serif text-parosa-dark mb-3">6. Data Security</h2>
            <p>
              We implement appropriate security measures to protect against unauthorized access or destruction of your data. 
              Our website uses SSL (Secure Socket Layer) encryption for data transmission.
            </p>
          </section>

          {/* SECTION 7 */}
          <section>
            <h2 className="text-xl font-serif text-parosa-dark mb-3">7. Your Rights & Opt-Out</h2>
            <p>
              You have the right to access and update your personal information. 
              If you no longer wish to receive marketing communications, you may follow the "Unsubscribe" link in our emails or contact us directly.
            </p>
          </section>

          {/* SECTION 8 */}
          <section>
            <h2 className="text-xl font-serif text-parosa-dark mb-3">8. Changes to This Policy</h2>
            <p>
              <strong>Dhayal Industries</strong> has the discretion to update this privacy policy at any time. 
              We encourage users to frequently check this page for any changes.
            </p>
          </section>

          {/* SECTION 9 */}
          <section className="border-t border-gray-200 pt-8 mt-8">
            <h2 className="text-xl font-serif text-parosa-dark mb-4">10. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            
            <address className="not-italic bg-gray-50 p-6 rounded-sm">
              <strong className="block text-lg mb-2 text-parosa-dark">Dhayal Industries (Parosa)</strong>
              <p className="mb-1">Sri Vijaynagar, Rajasthan</p>
              <p className="mb-1">Email: <a href="mailto:support@parosa.com" className="text-blue-600 underline">contact@parosa.co.in</a></p>
              <p>Phone: +91 9587708808</p>
            </address>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
import React, { useEffect } from 'react';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-parosa-bg min-h-screen py-12 md:py-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-16 shadow-sm border border-gray-100">
        
        <div className="text-center mb-12 border-b border-gray-100 pb-8">
          <h1 className="text-3xl md:text-5xl font-serif text-parosa-dark mb-4">Privacy Policy</h1>
          <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">Dhayal Industries</p>
        </div>

        <div className="space-y-8 text-gray-700 text-sm md:text-base leading-relaxed font-sans">
          
          <section>
            <h2 className="text-xl font-serif text-parosa-dark mb-3">1. Introduction</h2>
            <p>
              [cite_start]This Privacy Policy describes how Dhayal Industries and its affiliates (collectively "Dhayal Industries, we, our, us") collect, use, share, protect or otherwise process your information/ personal data through our website <strong>parosa.co.in</strong> (hereinafter referred to as Platform)[cite: 36].
            </p>
            <p className="mt-2">
              [cite_start]We do not offer any product/service under this Platform outside India and your personal data will primarily be stored and processed in India[cite: 38]. [cite_start]By visiting this Platform, providing your information or availing any product/service offered on the Platform, you expressly agree to be bound by the terms and conditions of this Privacy Policy, the Terms of Use and the applicable service/product terms and conditions, and agree to be governed by the laws of India[cite: 39].
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-parosa-dark mb-3">2. Collection of Information</h2>
            <p>
              [cite_start]We collect your personal data when you use our Platform, services or otherwise interact with us[cite: 41]. Some of the information that we may collect includes but is not limited to:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
               [cite_start]<li>Name, date of birth, address, telephone/mobile number, email ID[cite: 42].</li>
               [cite_start]<li>Information shared as proof of identity or address[cite: 42].</li>
               [cite_start]<li>Sensitive personal data (with consent) such as bank account, credit/debit card, or other payment instrument information[cite: 43].</li>
               [cite_start]<li>Buying behaviour and preferences[cite: 44].</li>
            </ul>
             <p className="mt-2">
               [cite_start]If you receive an email or call claiming to be from Dhayal Industries seeking sensitive personal data like PINs or passwords, please <strong>never</strong> provide such information and report it to law enforcement [cite: 49-50].
             </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-parosa-dark mb-3">3. Usage of Information</h2>
            [cite_start]<p>We use personal data to[cite: 51]:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              [cite_start]<li>Provide services you request[cite: 51].</li>
              [cite_start]<li>Assist sellers and business partners in handling and fulfilling orders[cite: 53].</li>
              [cite_start]<li>Enhance customer experience and resolve disputes [cite: 53-54].</li>
              [cite_start]<li>Inform you about offers, products, services, and updates[cite: 54].</li>
              [cite_start]<li>Detect and protect against fraud and criminal activity[cite: 55].</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-serif text-parosa-dark mb-3">4. Sharing of Information</h2>
            <p>
              [cite_start]We may share your personal data internally within our group entities and affiliates[cite: 58]. [cite_start]We may also disclose personal data to third parties such as logistics partners, payment processors, and business partners to facilitate your orders and services [cite: 60-61]. [cite_start]We may disclose personal data to government agencies if required by law[cite: 62].
            </p>
          </section>

          <section>
             <h2 className="text-xl font-serif text-parosa-dark mb-3">5. Security Precautions</h2>
             <p>
               [cite_start]To protect your personal data from unauthorised access or disclosure, loss or misuse we adopt reasonable security practices and procedures[cite: 66]. [cite_start]However, transmission of information over the internet is not completely secure and there are inherent risks [cite: 68-69]. [cite_start]Users are responsible for ensuring the protection of login and password records for their account[cite: 70].
             </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-parosa-dark mb-3">6. Data Deletion and Retention</h2>
            <p>
              [cite_start]You have an option to delete your account by visiting your profile and settings on our Platform[cite: 71]. [cite_start]We retain your personal data for a period no longer than is required for the purpose for which it was collected or as required under applicable law[cite: 75].
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-parosa-dark mb-3">7. Consent</h2>
            <p>
              [cite_start]By visiting our Platform or by providing your information, you consent to the collection, use, storage, disclosure and otherwise processing of your information on the Platform in accordance with this Privacy Policy[cite: 79].
            </p>
             <p className="mt-2">
              [cite_start]You, while providing your personal data, consent to us contacting you through SMS, instant messaging apps, call and/or e-mail for purposes specified in this policy[cite: 81]. [cite_start]You can withdraw your consent by writing to the Grievance Officer[cite: 82].
            </p>
          </section>

          <section className="border-t border-gray-200 pt-8 mt-8">
            <h2 className="text-xl font-serif text-parosa-dark mb-4">Grievance Officer & Contact</h2>
            <div className="bg-gray-50 p-6 rounded-sm">
              <p><strong>Dhayal Industries</strong></p>
              <p>Sri Vijaynagar, Rajasthan - 335704</p>
              [cite_start]<p className="mt-2"><strong>Phone / Support:</strong> Monday - Friday (9:00 - 18:00) [cite: 95]</p>
               <p>Email: <a href="mailto:support@parosa.co.in" className="text-blue-600 underline">support@parosa.co.in</a></p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
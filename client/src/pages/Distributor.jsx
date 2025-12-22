import React, { useState } from 'react';
import { Send, CheckCircle, ShieldCheck, Truck } from 'lucide-react';
import emailjs from '@emailjs/browser';

const Distributor = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    firm_name: '',
    gst_reg: '',
    contact: '',
    address: '',
    interest: 'Stone Ground Atta' // Default value set
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs.send(
      'service_q6unqjg', 
      'template_7tkw50l', 
      {
        from_name: formData.name,
        firm_name: formData.firm_name,
        gst_reg: formData.gst_reg,
        contact: formData.contact,
        address: formData.address,
        interest: formData.interest,
      }, 
      'VF6Ye4NRNbjxTK1a3'
    )
    .then(() => {
      setSubmitted(true);
      setLoading(false);
    })
    .catch((err) => {
      console.error("EmailJS Error:", err);
      alert("Submission failed. Please check your connection.");
      setLoading(false);
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-parosa-bg">
        <div className="max-w-md w-full bg-white p-10 text-center shadow-2xl border-t-4 border-parosa-dark">
          <CheckCircle size={60} className="text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-serif text-parosa-dark mb-4">Application Sent</h2>
          <p className="text-gray-600 mb-8 text-sm">Our B2B team will review the details for <strong>{formData.firm_name}</strong> and contact you shortly.</p>
          <button onClick={() => setSubmitted(false)} className="bg-parosa-dark text-white px-8 py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-parosa-accent transition-all">Back to Form</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-parosa-bg min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Info Column */}
          <div className="lg:col-span-4 space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif text-parosa-dark mb-6 leading-tight">Distributor <br/>Portal</h1>
              <p className="text-gray-600 text-sm leading-relaxed">
                Expand your business with Parosa's premium staples. Submit your business credentials to begin the partnership process.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4 p-4 bg-white border border-gray-100">
                <ShieldCheck className="text-parosa-accent shrink-0" />
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-parosa-dark">B2B Verified</h4>
                  <p className="text-[11px] text-gray-500">Secure partnership for GST registered entities.</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-white border border-gray-100">
                <Truck className="text-parosa-accent shrink-0" />
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-parosa-dark">Bulk Logistics</h4>
                  <p className="text-[11px] text-gray-500">Optimized shipping for 50kg bags and 15L tins.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-8 bg-white p-8 md:p-12 shadow-sm border border-gray-100">
            <h3 className="text-xl font-serif text-parosa-dark mb-8 border-b pb-4">Business Inquiry Form</h3>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Authorized Person Name</label>
                  <input required type="text" placeholder="e.g. Rajesh Kumar" 
                    className="border-b border-gray-200 py-2 outline-none focus:border-parosa-dark transition-all text-sm" 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Firm Name</label>
                  <input required type="text" placeholder="e.g. Parosa Retailers Pvt Ltd"
                    className="border-b border-gray-200 py-2 outline-none focus:border-parosa-dark transition-all text-sm"
                    onChange={(e) => setFormData({...formData, firm_name: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">GST Registration No.</label>
                  <input required type="text" placeholder="GST Number"
                    className="border-b border-gray-200 py-2 outline-none focus:border-parosa-dark transition-all text-sm uppercase"
                    onChange={(e) => setFormData({...formData, gst_reg: e.target.value})} />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Contact Number</label>
                  <input required type="tel" placeholder="+91 XXXXX XXXXX"
                    className="border-b border-gray-200 py-2 outline-none focus:border-parosa-dark transition-all text-sm"
                    onChange={(e) => setFormData({...formData, contact: e.target.value})} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Full Business Address</label>
                <textarea required rows="2" placeholder="Complete address including City and Pincode"
                  className="border-b border-gray-200 py-2 outline-none focus:border-parosa-dark transition-all text-sm resize-none"
                  onChange={(e) => setFormData({...formData, address: e.target.value})} />
              </div>

              <div className="flex flex-col gap-2 max-w-md">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Primary Product Interest</label>
                <select 
                  value={formData.interest}
                  className="border-b border-gray-200 py-2 bg-transparent outline-none focus:border-parosa-dark text-sm"
                  onChange={(e) => setFormData({...formData, interest: e.target.value})}
                >
                  <option value="Stone Ground Atta">Stone Ground Atta</option>
                  <option value="Premium Spices">Premium Spices</option>
                  <option value="Kachi Ghani Oil">Kachi Ghani Oil</option>
                  <option value="Bulk Graded Wheat">Bulk Graded Wheat</option>
                  <option value="Animal Feed">Animal Feed</option>
                </select>
              </div>

              <button 
                disabled={loading}
                type="submit" 
                className="w-full bg-parosa-dark text-white py-5 text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-parosa-accent transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-parosa-dark/10"
              >
                {loading ? "Registering..." : "Submit Partnership Request"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Distributor;
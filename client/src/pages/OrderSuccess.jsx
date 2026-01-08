import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Copy } from 'lucide-react';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  
  // Get params from URL (e.g., /order-success?id=123&ref=ABC)
  const orderId = searchParams.get("id");
  const refId = searchParams.get("ref"); // Capture Transaction ID if sent

  return (
    <div className="min-h-screen bg-parosa-bg flex items-center justify-center px-4">
      <div className="bg-white p-8 md:p-12 shadow-sm text-center max-w-md w-full border border-gray-100 rounded-sm">
        
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-50 p-4 rounded-full">
            <CheckCircle className="text-green-600 w-12 h-12" />
          </div>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-serif text-parosa-dark mb-4">Order Confirmed!</h1>
        <p className="text-gray-500 mb-8 text-sm leading-relaxed">
          Thank you for shopping with Parosa. Your authentic flavors are being packed with care.
        </p>
        
        {/* --- ORDER DETAILS BOX --- */}
        <div className="bg-gray-50 border border-gray-100 rounded-sm p-5 mb-8 text-left space-y-4">
          
          {/* Order ID */}
          {orderId ? (
            <div>
              <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-1">
                Order ID
              </span>
              <div className="flex items-center justify-between">
                <span className="font-mono text-parosa-dark font-medium text-sm break-all">
                  {orderId}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-red-400 italic">Order ID missing in URL</p>
          )}

          {/* Transaction Reference (Useful for UPI Manual) */}
          {refId && (
            <div className="pt-3 border-t border-gray-200">
               <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-1">
                Payment Ref
              </span>
              <span className="font-mono text-gray-600 font-medium text-sm">
                {refId}
              </span>
            </div>
          )}
        </div>

        <Link 
          to="/shop" 
          className="block w-full bg-parosa-dark text-white py-3.5 uppercase tracking-widest text-xs font-bold hover:bg-parosa-accent transition-colors shadow-lg active:scale-[0.98]"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
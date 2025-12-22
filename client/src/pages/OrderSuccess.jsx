import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("id");

  return (
    <div className="min-h-screen bg-kesvi-bg flex items-center justify-center px-4">
      <div className="bg-white p-10 shadow-lg text-center max-w-md w-full border border-gray-100">
        <div className="flex justify-center mb-6">
          <CheckCircle className="text-green-500 w-16 h-16" />
        </div>
        
        <h1 className="text-3xl font-serif text-parosa-dark mb-4">Order Confirmed!</h1>
        <p className="text-gray-500 mb-8">
          Thank you for shopping with Parosa. Your spices are being packed with care.
        </p>
        
        {orderId && (
          <div className="bg-gray-50 p-4 rounded mb-8 text-sm">
            <span className="text-gray-400 block mb-1">Order ID</span>
            <span className="font-mono text-parosa-dark">{orderId}</span>
          </div>
        )}

        <Link to="/shop" className="block w-full bg-parosa-dark text-white py-3 uppercase tracking-widest text-xs font-bold hover:bg-parosa-accent transition-colors">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
import React from 'react';

const About = () => {
  return (
    <div className="bg-white min-h-screen">
      
      {/* --- HERO SECTION --- */}
      <div className="relative bg-amber-900 py-24 px-6 sm:px-12 lg:px-24 text-center text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 tracking-wide">
            Rooted in Soil, Driven by Trust.
          </h1>
          <p className="text-lg md:text-xl text-amber-100 font-light leading-relaxed">
            The journey of a farmer who dared to dream of a healthier India.
            From the fields to the Kitchen.
          </p>
        </div>
      </div>

      {/* --- THE GENESIS (STORY) --- */}
      <section className="py-16 px-6 lg:px-24 bg-amber-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-sm font-bold text-amber-600 uppercase tracking-widest mb-2">The Beginning</h2>
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">
              A Farmer's Promise
            </h3>
            <p className="text-gray-700 leading-7 mb-4">
              The seed of <strong>Parosa</strong> was first planted in the mind of <strong>Mr. Vikas Dhayal</strong>, a simple farmer with a complex ambition: <em>to provide a range of food products that Indian families could blindly trust.</em>
            </p>
            <p className="text-gray-700 leading-7 mb-4">
              For a farmer, transitioning to business was no small feat. Mr. Dhayal spent years working in grain markets, surveying crops, and studying the best machineries globally. He didn't just want to manufacture; he wanted to revolutionize quality.
            </p>
            <p className="text-gray-700 leading-7">
              In <strong>2017</strong>, in the heart of <strong>Sri Ganganagar, Rajasthan</strong>, manufacturing finally began. It started with a single goal: strictly no compromise on quality, even if it meant lower margins.
            </p>
          </div>
          <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src="https://media.istockphoto.com/id/1130904205/photo/indian-rural-man-stock-images.jpg?s=612x612&w=0&k=20&c=FYY38IqukE0aJATU2SAW6iInNov0mcLNnCB8lfRmvmM=" 
              alt="Farmer in Wheat Field" 
              className="w-full h-full object-cover transform hover:scale-105 transition duration-700"
            />
          </div>
        </div>
      </section>

      {/* --- OUR CRAFT (PRODUCTS) --- */}
      <section className="py-16 px-6 lg:px-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
              The Science of Tradition
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              We blend age-old wisdom with modern innovation to keep nutrition intact.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Atta */}
            <div className="bg-amber-50 rounded-xl p-8 hover:shadow-xl transition duration-300 border-t-4 border-amber-600">
              <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mb-6 text-2xl">🌾</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Premium Atta</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                We select the finest <strong>1482 Wheat</strong> variety. Our unique "Slow Milling" technique ensures the flour doesn't heat up, preserving nutrients. We keep the bran content high to ensure you get that perfect, soft, traditional Roti.
              </p>
            </div>

            {/* Card 2: Mustard Oil */}
            <div className="bg-yellow-50 rounded-xl p-8 hover:shadow-xl transition duration-300 border-t-4 border-yellow-500">
              <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mb-6 text-2xl">💧</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Pure Mustard Oil</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Sri Ganganagar is the hub of mustard. We leveraged this to produce 100% unadulterated oil. In a market full of mixtures, we stood firm on purity, prioritizing health over profit margins.
              </p>
            </div>

            {/* Card 3: Spices */}
            <div className="bg-red-50 rounded-xl p-8 hover:shadow-xl transition duration-300 border-t-4 border-red-600">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-6 text-2xl">🌶️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Authentic Spices</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                We source directly from the best origins: <strong>Turmeric from Salem</strong>, <strong>Red Chilli from Jodhpur</strong>, and <strong>Coriander from Kota</strong>. Authentic aroma, vibrant color, and zero fillers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- MACHINERY & INFRASTRUCTURE --- */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-4xl font-serif font-bold">State-of-the-Art Infrastructure</h2>
              <p className="mt-4 text-gray-400">
                Small innovations in technique lead to big leaps in quality. Our facility is designed for hygiene, precision, and retaining natural nutrition.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative group h-64 overflow-hidden rounded-lg bg-gray-800">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop" 
                alt="Slow Milling Machinery" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black/80 to-transparent w-full">
                <span className="text-sm font-medium text-amber-400">Technology</span>
                <p className="text-white font-semibold">Slow Milling Units</p>
              </div>
            </div>

            <div className="relative group h-64 overflow-hidden rounded-lg bg-gray-800">
              <img 
                src="https://plus.unsplash.com/premium_photo-1661962489843-21c641d4c229?q=80&w=2070&auto=format&fit=crop" 
                alt="Packaging Unit" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black/80 to-transparent w-full">
                <span className="text-sm font-medium text-amber-400">Hygiene</span>
                <p className="text-white font-semibold">Automated Packaging</p>
              </div>
            </div>

            <div className="relative group h-64 overflow-hidden rounded-lg bg-gray-800 md:col-span-2 lg:col-span-1">
              <img 
                src="https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=2070&auto=format&fit=crop" 
                alt="Quality Testing" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black/80 to-transparent w-full">
                <span className="text-sm font-medium text-amber-400">Quality Control</span>
                <p className="text-white font-semibold">Lab Testing & Grading</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- LEADERSHIP --- */}
      <section className="py-20 px-6 lg:px-24 bg-amber-50">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-gray-900">Leadership</h2>
          <p className="text-gray-600 mt-2">The visionaries steering Parosa forward.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden">
              <img 
                src="/vikas.jpeg" 
                alt="Vikas Dhayal" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-gray-900">Mr. Vikas Dhayal</h3>
              <p className="text-amber-600 text-sm font-medium mb-2">Director & Founder</p>
              <a href="mailto:vikas@parosa.com" className="text-gray-500 hover:text-amber-600 text-sm flex items-center gap-2">
                ✉️ parosa1482@gmail.com
              </a>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden">
              <img 
                src="/sunil.jpg" 
                alt="Sunil Dhayal" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-gray-900">Mr. Sunil Dhayal</h3>
              <p className="text-amber-600 text-sm font-medium mb-2">Director</p>
              <a href="mailto:sunil@parosa.com" className="text-gray-500 hover:text-amber-600 text-sm flex items-center gap-2">
                ✉️ parosa1482@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* --- CURRENT STATUS --- */}
      <section className="py-16 px-6 text-center bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">A Household Name</h2>
          <p className="text-gray-600 leading-relaxed">
            Today, <strong>Parosa</strong> is a trusted household brand across theI ndia. 
            We are continuously expanding our product categories and our operational footprint, 
            bringing the purity of the farm to more tables every day.
          </p>
        </div>
      </section>

    </div>
  );
};

export default About;
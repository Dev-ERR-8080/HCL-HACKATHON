import React from 'react';

const OfferCard = ({ image, title, description, couponCode, onClaimOffer }) => (
    <div className="flex-shrink-0 w-72 md:w-80 bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover"
             onError={e => { e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80'; }} />
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-text mb-1">{title}</h3>
        <p className="text-sm text-slate-500 line-clamp-2 mb-3">{description}</p>
        {/* ✅ Show the actual coupon code so users can copy it */}
        {couponCode && (
            <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 border-dashed px-3 py-1 rounded-lg tracking-widest">
            {couponCode}
          </span>
              <button
                  onClick={() => { navigator.clipboard.writeText(couponCode); alert(`Coupon code "${couponCode}" copied!`); }}
                  className="text-xs text-slate-400 hover:text-blue-600 transition-colors"
                  title="Copy code"
              >
                📋
              </button>
            </div>
        )}
        <button
            onClick={() => onClaimOffer?.(couponCode)}
            className="text-primary font-semibold text-sm hover:underline"
        >
          Claim Offer →
        </button>
      </div>
    </div>
);

const Offers = ({ onViewAll }) => {
  const offerData = [
    {
      id: 1,
      title: "Welcome 20% Off",
      description: "First stay? Get 20% off up to ₹500 on any hotel booking.",
      couponCode: "WELCOME20",
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 2,
      title: "Weekend Getaway",
      description: "30% off on weekend bookings above ₹5000. Up to ₹1500 savings!",
      couponCode: "WEEKEND30",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 3,
      title: "Flat ₹500 Off",
      description: "₹500 instant discount on bookings above ₹2000. No questions asked.",
      couponCode: "FLAT500",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 4,
      title: "Luxury Escape",
      description: "15% off on premium stays above ₹10,000. Up to ₹2000 savings.",
      couponCode: "LUXURY15",
      image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 5,
      title: "Summer Sale",
      description: "25% off on all bookings this summer. Max discount ₹750.",
      couponCode: "SUMMER25",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4df85b?auto=format&fit=crop&w=400&q=80"
    }
  ];

  const handleClaimOffer = (couponCode) => {
    // Navigate to hotels page — user can apply the code at checkout
    if (onViewAll) onViewAll();
  };

  return (
      <div className="py-12 px-6 max-w-7xl mx-auto font-poppins">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-text">Best Offers</h2>
          {/* ✅ FIXED: View All now navigates to /hotels */}
          <button onClick={onViewAll} className="text-primary font-medium hover:underline">
            View All Hotels →
          </button>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide snap-x">
          {offerData.map(offer => (
              <div key={offer.id} className="snap-start">
                <OfferCard {...offer} onClaimOffer={handleClaimOffer} />
              </div>
          ))}
        </div>
      </div>
  );
};

export default Offers;
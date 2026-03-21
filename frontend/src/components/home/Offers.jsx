import React from 'react';

const OfferCard = ({ image, title, description }) => (
  <div className="flex-shrink-0 w-72 md:w-80 bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow">
    <div className="h-48 overflow-hidden">
      <img src={image} alt={title} className="w-full h-full object-cover" />
    </div>
    <div className="p-5">
      <h3 className="text-xl font-bold text-text mb-2">{title}</h3>
      <p className="text-sm text-slate-500 line-clamp-2">{description}</p>
      <button className="mt-4 text-primary font-semibold text-sm hover:underline">
        Claim Offer &rarr;
      </button>
    </div>
  </div>
);

const Offers = () => {
  const offerData = [
    {
      id: 1,
      title: "Flat 20% Off",
      description: "Book your first stay and get a flat 20% discount on top-rated hotels across India.",
      image: "/images/offers/luxury_room.png"
    },
    {
      id: 2,
      title: "Weekend Getaway",
      description: "Special prices for weekend bookings. Experience luxury at its best.",
      image: "/images/offers/resort_pool.png"
    },
    {
      id: 3,
      title: "Early Bird Deal",
      description: "Book 30 days in advance and save up to 30% on your total bill.",
      image: "/images/offers/hotel_lobby.png"
    },
    {
      id: 4,
      title: "Business Elite",
      description: "Exclusive benefits for business travelers including free late checkout.",
      image: "/images/offers/business_suite.png"
    },
    {
      id: 5,
      title: "Family Special",
      description: "Free meals for kids and complimentary extra bed for family rooms.",
      image: "/images/offers/family_suite.png"
    }
  ];

  return (
    <div className="py-12 px-6 max-w-7xl mx-auto font-poppins">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-text">Best Offers</h2>
        <button className="text-primary font-medium hover:underline">View All</button>
      </div>
      
      <div className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide snap-x">
        {offerData.map(offer => (
          <div key={offer.id} className="snap-start">
            <OfferCard {...offer} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Offers;

import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Filters from '../components/hotel/Filters';
import HotelCard from '../components/hotel/HotelCard';
import { searchHotels } from '../services/api';
import { useLocation } from 'react-router-dom';

const Hotels = () => {
  const locationObj = useLocation();
  const params = new URLSearchParams(locationObj.search);
  const initialSearch = params.get("location") || '';

  // ✅ Real data from backend
  const [allHotels, setAllHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // Filter/sort state (applied client-side after fetch)
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState([]);
  const [sortOption, setSortOption] = useState('popularity');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // ✅ Fetch from backend on mount (and when city changes via URL)
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setFetchError('');
      try {
        // Send city from URL param; other filters can be null (backend handles nulls)
        const result = await searchHotels({
          city: initialSearch || null,
          minPrice: null,
          maxPrice: null,
          rating: null,
          amenities: null,
        });
        // ✅ Normalise backend response to the shape HotelCard expects
        const normalised = (result?.hotels || result || []).map(h => ({
          id: h.hotelId,
          hotelId: h.hotelId,
          name: h.name,
          location: h.city,
          city: h.city,
          rating: h.rating ?? 0,
          price: h.minPrice ?? 0,          // backend doesn't always return price — add to HotelSearchResponse later
          description: h.description ?? '',
          amenities: h.amenities ?? [],
          image: h.imageUrl ?? 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
        }));
        setAllHotels(normalised);
      } catch (err) {
        setFetchError(err.message || 'Failed to load hotels');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [initialSearch]);

  const checkPriceRange = (price, ranges) => {
    if (ranges.length === 0) return true;
    return ranges.some(range => {
      const [min, max] = range.split('-').map(Number);
      return price >= min && price <= max;
    });
  };

  // Client-side filtering and sorting on top of fetched data
  const filteredHotels = useMemo(() => {
    let result = allHotels;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(h =>
          h.name.toLowerCase().includes(q) || h.location.toLowerCase().includes(q)
      );
    }
    if (selectedRatings.length > 0) {
      result = result.filter(h => selectedRatings.includes(Math.floor(h.rating)));
    }
    if (selectedPriceRange.length > 0) {
      result = result.filter(h => checkPriceRange(h.price, selectedPriceRange));
    }
    if (selectedAmenities.length > 0) {
      result = result.filter(h =>
          selectedAmenities.every(a => h.amenities.includes(a))
      );
    }
    if (sortOption === 'price_asc')   result = [...result].sort((a, b) => a.price - b.price);
    if (sortOption === 'price_desc')  result = [...result].sort((a, b) => b.price - a.price);
    if (sortOption === 'rating_desc') result = [...result].sort((a, b) => b.rating - a.rating);

    return result;
  }, [allHotels, searchQuery, selectedRatings, selectedPriceRange, selectedAmenities, sortOption]);

  return (
      <div className="min-h-screen flex flex-col bg-background font-poppins">
        <Navbar />

        <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
          {/* Header + Sort */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                {searchQuery ? `Showing properties in ${searchQuery}` : 'Explore Hotels'}
              </h1>
              <p className="text-slate-500 mt-1">
                {isLoading ? 'Loading...' : `${filteredHotels.length} ${filteredHotels.length === 1 ? 'property' : 'properties'} found`}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                  className="md:hidden bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-medium shadow-sm flex items-center gap-2 flex-1 justify-center"
                  onClick={() => setIsMobileFiltersOpen(true)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                Filters
              </button>
              <div className="relative flex-1 md:w-48">
                <select
                    value={sortOption}
                    onChange={e => setSortOption(e.target.value)}
                    className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
                >
                  <option value="popularity">Popularity</option>
                  <option value="price_asc">Price Low to High</option>
                  <option value="price_desc">Price High to Low</option>
                  <option value="rating_desc">Top Rated</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
            {/* Filters Sidebar */}
            <div className={`md:col-span-1 md:sticky md:top-24 z-40 md:z-auto ${isMobileFiltersOpen ? 'fixed inset-0 bg-white z-50 p-6 overflow-y-auto' : ''}`}>
              {isMobileFiltersOpen && (
                  <div className="flex justify-between items-center mb-6 md:hidden">
                    <h2 className="text-xl font-bold">Filters</h2>
                    <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 border rounded-full">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                  </div>
              )}
              <Filters
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedRatings={selectedRatings}
                  setSelectedRatings={setSelectedRatings}
                  selectedPriceRange={selectedPriceRange}
                  setSelectedPriceRange={setSelectedPriceRange}
                  selectedAmenities={selectedAmenities}
                  setSelectedAmenities={setSelectedAmenities}
                  isMobileOpen={isMobileFiltersOpen}
                  setIsMobileOpen={setIsMobileFiltersOpen}
              />
            </div>

            {/* Hotel Listings */}
            <div className="md:col-span-3 flex flex-col gap-6">
              {isLoading ? (
                  // ✅ Loading skeleton
                  [...Array(3)].map((_, i) => (
                      <div key={i} className="bg-white rounded-xl border border-slate-100 shadow-sm h-48 animate-pulse" />
                  ))
              ) : fetchError ? (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
                    <p className="text-red-500 font-medium mb-2">{fetchError}</p>
                    <p className="text-slate-400 text-sm">Make sure the hotel catalog service is running.</p>
                  </div>
              ) : filteredHotels.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center flex flex-col items-center justify-center">
                    <div className="bg-slate-50 p-4 rounded-full mb-4">
                      <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                      No hotels found{searchQuery ? ` in "${searchQuery}"` : ''}
                    </h3>
                    <p className="text-slate-500">Try adjusting your filters.</p>
                    <button
                        onClick={() => { setSearchQuery(''); setSelectedRatings([]); setSelectedPriceRange([]); setSelectedAmenities([]); }}
                        className="mt-6 font-semibold text-blue-600 hover:text-blue-800"
                    >
                      Clear all filters
                    </button>
                  </div>
              ) : (
                  filteredHotels.map(hotel => (
                      <HotelCard key={hotel.id} hotel={hotel} />
                  ))
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
  );
};

export default Hotels;
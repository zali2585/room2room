import { listings as staticListings } from '../data/listings';

export function getUserListings() {
  try { return JSON.parse(localStorage.getItem('r2r_user_listings') || '[]'); }
  catch { return []; }
}

export function getAllListings() {
  return [...getUserListings(), ...staticListings];
}

export function getListingById(id) {
  return getAllListings().find((l) => l.id === Number(id)) || null;
}

export function postListing({ title, category, price, condition, description, meetup, sellerEmail, sellerName, sellerInitials, sellerDorm }) {
  const existing = getUserListings();
  const newListing = {
    id: Date.now(),
    title,
    category,
    price: Number(price),
    condition,
    description,
    meetup,
    color: '#eff6ff',
    sellerEmail,
    seller: {
      name: sellerName,
      initials: sellerInitials,
      rating: 'New',
      sales: 0,
      dorm: sellerDorm || 'UCLA',
    },
    originalPrice: null,
    postedAt: new Date().toISOString(),
  };
  existing.unshift(newListing);
  localStorage.setItem('r2r_user_listings', JSON.stringify(existing));
  return newListing;
}

export function deleteUserListing(id) {
  const existing = getUserListings().filter((l) => l.id !== id);
  localStorage.setItem('r2r_user_listings', JSON.stringify(existing));
}

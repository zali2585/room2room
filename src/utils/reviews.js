const SEEDED_KEY = 'r2r_reviews_seeded';

const DEMO_REVIEWS = [
  { id: 1, subjectEmail: 'jane@g.ucla.edu', reviewerName: 'Alex B.', reviewerInitials: 'AB', rating: 5, comment: 'Super fast response and great condition! The mini fridge works perfectly. Would definitely buy from Jane again.', itemTitle: 'Mini Fridge 1.7cu ft', date: 'March 30' },
  { id: 2, subjectEmail: 'jane@g.ucla.edu', reviewerName: 'Maya C.', reviewerInitials: 'MC', rating: 5, comment: 'Desk chair was exactly as described. Very easy meetup at De Neve. Great seller!', itemTitle: 'Desk Chair', date: 'March 15' },
  { id: 3, subjectEmail: 'jane@g.ucla.edu', reviewerName: 'Jordan W.', reviewerInitials: 'JW', rating: 4, comment: 'Lamp was in good shape, quick pickup. Would buy from again.', itemTitle: 'IKEA Lamp', date: 'Feb 28' },
  { id: 4, subjectEmail: 'alex@g.ucla.edu', reviewerName: 'Jane B.', reviewerInitials: 'JB', rating: 5, comment: 'Alex was super communicative and showed up exactly on time. Highly recommend!', itemTitle: 'Mini Fridge 1.7cu ft', date: 'April 1' },
];

function seed() {
  if (localStorage.getItem(SEEDED_KEY)) return;
  localStorage.setItem('r2r_reviews', JSON.stringify(DEMO_REVIEWS));
  localStorage.setItem(SEEDED_KEY, '1');
}

function getAll() {
  seed();
  try { return JSON.parse(localStorage.getItem('r2r_reviews') || '[]'); }
  catch { return []; }
}

export function getReviewsFor(email) {
  return getAll().filter((r) => r.subjectEmail === email);
}

export function getAverageRating(email) {
  const reviews = getReviewsFor(email);
  if (!reviews.length) return null;
  return (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
}

export function addReview({ subjectEmail, reviewerName, reviewerInitials, rating, comment, itemTitle }) {
  const all = getAll();
  const review = {
    id: Date.now(),
    subjectEmail,
    reviewerName,
    reviewerInitials,
    rating,
    comment,
    itemTitle,
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
  };
  all.unshift(review);
  localStorage.setItem('r2r_reviews', JSON.stringify(all));
  return review;
}

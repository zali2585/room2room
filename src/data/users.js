const DEMO_USERS = [
  { email: 'jane@g.ucla.edu',  password: 'password123', firstName: 'Jane',   lastName: 'Bruin',  dorm: 'De Neve Hall', year: 'Class of 2026' },
  { email: 'alex@g.ucla.edu',  password: 'password123', firstName: 'Alex',   lastName: 'Bruin',  dorm: 'De Neve Hall', year: 'Class of 2026' },
  { email: 'maya@g.ucla.edu',  password: 'password123', firstName: 'Maya',   lastName: 'Chen',   dorm: 'Sproul Hall',  year: 'Class of 2025' },
  { email: 'sam@g.ucla.edu',   password: 'password123', firstName: 'Sam',    lastName: 'Kim',    dorm: 'Rieber Hall',  year: 'Class of 2027' },
  { email: 'jordan@g.ucla.edu',password: 'password123', firstName: 'Jordan', lastName: 'Wang',   dorm: 'Hedrick Hall', year: 'Class of 2026' },
  { email: 'riley@g.ucla.edu', password: 'password123', firstName: 'Riley',  lastName: 'Torres', dorm: 'Dykstra Hall', year: 'Class of 2028' },
];

export function getInitials(firstName, lastName) {
  return `${(firstName || '')[0] || ''}${(lastName || '')[0] || ''}`.toUpperCase();
}

export function getDisplayName(firstName, lastName) {
  return `${firstName} ${lastName}`;
}

export function getShortName(firstName, lastName) {
  return `${firstName} ${(lastName || '')[0]}.`;
}

function getRegistered() {
  try { return JSON.parse(localStorage.getItem('r2r_registered') || '[]'); }
  catch { return []; }
}

export function getAllUsers() {
  return [...DEMO_USERS, ...getRegistered()];
}

export function findUserByEmail(email) {
  return getAllUsers().find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export function authenticate(email, password) {
  const user = findUserByEmail(email);
  return user && user.password === password ? user : null;
}

export function registerUser(userData) {
  const existing = findUserByEmail(userData.email);
  if (existing) return { error: 'An account with this email already exists.' };
  const registered = getRegistered();
  registered.push(userData);
  localStorage.setItem('r2r_registered', JSON.stringify(registered));
  return { user: userData };
}

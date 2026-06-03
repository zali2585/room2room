import { findUserByEmail, getInitials, getShortName } from '../data/users';
import { getListingById } from '../data/listings';

function convKey(emailA, emailB, itemId) {
  return `r2r_conv_${[emailA, emailB].sort().join('||')}_${itemId}`;
}

function now() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function getMessages(emailA, emailB, itemId) {
  try { return JSON.parse(localStorage.getItem(convKey(emailA, emailB, itemId)) || '[]'); }
  catch { return []; }
}

export function sendMessage(fromEmail, toEmail, itemId, text) {
  const key = convKey(fromEmail, toEmail, itemId);
  const msgs = getMessages(fromEmail, toEmail, itemId);
  const msg = { id: Date.now(), from: fromEmail, text, time: now() };
  msgs.push(msg);
  localStorage.setItem(key, JSON.stringify(msgs));
  _updateIndex(fromEmail, toEmail, itemId, msg, false);
  _updateIndex(toEmail, fromEmail, itemId, msg, true);
  return msg;
}

function _updateIndex(ownerEmail, otherEmail, itemId, lastMsg, unread) {
  const key = `r2r_convindex_${ownerEmail}`;
  let list = [];
  try { list = JSON.parse(localStorage.getItem(key) || '[]'); } catch {}
  const idx = list.findIndex((c) => c.otherEmail === otherEmail && c.itemId === itemId);
  const otherUser = findUserByEmail(otherEmail);
  const listing = getListingById(itemId);
  const entry = {
    otherEmail,
    otherName: otherUser ? getShortName(otherUser.firstName, otherUser.lastName) : otherEmail,
    otherInitials: otherUser ? getInitials(otherUser.firstName, otherUser.lastName) : '??',
    itemId,
    itemTitle: listing?.title || 'Item',
    lastMessage: lastMsg.text,
    lastTime: lastMsg.time,
    unread,
  };
  if (idx >= 0) list[idx] = { ...list[idx], ...entry };
  else list.unshift(entry);
  localStorage.setItem(key, JSON.stringify(list));
}

export function getConversationList(email) {
  try { return JSON.parse(localStorage.getItem(`r2r_convindex_${email}`) || '[]'); }
  catch { return []; }
}

export function markRead(ownerEmail, otherEmail, itemId) {
  const key = `r2r_convindex_${ownerEmail}`;
  let list = [];
  try { list = JSON.parse(localStorage.getItem(key) || '[]'); } catch {}
  const idx = list.findIndex((c) => c.otherEmail === otherEmail && c.itemId === itemId);
  if (idx >= 0) { list[idx].unread = false; localStorage.setItem(key, JSON.stringify(list)); }
}

export function startConversation(fromEmail, toEmail, itemId) {
  const msgs = getMessages(fromEmail, toEmail, itemId);
  if (msgs.length === 0) {
    const listing = getListingById(itemId);
    sendMessage(fromEmail, toEmail, itemId, `Hi! I'm interested in your ${listing?.title || 'item'}. Is it still available?`);
  }
}

export function seedDemoConversations() {
  const key = convKey('jane@g.ucla.edu', 'alex@g.ucla.edu', 3);
  if (localStorage.getItem(key)) return;
  const seed = [
    { id: 1, from: 'jane@g.ucla.edu', text: 'Hi! Is the mini fridge still available?', time: '2:14 PM' },
    { id: 2, from: 'alex@g.ucla.edu', text: 'Yes it is! Are you interested?', time: '2:15 PM' },
    { id: 3, from: 'jane@g.ucla.edu', text: 'Definitely! Can I pick it up from De Neve lobby?', time: '2:16 PM' },
    { id: 4, from: 'alex@g.ucla.edu', text: 'Of course! How about Thursday at 3pm?', time: '2:17 PM' },
    { id: 5, from: 'jane@g.ucla.edu', text: 'That works perfectly for me! See you then 🙌', time: '2:20 PM' },
  ];
  localStorage.setItem(key, JSON.stringify(seed));
  const last = seed[seed.length - 1];
  _updateIndex('jane@g.ucla.edu', 'alex@g.ucla.edu', 3, last, false);
  _updateIndex('alex@g.ucla.edu', 'jane@g.ucla.edu', 3, last, true);
}

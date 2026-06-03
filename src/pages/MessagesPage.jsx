import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { getConversationList, getMessages, sendMessage, markRead, startConversation, seedDemoConversations } from '../utils/messages';
import styles from './MessagesPage.module.css';

export default function MessagesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const bottomRef = useRef(null);
  const [input, setInput] = useState('');
  const [tick, setTick] = useState(0);

  const refresh = () => setTick((t) => t + 1);

  useEffect(() => {
    if (!user) return;
    seedDemoConversations();

    if (location.state?.toEmail && location.state?.itemId) {
      startConversation(user.email, location.state.toEmail, location.state.itemId);
      refresh();
    }
  }, [user?.email]);

  const convList = user ? getConversationList(user.email) : [];

  const [selectedKey, setSelectedKey] = useState(null);
  const activeKey = selectedKey || (convList[0] ? `${convList[0].otherEmail}_${convList[0].itemId}` : null);
  const activeConv = convList.find((c) => `${c.otherEmail}_${String(c.itemId)}` === activeKey);

  const messages = activeConv
    ? getMessages(user.email, activeConv.otherEmail, activeConv.itemId)
    : [];

  useEffect(() => {
    const el = bottomRef.current;
    if (el) el.parentElement.scrollTop = el.parentElement.scrollHeight;
  }, [messages.length, activeKey]);

  const handleSelect = (conv) => {
    const key = `${conv.otherEmail}_${String(conv.itemId)}`;
    setSelectedKey(key);
    markRead(user.email, conv.otherEmail, conv.itemId);
    refresh();
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text || !activeConv) return;
    sendMessage(user.email, activeConv.otherEmail, activeConv.itemId, text);
    setInput('');
    refresh();
  };

  const unreadCount = convList.filter((c) => c.unread).length;

  if (!user) return null;

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.container}>
        <h1 className={styles.title}>
          Messages {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
        </h1>

        <div className={styles.chatLayout}>
          <div className={styles.convList}>
            {convList.length === 0 ? (
              <p className={styles.noConvs}>No conversations yet. Message a seller from a product page!</p>
            ) : convList.map((c) => {
              const key = `${c.otherEmail}_${String(c.itemId)}`;
              return (
                <div key={key} className={`${styles.convItem} ${activeKey === key ? styles.convActive : ''}`} onClick={() => handleSelect(c)}>
                  <div className={styles.convAvatar}>{c.otherInitials}</div>
                  <div className={styles.convInfo}>
                    <div className={styles.convTop}>
                      <span className={styles.convName}>{c.otherName}</span>
                      <span className={styles.convTime}>{c.lastTime}</span>
                    </div>
                    <p className={styles.convItem2}>{c.itemTitle}</p>
                    <p className={styles.convPreview}>{c.lastMessage}</p>
                  </div>
                  {c.unread && <div className={styles.unreadDot} />}
                </div>
              );
            })}
          </div>

          <div className={styles.chatPanel}>
            {!activeConv ? (
              <div className={styles.emptyChat}>
                <p>Select a conversation or message a seller to get started.</p>
              </div>
            ) : (
              <>
                <div className={styles.chatHeader}>
                  <div className={styles.chatAvatar}>{activeConv.otherInitials}</div>
                  <div className={styles.chatHeaderInfo}>
                    <div className={styles.chatName}>
                      {activeConv.otherName}
                      <span className={styles.chatVerified}> · Verified Bruin</span>
                    </div>
                    <p className={styles.chatDiscussing} onClick={() => navigate(`/product/${activeConv.itemId}`)}>
                      Discussing: {activeConv.itemTitle} →
                    </p>
                  </div>
                </div>

                <div className={styles.chatMessages}>
                  {messages.map((msg) => (
                    <div key={msg.id} className={`${styles.msgRow} ${msg.from === user.email ? styles.msgMe : styles.msgOther}`}>
                      {msg.from !== user.email && (
                        <div className={styles.msgAvatar}>{activeConv.otherInitials}</div>
                      )}
                      <div className={styles.msgBubble}>
                        <p className={styles.msgText}>{msg.text}</p>
                        <p className={styles.msgTime}>{msg.time}</p>
                      </div>
                    </div>
                  ))}

                  <div className={styles.buyPrompt}>
                    <span>🛒 Ready to buy?</span>
                    <button className={styles.buyNowBtn} onClick={() => navigate('/checkout')}>Buy Now →</button>
                  </div>
                  <div ref={bottomRef} />
                </div>

                <div className={styles.inputRow}>
                  <input
                    className={styles.msgInput}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message..."
                  />
                  <button className={styles.sendBtn} onClick={handleSend} disabled={!input.trim()}>
                    Send ↑
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

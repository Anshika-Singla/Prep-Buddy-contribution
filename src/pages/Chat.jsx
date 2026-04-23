import { useState, useEffect, useRef } from 'react';
import { sendChatMessage } from '../lib/api';

const Chat = ({ embedded = false }) => {
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const text = input.trim();
    setMessages((prev) => [...prev, { text, sender: 'user' }]);
    setInput('');
    setLoading(true);

    try {
      const data = await sendChatMessage(text);
      const botText = data.reply ?? data.response ?? data.data ?? 'Sorry, I got no response from the chatbot.';
      setMessages((prev) => [...prev, { text: botText, sender: 'bot' }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        { text: "Sorry, I couldn't process your message. Please try again.", sender: 'bot' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatInline = (line, keyPrefix) => {
    const elements = [];
    let lastIdx = 0;
    const boldRegex = /\*\*(.+?)\*\*/g;
    let match;

    while ((match = boldRegex.exec(line)) !== null) {
      if (match.index > lastIdx) {
        elements.push(line.substring(lastIdx, match.index));
      }
      elements.push(
        <strong key={`${keyPrefix}-b-${match.index}`} className="font-semibold">
          {match[1]}
        </strong>
      );
      lastIdx = match.index + match[0].length;
    }

    if (lastIdx < line.length) {
      elements.push(line.substring(lastIdx));
    }

    return elements.length > 0 ? elements : line;
  };

  const renderMessageText = (text) => {
    if (!text) return null;

    const lines = text.split(/\r?\n/);
    const nodes = [];
    let listItems = [];

    const flushList = () => {
      if (listItems.length > 0) {
        nodes.push(
          <ul key={`list-${nodes.length}`} className="list-disc list-inside ml-4">
            {listItems}
          </ul>
        );
        listItems = [];
      }
    };

    lines.forEach((line, i) => {
      const trimmed = line.trim();
      if (trimmed === '---') {
        flushList();
        nodes.push(<hr key={`hr-${i}`} className="border-t border-white/20 my-2" />);
      } else if (/^[*-]\s+/.test(trimmed)) {
        listItems.push(
          <li key={`li-${i}`} className="ml-1">
            {formatInline(trimmed.replace(/^[*-]\s+/, ''), `li-${i}`)}
          </li>
        );
      } else if (trimmed === '') {
        flushList();
        nodes.push(<div key={`br-${i}`} className="h-1" />);
      } else {
        flushList();
        nodes.push(
          <p key={`p-${i}`} className="m-0 leading-relaxed">
            {formatInline(line, `p-${i}`)}
          </p>
        );
      }
    });

    flushList();
    return nodes;
  };

  const chatContent = (
    <div className="flex flex-col h-full bg-slate-900/80 rounded-lg overflow-hidden">
      {!embedded && (
        <div className="px-6 py-4 border-b border-white/10">
          <h1 className="text-3xl font-bold text-white">Chatbot</h1>
        </div>
      )}

      <div className="flex-1 px-4 py-3 overflow-y-auto space-y-3" style={{ scrollbarWidth: 'thin' }}>
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <div
              className={`inline-block px-3 py-2 rounded-lg ${
                msg.sender === 'user'
                  ? 'glass-card bg-[#2f80ed]/80 text-white shadow-lg'
                  : 'glass-card bg-[#1e1e1e]/70 text-[#f2f2f2] shadow-md'
              }`}
              style={{ whiteSpace: 'pre-wrap', maxWidth: '85%', textAlign: 'left' }}
            >
              {renderMessageText(msg.text)}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-left mb-2">
            <span className="inline-block px-3 py-2 rounded-lg glass-card bg-[#1e1e1e]/70 text-[#f2f2f2] shadow-md">
              Thinking...
            </span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="flex items-center gap-2 px-4 py-3 border-t border-white/10 bg-slate-900/90">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !loading && sendMessage()}
          className="flex-1 px-3 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#4285f4] glass-input"
          placeholder="Type your message..."
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          className="bg-[#4285f4] text-white px-4 py-2 rounded-r-md hover:bg-[#3367d6]"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );

  if (embedded) {
    return chatContent;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="w-full max-w-4xl h-[90vh] flex flex-col border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {chatContent}
      </div>
    </div>
  );
};

export default Chat;

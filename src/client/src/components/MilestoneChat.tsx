import { useEffect, useRef, useState } from 'react';
import { useChatStore } from '../state/chatStore';
import { useUserStore } from '../state/userStore';

interface Props {
  channelId: string;
  channelType?: string;
  title?: string;
}

export default function MilestoneChat({ channelId, channelType = 'milestone', title }: Props) {
  const { messages, loadMessages, postMessage, subscribeToChannel } = useChatStore();
  const { user } = useUserStore();
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages(channelId);
    subscribeToChannel(channelId);
  }, [channelId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages[channelId]]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setSending(true);
    try {
      await postMessage(channelId, input.trim(), channelType);
      setInput('');
    } finally {
      setSending(false);
    }
  };

  const channelMessages = messages[channelId] ?? [];

  return (
    <div className="chat-window">
      <div className="chat-header">
        💬 {title ?? `Channel: ${channelId}`}
      </div>
      <div className="chat-messages">
        {channelMessages.length === 0 && (
          <p className="empty-msg">No messages yet. Be the first to say hi! 👋</p>
        )}
        {channelMessages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-msg ${msg.userId === user?.id ? 'own' : ''}`}
          >
            <div className="chat-avatar">{msg.username.charAt(0).toUpperCase()}</div>
            <div className="chat-bubble">
              <span className="chat-username">{msg.username}</span>
              <p>{msg.content}</p>
              <small>{new Date(msg.createdAt).toLocaleTimeString()}</small>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form className="chat-input-row" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Type a message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={sending}
        />
        <button type="submit" className="scout-btn" disabled={sending || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

import { create } from 'zustand';
import { chatApi } from '../apiClient/chatApi';
import type { ChatMessageDTO } from '../apiClient/chatApi';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

function getSocket(): Socket {
  if (!socket) {
    socket = io('http://localhost:3000', {
      auth: { token: localStorage.getItem('scout_token') },
    });
  }
  return socket;
}

interface ChatStore {
  messages: Record<string, ChatMessageDTO[]>;
  subscribedChannels: Set<string>;
  loadMessages: (channelId: string) => Promise<void>;
  postMessage: (channelId: string, content: string, channelType?: string) => Promise<void>;
  subscribeToChannel: (channelId: string) => void;
  unsubscribeAll: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: {},
  subscribedChannels: new Set(),

  loadMessages: async (channelId) => {
    try {
      const msgs = await chatApi.getMessages(channelId);
      set((s) => ({ messages: { ...s.messages, [channelId]: msgs } }));
    } catch {
      // non-fatal
    }
  },

  postMessage: async (channelId, content, channelType = 'route') => {
    const msg = await chatApi.postMessage(channelId, { content, channelType });
    set((s) => ({
      messages: {
        ...s.messages,
        [channelId]: [...(s.messages[channelId] ?? []), msg],
      },
    }));
  },

  subscribeToChannel: (channelId) => {
    if (get().subscribedChannels.has(channelId)) return;
    const sock = getSocket();
    sock.emit('join', channelId);
    sock.on(`message:${channelId}`, (msg: ChatMessageDTO) => {
      set((s) => {
        const existing = s.messages[channelId] ?? [];
        if (existing.some((m) => m.id === msg.id)) return s;
        return { messages: { ...s.messages, [channelId]: [...existing, msg] } };
      });
    });
    set((s) => {
      const next = new Set(s.subscribedChannels);
      next.add(channelId);
      return { subscribedChannels: next };
    });
  },

  unsubscribeAll: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
    set({ subscribedChannels: new Set() });
  },
}));

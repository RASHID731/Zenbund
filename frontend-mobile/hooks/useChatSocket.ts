import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import { apiClient, API_BASE_URL } from '@/lib/api';
import { Message, WsTypingEvent } from '@/types';

function getWsUrl(): string {
  // Replace http(s) with ws(s), strip /api suffix
  const base = API_BASE_URL.replace(/^http/, 'ws').replace(/\/api$/, '');
  return `${base}/ws`;
}

export function useChatSocket(
  chatId: number | string,
  onNewMessage: (msg: Message) => void,
  onEditMessage: (msg: Message) => void,
  onDeleteMessage: (messageId: number) => void,
  onTypingChange: (event: WsTypingEvent) => void
): {
  sendMessage: (text: string) => void;
  sendTyping: (isTyping: boolean) => void;
  connected: boolean;
} {
  const [connected, setConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const wsUrl = getWsUrl();

    const client = new Client({
      webSocketFactory: () => new WebSocket(wsUrl) as any,
      forceBinaryWSFrames: true,
      appendMissingNULLonIncoming: true,
      reconnectDelay: 5000,
      beforeConnect: async (c) => {
        const token = await apiClient.getToken();
        c.connectHeaders = { Authorization: `Bearer ${token}` };
      },
      onConnect: () => {
        setConnected(true);

        client.subscribe(`/topic/chat/${chatId}`, (frame) => {
          const event = JSON.parse(frame.body);
          if (event.type === 'NEW_MESSAGE' && event.message) {
            onNewMessage(event.message);
          } else if (event.type === 'EDIT_MESSAGE' && event.message) {
            onEditMessage(event.message);
          } else if (event.type === 'DELETE_MESSAGE' && event.messageId != null) {
            onDeleteMessage(event.messageId);
          }
        });

        client.subscribe(`/topic/chat/${chatId}/typing`, (frame) => {
          const event: WsTypingEvent = JSON.parse(frame.body);
          onTypingChange(event);
        });
      },
      onDisconnect: () => {
        setConnected(false);
      },
      onStompError: (frame) => {
        console.error('STOMP error', frame.headers['message'], frame.body);
        setConnected(false);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      client.deactivate();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  const sendMessage = (text: string) => {
    if (!clientRef.current?.connected) return;
    clientRef.current.publish({
      destination: `/app/chat/${chatId}/message`,
      body: JSON.stringify({ text }),
    });
  };

  const sendTyping = (isTyping: boolean) => {
    if (!clientRef.current?.connected) return;

    clientRef.current.publish({
      destination: `/app/chat/${chatId}/typing`,
      body: JSON.stringify({ isTyping }),
    });

    if (isTyping) {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        if (clientRef.current?.connected) {
          clientRef.current.publish({
            destination: `/app/chat/${chatId}/typing`,
            body: JSON.stringify({ isTyping: false }),
          });
        }
      }, 2000);
    }
  };

  return { sendMessage, sendTyping, connected };
}

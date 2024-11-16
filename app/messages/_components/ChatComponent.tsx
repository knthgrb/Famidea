"use client";
import { useState, useEffect, useRef } from "react";
import { Message } from "@/lib/types/chat";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/lib/store/user";
import { getInitials } from "@/utils/getUserInitials";
import { IoArrowBack } from "react-icons/io5";

interface ChatProps {
  conversationId: string;
  otherUser: {
    id: string;
    fullName: string;
  };
  handleBackToList: () => void;
}

const Chat = ({ conversationId, otherUser, handleBackToList }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const { user } = useUserStore();

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        block: "end",
        behavior: "smooth",
      });
    }
  };

  const fetchMessages = async () => {
    if (!conversationId) return;

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return;
    }
    setMessages(data);
    setLoading(false);

    // Mark messages as read
    if (data.length > 0) {
      await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("conversation_id", conversationId)
        .eq("receiver_id", user?.id)
        .eq("is_read", false);
    }

    setTimeout(scrollToBottom, 100);
  };

  useEffect(() => {
    fetchMessages();
  }, [conversationId, fetchMessages]);

  useEffect(() => {
    // Subscribe to new messages
    const subscription = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((current) => [...current, payload.new as Message]);
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [conversationId, supabase]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const message = {
      conversation_id: conversationId,
      sender_id: user.id,
      receiver_id: otherUser.id,
      message: newMessage.trim(),
      is_read: false,
    };

    const { error } = await supabase.from("messages").insert(message);

    if (error) {
      console.error("Error sending message:", error);
      return;
    }

    setNewMessage("");
    fetchMessages();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">Loading...</div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-4 border-b border-gray-200 gap-4">
        <button
          onClick={handleBackToList}
          className="lg:hidden flex items-center text-gray-600 hover:text-customAccentColor transition-colors"
        >
          <IoArrowBack size={20} className="mr-2" />
        </button>
        <div className="flex items-center justify-center bg-customAccentColor text-white rounded-full w-10 h-10 text-sm font-bold flex-shrink-0">
          {getInitials(otherUser?.fullName)}
        </div>
        <h2 className="font-semibold">{otherUser.fullName}</h2>
      </div>

      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 pb-0"
      >
        <div className="flex flex-col min-h-full justify-end">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex mb-4 ${
                message.sender_id === user?.id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.sender_id === user?.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                <p>{message.message}</p>
                <span className="text-xs opacity-75">
                  {new Date(message.created_at).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-lg"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="ml-2 bg-blue-500 text-white rounded-lg p-2"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;

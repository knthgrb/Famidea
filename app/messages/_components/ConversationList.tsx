"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/lib/store/user";
import { getInitials } from "@/utils/getUserInitials";

interface ConversationsListProps {
  selectedId?: string;
  onSelectConversation: (conversation: any) => void;
}

const ConversationsList = ({
  selectedId,
  onSelectConversation,
}: ConversationsListProps) => {
  const [conversations, setConversations] = useState<any[]>([]);
  const supabase = createClient();
  const { user } = useUserStore();

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;

      const { data: conversationsData, error } = await supabase
        .from("conversation_summaries")
        .select(
          `
          *,
          birth_centers (id, centerName),
          patients (id, fullName)
        `
        )
        .or(`birthcenter_id.eq.${user.id},patient_id.eq.${user.id}`)
        .order("last_message_at", { ascending: false });

      if (error) {
        console.error("Error fetching conversations:", error);
        return;
      }

      const conversationMap = new Map();

      conversationsData.forEach((conv) => {
        const otherUser =
          user.id === conv.birthcenter_id ? conv.patients : conv.birth_centers;
        const otherUserId = otherUser.id;

        const otherUserName =
          user.id === conv.birthcenter_id
            ? conv.patients?.fullName
            : conv.birth_centers?.centerName;

        if (
          !conversationMap.has(otherUserId) ||
          new Date(conv.last_message_at) >
            new Date(conversationMap.get(otherUserId).last_message_at)
        ) {
          conversationMap.set(otherUserId, {
            ...conv,
            other_user: { ...otherUser, fullName: otherUserName },
          });
        }
      });

      const deduplicatedConversations = Array.from(
        conversationMap.values()
      ).sort(
        (a, b) =>
          new Date(b.last_message_at).getTime() -
          new Date(a.last_message_at).getTime()
      );

      setConversations(deduplicatedConversations);

      // If a selectedId is provided, automatically select that conversation
      if (selectedId) {
        const selectedConversation = deduplicatedConversations.find(
          (conv) => conv.conversation_id === selectedId
        );
        if (selectedConversation) {
          onSelectConversation(selectedConversation);
        }
      }
    };

    fetchConversations();

    const subscription = supabase
      .channel("conversation_updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, supabase, selectedId]);

  return (
    <>
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          className={`px-5 py-3 flex items-center gap-4 hover:bg-gray-50 cursor-pointer transition-colors ${
            selectedId === conversation.conversation_id
              ? "bg-gray-200"
              : "bg-white"
          }`}
          onClick={() => onSelectConversation(conversation)}
        >
          <div className="flex items-center justify-center bg-customAccentColor text-white rounded-full w-10 h-10 text-sm font-bold flex-shrink-0">
            {getInitials(conversation.other_user?.fullName)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-md truncate">
                {conversation.other_user.fullName}
              </p>
              {user.id !== conversation.other_user.id &&
                conversation.unread_count > 0 && (
                  <span className="bg-customAccentColor text-white text-xs rounded-full px-2 py-0.5">
                    {conversation.unread_count}
                  </span>
                )}
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500 truncate">
                {conversation.last_message}
              </p>
              <span className="text-xs text-gray-500">
                {new Date(conversation.last_message_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ConversationsList;

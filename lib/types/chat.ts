export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export interface Conversation {
  id: string;
  birthcenter_id: string;
  patient_id: string;
  created_at: string;
}

export interface ConversationSummary extends Conversation {
  last_message: string;
  last_message_at: string;
  unread_count: number;
  other_user: {
    id: string;
    fullName: string;
  };
}

"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/utils/supabase/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showToast } from "@/utils/toastUtils";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/lib/store/user";

interface NewMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateConversation: (conversation: ConversationSummary) => void;
}

interface Recipient {
  id: string;
  displayName: string;
  phoneNumber: string;
}

interface Conversation {
  id: string;
  birthcenter_id: string;
  patient_id: string;
  created_at: string;
}

interface ConversationSummary extends Conversation {
  other_user: {
    id: string;
    displayName: string;
  };
  last_message: string;
  last_message_at: string;
  unread_count: number;
}

const NewMessageModal = ({
  isOpen,
  onClose,
  onCreateConversation,
}: NewMessageModalProps) => {
  const [message, setMessage] = useState<string>("");
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(
    null
  );
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();
  const { user, userRole } = useUserStore();

  useEffect(() => {
    const fetchRecipients = async () => {
      setLoading(true);

      let query;
      if (userRole === "birth_center") {
        // Fetch patients
        query = supabase
          .from("patients")
          .select("id, fullName, phoneNumber")
          .order("created_at", { ascending: false });
      } else {
        // Fetch birth centers
        query = supabase
          .from("birth_centers")
          .select("id, centerName, phoneNumber")
          .order("created_at", { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        showToast(error.message, "error");
        return;
      }

      // Transform the data to match the Recipient interface
      const transformedData: Recipient[] =
        data?.map((record: any) => ({
          id: record.id,
          displayName:
            "centerName" in record ? record.centerName : record.fullName,
          phoneNumber: record.phoneNumber,
        })) || [];

      setRecipients(transformedData);
      setLoading(false);
    };

    if (isOpen) {
      fetchRecipients();
    }
  }, [isOpen, supabase]);

  const handleSend = async () => {
    if (!selectedRecipient || !message.trim() || !user) {
      showToast("Please select a recipient and enter a message", "error");
      return;
    }

    try {
      // First check if a conversation already exists
      const { data: existingConversation } = await supabase
        .from("conversations")
        .select("*")
        .or(
          `and(birthcenter_id.eq.${
            userRole === "birth_center" ? user.id : selectedRecipient.id
          },patient_id.eq.${
            userRole === "patient" ? user.id : selectedRecipient.id
          })`
        )
        .single();

      let conversation;

      if (existingConversation) {
        // Use existing conversation
        conversation = existingConversation;
      } else {
        // Create new conversation if none exists
        const conversationData: Partial<Conversation> = {
          birthcenter_id:
            userRole === "birth_center" ? user.id : selectedRecipient.id,
          patient_id: userRole === "patient" ? user.id : selectedRecipient.id,
        };

        const { data: newConversation, error: conversationError } =
          await supabase
            .from("conversations")
            .insert(conversationData)
            .select()
            .single();

        if (conversationError) {
          showToast(conversationError.message, "error");
          return;
        }

        conversation = newConversation;

        // Create conversation participants only for new conversations
        const participantsData = [
          { conversation_id: conversation.id, user_id: user.id },
          { conversation_id: conversation.id, user_id: selectedRecipient.id },
        ];

        const { error: participantsError } = await supabase
          .from("conversation_participants")
          .insert(participantsData);

        if (participantsError) {
          showToast(participantsError.message, "error");
          return;
        }
      }

      // Create the message
      const { error: messageError } = await supabase.from("messages").insert({
        conversation_id: conversation.id,
        sender_id: user.id,
        receiver_id: selectedRecipient.id,
        message: message.trim(),
        is_read: false,
      });

      if (messageError) {
        showToast(messageError.message, "error");
        return;
      }

      // Create conversation summary object regardless of whether it's new or existing
      const conversationSummary: ConversationSummary = {
        id: conversation.id,
        birthcenter_id: conversation.birthcenter_id,
        patient_id: conversation.patient_id,
        created_at: conversation.created_at,
        other_user: {
          id: selectedRecipient.id,
          displayName: selectedRecipient.displayName,
        },
        last_message: message,
        last_message_at: new Date().toISOString(),
        unread_count: 1,
      };

      onCreateConversation(conversationSummary);
      handleDiscard();
    } catch (error: any) {
      showToast(error.message, "error");
    }
  };

  const handleDiscard = () => {
    setMessage("");
    setSelectedRecipient(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <ToastContainer />
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="recipient" className="text-sm font-medium">
              To:
            </label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {selectedRecipient
                    ? selectedRecipient.displayName
                    : "Select recipient..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--trigger-width] p-0" align="start">
                <Command className="w-full">
                  <CommandInput placeholder="Search recipients..." />
                  <CommandList>
                    <CommandEmpty>No recipient found.</CommandEmpty>
                    {recipients?.map((recipient) => (
                      <CommandItem
                        key={recipient.id}
                        onSelect={() => {
                          setSelectedRecipient(recipient);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedRecipient?.id === recipient.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {recipient.displayName}
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message:
            </label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="min-h-[150px]"
            />
          </div>
        </div>
        <DialogFooter>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDiscard}>
              Discard
            </Button>
            <Button
              onClick={handleSend}
              disabled={!selectedRecipient || !message.trim() || loading}
              className="bg-customAccentColor hover:bg-customAccentColor/80"
            >
              Send
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewMessageModal;

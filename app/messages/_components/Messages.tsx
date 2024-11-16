"use client";
import React, { useState } from "react";
import { BiMessageSquareAdd } from "react-icons/bi";
import { CiChat2 } from "react-icons/ci";
import NewMessageModal from "@/app/messages/_components/NewMessageModal";
import ConversationsList from "./ConversationList";
import Chat from "./ChatComponent";

export default function Messages() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedConversation, setSelectedConversation] = useState<any | null>(
    null
  );
  const [isMobileView, setIsMobileView] = useState<boolean>(true);

  const handleCreateConversation = (conversation: any) => {
    setSelectedConversation(conversation);
    setIsModalOpen(false);
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
  };

  return (
    <div className="flex h-[90vh] w-full overflow-hidden">
      {/* Conversation List - Hidden on mobile when chat is open */}
      <div
        className={`${
          selectedConversation && isMobileView ? "hidden" : "flex"
        } lg:flex flex-[35%] xl:flex-[25%] border-r border-gray-300 flex-col w-full`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-300">
          <h1 className="font-semibold text-gray-700">Messages</h1>
          <BiMessageSquareAdd
            size={22}
            className="cursor-pointer hover:text-customAccentColor transition-colors"
            onClick={() => setIsModalOpen(true)}
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          <ConversationsList
            selectedId={selectedConversation?.conversation_id}
            onSelectConversation={(conversation) => {
              setSelectedConversation(conversation);
            }}
          />
        </div>
      </div>

      {/* Chat Window */}
      <div
        className={`${
          !selectedConversation && isMobileView ? "hidden" : "flex"
        } lg:flex flex-[65%] xl:flex-[75%] flex-col w-full`}
      >
        {selectedConversation ? (
          <>
            <Chat
              conversationId={selectedConversation.conversation_id}
              otherUser={selectedConversation.other_user}
              handleBackToList={handleBackToList}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center flex flex-col items-center">
              <CiChat2 size={80} className="text-gray-400" />
              <p className="text-gray-500 text-sm mt-4">
                Send a message to start a chat.
              </p>
              <button
                className="bg-customAccentColor mt-4 text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                onClick={() => setIsModalOpen(true)}
              >
                Send message
              </button>
            </div>
          </div>
        )}
      </div>

      <NewMessageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateConversation={handleCreateConversation}
      />
    </div>
  );
}

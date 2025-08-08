import React, { useState } from "react";
import Card from "../../core/Card/Card";
import TextField from "../../core/TextField/TextField";
import Button from "../../core/Button/Button";
import "./AgentChat.css";

interface Message {
  id: string;
  text: string;
  sender: "user" | "agent";
  timestamp: Date;
}

interface AgentChatProps {
  onSendMessage: (message: string) => Promise<void>;
  messages: Message[];
  isLoading?: boolean;
}

const AgentChat: React.FC<AgentChatProps> = ({
  onSendMessage,
  messages,
  isLoading = false,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [inputError, setInputError] = useState<string>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) {
      setInputError("Please enter a message");
      return;
    }

    setInputError(undefined);
    await onSendMessage(newMessage.trim());
    setNewMessage("");
  };

  return (
    <div className="agent-chat">
      <Card variant="default" elevation="medium" className="chat-card">
        <div className="chat-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${
                message.sender === "user" ? "user-message" : "agent-message"
              }`}
            >
              <div className="message-content">
                <p className="message-text">{message.text}</p>
                <span className="message-time">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="agent-message">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      <form onSubmit={handleSubmit} className="chat-input">
        <TextField
          id="message-input"
          label=""
          value={newMessage}
          onChange={setNewMessage}
          placeholder="Type your message here..."
          helperText={inputError}
          multiline
        />
        <Button
          onClick={() => {}}
          type="submit"
          isLoading={isLoading}
          text="Send"
        />
      </form>
    </div>
  );
};

export default AgentChat;

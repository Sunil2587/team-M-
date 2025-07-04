import React, { useEffect, useState, useRef } from "react";
import PageContainer from "../components/PageContainer";
import BackgroundWrapper from "../components/BackgroundWrapper";
import { supabase } from "../supabaseClient";

// Replace with your actual logged-in user logic
const currentUserName = "Samba";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    // Optionally, subscribe to real-time updates
    const subscription = supabase
      .channel('public:chat')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat' }, fetchMessages)
      .subscribe();
    return () => { subscription.unsubscribe(); };
  }, []);

  async function fetchMessages() {
    const { data, error } = await supabase
      .from("chat")
      .select("*")
      .order("created_at", { ascending: true });
    if (!error) setMessages(data || []);
    // Scroll to bottom on new message
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    await supabase.from("chat").insert([{ user: currentUserName, message: input }]);
    setInput("");
    setLoading(false);
    fetchMessages();
  }

  // Emoji picker (simple)
  const emojis = ["😀", "😂", "😍", "🙏", "🎉", "👍", "🔥", "🥳", "😎", "❤️"];

  function handleEmojiClick(emoji) {
    setInput(input + emoji);
  }

  return (
    <BackgroundWrapper>
      <PageContainer title="CHAT" userName={currentUserName}>
        <div className="flex flex-col h-[400px] bg-white/30 rounded-xl shadow-inner mb-4 overflow-y-auto px-2 py-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-2 flex ${msg.user === currentUserName ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-3 py-2 rounded-lg max-w-[70%] ${
                  msg.user === currentUserName
                    ? "bg-yellow-400 text-white"
                    : "bg-white/80 text-yellow-900"
                }`}
              >
                <span className="block text-xs font-bold mb-1">{msg.user}</span>
                <span className="break-words">{msg.message}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSend} className="flex flex-col gap-2 px-2">
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 rounded-lg px-3 py-2 border border-yellow-400 bg-white/70 focus:outline-none text-black"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-4 rounded-lg transition"
            >
              Send
            </button>
          </div>
          <div className="flex gap-1 flex-wrap">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className="text-xl"
                onClick={() => handleEmojiClick(emoji)}
                tabIndex={-1}
              >
                {emoji}
              </button>
            ))}
          </div>
        </form>
      </PageContainer>
    </BackgroundWrapper>
  );
}
import React, { useState, useRef, useEffect } from 'react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  image_data?: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hi there! I am your AI assistant. How can I help you today? You can also upload an image if you need help with a product.' }
  ]);
  const [input, setInput] = useState("");
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, isTyping]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageBase64(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async () => {
    if (!input.trim() && !imageBase64) return;

    const newMsg: ChatMessage = { role: 'user', content: input, image_data: imageBase64 || undefined };
    setMessages(prev => [...prev, newMsg]);
    
    const currentInput = input;
    const currentImage = imageBase64;
    
    setInput("");
    setImageBase64(null);
    setIsTyping(true);
    
    try {
      // We'll call the bulk/simulate webhook to process this through the real orchestrator
      const res = await fetch('http://localhost:8000/simulate/webchat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: currentInput || "Uploaded an image",
          image_data: currentImage || undefined
        })
      });
      const data = await res.json();
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.reply || "I've received your message." 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Sorry, I couldn't connect to the server." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 z-50 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <span className="text-2xl">💬</span>
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 w-80 sm:w-96 bg-card border border-border shadow-2xl rounded-2xl flex flex-col z-50 transition-all origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`} style={{ height: '550px', maxHeight: 'calc(100vh - 48px)' }}>
        
        {/* Header */}
        <div className="bg-background/80 border-b border-border p-4 flex items-center justify-between rounded-t-2xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 text-primary">
              ⚡
            </div>
            <div>
              <h3 className="font-bold text-textPrimary text-sm">ChannelIQ AI</h3>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                <span className="text-[10px] text-textMuted font-medium">Online (Multimodal)</span>
              </div>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-textMuted hover:text-textPrimary transition-colors">
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-dark">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                m.role === 'user' 
                  ? 'bg-primary text-white rounded-tr-sm' 
                  : 'bg-background border border-border text-textPrimary rounded-tl-sm'
              }`}>
                {m.image_data && (
                  <img src={m.image_data} alt="Upload" className="max-w-full rounded-lg mb-2 border border-white/20" />
                )}
                {m.content && <div>{m.content}</div>}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-background border border-border p-3 rounded-2xl rounded-tl-sm text-textMuted flex gap-1 items-center">
                <div className="w-1.5 h-1.5 bg-textMuted rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-textMuted rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1.5 h-1.5 bg-textMuted rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Image Preview */}
        {imageBase64 && (
          <div className="px-4 py-2 bg-background border-t border-border flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <img src={imageBase64} alt="Preview" className="w-10 h-10 object-cover rounded border border-border" />
              <span className="text-[10px] text-textMuted">Image attached</span>
            </div>
            <button onClick={() => setImageBase64(null)} className="text-danger text-xs hover:underline">Remove</button>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-border bg-background/50 rounded-b-2xl shrink-0">
          <div className="flex gap-2">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-10 h-10 bg-card border border-border hover:border-primary text-textMuted rounded-lg flex items-center justify-center transition-colors"
              title="Upload Image"
            >
              📷
            </button>
            <input 
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything..."
              className="flex-1 bg-card border border-border rounded-lg px-3 py-2 text-sm text-textPrimary focus:outline-none focus:border-primary transition-colors"
            />
            <button 
              onClick={handleSend}
              disabled={isTyping || (!input.trim() && !imageBase64)}
              className="w-10 h-10 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white rounded-lg flex items-center justify-center transition-colors shadow-lg"
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

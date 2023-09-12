import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const chat = async (e, message) => {
    e.preventDefault();
  
    if (!message) return;
    setIsTyping(true);
    scrollTo(0, 1e10);
  
    let msgs = [...chats];
    msgs.push({ role: "user", content: message });
    setChats(msgs);
  
    setMessage("");
    try {
      const response = await fetch("http://localhost:8080/cp/hearmeout/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "1423",
          text: message,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const jsonResponse = await response.json();
      } else {
        const textResponse = await response.text();
        let resMsgs = [...msgs, { role: "AI", content: textResponse }];
        setChats(resMsgs);
        setIsTyping(false);
      }
  
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  return (
    <main>
      <h1>Chat Plusoft</h1>
      <section>
        {chats && chats.length
          ? chats.map((chat, index) => (
              <p key={index} className={chat.role === "user" ? "user_msg" : "ai_msg"}>
                <span>
                  <b>{chat.role.toUpperCase()}</b>
                </span>
                <span>:</span>
                <span>{chat.content}</span>
              </p>
            ))
          : ""}
        <div ref={messagesEndRef} />
      </section>

      <div className={isTyping ? "typing" : "hide"}>
        <p>
          <i>AI está digitando...</i>
        </p>
      </div>

      <form action="" onSubmit={(e) => chat(e, message)}>
        <input
          type="text"
          name="message"
          value={message}
          placeholder="Digite uma mensagem aqui..."
          onChange={(e) => setMessage(e.target.value)}
        />
      </form>
    </main>
  );
}

export default App;

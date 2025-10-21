import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "./axios";
import echo from "./echo";

interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  created_at: string;
  user: {
    id: number;
    fullName: string;
  };
}

const Chat = () => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [typingUsers, setTypingUsers] = useState<
    Record<string, { fullName: string; isTyping: boolean }>
  >({});
  const navigate = useNavigate();
  const isListenerSet = useRef(false);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hardcoded conversation ID
  const conversationId = "01956acf-3605-725b-90e8-b1c2fe5c2c60";

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/api/v1/messages/${conversationId}`);
        setMessages(response.data.messages || []);
        setError(null);
      } catch (error: any) {
        setError(error.response?.data?.message || "Failed to load messages");
        if (error.response?.status === 401) {
          localStorage.removeItem("auth_token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    if (!isListenerSet.current) {
      // Écouter les nouveaux messages
      echo
        .private(`chat.conversation.${conversationId}`)
        .listen("MessageSent", (data: { message: Message }) => {
          setMessages((prevMessages) => [...prevMessages, data.message]);
        });

      // Écouter les événements de saisie sur PresenceChannel
      echo.join(`typing.${conversationId}`).listen(
        "UserTyping",
        (data: {
          user: { id: string; fullName: string }; // `id` est une chaîne
          is_typing: boolean;
        }) => {
          const authUserId = localStorage.getItem("auth_user_id"); // Récupérer l'ID comme une chaîne

          // Ignorer les événements de saisie de l'utilisateur actuel
          if (data.user.id === authUserId) {
            return;
          }

          console.log("Received typing event:", data);
          setTypingUsers((prev) => ({
            ...prev,
            [data.user.fullName]: {
              fullName: data.user.fullName,
              isTyping: data.is_typing,
            },
          }));
        }
      );

      isListenerSet.current = true;
    }
    return () => {
      echo.leave(`chat.conversation.${conversationId}`);
      echo.leave(`typing.${conversationId}`);
      isListenerSet.current = false;
    };
  }, [navigate, conversationId]);

  const handleSendMessage = async (): Promise<void> => {
    if (message.trim() === "") return;

    try {
      await api.post(`/api/v1/messages/send/${conversationId}`, {
        content: message,
      });
      setMessage("");
    } catch (error: any) {
      console.error("Error sending message:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("auth_token");
        navigate("/login");
      }
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setMessage(event.target.value);

    // Notifier les autres utilisateurs que l'utilisateur actuel est en train d'écrire
    if (!isTyping) {
      setIsTyping(true);
      console.log("Sending typing event:", { is_typing: true });
      api.post(`/api/v1/messages/conversations/${conversationId}/typing`, {
        is_typing: true,
      });
    }

    // Effacer le timeout précédent
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    // Définir un timeout pour notifier que l'utilisateur a arrêté d'écrire
    typingTimeout.current = setTimeout(() => {
      setIsTyping(false);
      console.log("Sending typing event:", { is_typing: false });
      api.post(`/api/v1/messages/conversations/${conversationId}/typing`, {
        is_typing: false,
      });
    }, 1000); // Ajustez le délai si nécessaire
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await api.post("/api/v1/auth/logout");
      localStorage.removeItem("auth_token");
      navigate("/login");
    } catch (error) {
      localStorage.removeItem("auth_token");
      navigate("/");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Chat</h2>

      <div style={styles.chatBox}>
        {loading && <p>Chargement des messages...</p>}
        {error && <p style={styles.errorMessage}>{error}</p>}

        {messages.length === 0 && !loading && !error && (
          <p style={styles.emptyState}>
            Aucun message. Démarre la conversation !
          </p>
        )}

        {messages.map((msg) => (
          <div key={msg.id} style={styles.message}>
            <strong>{msg.user?.fullName || "Inconnu"}: </strong>
            {msg.content}
            <small style={styles.timestamp}>
              {new Date(msg.created_at).toLocaleTimeString()}
            </small>
          </div>
        ))}

        {/* Afficher les indicateurs de saisie */}
        {Object.keys(typingUsers).map((userFullName) => {
          const user = typingUsers[userFullName];
          if (user.isTyping) {
            return (
              <div key={userFullName} style={styles.typingIndicator}>
                {`${user.fullName} is typing...`}
              </div>
            );
          }
          return null;
        })}
      </div>

      <div style={styles.inputContainer}>
        <input
          type="text"
          value={message}
          onChange={handleInputChange}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Écris ton message..."
          style={styles.input}
          disabled={loading || !!error}
        />
        <button
          onClick={handleSendMessage}
          style={styles.sendButton}
          disabled={loading || !!error}
        >
          Envoyer
        </button>
      </div>

      <button onClick={handleLogout} style={styles.logoutButton}>
        Déconnexion
      </button>
    </div>
  );
};

// Styles
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: "100%",
    maxWidth: "800px",
    margin: "auto",
    padding: "20px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    borderRadius: "10px",
    background: "#fff",
  },
  chatBox: {
    height: "500px",
    overflowY: "auto",
    border: "1px solid #e1e1e1",
    borderRadius: "5px",
    padding: "15px",
    marginBottom: "20px",
  },
  message: {
    background: "#f8f9fa",
    padding: "10px 15px",
    margin: "5px 0",
    borderRadius: "15px",
    maxWidth: "70%",
    wordBreak: "break-word",
  },
  timestamp: {
    display: "block",
    fontSize: "0.75rem",
    color: "#6c757d",
    marginTop: "5px",
  },
  inputContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    flex: 1,
    padding: "10px 15px",
    borderRadius: "25px",
    border: "1px solid #ced4da",
    fontSize: "1rem",
    outline: "none",
  },
  sendButton: {
    padding: "10px 25px",
    borderRadius: "25px",
    border: "none",
    background: "#0084ff",
    color: "white",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "background 0.2s",
  },
  logoutButton: {
    padding: "8px 20px",
    borderRadius: "5px",
    border: "none",
    background: "#dc3545",
    color: "white",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  errorMessage: {
    color: "#dc3545",
    padding: "10px",
    backgroundColor: "#f8d7da",
    borderRadius: "5px",
    marginBottom: "10px",
  },
  emptyState: {
    textAlign: "center",
    color: "#6c757d",
    marginTop: "200px",
  },
  typingIndicator: {
    color: "red",
    fontStyle: "italic",
    margin: "5px 0",
    backgroundColor: "#ffe6e6",
    padding: "5px 10px",
    borderRadius: "5px",
  },
};

export default Chat;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { echo } from "./echo";

const App = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [svg, setSvg] = useState("");
  const [otpauthUrl, setOtpauthUrl] = useState("");
  const [otp, setOTP] = useState();
  const [messages, setMessages] = useState([]);
  const [messagesSend, setMessagesSend] = useState("");

  useEffect(() => {
    // Écouter un canal et un événement
    echo
      .channel("chat")
      .listen("NewMessage", (data) => {
        setMessages((prevMessages) => [...prevMessages, data.message]);
      })
      .error((error) => {
        console.error("Erreur de connexion WebSocket :", error);
      });

    // Nettoyer à la fin
    return () => {
      echo.leaveChannel("chat");
    };
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await getCsrfToken()
        .then(() => {
          return api.post("/api/login", {
            email,
            password,
          });
        })
        .then((response) => {
          console.log(response);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const logout = async () => {
    try {
      await api.post("/api/logout").then((response) => {
        console.log(response);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const getQRCode = async () => {
    try {
      await api.get("api/user/two-factor-qr-code").then((response) => {
        // Supposons que la réponse contient à la fois le SVG et l'URL OTPAuth
        setSvg(response.data.svg); // Stocker le SVG
        setOtpauthUrl(response.data.url); // Stocker l'URL OTPAuth
        console.log(response.data);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const activateTwoFactorAuthentication = async () => {
    try {
      await api.post("api/user/two-factor-authentication").then((response) => {
        console.log(response);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const desactivateTwoFactorAuthentication = async () => {
    try {
      await api
        .delete("api/user/two-factor-authentication")
        .then((response) => {
          console.log(response);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const sendOTPChallenge = async () => {
    try {
      await api.post("api/two-factor-challenge", {
        code: otp,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      await api.post("api/messages", {
        message: messagesSend,
      });
      setMessagesSend("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onClick={onSubmit}>
        <input
          type="email"
          name="email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          name="password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      <button onClick={logout}>Logout</button>
      <button onClick={activateTwoFactorAuthentication}>Activate 2FA</button>
      <button onClick={desactivateTwoFactorAuthentication}>
        Desactivate 2FA
      </button>
      <button onClick={getQRCode}>Get QR Code</button>

      {/* Afficher le SVG et l'URL OTPAuth */}
      {svg && (
        <div>
          <h3>QR Code:</h3>
          <div dangerouslySetInnerHTML={{ __html: svg }} />
        </div>
      )}
      {otpauthUrl && (
        <div>
          <h3>OTPAuth URL:</h3>
          <p>{otpauthUrl}</p>
        </div>
      )}
      <input
        type="number"
        name="otp"
        onChange={(e) => setOTP(e.target.value)}
      />
      <button onClick={sendOTPChallenge}>Submit OTP</button>
      <h1>Messages en temps réel</h1>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>

      <input
        type="text"
        value={messagesSend}
        onChange={(e) => setMessagesSend(e.target.value)}
      />
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
};

export const api = axios.create({
  baseURL: "http://macro.test",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
  withXSRFToken: true,
});

export const getCsrfToken = async () => {
  try {
    return await api.get("/sanctum/csrf-cookie");
  } catch (error) {
    throw error;
  }
};

export default App;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { getCsrfToken } from "./axios";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Fonction de connexion
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Réinitialise les erreurs

    try {
      // Obtenir le CSRF token avant la connexion
      await getCsrfToken();

      // Envoyer la requête de connexion
      const response = await api.post("/api/v1/login", {
        email,
        password,
      });

      console.log("Utilisateur connecté:", response.data);

      // Récupérer le token et le stocker dans localStorage
      const user_id = response.data.user.id; // Assure-toi que Laravel retourne bien `user`
      const token = response.data.access_token; // Assure-toi que Laravel retourne bien `token`
      if (token && user_id) {
        localStorage.setItem("auth_token", token);
        localStorage.setItem("auth_user_id", user_id);
      }

      // Redirection vers le chat après connexion réussie
      navigate("/chat");
    } catch (err) {
      setError("Email ou mot de passe incorrect");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Connexion</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Connexion en cours..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
};

export default Login;

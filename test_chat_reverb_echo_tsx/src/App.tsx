import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./login";
import Chat from "./chat";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Route par défaut (index) qui affiche Login */}
        <Route path="/" element={<Login />} />

        {/* Route /chat qui affiche Chat */}
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
};

export default App;

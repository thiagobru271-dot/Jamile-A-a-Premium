import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";

// ========== SEUS DADOS ATUAIS ==========
import { sizes, styles, fruits, complementos, doces } from './data';

// ========== CARDÁPIO CLIENTE ==========
function MenuCliente() {
  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>🍧 Açaí Premium</h1>
      <p style={{ textAlign: "center" }}>Monte seu açaí do jeito que você quer</p>
      
      <h3>Tamanhos</h3>
      {sizes?.map((s: any) => <div key={s.id}>{s.nome} - R$ {s.preco}</div>)}

      <h3>Frutas</h3>
      {fruits?.map((f: any) => <div key={f.id}>{f.nome}</div>)}
      
      <h3>Complementos</h3>
      {complementos?.map((c: any) => <div key={c.id}>{c.nome}</div>)}
    </div>
  );
}

// ========== LOGIN ADMIN ==========
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleLogin = () => {
    if (email === "admin@acai.com" && senha === "123456") {
      localStorage.setItem("adminAuth", "true");
      onLogin();
    } else {
      setErro("E-mail ou senha inválidos");
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: "100px auto", textAlign: "center" }}>
      <h2>Login Admin</h2>
      <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: 10, margin: "10px 0" }} />
      <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} style={{ width: "100%", padding: 10, margin: "10px 0" }} />
      <button onClick={handleLogin} style={{ width: "100%", padding: 10, background: "#6B21A8", color: "#fff", border: "none" }}>Entrar</button>
      {erro && <p style={{ color: "red" }}>{erro}</p>}
    </div>
  );
}

// ========== PAINEL ADMIN ==========
function AdminPanel() {
  const navigate = useNavigate();
  const sair = () => { localStorage.removeItem("adminAuth"); navigate("/admin"); };
  return (
    <div style={{ padding: 20 }}>
      <h2>Painel Admin</h2>
      <p>Aqui você gerencia o cardápio.</p>
      <button onClick={sair} style={{ padding: 10, background: "red", color: "#fff", border: "none" }}>Sair</button>
    </div>
  );
}

// ========== PROTEÇÃO DA ROTA ADMIN ==========
function PrivateRoute({ children }: { children: JSX.Element }) {
  const isAuth = localStorage.getItem("adminAuth") === "true";
  return isAuth ? children : <Navigate to="/admin" />;
}

// ========== APP PRINCIPAL ==========
export default function App() {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    setAuth(localStorage.getItem("adminAuth") === "true");
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* ROTA "/" DIRETO NO CARDÁPIO, SEM BOAS VINDAS */}
        <Route path="/" element={<MenuCliente />} />
        
        {/* ROTA "/admin" COM LOGIN */}
        <Route path="/admin" element={auth ? <Navigate to="/admin/painel" /> : <AdminLogin onLogin={() => setAuth(true)} />} />
        <Route path="/admin/painel" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
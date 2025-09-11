import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  // Локальное состояние для полей формы
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault(); // чтобы форма не перезагружала страницу
    setError(null); // сбрасываем ошибку перед новой попыткой

    try {
      // Вызываем метод Firebase Auth для входа по email/password
      await signInWithEmailAndPassword(auth, email, password);
      alert("Вход выполнен!");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(err);
      setError(err.message); // показываем сообщение ошибки
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition mt-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
        Вход
      </h2>
      <form className="space-y-4" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Войти
        </button>
      </form>
      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
    </div>
  );
}

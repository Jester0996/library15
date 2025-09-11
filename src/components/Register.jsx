import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// Компонент формы регистрации
export default function Register() {
  // Локальное состояние для хранения значений формы
  const [email, setEmail] = useState(""); // email пользователя
  const [password, setPassword] = useState(""); // пароль пользователя
  const [role, setRole] = useState("User"); // Роль по умолчанию - "User"
  const [error, setError] = useState(null); // для хранения ошибок

  // Обработчик события регистрации
  const handleRegister = async (e) => {
    e.preventDefault(); // отменяем стандартное поведение формы (перезагрузку страницы)
    setError(null); // очищаем ошибки перед новой попыткой

    try {
      // 1. Создаем пользователя в Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth, // объект авторизации Firebase
        email, // email, введённый пользователем
        password // пароль, введённый пользователем
      );
      const user = userCredential.user; // получаем созданного пользователя

      // 2. Сохраняем дополнительные данные о пользователе в Firestore
      // doc(db, "users", user.uid) — создаем документ с id = uid пользователя
      // setDoc(...) — записываем в этот документ email и роль
      await setDoc(doc(db, "users", user.uid), { email, role });

      // 3. После успешной регистрации очищаем поля формы
      setEmail("");
      setPassword("");
      setRole("User");

      // 4. Уведомляем о результате
      alert("Пользователь зарегистрирован!");
    } catch (err) {
      // Если произошла ошибка (например, email уже занят, слабый пароль и т.п.)
      console.error(err);
      setError(err.message); // сохраняем текст ошибки в состоянии, чтобы отобразить в интерфейсе
    }
  };

  // Разметка формы регистрации
  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition mt-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-green-600">
        Регистрация
      </h2>
      <form className="space-y-4" onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="User">Пользователь</option>
          <option value="Admin">Администратор</option>
        </select>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Зарегистрироваться
        </button>
      </form>
      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
    </div>
  );
}

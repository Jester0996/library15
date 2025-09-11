import { initializeApp } from "firebase/app"; //запуск клиента Firebase.
import { getAuth } from "firebase/auth"; //доступ к Firebase Auth (регистрация/логин).
import { getFirestore } from "firebase/firestore"; //доступ к базе Cloud Firestore.
import { getAnalytics } from "firebase/analytics"; //клиент Analytics (необязателен).

// Конфигурация проекта Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD1RPOt8c-TTmh5ZFN749GhH8VOlxlpHYg",
  authDomain: "library-61c07.firebaseapp.com",
  projectId: "library-61c07",
  storageBucket: "library-61c07.appspot.com",
  messagingSenderId: "224581553599",
  appId: "1:224581553599:web:cfd84a83452e79dd8be50a",
  measurementId: "G-8WP18K1VCC",
};

const app = initializeApp(firebaseConfig); //Создаём экземпляр приложения Firebase. Он нужен, чтобы «привязать» к себе Auth/Firestore/Analytics.

// Инициализация сервисов и экспорт для использования в проекте
export const auth = getAuth(app); // Для работы с аутентификацией в Login/Register
export const db = getFirestore(app); // Для работы с базой данных Firestore  в BooksList/AdminPanel
export const analytics = getAnalytics(app); // Для сбора аналитики (опционально). Собирает события, если включён и поддерживается окружением

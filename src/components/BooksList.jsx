import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

// Компонент, отображающий список книг
export default function BooksList({ userRole }) {
  // Состояние для хранения книг
  const [books, setBooks] = useState([]);
  // Состояние для отслеживания загрузки данных
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Асинхронная функция для загрузки книг
    const fetchBooks = async () => {
      try {
        // 1. Получаем ВСЕ книги из коллекции 'books'
        const booksSnap = await getDocs(collection(db, "books"));
        // Преобразуем снимок (snapshot) в массив объектов:
        // { id: уникальный id документа, ...остальные поля из базы }
        const allBooks = booksSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // 2. Фильтруем книги в зависимости от роли пользователя
        const filteredBooks = allBooks.filter((book) => {
          const access = book.access || []; // поле 'access' может отсутствовать → значит книга общедоступная

          // Если массив access пустой → книга публичная
          if (access.length === 0) return true;

          // Если пользователь авторизован (есть userRole),
          // то проверяем, входит ли его роль в массив access
          if (userRole) return access.includes(userRole);

          // Если пользователь гость (userRole = null),
          // то он НЕ увидит книги с ограничениями
          return false;
        });

        // Сохраняем отфильтрованные книги в state
        setBooks(filteredBooks);
      } catch (error) {
        // В случае ошибки (например, нет прав или проблемы с сетью)
        console.error("Ошибка при загрузке книг:", error);
      } finally {
        // В любом случае после запроса выключаем индикатор загрузки
        setLoading(false);
      }
    };

    fetchBooks();
  }, [userRole]);
  // Эффект сработает при первом рендере и каждый раз,
  // когда изменится роль пользователя (userRole)

  // Заглушка при загрузке
  if (loading)
    return (
      <p className="text-center text-gray-500 text-lg mt-6">Загрузка книг...</p>
    );

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Список книг</h2>

      {!userRole && (
        <p className="text-gray-500 mb-4">
          Войдите, чтобы видеть книги с ограниченным доступом.
        </p>
      )}

      {/* Сетка карточек книг */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition transform hover:-translate-y-1 p-5 flex flex-col justify-between"
          >
            <div>
              {/* Название книги */}
              <h3 className="text-xl font-semibold text-blue-600 mb-1">
                {book.title || "Без названия"}
              </h3>
              {/* Автор книги */}
              <p className="text-gray-700 mb-2">
                {book.author || "Автор неизвестен"}
              </p>
              {/* Описание книги */}
              <p className="text-gray-600">{book.description || ""}</p>
            </div>

            {/* Тег с ограничением доступа, если есть */}
            {book.access && book.access.length > 0 && (
              <span className="mt-3 inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                Только для: {book.access.join(", ")}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

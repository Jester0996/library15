import { useState, useEffect } from "react"; // Импорт React-хуков для состояния и эффектов
import { auth, db } from "../firebase"; // импорты для работы с Firebase
import { collection, addDoc, getDocs, doc, getDoc } from "firebase/firestore";

export default function AdminPanel() {
  const [title, setTitle] = useState(""); // Состояние для названия книги
  const [author, setAuthor] = useState(""); // Состояние для автора книги
  const [description, setDescription] = useState(""); // Состояние для описания книги
  const [roles, setRoles] = useState([]); // Выбранные роли для доступа к книге
  const [books, setBooks] = useState([]); // Список книг
  const [userRole, setUserRole] = useState(null); // Роль текущего пользователя
  const [loading, setLoading] = useState(true); // Флаг загрузки

  // Загружаем роль пользователя и список книг при монтировании
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const user = auth.currentUser; // Получаем текущего аутентифицированного пользователя
        if (!user) return; // Если пользователь не авторизован, выходим
        const userDoc = await getDoc(doc(db, "users", user.uid)); // Получаем документ пользователя из Firestore
        setUserRole(userDoc.data()?.role || null); // Устанавливаем роль пользователя (если роль не задана, ставим null)
      } catch (err) {
        console.error(err); // Логируем ошибки
      }
    };

    const fetchBooks = async () => {
      try {
        const booksSnap = await getDocs(collection(db, "books")); // Получаем все документы из коллекции books
        setBooks(booksSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))); // Преобразуем данные и сохраняем в состояние
      } catch (err) {
        console.error(err); // Логируем ошибки
      } finally {
        setLoading(false); // Убираем индикатор загрузки после завершения запроса
      }
    };

    fetchUserRole(); // Загружаем роль пользователя
    fetchBooks(); // Загружаем список книг
  }, []);

  // Добавление книги
  const addBook = async () => {
    if (userRole !== "Admin") {
      alert("Только Admin может добавлять книги!"); // Проверка на роль администратора
      return; // Если пользователь не админ, прекращаем выполнение
    }

    try {
      // Фильтруем роли, чтобы исключить пустые значения
      const validRoles = roles.filter((r) => r && r.trim() !== "");

      // Добавляем книгу в коллекцию 'books' в Firestore
      await addDoc(collection(db, "books"), {
        title,
        author,
        description,
        access: validRoles, // Массив ролей, которым доступна эта книга
      });

      // Очистка формы
      setTitle("");
      setAuthor("");
      setDescription("");
      setRoles([]);

      // Обновляем список книг после добавления новой
      const booksSnap = await getDocs(collection(db, "books"));
      setBooks(booksSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("Ошибка при добавлении книги:", err); // Логируем ошибку
      alert("Ошибка при добавлении книги.");
    }
  };

  const handleRoleChange = (role) => {
    setRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  if (userRole !== "Admin") return <p>Вы не имеете прав администратора.</p>;
  if (loading)
    return (
      <p className="text-center text-gray-500 text-lg mt-6">Загрузка...</p>
    );

  return (
    <div className="space-y-8">
      {/* Форма добавления книги */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Добавить книгу
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Название книги"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            placeholder="Автор"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            placeholder="Описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 md:col-span-2"
          />
        </div>

        {/* Выбор ролей */}
        <div className="flex space-x-6 mt-4">
          {["User", "Admin"].map((role) => (
            <label key={role} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={roles.includes(role)}
                onChange={() => handleRoleChange(role)}
                className="w-5 h-5"
              />
              <span className="text-gray-700 font-medium">{role}</span>
            </label>
          ))}
        </div>

        <button
          onClick={addBook}
          className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          Добавить книгу
        </button>
      </div>

      {/* Список книг */}
      <div>
        <h3 className="text-2xl font-bold mb-4 text-gray-800">Список книг</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((b) => (
            <div
              key={b.id}
              className="bg-white p-5 rounded-lg shadow-md hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <h4 className="text-xl font-semibold text-blue-600 mb-1">
                  {b.title || "Без названия"}
                </h4>
                <p className="text-gray-700 mb-2">
                  {b.author || "Автор неизвестен"}
                </p>
                <p className="text-gray-600">{b.description || ""}</p>
              </div>
              {b.access && b.access.length > 0 && (
                <span className="mt-3 inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                  Только для: {b.access.join(", ")}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

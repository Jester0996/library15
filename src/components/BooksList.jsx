// import { useState, useEffect } from "react";
// import { fetchBooks } from "../api/booksApi"; // работа с Firestore
// import { Roles } from "../constants/roles"; // enum ролей

// export default function BooksList({ userRole }) {
//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const loadBooks = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const allBooks = await fetchBooks(); // получаем все книги

//         const filteredBooks = allBooks.filter((book) => {
//           const access = book.access || [];

//           // Книги без ограничений видны всем
//           if (access.length === 0) return true;

//           // Админ видит все книги
//           if (userRole === Roles.Admin) return true;

//           // Пользователь видит книги по своей роли
//           if (userRole && access.includes(userRole)) return true;

//           // Гость не видит книги с ограничением
//           return false;
//         });

//         setBooks(filteredBooks);
//       } catch (err) {
//         console.error("Ошибка при загрузке книг:", err);
//         setError("Не удалось загрузить книги. Попробуйте позже.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadBooks();
//   }, [userRole]);

//   if (loading) {
//     return (
//       <p className="text-center text-gray-500 text-lg mt-6">Загрузка книг...</p>
//     );
//   }

//   if (error) {
//     return <p className="text-center text-red-500 text-lg mt-6">{error}</p>;
//   }

//   if (books.length === 0) {
//     return (
//       <p className="text-center text-gray-500 text-lg mt-6">Книг пока нет.</p>
//     );
//   }

//   return (
//     <div className="mt-6">
//       <h2 className="text-2xl font-bold mb-4 text-gray-800">Список книг</h2>

//       {!userRole && (
//         <p className="text-gray-500 mb-4">
//           Войдите, чтобы видеть книги с ограниченным доступом.
//         </p>
//       )}

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {books.map((book) => (
//           <div
//             key={book.id}
//             className="bg-white rounded-lg shadow-md hover:shadow-xl transition transform hover:-translate-y-1 p-5 flex flex-col justify-between"
//           >
//             <div>
//               <h3 className="text-xl font-semibold text-blue-600 mb-1">
//                 {book.title || "Без названия"}
//               </h3>
//               <p className="text-gray-700 mb-2">
//                 {book.author || "Автор неизвестен"}
//               </p>
//               <p className="text-gray-600">{book.description || ""}</p>
//             </div>

//             {book.access && book.access.length > 0 && (
//               <span className="mt-3 inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
//                 Только для: {book.access.join(", ")}
//               </span>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import { getFilteredBooks } from "../services/bookService";

export default function BooksList({ userRole }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const filtered = await getFilteredBooks(userRole);
        setBooks(filtered);
      } catch (err) {
        console.error(err);
        setError("Не удалось загрузить книги");
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [userRole]);

  if (loading) {
    return (
      <p className="text-center text-gray-500 text-lg mt-6">Загрузка книг...</p>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 text-lg mt-6">{error}</p>;
  }

  if (books.length === 0) {
    return (
      <p className="text-center text-gray-500 text-lg mt-6">Книг пока нет.</p>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Список книг</h2>

      {!userRole && (
        <p className="text-gray-500 mb-4">
          Войдите, чтобы видеть книги с ограниченным доступом.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition transform hover:-translate-y-1 p-5 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-semibold text-blue-600 mb-1">
                {book.title || "Без названия"}
              </h3>
              <p className="text-gray-700 mb-2">
                {book.author || "Автор неизвестен"}
              </p>
              <p className="text-gray-600">{book.description || ""}</p>
            </div>

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

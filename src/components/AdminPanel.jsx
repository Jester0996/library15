import { useState } from "react";
import { createBook } from "../services/bookService"; // бизнес-слой для книг
import { Roles } from "../constants/roles";

export default function AdminPanel() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRoleChange = (role) => {
    setRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleAddBook = async () => {
    if (roles.length === 0) {
      setError("Выберите хотя бы одну роль для доступа.");
      return;
    }

    try {
      await createBook({ title, author, description, roles });
      setTitle("");
      setAuthor("");
      setDescription("");
      setRoles([]);
      setError("");
      setSuccess("Книга успешно добавлена!");
    } catch (err) {
      console.error("Ошибка при добавлении книги:", err);
      setError("Не удалось добавить книгу.");
      setSuccess("");
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Добавить книгу</h2>

      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <input
          placeholder="Название книги"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          placeholder="Автор"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          placeholder="Описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="flex space-x-6 mt-2">
          {Object.values(Roles).map((role) => (
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
          onClick={handleAddBook}
          className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          Добавить книгу
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-500 mt-2">{success}</p>}
      </div>
    </div>
  );
}

// import { useState } from "react";
// import { addBook } from "../api/booksApi"; // импортируем API для добавления книги
// import { Roles } from "../constants/roles"; // импортируем роли

// export default function AdminPanel() {
//   const [title, setTitle] = useState("");
//   const [author, setAuthor] = useState("");
//   const [description, setDescription] = useState("");
//   const [roles, setRoles] = useState([]);
//   const [error, setError] = useState("");

//   const handleRoleChange = (role) => {
//     setRoles((prev) =>
//       prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
//     );
//   };

//   const handleAddBook = async () => {
//     if (roles.length === 0) {
//       setError("Выберите хотя бы одну роль для доступа.");
//       return;
//     }

//     try {
//       await addBook({ title, author, description, access: roles });
//       setTitle("");
//       setAuthor("");
//       setDescription("");
//       setRoles([]);
//       setError("");
//     } catch (err) {
//       console.error("Ошибка при добавлении книги:", err);
//       setError("Не удалось добавить книгу.");
//     }
//   };

//   return (
//     <div className="space-y-8">
//       <h2 className="text-2xl font-bold mb-4 text-gray-800">Добавить книгу</h2>

//       <div className="bg-white p-6 rounded-lg shadow-md">
//         <input
//           placeholder="Название книги"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//         <input
//           placeholder="Автор"
//           value={author}
//           onChange={(e) => setAuthor(e.target.value)}
//           className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />

//         <input
//           placeholder="Описание"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 md:col-span-2"
//         />

//         <div className="flex space-x-6 mt-4">
//           {Object.values(Roles).map((role) => (
//             <label key={role} className="flex items-center space-x-2">
//               <input
//                 type="checkbox"
//                 checked={roles.includes(role)}
//                 onChange={() => handleRoleChange(role)}
//                 className="w-5 h-5"
//               />
//               <span className="text-gray-700 font-medium">{role}</span>
//             </label>
//           ))}
//         </div>

//         <button
//           onClick={handleAddBook}
//           className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition font-semibold"
//         >
//           Добавить книгу
//         </button>
//         {error && <p className="text-red-500 mt-2">{error}</p>}
//       </div>
//     </div>
//   );
// }

// import * as booksApi from "../api/booksApi";
// import { Roles } from "../constants/roles";

// /**
//  * Получение книг с фильтром по роли пользователя
//  * @param {string|null} userRole - роль пользователя (Admin, User или null для гостя)
//  * @returns {Array} отфильтрованные книги
//  */
// export async function getFilteredBooks(userRole) {
//   const allBooks = await booksApi.fetchBooks();

//   return allBooks.filter((book) => {
//     const access = book.access || [];

//     // Общедоступные книги видны всем
//     if (access.length === 0) return true;

//     // Админ видит все
//     if (userRole === Roles.Admin) return true;

//     // Пользователь видит книги по своей роли
//     if (userRole && access.includes(userRole)) return true;

//     // Гость не видит книги с ограничением
//     return false;
//   });
// }

// /**
//  * Создание книги через бизнес-логику
//  * @param {object} book - объект { title, author, description, roles }
//  */
// export async function createBook({ title, author, description, roles }) {
//   const book = {
//     title: title || "Без названия",
//     author: author || "Автор неизвестен",
//     description: description || "",
//     access: roles || [],
//   };

//   await booksApi.addBook(book);
// }
import * as booksApi from "../api/booksApi";
import { Roles } from "../constants/roles";

/**
 * Получение книг с фильтром по роли пользователя
 * @param {string|null} userRole - роль пользователя (Admin, User или null для гостя)
 * @returns {Array} отфильтрованные книги
 */
export async function getFilteredBooks(userRole) {
  const allBooks = await booksApi.fetchBooks();

  return allBooks.filter((book) => {
    const access = book.access || [];

    // Книги без ограничений видны всем
    if (access.length === 0) return true;

    // Админ видит все книги
    if (userRole === Roles.Admin) return true;

    // Пользователь видит книги по своей роли
    if (userRole && access.includes(userRole)) return true;

    // Гость не видит ограниченные книги
    return false;
  });
}

/**
 * Создание книги через бизнес-логику
 * @param {object} book - объект { title, author, description, roles }
 */
export async function createBook({ title, author, description, roles }) {
  const book = {
    title: title || "Без названия",
    author: author || "Автор неизвестен",
    description: description || "",
    access: roles || [],
  };

  await booksApi.addBook(book);
}

// import * as booksApi from "../api/booksApi";

// export async function getBooks(userRole) {
//   const allBooks = await booksApi.fetchBooks();
//   return allBooks.filter((book) => {
//     if (book.access?.length === 0) return true;
//     if (userRole === "Admin") return true;
//     return userRole && book.access.includes(userRole);
//   });
// }

// export async function createBook({ title, author, description, roles }) {
//   const book = { title, author, description, access: roles };
//   await booksApi.addBook(book);
// }

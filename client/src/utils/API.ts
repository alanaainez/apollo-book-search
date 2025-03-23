import type { User } from '../models/User.js';
import type { Book } from '../models/Book.js';
import { gql } from '@apollo/client';

// route to get logged in user's info (needs the token)
export const getMe = (token: string) => {
  return fetch('/api/users/me', {
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
  });
};

export const createUser = (userData: User) => {
  return fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
};

export const loginUser = (userData: User) => {
  return fetch('/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
};

// save book data for a logged in user
export const SAVE_BOOK = gql`
  mutation SaveBook($book: BookInput!) {
    saveBook(book: $book) {
      _id
      username
      savedBooks {
        bookId
        title
        authors
        description
      }
    }
  }`;

// remove saved book data for a logged in user
export const deleteBook = (bookId: string, token: string) => {
  return fetch(`/api/users/books/${bookId}`, {
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};

// make a search to google books api
// https://www.googleapis.com/books/v1/volumes?q=harry+potter
export const searchGoogleBooks = (query: string) => {
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
};

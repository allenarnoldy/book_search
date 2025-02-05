import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
      token
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
      token
    }
  }
`;

export const REMOVE_BOOK = gql `
mutation RemoveBook($bookId: ID!) {
  removeBook(bookId: $bookId) {
    title
    image
    description
    bookId
    authors
  }
}
`;

export const SAVE_BOOK = gql `
mutation SaveBook($input: BookInput!) {
  saveBook(input: $input) {
    username
    email
    savedBooks {
      authors
      description
      title
      bookId
      image
      link
    }
    bookCount
    _id
  }
}`;



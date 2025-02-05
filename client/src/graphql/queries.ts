import { gql } from '@apollo/client';

export const GET_ME = gql`
  query Me {
  me {
    bookCount
    email
    savedBooks {
      link
      title
      image
      description
      bookId
      authors
    }
    _id
    username
  }
}
`;

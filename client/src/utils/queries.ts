import { gql } from '@apollo/client';

// GET_ME query
export const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
      savedBooks {
        bookId
        title
        authors
        description
        image
        link
        }
    }
}`;
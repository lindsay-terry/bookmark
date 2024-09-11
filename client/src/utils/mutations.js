import { gql } from '@apollo/client';

// create new user
export const CREATE_USER = gql`
    mutation createUser($username: String!, $email: String!, $password: String!) {
        createUser(username: $username, email: $email, password: $password) {
            token
            user {
                _id
                username
                email
            }
        }     
    }
`;

// Log in
export const LOGIN_USER = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
        token
        user {
            _id
            username
        }
    }
}  
  
`;

// Save book
export const SAVE_BOOK = gql`
    mutation saveBook($book: BookInput!) {
        saveBook(book: $book) {
            _id
            username
            savedBooks {
                title
                authors
                bookId
                image
                link
                description
            }
        }
    }
`;

// Delete book
export const DELETE_BOOK = gql`
    mutation deleteBook($bookId: ID!) {
        deleteBook(bookId: $bookId) {
            _id
            username
            savedBooks {
                _id
                title
                authors
                description
                image
                link
                bookId
            }
        }
    }
`
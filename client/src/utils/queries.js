import { gql } from '@apollo/client';

// Query to get user info
export const GET_ME = gql`
    query GetMe {
        me {
            _id
            username
            savedBooks {
                _id
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

export const SEARCH_BOOKS = gql`
    query searchBooks($query: String!) {
        searchBooks(query: $query) {
            authors
            bookId
            image
            link
            title
            description
        }   
    }  
`
import { gql } from '@apollo/client';

// Query to get user info
export const GET_ME = gql`
    query GetMe {
        me {
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
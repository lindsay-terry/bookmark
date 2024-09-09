const typeDefs = `
    type User {
        _id: ID!
        username: String!
        email: String!
        password: String!
        savedBooks: [Book]!
    }

    type Book {
        _id: ID!
        authors: [String]
        bookId: String!
        image: String
        link: String
        title: String!
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        getSingleUser(_id: ID, username: String): User
    }

    type Mutation {
        createUser(username: String!, email: String!, password: String!): Auth
        login(email: String!, password: String!): Auth
        saveBook(title: String!, _id: ID!): User
        deleteBook(_id: ID!): User
    }
`;

module.exports = typeDefs;
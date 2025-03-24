const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    password: String!
    savedPlaylists: [Playlist]
  }

  type Playlist {
    id: ID!
    url: String!
    title: String
    sharedBy: User
    createdAt: String
  }

  type ResponseMessage {
    message: String!
  }

  type AuthPayload {
    token: String!
    message: String
  }

  type Query {
    _: String
    getUserPlaylists: [Playlist]
    getPlaylistById(id: ID!): Playlist
  }

  type Mutation {
    registerUser(username: String!, password: String!): ResponseMessage
    loginUser(username: String!, password: String!): AuthPayload
    savePlaylistToUser(url: String!, title: String): Playlist
    unsavePlaylistFromUser(id: ID!): ResponseMessage # ✅ Add this
  }

`;

module.exports = typeDefs;

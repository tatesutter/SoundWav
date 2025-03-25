const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    password: String!
    savedPlaylists: [Playlist]
    followers: [User]
    following: [User]
    publicProfile: Boolean
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

    # ✅ New
    getUserProfile(username: String!): User
    getCurrentUser: User
    searchUsers(username: String!): [User]
  }

  type Mutation {
    registerUser(username: String!, password: String!): ResponseMessage
    loginUser(username: String!, password: String!): AuthPayload
    savePlaylistToUser(url: String!, title: String): Playlist
    unsavePlaylistFromUser(id: ID!): ResponseMessage

    # ✅ Updated to use usernames
    followUser(targetUsername: String!): User
    unfollowUser(targetUsername: String!): User
  }
`;

module.exports = typeDefs;

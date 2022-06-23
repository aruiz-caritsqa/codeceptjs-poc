const { GraphQLClient, gql } = require('graphql-request');
/**
 * Returns filtered data from graphql
 * @param {String} endpoint
 * @param {String} graphqlQuery
 * @example
  const createReferenceDataList = async () => {
  const endpoint = 'https://n7b67.sse.codesandbox.io/graphql';
  const query = { 
    query: { 
      movies { 
        name, 
        genre 
      } 
    }`;
 * const filteredData = await queryGraphqlData(endpoint, request);
 * @throws {Error} If the passed input is not valid
 * @returns {Object} Object with returned data
 */
const queryGraphqlData = async (endpoint, request) => {
  const client = new GraphQLClient(endpoint);
  const query = gql`${request}`;
  const data = await client.request(JSON.stringify(query));
  return data;
};

module.exports = {
  queryGraphqlData,
};

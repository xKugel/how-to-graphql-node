const { GraphQLServer } = require('graphql-yoga')

let links = [{
  id: 'link-0',
  url: 'www.howtographql.com',
  description: 'Fullstack tutorial for GraphQL'
}]

let currentId = links.length

const newLink = args => ({id: `link-${currentId++}`, description: args.description, url: args.url})

const resolvers = {
  Query: {
    info: () => `Just relax`,
    feed: () => links
  },

  Mutation: {
    post: (parent, args) => {
      const link = newLink(args)
      links.push(link)
      return link
    },
    updateLink: (parent, args) => {
      let updatedLink = {}
      links = links.reduce((acc, cur) => {
        if (args.id === cur.id){
          cur.description = args.description !== null ? args.description : cur.description
          cur.url = args.url !== null ? args.url : cur.url
          updatedLink = cur
        }
        acc.push(cur)
        return acc
      }, [])
      return updatedLink
    },
    deleteLink: (parent, args) => {
      let removedLink = links.filter(e => args.query.id === e.id);
      links = links.filter(e => args.query.id !== e.id)
      return removedLink.length > 0 ? removedLink[0] : {}
    }
  },

  Link: {
    id: (parent) => parent.id,
    description: (parent) => parent.description,
    url: (parent) => parent.url,
  }
}
const server = new GraphQLServer({  typeDefs: './src/schema.graphql', resolvers })

server.start(() => console.log(`Server is running on http://localhost:4000`))

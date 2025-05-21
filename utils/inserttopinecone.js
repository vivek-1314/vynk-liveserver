const { pineconeIndex } = require('../lib/pinecone');

const upsertThought = async (userId, thought, embeddingVector , socketid) => {
  const id = `thought-${userId}-${Date.now()}`; 

  const response = await pineconeIndex.upsert([
      {
        id : id, 
        values: embeddingVector,               
        metadata: {                            
          userId,
          thought,
          socketid,
          timestamp: Date.now()
        }
      }]);

  console.log('Upsert Response:', response);
  return id ;
};

module.exports = { upsertThought };
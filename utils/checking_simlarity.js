const {pineconeIndex} = require('../lib/pinecone'); 

const querySimilarThoughts = async (newThoughtVector) => {
  const threshold = 0.85;

  const result = await pineconeIndex.query({
    vector: newThoughtVector,
    topK: 1, 
    includeMetadata: true,
  });

  const topMatch = result.matches?.[0];

  if (topMatch && topMatch.score > threshold) {
    return topMatch;
  }

  return null; 
};

module.exports = { querySimilarThoughts };

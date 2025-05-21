const { Server } = require("socket.io");
const { create1to1Channel } = require('../utils/channel'); 
const { pineconeIndex } = require('../lib/pinecone');
const {upsertThought} = require("../utils/inserttopinecone")
const {querySimilarThoughts} = require("../utils/checking_simlarity")


function initPoolServer(io) {
  const socketThoughtMap = new Map();

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_pool", async (thought) => {
      socket.emit("user_connected");
      const SIMILARITY_THRESHOLD = 0.75;
      const fullThought = {values: thought.embedding , metadata: {
        userId: thought.userId,
        thought: thought.thought,
        socketId: socket.id,
      }}
   
      let bestScore = -1;

      const bestMatch = await querySimilarThoughts(fullThought.values) ;
      
      if (bestMatch) {

        const deleteResponse = await pineconeIndex.deleteOne(bestMatch.id);

              io.to(bestMatch.metadata.socketid).emit("match_found", {
                yourThought: bestMatch,
                matchedWith: fullThought,
              }); 

              io.to(socket.id).emit("match_found", {
                yourThought: fullThought,
                matchedWith: bestMatch,
              });
      } else {
        user_pincode_thought_id = await upsertThought(
          fullThought.metadata.userId,
          fullThought.metadata.thought,
          fullThought.values,
          socket.id
        );
        socketThoughtMap.set(socket.id, user_pincode_thought_id);
        socket.emit("waiting_for_match") ;
      }
    });

    socket.on("disconnect", async () => {
      const thoughtId = socketThoughtMap.get(socket.id);
      if(thoughtId !== undefined){
        const deleteResponse1 = await pineconeIndex.deleteOne(thoughtId);
        socketThoughtMap.delete(socket.id);
      }
    });

    socket.on("refresh" , async () => {
      const thoughtId = socketThoughtMap.get(socket.id);
      if(thoughtId !== undefined){
        const deleteResponse1 = await pineconeIndex.deleteOne(thoughtId);
        socketThoughtMap.delete(socket.id);
      }
    })
  });
}

module.exports = { initPoolServer };

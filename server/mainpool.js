const { Server } = require("socket.io");
const { create1to1Channel } = require('../utils/channel'); 

const thoughtPool = new Map();

function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
}
  
function initPoolServer(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_pool", (thought) => {
      socket.emit("user_connected");
      const SIMILARITY_THRESHOLD = 0.55;
      const fullThought = { ...thought, socketId: socket.id };

      let bestMatch = null;   
      let bestScore = -1;

      for (const other of thoughtPool.values()) {
        if (other.userId !== fullThought.userId) {
          const score = cosineSimilarity(fullThought.embedding, other.embedding);
          if (score > bestScore && score >= SIMILARITY_THRESHOLD) {
            bestScore = score;
            bestMatch = other;
          }
        }
      }

      if (bestMatch) {
       
        thoughtPool.delete(bestMatch.socketId);
        thoughtPool.delete(socket.id);

              io.to(bestMatch.socketId).emit("match_found", {
                yourThought: bestMatch,
                matchedWith: fullThought,
              });

              io.to(socket.id).emit("match_found", {
                yourThought: fullThought,
                matchedWith: bestMatch,
              });
      } else {
        thoughtPool.set(socket.id, fullThought);
        socket.emit("waiting_for_match");
      }
    });

    socket.on("disconnect", () => {
      const removed = thoughtPool.get(socket.id);
      if (removed) {
        thoughtPool.delete(socket.id);
        userMatches.delete(removed.userId);
      }
      console.log("User disconnected:", socket.id);
    });

    socket.on("refresh" , () => {
      const removed = thoughtPool.get(socket.id);
      if (removed) {
        thoughtPool.delete(socket.id);
      }
    })

  });
}

module.exports = { initPoolServer, thoughtPool };

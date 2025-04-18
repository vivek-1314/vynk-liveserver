const StreamChat = require('stream-chat').StreamChat;
require('dotenv').config();

const serverClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY,
  process.env.STREAM_API_SECRET
);

const create1to1Channel = async (userAId, userBId) => {
    console.log("hy inside func") ;
  const channel = serverClient.channel('messaging', `1to1-${userAId}-${userBId}`, {
    members: [userAId, userBId],
  });
  console.log("inside 2func") ;
  await channel.create();
  console.log(channel.id) ;
  return channel.id;
};

module.exports = { create1to1Channel };

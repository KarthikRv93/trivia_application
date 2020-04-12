// dbPassword = "mongodb://nrkarthi:Admin!23@ds257507.mlab.com:57507/trivia";

// module.exports = {
//   mongoURI: dbPassword,
// };

const config = {
  DEV: {
    mongodbUrl: "mongodb://localhost:27017/trivia",
    mongodbUser: "app",
    mongodbPass: "general",
    port: "3000",
  },
  PROD: {
    mongodbUrl: "mongodb://nrkarthi:Admin!23@ds257507.mlab.com:57507/trivia",
    mongodbUser: "app",
    mongodbPass: "general",
    port: "3000",
  },
};

const env ="PROD";
module.exports = config[env];

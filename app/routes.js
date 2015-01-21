var User = require('./models/UserRest');

module.exports = function(app, _, io, participants, passport, chats, announcements, videoChats) {
  var user_controller = require('./controllers/user')(_, io, participants, passport, refreshAllUsers);
  var people_controller = require('./controllers/people')(_, io, participants, passport);
  var wall_controller	=	require('./controllers/wall')(_, io, passport);
  var chat_controller = require('./controllers/chat')(_,io,passport, chats);
  var perf_controller	=	require('./controllers/performance')(_, io, participants);
  var search_controller =   require('./controllers/search')(_, io);
  var call_controller = require('./controllers/call')(_, io, passport, participants, videoChats);

  app.get("/", user_controller.getLogin);

  app.post("/signup", user_controller.postSignup);

  app.get("/welcome", isLoggedIn, user_controller.getWelcome);
  app.get("/map", user_controller.getMap);

  app.get("/user", isLoggedIn, user_controller.getUser);
  app.get('/signup', user_controller.getSignup);
  app.get("/logout", user_controller.getLogout);
  app.post("/login", passport.authenticate('local-login', {
    successRedirect : '/people',
    failureRedirect : '/',
    failureFlash: true
  }));
  
  app.post("/postWall", isLoggedIn, wall_controller.postWallMessage);  

  app.post("/postChat", isLoggedIn, chat_controller.postChat);
  app.get("/people", isLoggedIn, people_controller.getPeople);
  app.get("/wall", isLoggedIn, wall_controller.getWall);
  app.post("/startChats", isLoggedIn, chat_controller.startChats);
  app.get("/chat", isLoggedIn, chat_controller.getChatUpdates);
  app.post("/myStatus", isLoggedIn, user_controller.myStatus);
//  Performance Testing and Analysis
  app.post("/sysperf", isLoggedIn, perf_controller.getSystemPerformace);
  app.get("/performance", isLoggedIn, perf_controller.checkPerformance);
  app.post("/snAnalyze", isLoggedIn, perf_controller.analyzeNetwork);
// Search
  app.post("/lookup", isLoggedIn, search_controller.getSearchResult);
  app.get("/search", isLoggedIn, search_controller.getSearch);
// Memory
  app.get("/memory", isLoggedIn, perf_controller.getMemoryPage);
  app.post("/startMemory", isLoggedIn, perf_controller.startMemory);
  app.post("/getMemoryTime", isLoggedIn, perf_controller.getMemoryTime);
  app.get("/getMemory", isLoggedIn, perf_controller.getMemory);
  app.post("/stopMemory", isLoggedIn, perf_controller.stopMemory);
  app.delete("/deleteMemory", isLoggedIn, perf_controller.deleteMemory);
// Update User Profile
  app.post("/update", isLoggedIn, user_controller.updateProfile);
  app.post("/postAnnouncement", isLoggedIn, wall_controller.postAnnouncementMessage);
// Make a call
  app.get("/help", isLoggedIn, call_controller.getHelp);
  app.get("/call", isLoggedIn, call_controller.getCall);
  app.post("/postCall", isLoggedIn, call_controller.postCall);
  app.get("/callList/*", isLoggedIn, call_controller.getCallList);
};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}

function refreshAllUsers(participants, callback) {
  participants.all = [];
  User.getAllUsers(function(err, users) {
    users.forEach(function(user) {
      participants.all.push({'userName' : user.local.name,'status' : user.local.status, 'flag' : user.local.flag,'profession': user.local.profession,'role' : user.local.role,'accountStatus' : user.local.accountStatus});
    });
    callback();
  });
}

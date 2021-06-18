Things
[x] Two separate app?
  - https://blog.logrocket.com/multiple-entry-points-in-create-react-app-without-ejecting/
[x] Client side routing -- different app for client, based on hostname
  - thinking I'll do two deployment, or a subdomain or something?
  - two <Router> components, just do a ternary on window.hostname
[x] Passport auth
  - can we get a req.user from passport?
- Socket + auth
  - integrate with passport
    - https://github.com/socketio/socket.io/tree/master/examples/passport-example
    - benefit here is cookie/session management
    - or... is it easier to do our own auth with sessionio-auth or whatever



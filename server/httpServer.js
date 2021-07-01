const http = require('http');
const express = require('express');

const app = express();
module.exports = {
    http: http.createServer(app),
    express: app,
};

const Twitter = require('twitter');

module.exports = (app, io) => {
    let twitter = new Twitter({
        consumer_key: 'AQEt0IumjxLuCThVqOplE6yrL',
        consumer_secret: 'TcYCaRAdK62oiEvU2tYvBs0K888f7nCI1u7SfvL6KMcoRtdEwb',
        access_token_key:'1448676760170557443-QvC5a59aTAKifYljOP3zdDc8S6UGs6',
        access_token_secret: 'QLlah7sZcGtUmYDMLKlw3AjzfO8CyKSelixlbBcr0ivyE'
    });

    let socketConnection;
    let twitterStream;

    app.locals.searchTerm = 'trending'; //Default search term for twitter stream.
    app.locals.showRetweets = false; //Default

    /**
     * Resumes twitter stream.
     */
    const stream = () => {
        console.log('Resuming for ' + app.locals.searchTerm);
        twitter.stream('statuses/filter', { track: app.locals.searchTerm }, (stream) => {
            stream.on('data', (tweet) => {
                sendMessage(tweet);
            });

            stream.on('error', (error) => {
                // console.log(error);
            });

            twitterStream = stream;
        });
    }

    /**
     * Sets search term for twitter stream.
     */
    app.post('/setSearchTerm', (req, res) => {
        // console.log(req.body)
        let term = req.body.term;
        app.locals.searchTerm = term;
        twitterStream.destroy();
        stream();
    });

    //Establishes socket connection.
    io.on("connection", socket => {
        socketConnection = socket;
        stream();
        socket.on("connection", () => console.log("Client connected"));
        socket.on("disconnect", () => console.log("Client disconnected"));
    });

    /**
     * Emits data from stream.
     * @param {String} msg 
     */
    const sendMessage = (msg) => {
        if (msg.text.includes('RT')) {
            return;
        }
        socketConnection.emit("tweets", msg);
    }
};
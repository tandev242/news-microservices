const Request = require('request')
Request(
    {
        method: "GET",
        url: "https://vnexpress.net/hon-rom-bi-ui-troc-4402086.html",
    },
    function (err, response, body) {
        console.log(body);
    }
);
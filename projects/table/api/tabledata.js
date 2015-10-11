var React = require('react'),
    DOM = React.DOM, div = DOM.div, button = DOM.button, ul = DOM.ul, li = DOM.li

function printTableData() {
    var FakeRows = [
        {"feed_name": "CNN world news",
            "feed_type": "rss",
            "geo_locals": 10,
            "topics": 4},
        {"feed_name": "Slashdot",
            "feed_type": "rss",
            "geo_locals": 10,
            "topics": 4},
        {"feed_name": "Gas and electric",
            "feed_type": "rss",
            "geo_locals": 10,
            "topics": 4}
    ];
    document.write(FakeRows);
}
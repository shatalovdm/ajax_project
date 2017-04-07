
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var street = $('#street').val();
    var city = $('#city').val();
    $body.append('<img class="bgimg" src="http://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + street +', ' + city + '">');

    // New York Times News Feed
    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    url += '?' + $.param({
        'api-key': "02d6ffc1044048f78f15e5e7e639b896",
        'fq': city,
        'page': 0
    });
    $.getJSON(url, function( data ) {
        
        var articles = data.response.docs;
        articles.forEach(function(article) {
            $nytElem.append('<li class="article">' +
                '<a href="' + article.web_url + '">' + article.headline.main + '</a>' +
                '<p>'+ article.snippet + '</p>' + '</li>');
        }); 
    }).error( function(e) {
        $nytHeaderElem.text('Could not load New York Times articles');
    });

    // Links to Wikipedia articles
    var wikiRequestTimeout = setTimeout(function() {
        $wikiElem.text("Could not get Wikipedia pages");
    }, 8000);

    $.ajax({
        url: 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + city, 
        dataType: "jsonp",
        success: function(data) {
            var pages = data[1];
            pages.forEach(function(page) {
                $wikiElem.append('<li>' + '<a href="http://en.wikipedia.org/wiki/' + page + '">' + page + '</a>' + '</li>');
            });
            clearTimeout(wikiRequestTimeout);
        }
    });
    return false;
};

$('#form-container').submit(loadData);

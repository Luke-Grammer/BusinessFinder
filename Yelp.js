var IPAddress = '127.0.0.1' // INSERT IP ADDRESS OF NODE SERVER IN DOTTED DECIMAL FORM 'XXX.XXX.XXX.XXX'

var defaultRadius = 40000
var maxRadius     = 40000
var maxCount      = 0
var originalMax   = -1
var prevRadius    = -1
var nextOffset    = -1
var prevOffset    = -1
var nextMax       = -1
var prevMax       = -1

// Custom JQuery method to perform animated scroll to a particular HTML div 
$.fn.scrollView = function () {
    return this.each(function () {
        $('html, body').animate({
            scrollTop: $(this).offset().top
        }, 500)
    })
}

// Function to get list of businesses using the coordinates (latitude/longitude) on the HTML tags on the main page
function getBusinesses(offset, max) {
    console.log("Calling getBusinesses with offset " + offset + " and max " + max)

    // If this is the first packet requested, print a status message
    if (offset == 0) {
        if ($('.location-input').val() == '')
            $('.business-container').html("Please wait while we collect information about businesses near " + $('#location').html()  + "...")
        else
            $('.business-container').html("Please wait while we collect information about businesses near " + $('.location-input').val()  + "...")

        maxCount = 0
        originalMax = max
        
        radius = $('.radius-input').val()
        prevRadius = radius
        if (isNaN(radius)) {
            $('.business-container').html('Search radius must be a number, please try again')
            return
        }
        else if (radius == "")
            radius = defaultRadius 
        else
            radius = parseInt(radius)
        
        if (radius < 0) {
            $('.business-container').html('Search radius too small, please try again')
            return
        }
        else if (radius > maxRadius) {
            $('.business-container').html('Search radius too large, please try again')
            return
        }
    }
    else {
        radius = $('.radius-input').val()
        if (radius != prevRadius) {
            $('.business-container').html('Search radius changed, please try another search')
            return
        } 

        prevRadius = radius
        
        if (radius == "") {
            radius = defaultRadius 
        }
        else
            radius = parseInt(radius)
    }
    
    var priceRange = $('.price-input').val()
    for (var i = 0; i < priceRange.length; i++) {
        if (priceRange[i] != '$' || priceRange.length > 4) {
            $('.business-container').html('Price range contains invalid characters, please enter "$", "$$", "$$$", or "$$$$"')
            return
        }
    }
    
    var searchTerm = $('.business-type-input').val()
    var data = null
    var xhr = new XMLHttpRequest()
    
	xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            console.log("Client received business data:")
            var obj = JSON.parse(xhr.responseText)
            console.log(obj)

            $('.business-container').html('')
            if (obj.total == undefined) {
                $('.business-container').html("There was a problem getting your results, please try again.")
                return
            }
            
            if (offset >= max)
            prevOffset = offset - originalMax
            
            nextOffset = offset + max
            nextMax = Math.min(max, obj.total - (offset + max))
            
            setYelpPageData(obj, radius, offset, max)
            
            if (offset == 0)
                $('.prev-page-button').hide()
            else
                $('.prev-page-button').show()
            
            if (obj.total > offset + max)
                $('.next-page-button').show()
            else
                $('.next-page-button').hide()

            $('.business-button').show('slow')
        }
	})

	xhr.onerror = function() { 
	    $('.business-container').html("There was a problem finding Yelp reviews for the specified location, is Server.js running on localhost port 3000?")
		return
	}
    
    if ($('.location-input').val() != "")
        xhr.open("GET", "http://" + IPAddress + ":3000?type=getBusinesses&location=" + 
                 $('.location-input').val() + "&radius=" + radius + "&offset=" + offset + 
                 "&max=" + max + "&price=" + priceRange + "&search=" + searchTerm)
    else
        xhr.open("GET", "http://" + IPAddress + ":3000?type=getBusinesses&lat=" + 
                 $('#latitude').html() + "&long=" + $('#longitude').html() + "&radius=" + radius + 
                 "&offset=" + offset + "&max=" + max + "&price=" + priceRange + "&search=" + searchTerm)
    xhr.send(data)
}

function getPrevContentPage()
{
    $('.business-container').html('')
    getBusinesses(prevOffset, originalMax)
}

function getNextContentPage()
{
    $('.business-container').html('')
    getBusinesses(nextOffset, nextMax)
}

function setYelpPageData(obj, radius, offset, max) {
    console.log("Adding businesses...")
    $('.business-container').append("<div class='business-summary'>" + obj.total + 
                                    " businesses detected within " + radius + "m (Displaying " + 
                                    (offset + 1) + "-" + (offset + max) + ")<br><br></div>")
    $('.business-title').scrollView();

    for(var i in obj.businesses) {
        $('.business-container').append('<div class="business" id="business-' + ++maxCount + 
            '"> <div class="business-info"> <img class="business-image" src=' + 
            obj.businesses[i].image_url + '> <p1 class = "business-text"> <p1 style="font-weight: 800;font-size: 16px">' + 
            obj.businesses[i].name + " (" + obj.businesses[i].price + ")<br></p1>" + obj.businesses[i].location.address1 +  
            "<br>" + obj.businesses[i].location.city + ", " + obj.businesses[i].location.state + " " + 
            obj.businesses[i].location.zip_code + "<br>Rating: " + obj.businesses[i].rating + 
            "<br><br><p1 id='review-status'>Loading Review Information...</p1></p1></div></div>")

        getReviewData(maxCount, obj.businesses[i].alias)
    }
}

function getReviewData(businessNum, alias) {
    var data = null
    var xhr = new XMLHttpRequest()

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            if (xhr.responseText != "") {
                var obj = JSON.parse(xhr.responseText)
                console.log("Client received business review data")
                console.log(obj)
                var totalText = ''
                if (obj.reviews == undefined)
                    $('#business-' + businessNum).children(".business-info").children(".business-text").children('#review-status').html("This business has no reviews!");

                for (var i = 0; i < obj.reviews.length; i++)
                    totalText += obj.reviews[i].text + "\n"
 
                getTextAnalysis(businessNum, totalText)
            }
        }
    })

    xhr.open("GET", "http://" + IPAddress + ":3000?type=getBusinessReviews&id=" + alias)
    xhr.send(data)
}

var yelpAPI = require('yelp-api')
var express = require('express')
var cors = require('cors')
var app = express()
app.use(cors())

// Function is executed when server receives HTTP GET request
app.get('', function (req, res, next) {
    // Print request information
    console.log("Received " + req.query.type + " request from " + req.ip + ": " + req.originalUrl)

    // GET <host address>:<port>?type=getBusinesses
    if(req.query.type == "getBusinesses") {
        // If request contains latitude/longitude information
        if (req.query.lat != undefined && req.query.long != undefined && req.query.radius != undefined && req.query.offset != undefined && req.query.max != undefined && req.query.price != undefined && req.query.search != undefined) {
            console.log("Finding businesses using latitude/longitude\n")
            yelpCoordSearch(parseFloat(req.query.lat), parseFloat(req.query.long), 
                            req.query.radius, req.query.offset, req.query.max, 
                            req.query.price, req.query.search, res, 
                            function(res, data) { 
                                res.json(data)
                            })
        } 
        // If request contains location search information
        else if (req.query.location != undefined && req.query.radius != undefined && 
                 req.query.offset != undefined && req.query.max != undefined && 
                 req.query.price != undefined && req.query.search != undefined) {
            console.log("Finding businesses using location\n")
            yelpLocationSearch(req.query.location, req.query.radius, 
                req.query.offset, req.query.max, req.query.price, 
                req.query.search, res, function(res, data) { 
                    res.json(data)
                })
        } 
        // If request does not contain all required attributes 
        else {
            console.log("Incorrect parameters entered, ignoring request")
            console.log("Parameters:")
            console.log("Location: " + req.query.location + 
            "\nLatitude: "    + req.query.lat + 
            "\nLongitude: " + req.query.long + 
            "\nRadius: "    + req.query.radius + 
            "\nOffset: "    + req.query.offset + 
            "\nMax: "       + req.query.max + "\n")
        }
    }
    else if(req.query.type == "getBusinessReviews") {
         // If request contains business ID information
         if (req.query.id != undefined) {
             console.log("Finding business reviews for " + req.query.id + "\n") 
             getBusinessReviews(req.query.id, res, function(res, data) 
                           {
                               res.json(data)
                           })
         } 
         // If request does not contain all required attributes 
         else {
             console.log("Incorrect parameters entered, ignoring request")
             console.log("Parameters:")
             console.log("ID: " + req.query.id + "\n")
         }   
    }
})

// Listen on port 3000 for HTTP requests
app.listen(3000, function () {
    console.log('Web server activated and listening for requests on port 3000\n')
})

// Use the yelpAPI to get businesses in an area specified by Latitude/Longitude in a particular radius
function yelpCoordSearch(lat, long, rad, off, max, priceRange, search, res, callback) {   
    // Create a new yelpAPI object with Yelp! API key
    var apiKey = 'ei2upMeKKakFa1VtH0-SCKJz6rzWhkND9jW4S-d7S0Ew-KSbH_JiFOFYwIviTe6yhQk5FR03z5nVLOmY5016296xhf4JMG8XhcYjbLUhTyeKT0nOnkt2JMKS4xjDXXYx';
    var yelp = new yelpAPI(apiKey);

    priceRange = priceRange.length

    if (priceRange == 0) {
        console.log("price undefined, setting to default")
        priceRange = "1, 2, 3, 4"
    }

    if (search.length == 0) {
        console.log("search term undefined, setting to default")
        search = "food"
    }

    // Set parameters, if applicable (see API documentation for allowed params)
    var params = [{ latitude: lat, longitude: long, radius: rad, limit: max, offset: off, price: priceRange, term: search }]
    
    // Call the endpoint
    yelp.query('businesses/search', params)
    .then(data => {
        // Success
        jsonData = JSON.parse(data)
        return callback(res, jsonData)
    })
    .catch(err => {
        // Failure
        console.log(err)
    })
}

// Use the yelpAPI to get businesses in an area specified by Latitude/Longitude in a particular radius
function yelpLocationSearch(loc, rad, off, max, priceRange, search, res, callback) {
    
    // Create a new yelpAPI object with Yelp! API key
    var apiKey = 'ei2upMeKKakFa1VtH0-SCKJz6rzWhkND9jW4S-d7S0Ew-KSbH_JiFOFYwIviTe6yhQk5FR03z5nVLOmY5016296xhf4JMG8XhcYjbLUhTyeKT0nOnkt2JMKS4xjDXXYx';
    var yelp = new yelpAPI(apiKey);

    priceRange = priceRange.length
    if (priceRange == 0) {
        console.log("price undefined, setting to default")
        priceRange = "1, 2, 3, 4"
    }

    if (search.length == 0) {
        console.log("search term undefined, setting to default")
        search = "food"
    }
    
    // Set parameters, if applicable (see API documentation for allowed params)
    var params = [{ location: loc, radius: rad, limit: max, offset: off, price: priceRange, term: search }]
    
    // Call the endpoint
    yelp.query('businesses/search', params)
    .then(data => {
        // Success
        jsonData = JSON.parse(data)
        return callback(res, jsonData)
    })
    .catch(err => {
        // Failure
        console.log(err)
    })
}

// Use the yelpAPI to get businesses in an area specified by Latitude/Longitude in a particular radius
function getBusinessReviews(businessID, res, callback) {
    
    // Create a new yelpAPI object with Yelp! API key
    var apiKey = 'ei2upMeKKakFa1VtH0-SCKJz6rzWhkND9jW4S-d7S0Ew-KSbH_JiFOFYwIviTe6yhQk5FR03z5nVLOmY5016296xhf4JMG8XhcYjbLUhTyeKT0nOnkt2JMKS4xjDXXYx';
    var yelp = new yelpAPI(apiKey)
    
    // Set any parameters, if applicable (see API documentation for allowed params)
    let params = [{ locale: 'en_US' }]
    
    // Call the endpoint
    yelp.query(`businesses/${businessID}/reviews`, params)
    .then(data => {
        // Success
        jsonData = JSON.parse(data)
        return callback(res, jsonData)
    })
    .catch(err => {
      // Failure
      console.log(err)
    })
}
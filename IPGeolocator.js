// Basic function blanks out the currently saved location and requests the callers IPv4 address via an API.
// After getting the address, this function calls getLocationFromAddress()
function getIPLocationData() {
	// Empty and show location information container and dispay a status message
	$('.location-container').show('slow')
	$("#location-status").html("Please wait while we detect your location...")
	$("#location").html('')
	$("#address").html('')
	$("#latitude").html('')
	$("#longitude").html('')
	$('.business-container').html('')
	$('.location-input').val('')

	var data = null
	var xhr = new XMLHttpRequest()

	// When an address is received from the API, call getLocationFromAddress to get geographic information from the address
	xhr.addEventListener("readystatechange", function () {
		if (this.readyState === this.DONE) {
			if (xhr.responseText != "")
				getLocationFromAddress(xhr.responseText.substring(xhr.responseText.indexOf(':"') + 2, xhr.responseText.lastIndexOf('"')))
		}
	})

	// If there was a problem getting the address, provide a status message indicating there was a problem
	xhr.onerror = function() { 
		$('.business-button').hide()
		$("#location-status").html("There was a problem detecting your IP address. Please disable any adblockers and try again.")
	}
	
	// Send request to the API
	xhr.open("GET", "http://api.ipify.org?format=jsonp&callback=getIP")
	xhr.send(data)
}

// Given an IPv4 address, find geographic information about the address via an API request
function getLocationFromAddress(IP)
{
	var data = null
	var xhr = new XMLHttpRequest()
	xhr.withCredentials = true

	// When location information is received from the API, parse the response and update the main page HTML using JQuery to display the results 
	xhr.addEventListener("readystatechange", function () {
		if (this.readyState === this.DONE) {
			var obj = JSON.parse(xhr.responseText)
			obj.ip = IP
			setPageData(obj)
		}
	});

	// If there was a problem getting the location, provide a status message indicating there was a problem
	xhr.onerror = function() { 
		$('.business-button').hide()
		$("#location-status").html("There was a problem detecting your IP address. Please disable any adblockers and try again.")
	}

	// Set header information and send the request to the API
	xhr.open("GET", "https://ip-geo-location.p.rapidapi.com/ip/" + IP + "?format=json")
	xhr.setRequestHeader("x-rapidapi-host", "ip-geo-location.p.rapidapi.com")
	xhr.setRequestHeader("x-rapidapi-key", "c2cdbdc2dfmshe972b7f574017e7p1f95f6jsn14d3b6489fb1")
	xhr.send(data)
}

// Given IP address and location information, update main page HTML to reflect this information and display the search button 
function setPageData(obj) {
	console.log("Received IP geolocation data:")
	console.log(obj)

	// If the API return status indicates that it found the IP location successfully
	if (obj.status == "success")
	{
		// Display location information and populate lat/long in hidden divs for later use
		if (obj.ip != null && obj.country.name != null) {
			$("#location-status").html("Detected Location: ")
			$("#location").html(((obj.city.name == null) ? "" : obj.city.name + " ") + 
								((obj.area.code == null) ? "" : obj.area.code + ", ") + 
								obj.country.name)
			$("#address").html("(IPv4 address " + obj.ip + ")")
		} 
		if (obj.location.latitude != null && obj.location.longitude != null) {
			$('#latitude').html(obj.location.latitude)
			$('#longitude').html(obj.location.longitude)
			$('#latitude').hide()
			$('#longitude').hide()
		}
		
		$('.business-button').show('slow')
		$(".location-input").css("background-color", "grey");
	} else {
		$('.business-button').hide()
		$('location-status').html("Could not retrieve location information from provided IP address, please try again.")
	}

}
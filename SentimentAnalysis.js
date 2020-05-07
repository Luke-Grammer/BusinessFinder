
function getTextAnalysis(businessNum, text) {
	$('#business-' + businessNum).append('<div class="business-review" id="review" + style="width: 50%" ></div>')
	var data = "text=" + text
	var xhr = new XMLHttpRequest()
	xhr.withCredentials = true

	xhr.addEventListener("readystatechange", function () {
		if (this.readyState === this.DONE) {
			try{
				var obj = JSON.parse(xhr.responseText)
			} catch (error)
			{
				console.log("Caught error!")
				$('#business-' + businessNum).children(".business-info").children(".business-text").children('#review-status').html("Yelp encountered a problem getting reviews, try reloading the page.");
				return
			}
			console.log("Semantic Analysis information for business " + businessNum + ": ")
			console.log(obj)
			
			
			$('#business-' + businessNum).children(".business-info").children(".business-text").children('#review-status').html("");
			$('#business-' + businessNum).children("#review").CanvasJSChart({ 
				animationEnabled: true,
				backgroundColor: null,
				title: { 
					text: "Review Summary",
					fontSize: 16,
					fontWeight: 800,
					fontFamily: 'Montserrat',
					fontColor: "#FFF5E7"
				}, 
				axisY: { 
					title: "Overall Business Sentiment in %" 
				}, 
				legend: { 
					fontSize: 14,
					fontFamily: 'Montserrat',
					fontColor: "#FFF5E7",			
					verticalAlign: "top", 
					horizontalAlign: "right" 
				}, 
				data: [ 
					{ 
						startAngle: 270,
						type: "pie", 
						showInLegend: true, 
						percentFormatString: "#0.##",
						indexLabelFontSize: 14,
						indexLabelFontColor: "#FFF5E7",
						indexLabelFontFamily: "Montserrat",
						toolTipContent: "{label} <br/> {y} %", 
						indexLabel: "{y} %", 
						dataPoints: [ 
							{ 
								label: "Positive",  
								y: (Math.round(parseFloat(obj.pos_percent.substring(0, obj.pos_percent.length - 1))*100)/100  + 
								Math.round(parseFloat(obj.mid_percent.substring(0, obj.mid_percent.length - 1))*100)/100), 
								legendText: "Positive"
							}, 
							{ 
								label: "Negative",    
								y: Math.round(parseFloat(obj.neg_percent.substring(0, obj.neg_percent.length - 1))*100)/100, 
								legendText: "Negative"  
							}
						] 
					} 
				],
				options:{
					responsive: false
				}
			})
		}
	})
			
	xhr.onerror = function() { 
		$('#business-' + businessNum).children(".business-info").children(".business-text").children('#review-status').html("Yelp encountered a problem getting reviews for this business!")
	}
			
	xhr.open("POST", "https://text-sentiment.p.rapidapi.com/analyze")
	xhr.setRequestHeader("x-rapidapi-host", "text-sentiment.p.rapidapi.com")
	xhr.setRequestHeader("x-rapidapi-key", "225d3884c7msh6413519466fa352p19d9cbjsnd8c9d5752e47")
	xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded")
	xhr.send(data)
}
		
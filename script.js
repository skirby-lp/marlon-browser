
function clearChildren(node){
	node.innerHTML = "";
}


// loading screen quickmaffs

let message;
let spinner = document.getElementById("spinner");
setInterval(function(){
	message = document.getElementsByClassName("msg");
	console.log("msgs length: " + message.length);

	if(message.length !== 0){
		spinner.remove();
		clearInterval();
	}
}, 50);


// BELOW IS ALL LOADED BEFORE LAYOUT
var windowKit = new windowKit({
	account: 82400935,
	// Site Lerman Zohar skill
	skillId: 2520998330
});


$("#refresh").click(function(){
	$.getScript("windowKit.js");
	console.log('Refreshed windowkit');
});


$("#clear-btn").click(function(){
	console.log('Cleared console')
	clearChildren(document.getElementById("container"))
});



var fadeDuration = 100;

window.onload = function(){
	function submitMsg(msg){
		var userMessage = '<div class="msg-container right">' + "<p class='msg'>" + msg + "</p>" + "</div>"
		$('#container').append($(userMessage).hide().fadeIn(fadeDuration));
		console.log('Candidate: ' + msg);
		windowKit.sendMessage(msg);
		updateScroll();
	}

	$("#send-btn").on('click', function(){
		input = $('#input').val();
		console.log("Length: " + input.length());
		if(input.length > 0){
			submitMsg(input);
			$('#input').val("");
		}


	});
	// Enter a message 
	$('#input').keypress(function (e) {
		if (e.which == 13) {
			input = $('#input').val();
			submitMsg(input);
			$('#input').val("");
		}
	});
}


//connect to LE
windowKit.connect();

//when the agent sends a rich content message
windowKit.onAgentRichContentEvent(function(content) {
	updateScroll();
	console.log('ON AGENT RICH CONTENT EVENT STARTED');
	  //render the structured content using JsonPollock
	console.log("JSON Pollock: " + content);
	var structuredText = JsonPollock.render(content);
	console.log("Structured text:", structuredText);
	  //append the results of the render to the DOM
		$('#container').append($(structuredText).hide().fadeIn(fadeDuration));
	  //next three rows create the same scrolling effect as above
	  var botTextsSC = document.getElementsByClassName('lp-json-pollock');
	  var latestSC = botTextsSC[botTextsSC.length - 1];
	  //$('body, html').animate({ scrollTop: $(latestSC).offset().top }, 0);
		console.log('Agent: ', structuredText);
		updateScroll();

	  //when a user clicks on a structured content button
	  $('.lp-json-pollock-element-button').on('click', function () {
		  //grab the text of the button
		  var scText = $(this).text();
		  //send the text to LE for the bot to process
		  windowKit.sendMessage(scText);
			//append the text to the DOM so it shows up as the user's side of the conversation
			var userMessage = '<div class="msg-container right">' + "<p class='msg'>" + scText + "</p>" + "</div>"
		  $('#container').append($(userMessage).hide().fadeIn(fadeDuration));
		  //same scroll effect as above
		  var consumerTexts = document.getElementsByClassName('consumerText');
		  var latestConsumerText = consumerTexts[consumerTexts.length - 1];
			//$('body, html').animate({ scrollTop: $(latestConsumerText).offset().top }, 0);
			updateScroll();
	  });
  });



//when the agent sends a text message
windowKit.onAgentTextEvent(function(text) {
	console.log('ON AGENT TEXT EVENT');
	//append the message's contents to the DOM
	var agentMessage = '<div class="msg-container left">' +  "<p class='msg'>" + text + '</div>';
	$('#container').append($(agentMessage).hide().fadeIn(fadeDuration));
	//grab all the agent texts so far
	var botTexts = document.getElementsByClassName('agentText');
	//find the last one
	var latestText = botTexts[botTexts.length - 1]
	//scroll the window to the last text. This is used to create a scroll effect in the conversation.
	//$('body, html').animate({ scrollTop: $(latestText).offset().top }, 0);
	console.log('Agent: ' + text);
	updateScroll();
});



function updateScroll(){
	var chatHistory = document.getElementById("container");
	chatHistory.scrollTop = chatHistory.scrollHeight;
}





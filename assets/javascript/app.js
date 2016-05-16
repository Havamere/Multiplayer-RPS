//start firebase with 2 objects, a chat div/section, and turn count
//for enter name, add first log in to first object, set if logic for if first filled, add to second object

//Ensures webpage is loaded before running JS
$(document).on('ready', function(){
	//sets url for variable for multiple storage spaces
  var url = "http://intense-heat-4472.firebaseio.com/"
  	//inital inputs are blank
  var name = "";
  var choice = "";
  var wins = 0;
  var losses = 0;
  var ties = 0;
  var player1 = true;
  var p1 = '1';
  var p2 = '2';
  var players = 'players';

  	//when subit name button is clicked
  $('#input-name').on('click', function(){
  	//sets Firebase storage for game refernce
 	var game = new Firebase(url);
  	//takes name from input field
  	name = $('#name').val().trim();
  	//verifies name capture
  	console.log(name);
  	//function that only happens 'once' instead of every time value changes
  	game.once('value', function(snapShot){
  	  //sets up ability to check if a players object exists
  	  var exists = snapShot.child(players).exists();
  	  //sets ability to check if players ojbect has a 'second' player object
  	  var full = snapShot.child(players).child('2').exists();
  	  //runs assign player function to set players
  	  assignPlayer(name, game, exists, full);
  	})

  	function assignPlayer(name, game, exists, full){
	  //condition modifier to set player2 if player1 present
	  if(exists && !full){
	  	//creates players object in game object
  		var playersRef = game.child(players);
  		//creates player2 object in players object
  		var player2Ref = playersRef.child(p2);
		//sets player2 data storage
		player2Ref.set({
		  name: name,
		  choice: choice,
		  wins: wins,
		  losses: losses,
		  ties: ties,
		 });
		//tests data collection
	  	console.log(name);
	  	//sets player 2 name to player 2 div
	  	$('#player2').html(name);
	  }
	  else if (full) {
	  	alert("Players are set, please try again later");
	  }
	  else {
	  	//creates players object in game object
  		var playersRef = game.child(players);
  		//creates player2 object in players object
  		var player1Ref = playersRef.child(p1); 
	  	//sets player1 data storage
	  	player1Ref.set({
	  		name: name,
	  		choice: choice,
	  		wins: wins,
	  		losses: losses,
	  		ties: ties,
	  	});
	  	//tests data collection
	  	console.log(name);
	  	//sets player 1 name to player 1 div
	  	$('#player1').html(name);
	  }
  	}



  })
  
  function chat(message){

  }

  if (game.child(players).child('1').exists() == true) {
  	$('#player1').html(game.child(players).child('1').name);
  }
})
//start firebase with 2 objects, a chat div/section, and turn count
//for enter name, add first log in to first object, set if logic for if first filled, add to second object

//Ensures webpage is loaded before running JS
$(document).on('ready', function(){
	//sets url for variable for multiple storage spaces
  var url = "http://intense-heat-4472.firebaseio.com/"
  	//sets Firebase memory aside for 2 players
  var p1 = new Firebase(url);
  var p2 = new Firebase(url);
  	//sets Firebase memory for chat window
  var chat = new Firebase(url);
  	//sets Firebase memory for turn counter
  var turn = new Firebase(url);
  	//inital inputs are blank
  var name = "";
  var choice = "";
  var wins = 0;
  var losses = 0;
  var ties = 0;
  var player1 = true;

  	//when subit name button is clicked
  $('#input-name').on('click', function(){
  	//sets player1 data storage
  	p1.set({
  		name: name,
  		choice: choice,
  		wins: wins,
  		losses: losses,
  		ties: ties,
  	})
  	//sets player2 data storage
  	p2.set({
  		name: name,
  		choice: choice,
  		wins: wins,
  		losses: losses,
  		ties: ties,
  	})
  	//condition modifier to set player2 if player1 present
  	if(p1.name != ""){

  	}

  })

})
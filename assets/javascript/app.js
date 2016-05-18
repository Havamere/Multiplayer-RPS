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
  var opponent;
  //sets Firebase storage for game refernce
  var game = new Firebase(url);
 
  makeButtons();

  //--------------------------------Start of Input-Name------------------------------------
    //when subit name button is clicked
  $('#input-name').on('click', function(){
    //takes name from input field
    name = $('#name').val().trim();
    //verifies name capture
    console.log(name);
    //------------------------
    //function that only happens 'once' instead of every time value changes
    game.once('value', function(snapShot){
      //sets up ability to check if a players object exists
      var player1exists = snapShot.child('players').child('1').exists();
      var player2exists = snapShot.child('players').child('2').exists();
      
      //runs assign player function to set players
      assignPlayer(name, game, player1exists, player2exists);

      var messageRef = game.child('message');
      var timeRef = game.child('timeStamp');

      messageRef.set({
        message: "",
      })

      timeRef.onDisconnect().remove();

      messageRef.onDisconnect().update({
        message: name+': Disconnected',
      });

      //-------------------------------------------
      //creates an object in firebase to store chat messages
      $('#send').on('click', function(){
        //captures message from user
        message = $('#chat').val().trim();
        //firebase data reference for messages with name of sender
        messageRef.update({
          message: name + ': ' +message,
        });
        timeRef.push({
          time: Firebase.ServerValue.TIMESTAMP,
        });
      });//----------------------------------------

      //-------------------------------------------------------------
      //does live update for both players to chat box div so they can talk to each other
      messageRef.on('value', function(snapShot) {
        newMessage = snapShot.val().message;
        $('#chat-window').append('<p>'+newMessage+'</p>');
      });//-------------------------------------------------------------

      timeRef.on('child_added', function(snapShot) {
        timeStamp = snapShot.val().time;
        newTime = moment(timeStamp).format('LT');
        $('#chat-window').append('<p id="time">'+newTime+'</p>');
      })

    });
    //-------------------------
  });
  //------------------------------End of Input-Name---------------------------------
    

  //-=-=-=-=-=-=-=-=-=-=--Assign Player Function-=-=-=-=-=-=-=-=-=-=-=-=-=-
  function assignPlayer(name, game, player1exists, player2exists){
    var playerNum;

    //-----------------------------------------------------------
    //updates cosntantly when game object in firebase has values
    game.on('value', function(snapShot){
      //sets opponent name for either player
      $('#opponent').text(snapShot.val().players[opponent].name);
      //separates stats for player  
      $('.player-stats').text(
        'Wins: '+wins+
        ' Losses: '+losses+
        ' Ties: '+ties);
      //sepates stats for opponent
      $('.opponent-stats').text(
        'Wins: '+snapShot.val().players[opponent].wins+
        ' Losses: '+snapShot.val().players[opponent].losses+
        ' Ties: '+snapShot.val().players[opponent].ties);
    });//-----------------------------------------------------------


    //=======================Start of If Statement======================
    //condition modifier to set player2 if player1 present
    if(player1exists && !player2exists){
      //creates players object in game object
      var playersRef = game.child('players');
      //creates player2 object in players object
      var player = playersRef.child('2');
      //sets player2 data storage
      player.set({
        name: name,
        choice: choice,
  		  wins: wins,
  		  losses: losses,
  		  ties: ties,
  		 });
  		//tests data collection
	  	console.log(name);
	  	//sets player 2 name to player 2 div
	  	$('#opponent').html(name);
	  	//set player number
	  	playerNum = 2;
	  	//removes player info from server on disconnect
	  	player.onDisconnect().remove();
	  }//--------------------if--------------------------------
	  //informs anyone trying to join that game is full if 2 player are set
	  else if (player1exists && player2exists) {
	  	alert("Players are set, please try again later.");
	  }//---------------------else/if-------------------------------
	  //sets first player if no players are set in firebase game object
	  else {
	  	//creates players object in game object
  		var playersRef = game.child('players');
  		//creates player2 object in players object
  		var player = playersRef.child('1'); 
	  	//sets player1 data storage
	  	player.set({
	  	  name: name,
	  	  choice: choice,
	  	  wins: wins,
	  	  losses: losses,
	  	  ties: ties,
	  	});
	  	//tests data collection
	  	console.log(name);
	  	//sets player 1 name to player 1 div
	  	$('#player').html(name);
	  	//set player number
	  	playerNum = 1;
	  	//removes player info from server on disconnect
	  	player.onDisconnect().remove();
	  }//============================End If Statement==========================

    //------------------------Start gamePlay Function-------------------------
  	function gamePlay(playerNum, player, playersRef){
  	  //sets up an or logic to flip opponent number based on who is which player in the firebase object
  	  opponent = playerNum === 1 ? 2 : 1;
      //sets data reference for turns
      var turnRef = game.child('turn');

      turnRef.onDisconnect().remove();

  	  turnRef.set({
  	  	turn: 1,
  	  });

      //-----------------------Start of .on(turnRef)------------------------------
  	  turnRef.on('value', function(snapShot){
        //confirms turn value
  	  	console.log(snapShot.val().turn);
        //sets current turn value
  	  	var currentTurn = snapShot.val().turn;
        //sets aside memory for either player's choice
  	  	var choice;
        //=======================Start of If Statement===========================
        //handles player 1 turn
        if(playerNum == snapShot.val().turn) {
          //clears name entry form once player has logged in
          $('#input-player-name').empty();
          $('#game-stats').empty();
          //creates the rock paper and scissor images for player to choose from
          makeButtons();
          
          //-----------------------.on(body) click function------------------------
          //captures player's choice
          $('body').on('click', '.choice', function(){
            choice = $(this).data('text');
            //stores choice in firebase
            playerRef.update({
              choice: choice,
            });
            //updates current turn
            currentTurn++;
            //updates turn on firebase
            turnsRef.set({
              turn: currentTurn,
            });
            //write user choice to DOM
            $('#player-stats').html('<h2>'+choice+'</h2>');
          });//----------------------end .on(body) click function----------------------
        
        }//--------------------------if-------------------------------------
        //handles player 2 turn
        else if (snapShot.val().turn == 3) {
          //clears name entry form once player has logged in
          $('#input-player-name').empty();
          //______________________________________________________________
          game.once('value', function(snapShot){
            //confirms game object
            console.log(snapShot.val());
            var result = snapShot.val().player[playerNum];
            var myChoice = snapShot.val().player[playerNum].choice; 
            console.log(myChoice);
            var opponentChoice = snapShot.val().player[opponent].choice;
            console.log(opponentChoice);
            //-----------------Start of Inner If Statement-----------------------
            if (myChoice == opponentChoice) {
              ties++;
              playerRef.update({
                ties: ties,
              });
              $('#game-stats').html('<h1>DRAW!</h1>');
              $('.opponent-choices').html('<h1>'+opponentChoice+'</h1>');
            }//----------------------------if-------------------------------
            else if ((userGuess == 'rock' && computerGuess == 'scissors') || 
                      (userGuess == 'scissors' && computerGuess == 'paper') || 
                      (userGuess == 'paper' && computerGuess == 'rock')) {
              wins++;
              playerRef.update({
                wins: wins,
              });
              $('#game-stats').html('<h1>'+snapShot.val().players[playerNum].user+'WINS!</h1>');
              $('.opponent-choices').html('<h1>'+opponentChoice+'</h1>');
            }//---------------------------else/if--------------------------------
            else {
              losses++;
              playerRef.update({
                losses: losses,
              });
              $('#game-stats').html('<h1>'+snapShot.val().players[opponent].user+'WINS!</h1>');
              $('.opponent-choices').html('<h1>'+opponentChoice+'</h1>');
            }//--------------------End of Inner If Statement------------------------
          });//_____________________________________________________________________
        }//----------------------------else/if-------------------------------------
        else {
          $('#game-stats').html('Waiting for opponent choice.');
        };//--------------------------End of If Statement----------------------------
  	  });//----------------------------End of .on(turnRef)---------------------------
  	};//---------------------------End of gamePlay function-------------------------
    gamePlay(playerNum, player, playersRef);
  };//-=-=-=-=-=-=-=-=-=-=-=-=-=End Assign Player Function-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  //-------------------------Start Make Button Function------------------------------
  function makeButtons(){
    $('#player-choices').html('<div class="row">'+
                                '<div id="choices">'+
                                  '<img class= "choice" alt="rock" data-text="rock" src="assets/images/rock.png">'+
                                  '<img class= "choice" alt="paper" data-text="paper" src="assets/images/paper.png">'+
                                  '<img class= "choice" alt="scissors" data-text="scissors" src="assets/images/scissors.png">'+
                                '</div>'+
                              '</div>');
  };//--------------------------End Make Button Function-------------------------------

});//---------------------------End .on(Document) Function-----------------------------
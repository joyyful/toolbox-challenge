"use strict";

var firstTile = null;
var secondTile = null;
var pics = [];
var clickable = true;
var timer = null;

function onReady () {
	populateGame();

	//when new game button is clicked, reload the game-board
	$("#new-game").click(function() {
		window.location.reload();
	});

	startTimer();

	//hides the winning message until user wins the game
	$("#win-message").hide();
}

function populateGame() {
	//makes the array of pictures
	for (var i = 1; i < 33; i++) {
		pics.push(i);
	}

	//randomly chooses 8 pictures, doubles them and then shuffles the order again
	pics = _.shuffle(pics).slice(0, 8);
	pics = pics.concat(pics);
	pics = _.shuffle(pics);

	//populate the game-board with pictures
	var ul = $("#tiles");
	for (var i = 0; i < 16; i++) {
		var newLI = $(document.createElement("li"));
		var newImg = $(document.createElement("img"));
		newImg.attr("src", "img/tile-back.png")
		newImg.data("number", pics[i]);
		newImg.data("position", i);
		newImg.data("flipped", false);
		newImg.click(onTileClick);
		newLI.append(newImg);
		ul.append(newLI);
	}
}

function startTimer() {
	var startTime = _.now();
	timer = window.setInterval(function() {
		$("#current-time").html(Math.floor((_.now() - startTime) / 1000));
	}, 1000);
}

function onTileClick() {
	//if tile is not flipped, users can click on it to flip it
	if (clickable && !$(this).data("flipped")) {
		$(this).attr("src", "img/tile" + $(this).data("number") + ".jpg");
		$(this).data("flipped", true);
		$(this).addClass("selected");

		if (firstTile == null) {
			firstTile = $(this);
		} else {
			clickable = false;
			//when there is a match
			if (firstTile.data("number") == $(this).data("number")) {
				//increment match counter
				var matchElement = $("#matches");
				var matches = parseInt(matchElement.html());
				matchElement.html(matches + 1);

				//also decrements the pairs remaining counter
				var pairsRemaining = $("#remaining");
				var remaining = parseInt(pairsRemaining.html());
				pairsRemaining.html(remaining - 1);

				firstTile.removeClass("selected");
				$(this).removeClass("selected");
				firstTile.addClass("matched");
				$(this).addClass("matched");

				//when player wins the game
				if ((remaining - 1) == 0) {
					clearInterval(timer);
					$("#win-message").show();
				//if game is not won, then tiles stay flipped & player can continue to play
				} else {
					firstTile = null;
					clickable = true;
				}
			//when there isn't a match
			} else {
				//increment mismatch counter
				var pairsMismatched = $("#mismatches");
				var mismatches = parseInt(pairsMismatched.html());
				pairsMismatched.html(mismatches + 1);

				secondTile = $(this);

				firstTile.addClass("mismatched");
				secondTile.addClass("mismatched");

				//game waits 1 second until flipping the wrong pairs over
				setTimeout(flipCards, 1000);
			}
		}
	}
}

function flipCards() {
	firstTile.attr("src", "img/tile-back.png");
	firstTile.data("flipped", false);
	firstTile.removeClass("mismatched");
	firstTile.removeClass("selected");

	secondTile.attr("src", "img/tile-back.png");
	secondTile.data("flipped", false);
	secondTile.removeClass("mismatched");
	secondTile.removeClass("selected");

	firstTile = null;
	secondTile = null;
	clickable = true;
}

$(onReady);
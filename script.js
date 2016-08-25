function Simon() {

  this.STRICT = false;
  this.POWER = true;
  this.WINSCORE = 20;
  var count = 0;
  var start = false;
  var strict = false;
  var game_start = true;
  var MAXCOUNT = 10;
  var options = ["green", "red", "blue", "yellow"];
  var sequence = [];
  var usersequence = [];
  var gameplayStarted = false;

  this.isGameOver = function() {
    return this.WINSCORE == this.getCount();
  };

  this.setSequence = function(list) {
    list.forEach(function(l) {
      sequence.push(l);
    });
  };

  this.playSequence = function() {
    var self = this;
    console.log("COMP: " + sequence.toString());
    async.eachSeries(sequence, function iteratee(item, callback) {
      $("#" + item).addClass(item);
      self.playSound(item);
      setTimeout(function() {
        $("#" + item).removeClass(item);
        setTimeout(callback, 1000);
      }, 1000);
    });
  };

  this.getUsersequence = function() {
    return usersequence;
  };

  this.setUsersequence = function(list) {
    usersequence = list;
  };

  this.getSequence = function() {
    return sequence;
  };

  this.getGameplayStarted = function() {
    return gameplayStarted;
  };

  this.setGameplayStarted = function(option) {
    gameplayStarted = option;
  };

  this.getCount = function() {
    return count;
  };

  this.setCount = function(option) {
    count = option;
  };

  var mp3s = ["https://s3.amazonaws.com/freecodecamp/simonSound1.mp3",
    "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3",
    "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3",
    "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"
  ];
  var audioList = {};
  for (var i = 0; i < mp3s.length; i++) {
    audioList[options[i]] = new Audio(mp3s[i]);
  }

  this.playSound = function(option) {
    audioList[option].play();
  };

  this.doesSequenceMatch = function() {
    console.log("USER SEQUNDE IS : " + usersequence);
    console.log("COMP SEQUENE IS : " + sequence);;;
    if (usersequence.length > 0) {
      for (var i = 0; i < usersequence.length; i++) {
        if (usersequence[i] !== sequence[i]) {
          return false;
        }
      }
    }
    return true;
  };

  this.addOption = function() {
    var choice = options[Math.floor(Math.random() * 4)];
    sequence.push(choice);
    count++;
    $("#display").text(count);

    //Playback the sequence in queue order
    this.playSequence();
    this.setUsersequence([]);
    console.log("USER RESET: " + usersequence.toString());
  };

  this.addUserOption = function(option) {
    var self = this;
    usersequence.push(option);
    console.log("USER: " + usersequence);

    $("#" + option).addClass(option);
    setTimeout(function() {
      $("#" + option).removeClass(option);

      //if (self.getSequence().length === self.getUsersequence().length) {
      // TODO: 
      // 1. keep accepting user options till matches length sequnce
      // 2. if lengthe equals add verfication pass - add new option to sequence

      if (self.doesSequenceMatch()) {
        console.log("Match");
        if (self.isGameOver()) {
          self.resetGame();
        }
        if (self.getSequence().length === self.getUsersequence().length) {
          setTimeout(function() {
            self.addOption();
          }, 2000);
        }
      } else {
        if (!self.STRICT) {
          var count = $("#display").text();
          $("#display").text("!!");
          setTimeout(function() {
            $("#display").text(count);
            self.playSequence();
            self.setUsersequence([]);
          }, 2000);
        } else {
          console.log("you lose!");
          console.log("game reset");
          $("#display").text("!!");
          setTimeout(function() {
            $("#display").text("--");
            self.resetGame();
            self.startGame();
          }, 2000);
        }
      }

      //} // only if you want user to finish sequence

    }, 1000);
  };

  this.resetGame = function() {
    count = 0;
    sequence = [];
    usersquence = [];
    $("#display").text("--");
  };

  this.startGame = function() {
    if (this.getCount() < this.WINSCORE) {
      this.addOption();
    } else {
      this.resetGame();
      this.startGame();
    }
  };

};

$(document).ready(function() {
  $("[name='switch-checkbox']").bootstrapSwitch();
  var simon = new Simon();

  $("#strictButton").click(function() {
    if (simon.POWER) {
      $("#indicatorButton").toggleClass("redBackground");
      simon.STRICT = !simon.STRICT;
    }
  });

  $('#powerButton').click(function() {
    if ($('#checkbox_check').is(':checked')) {
      console.log("POWER ON");
      simon.POWER = true;
    } else {
      console.log("POWER OFF");
      simon.POWER = false;
      $("#indicatorButton").removeClass("redBackground");
      simon.setGameplayStarted(false);
      simon.resetGame();
    }
  });

  $("#app").click(function(event) {

    if ($('#checkbox_check').is(':checked')) {
      simon.POWER = true;
    } else {
      simon.POWER = false;
      simon.setGameplayStarted(false);
      simon.resetGame();
    }

    if (simon.POWER) {
      switch (event.target.id) {

        case "startButton":
          if (simon.getGameplayStarted()) {
            console.log("game reset");
            simon.resetGame();
            simon.startGame();
            simon.setGameplayStarted(true);
          } else {
            console.log("game starts");
            simon.setGameplayStarted(true);
            simon.startGame();
          }
          break;
        case "yellow":
          if (simon.getGameplayStarted()) {
            simon.addUserOption("yellow");
            simon.playSound("yellow");
          }
          break;
        case "red":
          if (simon.getGameplayStarted()) {
            simon.addUserOption("red");
            simon.playSound("red");
          }
          break;
        case "blue":
          if (simon.getGameplayStarted()) {
            simon.addUserOption("blue");
            simon.playSound("blue");
          }
          break;
        case "green":
          if (simon.getGameplayStarted()) {
            simon.addUserOption("green");
            simon.playSound("green");
          }
          break;

      };
    } // POWER

  });

});

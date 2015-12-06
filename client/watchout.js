// set width and height of playing field
var width = 600, height = 600;
// create our playing field
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.append('filter')
  .attr('id', 'this_image')
  .attr('patternUnits', "userSpaceOnUse")
  .attr('x','0%')
  .attr('y','0%')
  .attr('height','100%')
  .attr('width','100%')
.append('feImage')
  .attr('xlink:href', 'asteroid.png');

// the number of enemies to draw
var numEnemies = 5;

// this creates enemy position data
function makeData(n){
  var enemiesData = [];
  for (var i=0; i<n; i++){
    enemiesData.push({
      x: Math.random()*width, 
      y: Math.random()*height,
    });  
  }
  return enemiesData;
}

// create a drage event listener
var dragEventListner = d3.behavior.drag();
// create player circle
var player = svg.append("circle")
  // set class to player
  .attr('class', 'player')
  // set x and y position
  .style({
    "cx": width/2, 
    "cy":height/2
  })
  // attach drag event listener to player circle
  .call(dragEventListner);

// this defines our drag behavior
dragEventListner.on("drag", function(){
  // updates x and y of player circle
  player.style({
    "cx": d3.event.x,
    "cy": d3.event.y
  });
});

// function that checks for collision
var collisionDetected = function(player, enemy){
  // extracting data from playre and enemy objects
  var playerPosition = player[0][0].style;
  var enemyPosition = enemy.style
  // calculating x and y distance between player and enemy
  var xDistance = parseInt(playerPosition.cx.slice(0, -2)) - parseInt(enemyPosition.cx.slice(0, -2));
  var yDistance = parseInt(playerPosition.cy.slice(0, -2)) - parseInt(enemyPosition.cy.slice(0, -2));
  // calculating total distance between player and enemy
  var totalDistance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
  // returning true if distance is less that the sum of the player's and the enemy's radii
  return (totalDistance < (100));
}

// updates our enemies' positions, sets up tween to call collisionDetected.
var updateEnemies = function(data){
  // data join
  // select all enemies and updates the data
  var enemies = svg.selectAll('.enemy').data(data);
  
  //update selection
  // Move enemies from old position to new position
  // transition and duration smoothly animates
  enemies.transition().duration(1000)
    // check collisions during transition
    .tween("collision", function(data, index){
      return function(time) {
        // check for collision
        if(collisionDetected(player, this)){
          // set high score
          if(currentScore > highScore){
            highScore = currentScore;
          }
          //count collisions
          numCollisions++;
          //reset score to 0
          currentScore = 0;
        }
      };
    })
    // sets final position of transition
    .style({
      "cx": (function(d){return d.x.toString() + "px"}), 
      "cy": (function(d){return d.y.toString() + "px"}),
      "transform": "rotate(1080deg)",
      "transform-origin": (function(d){return ""+d.x+"px "+d.y+"px";}),
    });

  //enter selection
  // creates our Enemies (at the begining)
  enemies.enter().append('circle').attr('class','enemy')
    // sets the x and y position
    .style({
      "cx": (function(d){return d.x.toString() + "px"}), 
      "cy": (function(d){return d.y.toString() + "px"}),
      "transform": "rotate(1080deg)",
      "transform-origin": (function(d){return ""+d.x+"px "+d.y+"px";}),
    })
    .attr('filter','url(#this_image)')
}


// initialize score to 0
var currentScore = 0;
var highScore = 0;
var numCollisions = 0;

// updates our score board
var updateScore = function(){
  d3.select('.current').select('span').data([currentScore])
    .text(function(d){return d});
  d3.select('.highscore').select('span').data([highScore])
    .text(function(d){return d});
  d3.select('.collisions').select('span').data([numCollisions])
    .text(function(d){return d});
};

d3.timer(function(timeElapsed){
  currentScore++;
  updateScore();
});

// calls updateEnemies every one second
setInterval(function() {
  updateEnemies(makeData(numEnemies));
  // update the current score
  // currentScore += 100;
  //updateScore(d3.select('.current').select('span').data()[0]);
}, 1000);


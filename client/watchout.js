
var width = 600, height = 600;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var numEnemies = 5;
//var arrEnemies = [];

function makeData(n){
  var enemiesData = [];
  for (var i=0; i<n; i++){
    enemiesData.push({
      x: Math.random()*width, 
      y: Math.random()*height
    });  
  }
  return enemiesData;
}

var updateEnemies = function(data){
  //data join
  var enemies = svg.selectAll('.enemy').data(data);
  //update
  enemies.transition().duration(1000)
    .style({
      "cx": (function(d){return d.x.toString() + "px"}), 
      "cy": (function(d){return d.y.toString() + "px"}),
    });

  //enter
  enemies.enter().append('circle').attr('class','enemy')
    .style({
      "cx": (function(d){return d.x.toString() + "px"}), 
      "cy": (function(d){return d.y.toString() + "px"}),
    });
}

var collisionDetected = function(player, enemy){
  var playerPosition = player[0][0].style;
  var enemyPosition = enemy[0][0].style
  var xDistance = parseInt(playerPosition.cx.slice(0, -2)) - parseInt(enemyPosition.cx.slice(0, -2));
  var yDistance = parseInt(playerPosition.cy.slice(0, -2)) - parseInt(enemyPosition.cy.slice(0, -2));
  var totalDistance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
  return (totalDistance < (100));
}

setInterval(function() {
  updateEnemies(makeData(numEnemies));
  if(collisionDetected(svg.select(".player"), svg.select(".enemy"))){
    console.log("collisionDetected!");
  }
}, 1000);

var dragEventListner = d3.behavior.drag();
svg.append("circle")
  .attr('class', 'player')
  .style({
    "cx": width/2, 
    "cy":height/2
  })
  .call(dragEventListner);

dragEventListner.on("drag", function(){
  svg.select('.player').style({
    "cx": d3.event.x,
    "cy": d3.event.y
  });
});
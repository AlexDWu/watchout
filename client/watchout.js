
var width = 600, height = 600;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var numEnemies = 5;
//var arrEnemies = [];
for (var i=0; i<numEnemies; i++){
  svg.append("circle")
  .attr('class', 'enemy');
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
  svg.selectAll(".enemy")
  .transition()
  .duration(1000)
    .style({
      "cx": (Math.random() * width).toString() + "px", 
      "cy": (Math.random() * height).toString() + "px"
    });
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
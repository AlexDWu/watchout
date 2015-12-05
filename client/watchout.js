
var width = 600, height = 600;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);
svg.append("image")
  .attr('xlink:href', "asteroid.png")
  .attr("width", 60)
  .attr("height", 60);

setInterval(function() {
  svg.select("image")
  .style({
    "x": (Math.random() * width).toString() + "px", 
    "y": (Math.random() * height).toString() + "px"
  });
}, 1000);

var dragEventListner = d3.behavior.drag();
svg.append("circle")
  .attr('class', 'player')
  .style({
    "cx": width/2, 
    "cy":height/2
  })
  .call(dragEventListner);

dragEventListner.on("drag", function(dragData){
  svg.select('.player').style({
    "cx": d3.event.x,
    "cy": d3.event.y
  });
});
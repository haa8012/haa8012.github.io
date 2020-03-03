const drawPie = (
  selector,
  width,
  height,
  data,
  labels,
  ringSize = 15,
  cornerRadius = 0,
  gap = 0.01,
  graphPadding = 0,
  colorPallet
) => {
  if (document.querySelector(selector)) {
    $(selector).empty();
  }

  let sel = '_' + selector.slice(1, 50),
    radius = height / 2 - graphPadding,
    f = d3.format('.1%'),
    n = d3.format('.2s');

  var arc = d3
    .arc()
    .innerRadius(radius - ringSize) //((+ringSize/100)*radius))
    .outerRadius(radius)
    .cornerRadius(cornerRadius);

  var pie = d3.pie().padAngle(gap);

  var z = d3.scaleOrdinal(colorPallet);
  //var z = d3.scale.ordinal().domain(data)
  //.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

  var svg = d3
    .select(selector)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('class', sel)
    .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
  //.attr("transform", "translate(" + ((width / 2)- margin.right) + "," + ((height / 2)) + ")");

  var arc = svg
    .selectAll('path')
    .data(pie(data))
    .enter()
    .append('path')
    .attr('class', 'arc' + sel)
    .style('fill', function(d, i) {
      return z(data[i]);
    })
    .attr('d', arc);
  //.attr('stroke-width', '1px')
  //.attr('stroke', 'white')

  arc
    .on('mouseover', function(d, i) {
      //d3.select('.arc').style("opacity", .1);
      d3.select(this)
        .style('stroke-width', 2)
        .style('stroke', z(data[i]))
        .style('stroke-opacity', 0.9); //.attr("stroke-width", 7);

      d3.select('.value_per' + sel)
        .style('fill', z(data[i]))
        .text(f(d.value / d3.sum(data)));
      d3.select('.value' + sel).text(n(d.value));
      d3.select('.label' + sel).text(labels[i]);
    })
    .on('mouseout', function(d) {
      d3.select(this).style('stroke-width', 0);
      d3.select('text.value_per' + sel)
        .style('fill', z(data[0]))
        .text(f(data[0] / d3.sum(data)));
      d3.select('text.value' + sel).text(n(data[0]));
      d3.select('.label' + sel).text(labels[0]);
    });

  svg
    .append('text')
    .attr('class', 'label' + sel)
    //.attr("transform", "translate(" + ((width / 2)) + "," + ((height / 2)) + ")")
    .attr('x', 0)
    .attr('y', 0)
    .attr('dy', -Math.min(width, height) * 0.15 + 'px')
    .style('fill', 'grey') //'#c3c3c3')
    .style('font-size', Math.min(width, height) * 0.1 + 'px')
    .style('text-anchor', 'middle')
    //.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    .text(labels[0]);

  svg
    .append('text')
    .attr('class', 'value_per' + sel)
    .attr('x', 0)
    .attr('y', 0)
    .attr('dy', Math.min(width, height) * 0.0015 + 'em')
    .style('fill', z(data[0])) //'#00435B')
    .style('font-size', Math.min(width, height) * 0.2 + 'px')
    .style('text-anchor', 'middle')
    //.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    .text(f(data[0] / d3.sum(data)));

  svg
    .append('text')
    .attr('class', 'value' + sel)
    .attr('x', 0)
    .attr('y', 0)
    .attr('dy', Math.min(width, height) * 0.012 + 'em')
    .style('fill', '#00435B')
    .style('font-size', Math.min(width, height) * 0.08 + 'px')
    .style('text-anchor', 'middle')
    //.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    .text(n(data[0]));

  // //if the legend flag is true.
  // if (l) {
  //     var legend = svg.append("g")
  //         .selectAll("g")
  //         .data(labels)//data.reverse())
  //         .enter().append("g")
  //         .attr("transform", function(d, i) { return "translate("+ ((width -100))  +','+ (i - (data.length) / 2) * 20 + ")"; });

  //         //.attr("transform", function(d, i) { return "translate("+ ((width / 2)-margin.right+margin.left)  +','+ (i - (data.length) / 2) * 20 + ")"; });

  //       legend.append("rect")
  //           .attr("width", 18)
  //           .attr("height", 18)
  //           .attr("fill", function(d,i) {return z(d);});

  //       legend.append("text")
  //           .attr("id", function(d){ return d;})
  //           .attr("class", 'legend')
  //           .attr("x", 24)
  //           .attr("y", 9)
  //           .attr("dy", "0.35em")
  //           .text(function(d) { return d; });
  //   }
};

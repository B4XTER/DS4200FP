/* global D3 */

function table() {

  // Based on Mike Bostock's margin convention
  // https://bl.ocks.org/mbostock/3019563
  let ourBrush = null,
    selectableElements = d3.select(null),
    dispatcher;

  // Create the chart by adding an svg to the div with the id 
  // specified by the selector using the given data
  function chart(selector, data) {
    let table = d3.select(selector)
      .append("table")
        .classed("my-table", true),
    thead = table.append("thead"),
    tbody = table.append("tbody");
    // Here, we grab the labels of the first item in the dataset
    //  and store them as the headers of the table.
    let tableHeaders = Object.keys(data[0]);

    // You should append these headers to the <table> element as <th> objects inside
    // a <th>
    // See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table


    thead.append("tr")
    .selectAll("th")
    .data(tableHeaders)
    .enter()
    .append("th")
        .text(function(data) { ;return data; });

    // Then, you add a row for each row of the data.  Within each row, you
    // add a cell for each piece of data in the row.
    // HINTS: For each piece of data, you should add a table row.
    // Then, for each table row, you add a table cell.  You can do this with
    // two different calls to enter() and data(), or with two different loops.

    var rows = tbody.selectAll('tr')
      .data(data)
      .enter()
      .append('tr');

    // create a cell in each row for each column
    var cells = rows.selectAll('td')
      .data(function (row) {
        return tableHeaders.map(function (column) {
          return {column: column, value: row[column]};
        });
      })
      .enter()
      .append('td')
        .text(function (d) { return d.value; });


    // Then, add code to allow for brushing.  Note, this is handled differently
    // than the line chart and scatter plot because we are not using an SVG.
    // Look at the readme of the assignment for hints.
    // Note: you'll also have to implement linking in the updateSelection function
    // at the bottom of this function.
    // Remember that you have to dispatch that an object was highlighted.  Look
    // in linechart.js and scatterplot.js to see how to interact with the dispatcher.

    // HINT for brushing on the table: keep track of whether the mouse is down or up, 
    // and when the mouse is down, keep track of any rows that have been mouseover'd



    var clicked = 'third' 
    //clicked is my version of a 3 bit boolean that lets me keep track of what click we are
    //on for the table. The click number will help decide whether we clear the selection,
    //select the first out of the selection, or end the selection.
    d3.selectAll("tr")
    .on("mousedown", (d, i, elements) => {
      d3.select(elements[i]).classed("mouseover", true)
      if(clicked == 'first') {
        clicked = 'second'
      } else if(clicked == 'second') {
        clicked = 'third'
        for(x = 0; x < elements.length; x++) {
          d3.select(elements[x]).classed("mouseover", false)//clears the table
        }
        d3.select(elements[i]).classed("mouseover", true)
      } else {
        clicked = 'first'
        for(x = 0; x < elements.length; x++) {
          d3.select(elements[x]).classed("mouseover", false) //clears the table
        }
        d3.select(elements[i]).classed("mouseover", true)

      }
      let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
      
      // Let other charts know about our selection
      dispatcher.call(dispatchString, this, d3.selectAll(".mouseover").data());
    })
    .on("mouseover", (d,i,elements) => {
      if(clicked == 'first') {
        d3.select(elements[i]).classed("mouseover", true) //begin the selection
      }
      // Get the name of our dispatcher's event
      let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];

      // Let other charts know about our selection
      dispatcher.call(dispatchString, this, d3.selectAll(".mouseover").data());
    });
    
    

  return chart;
  }

  // Gets or sets the dispatcher we use for selection events
  chart.selectionDispatcher = function (_) {
    if (!arguments.length) return dispatcher;
    dispatcher = _;
    return chart;
  };

  // Given selected data from another visualization 
  // select the relevant elements here (linking)
  chart.updateSelection = function (selectedData) {
    if (!arguments.length) return;

    // Select an element if its datum was selected
    d3.selectAll('tr').classed("mouseover", d => {
      return selectedData.includes(d)
    });
  };

  return chart;
}
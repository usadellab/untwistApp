export function  linReg(x,y){
    var xArray = []
    var yArray = []
    var x_,y_;
    var xSum = 0;
    var ySum = 0;
    var xxSum = 0;
    var xySum = 0;
    var yySum = 0
    var r2;
    for (var i = 0; i < x.length-1; i ++) {
        x_ = parseFloat(x[i]);
        y_ = parseFloat(y[i]);
        xSum += x_
        ySum += y_
        xArray.push(x_);
        yArray.push(y_);
        xxSum += x_ * x_;
        xySum += x_ * y_;
        yySum += y_ * y_;
    }
    var count = xArray.length;
    var slope = (count * xySum - xSum * ySum) / (count * xxSum - xSum * xSum);
    var intercept = (ySum / count) - (slope * xSum) / count;
    // Generate values
    var xMax = Math.max(...xArray);
    var xMin = Math.min(...xArray);

    var xValues = [];
    var yValues = [];

    var increment = xMax/xArray.length;
    console.log(increment)
    // if(xMax >= 1){
    //     increment = 0.5
    // }else{
    //     increment = 1
    // }

    for (var x = xMin; x <= xMax; x += increment) {
    xValues.push(x);
    yValues.push(x * slope + intercept);
    }
    r2 = (Math.pow((count*xySum - xSum*ySum)/Math.sqrt((count*xxSum-xSum*xSum)*(count*yySum-ySum*ySum)),2)).toFixed(3);

    if(isNaN(r2)){
        alert(`Regression cannot be performed on string data, please choose numbers or floats data`)

        return {x:null, y:null, mode:"text" , text: `Regression cannot be performed on string data, please choose numbers or floats data`, } 

    }else{
        return {x:xValues, y:yValues, type : 'scatter', mode:"lines" ,//mode:"lines+text" ,
         text: `${r2} <br> y = ${slope.toFixed(3)}x + ${intercept.toFixed(3)} `, 
         xMin : xMin,
         xMax : xMax,
         
        //  textposition: 'top right', textfont: {
        //     family: 'sans serif',
        //     size: 18,
        //     color: 'blue'
        //   }, 

    }
}

}

function manhattanDistanceBetweenKeys(objects) {
  // Initialize an empty result array to store distances
  const distances = [];

  // Iterate through each pair of objects
  for (let i = 0; i < objects.length; i++) {
    const obj1 = objects[i];

    for (let j = i + 1; j < objects.length; j++) {
      const obj2 = objects[j];

      // Initialize the distance array for this pair of objects
      const distanceArray = [];

      // Calculate Manhattan distance between all keys in obj1 and obj2
      for (const key1 in obj1) {
        for (const key2 in obj2) {
          // Calculate the absolute difference between values for each key
          const value1 = obj1[key1];
          const value2 = obj2[key2];
          const keyDistance = Math.abs(value1 - value2);

          // Add the distance to the distance array
          distanceArray.push(keyDistance);
        }
      }

      // Store the distance array for this pair of objects
      distances.push(distanceArray);
    }
  }

  return distances;
}

export function createHeatmapTrace(selectedVars, inputData) {
  // Calculate the Manhattan distances only among the selected variables
  const distances = [];
  
  for (let i = 0; i < selectedVars.length; i++) {
    const row = [];
    for (let j = 0; j < selectedVars.length; j++) {
      const var1 = selectedVars[i];
      const var2 = selectedVars[j];
      let distance = 0;
      
      for (let k = 0; k < inputData.length; k++) {
        const obj = inputData[k];
        distance += Math.abs(obj[var1] - obj[var2]);
      }
      
      row.push(distance.toFixed(2));
    }
    distances.push(row);
  }

  // Create annotations for the heatmap
  const annotationText = selectedVars.map(variable => ({
    x: variable,
    y: variable,
    text: variable,
    showarrow: false,
  }));

  // Create the heatmap trace
  const heatmapTrace = {
    x: selectedVars,
    y: selectedVars,
    z: distances,
    type: 'heatmap',
    colorscale: 'Viridis',
    showscale: true,
    colorbar: {
      title: 'Distance',
      titleside: 'right',
    },
    annotations: annotationText,
  };

  return heatmapTrace;
}
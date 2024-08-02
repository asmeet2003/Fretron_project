
const express = require('express');
const cors = require('cors');
const turf = require('@turf/turf');

const app = express();
const port = 5000;

app.use(cors());


const flightPaths = [
  [[1, 1], [2, 2], [3, 3]],
  [[1, 1], [2, 4], [3, 2]],
  [[1, 1], [4, 2], [3, 4]]
];

 function detectAndAvoidIntersections(paths) {
  const adjustedPaths = [];
  const lineStrings = paths.map(path => turf.lineString(path));

  const adjustPath = (lineString, index) => {
    const adjustedPath = [...lineString.geometry.coordinates];
    let adjustmentApplied = false;

    for (let j = 0; j < lineStrings.length; j++) {
      if (index === j) continue;
      const otherLine = lineStrings[j];
      const intersections = turf.lineIntersect(lineString, otherLine);

      if (intersections.features.length > 0) {
         for (let k = 0; k < adjustedPath.length; k++) {
          adjustedPath[k] = [adjustedPath[k][0] + 0.2, adjustedPath[k][1] + 0.2];
        }
        adjustmentApplied = true;
      }
    }

    return adjustmentApplied ? turf.lineString(adjustedPath) : lineString;
  };

  lineStrings.forEach((lineString, index) => {
    adjustedPaths.push(adjustPath(lineString, index).geometry.coordinates);
  });

  return adjustedPaths;
}

app.get('/api/flight-paths', (req, res) => {
  const adjustedPaths = detectAndAvoidIntersections(flightPaths);
  res.json(adjustedPaths);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


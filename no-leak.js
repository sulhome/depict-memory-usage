var fs = require('fs');
var path = require('path');
var memwatch = require('memwatch-next');
var randomstring = require('randomstring');

var memwatchStats = [];

function setLargeObject() {
    var currentTime = (new Date()).toLocaleTimeString();
    var randomText = randomstring.generate(getRandomNumber(1,5));
    var largeObject = {
        longString: new Array(1000 * 1000).join(randomText),
        printTime: function () {
            console.log(currentTime);
        }
    };
    largeObject.printTime();
}

function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

setInterval(setLargeObject, 1000);
memwatch.on('stats', function(stats) {
    stats.time = Date.now();    
    memwatchStats.push(stats);
 });

 setTimeout(function() {
     fs.writeFileSync(path.resolve('mem-stats','no-leak-data.json'), JSON.stringify(memwatchStats));
     console.log('end of processing');
     process.exit(0);
 }, 120 * 1000);
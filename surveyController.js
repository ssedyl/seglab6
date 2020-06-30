// required packages
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var fs = require('fs');

// read the data file
function readData(fileName){
    let dataRead = fs.readFileSync('./data/' + fileName + '.json');
    let infoRead = JSON.parse(dataRead);
    return infoRead;
}

function readInfo(){
    let dataRead = fs.readFileSync('data/surveydata.json');
    let infoRead = JSON.parse(dataRead);
    return infoRead;
}
// read the data file
function writeData(info, fileName){
    data = JSON.stringify(info);
    fs.writeFileSync('./data/' + fileName + '.json', data);
}

function updateFile(info){
    let dataRead = fs.readFileSync('data/surveydata.json');
    let infoRead = JSON.parse(dataRead);
    infoRead.push(info);

    data = JSON.stringify(infoRead);
    fs.writeFileSync('data/surveydata.json', data);
}





//get number of males
function getNumberOfMales(arr){
    let count = 0;
    for(let i = 0; i < arr.length; i++){
        if(arr[i].gender == 'male'){
            count++;
        }
    }
    return count;
}
//get number of females
function getNumberOfFemales(arr){
    let count = 0;
    for(let i = 0; i < arr.length; i++){
        if(arr[i].gender == 'female'){
            count++;
        }
    }
    return count;
}

//get number of other
function getNumberOfOther(arr){
    let count = 0;
    for(let i = 0; i < arr.length; i++){
        if(arr[i].gender == 'other'){
            count++;
        }
    }
    return count;
}


// This is the controler per se, with the get/post
module.exports = function(app){

    // when a user goes to localhost:3000/analysis
    // serve a template (ejs file) which will include the data from the data files
    app.get('/analysis', function(req, res){
        var infoToDisplay = readInfo();
        
        var numberOfMales = getNumberOfMales(infoToDisplay);
        var numberOfFemales = getNumberOfFemales(infoToDisplay);
        var numberOfOther = getNumberOfOther(infoToDisplay);
        res.render('showResults', {results: infoToDisplay, 
                                numMales: numberOfMales,
                                numFemales: numberOfFemales,
                                numOther: numberOfOther
                                });
        console.log([infoToDisplay]);
    });

    // when a user goes to localhost:3000/niceSurvey
    // serve a static html (the survey itself to fill in)
    app.get('/niceSurvey', function(req, res){
        res.sendFile(__dirname+'/views/niceSurvey.html');
    });

    // when a user types SUBMIT in localhost:3000/niceSurvey 
    // the action.js code will POST, and what is sent in the POST
    // will be recuperated here, parsed and used to update the data files
    app.post('/niceSurvey', urlencodedParser, function(req, res){
        console.log(req.body);
        var json = req.body;
        updateFile(json);
        // for (var key in json){
        //     console.log(key + ": " + json[key]);
        //     // in the case of checkboxes, the user might check more than one
        //     if ((key === "color") && (json[key].length === 2)){
        //         for (var item in json[key]){
        //             combineCounts(key, json[key][item]);
        //         }
        //     }
        //     else {
        //         combineCounts(key, json[key]);
        //     }
        // }
        // mystery line... (if I take it out, the SUBMIT button does change)
        // if anyone can figure this out, let me know!
        res.sendFile(__dirname + "/views/niceSurvey.html");
    });
    

};
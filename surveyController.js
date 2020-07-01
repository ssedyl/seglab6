// required packages
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var fs = require('fs');
const { info } = require('console');

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

function getFrequency(arr){
    let daily = 0;
    let weekly = 0;
    let monthly = 0;
    let yearly = 0;
    let never = 0;
    for(let i = 0; i < arr.length; i++){
        if(arr[i].howoften == 'daily'){
            daily++;
        } else if(arr[i].howoften == 'monthly'){
            monthly++;
        } else if(arr[i].howoften == 'yearly'){
            yearly++;
        } else if(arr[i].howoften == 'weekly'){
            weekly++;
        } else {
            never++;
        }
    }
    let res = {dailyFreq: daily, weeklyFreq: weekly, monthlyFreq:monthly, yearlyFreq: yearly, neverFreq: never};
    return res;
}

function getSiteSurvey(arr){
    let easy = 0;
    let useful = 0;
    let color = 0;
    let easynav = 0;
    for(let i = 0; i < arr.length; i++){
        let sur = arr[i].siteSurvey;
        console.log("length of site survey for survey " + i + " is: " + sur.length);
        console.log("this site survey contains: " + sur);
        console.log("type: " + typeof(sur));

        if(sur instanceof Object){
            for(let j = 0; j < sur.length; j++){
                if(sur[j] == 'easyToUse'){
                    easy++;
                } else if(sur[j] == 'infoGood'){
                    useful++;
                } else if(sur[j] == 'colorScheme'){
                    color++;
                } else if(sur[j] == 'navigationEasy'){
                    easynav++;
                }
            }
        } else {
            if(sur == 'easyToUse'){
                easy++;
            } else if(sur == 'infoGood'){
                useful++;
            } else if(sur == 'colorScheme'){
                color++;
            } else if(sur == 'navigationEasy'){
                easynav++;
            }
        }
    }
    let res = {easyFreq: easy, usefulFreq: useful, colorFreq: color, easynavFreq: easynav};
    return res;
}

function getImprovementAverage(arr){
    let count = 0;
    for(let i = 0; i < arr.length; i++){
        count += parseInt(arr[i].needsImprovement);
    }
    let avg = 0;
    avg = (count / arr.length).toFixed(2);
    return avg;
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
        var freqVisit = getFrequency(infoToDisplay);
        var siteSurveyRes = getSiteSurvey(infoToDisplay);
        var avgRes = getImprovementAverage(infoToDisplay);
        res.render('showResults', {results: infoToDisplay, 
                                numMales: numberOfMales,
                                numFemales: numberOfFemales,
                                numOther: numberOfOther,
                                numVisit: freqVisit,
                                sitesurveyresults: siteSurveyRes,
                                impAvg: avgRes
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

        // mystery line... (if I take it out, the SUBMIT button does change)
        // if anyone can figure this out, let me know!
        res.sendFile(__dirname + "/views/niceSurvey.html");
    });
    

};
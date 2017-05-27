const https = require('https');
const http = require('http');

function printMessage(userName, badgeCount, points){
	const message = `${userName} has ${badgeCount} total badge(s) and ${points} points in JavaScript`;
	console.log(message);
}

function get(userName){
	try{
		const request = https.get(`https://teamtreehouse.com/${userName}.json`, response => {
			if(response.statusCode == 200){
				let body = "";
				response.on('data', data=>{
					body += data.toString();
				});
				response.on('end', ()=>{
					try{
						const prObj = JSON.parse(body);
						printMessage(prObj.name, prObj.badges.length, prObj.points.JavaScript);
					}catch(error){
						printError(error);
					}
				});
			}else{
				const message = `There was an error getting the profile for ${userName} (${http.STATUS_CODES[response.statusCode]})`;
				const statusCodeError = new Error(message);
				printError(statusCodeError);
			}
		});

		request.on('error', printError);
	}catch(error){
		printError(error);
	}
}

function printError(error){
	console.error(error.message);
}

module.exports.get = get;
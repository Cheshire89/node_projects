const https = require('https');
const http = require('http');
const api = require('./api.json');

function printWeather(weather){
	try{
		const message = `Current temperature in ${weather.location.city} is ${weather.current_observation.temp_c}C`;
		console.log(message);
	}catch(error){
		printError(error);
	}
}

function get(query){
	const readableQuery = query.replace('_', ' ');
	try{
		const request = https.get(`https://api.wunderground.com/api/${api.key}/geolookup/conditions/q/${query}.json`, response => {
			if(response.statusCode == 200){
					let body = "";
					response.on('data', chunk=>{
						body += chunk;
					});
					response.on('end', ()=>{
				        try {
	                        const weather = JSON.parse(body);
	                        
	                        if (weather.location) {
	                            printWeather(weather);
	                        } else {
	                            const queryError = new Error(`The location "${readableQuery}" was not found.`);
	                            printError(queryError);
	                        }
	                    } catch (error) {
	                        printError(error);
	                    }
					});
			}else{
				const message = `There was and error getting weather data for "${readableQuery}" (${http.STATUS_CODES[response.statusCode]})`;
				const error = new Error(message);
				printError(error);
			}
		});
	}catch(error){
		printError(error);
	}
}

function printError(error){
	console.log(error.message);
}

module.exports.get = get;

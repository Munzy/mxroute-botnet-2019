"use strict";

const lineReader = require('line-reader');
const https = require('https');

function get(URL, callback){

    https.get(URL, function(res){

        // Create our data holder
        var response = '';

        // Append
        res.on('data', function(chunk){

            // Append to reponse
            response += chunk;

        });

        res.on('end', function(){

            try {

                var data = JSON.parse(response);
                callback(data);

            }
            catch(e){

                get(URL, callback);                

            }
            

        });

    
    })

    // Catch all errors
    .on('error', function(err){

        get(URL, callback);
    
    });
    

}


function asn(ip, callback){

    var URL = 'https://ip2asn.ipinfo.app/lookup/' + ip;

    get(URL, function(data){

        callback(data.announcedBy);

    });


}


var report = new Array();
function reader(){

    lineReader.eachLine('botnet.txt', function(ip){

        asn(ip, function(asn){

            asn = asn.reverse();

            if(asn && asn[0] && asn[0].asn){

                console.log('"' + ip + '", "' + asn[0].asn + '", "' + asn[0].name + '", "' + asn[0].subnet + '"');

            }   

        });


    });

}


console.log('"' + 'IP Address' + '", "' + 'AS Number' + '", "' + 'AS Name' + '", "' + 'CIDR' + '"');
reader();
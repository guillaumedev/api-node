module.exports = {
  sendNotif: function (messageContent, title, regId, idMessage) {
    var gcm = require('node-gcm');

	var message = new gcm.Message();

	//API Server Key
	var sender = new gcm.Sender('AIzaSyAoSYF3et5d_3McIYpF6Jh2rBZoPdW-5iM');
	var registrationIds = [];

	// Value the payload data to send...
	message.addData('message',messageContent);
	message.addData('title',title);
	message.addData('idMessage',idMessage);
	//message.addData('msgcnt','3'); // Shows up in the notification in the status bar
	message.addData('soundname','beep.wav'); //Sound to play upon notification receipt - put in the www folder in app
	//message.collapseKey = 'demo';
	//message.delayWhileIdle = true; //Default is false
	message.timeToLive = 4000;// Duration in seconds to hold in GCM and retry before timing out. Default 4 weeks (2,419,200 seconds) if not specified.

	// At least one reg id required
	registrationIds.push(regId);

	/**
	* Parameters: message-literal, registrationIds-array, No. of retries, callback-function
	*/
	sender.send(message, registrationIds, 4, function (result) {
	   console.log(messageContent);
	});
  }
};
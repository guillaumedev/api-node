var models = require("../models");
var notif = require('../controllers/notif');
var tabGames=[];
tabGames[1]="QuestionMe";
tabGames[2]="Mémo";
tabGames[3]="Affinity";


exports.connection = function(socket, connectTab, server, io, token, id) {
    models.sequelize.query('SELECT id from Users where id=:id and tokenUser =:token;', null, {raw: true}, { id: id, token: token }).success(function(myTableRows) {
     //sequelize.query('SELECT * FROM projects WHERE status = :status ', null, {raw: true}, { status: 'active' }).success(function(projects) {

        if(myTableRows[0]){
             //var io = require('socket.io')(server);
             socket.on('position', function (data) {
                connectTab[data.id] = socket.id;
                //models.sequelize.query('UPDATE Users set connected=2, lat = ' + data.latitude + ', lng = ' + data.longitude + ' WHERE id = ' + data.id + ';');
                models.sequelize.query('UPDATE Users set connected=2, lat =:lat, lng =:lng WHERE id =:id;', null, {raw: true}, { lat: data.latitude, lng: data.longitude, id: id});

                var nearUsers = new Array;
                var sentDefy = new Array;
                var receivedDefy = new Array;

                models.sequelize.query('SELECT users.id, username, connected, numMeeter,ROUND(6372.795477598 * ACOS(sin(RADIANS(:lat)) * sin(RADIANS(lat)) + COS(RADIANS(:lat)) * COS(RADIANS(lat)) * COS(RADIANS(:lng) - RADIANS(lng))) * 1000,0)  AS distance,pathMeeter FROM Users left join Meeters on numMeeter=Meeters.id WHERE Users.id != :id AND lat is not NULL ORDER BY connected desc, distance asc LIMIT 10;', null, {raw: true}, { lat: data.latitude, lng: data.longitude, id: id}).success(function(myTableRows) {
                    for (var id in myTableRows) {
                        var value = myTableRows[id].distance;
                        nearUsers.push({'nUser':myTableRows[id].id, 'pseudoUser':myTableRows[id].username, 'distanceUser':value, 'numMeeter':myTableRows[id].numMeeter, 'connected':myTableRows[id].connected});
                    }
                    models.sequelize.query('SELECT users.id, username, connected, numMeeter, nGame FROM defy join users on defy.idUser2= users.id WHERE idUser1 =:id ORDER BY connected desc;', null, {raw: true}, { id: data.id}).success(function(myTableRows) {
                        for (var id in myTableRows) {
                            sentDefy.push({'nUser':myTableRows[id].id, 'pseudoUser':myTableRows[id].username, 'numMeeter':myTableRows[id].numMeeter, 'connected':myTableRows[id].connected, 'nGame':myTableRows[id].nGame});
                        }

                        models.sequelize.query('SELECT users.id, username, connected, numMeeter, nGame FROM defy join users on defy.idUser1= users.id WHERE idUser2 =:id ORDER BY connected desc;', null, {raw: true}, { id: data.id}).success(function(myTableRows) {
                            for (var id in myTableRows) {
                                receivedDefy.push({'nUser':myTableRows[id].id, 'pseudoUser':myTableRows[id].username, 'numMeeter':myTableRows[id].numMeeter, 'connected':myTableRows[id].connected, 'nGame':myTableRows[id].nGame});
                            }
                            var data = {
                                'tabPlayers':nearUsers,
                                'tabPlayersDefied':sentDefy,
                                'tabPlayersDefy':receivedDefy
                            }
                            socket.emit('tabUsers', data);
                        });
                    });
                });
            });


            socket.on('test', function (data){
                socket.emit('testReceive', data);
            });

            socket.on('defyUser', function (data) {
                console.log('defi');
                var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
                models.sequelize.query('SELECT * from defy WHERE idUser1 =:nUser AND idUser2 =:nUserDefy;', null, {raw: true}, { nUser: data.nUser, nUserDefy: data.nUserDefy}).success(function(myTableRows) {
                    if(myTableRows.length == 0){
                        models.sequelize.query('INSERT INTO defy (idUser1, idUser2, nGame, stateGame, createdAt) values (:nUser, :nUserDefy,:nGame,0,"'+ date+'");', null, {raw: true}, { nUser: data.nUser, nUserDefy: data.nUserDefy, nGame:data.nGame});
                        models.sequelize.query('SELECT regId from users WHERE id =:nUserDefy ;', null, {raw: true}, { nUserDefy: data.nUserDefy}).success(function(myTableRows) {
                            socket.broadcast.to(connectTab[data.nUserDefy]).emit('userDefy', {"nUser":data.nUser,"pseudoUser":data.pseudoUser,"nGame":data.nGame, "numMeeter":data.numMeeter, "distanceUser":data.distanceUser});

                            nameGame=tabGames[data.nGame];
                            regId=myTableRows[0].regId;
                            messageContent = data.pseudoUser+" veut jouer au "+nameGame+" avec vous !";
                            title= "Defi reçu !";
                            idMessage=1;//defi lance
                            notif.sendNotif(messageContent, title, regId, idMessage);
                        });
                    }
                });
            });

            socket.on('acceptDefy', function (data) {
                models.sequelize.query('SELECT id from defy WHERE idUser1 =:nUserDefy AND idUser2 =:id;', null, {raw: true}, { nUserDefy: data.nUserDefy, id: data.id}).success(function(myTableRows) {
                    if(myTableRows[0].id !=0){
                        createNamespace(data, io);
                        models.sequelize.query('DELETE from defy where idUser1 =:nUserDefy', null, {raw: true}, { nUserDefy: data.nUserDefy});
                        models.sequelize.query('DELETE from defy where idUser2 =:id', null, {raw: true}, { id: data.id});
                        models.sequelize.query('UPDATE Users set connected=1 WHERE id =:id OR id =:nUserDefy;', null, {raw: true}, { id: data.id, nUserDefy: data.nUserDefy});

                        models.sequelize.query('SELECT regId from users WHERE id =:nUser ;', null, {raw: true}, { nUser: data.nUserDefy}).success(function(myTableRows) {

                            nameGame=tabGames[data.nGame];
                            regId=myTableRows[0].regId;
                            messageContent = data.pseudo+" a accepté de jouer au "+nameGame+" avec vous !";
                            title= "Defi accepté !";
                            idMessage=2;//defi accepte
                            notif.sendNotif(messageContent, title, regId, idMessage);

                            socket.broadcast.to(connectTab[data.nUserDefy]).emit('defyAccepted', {"roomName":'/game'+data.nGame+'/'+data.id+'_'+data.nUserDefy, "nGame":data.nGame, "numMeeter":data.numMeeter, "pseudo":data.pseudo, "id":data.id});
                            //socket.emit('defySynchro', data.nGame);
                            // delete connectTab[data.id];
                            // delete connectTab[data.nUserDefy];
                        });

                    } else {
                        models.sequelize.query('DELETE from defy where idUser1 =:nUserDefy AND idUser2 =:nUser', null, {raw: true}, { nUserDefy: data.nUserDefy, nUser: data.nUser});
                        socket.emit('erreurSynchro', "Le defi n'a pas pu être validé");
                    }

                }).error(function(err) {
                    socket.emit('erreurSynchro', "Le defi n'a pas pu être validé");
                });
            });


            socket.on('declineDefy', function (data) {
                console.log('defirefuse');
                models.sequelize.query('DELETE from defy where idUser1 =:nUserDefy AND idUser2 =:nUser', null, {raw: true}, { nUserDefy: data.nUserDefy, nUser: data.nUser});
                socket.broadcast.to(connectTab[data.nUserDefy]).emit('defyRefused', data);
            });

            socket.on('confirmDefy', function (data){
                console.log('defi confirme');
                socket.broadcast.to(connectTab[data.nUserDefy]).emit('defyConfirmed', data);
                delete connectTab[data.nUser];
                delete connectTab[data.nUserDefy];
            });

            socket.on('cancelDefy', function (data){
                socket.broadcast.to(connectTab[data.nUserDefy]).emit('defyCancelled', data);
            });

            socket.on('closeSocket', function (data){
                id = data;
            });

            socket.on('disconnect', function (data) {
                            // delete connectTab[socket.handshake.query.token];
                models.sequelize.query('UPDATE Users set connected=2 WHERE tokenUser =:token;', null, {raw: true}, { token: socket.handshake.query.token});
                console.log('disconnected');
            });

            socket.on('disconnectClick', function (data) {
                delete connectTab[socket.handshake.query.token];
                models.sequelize.query('UPDATE Users set connected=0 WHERE tokenUser =:token;', null, {raw: true}, { token: socket.handshake.query.token});
                console.log('disconnected');
            });
        }
        else{
            console.log('gros con t\' changé d\'id');
            socket.disconnect();
        }
    });
};

function createNamespace(data, io){
    console.log('defiaccepte  /game'+data.nGame+'/'+data.id+'_'+data.nUserDefy);
    delete io.nsps['/game'+data.nGame+'/'+data.id+'_'+data.nUserDefy];
    var custom = io.of('/game'+data.nGame+'/'+data.id+'_'+data.nUserDefy).on('connection', function(socket) {

        socket.on('checkSocket', function (data){
            var numberOfClients = custom.sockets.length;
            if(numberOfClients == 2){
                custom.emit('namespaceSuccess', "Connection Success");
            } else if (numberOfClients == 1){
                //custom.emit('namespaceSuccess', "Connection Success");
            } else {
                //custom.emit('namespaceSuccess', "Connection Success");
            }
        });

        socket.on('disconnect', function (data) {
            console.log('Player Leave Game');
            custom.emit('playerDisconnected');
        });


        models.sequelize.query('SELECT id from Users where id=:id and tokenUser =:token;', null, {raw: true}, { id: socket.handshake.query.id, token: socket.handshake.query.token}).success(function(myTableRows) {
        //console.log('l\'id est' + myTableRows[0]);
        if(myTableRows[0]){
            var user1 = data.id;
            var user2 = data.nUserDefy;

            var firstUserMeetCode = 0;

            /** CHAT **/
            socket.on('sendMessage', function (data){
                custom.emit('receiveMessage', data);
            });

            socket.on('meetCode', function(data){
                var playerNumber;
                if(user1 == data.id){
                    var meetCode =  Math.floor((Math.random() * 99999) + 1);
                    socket.emit('getMeetCode', meetCode);
                }
                else{
                    socket.emit('getNoMeetCode', "");
                }
            });

            socket.on('testMeetCode', function(data){
                socket.broadcast.emit('getTestMeetCode', data);
            });

            socket.on('meetCodeResult', function(data){
                socket.broadcast.emit('getResultMeetCode', data);
            });


            /** MEMO **/
            socket.on('launchMemo', function (data){
                var playerNumber;
                if(user1 == data.id){
                    playerNumber = 1;
                    color = "Red";
                }
                else{
                    playerNumber = 2;
                    color = "Yellow";
                }

                var newData = {
                    'id':data.id,
                    'pseudo':data.pseudo,
                    'rank':playerNumber,
                    'score':0,
                    'color': color
                }

                socket.emit('numUser', newData);
                if(playerNumber == 2){
                    var tabMeeter = [];
                    var tempTabMeeter = [];
                    var finalTabMeeter = [];
                    var lineIncrement = 0;
                    var row = 0;
                    models.sequelize.query('SELECT * from Meeters where publicMeeter != 0 order by RAND() limit 15').success(function(myTableRows) {
                        for (var id in myTableRows) {
                            var value = myTableRows[id];
                            tabMeeter.push({'data':value});
                            tabMeeter.push({'data':value});
                        }
                        tabMeeter = shuffleArray(tabMeeter);
                        for (var id in tabMeeter){
                            if(lineIncrement>=5){
                                finalTabMeeter.push(tempTabMeeter);
                                tempTabMeeter = [];
                                lineIncrement = 0;
                                row++;
                            }
                            var value = tabMeeter[id];
                            var nImage="nImage";
                            var imageUrl="imageUrl";
                            tempTabMeeter.push({nImage:value.data.id, imageUrl:value.data.pathMeeter});
                            lineIncrement++;

                        }
                        finalTabMeeter.push(tempTabMeeter);
                        custom.emit('getArrayMemo', finalTabMeeter);
                    });

                }

                });

                socket.on('sendCard', function (data){
                    custom.emit('receiveCard', data);
                });

                //** QUESTION ME **/
                socket.on('getQuestion', function(data){
                    var questions = new Array;
                    models.sequelize.query('SELECT * from questionMe limit 5').success(function(myTableRows) {
                        for (var id in myTableRows) {
                            var value = myTableRows[id];
                            questions.push({'data':value});
                        }
                        socket.emit('receiveQuestion', questions);
                    });
                });

                socket.on('answerQuestion', function(data){
                    for(var answer in data.answers){
                       models.sequelize.query('INSERT INTO answerToQuestionMe (idUser, idQuestion, answer) values (:userId,:id,:textAnswer)', null, {raw: true}, { userId: data.userId, id: data.answers[answer].id, textAnswer:data.answers[answer].textAnswer}).success(function() {
                        return true;
                    });
                   }

                   custom.emit('transferQuestion', data);
               });

                socket.on('getResult', function (data){
                    custom.emit('sendResult', questions);
                });

                //** Draw Something **/
                socket.on('getWord', function (data){
                    models.sequelize.query('SELECT word from drawsmt order by RAND() limit 1').success(function(word) {
                        socket.emit('setWord', word[0].word);
                    });
                });

                socket.on('sendDraw', function (data){
                    socket.broadcast.emit('receiveDraw', data);
                });

                socket.on('sendAnswer', function (data){
                    socket.broadcast.emit('receiveAnswer', data);
                });

            }
            else{

            }
        });
    });
}



function shuffleArray(array) {
    var currentIndex = array.length, temporaryValue, randomIndex ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
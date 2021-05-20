

function generateUserActor() {
    var smqUser = {
    };
    
    smqUser.defer = function() {
        var deferred = {
            promise: null,
            resolve: null,
            reject: null
        };
        
        deferred.promise = new Promise((resolve, reject) => {
            deferred.resolve = resolve;
            deferred.reject = reject;
        });
        
        return deferred;
    }

    smqUser.connect = function (virtualHost, username, password, on_received, after_connect) {
        console.warn('set `smqUser.showPingPongs = true` to get verbose logging.');
        smqUser.virtualHost = virtualHost;
        smqUser.username = username;
        smqUser.password = password;
        smqUser.rabbitEndpoint = smqUser.rabbitEndpoint || window.rabbitEndpoint || 'ws://sassymq.anabstractlevel.com:15674/ws';
        smqUser.User_all_connection = {};
        smqUser.messages = [];
        smqUser.waitingReply = [];
        
        smqUser.client = Stomp.client(smqUser.rabbitEndpoint);

        smqUser.client.debug = function (m, p) {
            if (((m == ">>> PING") || (m == "<<< PONG")) && !smqUser.showPingPongs) return;
            else {
                if (m == "<<< ") delete m;
                let data = p || m || "STRING"; 
                let indexOfContentLength = data.indexOf("content-length:");
                let dataStart = data.indexOf("\n\n");
                if ((dataStart > indexOfContentLength) && (indexOfContentLength > 1)) {
                    data = (data.substring(dataStart, data.length - 1) || '');
                    if (data.startsWith('"')) data = data.substring(1);
                    if (data.endsWith('"')) data = data.substring(0, data.length - 1);
                    data = data.substring(data.indexOf('{'));
                    data = data.substring(0, data.lastIndexOf('}') + 1);
                    try {
                        data = JSON.parse(data);
                        if (data.AccessToken) data.AccessToken = 'ay_******xyz';
                    } catch(ex) {
                        console.error('ERROR PARSING DATA for debug output', ex, data);
                    }
                    m = m.substring(0, m.indexOf('\n\n'));
                }
                console.log("DEBUG: ", m, data || p); 
            }
        }

        smqUser.checkMessage = function(msg) {
            
               
        }

        var on_connect = function (x) {
            smqUser.User_all_connection = smqUser.client.subscribe("/exchange/user.all/#",
                    function (d) {
                        if (d.body) d.body = JSON.parse(d.body);
                        smqUser.messages.push(d);
                        smqUser.checkMessage(d);
                        if (on_received) on_received(d);
                        if (smqUser.showPingPongs) console.log('      --------  MESSAGE FOR smqUser: ', d);
                    }, {
                        durable: false,
                        requeue: true
                    });
            smqUser.client.onreceive =  function (d) {
                        var body = JSON.parse(d.body);
                        var corrID = d.headers["correlation-id"];
                        var waitingDeferred = smqUser.waitingReply[corrID];

                        if (waitingDeferred && body.IsHandled) {
                            delete smqUser.waitingReply[corrID];
                            if (body && body.ErrorMessage) console.error("ERROR RECEIVED: " + body.ErrorMessage);
                            waitingDeferred.resolve(body, d);
                        }
                    };
                    if (after_connect) after_connect(x);
                };

        var on_error = function (frame) {
            frame = frame || { 'error': 'unspecified error' };
            console.error('ERROR On STOMP Client: ', frame.error, frame);
        };

        console.log('connecting to: ' + smqUser.rabbitEndpoint + ', using ' + username + '/' + password);
        smqUser.client.connect(smqUser.username, smqUser.password, on_connect, on_error, smqUser.virtualHost);
    };

    smqUser.disconnect = function() {
        if (smqUser && smqUser.client) 
        {
            smqUser.client.disconnect();
        }
    }

    smqUser.stringifyValue = function(value) {
        if (!value) value = '{}';
            if (typeof value == 'object') {
                value = JSON.stringify(value);
            }
        return value;
    };
    
    smqUser.sendReply = function(replyPayload, msg) {
        if (replyPayload && msg && msg.headers && msg.headers['reply-to']) {
            replyPayload.IsHandled = true;
            smqUser.client.send(msg.headers['reply-to'], 
                        { "content-type": "application/json", 
                          "reply-to":"/temp-queue/response-queue", 
                          "correlation-id":msg.headers['correlation-id'] 
                        }, JSON.stringify(replyPayload));
        }
    };

    
        
        smqUser.waitFor = function (id) {
            setTimeout(function () {
                var waiting = smqUser.waitingReply[id];
                if (waiting) {
                    waiting.reject("Timed out waiting for reply");
                }
            }, 30000)
        }
        
        smqUser.createUUID = function() {
          function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
          }
          return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        }


        
        smqUser.GetAllSegments = function() {
            smqUser.GetAllSegments('{}');
        }

        smqUser.GetAllSegments = function(payload) {
            payload = smqUser.stringifyValue(payload);
            var id = smqUser.createUUID();
            var deferred = smqUser.waitingReply[id] = smqUser.defer();
            if (smqUser.showPingPongs) console.log('Get All Segments - ');
            smqUser.client.send('/exchange/usermic/crudcoordinator.crud.user.getallsegments', { "content-type": "text/plain", "reply-to":"/temp-queue/response-queue", "correlation-id":id }, payload);
            
            smqUser.waitFor(id);
            
            return deferred.promise;
        }
        
        smqUser.UpdateAllSegment = function() {
            smqUser.UpdateAllSegment('{}');
        }

        smqUser.UpdateAllSegment = function(payload) {
            payload = smqUser.stringifyValue(payload);
            var id = smqUser.createUUID();
            var deferred = smqUser.waitingReply[id] = smqUser.defer();
            if (smqUser.showPingPongs) console.log('Update All Segment - ');
            smqUser.client.send('/exchange/usermic/crudcoordinator.crud.user.updateallsegment', { "content-type": "text/plain", "reply-to":"/temp-queue/response-queue", "correlation-id":id }, payload);
            
            smqUser.waitFor(id);
            
            return deferred.promise;
        }
        
        smqUser.AddComment = function() {
            smqUser.AddComment('{}');
        }

        smqUser.AddComment = function(payload) {
            payload = smqUser.stringifyValue(payload);
            var id = smqUser.createUUID();
            var deferred = smqUser.waitingReply[id] = smqUser.defer();
            if (smqUser.showPingPongs) console.log('Add Comment - ');
            smqUser.client.send('/exchange/usermic/crudcoordinator.crud.user.addcomment', { "content-type": "text/plain", "reply-to":"/temp-queue/response-queue", "correlation-id":id }, payload);
            
            smqUser.waitFor(id);
            
            return deferred.promise;
        }
        
        smqUser.GetComments = function() {
            smqUser.GetComments('{}');
        }

        smqUser.GetComments = function(payload) {
            payload = smqUser.stringifyValue(payload);
            var id = smqUser.createUUID();
            var deferred = smqUser.waitingReply[id] = smqUser.defer();
            if (smqUser.showPingPongs) console.log('Get Comments - ');
            smqUser.client.send('/exchange/usermic/crudcoordinator.crud.user.getcomments', { "content-type": "text/plain", "reply-to":"/temp-queue/response-queue", "correlation-id":id }, payload);
            
            smqUser.waitFor(id);
            
            return deferred.promise;
        }
        

    return smqUser;
}

                    
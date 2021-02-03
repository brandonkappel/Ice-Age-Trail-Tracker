

function generateAdminActor() {
    var smqAdmin = {
    };
    
    smqAdmin.defer = function() {
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

    smqAdmin.connect = function (virtualHost, username, password, on_received, after_connect) {
        console.warn('set `smqAdmin.showPingPongs = true` to get verbose logging.');
        smqAdmin.virtualHost = virtualHost;
        smqAdmin.username = username;
        smqAdmin.password = password;
        smqAdmin.rabbitEndpoint = smqAdmin.rabbitEndpoint || window.rabbitEndpoint || 'ws://sassymq.anabstractlevel.com:15674/ws';
        smqAdmin.Admin_all_connection = {};
        smqAdmin.messages = [];
        smqAdmin.waitingReply = [];
        
        smqAdmin.client = Stomp.client(smqAdmin.rabbitEndpoint);

        smqAdmin.client.debug = function (m, p) {
            if (((m == ">>> PING") || (m == "<<< PONG")) && !smqAdmin.showPingPongs) return;
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

        smqAdmin.checkMessage = function(msg) {
            
               
        }

        var on_connect = function (x) {
            smqAdmin.Admin_all_connection = smqAdmin.client.subscribe("/exchange/admin.all/#",
                    function (d) {
                        if (d.body) d.body = JSON.parse(d.body);
                        smqAdmin.messages.push(d);
                        smqAdmin.checkMessage(d);
                        if (on_received) on_received(d);
                        if (smqAdmin.showPingPongs) console.log('      --------  MESSAGE FOR smqAdmin: ', d);
                    }, {
                        durable: false,
                        requeue: true
                    });
            smqAdmin.client.onreceive =  function (d) {
                        var body = JSON.parse(d.body);
                        var corrID = d.headers["correlation-id"];
                        var waitingDeferred = smqAdmin.waitingReply[corrID];

                        if (waitingDeferred && body.IsHandled) {
                            delete smqAdmin.waitingReply[corrID];
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

        console.log('connecting to: ' + smqAdmin.rabbitEndpoint + ', using ' + username + '/' + password);
        smqAdmin.client.connect(smqAdmin.username, smqAdmin.password, on_connect, on_error, smqAdmin.virtualHost);
    };

    smqAdmin.disconnect = function() {
        if (smqAdmin && smqAdmin.client) 
        {
            smqAdmin.client.disconnect();
        }
    }

    smqAdmin.stringifyValue = function(value) {
        if (!value) value = '{}';
            if (typeof value == 'object') {
                value = JSON.stringify(value);
            }
        return value;
    };
    
    smqAdmin.sendReply = function(replyPayload, msg) {
        if (replyPayload && msg && msg.headers && msg.headers['reply-to']) {
            replyPayload.IsHandled = true;
            smqAdmin.client.send(msg.headers['reply-to'], 
                        { "content-type": "application/json", 
                          "reply-to":"/temp-queue/response-queue", 
                          "correlation-id":msg.headers['correlation-id'] 
                        }, JSON.stringify(replyPayload));
        }
    };

    
        
        smqAdmin.waitFor = function (id) {
            setTimeout(function () {
                var waiting = smqAdmin.waitingReply[id];
                if (waiting) {
                    waiting.reject("Timed out waiting for reply");
                }
            }, 30000)
        }
        
        smqAdmin.createUUID = function() {
          function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
          }
          return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        }


        
        smqAdmin.AddUser = function() {
            smqAdmin.AddUser('{}');
        }

        smqAdmin.AddUser = function(payload) {
            payload = smqAdmin.stringifyValue(payload);
            var id = smqAdmin.createUUID();
            var deferred = smqAdmin.waitingReply[id] = smqAdmin.defer();
            if (smqAdmin.showPingPongs) console.log('Add User - ');
            smqAdmin.client.send('/exchange/adminmic/crudcoordinator.crud.admin.adduser', { "content-type": "text/plain", "reply-to":"/temp-queue/response-queue", "correlation-id":id }, payload);
            
            smqAdmin.waitFor(id);
            
            return deferred.promise;
        }
        
        smqAdmin.GetUsers = function() {
            smqAdmin.GetUsers('{}');
        }

        smqAdmin.GetUsers = function(payload) {
            payload = smqAdmin.stringifyValue(payload);
            var id = smqAdmin.createUUID();
            var deferred = smqAdmin.waitingReply[id] = smqAdmin.defer();
            if (smqAdmin.showPingPongs) console.log('Get Users - ');
            smqAdmin.client.send('/exchange/adminmic/crudcoordinator.crud.admin.getusers', { "content-type": "text/plain", "reply-to":"/temp-queue/response-queue", "correlation-id":id }, payload);
            
            smqAdmin.waitFor(id);
            
            return deferred.promise;
        }
        
        smqAdmin.UpdateUser = function() {
            smqAdmin.UpdateUser('{}');
        }

        smqAdmin.UpdateUser = function(payload) {
            payload = smqAdmin.stringifyValue(payload);
            var id = smqAdmin.createUUID();
            var deferred = smqAdmin.waitingReply[id] = smqAdmin.defer();
            if (smqAdmin.showPingPongs) console.log('Update User - ');
            smqAdmin.client.send('/exchange/adminmic/crudcoordinator.crud.admin.updateuser', { "content-type": "text/plain", "reply-to":"/temp-queue/response-queue", "correlation-id":id }, payload);
            
            smqAdmin.waitFor(id);
            
            return deferred.promise;
        }
        
        smqAdmin.DeleteUser = function() {
            smqAdmin.DeleteUser('{}');
        }

        smqAdmin.DeleteUser = function(payload) {
            payload = smqAdmin.stringifyValue(payload);
            var id = smqAdmin.createUUID();
            var deferred = smqAdmin.waitingReply[id] = smqAdmin.defer();
            if (smqAdmin.showPingPongs) console.log('Delete User - ');
            smqAdmin.client.send('/exchange/adminmic/crudcoordinator.crud.admin.deleteuser', { "content-type": "text/plain", "reply-to":"/temp-queue/response-queue", "correlation-id":id }, payload);
            
            smqAdmin.waitFor(id);
            
            return deferred.promise;
        }
        
        smqAdmin.AddAllSegment = function() {
            smqAdmin.AddAllSegment('{}');
        }

        smqAdmin.AddAllSegment = function(payload) {
            payload = smqAdmin.stringifyValue(payload);
            var id = smqAdmin.createUUID();
            var deferred = smqAdmin.waitingReply[id] = smqAdmin.defer();
            if (smqAdmin.showPingPongs) console.log('Add All Segment - ');
            smqAdmin.client.send('/exchange/adminmic/crudcoordinator.crud.admin.addallsegment', { "content-type": "text/plain", "reply-to":"/temp-queue/response-queue", "correlation-id":id }, payload);
            
            smqAdmin.waitFor(id);
            
            return deferred.promise;
        }
        
        smqAdmin.GetAllSegments = function() {
            smqAdmin.GetAllSegments('{}');
        }

        smqAdmin.GetAllSegments = function(payload) {
            payload = smqAdmin.stringifyValue(payload);
            var id = smqAdmin.createUUID();
            var deferred = smqAdmin.waitingReply[id] = smqAdmin.defer();
            if (smqAdmin.showPingPongs) console.log('Get All Segments - ');
            smqAdmin.client.send('/exchange/adminmic/crudcoordinator.crud.admin.getallsegments', { "content-type": "text/plain", "reply-to":"/temp-queue/response-queue", "correlation-id":id }, payload);
            
            smqAdmin.waitFor(id);
            
            return deferred.promise;
        }
        
        smqAdmin.UpdateAllSegment = function() {
            smqAdmin.UpdateAllSegment('{}');
        }

        smqAdmin.UpdateAllSegment = function(payload) {
            payload = smqAdmin.stringifyValue(payload);
            var id = smqAdmin.createUUID();
            var deferred = smqAdmin.waitingReply[id] = smqAdmin.defer();
            if (smqAdmin.showPingPongs) console.log('Update All Segment - ');
            smqAdmin.client.send('/exchange/adminmic/crudcoordinator.crud.admin.updateallsegment', { "content-type": "text/plain", "reply-to":"/temp-queue/response-queue", "correlation-id":id }, payload);
            
            smqAdmin.waitFor(id);
            
            return deferred.promise;
        }
        
        smqAdmin.DeleteAllSegment = function() {
            smqAdmin.DeleteAllSegment('{}');
        }

        smqAdmin.DeleteAllSegment = function(payload) {
            payload = smqAdmin.stringifyValue(payload);
            var id = smqAdmin.createUUID();
            var deferred = smqAdmin.waitingReply[id] = smqAdmin.defer();
            if (smqAdmin.showPingPongs) console.log('Delete All Segment - ');
            smqAdmin.client.send('/exchange/adminmic/crudcoordinator.crud.admin.deleteallsegment', { "content-type": "text/plain", "reply-to":"/temp-queue/response-queue", "correlation-id":id }, payload);
            
            smqAdmin.waitFor(id);
            
            return deferred.promise;
        }
        
        smqAdmin.AddComment = function() {
            smqAdmin.AddComment('{}');
        }

        smqAdmin.AddComment = function(payload) {
            payload = smqAdmin.stringifyValue(payload);
            var id = smqAdmin.createUUID();
            var deferred = smqAdmin.waitingReply[id] = smqAdmin.defer();
            if (smqAdmin.showPingPongs) console.log('Add Comment - ');
            smqAdmin.client.send('/exchange/adminmic/crudcoordinator.crud.admin.addcomment', { "content-type": "text/plain", "reply-to":"/temp-queue/response-queue", "correlation-id":id }, payload);
            
            smqAdmin.waitFor(id);
            
            return deferred.promise;
        }
        
        smqAdmin.GetComments = function() {
            smqAdmin.GetComments('{}');
        }

        smqAdmin.GetComments = function(payload) {
            payload = smqAdmin.stringifyValue(payload);
            var id = smqAdmin.createUUID();
            var deferred = smqAdmin.waitingReply[id] = smqAdmin.defer();
            if (smqAdmin.showPingPongs) console.log('Get Comments - ');
            smqAdmin.client.send('/exchange/adminmic/crudcoordinator.crud.admin.getcomments', { "content-type": "text/plain", "reply-to":"/temp-queue/response-queue", "correlation-id":id }, payload);
            
            smqAdmin.waitFor(id);
            
            return deferred.promise;
        }
        
        smqAdmin.UpdateComment = function() {
            smqAdmin.UpdateComment('{}');
        }

        smqAdmin.UpdateComment = function(payload) {
            payload = smqAdmin.stringifyValue(payload);
            var id = smqAdmin.createUUID();
            var deferred = smqAdmin.waitingReply[id] = smqAdmin.defer();
            if (smqAdmin.showPingPongs) console.log('Update Comment - ');
            smqAdmin.client.send('/exchange/adminmic/crudcoordinator.crud.admin.updatecomment', { "content-type": "text/plain", "reply-to":"/temp-queue/response-queue", "correlation-id":id }, payload);
            
            smqAdmin.waitFor(id);
            
            return deferred.promise;
        }
        
        smqAdmin.DeleteComment = function() {
            smqAdmin.DeleteComment('{}');
        }

        smqAdmin.DeleteComment = function(payload) {
            payload = smqAdmin.stringifyValue(payload);
            var id = smqAdmin.createUUID();
            var deferred = smqAdmin.waitingReply[id] = smqAdmin.defer();
            if (smqAdmin.showPingPongs) console.log('Delete Comment - ');
            smqAdmin.client.send('/exchange/adminmic/crudcoordinator.crud.admin.deletecomment', { "content-type": "text/plain", "reply-to":"/temp-queue/response-queue", "correlation-id":id }, payload);
            
            smqAdmin.waitFor(id);
            
            return deferred.promise;
        }
        

    return smqAdmin;
}

                    
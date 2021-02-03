

function generateCRUDCoordinatorActor() {
    var smqCRUDCoordinator = {
    };
    
    smqCRUDCoordinator.defer = function() {
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

    smqCRUDCoordinator.connect = function (virtualHost, username, password, on_received, after_connect) {
        console.warn('set `smqCRUDCoordinator.showPingPongs = true` to get verbose logging.');
        smqCRUDCoordinator.virtualHost = virtualHost;
        smqCRUDCoordinator.username = username;
        smqCRUDCoordinator.password = password;
        smqCRUDCoordinator.rabbitEndpoint = smqCRUDCoordinator.rabbitEndpoint || window.rabbitEndpoint || 'ws://sassymq.anabstractlevel.com:15674/ws';
        smqCRUDCoordinator.CRUDCoordinator_all_connection = {};
        smqCRUDCoordinator.messages = [];
        smqCRUDCoordinator.waitingReply = [];
        
        smqCRUDCoordinator.client = Stomp.client(smqCRUDCoordinator.rabbitEndpoint);

        smqCRUDCoordinator.client.debug = function (m, p) {
            if (((m == ">>> PING") || (m == "<<< PONG")) && !smqCRUDCoordinator.showPingPongs) return;
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

        smqCRUDCoordinator.checkMessage = function(msg) {
            
                if (smqCRUDCoordinator.onGuestRequestToken) {
                    if (msg.headers && (msg.headers.destination.includes('crudcoordinator.general.guest.requesttoken'))) {
                        var rpayload = smqCRUDCoordinator.onGuestRequestToken(msg.body, msg);
                        if (rpayload) smqCRUDCoordinator.sendReply(rpayload, msg);
                    }
                }
            
                if (smqCRUDCoordinator.onGuestValidateTemporaryAccessToken) {
                    if (msg.headers && (msg.headers.destination.includes('crudcoordinator.general.guest.validatetemporaryaccesstoken'))) {
                        var rpayload = smqCRUDCoordinator.onGuestValidateTemporaryAccessToken(msg.body, msg);
                        if (rpayload) smqCRUDCoordinator.sendReply(rpayload, msg);
                    }
                }
            
                if (smqCRUDCoordinator.onGuestWhoAmI) {
                    if (msg.headers && (msg.headers.destination.includes('crudcoordinator.general.guest.whoami'))) {
                        var rpayload = smqCRUDCoordinator.onGuestWhoAmI(msg.body, msg);
                        if (rpayload) smqCRUDCoordinator.sendReply(rpayload, msg);
                    }
                }
            
                if (smqCRUDCoordinator.onGuestWhoAreYou) {
                    if (msg.headers && (msg.headers.destination.includes('crudcoordinator.general.guest.whoareyou'))) {
                        var rpayload = smqCRUDCoordinator.onGuestWhoAreYou(msg.body, msg);
                        if (rpayload) smqCRUDCoordinator.sendReply(rpayload, msg);
                    }
                }
            
                if (smqCRUDCoordinator.onGuestStoreTempFile) {
                    if (msg.headers && (msg.headers.destination.includes('crudcoordinator.utlity.guest.storetempfile'))) {
                        var rpayload = smqCRUDCoordinator.onGuestStoreTempFile(msg.body, msg);
                        if (rpayload) smqCRUDCoordinator.sendReply(rpayload, msg);
                    }
                }
            
                if (smqCRUDCoordinator.onCRUDCoordinatorResetRabbitSassyMQConfiguration) {
                    if (msg.headers && (msg.headers.destination.includes('crudcoordinator.general.crudcoordinator.resetrabbitsassymqconfiguration'))) {
                        var rpayload = smqCRUDCoordinator.onCRUDCoordinatorResetRabbitSassyMQConfiguration(msg.body, msg);
                        if (rpayload) smqCRUDCoordinator.sendReply(rpayload, msg);
                    }
                }
            
                if (smqCRUDCoordinator.onCRUDCoordinatorResetJWTSecretKey) {
                    if (msg.headers && (msg.headers.destination.includes('crudcoordinator.general.crudcoordinator.resetjwtsecretkey'))) {
                        var rpayload = smqCRUDCoordinator.onCRUDCoordinatorResetJWTSecretKey(msg.body, msg);
                        if (rpayload) smqCRUDCoordinator.sendReply(rpayload, msg);
                    }
                }
            
                if (smqCRUDCoordinator.onAdminAddUser) {
                    if (msg.headers && (msg.headers.destination.includes('crudcoordinator.crud.admin.adduser'))) {
                        var rpayload = smqCRUDCoordinator.onAdminAddUser(msg.body, msg);
                        if (rpayload) smqCRUDCoordinator.sendReply(rpayload, msg);
                    }
                }
            
                if (smqCRUDCoordinator.onAdminGetUsers) {
                    if (msg.headers && (msg.headers.destination.includes('crudcoordinator.crud.admin.getusers'))) {
                        var rpayload = smqCRUDCoordinator.onAdminGetUsers(msg.body, msg);
                        if (rpayload) smqCRUDCoordinator.sendReply(rpayload, msg);
                    }
                }
            
                if (smqCRUDCoordinator.onAdminUpdateUser) {
                    if (msg.headers && (msg.headers.destination.includes('crudcoordinator.crud.admin.updateuser'))) {
                        var rpayload = smqCRUDCoordinator.onAdminUpdateUser(msg.body, msg);
                        if (rpayload) smqCRUDCoordinator.sendReply(rpayload, msg);
                    }
                }
            
                if (smqCRUDCoordinator.onAdminDeleteUser) {
                    if (msg.headers && (msg.headers.destination.includes('crudcoordinator.crud.admin.deleteuser'))) {
                        var rpayload = smqCRUDCoordinator.onAdminDeleteUser(msg.body, msg);
                        if (rpayload) smqCRUDCoordinator.sendReply(rpayload, msg);
                    }
                }
            
                if (smqCRUDCoordinator.onGuestGetAllSegments) {
                    if (msg.headers && (msg.headers.destination.includes('crudcoordinator.crud.guest.getallsegments'))) {
                        var rpayload = smqCRUDCoordinator.onGuestGetAllSegments(msg.body, msg);
                        if (rpayload) smqCRUDCoordinator.sendReply(rpayload, msg);
                    }
                }
            
                if (smqCRUDCoordinator.onAdminAddAllSegment) {
                    if (msg.headers && (msg.headers.destination.includes('crudcoordinator.crud.admin.addallsegment'))) {
                        var rpayload = smqCRUDCoordinator.onAdminAddAllSegment(msg.body, msg);
                        if (rpayload) smqCRUDCoordinator.sendReply(rpayload, msg);
                    }
                }
            
                if (smqCRUDCoordinator.onAdminGetAllSegments) {
                    if (msg.headers && (msg.headers.destination.includes('crudcoordinator.crud.admin.getallsegments'))) {
                        var rpayload = smqCRUDCoordinator.onAdminGetAllSegments(msg.body, msg);
                        if (rpayload) smqCRUDCoordinator.sendReply(rpayload, msg);
                    }
                }
            
                if (smqCRUDCoordinator.onAdminUpdateAllSegment) {
                    if (msg.headers && (msg.headers.destination.includes('crudcoordinator.crud.admin.updateallsegment'))) {
                        var rpayload = smqCRUDCoordinator.onAdminUpdateAllSegment(msg.body, msg);
                        if (rpayload) smqCRUDCoordinator.sendReply(rpayload, msg);
                    }
                }
            
                if (smqCRUDCoordinator.onAdminDeleteAllSegment) {
                    if (msg.headers && (msg.headers.destination.includes('crudcoordinator.crud.admin.deleteallsegment'))) {
                        var rpayload = smqCRUDCoordinator.onAdminDeleteAllSegment(msg.body, msg);
                        if (rpayload) smqCRUDCoordinator.sendReply(rpayload, msg);
                    }
                }
            
                if (smqCRUDCoordinator.onAdminAddComment) {
                    if (msg.headers && (msg.headers.destination.includes('crudcoordinator.crud.admin.addcomment'))) {
                        var rpayload = smqCRUDCoordinator.onAdminAddComment(msg.body, msg);
                        if (rpayload) smqCRUDCoordinator.sendReply(rpayload, msg);
                    }
                }
            
                if (smqCRUDCoordinator.onAdminGetComments) {
                    if (msg.headers && (msg.headers.destination.includes('crudcoordinator.crud.admin.getcomments'))) {
                        var rpayload = smqCRUDCoordinator.onAdminGetComments(msg.body, msg);
                        if (rpayload) smqCRUDCoordinator.sendReply(rpayload, msg);
                    }
                }
            
                if (smqCRUDCoordinator.onAdminUpdateComment) {
                    if (msg.headers && (msg.headers.destination.includes('crudcoordinator.crud.admin.updatecomment'))) {
                        var rpayload = smqCRUDCoordinator.onAdminUpdateComment(msg.body, msg);
                        if (rpayload) smqCRUDCoordinator.sendReply(rpayload, msg);
                    }
                }
            
                if (smqCRUDCoordinator.onAdminDeleteComment) {
                    if (msg.headers && (msg.headers.destination.includes('crudcoordinator.crud.admin.deletecomment'))) {
                        var rpayload = smqCRUDCoordinator.onAdminDeleteComment(msg.body, msg);
                        if (rpayload) smqCRUDCoordinator.sendReply(rpayload, msg);
                    }
                }
            
                // Can also hear what 'Guest' can hear.
                
                // Can also hear what 'Admin' can hear.
                
               
        }

        var on_connect = function (x) {
            smqCRUDCoordinator.CRUDCoordinator_all_connection = smqCRUDCoordinator.client.subscribe("/exchange/crudcoordinator.all/#",
                    function (d) {
                        if (d.body) d.body = JSON.parse(d.body);
                        smqCRUDCoordinator.messages.push(d);
                        smqCRUDCoordinator.checkMessage(d);
                        if (on_received) on_received(d);
                        if (smqCRUDCoordinator.showPingPongs) console.log('      --------  MESSAGE FOR smqCRUDCoordinator: ', d);
                    }, {
                        durable: false,
                        requeue: true
                    });
            smqCRUDCoordinator.client.onreceive =  function (d) {
                        var body = JSON.parse(d.body);
                        var corrID = d.headers["correlation-id"];
                        var waitingDeferred = smqCRUDCoordinator.waitingReply[corrID];

                        if (waitingDeferred && body.IsHandled) {
                            delete smqCRUDCoordinator.waitingReply[corrID];
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

        console.log('connecting to: ' + smqCRUDCoordinator.rabbitEndpoint + ', using ' + username + '/' + password);
        smqCRUDCoordinator.client.connect(smqCRUDCoordinator.username, smqCRUDCoordinator.password, on_connect, on_error, smqCRUDCoordinator.virtualHost);
    };

    smqCRUDCoordinator.disconnect = function() {
        if (smqCRUDCoordinator && smqCRUDCoordinator.client) 
        {
            smqCRUDCoordinator.client.disconnect();
        }
    }

    smqCRUDCoordinator.stringifyValue = function(value) {
        if (!value) value = '{}';
            if (typeof value == 'object') {
                value = JSON.stringify(value);
            }
        return value;
    };
    
    smqCRUDCoordinator.sendReply = function(replyPayload, msg) {
        if (replyPayload && msg && msg.headers && msg.headers['reply-to']) {
            replyPayload.IsHandled = true;
            smqCRUDCoordinator.client.send(msg.headers['reply-to'], 
                        { "content-type": "application/json", 
                          "reply-to":"/temp-queue/response-queue", 
                          "correlation-id":msg.headers['correlation-id'] 
                        }, JSON.stringify(replyPayload));
        }
    };

    
        
        smqCRUDCoordinator.waitFor = function (id) {
            setTimeout(function () {
                var waiting = smqCRUDCoordinator.waitingReply[id];
                if (waiting) {
                    waiting.reject("Timed out waiting for reply");
                }
            }, 30000)
        }
        
        smqCRUDCoordinator.createUUID = function() {
          function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
          }
          return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        }


        
        smqCRUDCoordinator.ResetRabbitSassyMQConfiguration = function() {
            smqCRUDCoordinator.ResetRabbitSassyMQConfiguration('{}');
        }

        smqCRUDCoordinator.ResetRabbitSassyMQConfiguration = function(payload) {
            payload = smqCRUDCoordinator.stringifyValue(payload);
            var id = smqCRUDCoordinator.createUUID();
            var deferred = smqCRUDCoordinator.waitingReply[id] = smqCRUDCoordinator.defer();
            if (smqCRUDCoordinator.showPingPongs) console.log('Reset Rabbit Sassy M Q Configuration - ');
            smqCRUDCoordinator.client.send('/exchange/crudcoordinatormic/crudcoordinator.general.crudcoordinator.resetrabbitsassymqconfiguration', { "content-type": "text/plain", "reply-to":"/temp-queue/response-queue", "correlation-id":id }, payload);
            
            smqCRUDCoordinator.waitFor(id);
            
            return deferred.promise;
        }
        
        smqCRUDCoordinator.ResetJWTSecretKey = function() {
            smqCRUDCoordinator.ResetJWTSecretKey('{}');
        }

        smqCRUDCoordinator.ResetJWTSecretKey = function(payload) {
            payload = smqCRUDCoordinator.stringifyValue(payload);
            var id = smqCRUDCoordinator.createUUID();
            var deferred = smqCRUDCoordinator.waitingReply[id] = smqCRUDCoordinator.defer();
            if (smqCRUDCoordinator.showPingPongs) console.log('Reset J W T Secret Key - ');
            smqCRUDCoordinator.client.send('/exchange/crudcoordinatormic/crudcoordinator.general.crudcoordinator.resetjwtsecretkey', { "content-type": "text/plain", "reply-to":"/temp-queue/response-queue", "correlation-id":id }, payload);
            
            smqCRUDCoordinator.waitFor(id);
            
            return deferred.promise;
        }
        
            // Can also say what 'Guest' can say.
            
        
        smqCRUDCoordinator.waitFor = function (id) {
            setTimeout(function () {
                var waiting = smqCRUDCoordinator.waitingReply[id];
                if (waiting) {
                    waiting.reject("Timed out waiting for reply");
                }
            }, 30000)
        }
        
        smqCRUDCoordinator.createUUID = function() {
          function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
          }
          return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        }


        
        smqCRUDCoordinator.GuestRequestToken = function() {
            smqCRUDCoordinator.GuestRequestToken('{}');
        }

        smqCRUDCoordinator.GuestRequestToken = function(payload) {
            payload = smqCRUDCoordinator.stringifyValue(payload);
            var id = smqCRUDCoordinator.createUUID();
            var deferred = smqCRUDCoordinator.waitingReply[id] = smqCRUDCoordinator.defer();
            if (smqGuest.showPingPongs) console.log('Request Token - ');
            smqCRUDCoordinator.client.send('/exchange/guestmic/crudcoordinator.general.guest.requesttoken', { "content-type": "text/plain", "reply-to":"/temp-queue/response-queue", "correlation-id":id }, payload);
            
            smqCRUDCoordinator.waitFor(id);
            
            return deferred.promise;
        }
        
        smqCRUDCoordinator.GuestValidateTemporaryAccessToken = function() {
            smqCRUDCoordinator.GuestValidateTemporaryAccessToken('{}');
        }

        smqCRUDCoordinator.GuestValidateTemporaryAccessToken = function(payload) {
            payload = smqCRUDCoordinator.stringifyValue(payload);
            var id = smqCRUDCoordinator.createUUID();
            var deferred = smqCRUDCoordinator.waitingReply[id] = smqCRUDCoordinator.defer();
            if (smqGuest.showPingPongs) console.log('Validate Temporary Access Token - ');
            smqCRUDCoordinator.client.send('/exchange/guestmic/crudcoordinator.general.guest.validatetemporaryaccesstoken', { "content-type": "text/plain", "reply-to":"/temp-queue/response-queue", "correlation-id":id }, payload);
            
            smqCRUDCoordinator.waitFor(id);
            
            return deferred.promise;
        }
        
        smqCRUDCoordinator.GuestWhoAmI = function() {
            smqCRUDCoordinator.GuestWhoAmI('{}');
        }

        smqCRUDCoordinator.GuestWhoAmI = function(payload) {
            payload = smqCRUDCoordinator.stringifyValue(payload);
            var id = smqCRUDCoordinator.createUUID();
            var deferred = smqCRUDCoordinator.waitingReply[id] = smqCRUDCoordinator.defer();
            if (smqGuest.showPingPongs) console.log('Who Am I - ');
            smqCRUDCoordinator.client.send('/exchange/guestmic/crudcoordinator.general.guest.whoami', { "content-type": "text/plain", "reply-to":"/temp-queue/response-queue", "correlation-id":id }, payload);
            
            smqCRUDCoordinator.waitFor(id);
            
            return deferred.promise;
        }
        
        smqCRUDCoordinator.GuestWhoAreYou = function() {
            smqCRUDCoordinator.GuestWhoAreYou('{}');
        }

        smqCRUDCoordinator.GuestWhoAreYou = function(payload) {
            payload = smqCRUDCoordinator.stringifyValue(payload);
            var id = smqCRUDCoordinator.createUUID();
            var deferred = smqCRUDCoordinator.waitingReply[id] = smqCRUDCoordinator.defer();
            if (smqGuest.showPingPongs) console.log('Who Are You - ');
            smqCRUDCoordinator.client.send('/exchange/guestmic/crudcoordinator.general.guest.whoareyou', { "content-type": "text/plain", "reply-to":"/temp-queue/response-queue", "correlation-id":id }, payload);
            
            smqCRUDCoordinator.waitFor(id);
            
            return deferred.promise;
        }
        
        smqCRUDCoordinator.GuestStoreTempFile = function() {
            smqCRUDCoordinator.GuestStoreTempFile('{}');
        }

        smqCRUDCoordinator.GuestStoreTempFile = function(payload) {
            payload = smqCRUDCoordinator.stringifyValue(payload);
            var id = smqCRUDCoordinator.createUUID();
            var deferred = smqCRUDCoordinator.waitingReply[id] = smqCRUDCoordinator.defer();
            if (smqGuest.showPingPongs) console.log('Store Temp File - ');
            smqCRUDCoordinator.client.send('/exchange/guestmic/crudcoordinator.utlity.guest.storetempfile', { "content-type": "text/plain", "reply-to":"/temp-queue/response-queue", "correlation-id":id }, payload);
            
            smqCRUDCoordinator.waitFor(id);
            
            return deferred.promise;
        }
        
        smqCRUDCoordinator.GuestGetAllSegments = function() {
            smqCRUDCoordinator.GuestGetAllSegments('{}');
        }

        smqCRUDCoordinator.GuestGetAllSegments = function(payload) {
            payload = smqCRUDCoordinator.stringifyValue(payload);
            var id = smqCRUDCoordinator.createUUID();
            var deferred = smqCRUDCoordinator.waitingReply[id] = smqCRUDCoordinator.defer();
            if (smqGuest.showPingPongs) console.log('Get All Segments - ');
            smqCRUDCoordinator.client.send('/exchange/guestmic/crudcoordinator.crud.guest.getallsegments', { "content-type": "text/plain", "reply-to":"/temp-queue/response-queue", "correlation-id":id }, payload);
            
            smqCRUDCoordinator.waitFor(id);
            
            return deferred.promise;
        }
        
            // Can also say what 'Admin' can say.
            
        
        smqCRUDCoordinator.waitFor = function (id) {
            setTimeout(function () {
                var waiting = smqCRUDCoordinator.waitingReply[id];
                if (waiting) {
                    waiting.reject("Timed out waiting for reply");
                }
            }, 30000)
        }
        
        smqCRUDCoordinator.createUUID = function() {
          function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
          }
          return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        }


        
        smqCRUDCoordinator.AdminAddUser = function() {
            smqCRUDCoordinator.AdminAddUser('{}');
        }

        smqCRUDCoordinator.AdminAddUser = function(payload) {
            payload = smqCRUDCoordinator.stringifyValue(payload);
            var id = smqCRUDCoordinator.createUUID();
            var deferred = smqCRUDCoordinator.waitingReply[id] = smqCRUDCoordinator.defer();
            if (smqAdmin.showPingPongs) console.log('Add User - ');
            smqCRUDCoordinator.client.send('/exchange/adminmic/crudcoordinator.crud.admin.adduser', { "content-type": "text/plain", "reply-to":"/temp-queue/response-queue", "correlation-id":id }, payload);
            
            smqCRUDCoordinator.waitFor(id);
            
            return deferred.promise;
        }
        
        smqCRUDCoordinator.AdminGetUsers = function() {
            smqCRUDCoordinator.AdminGetUsers('{}');
        }

        smqCRUDCoordinator.AdminGetUsers = function(payload) {
            payload = smqCRUDCoordinator.stringifyValue(payload);
            var id = smqCRUDCoordinator.createUUID();
            var deferred = smqCRUDCoordinator.waitingReply[id] = smqCRUDCoordinator.defer();
            if (smqAdmin.showPingPongs) console.log('Get Users - ');
            smqCRUDCoordinator.client.send('/exchange/adminmic/crudcoordinator.crud.admin.getusers', { "content-type": "text/plain", "reply-to":"/temp-queue/response-queue", "correlation-id":id }, payload);
            
            smqCRUDCoordinator.waitFor(id);
            
            return deferred.promise;
        }
        
        smqCRUDCoordinator.AdminUpdateUser = function() {
            smqCRUDCoordinator.AdminUpdateUser('{}');
        }

        smqCRUDCoordinator.AdminUpdateUser = function(payload) {
            payload = smqCRUDCoordinator.stringifyValue(payload);
            var id = smqCRUDCoordinator.createUUID();
            var deferred = smqCRUDCoordinator.waitingReply[id] = smqCRUDCoordinator.defer();
            if (smqAdmin.showPingPongs) console.log('Update User - ');
            smqCRUDCoordinator.client.send('/exchange/adminmic/crudcoordinator.crud.admin.updateuser', { "content-type": "text/plain", "reply-to":"/temp-queue/response-queue", "correlation-id":id }, payload);
            
            smqCRUDCoordinator.waitFor(id);
            
            return deferred.promise;
        }
        
        smqCRUDCoordinator.AdminDeleteUser = function() {
            smqCRUDCoordinator.AdminDeleteUser('{}');
        }

        smqCRUDCoordinator.AdminDeleteUser = function(payload) {
            payload = smqCRUDCoordinator.stringifyValue(payload);
            var id = smqCRUDCoordinator.createUUID();
            var deferred = smqCRUDCoordinator.waitingReply[id] = smqCRUDCoordinator.defer();
            if (smqAdmin.showPingPongs) console.log('Delete User - ');
            smqCRUDCoordinator.client.send('/exchange/adminmic/crudcoordinator.crud.admin.deleteuser', { "content-type": "text/plain", "reply-to":"/temp-queue/response-queue", "correlation-id":id }, payload);
            
            smqCRUDCoordinator.waitFor(id);
            
            return deferred.promise;
        }
        
        smqCRUDCoordinator.AdminAddAllSegment = function() {
            smqCRUDCoordinator.AdminAddAllSegment('{}');
        }

        smqCRUDCoordinator.AdminAddAllSegment = function(payload) {
            payload = smqCRUDCoordinator.stringifyValue(payload);
            var id = smqCRUDCoordinator.createUUID();
            var deferred = smqCRUDCoordinator.waitingReply[id] = smqCRUDCoordinator.defer();
            if (smqAdmin.showPingPongs) console.log('Add All Segment - ');
            smqCRUDCoordinator.client.send('/exchange/adminmic/crudcoordinator.crud.admin.addallsegment', { "content-type": "text/plain", "reply-to":"/temp-queue/response-queue", "correlation-id":id }, payload);
            
            smqCRUDCoordinator.waitFor(id);
            
            return deferred.promise;
        }
        
        smqCRUDCoordinator.AdminGetAllSegments = function() {
            smqCRUDCoordinator.AdminGetAllSegments('{}');
        }

        smqCRUDCoordinator.AdminGetAllSegments = function(payload) {
            payload = smqCRUDCoordinator.stringifyValue(payload);
            var id = smqCRUDCoordinator.createUUID();
            var deferred = smqCRUDCoordinator.waitingReply[id] = smqCRUDCoordinator.defer();
            if (smqAdmin.showPingPongs) console.log('Get All Segments - ');
            smqCRUDCoordinator.client.send('/exchange/adminmic/crudcoordinator.crud.admin.getallsegments', { "content-type": "text/plain", "reply-to":"/temp-queue/response-queue", "correlation-id":id }, payload);
            
            smqCRUDCoordinator.waitFor(id);
            
            return deferred.promise;
        }
        
        smqCRUDCoordinator.AdminUpdateAllSegment = function() {
            smqCRUDCoordinator.AdminUpdateAllSegment('{}');
        }

        smqCRUDCoordinator.AdminUpdateAllSegment = function(payload) {
            payload = smqCRUDCoordinator.stringifyValue(payload);
            var id = smqCRUDCoordinator.createUUID();
            var deferred = smqCRUDCoordinator.waitingReply[id] = smqCRUDCoordinator.defer();
            if (smqAdmin.showPingPongs) console.log('Update All Segment - ');
            smqCRUDCoordinator.client.send('/exchange/adminmic/crudcoordinator.crud.admin.updateallsegment', { "content-type": "text/plain", "reply-to":"/temp-queue/response-queue", "correlation-id":id }, payload);
            
            smqCRUDCoordinator.waitFor(id);
            
            return deferred.promise;
        }
        
        smqCRUDCoordinator.AdminDeleteAllSegment = function() {
            smqCRUDCoordinator.AdminDeleteAllSegment('{}');
        }

        smqCRUDCoordinator.AdminDeleteAllSegment = function(payload) {
            payload = smqCRUDCoordinator.stringifyValue(payload);
            var id = smqCRUDCoordinator.createUUID();
            var deferred = smqCRUDCoordinator.waitingReply[id] = smqCRUDCoordinator.defer();
            if (smqAdmin.showPingPongs) console.log('Delete All Segment - ');
            smqCRUDCoordinator.client.send('/exchange/adminmic/crudcoordinator.crud.admin.deleteallsegment', { "content-type": "text/plain", "reply-to":"/temp-queue/response-queue", "correlation-id":id }, payload);
            
            smqCRUDCoordinator.waitFor(id);
            
            return deferred.promise;
        }
        
        smqCRUDCoordinator.AdminAddComment = function() {
            smqCRUDCoordinator.AdminAddComment('{}');
        }

        smqCRUDCoordinator.AdminAddComment = function(payload) {
            payload = smqCRUDCoordinator.stringifyValue(payload);
            var id = smqCRUDCoordinator.createUUID();
            var deferred = smqCRUDCoordinator.waitingReply[id] = smqCRUDCoordinator.defer();
            if (smqAdmin.showPingPongs) console.log('Add Comment - ');
            smqCRUDCoordinator.client.send('/exchange/adminmic/crudcoordinator.crud.admin.addcomment', { "content-type": "text/plain", "reply-to":"/temp-queue/response-queue", "correlation-id":id }, payload);
            
            smqCRUDCoordinator.waitFor(id);
            
            return deferred.promise;
        }
        
        smqCRUDCoordinator.AdminGetComments = function() {
            smqCRUDCoordinator.AdminGetComments('{}');
        }

        smqCRUDCoordinator.AdminGetComments = function(payload) {
            payload = smqCRUDCoordinator.stringifyValue(payload);
            var id = smqCRUDCoordinator.createUUID();
            var deferred = smqCRUDCoordinator.waitingReply[id] = smqCRUDCoordinator.defer();
            if (smqAdmin.showPingPongs) console.log('Get Comments - ');
            smqCRUDCoordinator.client.send('/exchange/adminmic/crudcoordinator.crud.admin.getcomments', { "content-type": "text/plain", "reply-to":"/temp-queue/response-queue", "correlation-id":id }, payload);
            
            smqCRUDCoordinator.waitFor(id);
            
            return deferred.promise;
        }
        
        smqCRUDCoordinator.AdminUpdateComment = function() {
            smqCRUDCoordinator.AdminUpdateComment('{}');
        }

        smqCRUDCoordinator.AdminUpdateComment = function(payload) {
            payload = smqCRUDCoordinator.stringifyValue(payload);
            var id = smqCRUDCoordinator.createUUID();
            var deferred = smqCRUDCoordinator.waitingReply[id] = smqCRUDCoordinator.defer();
            if (smqAdmin.showPingPongs) console.log('Update Comment - ');
            smqCRUDCoordinator.client.send('/exchange/adminmic/crudcoordinator.crud.admin.updatecomment', { "content-type": "text/plain", "reply-to":"/temp-queue/response-queue", "correlation-id":id }, payload);
            
            smqCRUDCoordinator.waitFor(id);
            
            return deferred.promise;
        }
        
        smqCRUDCoordinator.AdminDeleteComment = function() {
            smqCRUDCoordinator.AdminDeleteComment('{}');
        }

        smqCRUDCoordinator.AdminDeleteComment = function(payload) {
            payload = smqCRUDCoordinator.stringifyValue(payload);
            var id = smqCRUDCoordinator.createUUID();
            var deferred = smqCRUDCoordinator.waitingReply[id] = smqCRUDCoordinator.defer();
            if (smqAdmin.showPingPongs) console.log('Delete Comment - ');
            smqCRUDCoordinator.client.send('/exchange/adminmic/crudcoordinator.crud.admin.deletecomment', { "content-type": "text/plain", "reply-to":"/temp-queue/response-queue", "correlation-id":id }, payload);
            
            smqCRUDCoordinator.waitFor(id);
            
            return deferred.promise;
        }
        

    return smqCRUDCoordinator;
}

                    
import { Injectable } from '@angular/core';
import { GDS } from '../gds.service';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { EapiDataServiceBase } from './eds-base';
declare var generateGuestActor: any;

@Injectable({
  providedIn: 'root'
})
export class EapiDataService extends EapiDataServiceBase {
  vhosts: {};
  vhostsByRCID: any;
  getFields(vhostName: string, objectName: string): string[] {
    // Find the objects
    var vhost = this.vhosts[vhostName];
    var propertyDefNames = [];

    if (vhost) {
      var objectDefs = vhost.getObjectDefs();
      console.error('OBJECT DEFS', objectDefs);
      var od = objectDefs.find(od => (od.Name + '').toLowerCase() == objectName);
      console.error('OBJECT DEF (looking for)', od, objectName);
      if (od && od.PropertyDefs && od.PropertyDefs.PropertyDef) {
        propertyDefNames = od.PropertyDefs.PropertyDef.map(pd => pd.Name);
      }
    }
    return propertyDefNames;
  }

  constructor(public gds: GDS, public ngxXml2jsonService: NgxXml2jsonService) {
    super(gds);
  }


  exploreEAPI(effortlessAPIEndpoint: any, onConnected: any) {
    var eapiVHost: string = effortlessAPIEndpoint.VHost;
    var self = this;
    var vhost = self.vhosts[eapiVHost];
    if (!vhost && effortlessAPIEndpoint && effortlessAPIEndpoint.AMQPHostname) {
      vhost = self.vhosts[eapiVHost] = { 'vhost': eapiVHost };
      vhost.effortlessAPIEndpoint = effortlessAPIEndpoint;
      var payload = self.gds.createPayload();
      payload.WhoAreYouRelativeUrl = 'docs/ODXML/DataSchema.odxml';
      var localGuest = vhost.guest = generateGuestActor();
      localGuest.rabbitEndpoint = 'ws' + (effortlessAPIEndpoint.IsSecure ? 's' : '') + '://' + effortlessAPIEndpoint.AMQPHostname + '/ws'
      localGuest.connect(eapiVHost, 'smqPublic', 'smqPublic', null, function () {
        localGuest.WhoAreYou(payload)
          .then(function (reply) {
            vhost.odxml = reply.WhoAreYouTextFileContents;
            const parser = new DOMParser();
            const odxmlDOM = parser.parseFromString(vhost.odxml, 'text/xml');
            vhost.odxml = self.ngxXml2jsonService.xmlToJson(odxmlDOM);
            payload.WhoAreYouRelativeUrl = 'docs/SassyMQ/Lexicon.smql';
            localGuest.WhoAreYou(payload)
              .then(function (smqlReply) {
                vhost.smql = smqlReply.WhoAreYouTextFileContents;
                const parser = new DOMParser();
                const smqlDOM = parser.parseFromString(vhost.smql, 'text/xml');
                vhost.lexicon = self.ngxXml2jsonService.xmlToJson(smqlDOM);
                if (onConnected) onConnected(vhost);
              });
          });
      });
      vhost.getObjectDefs = function (actorName) {
        console.error('looking up objects for actor:', vhost, this, actorName);
        if (vhost.odxml && vhost.odxml.Ontology && vhost.odxml.Ontology.OntologyGroups) {
          var ontologyGroups = vhost.odxml.Ontology.OntologyGroups;
          if (ontologyGroups && ontologyGroups.OntologyGroup && ontologyGroups.OntologyGroup.ObjectDefs) {
            var objectDefs = ontologyGroups.OntologyGroup.ObjectDefs.ObjectDef;
            var actor = vhost.getActor(actorName);
            if (actor) {
              objectDefs = vhost.getActorObjectDefs(actor, objectDefs);
            }

            return objectDefs;
          }
        }

        return [];
      }

      vhost.getActorObjectDefs = function (actor, objectDefs) {
        return objectDefs.filter(objectDef => {
          var actorName = actor.Name;
          let crud = "";
          if (objectDef && objectDef.MatchingMetaData && objectDef.MatchingMetaData[actorName + 'CRUD']) {
            crud = objectDef.MatchingMetaData[actorName + 'CRUD'];
          }
          return !!crud;
        });
      }

      vhost.getActor = function (actorName) {
        var actors = vhost.getActors();
        let actor = null;
        var matchingActors = actors.find(actor => actor.Name.toLowerCase() == actorName.toLowerCase());
        if (matchingActors) {
          if (matchingActors.length > 0) actor = matchingActors[0];
          else actor = matchingActors;
        }
        console.error('ACTOR', actor, actor.ActorCanSay);

        vhost.makeSMQActor(actor);
        vhost.messagesByKey = {};
        vhost.lexicon.SMQLexicon.SMQMessages.SMQMessage.forEach(feMessage => {
          vhost.messagesByKey[feMessage.SMQMessageKey] = feMessage;
        });        

        actor.ActorCanSay.SMQMessageKey.forEach(feKey => {
          let msg = vhost.messagesByKey[feKey];
          actor[msg.Name] = function (payload) {
            if (!actor.waitingReply) alert('Actor must be connected first.');            
            payload = actor.stringifyValue(payload);
            var id = actor.createUUID();
            var deferred = actor.waitingReply[id] = actor.defer();
            console.error(msg.DisplayName, payload);
            actor.client.send('/exchange/developermic/' + msg.RoutingKey, { "content-type": "text/plain", "reply-to": "/temp-queue/response-queue", "correlation-id": id }, payload);
            actor.waitFor(id);
            return deferred.promise;
          }
        });
        console.error('ACTOR2', actor, actor.ActorCanSay);

        return actor;
      }

      vhost.getActors = function () {
        if (vhost.lexicon && vhost.lexicon.SMQLexicon && vhost.lexicon.SMQLexicon.SMQActors) {
          return vhost.lexicon.SMQLexicon.SMQActors.SMQActor;
        } else return [{ "Name": "actors not loaded..." }];
      }

      vhost.makeSMQActor = function (actor: any) {
        console.error('MAKING SMQ ACTOR', actor);
        actor.defer = function () {
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

        actor.connect = function (virtualHost, username, password, on_received, after_connect) {
          actor.virtualHost = virtualHost;
          actor.username = username;
          actor.password = password;
          actor.rabbitEndpoint = actor.rabbitEndpoint || window['rabbitEndpoint'] || 'ws://sassymq.anabstractlevel.com:15674/ws';
          actor.Developer_all_connection = {};
          actor.messages = [];
          actor.waitingReply = [];

          actor.client = window['Stomp'].client(actor.rabbitEndpoint);

          actor.client.debug = function (m, p) {
            if (m && m.indexOf('PING')) return;
            console.log('DEBUG VALUE: ', m ,p);
          }

          actor.checkMessage = function (msg) {


          }

          var on_connect = function (x) {
            console.log('X = ' + x);
            actor.Developer_all_connection = actor.client.subscribe("/exchange/developer.all/#",
              function (d) {
                if (d.body) d.body = JSON.parse(d.body);
                actor.messages.push(d);
                actor.checkMessage(d);
                if (on_received) on_received(d);
                console.log('      --------  MESSAGE FOR smqDeveloper: ', d);
              }, {
              durable: false,
              requeue: true
            });
            actor.client.onreceive = function (d) {
              var body = JSON.parse(d.body);
              var lexiconTerm = body.LexiconTerm || { 'RoutingKey': body.RoutingKey };

              var corrID = d.headers["correlation-id"];

              var waitingDeferred = actor.waitingReply[corrID];

              if (waitingDeferred && body.IsHandled) {
                delete actor.waitingReply[corrID];
                if (body && body.ErrorMessage && actor.toastr) actor.toastr.show(body.ErrorMessage, { status: 'danger'});
                waitingDeferred.resolve(body, d);
              }
            };
            if (after_connect) after_connect(x);
          };

          var on_error = function (frame) {
            frame = frame || { 'error': 'unspecified error' };
            console.error('ERROR On STOMP Client: ' + frame.error);
          };

          console.log('connecting to: ' + actor.rabbitEndpoint + ', using ' + username + '/' + password);
          actor.client.connect(actor.username, actor.password, on_connect, on_error, actor.virtualHost);
        };

        actor.disconnect = function () {
          if (actor && actor.client) {
            actor.client.disconnect();
          }
        }

        actor.stringifyValue = function (value) {
          if (!value) value = '{}';
          if (typeof value == 'object') {
            value = JSON.stringify(value);
          }
          return value;
        };

        actor.sendReply = function (replyPayload, msg) {
          if (replyPayload && msg && msg.headers && msg.headers['reply-to']) {
            replyPayload.IsHandled = true;
            actor.client.send(msg.headers['reply-to'],
              {
                "content-type": "application/json",
                "reply-to": "/temp-queue/response-queue",
                "correlation-id": msg.headers['correlation-id']
              }, JSON.stringify(replyPayload));
          }
        };



        actor.waitFor = function (id) {
          setTimeout(function () {
            var waiting = actor.waitingReply[id];
            if (waiting) {
              waiting.reject("Timed out waiting for reply");
            }
          }, 30000)
        }

        actor.createUUID = function () {
          function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
          }
          return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        }
        console.error('MADE  SMQ ACTOR', actor);
      }
    } else {
      onConnected(vhost)
    }
    return vhost;
  }
}

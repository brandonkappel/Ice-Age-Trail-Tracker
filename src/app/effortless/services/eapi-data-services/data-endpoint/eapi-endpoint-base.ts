import { GDS } from '../../gds.service';
import { Observable, BehaviorSubject } from 'rxjs';

export class EapiEndpointBase {
    lastReload: {};
    constructor(public gds: GDS) {

    }

    public static defaultSort(defaultA: any, defaultB: any): number {
        let objectResult = EapiEndpointBase.objectSort(defaultA, defaultB);

        if ((objectResult == 0) && defaultA && defaultA.Name) {
            if (defaultA.Name > defaultB.Name) return 1;
            else if (defaultB.Name > defaultA.Name) return -1;
        }

        return 0;
    }

    public static objectSort(defaultA: any, defaultB: any): number {
        if (defaultA && !defaultB) return 1;
        else if (defaultB && !defaultA) return -1;
        return 0;
    }

    public static sortBy(items: any, sortField: string): any {
        return items.sort(function (a, b) {
            var objectSort = EapiEndpointBase.objectSort(a, b);
            if (objectSort == 0 && a) {
                if (a[sortField] > b[sortField]) return 1;
                else if (b[sortField] > a[sortField]) return -1;
            }
            return 0;
        })
    }

    public async doReload(smqUser: any, idName: string, lowerName: string, upperName: string, airtableWhere: string, sortField: string = '', isPlural: boolean = true, behaviorSubject? : BehaviorSubject<any>) : Promise<any> {
        return new Promise((accept, reject) => {
            let self = this;

            this.lastReload = this.lastReload || {};
            let whereKey = idName + '_where' + isPlural;
            if (self.lastReload[whereKey] && self.lastReload[whereKey] != airtableWhere)  {
                if (isPlural) {
                    self[lowerName] = [];
                    self[lowerName + '$'].next([]);
                } else {
                    self[lowerName] = {};
                    self[lowerName + '$'].next({});
                }
            }
                
            this.lastReload[whereKey] = airtableWhere;

            if (!smqUser) smqUser = self.gds.smqUser;
            let payload = smqUser.createPayload ? smqUser.createPayload() : self.gds.createPayload();
            payload.AirtableWhere = airtableWhere;
            if (!smqUser || !smqUser['Get' + upperName]) {
                console.error('SMQ User does not contain: ' + 'Get' + upperName + '();', smqUser, payload);
            } else {
                var lastReloadRequested = this.lastReload[idName] = new Date().getTime();
                console.error('RELOADING WHERE KEY: ' + whereKey, lastReloadRequested);
                if (whereKey == 'TableColumnId_where') {
                    console.error('RELOADING COLUMNS!!!!!');
                }
                smqUser['Get' + upperName](payload)
                    .then(reply => {
                        console.log('GOT REPLY: ', whereKey, reply);
                        let items = reply[upperName];

                        if (this.lastReload[idName] != lastReloadRequested) {
                            console.error('DATA RECEIVED - discarding because lastReloadRequested date changed', whereKey, lastReloadRequested, this.lastReload[idName],  items);
                            return;
                        }
                        else {
                            self[lowerName + 'ById'] = {}
                            let items = reply[upperName];
                            if (items) {
                                if (sortField) {
                                    items = EapiEndpointBase.sortBy(items, sortField);
                                } else items = items.sort(self[lowerName + 'Sort']);
                                items.forEach(item => {
                                    self[lowerName + 'ById'][item[idName]] = item;
                                })
                            }
                            var nextValue = isPlural ? items : items[0];
                            self[lowerName] = nextValue;
                            
                            if (behaviorSubject) behaviorSubject.next(nextValue);
                            else self[lowerName + '$'].next(nextValue);
                            accept(nextValue);
                        }
                    }, (error) => {
                        reject(error);
                    });
            }
        });
    }
}
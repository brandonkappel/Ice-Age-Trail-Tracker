import { DataEndpointBase } from './data-endpoint-base';
import { Injectable } from '@angular/core';

@Injectable()
export class DataEndpoint extends DataEndpointBase {
    dataLoaded: boolean;
    reloadStaticData(actor: any) {
        if (this.dataLoaded) {
            return;
        } else {
            this.dataLoaded = true;
            //this.reloadTABLEXYZ(actor);
        }
    }
}

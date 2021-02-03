import { GDS } from '../gds.service';

export class EapiDataServiceBase {
    public vhosts: {};

    constructor(public gds: GDS) {
        this.vhosts = {};
    }
}
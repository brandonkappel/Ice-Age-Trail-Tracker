/*
THIS FILE IS DERIVED - CHANGES WILL BE OVERWRITTEN (derived)
*/
import { EapiEndpointBase } from './eapi-endpoint-base';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, share } from 'rxjs/operators';
import { GDS } from '../../gds.service';

export class DataEndpointBase extends EapiEndpointBase {

    constructor(public gds: GDS) {
        super(gds)
    }






    // HANDLERS FOR: User
    public user: any = {};
    public users: any[] = [];
    public usersById: any = {};
    public user$: BehaviorSubject<any[]> = new BehaviorSubject(null);
    public users$: BehaviorSubject<any[]> = new BehaviorSubject(null);

    public onUsersChange(): Observable<any> {
        return this.users$
            .pipe(
                filter(value => !!value),
                share(),
            );
    }

    public onUserChange(): Observable<any> {
        return this.user$
            .pipe(
                filter(value => !!value),
                share(),
            );
    }

    public async reloadUsers(smqUser: any = null, sortField : string = '', behaviorSubject?: BehaviorSubject<any>) {
        return this.doReload(smqUser, 'UserId', 'users', 'Users', '', sortField, true, behaviorSubject);
    }

    public async reloadUsersWhere(smqUser: any = null, airtableWhere : string, sortField : string = '', behaviorSubject?: BehaviorSubject<any>) {
        return this.doReload(smqUser, 'UserId', 'users', 'Users', airtableWhere, sortField, true, behaviorSubject);
    }

    public async reloadUserWhere(smqUser: any = null, airtableWhere : string, sortField : string = '', behaviorSubject?: BehaviorSubject<any>) {
        return this.doReload(smqUser, 'UserId', 'user', 'Users', airtableWhere, sortField, false, behaviorSubject);
    }

    public usersSort(userA: any, userB: any) {
        return EapiEndpointBase.defaultSort(userA, userB);
    } 





    // HANDLERS FOR: AllSegment
    public allsegment: any = {};
    public allsegments: any[] = [];
    public allsegmentsById: any = {};
    public allsegment$: BehaviorSubject<any[]> = new BehaviorSubject(null);
    public allsegments$: BehaviorSubject<any[]> = new BehaviorSubject(null);

    public onAllSegmentsChange(): Observable<any> {
        return this.allsegments$
            .pipe(
                filter(value => !!value),
                share(),
            );
    }

    public onAllSegmentChange(): Observable<any> {
        return this.allsegment$
            .pipe(
                filter(value => !!value),
                share(),
            );
    }

    public async reloadAllSegments(smqUser: any = null, sortField : string = '', behaviorSubject?: BehaviorSubject<any>) {
        return this.doReload(smqUser, 'AllSegmentId', 'allsegments', 'AllSegments', '', sortField, true, behaviorSubject);
    }

    public async reloadAllSegmentsWhere(smqUser: any = null, airtableWhere : string, sortField : string = '', behaviorSubject?: BehaviorSubject<any>) {
        return this.doReload(smqUser, 'AllSegmentId', 'allsegments', 'AllSegments', airtableWhere, sortField, true, behaviorSubject);
    }

    public async reloadAllSegmentWhere(smqUser: any = null, airtableWhere : string, sortField : string = '', behaviorSubject?: BehaviorSubject<any>) {
        return this.doReload(smqUser, 'AllSegmentId', 'allsegment', 'AllSegments', airtableWhere, sortField, false, behaviorSubject);
    }

    public allsegmentsSort(allsegmentA: any, allsegmentB: any) {
        return EapiEndpointBase.defaultSort(allsegmentA, allsegmentB);
    } 





    // HANDLERS FOR: Comment
    public comment: any = {};
    public comments: any[] = [];
    public commentsById: any = {};
    public comment$: BehaviorSubject<any[]> = new BehaviorSubject(null);
    public comments$: BehaviorSubject<any[]> = new BehaviorSubject(null);

    public onCommentsChange(): Observable<any> {
        return this.comments$
            .pipe(
                filter(value => !!value),
                share(),
            );
    }

    public onCommentChange(): Observable<any> {
        return this.comment$
            .pipe(
                filter(value => !!value),
                share(),
            );
    }

    public async reloadComments(smqUser: any = null, sortField : string = '', behaviorSubject?: BehaviorSubject<any>) {
        return this.doReload(smqUser, 'CommentId', 'comments', 'Comments', '', sortField, true, behaviorSubject);
    }

    public async reloadCommentsWhere(smqUser: any = null, airtableWhere : string, sortField : string = '', behaviorSubject?: BehaviorSubject<any>) {
        return this.doReload(smqUser, 'CommentId', 'comments', 'Comments', airtableWhere, sortField, true, behaviorSubject);
    }

    public async reloadCommentWhere(smqUser: any = null, airtableWhere : string, sortField : string = '', behaviorSubject?: BehaviorSubject<any>) {
        return this.doReload(smqUser, 'CommentId', 'comment', 'Comments', airtableWhere, sortField, false, behaviorSubject);
    }

    public commentsSort(commentA: any, commentB: any) {
        return EapiEndpointBase.defaultSort(commentA, commentB);
    } 

}

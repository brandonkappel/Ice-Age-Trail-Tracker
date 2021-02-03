import { DataComponent } from './data.component';

import { UsersComponent } from "./users/users.component";
import { UserComponent } from './users/user/user.component';
import { UserDialogComponent } from './users/user-dialog/user-dialog.component';
import { AllSegmentsComponent } from "./allsegments/allsegments.component";
import { AllSegmentComponent } from './allsegments/allsegment/allsegment.component';
import { AllSegmentDialogComponent } from './allsegments/allsegment-dialog/allsegment-dialog.component';
import { CommentsComponent } from "./comments/comments.component";
import { CommentComponent } from './comments/comment/comment.component';
import { CommentDialogComponent } from './comments/comment-dialog/comment-dialog.component';


export class DerivedDataDeclarations {
    static derivedDeclarations = [

        UsersComponent,
        UserComponent,
        UserDialogComponent,
        AllSegmentsComponent,
        AllSegmentComponent,
        AllSegmentDialogComponent,
        CommentsComponent,
        CommentComponent,
        CommentDialogComponent,
    ]

    static derivedEntryComponents = [

        UserDialogComponent,
        AllSegmentDialogComponent,
        CommentDialogComponent,
    ]

    static derivedPages: any[] = [
        {
            path: 'data',
            component: DataComponent,
        },

        {
            path: 'data/users',
            component: UsersComponent,
        },
        {
            path: 'data/users/user',
            component: UserComponent
        },
        {
            path: 'data/users/user/:userId',
            component: UserComponent
        },
        {
            path: 'data/allsegments',
            component: AllSegmentsComponent,
        },
        {
            path: 'data/allsegments/allsegment',
            component: AllSegmentComponent
        },
        {
            path: 'data/allsegments/allsegment/:allsegmentId',
            component: AllSegmentComponent
        },
        {
            path: 'data/comments',
            component: CommentsComponent,
        },
        {
            path: 'data/comments/comment',
            component: CommentComponent
        },
        {
            path: 'data/comments/comment/:commentId',
            component: CommentComponent
        },
    ];
};


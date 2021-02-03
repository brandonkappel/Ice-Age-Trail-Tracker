<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl"
>
    <xsl:output method="xml" indent="yes"/>

    <xsl:param name="output-filename" select="'output.txt'" />
    <xsl:include href="../CommonXsltTemplates.xslt" />
    <xsl:template match="@* | node()">
        <xsl:copy>
            <xsl:apply-templates select="@* | node()"/>
        </xsl:copy>
    </xsl:template>

    <xsl:template match="/*">
        <FileSet>
            <FileSetFiles>
                        <FileSetFile>
                <RelativePath>data.component.html</RelativePath>
                <OverwriteMode>Never</OverwriteMode>
                <FileContents><nb-card>
    <nb-card-header>
        <h4>Effortless Data</h4>
        <p style="font-size: 14px; margin: 0;">The following links will allow you to explore and edit the data behind your EffortlessAPI.</p>
    </nb-card-header>
    <nb-card-body>
        &lt;nb-menu [items]="tables">
        &lt;/nb-menu>
    </nb-card-body>
</nb-card>
</FileContents>
            </FileSetFile>

<xsl:for-each select="//ObjectDefs/ObjectDef"><xsl:variable name="od" select="." />
            <FileSetFile>
                <RelativePath><xsl:value-of select="translate($od/PluralName, $ucletters, $lcletters)" />/<xsl:value-of select="translate($od/PluralName, $ucletters, $lcletters)" />
                <xsl:text>.component.ts</xsl:text></RelativePath>
                <OverwriteMode>Never</OverwriteMode>
                <FileContents>import { Component, OnInit } from '@angular/core';
import { Router, Route, ActivatedRoute } from '@angular/router';
import { EffortlessComponentBase } from '../../efforless-base-component';
import { GDS } from '../../services/gds.service';
import { DataEndpoint } from '../../services/eapi-data-services/data-endpoint/data-endpoint';
import { NbMenuService } from '@nebular/theme';
import { NbDialogService } from '@nebular/theme';
import { Observable } from 'rxjs';
import { <xsl:value-of select="$od/Name" />DialogComponent } from './<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />-dialog/<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />-dialog.component'

@Component({
  selector: 'eapi-data-<xsl:value-of select="translate($od/PluralName, $ucletters, $lcletters)" />',
  templateUrl: './<xsl:value-of select="translate($od/PluralName, $ucletters, $lcletters)" />.component.html',
  styleUrls: ['./<xsl:value-of select="translate($od/PluralName, $ucletters, $lcletters)" />.component.scss']
})
export class <xsl:value-of select="$od/PluralName" />Component extends EffortlessComponentBase implements OnInit {
  searchText : string = '';
  <xsl:value-of select="translate($od/PluralName, $ucletters, $lcletters)" />: any[] = [];
  filtered<xsl:value-of select="$od/PluralName" />: any;
  allowDelete : boolean = false;
  allowAdd : boolean = false;

  constructor(public gds : GDS, public data : DataEndpoint, public route : ActivatedRoute, 
            protected menuService : NbMenuService, public router : Router, public dialogService: NbDialogService) { 
    super(gds, data, menuService);
    this.safeSubscribe(this.data.on<xsl:value-of select="$od/PluralName" />Change().subscribe(<xsl:value-of select="translate($od/PluralName, $ucletters, $lcletters)" /> => {
      this.<xsl:value-of select="translate($od/PluralName, $ucletters, $lcletters)" /> = <xsl:value-of select="translate($od/PluralName, $ucletters, $lcletters)" />;
      this.filterNow();
    }));
  }

  onGdsReady() {
    var user = this.gds.smqUser || this.gds.smqGuest;
    this.allowDelete = !!user.Delete<xsl:value-of select="$od/Name" />;
    this.allowAdd = !!user.Add<xsl:value-of select="$od/Name" />;
    this.reload(this);
  }

  filterNow() {
    this.filtered<xsl:value-of select="$od/PluralName" /> = this.<xsl:value-of select="translate($od/PluralName, $ucletters, $lcletters)" />.filter(<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" /> => !this.searchText || <xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />.Name.toLowerCase().includes((this.searchText + '').toLowerCase()));      
  }

  reload(self: this) {
    self.data.reload<xsl:value-of select="$od/PluralName" />(self.gds.smqUser || self.gds.smqGuest);
  }

  goTo<xsl:value-of select="$od/Name" />(id) {
    this.router.navigateByUrl('effortless/data/<xsl:value-of select="translate($od/PluralName, $ucletters, $lcletters)" />/<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />/' + id);
  }

  
  openAddDialog() {
    this.dialogService.open(<xsl:value-of select="$od/Name" />DialogComponent, { context: null, autoFocus: false});
  }

  goBack() {
    this.router.navigateByUrl('effortless/data');
  }

  delete<xsl:value-of select="$od/Name" />(<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />ToDelete) {
    if (confirm('Are you sure?')) {
      var payload = this.gds.createPayload();
      payload.<xsl:value-of select="$od/Name" /> = <xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />ToDelete;
      this.gds.smqUser.Delete<xsl:value-of select="$od/Name" />(payload).then((reply) => {
        if (reply.ErrorMessage) {
          alert(reply.ErrorMessage)
        } else {
          this.reload(this)
        }
      });
    }
  }
   
  add<xsl:value-of select="$od/Name" />(<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />ToAdd) {
    var payload = this.gds.createPayload();
    payload.<xsl:value-of select="$od/Name" /> = <xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />ToAdd;
    (this.gds.smqUser || this.gds.smqGuest).Add<xsl:value-of select="$od/Name" />(payload).then((reply) => {
      if (reply.ErrorMessage) {
        alert(reply.ErrorMessage)
      } else {
        this.router.navigateByUrl('effortless/data/<xsl:value-of select="translate($od/PluralName, $ucletters, $lcletters)" />/<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />/' + reply.<xsl:value-of select="$od/Name" />.<xsl:value-of select="$od/Name" />Id);
      }
    });
  }
}
</FileContents>
            </FileSetFile>
            <FileSetFile>
                <RelativePath><xsl:value-of select="translate($od/PluralName, $ucletters, $lcletters)" />/<xsl:value-of select="translate($od/PluralName, $ucletters, $lcletters)" />
                <xsl:text>.component.spec.ts</xsl:text></RelativePath>
                <OverwriteMode>Never</OverwriteMode>
                <FileContents></FileContents>
            </FileSetFile>
            <FileSetFile>
                <RelativePath><xsl:value-of select="translate($od/PluralName, $ucletters, $lcletters)" />/<xsl:value-of select="translate($od/PluralName, $ucletters, $lcletters)" />
                <xsl:text>.component.scss</xsl:text></RelativePath>
                <OverwriteMode>Never</OverwriteMode>
                <FileContents></FileContents>
            </FileSetFile>
            <FileSetFile>
                <RelativePath><xsl:value-of select="translate($od/PluralName, $ucletters, $lcletters)" />/<xsl:value-of select="translate($od/PluralName, $ucletters, $lcletters)" />
                <xsl:text>.component.html</xsl:text></RelativePath>
                <OverwriteMode>Never</OverwriteMode>
                <FileContents><nb-card>
  <nb-card-header>
    &lt;button nbButton ghost nbTooltip="Back" class="float-left"
      style="padding: 8px; margin: 1px 0px; margin-right: 16px;" (click)="goBack()">
      <nb-icon style="margin: 0;" icon="arrow-ios-back-outline"></nb-icon>
      <span>Back</span>
    &lt;/button>
    <h4 style="float: left; margin: 4px 0px;"><xsl:value-of select="$od/PluralName" /></h4>
    &lt;button nbButton ghost nbTooltip="Add <xsl:value-of select="$od/Name" />" class="float-right" style="margin: 4px 0px" size="tiny"
      (click)="openAddDialog()" *ngIf="allowAdd">
      <nb-icon style="margin-right: 4px;" icon="plus-square-outline"></nb-icon>
      <span>Add</span>
    &lt;/button>
    &lt;reload-widget [self]="this" [loading]="loading" [reloadHandler]="reload"
      style="float: right; margin-top: 8px; margin-right: 8px;">
    &lt;/reload-widget>
    &lt;input nbInput type="text" [(ngModel)]="searchText" placeholder="Filter <xsl:value-of select="$od/PluralName" />" class="float-right"
      (change)="filterNow()" style="margin-right: 3.4em; width: 12em;" />
  </nb-card-header>
  <nb-card-body>
    <nb-list>
      &lt;nb-list-item *ngFor="let <xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" /> of filtered<xsl:value-of select="$od/PluralName" />" style="padding: 1em;">
        &lt;p style="float: left; font-weight: 600; margin: 6px 0px; cursor: pointer;"
          (click)="goTo<xsl:value-of select="$od/Name" />(<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />.<xsl:value-of select="$od/Name" />Id)">
          {{ <xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />?.Name }}
        &lt;/p>
        &lt;button nbButton nbTooltip="Delete" class="float-right" size="tiny" status="danger"
          *ngIf="allowDelete" (click)="delete<xsl:value-of select="$od/Name" />(<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />)">
          <nb-icon icon="trash-2-outline"></nb-icon>
        &lt;/button>
        &lt;button nbButton nbTooltip="View <xsl:value-of select="$od/Name" />" class="float-right" style="margin-right: 8px;" size="tiny"
          (click)="goTo<xsl:value-of select="$od/Name" />(<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />.<xsl:value-of select="$od/Name" />Id)">
          <nb-icon icon="external-link"></nb-icon>
        &lt;/button>
      &lt;/nb-list-item>
    </nb-list>
  </nb-card-body>
</nb-card></FileContents>
            </FileSetFile>
            <FileSetFile>
                <RelativePath><xsl:value-of select="translate($od/PluralName, $ucletters, $lcletters)" />/<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />/<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />
                <xsl:text>.component.ts</xsl:text></RelativePath>
                <OverwriteMode>Never</OverwriteMode>
                <FileContents>import { Component, OnInit } from '@angular/core';
import { Router, Route, ActivatedRoute } from '@angular/router';
import { EffortlessComponentBase } from '../../../efforless-base-component';
import { GDS } from '../../../services/gds.service';
import { DataEndpoint } from '../../../services/eapi-data-services/data-endpoint/data-endpoint';
import { NbMenuService, NbToastrService } from '@nebular/theme';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { JSONEditor } from '@json-editor/json-editor';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'eapi-data-<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />',
  templateUrl: './<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />.component.html',
  styleUrls: ['./<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />.component.scss']
})
export class <xsl:value-of select="$od/Name" />Component extends EffortlessComponentBase implements OnInit {
  <xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />$: Observable&lt;any>;
  <xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />: any;
  id: any;
  config: any;
  mySchema: any;
  editor: any;
  private doc: any;
  allowSave : boolean = false;
  
  
  constructor(public gds : GDS, public data : DataEndpoint, public route : ActivatedRoute, 
            protected toastr : NbToastrService, protected menuService : NbMenuService, public router : Router,
            @Inject(DOCUMENT) document) { 
    super(gds, data, menuService);
    this.doc = document;
    this.<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />$ = this.data.on<xsl:value-of select="$od/Name" />Change();
    this.safeSubscribe(this.<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />$.subscribe(data => {
      this.<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" /> = data
      if (this.editor) {
        this.editor.setValue(this.<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />)
      }
      this.loading = false;
    }));
    
    this.config = {};
    this.mySchema = {
      "definitions": {},
      "$schema": "http://json-schema.org/draft-07/schema#",
      "$id": "http://example.com/root.json",
      "type": "object",
      "title": "The Root Schema",
      "required": [<xsl:for-each select="PropertyDefs/PropertyDef">
        "<xsl:value-of select="Name" />",</xsl:for-each>
      ],
      "properties": {<xsl:for-each select="PropertyDefs/PropertyDef">
        "<xsl:value-of select="Name" />": {
          $id: "#/properties/<xsl:value-of select="Name" />",
          type: "<xsl:call-template name="get-type" />",
          title: "<xsl:value-of select="DisplayName" />",
          default: "",
          options: {
            hidden: <xsl:choose>
            <xsl:when test="IsPrimaryKey=1">true</xsl:when>
            <xsl:when test="count(.//Relationship)">true</xsl:when>
            <xsl:otherwise>false</xsl:otherwise>
            </xsl:choose>,
          },
          "pattern": "^(.*)$"
        },</xsl:for-each>
      }
    };
  }

  ngOnInit() {
    super.ngOnInit()
    const element = this.doc.getElementById('editor_holder');
    var options = {
      theme: 'bootstrap4',
      iconlib: "fontawesome5",
      schema: this.mySchema,
    };
    this.editor = new JSONEditor(element, options);
    this.editor.on('change',() => {
      console.log(this.editor.getValue())
    });
  }
  
  save() {
    var payload = this.gds.createPayload();
    payload.<xsl:value-of select="$od/Name" /> = this.editor.getValue();
    (this.gds.smqUser || this.gds.smqGuest).Update<xsl:value-of select="$od/Name" />(payload)
        .then(reply => {
          this.<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />  = reply.<xsl:value-of select="$od/Name" />;
          if (reply.ErrorMessage) {
            this.toastr.show(reply.ErrorMessage)
          } else {
            this.toastr.show('<xsl:value-of select="$od/Name" /> Saved...');
            this.goBack()
          }
        });
  }

  onGdsReady() {
    this.route.params.pipe(take(1)).subscribe(params => {
      this.id = params['<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />Id'];
      this.reload(this);
      this.allowSave = !!(this.gds.smqUser || this.gds.smqGuest)['UpdateTheater'];
    });
  }

  reload(self: this) {
    self.loading = true;
    self.data.reload<xsl:value-of select="$od/Name" />Where(self.gds.smqUser || self.gds.smqGuest, "RECORD_ID()='" + self.id + "'");
  }

  goBack() {
    this.router.navigateByUrl('effortless/data/<xsl:value-of select="translate($od/PluralName, $ucletters, $lcletters)" />')
  }
}
</FileContents>
            </FileSetFile>
            <FileSetFile>
                <RelativePath><xsl:value-of select="translate($od/PluralName, $ucletters, $lcletters)" />/<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />/<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />
                <xsl:text>.component.spec.ts</xsl:text></RelativePath>
                <OverwriteMode>Never</OverwriteMode>
                <FileContents></FileContents>
            </FileSetFile>
            <FileSetFile>
                <RelativePath><xsl:value-of select="translate($od/PluralName, $ucletters, $lcletters)" />/<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />/<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />
                <xsl:text>.component.scss</xsl:text></RelativePath>
                <OverwriteMode>Never</OverwriteMode>
                <FileContents></FileContents>
            </FileSetFile>
            <FileSetFile>
                <RelativePath><xsl:value-of select="translate($od/PluralName, $ucletters, $lcletters)" />/<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />/<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />
                <xsl:text>.component.html</xsl:text></RelativePath>
                <OverwriteMode>Never</OverwriteMode>
                <FileContents><nb-flip-card>
    <nb-card-front>
        <nb-card>
            <nb-card-header>
                &lt;button nbButton ghost nbTooltip="Back" class="float-left"
                    style="padding: 8px; margin: 1px 0px; margin-right: 16px;" (click)="goBack()">
                    <nb-icon style="margin: 0;" icon="arrow-ios-back-outline"></nb-icon>
                    <span>Back</span>
                &lt;/button>
                <h4 style="float: left; margin: 4px 0px;">{{ (<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />$ | async)?.Name }} Summary</h4>
                &lt;button nbButton ghost nbTooltip="Save" class="float-right" style="padding: 8px; margin: 1px 0px;"
                    (click)="save()" *ngIf="allowSave">
                    <nb-icon icon="save-outline"></nb-icon>
                    <span>Save</span>
                &lt;/button>
            </nb-card-header>
            <nb-card-body>
                <div id="editor_holder"></div>
            </nb-card-body>
        </nb-card>
    </nb-card-front>
    <nb-card-back>
        <nb-card>
            <nb-card-header>
                &lt;button nbButton ghost nbTooltip="Back" class="float-left"
                    style="padding: 8px; margin: 1px 0px; margin-right: 16px;" (click)="goBack()">
                    <nb-icon style="margin: 0;" icon="arrow-ios-back-outline"></nb-icon>
                    <span>Back</span>
                &lt;/button>
                <h4 style="float: left; margin: 4px 0px;">{{ (<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />$ | async)?.Name }} Summary</h4>
                &lt;button nbButton ghost nbTooltip="Save" class="float-right" style="padding: 8px; margin: 1px 0px;"
                    (click)="save()">
                    <nb-icon icon="save-outline"></nb-icon>
                    <span>Save</span>
                &lt;/button>
            </nb-card-header>
            <nb-card-body>
                <div id="editor_holder"></div>
            </nb-card-body>
        </nb-card>
    </nb-card-back>
</nb-flip-card></FileContents>
            </FileSetFile>
            <FileSetFile>
                <RelativePath><xsl:value-of select="translate($od/PluralName, $ucletters, $lcletters)" />/<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />-dialog/<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />
                <xsl:text>-dialog.component.html</xsl:text></RelativePath>
                <OverwriteMode>Never</OverwriteMode>
                <FileContents xml:space="preserve"><nb-card>
    <nb-card-header>
        <h4 style="float: left; margin: 4px 0px;">Add a <xsl:value-of select="$od/Name" /></h4>
        &lt;button nbButton ghost nbTooltip="Cancel" class="float-right"
            style="padding: 8px; margin: 1px 0px;" (click)="cancel()">
            <nb-icon style="margin-right: 4px;" icon="close-square-outline"></nb-icon>
            <span>Cancel</span>
        &lt;/button>
    </nb-card-header>
    <nb-card-body>
        <div id="editor_holder"></div>
        &lt;button nbButton ghost class="float-right" (click)="add<xsl:value-of select="$od/Name" />()">Add&lt;/button>
    </nb-card-body>
</nb-card></FileContents>
            </FileSetFile>
            <FileSetFile>
                <RelativePath><xsl:value-of select="translate($od/PluralName, $ucletters, $lcletters)" />/<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />-dialog/<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />
                <xsl:text>-dialog.component.scss</xsl:text></RelativePath>
                <OverwriteMode>Never</OverwriteMode>
                <FileContents></FileContents>
            </FileSetFile>
            <FileSetFile>
                <RelativePath><xsl:value-of select="translate($od/PluralName, $ucletters, $lcletters)" />/<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />-dialog/<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />
                <xsl:text>-dialog.component.spec.ts</xsl:text></RelativePath>
                <OverwriteMode>Never</OverwriteMode>
                <FileContents></FileContents>
            </FileSetFile>
            <FileSetFile>
                <RelativePath><xsl:value-of select="translate($od/PluralName, $ucletters, $lcletters)" />/<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />-dialog/<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />
                <xsl:text>-dialog.component.ts</xsl:text></RelativePath>
                <OverwriteMode>Never</OverwriteMode>
                <FileContents>import { Component, OnInit } from '@angular/core';
import { Router, Route, ActivatedRoute } from '@angular/router';
import { EffortlessComponentBase } from '../../../efforless-base-component';
import { GDS } from '../../../services/gds.service';
import { DataEndpoint } from '../../../services/eapi-data-services/data-endpoint/data-endpoint';
import { NbMenuService, NbToastrService } from '@nebular/theme';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import JSONEditor from '@json-editor/json-editor';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NbDialogRef } from '@nebular/theme'
import { JsonEditorComponent } from 'ng2-json-editor';

@Component({
  selector: 'eapi-data-<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />-dialog',
  templateUrl: './<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />-dialog.component.html',
  styleUrls: ['./<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />-dialog.component.scss']
})
export class <xsl:value-of select="$od/Name" />DialogComponent implements OnInit {

  private doc: any;
  mySchema: any = {};
  editor: any;

  <xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />ToAdd: any;

  constructor(@Inject(DOCUMENT) document, protected dialogRef: NbDialogRef&lt;<xsl:value-of select="$od/Name" />DialogComponent>,
    public gds: GDS, public router: Router) {
    this.doc = document;
    this.mySchema = {
      "definitions": {},
      "$schema": "http://json-schema.org/draft-07/schema#",
      "$id": "http://example.com/root.json",
      "type": "object",
      "title": "The Root Schema",
      "required": [<xsl:for-each select="PropertyDefs/PropertyDef">
        "<xsl:value-of select="Name" />",</xsl:for-each>
      ],
      properties: {<xsl:for-each select="PropertyDefs/PropertyDef">
        "<xsl:value-of select="Name" />": {
          $id: "#/properties/<xsl:value-of select="Name" />",
          type: "<xsl:call-template name="get-type" />",
          title: "<xsl:value-of select="DisplayName" />",
          default: "",
          options: {
            hidden: <xsl:choose>
            <xsl:when test="IsPrimaryKey=1">true</xsl:when>
            <xsl:when test="count(.//Relationship)">true</xsl:when>
            <xsl:otherwise>false</xsl:otherwise>
            </xsl:choose>,
          },
          pattern: "^(.*)$"
        },</xsl:for-each>
      }
    };
  }


  ngOnInit() {
    const element = this.doc.getElementById('editor_holder');
    var options = {
      theme: 'bootstrap4',
      iconlib: "fontawesome5",
      schema: this.mySchema,
    };
    this.editor = new window['JSONEditor'](element, options);
  }

  cancel() {
    this.dialogRef.close();
  }

  add<xsl:value-of select="$od/Name" />() {
    var payload = this.gds.createPayload();
    payload.<xsl:value-of select="$od/Name" /> = this.editor.getValue();
    (this.gds.smqUser || this.gds.smqGuest).Add<xsl:value-of select="$od/Name" />(payload).then((reply) => {
      if (reply.ErrorMessage) {
        alert(reply.ErrorMessage)
      } else {
        this.cancel();
        this.router.navigateByUrl('effortless/data/<xsl:value-of select="translate($od/PluralName, $ucletters, $lcletters)" />/<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />/' + reply.<xsl:value-of select="$od/Name" />.<xsl:value-of select="$od/Name" />Id);
      }
    });
  }

}</FileContents>
            </FileSetFile>
</xsl:for-each>
                <FileSetFile>
                    <RelativePath>
                        <xsl:text>derived-data-declarations.ts</xsl:text>
                    </RelativePath>
                    <xsl:element name="FileContents" xml:space="preserve">import { DataComponent } from './data.component';
<xsl:for-each select="//ObjectDefs/ObjectDef"><xsl:variable name="od" select="." />
import { <xsl:value-of select="$od/PluralName" />Component } from "./<xsl:value-of select="translate($od/PluralName, $ucletters, $lcletters)" />/<xsl:value-of select="translate($od/PluralName, $ucletters, $lcletters)" />.component";
import { <xsl:value-of select="$od/Name" />Component } from './<xsl:value-of select="translate($od/PluralName, $ucletters, $lcletters)" />/<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />/<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />.component';
import { <xsl:value-of select="$od/Name" />DialogComponent } from './<xsl:value-of select="translate($od/PluralName, $ucletters, $lcletters)" />/<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />-dialog/<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />-dialog.component';</xsl:for-each>


export class DerivedDataDeclarations {
    static derivedDeclarations = [
<xsl:for-each select="//ObjectDefs/ObjectDef"><xsl:variable name="od" select="." />
        <xsl:value-of select="$od/PluralName" />Component,
        <xsl:value-of select="$od/Name" />Component,
        <xsl:value-of select="$od/Name" />DialogComponent,</xsl:for-each>
    ]

    static derivedEntryComponents = [
<xsl:for-each select="//ObjectDefs/ObjectDef"><xsl:variable name="od" select="." />
        <xsl:value-of select="$od/Name" />DialogComponent,</xsl:for-each>
    ]

    static derivedPages: any[] = [
        {
            path: 'data',
            component: DataComponent,
        },
<xsl:for-each select="//ObjectDefs/ObjectDef"><xsl:variable name="od" select="." />
        {
            path: 'data/<xsl:value-of select="translate($od/PluralName, $ucletters, $lcletters)" />',
            component: <xsl:value-of select="$od/PluralName" />Component,
        },
        {
            path: 'data/<xsl:value-of select="translate($od/PluralName, $ucletters, $lcletters)" />/<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />',
            component: <xsl:value-of select="$od/Name" />Component
        },
        {
            path: 'data/<xsl:value-of select="translate($od/PluralName, $ucletters, $lcletters)" />/<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />/:<xsl:value-of select="translate($od/Name, $ucletters, $lcletters)" />Id',
            component: <xsl:value-of select="$od/Name" />Component
        },</xsl:for-each>
    ];
};

</xsl:element>
                </FileSetFile>
            <FileSetFile>
                <RelativePath>
                <xsl:text>base-data-component.ts</xsl:text></RelativePath>
                <FileContents>import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'ngx-base-data'
})
export class BaseDataComponent  {

  public tables: { title: string, link: string}[] = [
<xsl:for-each select="//ObjectDefs/ObjectDef"><xsl:variable name="od" select="." />
    {
      title: '<xsl:value-of select="$od/PluralName" />',
      link: '<xsl:value-of select="translate($od/PluralName, $ucletters, $lcletters)" />',
    },</xsl:for-each>
  ];
}</FileContents>
            </FileSetFile>                
            </FileSetFiles>
        </FileSet>
    </xsl:template>

    <xsl:template name="get-type">
      <xsl:choose>
      <xsl:when test="normalize-space(translate(DataType, $ucletters, $lcletters))='date' or normalize-space(translate(DataType, $ucletters, $lcletters))='datetime'">string</xsl:when>
      <xsl:when test="count(.//Relationship) > 0">array</xsl:when>
      <xsl:otherwise>string</xsl:otherwise>
      </xsl:choose>
    </xsl:template>
</xsl:stylesheet>

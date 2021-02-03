import { NgModule } from '@angular/core';
import { EffortlessRoutingModule } from './effortless-routing.module';
import { NbMenuModule, NbCardModule, NbButtonModule, NbActionsModule, NbSelectModule, NbInputModule, NbTabsetModule, NbIconModule, NbSpinnerModule, NbToggleModule, NbListModule, NbDialogModule } from '@nebular/theme';
import { ThemeModule } from '../@theme/theme.module';
import { EffortlessComponent } from './effortless.component';
import { FormsModule } from '@angular/forms';
import { Ng5SliderModule } from 'ng5-slider';
import { ReloadWidgetComponent } from './widgets/reload-widget/reload-widget.component';
import { Page1Component } from './page1/page1.component';
import { Page2Component } from './page2/page2.component';
import { Page3Component } from './page3/page3.component';
import { DerivedDataDeclarations } from './data/derived-data-declarations';
import { DataComponent } from './data/data.component';
import { JsonEditorModule } from 'ng2-json-editor';
import { ProfileComponent } from './profile/profile.component';

let declarations: any[] = [EffortlessComponent, ReloadWidgetComponent, Page1Component, Page2Component, Page3Component, DataComponent, ProfileComponent];
DerivedDataDeclarations.derivedDeclarations.forEach(feDeclaration => declarations.push(feDeclaration));

@NgModule({
  declarations: declarations,
  imports: [
    EffortlessRoutingModule,
    NbCardModule,
    NbButtonModule,
    NbActionsModule,
    NbTabsetModule,
    JsonEditorModule,
    NbIconModule,
    NbToggleModule,
    NbListModule,
    NbSpinnerModule,
    ThemeModule,
    NbMenuModule,
    FormsModule,
    Ng5SliderModule,
    NbSelectModule,
    NbInputModule,
    NbDialogModule.forChild()
  ],
  entryComponents: DerivedDataDeclarations.derivedEntryComponents
})
export class EffortlessModule {

}

import { NgModule } from '@angular/core';
import { MatButtonModule, } from '@angular/material/button';
import { MatFormFieldModule, } from '@angular/material/form-field';
import { MatIconModule, } from '@angular/material/icon';
import { MatInputModule, } from '@angular/material/input';
import { MatTreeModule } from '@angular/material/tree';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule, } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ClickOutsideModule } from 'ng-click-outside';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { A11yModule } from '@angular/cdk/a11y';
import { BidiModule } from '@angular/cdk/bidi';
import { ObserversModule } from '@angular/cdk/observers';
import { OverlayModule } from '@angular/cdk/overlay';
import { PlatformModule } from '@angular/cdk/platform';
import { PortalModule } from '@angular/cdk/portal';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import { DragDropModule } from '@angular/cdk/drag-drop';

/**
 * NgModule that includes all Material modules.
*/
@NgModule({
    exports: [
        // CDK
        A11yModule,
        BidiModule,
        ObserversModule,
        OverlayModule,
        PlatformModule,
        PortalModule,
        CdkStepperModule,
        CdkTableModule,
        CdkTreeModule,
        DragDropModule,
        // Material
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatToolbarModule,
        MatListModule,
        MatSidenavModule,
        FormsModule,
        MatTreeModule,
        ReactiveFormsModule,
        ClickOutsideModule,
    ]
})
export class MaterialModule { }
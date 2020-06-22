import { NgModule } from '@angular/core';
import { MatFormFieldModule, } from '@angular/material/form-field';
import { MatIconModule, } from '@angular/material/icon';
import { MatInputModule, } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule, } from '@angular/material/sidenav';
import { ClickOutsideModule } from 'ng-click-outside';
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";

import { A11yModule } from '@angular/cdk/a11y';
import { BidiModule } from '@angular/cdk/bidi';
import { ObserversModule } from '@angular/cdk/observers';
import { OverlayModule } from '@angular/cdk/overlay';
import { PlatformModule } from '@angular/cdk/platform';
import { PortalModule } from '@angular/cdk/portal';
import { DragDropModule } from "@angular/cdk/drag-drop";

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
        DragDropModule,
        // Material
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatToolbarModule,
        MatListModule,
        MatSidenavModule,
        FormsModule,
        ClickOutsideModule,
        MatButtonModule,
        MatSlideToggleModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
    ]
})
export class MaterialModule { }
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomDialogComponent } from './components/custom-dialog/custom-dialog.component';
import { MaterialModule } from './material/material.module';
import { IconModule } from '@visurel/iconify-angular';
import { FlexLayoutModule } from '@angular/flex-layout';



@NgModule({
  declarations: [
    CustomDialogComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    IconModule
  ],
  exports: [
    CustomDialogComponent,
  ]
})
export class SharedModule { }

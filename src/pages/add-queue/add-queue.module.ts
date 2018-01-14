import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddQueuePage } from './add-queue';

@NgModule({
  declarations: [
    AddQueuePage,
  ],
  imports: [
    IonicPageModule.forChild(AddQueuePage),
  ],
  entryComponents:[
    AddQueuePage
  ]
})
export class AddQueuePageModule {}

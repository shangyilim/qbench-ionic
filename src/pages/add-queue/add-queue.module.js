import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddQueuePage } from './add-queue';
var AddQueuePageModule = (function () {
    function AddQueuePageModule() {
    }
    AddQueuePageModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        AddQueuePage,
                    ],
                    imports: [
                        IonicPageModule.forChild(AddQueuePage),
                    ],
                    entryComponents: [
                        AddQueuePage
                    ]
                },] },
    ];
    /** @nocollapse */
    AddQueuePageModule.ctorParameters = function () { return []; };
    return AddQueuePageModule;
}());
export { AddQueuePageModule };
//# sourceMappingURL=add-queue.module.js.map
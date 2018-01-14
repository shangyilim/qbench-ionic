import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AddQueuePageModule } from '../pages/add-queue/add-queue.module';
export var firebaseConfig = {
    apiKey: "AIzaSyCMNURdOLSYK5-aSW2TT0ycZvdthVQmhNE",
    authDomain: "qhae-819ce.firebaseapp.com",
    databaseURL: "https://qhae-819ce.firebaseio.com",
    projectId: "qhae-819ce",
    storageBucket: "qhae-819ce.appspot.com",
    messagingSenderId: "672528050964"
};
var AppModule = (function () {
    function AppModule() {
    }
    AppModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        MyApp,
                        HomePage,
                    ],
                    imports: [
                        BrowserModule,
                        IonicModule.forRoot(MyApp),
                        AngularFireModule.initializeApp(firebaseConfig),
                        AngularFireAuthModule,
                        AngularFirestoreModule,
                        AddQueuePageModule
                    ],
                    bootstrap: [IonicApp],
                    entryComponents: [
                        MyApp,
                        HomePage,
                    ],
                    providers: [
                        StatusBar,
                        SplashScreen,
                        { provide: ErrorHandler, useClass: IonicErrorHandler }
                    ]
                },] },
    ];
    /** @nocollapse */
    AppModule.ctorParameters = function () { return []; };
    return AppModule;
}());
export { AppModule };
//# sourceMappingURL=app.module.js.map
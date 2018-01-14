import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { URLSearchParams } from "@angular/http";
import * as firebase from 'firebase';
import { AddQueuePage } from '../add-queue/add-queue';
var HomePage = (function () {
    function HomePage(navCtrl, modalCtrl, afAuth, afs) {
        this.navCtrl = navCtrl;
        this.modalCtrl = modalCtrl;
        this.afAuth = afAuth;
        this.afs = afs;
        this.getPlaceInfo();
    }
    HomePage.prototype.ionViewDidEnter = function () {
        this.checkLogin();
    };
    HomePage.prototype.login = function () {
        this.afAuth.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
    };
    HomePage.prototype.checkLogin = function () {
        var _this = this;
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                _this.user = user;
                _this.getQueueInfo(user);
                console.log('user is present');
            }
            else {
                console.log('user is not present');
            }
        });
    };
    HomePage.prototype.getPlaceInfo = function () {
        var params = new URLSearchParams(window.location.search);
        this.placeId = params.get('?place');
        if (this.placeId != null) {
            var placeDoc = this.afs.collection('places').doc(this.placeId);
            this.place = placeDoc.valueChanges();
        }
    };
    HomePage.prototype.getQueueInfo = function (user) {
        var _this = this;
        var uid = user.providerData[0].uid;
        var params = new URLSearchParams(window.location.search);
        this.placeId = params.get('?place');
        if (this.placeId != null) {
            var queueDoc = this.afs.collection('queues')
                .doc(this.placeId)
                .collection('items')
                .doc(uid.toString());
            queueDoc.valueChanges().subscribe(function (d) {
                console.log("value of queue", d);
                _this.yourQueue = d;
            });
        }
    };
    HomePage.prototype.addQueue = function () {
        var _this = this;
        var queueModal = this.modalCtrl.create(AddQueuePage, {
            displayName: this.user.displayName,
            uid: this.user.providerData[0].uid,
            placeId: this.placeId
        });
        queueModal.present();
        queueModal.onDidDismiss(function (data) {
            if (data) {
                _this.yourQueue = data.queue;
            }
        });
    };
    HomePage.decorators = [
        { type: Component, args: [{
                    selector: 'page-home',
                    templateUrl: 'home.html'
                },] },
    ];
    /** @nocollapse */
    HomePage.ctorParameters = function () { return [
        { type: NavController, },
        { type: ModalController, },
        { type: AngularFireAuth, },
        { type: AngularFirestore, },
    ]; };
    return HomePage;
}());
export { HomePage };
//# sourceMappingURL=home.js.map
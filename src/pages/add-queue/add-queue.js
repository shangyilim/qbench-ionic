var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
/**
 * Generated class for the AddQueuePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var AddQueuePage = (function () {
    function AddQueuePage(navCtrl, navParams, viewCtrl, loadingCtrl, afs) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.loadingCtrl = loadingCtrl;
        this.afs = afs;
        this.queue = {
            totalPeople: 0,
            status: 'waiting',
            createdOn: new Date()
        };
        this.queue.displayName = navParams.get('displayName');
        this.queue.placeId = navParams.get('placeId');
        this.queue.uid = navParams.get('uid');
    }
    AddQueuePage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad AddQueuePage', this.queue);
    };
    AddQueuePage.prototype.addPeople = function (qty) {
        this.queue.totalPeople += qty;
    };
    AddQueuePage.prototype.save = function () {
        var _this = this;
        var loader = this.loadingCtrl.create({
            content: "Please wait..."
        });
        loader.present();
        var placeDoc = this.afs.collection('places').doc(this.queue.placeId);
        placeDoc.ref.get().then(function (doc) {
            var place = doc.data();
            place.sequence++;
            return place;
        })
            .then(function (updatedPlace) {
            placeDoc.set(updatedPlace);
            return updatedPlace;
        })
            .then(function (updatedPlace) {
            _this.queue.queNumber = updatedPlace.sequence;
            _this.afs.collection('queues')
                .doc(_this.queue.placeId)
                .collection("items")
                .doc(_this.queue.uid.toString())
                .set(_this.queue)
                .then(function (queue) {
                loader.dismiss();
                _this.viewCtrl.dismiss({ queue: queue });
            });
        });
    };
    AddQueuePage.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    AddQueuePage.decorators = [
        { type: Component, args: [{
                    selector: 'page-add-queue',
                    templateUrl: 'add-queue.html',
                },] },
    ];
    /** @nocollapse */
    AddQueuePage.ctorParameters = function () { return [
        { type: NavController, },
        { type: NavParams, },
        { type: ViewController, },
        { type: LoadingController, },
        { type: AngularFirestore, },
    ]; };
    /**
     * Generated class for the AddQueuePage page.
     *
     * See https://ionicframework.com/docs/components/#navigation for more info on
     * Ionic pages and navigation.
     */
    AddQueuePage = __decorate([
        IonicPage(),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            ViewController,
            LoadingController,
            AngularFirestore])
    ], AddQueuePage);
    return AddQueuePage;
}());
export { AddQueuePage };
//# sourceMappingURL=add-queue.js.map
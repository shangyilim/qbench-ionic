import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { Queue, Place } from '../../interfaces';
/**
 * Generated class for the AddQueuePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-queue',
  templateUrl: 'add-queue.html',
})
export class AddQueuePage {

  queue: Queue = {
    totalPeople: 0,
    status: 'waiting',
    createdOn: new Date(),
    reminderCounter: 0
  };
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private loadingCtrl: LoadingController,
    private afs: AngularFirestore) {
    this.queue.displayName = navParams.get('displayName');
    this.queue.placeId = navParams.get('placeId');
    this.queue.uid = navParams.get('uid');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddQueuePage', this.queue);
  }

  addPeople(qty: number) {
    this.queue.totalPeople += qty;
  }

  save() {
     let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();

    let placeDoc = this.afs.collection('places').doc<Place>(this.queue.placeId);
    placeDoc.ref.get().then(doc => {

      let place = doc.data() as Place;

      place.sequence++;
      return place;
    })
      .then(updatedPlace => {
        placeDoc.set(updatedPlace);
        return updatedPlace;
      })
      .then(updatedPlace => {
        this.queue.queNumber = updatedPlace.sequence;
        this.queue.placeName = updatedPlace.name;
        
        this.afs.collection('queues')
          .doc(this.queue.placeId)
          .collection("items")
          .doc(this.queue.uid.toString())
          .set(this.queue)
          .then(queue => {
            loader.dismiss();
            this.viewCtrl.dismiss({ queue });
          });

      });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}

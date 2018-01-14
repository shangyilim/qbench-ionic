import { Component } from '@angular/core';
import { NavController, ModalController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { URLSearchParams } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';

import { Place, Queue } from '../../interfaces';
import { AddQueuePage } from '../add-queue/add-queue';
import { AdminPage } from '../admin/admin';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  user: firebase.User;
  place: Place;
  placeId: string;
  yourQueue: Queue;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public afAuth: AngularFireAuth,
    private afs: AngularFirestore) {
    let params = new URLSearchParams(window.location.search);
    const adminParam = params.get('admin');
    if (adminParam) {
      this.navCtrl.setRoot(AdminPage);
    }


    this.getPlaceInfo();
  }

  ionViewDidEnter() {
    this.checkLogin();
  }

  login() {
    this.afAuth.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
  }

  checkLogin() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.user = user;
        this.getQueueInfo(user);
        console.log('user is present');

        this.requestPermission();

        this.listenToMessages();
      }
      else {
        console.log('user is not present');
      }
    });

  }

  getPlaceInfo() {
    let params = new URLSearchParams(window.location.search);
    this.placeId = params.get('?place');

    if (this.placeId != null) {
      const placeDoc = this.afs.collection('places').doc<Place>(this.placeId);

      placeDoc.valueChanges().subscribe(p=>{
        this.place = p;
      })
    }
  }

  getQueueInfo(user: firebase.User) {
    const uid = user.providerData[0].uid;
    let params = new URLSearchParams(window.location.search);
    this.placeId = params.get('?place');
    if (this.placeId != null) {

      const queueDoc = this.afs.collection('queues')
        .doc(this.placeId)
        .collection('items')
        .doc<Queue>(uid.toString());

      queueDoc.valueChanges().subscribe(d => {
        console.log("value of queue", d);
        this.yourQueue = d;
      });
    }
  }

  addQueue() {
    let queueModal = this.modalCtrl.create(AddQueuePage, {
      displayName: this.user.displayName,
      uid: this.user.providerData[0].uid,
      placeId: this.placeId
    });

    queueModal.present();

    // queueModal.onDidDismiss(data => {
    //   if (data) {
    //     this.yourQueue = data.queue;
    //   }
    // })
  }

  requestPermission() {

    firebase.messaging()
    .requestPermission()
    .then(r => { console.log('permission granted'); })
    .catch(err=> {console.log(err)});
    
    firebase.messaging()
      .getToken()
      .then(currentToken => {
        console.log('token value:' + currentToken);
        this.afs.collection('users').doc(this.user.providerData[0].uid).set({
          deviceToken: currentToken
        });
      })
      .catch(err => {
        console.error('error', err);
      });
  }

  listenToMessages() {
    firebase.messaging().onMessage((payload: any) => {
      console.log('message received');

      let alert = this.alertCtrl.create({
        title: payload.data.title,
        subTitle: payload.data.description,
        buttons: ['OK']
      });
      alert.present();
    });
  }

  cancel(queue: Queue) {
    let params = new URLSearchParams(window.location.search);
    this.placeId = params.get('?place');

    if (this.placeId != null) {

      const queueDoc = this.afs
        .collection('queues')
        .doc(this.placeId)
        .collection<Queue>('items')
        .doc(queue.uid).update({
          status: 'cancelled',
          cancelledOn: new Date()
        });

    }
  }

  delay(queue: Queue) {
    let params = new URLSearchParams(window.location.search);
    this.placeId = params.get('?place');

    if (this.placeId != null) {

      const queueDoc = this.afs
        .collection('queues')
        .doc(this.placeId)
        .collection<Queue>('items')
        .doc(queue.uid).update({
          status: 'delay',
        });

    }
  }




}

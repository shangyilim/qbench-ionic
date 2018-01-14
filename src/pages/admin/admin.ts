import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/combineLatest';
import { Place, Queue } from '../../interfaces';
/**
 * Generated class for the AdminPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage {
  user: firebase.User;
  placeId: string;
  waitingQueuesObservable: Observable<Queue[]>;
  readyQueuesObservable: Observable<Queue[]>;

  currentTimeSubject: BehaviorSubject<Date> = new BehaviorSubject(new Date());

  constructor(public navCtrl: NavController, public navParams: NavParams, private afs: AngularFirestore) {
    this.checkLogin();

    setInterval(() => {
      this.currentTimeSubject.next(new Date());
    }, 30000);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminPage');
  }

  checkLogin() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.user = user;
        this.getQueueInfo();
      }
      else {
      }
    });

  }

  getQueueInfo() {
    let params = new URLSearchParams(window.location.search);
    this.placeId = params.get('place');

    if (this.placeId != null) {

      const waitingQueueDocs = this.afs
        .collection('queues')
        .doc(this.placeId)
        .collection<Queue>('items', ref => ref.where('status', '==', 'waiting').orderBy('queNumber'));

      const delayQueueDocs = this.afs
        .collection('queues')
        .doc(this.placeId)
        .collection<Queue>('items', ref => ref.where('status', '==', 'delay').orderBy('queNumber'));
        
      this.waitingQueuesObservable = Observable.combineLatest(waitingQueueDocs.valueChanges(), delayQueueDocs.valueChanges())
      .switchMap((values) => {
        let [waiting, delay] = values;
       return Observable.of(waiting.concat(delay));
      });

      const readyQueueDocs = this.afs
        .collection('queues')
        .doc(this.placeId)
        .collection<Queue>('items', ref => ref.where('status', '==', 'ready').orderBy('queNumber'));

      this.readyQueuesObservable = readyQueueDocs.valueChanges();
    }
  }

  ready(queue: Queue) {
    let params = new URLSearchParams(window.location.search);
    this.placeId = params.get('place');

    if (this.placeId != null) {

      const queueDoc = this.afs
        .collection('queues')
        .doc(this.placeId)
        .collection<Queue>('items')
        .doc(queue.uid).update({
          status: 'ready',
          readyOn: new Date()
        });

    }
  }

  complete(queue: Queue) {
    let params = new URLSearchParams(window.location.search);
    this.placeId = params.get('place');

    if (this.placeId != null) {

      const queueDoc = this.afs
        .collection('queues')
        .doc(this.placeId)
        .collection<Queue>('items')
        .doc(queue.uid).update({
          status: 'complete',
          completedOn: new Date()
        });

    }
  }

  cancel(queue: Queue) {
    let params = new URLSearchParams(window.location.search);
    this.placeId = params.get('place');

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

  remind(queue: Queue) {
    let params = new URLSearchParams(window.location.search);
    this.placeId = params.get('place');

    if (this.placeId != null) {

      const queueDoc = this.afs
        .collection('queues')
        .doc(this.placeId)
        .collection<Queue>('items')
        .doc(queue.uid).update({
          reminderCounter: queue.reminderCounter + 1
        });

    }
  }

  getElapsedTime(latestTime: Date, olderTime: Date) {
    return Math.round((latestTime.getTime() - olderTime.getTime()) / 60000);
  }





}

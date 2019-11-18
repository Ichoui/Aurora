import { OneSignal } from '@ionic-native/onesignal/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { GOOGLE_PROJECT_NUMBER, ONESIGNAL_APP_ID } from '../environments/keep';

export class Notifications {

    constructor(
        private platform: Platform,
        private oneSignal: OneSignal,
        private alertCtrl: AlertController) {
    }

    isCordova(): void {
        console.log('cc');
        if (this.platform.is('cordova')) {
            this.setupPush();
        }

        /*        const notificationOpenedCallback = function (jsonData) {
                    console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
                };
                const notificationReceivedCallback = function (jsonData) {
                    console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
                };

                window['plugins'].OneSignal
                    .startInit(ONESIGNAL_APP_ID, GOOGLE_PROJECT_NUMBER)
                    .handleNotificationOpened(notificationOpenedCallback)
                    .handleNotificationReceived(notificationReceivedCallback)
                    .endInit();
                // soit c'est l'un soit c'est l'autre*/
    }

    setupPush() {
        // //I recommend to put these into your environment.ts
        this.oneSignal.startInit(ONESIGNAL_APP_ID, GOOGLE_PROJECT_NUMBER);

        this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

        // Notifcation was received in general
        this.oneSignal.handleNotificationReceived().subscribe(data => {
            console.log(data);
            let msg = data.payload.body;
            let title = data.payload.title;
            // let additionalData = data.payload.additionalData;
            // console.log(additionalData);
            this.showAlert(title, msg);
        });


        console.log(this.oneSignal);

        // Notification was really clicked/opened
        this.oneSignal.handleNotificationOpened().subscribe(data => {
            // Just a note that the data is a different place here!
            let additionalData = data.notification.payload.additionalData;

            this.showAlert('Notification opened', 'You already read this before', additionalData.task);
        });

        this.oneSignal.endInit();
    }

    async showAlert(title, msg, task?) {
        console.log('?');
        const alert = await this.alertCtrl.create({
            header: title,
            subHeader: msg,
            buttons: [
                {
                    text: `OK`,
                    handler: e => {
                        console.log(e);
                        // E.g: Navigate to a specific screen
                    }
                }
            ]
        });
        alert.present();
    }


    push() {
        // --> https://documentation.onesignal.com/docs/using-postman
        // POST --> https://onesignal.com/api/v1/notifications
        const notif = {
            'app_id': ONESIGNAL_APP_ID,
            'included_segments': ['All'],
            'headings': {'en': 'Cool cool cool cool cool'},
            'contents': {'en': 'Salut Salut salut'},
            'url': 'https://onesignal.com'
        };
    }
}

import * as firebase from 'firebase'
import * as firestore from 'firebase/firestore'

export class Firebase {

    constructor() {

        this.init();

    }

    init(){

        if (!window._initializedFirebase) {

            firebase.initializeApp({
                apiKey: 'minha chave',
                authDomain: 'dominio do projeto no firebase',
                projectId: 'nome id do projeto',
                storageBucket: 'url no storagebucket'
            });

            firebase.firestore().settings({
                timestampsInSnapshots: true
            });

            window._initializedFirebase = true;

        }

    }
    //autentição do usuario pelo google
    initAuth(){

        return new Promise((resolve, reject)=>{

            let provider = new firebase.auth.GoogleAuthProvider();

            firebase.auth().signInWithPopup(provider).then(function (result) {

                let token = result.credential.accessToken;
                let user = result.user;

                resolve(user, token);

            }).catch(function (error) {

                reject(error);

            });

        });        

    }

    static db(){

        return firebase.firestore();

    }

    static hd() {

        return firebase.storage();

    }

}
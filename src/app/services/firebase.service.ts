    import { Injectable, inject } from '@angular/core';
    import {AngularFireAuth} from '@angular/fire/compat/auth';
    import {getAuth, signInWithEmailAndPassword,createUserWithEmailAndPassword,updateProfile,sendPasswordResetEmail} from 'firebase/auth';
    import { User } from '../models/user.model';
    import {AngularFirestore} from  '@angular/fire/compat/firestore';
    import {getFirestore,setDoc,doc,getDoc,addDoc,collection,collectionData,query,updateDoc,deleteDoc} from '@angular/fire/firestore'
    import { UtilsService } from './utils.service';
    import { AngularFireStorage } from '@angular/fire/compat/storage';
    import {getStorage,uploadString,ref,getDownloadURL,deleteObject} from "firebase/storage"

    @Injectable({
      providedIn: 'root'
    })
    export class FirebaseService {

      auth = inject(AngularFireAuth);
      storage = inject(AngularFireStorage);
      firestore = inject(AngularFirestore);
      utilsSvc = inject(UtilsService);

      //=========== Autenticación==========
    getAuth(){
      return getAuth();
    }

    //=== Acceder =====
    sigIn(user: User){
      return signInWithEmailAndPassword(getAuth(),user.email,user.password)
    }

    //=== Crear Usuario =====
    sigUp(user: User){
      return createUserWithEmailAndPassword(getAuth(),user.email,user.password)
    }
    //=== Actualizar Usuario====
    updateUser(displayName: string){
      return updateProfile(getAuth().currentUser, {displayName})

    }

    //======= email para reestablecer contraseña ====
    sendRecoveryEmail(email:string){
      return sendPasswordResetEmail(getAuth(),email);
    }
    //====== Cerrar sesión =======
    signOut(){
      getAuth().signOut();
      localStorage.removeItem('user');
      this.utilsSvc.routerLink('/auth');
    }

    //====== Base de datos ============================

    // Documento de coleccion

    getCollectionData(path: string,collectioQuery?:any){
    const ref = collection(getFirestore(),path);
    return collectionData(query( ref,...collectioQuery),{idField:'id'});

    }

    //==== setear documento===
    setDocument(path: string,data: any) {
      return setDoc(doc(getFirestore(),path),data);
    }
      //==== Actuualizar documento===
    updateDocument(path: string,data: any) {
      return updateDoc(doc(getFirestore(),path),data);
    }

      // Borrar producto

      deleteDocument(path: string) {
        return deleteDoc(doc(getFirestore(),path));
    }
    //====== obtener documento ======
    async getDocument(path:string){
      return (await getDoc(doc(getFirestore(),path))).data();
    }

      addDocument(path: string,data: any) {
        return addDoc(collection(getFirestore(),path),data);
      }

    async uploadImage(path:string, data_url:string){
        return uploadString(ref(getStorage(),path),data_url,'data_url').then(()=>{
          return getDownloadURL(ref(getStorage(),path))
        })
      }

    // obtener ruta imagen
    async getFilePath(url:string){
  return ref(getStorage(),url).fullPath
    }

    // Eliminar product o archivo

    deletefile(path:string){
      return deleteObject(ref(getStorage(),path));
      
    }

    }

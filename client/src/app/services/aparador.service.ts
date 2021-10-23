import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Aparador } from '../models/aparador';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class AparadorService {
  	public url:string;
	public identity
	public token;
  	public stats;
  
  constructor(public _http: HttpClient) { 
		this.url = GLOBAL.url;
	}

	/** Método para sacar el TOKEN del LOCALSTORAGE **/
	getToken(){
		let token = JSON.parse(localStorage.getItem('token'));

		if (token != undefined){
			this.token = token;
		}else{
			this.token = null;
		}
		return this.token;
	}


  	 /** Método para sacar LISTA de APARADORES **/
	getAparadores():Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken());

		return this._http.get(this.url+'aparadores/', {headers:headers});
	}
}

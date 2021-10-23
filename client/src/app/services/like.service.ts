import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Like } from '../models/like';
import { GLOBAL } from './global';

@Injectable({
  	providedIn: 'root'
})
export class LikeService {
	public url: string;

  	constructor(public _http: HttpClient) {
  		this.url = GLOBAL.url;
   	}

   	/** Metodo para agregar like a una publicación **/
   	addLikes(token, like): Observable<any>{
   		let params = JSON.stringify(like);
		let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

		return this._http.post(this.url+'like', params, {headers:headers});
   	}

   	/** Metodo para borrar el like de una publicación **/
   	deleteLikes(token, publication_id):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

		return this._http.delete(this.url+'like/'+publication_id, {headers:headers});
	}

	/** Metodo para imprimir likes por publicación **/
	getCountLikes(token, publication_id = null):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

		var url = this.url+'publication/';
		if(publication_id != null) {
			url = this.url+'publication/'+publication_id;
		}

		return this._http.get(url, {headers:headers});	
	}
}

import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../../services/global';
import { Aparador } from '../../models/aparador';

import { AparadorService } from 'src/app/services/aparador.service';
import { UserService } from '../../services/user.service';

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-aparadores',
  templateUrl: './aparadores.component.html',
  styleUrls: ['./aparadores.component.css']
})

export class AparadoresComponent implements OnInit {
  public title: string;
  public status;
  public page;				// Página actual
  public pages;				// Total de páginas
  public items_per_page;
  public showImage;
  public next_page;		// Página siguiente
  public prev_page;		// Página previa
  public total;
  public loading: boolean;
  public noMore: boolean;			// true = no hay más páginas
  public identity;
  public url : string;
  public aparadores: Aparador[];
  public token;
  public paginas;			// Array con el número de páginas (para paginación)

  constructor(
    	private _route             : ActivatedRoute,
		private _router            : Router,
		private _userService       : UserService,
		private _aparadorService   : AparadorService
  	) { 
		this.title    = "Aparadores";
    	this.identity  = _userService.getIdentity();
		this.token     = _userService.getToken();
		this.url       = GLOBAL.url;
		this.page      = 1;
		this.noMore    = false;
		this.showImage = 0;
		this.loading   = true;
	  }

	  ngOnInit() {
		this.actualPage();
	}

  actualPage(){
	this._route.params.subscribe(params => {
		let page = 1;

		if(params['page']) {
			page = +params['page']; //--> con el signo +, convertimos a entero
		}
		this.page = page;
		this.next_page = page+1;
		this.prev_page = page-1;
		if(this.prev_page <= 0){
			this.prev_page = 1;
		}

		// devolver listado de usuarios
		this.getAparadores();
	});
}

	/** Método para cargar las APARADORES. Si adding es true entonces añade páginas **/
	getAparadores(){
		this._aparadorService.getAparadores().subscribe(
			response => {
				if(!response.aparadores){
					this.loading = false;
					this.status = 'error';
				}else{
					this.loading = false;
					this.status = 'success';
					this.total = response.total;
					this.aparadores = response.aparadores;
					this.pages = response.pages;
					// this.follows = response.users_following;
					this.paginas = Array.from(Array(this.pages).keys());
					//Array.apply(null, {length: this.pages}).map(Number.call, Number);
				}
			},
			error => {
				var errorMessage = <any>error;
				console.log(errorMessage);

				if(errorMessage != null){
					this.loading = false;
					this.status = 'error';
				}
			}
			);
	}
}

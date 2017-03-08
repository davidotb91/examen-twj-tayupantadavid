import { Component, OnInit } from '@angular/core';
import {Response, Http} from "@angular/http";
import {NgForm} from "@angular/forms";
import {MasterURLService} from "../services/master-url.service";


@Component({
  selector: 'app-agarre',
  templateUrl: './agarre.component.html',
  styleUrls: ['./agarre.component.css']
})
export class AgarreComponent implements OnInit {
  title: string = "Agarres";

  nuevoAgarre= {};
  agarres = [];
  usuario:any={
    idUsuario: ""
  };
  usuarios=[];
  disabledButtons = {
    nuevoAgarreFormSumitButton: false
  };

  constructor(private _http: Http,
              private  _masterURL: MasterURLService) { }

  ngOnInit() {
    this._http.get(this._masterURL.url + "Agarre")
      .subscribe(
        (res: Response) => {
          this.agarres = res.json()
            .map((value) => {
              value.formularioCerrado = true;
              return value;
            });
        },
        (err) => {
          console.log(err);
        }
      );
    this._http.get(this._masterURL.url + "Usuario")
      .subscribe(
        (res: Response) => {
          this.usuarios = res.json()
            .map((value) => {
              value.formularioCerrado = true;
              return value;
            });
        },
        (err) => {
          console.log(err);
        }
      );
  }
  crearAgarre(formulario: NgForm) {
    console.log("djdddddd");
    console.log(formulario.value);
    this.disabledButtons.nuevoAgarreFormSumitButton = true;
    this._http.post(this._masterURL.url + "Agarre", {
      nombre: formulario.value.nombre,
      veces: formulario.value.veces,
      dineroGastado: formulario.value.dineroGastado,
      idUsuario: formulario.value.idUsuario
    }).subscribe(
      (res) => {
        console.log("No existieron errores");
        console.log(res);
        this.agarres.push(res.json());
        this.nuevoAgarre = {};
        this.disabledButtons.nuevoAgarreFormSumitButton = false;
      },
      (err) => {
        this.disabledButtons.nuevoAgarreFormSumitButton = false;
        console.log("Ocurrio un error", err);
      },
      () => {
        console.log("Se ejecuto a función")
      }
    );
  }

  borrarAgarre(id:number){
    this._http.delete(this._masterURL.url+'Agarre/'+id).subscribe(
      (res)=>{
        let evidenciaBorrada=res.json();
        this.agarres=this.agarres.filter(value=>evidenciaBorrada.id!=value.id);
      },
      (err)=>{
        console.log(err);
      }
    );
  }

  actualizarAgarre(Agarre:any, id:number){
    let parametros={
      nombre:Agarre.nombre,
      veces: Agarre.veces,
      dineroGastado: Agarre.dineroGastado

    };
    this._http.put(this._masterURL.url+"Agarre/"+id,parametros).subscribe(
      (res:Response)=>{
        Agarre.formularioCerrado=!Agarre.formularioCerrado;
        console.log("Respuesta:",res.json());
      },
      (err) => {
        console.log("Error: ", err);
      }
    );
  }



}

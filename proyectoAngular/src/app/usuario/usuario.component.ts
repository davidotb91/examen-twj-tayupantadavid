import { Component, OnInit } from '@angular/core';
import {Http, Response} from "@angular/http";
import {MasterURLService} from "../services/master-url.service";
import {NgForm} from "@angular/forms";
@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  title: string = "Bienvenido a Ingresar Usuarios";
  nuevoUsuario = {};
  usuarios = [];
  disabledButtons = {
    NuevoUsuarioFormSubmitButton: false
  };

  constructor(private _http: Http,
              private _masterURL: MasterURLService) { }

  ngOnInit() {
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
      )
  }
  crearUsuario(formulario: NgForm) {
    console.log(formulario);
    this.disabledButtons.NuevoUsuarioFormSubmitButton = true;
    this._http.post(this._masterURL.url + "Usuario", {
      nombre: formulario.value.nombre,
      preferencia:formulario.value.preferencia,
      fechaNacimiento: formulario.value.fechaNacimiento
    }).subscribe(
      (res) => {
        console.log("No hubo Errores");
        console.log(res);
        this.usuarios.push(res.json());
        this.nuevoUsuario = {};
        this.disabledButtons.NuevoUsuarioFormSubmitButton = false;
      },
      (err) => {
        this.disabledButtons.NuevoUsuarioFormSubmitButton = false;
        console.log("Ocurrio un err or", err);
      },
      () => {
        console.log("Termino")
      }
    );
  }
  borrarUsuario(id: number) {
    this._http.delete(this._masterURL.url + "Usuario/" + id)
      .subscribe(
        (res) => {
          let usuarioBorrado = res.json();
          this.usuarios = this.usuarios.filter(value => usuarioBorrado.id != value.id);
        },
        (err) => {
          console.log(err);
        }
      )
  }
  actualizarUsuario(usuario: any) {
    let parametos = {
      nombre: usuario.nombre
    };
    this._http.put(this._masterURL.url + "Usuario/" + usuario.id, parametos)
      .subscribe(
        (res: Response) => {
          usuario.formularioCerrado = !usuario.formularioCerrado;
          console.log("Respuesta:", res.json());
        },
        (err) => {
          console.log("Error:", err);
        }
      )
  }

}

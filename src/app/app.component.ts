import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { ApiService } from './ApiService/api.service';
import * as moment from 'moment';
import Swal from 'sweetalert2'
import { MatStepper } from '@angular/material/stepper';
import { MAT_DATE_LOCALE} from '@angular/material/core';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    {provide: MomentDateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
]
})
export class AppComponent implements OnInit {
  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  title = 'ElectronicMeters';
  allValues: any = {};
  @ViewChild('f')
  @ViewChild('form')
  form: NgForm;
  vreme: any;
  novaVisaTarifa: any;
  novaNizaTarifa: any;
  submitted: boolean = false;
  @ViewChild('stepper') private myStepper: MatStepper;
  // vreme = new Date();
  constructor(private _formBuilder: FormBuilder, private service: ApiService) {   }
  ngOnInit() {
    // var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    // var  today  = new Date();
    this.vreme = new Date();
    // this.vreme.toLocalString();
    // if(this. vreme) {this.vreme = moment(this.vreme).format('DD-MM-YYY');}

    // this. vreme = moment(this.vreme).format('DD-MM-YYY')
    this.firstFormGroup = this._formBuilder.group({
      ed_broj: ['', [Validators.required, Validators.pattern(/^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/)]]
    });
    this.vreme = new Date();

    this.form.valueChanges.subscribe(value => {
    });
  }
  get f() { return this.firstFormGroup.controls; }
  onSubmitED() {
    this.submitted = true;
    if (this.firstFormGroup.invalid) {
      return;
    }
    this.service.postEd(this.firstFormGroup.value).subscribe(
      data => {
        this.allValues = data;
        this.myStepper.next();
      },
      err => {
        Swal.fire({
          icon: 'error',
          title: 'Грешка...',
          text: 'Нажалост, ЕД број који сте унели не постоји у нашој бази података. Молимо Вас, покушајте поново.',
        })
      });
  }

  onSubmit() {
  }

  onSubmit2() {
    let req = {
      stanje_id: this.allValues.stanje_id,
      centar: this.allValues.centar,
      sektor: this.allValues.sektor,
      ed_broj: this.allValues.ed_broj,
      fabricki_broj: this.allValues.fabricki_broj,
      broj_tarifa: this.allValues.broj_tarifa,
      avt_kwh: this.allValues.avt_kwh ,
      ant_kwh: this.allValues.ant_kwh ,
      vreme: this.vreme,
      avt_kwh_novo: Number(this.novaVisaTarifa),
      ant_kwh_novo: Number(this.novaNizaTarifa),
    }
    if (req.vreme) {
      req.vreme = moment(req.vreme).format('Y-MM-DD')
    }
    this.service.patchData(req)
      .subscribe(
        data => {
          Swal.fire({
            icon: 'success',
            title: 'Успешно сте пријавили стање'
          })
          setTimeout(() => {
            window.location.reload(); //dodao
            // window.location.reload();
            this.myStepper.reset();
          }, 3000);
          this.form.resetForm();
        },
        err => {
          console.log(err);
        });
  }

  goBack(stepper: MatStepper) {
    setTimeout(() => {
      stepper.reset();
    }, 3000);
  }

  goNext(stepper: MatStepper) {
    stepper.next();
  }
}

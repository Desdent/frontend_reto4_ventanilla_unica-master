import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { VacationStatus } from '../../core/enums/vacation-status.enum';
import { VacationType } from '../../core/enums/vacation-type.enum';
import { max } from 'rxjs';
import { DurationAppointments } from '../../core/enums/appointment-duration.enum';

export class CustomValidators {
  static validateEmail(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) return null;

    return !value.match(/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/) ? { invalidEmail: true } : null;
  }

  static validatePassword(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    return !value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{7,50}$/)
      ? { invalidPassword: true }
      : null;
  }

  static validatePhone(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) return null;

    return !value.match(/^(?:\+34|0034)?[6789]\d{8}$/) ? { invalidPhone: true } : null;
  }

  static passwordMatchValidator = (form: AbstractControl) => {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;

    return password === confirm ? null : { passwordMismatch: true };
  };

  // This isn't mine, is from a guy's blog
  static validateDocument(control: AbstractControl): ValidationErrors | null {
    let doc = control.value;

    doc = doc.toUpperCase().trim();

    const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';

    // DNI (8 numbers + letter)
    if (/^[0-9]{8}[A-Z]$/.test(doc)) {
      const numero = parseInt(doc.slice(0, 8), 10);
      if (doc[8] === letras[numero % 23]) return null;
    }

    // NIE (X,Y,Z + 7 numbers + letter)
    if (/^[XYZ][0-9]{7}[A-Z]$/.test(doc)) {
      const map = { X: '0', Y: '1', Z: '2' };
      const numero = parseInt(map[doc[0] as keyof typeof map] + doc.slice(1, 8), 10);
      if (doc[8] === letras[numero % 23]) return null;
    }

    // CIF (companies)
    if (/^[ABCDEFGHJNPQRSUVW][0-9]{7}[0-9A-J]$/.test(doc)) {
      const letrasCif = 'JABCDEFGHI';
      const control = doc[8];
      const digits = doc.slice(1, 8);

      let sumaPar = 0;
      let sumaImpar = 0;

      for (let i = 0; i < digits.length; i++) {
        let num = parseInt(digits[i], 10);

        if (i % 2 === 0) {
          // if it is odd
          let mult = num * 2;
          if (mult > 9) mult = Math.floor(mult / 10) + (mult % 10);
          sumaImpar += mult;
        } else {
          sumaPar += num;
        }
      }

      const total = sumaPar + sumaImpar;
      const unidad = total % 10;
      const digitoControl = unidad === 0 ? 0 : 10 - unidad;

      const letraControl = letrasCif[digitoControl];

      // CIF types base on the first letter
      const tipo = doc[0];

      if ('PQRSNW'.includes(tipo)) {
        // just letter
        if (control === letraControl) {
          return null;
        }
      }

      if ('ABEH'.includes(tipo)) {
        // just number
        if (control === String(digitoControl)) return null;
      }

      // it may be number or letter
      if (control === String(digitoControl) || control === letraControl) return null;
    }

    return { invalidDocument: true };
  }

  static validateDniNie(control: AbstractControl): ValidationErrors | null {
    let doc = control.value;

    if (!doc) return null;

    doc = doc.toUpperCase().trim();

    const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';

    // DNI (8 numbers + letter)
    if (/^[0-9]{8}[A-Z]$/.test(doc)) {
      const numero = parseInt(doc.slice(0, 8), 10);
      if (doc[8] === letras[numero % 23]) return null;
    }

    // NIE (X,Y,Z + 7 numbers + letter)
    if (/^[XYZ][0-9]{7}[A-Z]$/.test(doc)) {
      const map = { X: '0', Y: '1', Z: '2' };
      const numero = parseInt(map[doc[0] as keyof typeof map] + doc.slice(1, 8), 10);
      if (doc[8] === letras[numero % 23]) return null;
    }

    return { invalidDniNie: true };
  }

  static beforeTodayValidator(control: AbstractControl): ValidationErrors | null {
    const date: Date = new Date(control.value);
    const today: Date = new Date();

    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date >= today) {
      return null;
    }

    return { invalidBeforeToday: true };
  }

  static dateRangeValidator(control: AbstractControl): ValidationErrors | null {
    // Instead of being just "contro.value", since it isnt gonna be applied to any specific control, it's required to use it this way
    const start: Date = new Date(control.get('startDate')?.value);
    const end: Date = new Date(control.get('endDate')?.value);

    if (!start || !end) return null;

    return new Date(end) >= new Date(start) ? null : { invalidDateRange: true };
  }

  static validateVacationStart(control: AbstractControl): ValidationErrors | null {
    const start: Date = new Date(control.get('startDate')?.value);
    const type: string = control.get('type')?.value;
    const today: Date = new Date();

    if (start.getTime() - today.getTime() > 1209600000) return null;

    if (start.getTime() - today.getTime() < 1209600000 && type == VacationType.MEDICAL) return null;

    if (start.getTime() - today.getTime() < 1209600000 && type == VacationType.PERSONAL)
      return null;

    return { invalidVacationStart: true };
  }

  static validateExtraTIme(control: AbstractControl): ValidationErrors | null {
    const value: number = Number(control.get('extraTime')?.value);
    const appointmentDuration: number = control.get('appointmentDuration')?.value;

    if (value <= appointmentDuration * 0.2) return null;
    console.log('max: ', appointmentDuration * 0.2);
    return { isExtraTimeInvalid: true };
  }

  static validateAppointmentDuration(control: AbstractControl): ValidationErrors | null {
    const value: number = Number(control.value);
    const durations: number[] = Object.values(DurationAppointments).filter(
      (value) => typeof value == 'number',
    );
    console.log(value);
    console.log(durations);

    if (durations.includes(value)) return null;

    return { isAppointmentDurationInvalid: true };
  }
}

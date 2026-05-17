import { DatePipe } from '@angular/common';
import { PublicActivityResponseDto } from '../../core/dto/activity/public-activity-response.dto';
import { Schedule } from '../../core/models/schedule/schedule';
import { PublicWorker } from '../../core/models/user/public-worker';
import { Vacation } from '../../core/models/vacation/vacation';

/**
 * This function, obtaining the workdays as number to be able to compare them, is responsible of creating the next 7 available days to pick from for an appoinitment
 *
 * @export
 * @class Utils
 * @typedef {Utils}
 */
export class Utils {
  constructor(private datePipe: DatePipe) {}
  static CalculateWeekOfWork(
    schedule: Schedule,
    approvedVacations: Vacation[],
    activity: PublicActivityResponseDto,
  ): Date[] {
    let day: Date = new Date();

    let i: number = 0;
    let valid: boolean = true;
    let workdaysInNumber: number[] = [];

    if (activity) workdaysInNumber = this.translateDays(activity.workdays!);
    else {
      workdaysInNumber = this.translateDays(schedule.workdays);
    }

    let next7workDays: Date[] = [];

    do {
      // I think is visually clearer doing it with various "if"
      console.log(schedule);
      // First, it verifies the day which is iterating is in the workdays of the week, parsing them as numbers
      if (workdaysInNumber.includes(day.getDay())) {
        // Secondly, it verifies the day isn't a festivity day
        if (
          !schedule.festivities ||
          !schedule.festivities?.some((f) => new Date(f).toDateString() === day.toDateString())
        ) {
          // Lastly, it verifies the day isn't in any vacation period for the worker approved vacations
          for (let j = 0; j < approvedVacations.length; j++) {
            if (day >= approvedVacations[j].startDate && day <= approvedVacations[j].endDate) {
              valid = false;
              break;
            }
          }
          if (valid == true) {
            next7workDays.push(new Date(day));
            i++;
          }
        }
      }
      day.setDate(day.getDate() + 1);
      valid = true;
    } while (i < 7);

    return next7workDays;
  }

  static Calculate2WeeksOfWork(
    schedule: Schedule,
    approvedVacations: Vacation[],
    activity: PublicActivityResponseDto,
  ): Date[] {
    let day: Date = new Date();

    let i: number = 0;
    let valid: boolean = true;

    let workdaysInNumber: number[] = this.translateDays(activity.workdays!);

    let next7workDays: Date[] = [];

    do {
      // I think is visually clearer doing it with various "if"

      // First, it verifies the day which is iterating is in the workdays of the week, parsing them as numbers
      if (workdaysInNumber.includes(day.getDay())) {
        // Secondly, it verifies the day isn't a festivity day
        if (
          !schedule.festivities ||
          !schedule.festivities?.some((f) => f.toDateString() === day.toDateString())
        ) {
          // Lastly, it verifies the day isn't in any vacation period for the worker approved vacations
          for (let j = 0; j < approvedVacations.length; j++) {
            if (day >= approvedVacations[j].startDate && day <= approvedVacations[j].endDate) {
              valid = false;
              break;
            }
          }
          if (valid == true) {
            next7workDays.push(new Date(day));
            i++;
          }
        }
      }
      day.setDate(day.getDate() + 1);
      valid = true;
    } while (i < 14);

    return next7workDays;
  }

  /**
   * The reason of existence of this function is very cheap
// I can't come to an elegant idea of how to verify there are 7 work days between the current one and 7 work days later
// because one schedule can be from Mon-Fri, another one from Tue-Sat, etc
// So, getDay gives you the number of the day of a new date, therefore, this function "translates" the schedule of the company
// to number, so I can compare them with `new date() + seconds.getDay()` more easily
// This idea is not easily scalable so, isntead of doing it in the module, I'm doing it here so if anyone changes how the days of the schedules are stored
// in the database, here can add or change it and freely use it in the rest of the app
   *
   * @public
   * @static
   * @param {string[]} workdays 
   * @returns {{}} 
   */
  public static translateDays(workdays: string[]) {
    let cont = 0;
    let days: number[] = [];

    while (cont < workdays.length) {
      if (
        workdays[cont].toLocaleLowerCase() == 'monday' ||
        workdays[cont].toLocaleLowerCase() == 'mon' ||
        workdays[cont].toLocaleLowerCase() == 'mo'
      )
        days.push(1);

      if (
        workdays[cont].toLocaleLowerCase() == 'tuesday' ||
        workdays[cont].toLocaleLowerCase() == 'tue' ||
        workdays[cont].toLocaleLowerCase() == 'tu'
      )
        days.push(2);

      if (
        workdays[cont].toLocaleLowerCase() == 'wednesday' ||
        workdays[cont].toLocaleLowerCase() == 'wed' ||
        workdays[cont].toLocaleLowerCase() == 'we'
      )
        days.push(3);

      if (
        workdays[cont].toLocaleLowerCase() == 'thursday' ||
        workdays[cont].toLocaleLowerCase() == 'thu' ||
        workdays[cont].toLocaleLowerCase() == 'th'
      )
        days.push(4);

      if (
        workdays[cont].toLocaleLowerCase() == 'friday' ||
        workdays[cont].toLocaleLowerCase() == 'fri' ||
        workdays[cont].toLocaleLowerCase() == 'fr'
      )
        days.push(5);

      if (
        workdays[cont].toLocaleLowerCase() == 'saturday' ||
        workdays[cont].toLocaleLowerCase() == 'sat' ||
        workdays[cont].toLocaleLowerCase() == 'sa'
      )
        days.push(6);

      if (
        workdays[cont].toLocaleLowerCase() == 'sunday' ||
        workdays[cont].toLocaleLowerCase() == 'sun' ||
        workdays[cont].toLocaleLowerCase() == 'su'
      )
        days.push(7);

      cont++;
    }

    return days;
  }
}

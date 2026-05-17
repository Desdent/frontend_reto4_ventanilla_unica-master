import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { PublicActivityResponseDto } from '../../../core/dto/activity/public-activity-response.dto';
import { ActivityService } from '../../../core/services/activity/activity.service';

import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { RoomService } from '../../../core/services/room/room.service';

import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { Company } from '../../../core/models/company/company';

@Component({
  standalone: true,
  selector: 'app-directory-list',
  imports: [
    DataViewModule,
    CommonModule,
    CardModule,
    ButtonModule,
    RouterLink,
    ToolbarModule,
    SelectModule,
    FormsModule,
  ],
  templateUrl: './directory-list.html',
  styleUrl: './directory-list.css',
})
export class DirectoryList {
  constructor(
    private activityService: ActivityService,
    private roomService: RoomService,
  ) {}

  // oninit signals
  allActivities = signal<PublicActivityResponseDto[]>([]);
  activities = signal<PublicActivityResponseDto[]>([]);
  floors = signal<number[]>([]);
  activitiesOnFloor: number[] = [];
  isSearching = signal<boolean>(true);

  selectedActivity: PublicActivityResponseDto | null = null;

  //normal variables/signals
  selectedFloor = signal(0);
  optionsFloors = computed(() => ['All', ...this.floors()]);
  searchValue: string = '';
  company: Company | undefined = undefined;

  async ngOnInit() {
    this.isSearching.set(true);
    await this.activityService.getAll().subscribe((response: any) => {
      this.allActivities.set(response.data);
      this.activities.set(this.allActivities());
      this.isSearching.set(false);
    });

    await this.roomService.getAllFloors().subscribe((response: any) => {
      this.floors.set(response);
    });

    this.activities().forEach((activity) => {
      let cont: number = 0;
      activity.floors!.some((floor) => {
        this.floors().includes(floor) ? (this.activitiesOnFloor[cont] = floor) : undefined;
      });
    });
  }

  /**
   * This method handlers the responsability of getting the activities when filtering by floor, and also check if
   * there's already one term being searched, so it only returns services in the floor with the term
   *
   * @param {?(number | string)} [floor]
   */
  getActivities(floor?: number | string) {
    if (!floor || floor == 0) {
      if (!this.searchValue) {
        this.activityService.getAll().subscribe((response: any) => {
          this.activities.set(response.data);
        });
      } else {
        this.activityService.search(this.searchValue).subscribe((response: any) => {
          this.activities.set(response.data);
        });
      }
    } else {
      if (!this.searchValue) {
        floor = +floor;
        this.activityService.getAllByFloor(floor).subscribe((response: any) => {
          this.activities.set(response.data);
        });
      } else {
        this.activityService
          .search(this.searchValue, this.selectedFloor())
          .subscribe((response: any) => {
            this.activities.set(response.data);
          });
      }
    }
  }

  // Don't do this when more than one type element

  /**
   * Manages the list based on the selected floor from the select tag
   *
   * @param {Event} event
   */
  onOptionChange(event: Event) {
    const value: number = parseInt((event.target as HTMLSelectElement).value);
    if (!value) this.selectedFloor.set(0);
    else this.selectedFloor.set(value);
    this.getActivities(value);
    console.log(value);
  }

  // Don't do this when more than one type element

  /**
   * It manages the searching feature for services, while checking if there's an already selected floor, so it search only in the selected floor the asked term when the input
   * detects a keyup
   *
   * @param {Event} event
   */
  onKeyUpHandler(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchValue = target.value;
    console.log(target.value);

    if (this.selectedFloor() != 0 && this.searchValue) {
      this.activityService
        .search(this.searchValue, this.selectedFloor())
        .subscribe((response: any) => {
          this.activities.set(response.data);
        });
    } else if (this.selectedFloor() == 0 && this.searchValue) {
      this.activityService.search(this.searchValue).subscribe((response: any) => {
        this.activities.set(response.data);
      });
    } else if (this.selectedFloor() != 0 && !this.searchValue) {
      this.activityService.getAllByFloor(this.selectedFloor()).subscribe((response: any) => {
        this.activities.set(response.data);
      });
    } else {
      this.activities.set(this.allActivities());
    }
    console.log(this.activities());
  }

  selectActivity(activity: PublicActivityResponseDto) {
    localStorage.setItem('selectedActivity', JSON.stringify(activity));
  }
}

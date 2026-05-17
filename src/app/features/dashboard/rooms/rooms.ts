import { ChangeDetectorRef, Component, ElementRef, inject, signal, ViewChild } from '@angular/core';

import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ScheduleResponseDto } from '../../../core/models/schedule/schedule-response.dto';
import { Roles } from '../../../core/enums/role.enum';

import { jwtDecode } from 'jwt-decode';
import { Payload } from '../../../core/interfaces/payload/payload-structure.interface';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { RoomService } from '../../../core/services/room/room.service';
import { Router } from '@angular/router';
import { RoomWitherCountersResponseDto } from '../../../core/dto/room/room-with-counters.response.dto';
import Konva from 'konva';

import { CounterKonva } from '../../../core/dto/counter/counter-konva';
import { CounterMapper } from '../../../utils/mappers/counter/counter-mapper';
import { Coordinate } from '../../../core/models/room/coordinate';
import { Floor } from '../../../core/enums/Floor.enum';
import { ActivityService } from '../../../core/services/activity/activity.service';
import { ActivityResponseDto } from '../../../core/dto/activity/activity-response.dto';
import { CounterResponseDto } from '../../../core/dto/counter/counter-response.dto';
import { CreateCounterRequestDto } from '../../../core/dto/counter/create-counter-request.dto';
import { CreateRoomRequestDto } from '../../../core/dto/room/create-room-request.dto';

@Component({
  selector: 'app-rooms',
  imports: [DialogModule, ButtonModule, ReactiveFormsModule],
  templateUrl: './rooms.html',
  styleUrl: './rooms.css',
})
export class Rooms {
  constructor(
    private roomService: RoomService,
    private activityService: ActivityService,
  ) {}

  cdr = inject(ChangeDetectorRef);
  fb = inject(FormBuilder);
  router = inject(Router);

  token = signal<string | null>(null);
  payload = signal<Payload | null>(null);
  id = signal<string | null>(null);

  loading = signal(true);
  role = signal<string | null>(null);

  rooms = signal<RoomWitherCountersResponseDto[]>([]);
  floors = Object.values(Floor).filter((value) => typeof value === 'number');
  activities = signal<ActivityResponseDto[]>([]);

  modalDeleteConfirm = signal<boolean>(false);
  modalDeleteOk = signal<boolean>(false);
  modalError = signal<boolean>(false);
  modalCreateOk = signal<boolean>(false);
  modalUpdateOk = signal<boolean>(false);

  errorMsg = signal<string>('');

  // Konva

  modalKonva = signal<boolean>(false);
  modalCreateKonva = signal<boolean>(false);
  currenRom: RoomWitherCountersResponseDto | null = null;
  nextCounterNumber = 1;
  selectedRoomToCanvas = signal<RoomWitherCountersResponseDto | null>(null);
  selectedToDelete = signal<RoomWitherCountersResponseDto | null>(null);

  stageConfig = { width: 750, height: 500 };
  layerConfig = [];

  ngOnInit() {
    this.token.set(localStorage.getItem('token'));

    this.loadRooms();
  }

  createRoomForm = this.fb.nonNullable.group({
    number: ['', [Validators.required]],
    floor: ['', [Validators.required]],
    coordinates: this.fb.array<FormGroup[]>([], [Validators.required]),
    counters: this.fb.array<FormGroup>([]),
    companyId: ['', Validators.required],
    serviceId: ['', Validators.required],
  });

  get numberControl() {
    return this.createRoomForm.get('number');
  }

  get floorControl() {
    return this.createRoomForm.get('floor');
  }

  get coordinatesControl(): FormArray {
    return this.createRoomForm.get('coordinates') as FormArray;
  }

  get countersControl(): FormArray {
    return this.createRoomForm.get('counters') as FormArray;
  }

  get companyIdControl() {
    return this.createRoomForm.get('companyId');
  }

  get serviceIdControl() {
    return this.createRoomForm.get('serviceId');
  }

  updateRoomForm = this.fb.nonNullable.group({
    number: ['', [Validators.required]],
    floor: ['', [Validators.required]],
    coordinates: this.fb.control<Coordinate[]>([], [Validators.required]),
    counters: this.fb.array<FormGroup>([]),
    companyId: [''],
    serviceId: [''],
  });

  get updateNumberControl() {
    return this.updateRoomForm.get('number');
  }

  get updateFloorControl() {
    return this.updateRoomForm.get('floor');
  }

  get updateCoordinatesControl(): FormArray {
    return this.updateRoomForm.get('coordinates') as FormArray;
  }

  get updateCountersControl(): FormArray {
    return this.updateRoomForm.get('counters') as FormArray;
  }

  get updateCompanyIdControl() {
    return this.updateRoomForm.get('companyId');
  }

  get updateServiceIdControl() {
    return this.updateRoomForm.get('serviceId');
  }

  loadRooms() {
    if (this.token()) {
      this.payload.set(jwtDecode(this.token()!));
      console.log(this.payload());
      this.id.set(this.payload()?.userId!);
      this.role.set(this.payload()?.role!);
      this.loading.set(true);

      if (this.role() == Roles.ADMIN) {
        this.roomService.getAllWithCountersByCompanyId(this.payload()?.companyId!).subscribe({
          next: (resp) => {
            this.rooms.set(resp.data!);
            this.loading.set(false);
            console.log(resp.data);
          },
          error: (err) => {
            console.log(err);
          },
        });
      }

      this.activityService.getAllByCompany(this.payload()?.companyId!).subscribe({
        next: (resp) => {
          this.activities.set(resp.data!);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  // ------------------------
  // KONVA

  // For some reason it deosnt work with identifiers, it needs the reference on the html and access to the container from here
  @ViewChild('container', { static: false })
  container!: ElementRef<HTMLDivElement>;

  @ViewChild('createContainer', { static: false })
  createContainer!: ElementRef<HTMLDivElement>;

  countersFromSelectedRoom = signal<CounterKonva[]>([]);
  roomCoordinates = signal<Coordinate[]>([]);
  creatingCoords = signal<Coordinate[]>([]);
  creatingCounters = signal<CounterKonva[]>([]);

  private lastPointerPos: { x: number; y: number } | null = null;
  private lastCreatePointerPos: { x: number; y: number } | null = null;
  private createCounterOffset = 0;

  stage!: Konva.Stage;
  layer!: Konva.Layer;

  // This part will be chaotic to review, I'm sorry, canvas and I don't have a good relationship, I'll specify what every function does to ease your task

  // This is the function called when clicked on "Edit", the room of that row is selected and a const "coords" is created to use the coordiantes that come from the db for that room
  // It gets the counters from the selected room and store them
  // Finally, it set the modal for the konvas to true
  selectRoomToCanvas(room: RoomWitherCountersResponseDto) {
    this.selectedRoomToCanvas.set(room);

    this.updateRoomForm.patchValue({
      number: String(this.selectedRoomToCanvas()?.number),
      floor: String(this.selectedRoomToCanvas()?.floor),
      companyId: this.selectedRoomToCanvas()?.companyId,

      coordinates: this.selectedRoomToCanvas()?.coordinates,
      serviceId: this.selectedRoomToCanvas()?.serviceId,
    });

    const countersArray = this.updateCountersControl;
    countersArray.clear();

    this.selectedRoomToCanvas()?.counterObjects?.forEach((counter) => {
      countersArray.push(
        this.fb.group({
          id: [counter.id],
          x: [counter.x],
          y: [counter.y],
          width: [counter.width],
          height: [counter.height],
          number: [counter.number],
        }),
      );
    });
    const coords = room.coordinates ?? [];
    this.roomCoordinates.set(coords);

    this.countersFromSelectedRoom.set(room.counterObjects?.map(CounterMapper.fromDtoToKonva) ?? []);

    this.modalKonva.set(true);
  }

  // Calls to initKonva and drawRoom when the dialog is onShow
  onUpdateDialogShow() {
    setTimeout(() => {
      this.initUpdateKonva();
      this.drawUpdateRoom();
    });
  }

  onCreateDialogShow() {
    setTimeout(() => {
      this.initCreateKonva();
    }, 50);
  }

  // Initialize the konva
  // First, Konva needs a layer, which will be the "canvas of the canvas", where everything will be pinted on
  // then, konva needs a stage. Tsis is the second canvas, the one where I will paint my things on
  // When created, the stage is added to the layer
  initUpdateKonva() {
    this.layer = new Konva.Layer();

    this.stage = new Konva.Stage({
      container: this.container.nativeElement,
      width: 600,
      height: 400,
    });

    this.stage.on('mousemove', () => {
      const pos = this.stage.getPointerPosition();
      if (pos) {
        this.lastPointerPos = { x: pos.x, y: pos.y };
      }
    });

    this.stage.add(this.layer);
  }

  initCreateKonva() {
    if (this.stage) {
      this.stage.destroy();
    }

    this.lastCreatePointerPos = null;
    this.createCounterOffset = 0;

    this.layer = new Konva.Layer();

    this.stage = new Konva.Stage({
      container: this.createContainer.nativeElement,
      width: 600,
      height: 400,
    });

    this.stage.on('mousemove', () => {
      const pos = this.stage.getPointerPosition();
      if (pos) this.lastCreatePointerPos = { x: pos.x, y: pos.y };
    });

    this.stage.on('click', (e) => {
      const pos = this.stage.getPointerPosition();
      if (!pos) return;

      this.lastCreatePointerPos = { x: pos.x, y: pos.y };
      this.lastPointerPos = { x: pos.x, y: pos.y };
      this.addPoint({ x: pos.x, y: pos.y });
    });

    this.stage.add(this.layer);
  }

  /** This is where the thing starts to get probably very bad programmed
   * It creates a const to store the coordinates from the db and store them on a signal
   * The children of the layer are destroyed, for when this function is called from a dragend
   *
   * It creates the polygon tracing a line stroked and closed with the coordinates before stored
   * the polygon is added to the layer, the before mentioned "second canvas"
   * and calls to the function to draw it on the html. A built in function
   *
   * Then, it iterates on the counters of the selected room, creates the konva for them and, before ending every iteration, it adds another built in function
   * to catch when the draggable rect is dragged and ended that drag, to update the on memory variables (- more on its function -)
   *
   * After that everey counter is added to the layer, and when everyone has been added, the layer is drawn again
   */
  drawUpdateRoom() {
    const coords = this.roomCoordinates();
    this.layer.destroyChildren();

    const editRoomPolygon = new Konva.Line({
      points: coords.flatMap((coord) => [coord.x, coord.y]),
      fill: '#00D2FF',
      stroke: 'black',
      strokeWidth: 2,
      closed: true,
    });

    this.layer.add(editRoomPolygon);

    this.countersFromSelectedRoom().forEach((counter) => {
      const rect = new Konva.Rect({
        x: counter.x,
        y: counter.y,
        width: counter.width,
        height: counter.height,
        fill: 'grey',
        draggable: true,
      });

      rect.on('dragend', (ev) => {
        const x = ev.target.x();
        const y = ev.target.y();
        const id = counter.id;

        this.countersFromSelectedRoom.update((list) =>
          list.map((counter) => (counter.id === id ? { ...counter, x, y } : counter)),
        );

        const controls = this.updateCountersControl.controls;
        const index = controls.findIndex((ctrl) => ctrl.get('id')?.value === id);

        if (index !== -1) {
          const group = controls[index] as FormGroup;
          group.patchValue({ x, y });
        }
      });

      this.layer.add(rect);
    });

    this.layer.draw();
  }

  updateOnDragEnd(event: any, counter: CounterKonva) {
    const x = event.target.x();
    const y = event.target.y();

    this.countersFromSelectedRoom.update((counters) =>
      counters.map((current) => (current.id === counter.id ? { ...current, x, y } : current)),
    );

    this.rooms.update((rooms) =>
      rooms.map((room) => ({
        ...room,
        counterObjects: room.counterObjects.map((counterObject) =>
          counterObject.id === counter.id ? { ...counterObject, x, y } : counterObject,
        ),
      })),
    );

    this.drawUpdateRoom();
  }

  addCounterToCanvas() {
    const pos = this.lastPointerPos ?? this.stage.getPointerPosition();
    if (!pos) return;

    const x = 50;
    const y = 50;

    // It's just to track it, I can't find any way to track it without id
    const id = crypto.randomUUID();

    const currentCounters = this.updateCountersControl.getRawValue();

    const nextNumber =
      currentCounters.length > 0
        ? Math.max(...currentCounters.map((counter) => counter.number ?? 0)) + 1
        : 1;

    const counterToPush: CounterResponseDto = {
      x,
      y,
      height: 25,
      width: 50,
      number: 5,
    };

    const counterToPushKonva: CounterKonva = {
      id,
      x,
      y,
      height: 25,
      width: 50,
      fill: 'grey',
      draggable: true,
    };

    this.countersFromSelectedRoom.update((list) => [...list, counterToPushKonva]);

    this.updateCountersControl.push(
      this.fb.group({
        id: [id],
        x: [x],
        y: [y],
        width: [50],
        height: [25],
        number: [nextNumber],
      }),
    );

    this.rooms.update((rooms) =>
      rooms.map((room) =>
        this.selectedRoomToCanvas()?.id === room.id
          ? {
              ...room,
              counterObjects: [...(room.counterObjects ?? []), counterToPush],
            }
          : room,
      ),
    );

    this.drawUpdateRoom();
  }

  addPoint(point: Coordinate) {
    this.creatingCoords.update((coords) => [...coords, structuredClone(point)]);

    this.coordinatesControl.push(
      this.fb.group({
        x: [point.x],
        y: [point.y],
      }),
    );

    this.drawCreateRoom();
  }

  drawCreateRoom() {
    this.layer.destroyChildren();
    const coords = this.creatingCoords();

    const poly = new Konva.Line({
      points: coords.flatMap((coord) => [coord.x, coord.y]),
      fill: 'rgba(0,210,255,0.3)',
      stroke: '#000',
      strokeWidth: 2,
      closed: coords.length > 2,
    });
    this.layer.add(poly);

    this.creatingCounters().forEach((counter) => {
      const rect = new Konva.Rect({
        x: counter.x,
        y: counter.y,
        width: counter.width,
        height: counter.height,
        fill: 'grey',
        draggable: true,
      });

      rect.on('dragend', (ev) => {
        const newX = ev.target.x();
        const newY = ev.target.y();
        const id = counter.id;

        this.creatingCounters.update((list) =>
          list.map((counter) => (counter.id === id ? { ...counter, x: newX, y: newY } : counter)),
        );

        this.updateCounterInFormArray(id!, newX, newY);
      });

      this.layer.add(rect);
    });

    this.layer.draw();
  }

  private updateCounterInFormArray(id: string, x: number, y: number): void {
    const controls = this.countersControl.controls;

    for (let i = 0; i < controls.length; i++) {
      const group = controls[i] as FormGroup;
      const controlId = group.get('id')?.value;

      if (controlId === id) {
        group.patchValue({ x, y }, { emitEvent: false });
        group.markAsDirty();
        break;
      }
    }
  }

  addCoordinateToForm(coord: Coordinate) {
    this.coordinatesControl.push(
      this.fb.group({
        x: [coord.x],
        y: [coord.y],
      }),
    );
  }

  addCounterToCreateCanvas() {
    let x: number;
    let y: number;

    x = 150 + (this.createCounterOffset % 5) * 60;
    y = 200 + Math.floor(this.createCounterOffset / 5) * 35;

    const id = crypto.randomUUID();

    const counter: CounterKonva = {
      id,
      x,
      y,
      width: 50,
      height: 25,
      fill: 'grey',
      draggable: true,
    };

    const counterDto: CreateCounterRequestDto = {
      x,
      y,
      width: 50,
      height: 25,
      number: this.nextCounterNumber++,
    };

    this.updateCountersControl.push(
      this.fb.group({
        id: [id],
        x: [x],
        y: [y],
        width: [50],
        height: [25],
        number: [5],
      }),
    );

    this.creatingCounters.update((list) => [...list, counter]);

    this.countersControl.push(this.fb.group({ id: [id], ...counterDto }));

    this.drawCreateRoom();
  }

  openCreateRoom() {
    this.creatingCoords.set([]);
    this.creatingCounters.set([]);
    this.nextCounterNumber = 1;

    while (this.coordinatesControl.length !== 0) {
      this.coordinatesControl.removeAt(0);
    }

    while (this.countersControl.length !== 0) {
      this.countersControl.removeAt(0);
    }

    this.modalCreateKonva.set(true);
  }

  saveRoom() {
    console.log(this.payload()?.companyId);

    this.createRoomForm.patchValue({
      companyId: this.payload()?.companyId,
    });

    const form = this.createRoomForm.getRawValue();

    console.log(form);

    if (this.createRoomForm.invalid) {
      this.markAllAsTouched(this.createRoomForm);
      return;
    }

    const dto: CreateRoomRequestDto = {
      number: Number(form.number),
      floor: Number(form.floor),
      companyId: this.payload()?.companyId!,
      serviceId: form.serviceId,

      coordinates: this.creatingCoords(),

      // To drop the id
      counters: this.countersControl.getRawValue().map(({ id, ...counter }) => counter),
    };

    this.roomService.create(dto).subscribe({
      next: (resp) => {
        this.modalCreateOk.set(true);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      error: (err) => {
        this.errorMsg.set(err.error.message);
        this.modalError.set(true);
      },
    });
  }

  updateRoom() {
    if (this.updateRoomForm.invalid) {
      this.markAllAsTouched(this.createRoomForm);
      return;
    }

    const form = this.updateRoomForm.getRawValue();

    const dto: CreateRoomRequestDto = {
      number: Number(form.number),
      floor: Number(form.floor),
      companyId: this.payload()?.companyId!,
      serviceId: form.serviceId,

      coordinates: form.coordinates!,

      // To drop the id
      counters: this.updateCountersControl.getRawValue().map(({ id, ...counter }) => counter),
    };

    console.log(form);

    this.roomService.update(dto, this.selectedRoomToCanvas()?.id!).subscribe({
      next: (resp) => {
        this.modalUpdateOk.set(true);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      error: (err) => {
        this.errorMsg.set(err.error.message);
        this.modalError.set(true);
      },
    });
  }

  markAllAsTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      control.markAsDirty();
    });
  }

  confirmDelete(room: RoomWitherCountersResponseDto) {
    this.selectedToDelete.set(room);
    this.modalDeleteConfirm.set(true);
  }

  delete() {
    this.roomService.delete(this.selectedToDelete()!.id).subscribe({
      next: (resp) => {
        this.modalDeleteConfirm.set(false);
        this.modalDeleteOk.set(true);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      error: (err) => {
        this.errorMsg.set(err.message);
        this.modalError.set(true);
      },
    });
  }
}

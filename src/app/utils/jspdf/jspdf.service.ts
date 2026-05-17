import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';

@Injectable({
  providedIn: 'root',
})
export class JspdfService {
  constructor() {}

  generatePdf(
    serviceName: string,
    nameUser: string,
    surname1User: string,
    counter: number,
    room: number,
    nameWorker: string,
    date: string,
    time: string,
  ) {
    const doc = new jsPDF();

    let y = 45;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(
      'The sole purpose of this document is informational only. No legal validity.',
      105,
      y,
      { align: 'center' },
    );

    y += 15;

    doc.setDrawColor(200);
    doc.line(10, y, 200, y);

    y += 15;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Appointment Details', 10, y);

    y += 10;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    const addLine = (label: string, value: string) => {
      doc.text(`${label}: ${value}`, 10, y);
      y += 8;
    };

    addLine('Client', `${surname1User}, ${nameUser}`);
    addLine('Service', serviceName);
    addLine('Worker', nameWorker);
    addLine('Room', `${room}`);
    addLine('Counter', `${counter}`);
    addLine('Date', date);
    addLine('Time', time);

    y += 45;

    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text('© Novahub SA - All rights reserved', 105, 285, {
      align: 'center',
    });

    const img = new Image();
    img.src = './novahub-logo.png';

    // Withou onload the image doesnt load, I supposse is async
    img.onload = () => {
      doc.addImage(img, 'PNG', 90, 10, 30, 20);

      doc.save(`appointment_${date}.pdf`);
    };
  }
}

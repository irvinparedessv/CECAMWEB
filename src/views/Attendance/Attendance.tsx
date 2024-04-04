import React, { useState } from 'react';
import './attendance.css'; // Archivo de estilos para personalización

interface Student {
  name: string;
  lastName: string;
  daysMissed: number[];
}

const Attendance: React.FC = () => {
  const getRandomDays = (): number[] => {
    const daysInMonth: number = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const randomDays: number[] = [];
    while (randomDays.length < 2) {
      const randomDay: number = Math.floor(Math.random() * daysInMonth) + 1;
      if (!randomDays.includes(randomDay)) {
        randomDays.push(randomDay);
      }
    }
    return randomDays;
  };
  const [students] = useState<Student[]>([
    {
      name: 'Juan',
      lastName: 'González',
      daysMissed: [2, 5, 10, 15] // Ejemplo de días que faltó Juan
    },
    {
      name: 'María',
      lastName: 'Benitez',
      daysMissed: [3, 6, 11, 16] // Ejemplo de días que faltó María
    },
    {
      name: 'Pedro',
      lastName: 'Cardozo',
      daysMissed: [4, 7, 12, 17] // Ejemplo de días que faltó Pedro
    },
    {
      name: 'Ana',
      lastName: 'González',
      daysMissed: [8, 13, 18, 22] // Ejemplo de días que faltó Ana
    }, { name: 'Carlos', lastName: 'González', daysMissed: getRandomDays() },
    { name: 'Luis', lastName: 'Hernández', daysMissed: getRandomDays() },
    { name: 'Laura', lastName: 'Díaz', daysMissed: getRandomDays() },
    { name: 'Fernando', lastName: 'Torres', daysMissed: getRandomDays() },
    { name: 'Carmen', lastName: 'Ruiz', daysMissed: getRandomDays() },
    { name: 'Roberto', lastName: 'Sánchez', daysMissed: getRandomDays() },
    { name: 'Elena', lastName: 'Romero', daysMissed: getRandomDays() },
    { name: 'Miguel', lastName: 'Álvarez', daysMissed: getRandomDays() },
    { name: 'Isabel', lastName: 'Jiménez', daysMissed: getRandomDays() },
    { name: 'Sergio', lastName: 'Moreno', daysMissed: getRandomDays() }
  ]);

  // Función para obtener los días de un mes y año específicos
  const getDaysInMonth = (month: number, year: number): number[] => {
    const date: Date = new Date(year, month, 0);
    const daysInMonth: number = date.getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }

  const daysInMonth: number[] = getDaysInMonth(new Date().getMonth() + 1, new Date().getFullYear()); // Obtener días del mes actual

  return (
    <div>
<h3>ASISTENCIA 8-A</h3>
<h4>FEBRERO 2024</h4>
    <div className="asistencia-container">
      <div className="nombres-column">
        {students.map((student: Student, studentIndex: number) => (
          <div key={studentIndex} className="nombre">
            {student.name}
          </div>
        ))}
      </div>
      <div className="dias-row">
        {daysInMonth.map((day: number, dayIndex: number) => (
          <div key={dayIndex} className="dia-numero">
            {day}
            {students.map((student: Student, studentIndex: number) => (
              <div key={studentIndex} className={`dia ${student.daysMissed.includes(day) ? 'falta' : ''}`}>
                {student.daysMissed.includes(day) ? 'X' : '-'}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
          
    </div>
  );
}

export default Attendance;

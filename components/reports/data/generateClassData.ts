export const generateClassData = (className: string) => {
  const classMap: Record<string, any> = {
    'Class 1': {
      students: { total: 47, male: 25, female: 22 },
      attendance: { overall: 92, present: 43, absent: 3, late: 1 },
      monthly: [
        { month: 'Jan', attendance: 90 }, { month: 'Feb', attendance: 91 },
        { month: 'Mar', attendance: 93 }, { month: 'Apr', attendance: 92 },
        { month: 'May', attendance: 94 }, { month: 'Jun', attendance: 92 },
        { month: 'Jul', attendance: 91 }, { month: 'Aug', attendance: 93 },
        { month: 'Sep', attendance: 92 }, { month: 'Oct', attendance: 94 },
        { month: 'Nov', attendance: 91 }, { month: 'Dec', attendance: 92 }
      ],
      weekly: [
        { day: 'Mon', attendance: 95 }, { day: 'Tue', attendance: 93 },
        { day: 'Wed', attendance: 92 }, { day: 'Thu', attendance: 94 },
        { day: 'Fri', attendance: 90 }, { day: 'Sat', attendance: 88 }
      ]
    },

    'Class 2': {
      students: { total: 52, male: 28, female: 24 },
      attendance: { overall: 88, present: 46, absent: 4, late: 2 },
      monthly: [
        { month: 'Jan', attendance: 86 }, { month: 'Feb', attendance: 87 },
        { month: 'Mar', attendance: 89 }, { month: 'Apr', attendance: 88 },
        { month: 'May', attendance: 90 }, { month: 'Jun', attendance: 88 },
        { month: 'Jul', attendance: 87 }, { month: 'Aug', attendance: 89 },
        { month: 'Sep', attendance: 88 }, { month: 'Oct', attendance: 90 },
        { month: 'Nov', attendance: 87 }, { month: 'Dec', attendance: 88 }
      ],
      weekly: [
        { day: 'Mon', attendance: 91 }, { day: 'Tue', attendance: 89 },
        { day: 'Wed', attendance: 88 }, { day: 'Thu', attendance: 90 },
        { day: 'Fri', attendance: 86 }, { day: 'Sat', attendance: 84 }
      ]
    },

    'Class 3': {
      students: { total: 48, male: 22, female: 26 },
      attendance: { overall: 95, present: 45, absent: 2, late: 1 },
      monthly: [
        { month: 'Jan', attendance: 93 }, { month: 'Feb', attendance: 94 },
        { month: 'Mar', attendance: 96 }, { month: 'Apr', attendance: 95 },
        { month: 'May', attendance: 97 }, { month: 'Jun', attendance: 95 },
        { month: 'Jul', attendance: 94 }, { month: 'Aug', attendance: 96 },
        { month: 'Sep', attendance: 95 }, { month: 'Oct', attendance: 97 },
        { month: 'Nov', attendance: 94 }, { month: 'Dec', attendance: 95 }
      ],
      weekly: [
        { day: 'Mon', attendance: 97 }, { day: 'Tue', attendance: 96 },
        { day: 'Wed', attendance: 95 }, { day: 'Thu', attendance: 96 },
        { day: 'Fri', attendance: 93 }, { day: 'Sat', attendance: 91 }
      ]
    },

    'Class 4': {
      students: { total: 58, male: 30, female: 28 },
      attendance: { overall: 91, present: 53, absent: 4, late: 1 },
      monthly: [
        { month: 'Jan', attendance: 89 }, { month: 'Feb', attendance: 90 },
        { month: 'Mar', attendance: 92 }, { month: 'Apr', attendance: 91 },
        { month: 'May', attendance: 93 }, { month: 'Jun', attendance: 91 },
        { month: 'Jul', attendance: 90 }, { month: 'Aug', attendance: 92 },
        { month: 'Sep', attendance: 91 }, { month: 'Oct', attendance: 93 },
        { month: 'Nov', attendance: 90 }, { month: 'Dec', attendance: 91 }
      ],
      weekly: [
        { day: 'Mon', attendance: 94 }, { day: 'Tue', attendance: 92 },
        { day: 'Wed', attendance: 91 }, { day: 'Thu', attendance: 93 },
        { day: 'Fri', attendance: 89 }, { day: 'Sat', attendance: 87 }
      ]
    },

    'Class 5': {
      students: { total: 47, male: 24, female: 23 },
      attendance: { overall: 87, present: 41, absent: 5, late: 1 },
      monthly: [
        { month: 'Jan', attendance: 85 }, { month: 'Feb', attendance: 86 },
        { month: 'Mar', attendance: 88 }, { month: 'Apr', attendance: 87 },
        { month: 'May', attendance: 89 }, { month: 'Jun', attendance: 87 },
        { month: 'Jul', attendance: 86 }, { month: 'Aug', attendance: 88 },
        { month: 'Sep', attendance: 87 }, { month: 'Oct', attendance: 89 },
        { month: 'Nov', attendance: 86 }, { month: 'Dec', attendance: 87 }
      ],
      weekly: [
        { day: 'Mon', attendance: 90 }, { day: 'Tue', attendance: 88 },
        { day: 'Wed', attendance: 87 }, { day: 'Thu', attendance: 89 },
        { day: 'Fri', attendance: 85 }, { day: 'Sat', attendance: 83 }
      ]
    },

    'Class 6': {
      students: { total: 55, male: 26, female: 29 },
      attendance: { overall: 93, present: 51, absent: 3, late: 1 },
      monthly: [
        { month: 'Jan', attendance: 91 }, { month: 'Feb', attendance: 92 },
        { month: 'Mar', attendance: 94 }, { month: 'Apr', attendance: 93 },
        { month: 'May', attendance: 95 }, { month: 'Jun', attendance: 93 },
        { month: 'Jul', attendance: 92 }, { month: 'Aug', attendance: 94 },
        { month: 'Sep', attendance: 93 }, { month: 'Oct', attendance: 95 },
        { month: 'Nov', attendance: 92 }, { month: 'Dec', attendance: 93 }
      ],
      weekly: [
        { day: 'Mon', attendance: 96 }, { day: 'Tue', attendance: 94 },
        { day: 'Wed', attendance: 93 }, { day: 'Thu', attendance: 95 },
        { day: 'Fri', attendance: 91 }, { day: 'Sat', attendance: 89 }
      ]
    },

    'Class 7': {
      students: { total: 62, male: 32, female: 30 },
      attendance: { overall: 89, present: 55, absent: 5, late: 2 },
      monthly: [
        { month: 'Jan', attendance: 87 }, { month: 'Feb', attendance: 88 },
        { month: 'Mar', attendance: 90 }, { month: 'Apr', attendance: 89 },
        { month: 'May', attendance: 91 }, { month: 'Jun', attendance: 89 },
        { month: 'Jul', attendance: 88 }, { month: 'Aug', attendance: 90 },
        { month: 'Sep', attendance: 89 }, { month: 'Oct', attendance: 91 },
        { month: 'Nov', attendance: 88 }, { month: 'Dec', attendance: 89 }
      ],
      weekly: [
        { day: 'Mon', attendance: 92 }, { day: 'Tue', attendance: 90 },
        { day: 'Wed', attendance: 89 }, { day: 'Thu', attendance: 91 },
        { day: 'Fri', attendance: 87 }, { day: 'Sat', attendance: 85 }
      ]
    },

    'Class 8': {
      students: { total: 53, male: 28, female: 25 },
      attendance: { overall: 94, present: 50, absent: 2, late: 1 },
      monthly: [
        { month: 'Jan', attendance: 92 }, { month: 'Feb', attendance: 93 },
        { month: 'Mar', attendance: 95 }, { month: 'Apr', attendance: 94 },
        { month: 'May', attendance: 96 }, { month: 'Jun', attendance: 94 },
        { month: 'Jul', attendance: 93 }, { month: 'Aug', attendance: 95 },
        { month: 'Sep', attendance: 94 }, { month: 'Oct', attendance: 96 },
        { month: 'Nov', attendance: 93 }, { month: 'Dec', attendance: 94 }
      ],
      weekly: [
        { day: 'Mon', attendance: 96 }, { day: 'Tue', attendance: 95 },
        { day: 'Wed', attendance: 94 }, { day: 'Thu', attendance: 95 },
        { day: 'Fri', attendance: 92 }, { day: 'Sat', attendance: 90 }
      ]
    },

    'Class 9': {
      students: { total: 67, male: 35, female: 32 },
      attendance: { overall: 86, present: 58, absent: 7, late: 2 },
      monthly: [
        { month: 'Jan', attendance: 84 }, { month: 'Feb', attendance: 85 },
        { month: 'Mar', attendance: 87 }, { month: 'Apr', attendance: 86 },
        { month: 'May', attendance: 88 }, { month: 'Jun', attendance: 86 },
        { month: 'Jul', attendance: 85 }, { month: 'Aug', attendance: 87 },
        { month: 'Sep', attendance: 86 }, { month: 'Oct', attendance: 88 },
        { month: 'Nov', attendance: 85 }, { month: 'Dec', attendance: 86 }
      ],
      weekly: [
        { day: 'Mon', attendance: 89 }, { day: 'Tue', attendance: 87 },
        { day: 'Wed', attendance: 86 }, { day: 'Thu', attendance: 88 },
        { day: 'Fri', attendance: 84 }, { day: 'Sat', attendance: 82 }
      ]
    },

    'Class 10': {
      students: { total: 58, male: 30, female: 28 },
      attendance: { overall: 90, present: 52, absent: 5, late: 1 },
      monthly: [
        { month: 'Jan', attendance: 88 }, { month: 'Feb', attendance: 89 },
        { month: 'Mar', attendance: 91 }, { month: 'Apr', attendance: 90 },
        { month: 'May', attendance: 92 }, { month: 'Jun', attendance: 90 },
        { month: 'Jul', attendance: 89 }, { month: 'Aug', attendance: 91 },
        { month: 'Sep', attendance: 90 }, { month: 'Oct', attendance: 92 },
        { month: 'Nov', attendance: 89 }, { month: 'Dec', attendance: 90 }
      ],
      weekly: [
        { day: 'Mon', attendance: 93 }, { day: 'Tue', attendance: 91 },
        { day: 'Wed', attendance: 90 }, { day: 'Thu', attendance: 92 },
        { day: 'Fri', attendance: 88 }, { day: 'Sat', attendance: 86 }
      ]
    }
  };

  if (className === 'All Classes') {
    return {
      students: { total: 547, male: 280, female: 267 },
      attendance: { overall: 91, present: 498, absent: 35, late: 14 },
      monthly: [
        { month: 'Jan', attendance: 92 }, { month: 'Feb', attendance: 88 },
        { month: 'Mar', attendance: 94 }, { month: 'Apr', attendance: 89 },
        { month: 'May', attendance: 90 }, { month: 'Jun', attendance: 95 },
        { month: 'Jul', attendance: 93 }, { month: 'Aug', attendance: 91 },
        { month: 'Sep', attendance: 92 }, { month: 'Oct', attendance: 94 },
        { month: 'Nov', attendance: 88 }, { month: 'Dec', attendance: 89 }
      ],
      weekly: [
        { day: 'Mon', attendance: 94 }, { day: 'Tue', attendance: 92 },
        { day: 'Wed', attendance: 91 }, { day: 'Thu', attendance: 93 },
        { day: 'Fri', attendance: 89 }, { day: 'Sat', attendance: 87 }
      ],
      allClasses: Object.entries(classMap).map(([cls, data]) => ({
        class: cls,
        male: data.students.male,
        female: data.students.female,
        attendance: data.attendance.overall,
        students: data.students.total
      }))
    };
  }

  return classMap[className];
};

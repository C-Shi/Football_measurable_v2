function capitalize (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = {
  formatStudentInfo: (student) => {
    return {
      first_name: capitalize(student.first_name),
      last_name: capitalize(student.last_name),
      school: capitalize(student.school),
      grade: student.grade,
      position: student.position.toUpperCase(),
      arm_span: student.arm_span,
      height: student.height,
      weight: student.weight,
      strength: student.strength,
      weakness: student.weakness,
      image: student.image,
      image_id: student.image_id
    }
  },

  formatPerformance: (student_id, student) => {
    return {
      bench_press_first: student.bench_press_first,
      bench_press_second: student.bench_press_second,
      broad: student.broad,
      vertical: student.vertical,
      forty_first: student.forty_first,
      forty_second: student.forty_second,
      shuttle_first_L: student.shuttle_first_L,
      shuttle_second_R: student.shuttle_second_R,
      year: student.year,
      student_id,
    }
  }
}
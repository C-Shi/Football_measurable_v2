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
  }
}
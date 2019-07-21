module.exports = {
  isYearSync: (year) => {
    if(!Number(year)) {
      return new Error('Incorrect Year Format')
    } else if (Number(year) < 1900 || Number(year) > 2100) {
      return new Error('Year is too small or too large')
    } else {
      return true;
    }
  }, 

  isYear: (year) => {
    return new Promise((resolve, reject) => {
      if (!Number(year)) {
        reject(new Error('Incorrect Year Format'))
      } else if (Number(year) < 1900 || Number(year) > 2100) {
        reject(new Error('Year is too small or too large'))
      } else {
        resolve(Number(year))
      }
    })
  }
}
export default class NumberFormat {
  toInt(number) {
    if (number === undefined || number === null) return 0

    number = parseInt(number.toString().replace(new RegExp(',', 'g'), ''))

    return !isNaN(number) ? number : 0
  }

  toFloat(number) {
    if (number === undefined || number === null) return 0

    number = parseFloat(number.toString().replace(new RegExp(',', 'g'), ''))

    return !isNaN(number) ? number : 0
  }

  strFix(number, decimal, nzero = true) {
    number = this.toFloat(number)

    if (!nzero) {
      return number === 0 ? '' : number.toFixed(decimal).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    } else {
      return number.toFixed(decimal).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    }
  }
}
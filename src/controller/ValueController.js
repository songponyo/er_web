export default class ValueController {
  convertToInt(number) {
    if (number === undefined || number === null) return 0

    number = parseInt(number.toString().replace(new RegExp(',', 'g'), ''))

    return !isNaN(number) ? number : 0
  }

  convertToFloat(number) {
    if (number === undefined || number === null) return 0

    number = parseFloat(number.toString().replace(new RegExp(',', 'g'), ''))

    return !isNaN(number) ? number : 0
  }

  numberFormat(number, decimal, nzero = true) {
    number = this.convertToFloat(number)

    if (!nzero) {
      return number === 0 ? '' : number.toFixed(decimal).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    } else {
      return number.toFixed(decimal).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    }
  }

  ifUndefined(value, newValue) {
    return value !== undefined ? value : newValue
  }
}
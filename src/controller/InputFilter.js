export default class InputFilter {
  _stateFilter(e) {
    const { value, classList } = e.target

    if (classList.contains("float")) {
      return (/^-?\d*[.,]?\d*$/.test(value.replace(new RegExp(',', 'g'), '')))
    } else if (classList.contains("integer")) {
      return (/^\d*$/.test(value.replace(new RegExp(',', 'g'), '')))
    } else {
      return true
    }
  }

  _setFilter() {
    var integer = document.getElementsByClassName('set-integer')
    var float = document.getElementsByClassName('set-float')

    for (let i = 0; i < integer.length; i++) {
      this._setInputFilter(integer[i], function (value) {
        return /^\d*$/.test(value)
      })
    }

    for (let i = 0; i < float.length; i++) {
      this._setInputFilter(float[i], function (value) {
        return /^-?\d*[.,]?\d*$/.test(value)
      })
    }
  }

  _setInputFilter(textbox, inputFilter) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
      textbox.addEventListener(event, function () {
        if (inputFilter(this.value.replace(new RegExp(',', 'g'), ''))) {
          this.oldValue = this.value
          this.oldSelectionStart = this.selectionStart
          this.oldSelectionEnd = this.selectionEnd
        } else if (this.hasOwnProperty("oldValue")) {
          this.value = this.oldValue;
          this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd)
        }
      })
    })
  }
}
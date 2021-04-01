export default class MathController {
    round_(value, decimal_places = 0, num_places = 5) {
        if (decimal_places < 0) { decimal_places = 0; }
        let mult = Math.pow(10, decimal_places);
        let _places = (parseFloat(value).toFixed(decimal_places + 1)).toString()
        let check_places = _places.substr(_places.length - 1, _places.length);
        if (parseInt(check_places) >= parseInt(num_places)) {
            return Math.ceil(value * mult) / mult;
        } else {
            return Math.floor(value * mult) / mult;
        }
    }
}
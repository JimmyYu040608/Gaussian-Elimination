// run on start
document.addEventListener("DOMContentLoaded", function () {
    console.log("Program loaded");
})

// ==================== Math ====================
// return the greatest common divisor between two integers a, b
function gcd(a, b) {
    let t = 1;
    while (t != 0) {
        t = a % b;
        a = b;
        b = t;
    }
    return a;
}

// class for fractions, with two parameters n (numerator) and d (denominator)
class Fract {
    constructor(n, d) {
        this.n = n;
        this.d = d;
    }

    // replace parameters in dest with those of src
    static copy(src, dest) {
        dest.n = src.n;
        dest.d = src.d;
        return;
    }

    // return the fraction at its simpliest form
    reduce() {
        let g;
        if (this.n > this.d) {
            g = gcd(this.d, this.n);
        }
        else {
            g = gcd(this.n, this.d);
        }
        let reduced = new Fract(this.n / g, this.d / g);
        if ((reduced.d < 0 && reduced.n < 0) || (reduced.n >= 0 && reduced.d < 0)) {
            reduced.n = -reduced.n;
            reduced.d = -reduced.d;
        }
        return reduced;
    }

    // return the sum between this and other
    add(other) {
        let sum = new Fract(this.n * other.d + other.n * this.d, this.d * other.d);
        return sum.reduce();
    }

    // return the product between this and other
    multiply(other) {
        let product = new Fract(this.n * other.n, this.d * other.d);
        return product.reduce();
    }

    // return the negative value of this
    negate() {
        let k = new Fract(-this.n, this.d);
        return k.reduce();
    }

    // return the inverse of this
    inverse() {
        let k = new Fract();
        if (this.n < 0) {
            k.n = -this.d;
            k.d = -this.n;
        }
        else {
            k.n = this.d;
            k.d = this.n;
        }
        return k;
    }
    
    // a + nb = 0 => n = -a/b => n = (a.n * b.d) / (a.d * b.n)
    // a - operator * b = 0
    static find_operator(a, b) {
        let k = new Fract(a.n * b.d, a.d * b.n);
        return k.reduce();
    }

    // return the latex text representing the given fract
    toLatex() {
        let temp;
        if (this.d == 1) {
            temp = this.n;
        }
        else if (this.n == 0) {
            temp = "0";
        }
        else {
            if (this.n >= 0) {
                temp = "\\frac{";
                temp += this.n;
                temp += "}{";
                temp += this.d;
                temp += "}";
            }
            else {
                temp = "-\\frac{";
                temp += -this.n;
                temp += "}{";
                temp += this.d;
                temp += "}";
            }
        }
        return temp;
    }
}

// ==================== Universal Functions ====================
// return the number of a specific character in the given string
String.prototype.countOf = function (char) {
    if (typeof char !== "string") {
        throw new Error("Error: Invalid input to String.countOf");
    }
    let count = 0;
    for (let i = 0 ; i < this.length ; i++) {
        if (this.charAt(i) === char) {
            count++;
        }
    }
    return count;
}

// return the fract represented by the given string
String.prototype.toFract = function () {
    let value = new Fract();
    let str = this;
    let negative = false;
    // negative flag
    if (str.charAt(0) == '-') {
        negative = true;
        str = str.slice(1, str.length);
    }
    // detect for divisor
    let parts = str.split('/');
    // identify the type of number
    // Case 1: fraction
    if (parts.length == 2) {
        if (parts[0].countOf('.') != 0 || parts[1].countOf('.') != 0) {
            throw new Error("Error: Invalid input to String.toFract");
        }
        value.n = parseInt(parts[0]);
        value.d = parseInt(parts[1]);
    }
    else if (parts.length == 1) {
        // detect for decimal point
        parts = str.split('.');
        // Case 2: decimal number
        if (parts.length == 2) {
            let whole = parts[0];
            let decimal = parts[1];
            let multiplier = Math.pow(10, decimal.length);
            value.n = Number(whole) * multiplier + Number(decimal);
            value.d = multiplier;
        }
        // Case 3: integer
        else if (parts.length == 1 && /^[0-9]+$/.test(parts[0])) {
            value.n = parseInt(parts[0]);
            value.d = 1;
        }
        // raise error if str has more than one dot, or it does not have dot but it is not an integer
        else {
            throw new Error("Error: Invalid input to toFract");
        }
    }
    // raise error if str has more than one slash
    else {
        throw new Error("Error: Invalid input to toFract");
    }
    // add back negativity to the value
    if (negative) {
        value.n = -value.n;
    }
    return value.reduce();
}

const STRING_TYPE = 1;
const FRACT_TYPE = 2;
// create a 2D array of given outer and inner size
function create_2D_array(outer_size, inner_size, type) {
    let arr = [];
    for (let i = 1 ; i <= outer_size ; i++) {
        arr[i] = [];
        for (let j = 1 ; j <= inner_size ; j++) {
            if (type == STRING_TYPE) {
                arr[i][j] = new String();
            }
            else if (type == FRACT_TYPE) {
                arr[i][j] = new Fract();
            }
            // else, remain undefined
        }
    }
    return arr;
}

// ==================== Event Functions ====================
// setting validation
function setting_keydown(event, host) {
    const number_list = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const allowed_list = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
    let char = event.key;
    // only accept numbers
    if (number_list.includes(char) || allowed_list.includes(char)) {
        return;
    }
    else {
        event.preventDefault();
        return;
    }
}

// input validation
function keydown_functions(event, host) {
    const number_list = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const allowed_list = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
    let char = event.key;
    // accept any numbers and backspace and delete
    if (number_list.includes(char) || allowed_list.includes(char)) {
        return;
    }
    // only accept '.' or '/' if none of them has occured before
    else if (char == '.' || char == '/') {
        if (host.value.includes('.') || host.value.includes('/')) {
            event.preventDefault();
        }
        return;
    }
    // allow negative sign
    else if (char == '-' && (!host.value.includes('-') && host.selectionStart == 0)) {
        return;
    }
    // deny any other characters
    else {
        event.preventDefault();
        return;
    }
}

// ==================== Main ====================
// connect HTML objects to this program
settings_btn = document.getElementById("settings_btn");
row_input = document.getElementById("row_input");
column_input = document.getElementById("column_input");
vector_input = document.getElementById("vector_input");
solve_for_solution_choice = document.getElementById("solve_for_solution_choice");
customized_choice = document.getElementById("customized_choice");
customization_title = document.getElementById("customization_title");
const_vector_checkbox = document.getElementById("const_vector_checkbox");
const_vector_label = document.querySelector("label[for='const_vector_checkbox']");
reduced_form_checkbox = document.getElementById("reduced_form_checkbox");
reduced_form_label = document.querySelector("label[for='reduced_form_checkbox']");
scalar_multiply_checkbox = document.getElementById("scalar_multiply_checkbox");
scalar_multiply_label = document.querySelector("label[for='scalar_multiply_checkbox']");
reorder_checkbox = document.getElementById("reorder_checkbox");
reorder_label = document.querySelector("label[for='reorder_checkbox']");
setting_error_box = document.getElementById("setting_error_box");

matrix_input_btn = document.getElementById("matrix_input_btn");
matrix_input_container = document.getElementById("matrix_input_container");
vl = document.getElementById("vl");
vector_input_container = document.getElementById("vector_input_container");

output_container = document.getElementById("output_container");
raw_matrix_box = document.getElementById("raw_matrix_box");
solution_container = document.getElementById("solution_container");
analysis_container = document.getElementById("analysis_container");

// initialize environment arrays
row_count = 3;
column_count = 3;
vector_count = 1;
solve_for_solution_approach = true;
customized_approach = false;
vector_mode = true;
reduced_form_mode = true;
scalar_multiply_mode = true;
reorder_mode = true;

raw_matrix_object = create_2D_array(row_count, column_count, null);
raw_matrix_string = create_2D_array(row_count, column_count, STRING_TYPE);
raw_matrix_value = create_2D_array(row_count, column_count, FRACT_TYPE);
matrix_value = create_2D_array(row_count, column_count, FRACT_TYPE);

raw_vector_object = create_2D_array(row_count, vector_count, null);
raw_vector_string = create_2D_array(row_count, vector_count, STRING_TYPE);
raw_vector_value = create_2D_array(row_count, vector_count, FRACT_TYPE);
vector_value = create_2D_array(row_count, vector_count, FRACT_TYPE);

// put <input> tags into 2D array and initialize raw_matrix_string
function initialize() {
    raw_matrix_object = [];
    raw_matrix_string = [];
    raw_matrix_value = [];
    matrix_value = [];
    for (let i = 1; i <= row_count; i++) {
        raw_matrix_object[i] = [];
        raw_matrix_string[i] = [];
        raw_matrix_value[i] = [];
        matrix_value[i] = [];
        for (let j = 1; j <= column_count; j++) {
            let temp_id = "input_element" + i + "_" + j;
            raw_matrix_object[i][j] = document.getElementById(temp_id);
            raw_matrix_string[i][j] = new String();
            raw_matrix_value[i][j] = new Fract();
            matrix_value[i][j] = new Fract();
        }
        raw_vector_object[i] = [];
        raw_vector_string[i] = [];
        raw_vector_value[i] = [];
        vector_value[i] = [];
        for (let v = 1; v <= vector_count; v++) {
            let temp_id = "vector_element" + i + "_" + v;
            raw_vector_object[i][v] = document.getElementById(temp_id);
            raw_vector_string[i][v] = new String();
            raw_vector_value[i][v] = new Fract();
            vector_value[i][v] = new Fract();
        }
    }
    return;
}

// choose the solving approach used
function approach_choice() {
    if (solve_for_solution_choice.checked) {
        // check all options
        const_vector_checkbox.checked = true;
        reduced_form_checkbox.checked = true;
        scalar_multiply_checkbox.checked = true;
        reorder_checkbox.checked = true;
        // lock all options
        const_vector_checkbox.disabled = true;
        reduced_form_checkbox.disabled = true;
        scalar_multiply_checkbox.disabled = true;
        reorder_checkbox.disabled = true;
        // edit title
        customization_title.style.color = "grey";
        customization_title.innerHTML = `Customization &#x1F512;`;
        const_vector_label.style.color = "grey";
        reduced_form_label.style.color = "grey";
        scalar_multiply_label.style.color = "grey";
        reorder_label.style.color = "grey";
    }
    else {
        // unlock all options
        const_vector_checkbox.disabled = false;
        reduced_form_checkbox.disabled = false;
        scalar_multiply_checkbox.disabled = false;
        reorder_checkbox.disabled = false;
        // edit title
        customization_title.style.color = "black";
        customization_title.innerHTML = `Customization &#x1F513;`;
        const_vector_label.style.color = "black";
        reduced_form_label.style.color = "black";
        scalar_multiply_label.style.color = "black";
        reorder_label.style.color = "black";
    }
    return;
}

// function called when setting button is clicked
// edit size of input matrix, input vectors, refill the same values into the new matrix and new vectors
settings_btn.addEventListener("click", function () {
    // INPUT SETTING & REFILL
    // input validation
    setting_error_box.innerText = "";
    setting_error_box.style.display = "none";
    if (row_input.value <= 0 || column_input.value <= 0) {
        setting_error_box.style.display = "block"
        setting_error_box.innerText += "Order of matrix should not be zero. Please try again!";
        return;
    }
    if (vector_input.value <= 0 && const_vector_checkbox.checked) {
        solve_for_solution_choice.checked = false;
        const_vector_checkbox.checked = false;
        approach_choice();
    }
    // save original matrix
    let old_matrix = []
    let old_matrix_string = [];
    let old_vectors = [];
    let old_vectors_string = [];
    for (let i = 1; i <= row_count; i++) {
        old_matrix[i] = [];
        old_matrix_string[i] = [];
        old_vectors[i] = [];
        old_vectors_string[i] = [];
        for (let j = 1; j <= column_count; j++) {
            let temp_id = "input_element" + i + "_" + j;
            old_matrix[i][j] = document.getElementById(temp_id);
            old_matrix_string[i][j] = old_matrix[i][j].value;
        }
        for (let v = 1; v <= vector_count; v++) {
            let temp_id2 = "vector_element" + i + "_" + v;
            old_vectors[i][v] = document.getElementById(temp_id2);
            old_vectors_string[i][v] = old_vectors[i][v].value;
        }
    }
    // clear original grid
    matrix_input_container.innerHTML = ``;
    vector_input_container.innerHTML = ``;
    // create new grid
    row_count = row_input.value;
    column_count = column_input.value;
    vector_count = vector_input.value;
    let input_row = new Array();
    let vector_row = new Array();
    for (let i = 1; i <= row_count; i++) {
        matrix_input_container.innerHTML += `
            <div class="input_row" id="input_row${i}"></div>
        `;
        vector_input_container.innerHTML += `
            <div class="input_row" id="vector_row${i}"></div>
        `;
        let temp_id = "input_row" + i;
        let temp_id2 = "vector_row" + i;
        input_row[i] = document.getElementById(temp_id);
        vector_row[i] = document.getElementById(temp_id2);
        for (let j = 1; j <= column_count; j++) {
            input_row[i].innerHTML += `
                <input class="input_element" id="input_element${i}_${j}" title="${i}_${j}" onkeydown="keydown_functions(event,this)">
            `;
        }
        for (let v = 1; v <= vector_count; v++) {
            vector_row[i].innerHTML += `
                <input class="input_element" id="vector_element${i}_${v}" title="${i}_${v}" onkeydown="keydown_functions(event,this)">
            `;
        }
    }
    // allocate <input> to the 2D array
    initialize();
    // well-define old_matrix_string
    for (let i = 1; i <= row_count; i++) {
        if (old_matrix_string[i] == undefined) {
            old_matrix_string[i] = [];
        }
        for (let j = 1; j <= column_count; j++) {
            if (old_matrix_string[i][j] == undefined) {
                old_matrix_string[i][j] = '';
            }
        }
        if (old_vectors_string[i] == undefined) {
            old_vectors_string[i] = [];
        }
        for (let v = 1; v <= vector_count; v++) {
            if (old_vectors_string[i][v] == undefined) {
                old_vectors_string[i][v] = '';
            }
        }
    }
    // put back original value if valid
    for (let i = 1; i <= row_count; i++) {
        for (let j = 1; j <= column_count; j++) {
            if (old_matrix_string[i][j] == '') {
                raw_matrix_object[i][j].value = '';
            }
            else {
                raw_matrix_object[i][j].value = old_matrix_string[i][j];
            }
        }
        for (let v = 1; v <= vector_count; v++) {
            if (old_vectors_string[i][v] == '') {
                raw_vector_object[i][v].value = '';
            }
            else {
                raw_vector_object[i][v].value = old_vectors_string[i][v]
            }
        }
    }

    // MODE SETTINGS
    if (solve_for_solution_choice.checked) {
        solve_for_solution_approach = true;
        customized_approach = false;
    }
    else if (customized_choice.checked) {
        solve_for_solution_approach = false;
        customized_approach = true;
    }
    // const vector mode
    if (const_vector_checkbox.checked) {
        vector_mode = true;
        vl.style.height = `${row_count * 23}px`;
        vl.style.display = "block";
        vector_input_container.style.display = "flex";
    }
    else {
        vector_mode = false;
        vl.style.display = "none";
        vector_input_container.style.display = "none";
    }
    // reduced form mode
    if (reduced_form_checkbox.checked) {
        reduced_form_mode = true;
    }
    else {
        reduced_form_mode = false;
    }
    // scalar multiplication mode
    if (scalar_multiply_checkbox.checked) {
        scalar_multiply_mode = true;
    }
    else {
        scalar_multiply_mode = false;
    }
    // reorder mode
    if (reorder_checkbox.checked) {
        reorder_mode = true;
    }
    else {
        reorder_mode = false;
    }

    return;
})

// return the latex text representing the given matrix and constant vectors
function build_latex(matrix_value, vector_value) {
    let temp_text = "";
    temp_text += "$$ \\left[ \\begin{array}";
    if (vector_mode) {
        temp_text += "{";
        for (let j = 1; j <= column_count; j++) {
            temp_text += "c";
        }
        temp_text += "|";
        for (let v = 1; v <= vector_count; v++) {
            temp_text += "c";
        }
        temp_text += "} ";
    }
    else {
        temp_text += "{";
        for (let j = 1; j <= column_count; j++) {
            temp_text += "c";
        }
        temp_text += "} ";
    }
    for (let i = 1; i <= row_count; i++) {
        for (let j = 1; j <= column_count; j++) {
            temp_text += matrix_value[i][j].toLatex();
            if (j != column_count) {
                temp_text += " & ";
            }
            else {
                if (vector_mode) {
                    for (let v = 1; v <= vector_count; v++) {
                        temp_text += " & ";
                        temp_text += vector_value[i][v].toLatex();
                    }
                }
                temp_text += " \\\\ ";
            }
        }
    }
    temp_text += "\\end{array} \\right] $$";
    return temp_text;
}

// print the scalar operation in the solution container
function print_step1(inverse_fract, row_num) {
    if (inverse_fract.d == 1) {
        solution_container.innerHTML += `
            <div> &gt&gt ${inverse_fract.n} * R${row_num} </div>
        `;
    }
    else {
        solution_container.innerHTML += `
            <div> &gt&gt ${inverse_fract.n}/${inverse_fract.d} * R${row_num} </div>
        `;
        return;
    }
}

// print the row operation in the solution container
function print_step2(operator, row_num1, row_num2) {
    let temp_HTML = ``;
    temp_HTML += `<div> &gt&gt R${row_num1} `;
    if (operator.n >= 0) {
        temp_HTML += `- `;
    }
    else {
        temp_HTML += `+ `;
        operator.n = -operator.n;
    }

    if (operator.d == 1) {
        if (operator.n != 1 && operator.n != -1) {
            temp_HTML += `${operator.n} * `;
        }
    }
    else {
        temp_HTML += `${operator.n}/${operator.d} * `;
    }
    temp_HTML += `R${row_num2} </div>`;
    solution_container.innerHTML += temp_HTML;
    return;
}

// print the given matrix with the vectors in the solution container
function print_matrix(matrix_value, vector_value) {
    let latex_text = build_latex(matrix_value, vector_value);
    solution_container.innerHTML += `<div> ${latex_text} </div>`;
    solution_container.innerHTML += `<hr>`;
    return;
}

// function called when the calculation button is clicked
// carry out the gauss elimination
matrix_input_btn.addEventListener("click", function () {
    // allocate <input> to the object array
    initialize();

    // store input and fill empty input with zero
    for (let i = 1; i <= row_count; i++) {
        for (let j = 1; j <= column_count; j++) {
            if (raw_matrix_object[i][j].value == undefined || raw_matrix_object[i][j].value == '') {
                raw_matrix_object[i][j].value = '0';
            }
            raw_matrix_string[i][j] = raw_matrix_object[i][j].value;
            raw_matrix_value[i][j] = raw_matrix_string[i][j].toFract();
            matrix_value[i][j] = raw_matrix_value[i][j];
        }
        if (vector_mode) {
            for (let v = 1; v <= vector_count; v++) {
                if (raw_vector_object[i][v].value == undefined || raw_vector_object[i][v].value == '') {
                    raw_vector_object[i][v].value = '0';
                }
                raw_vector_string[i][v] = raw_vector_object[i][v].value;
                raw_vector_value[i][v] = raw_vector_string[i][v].toFract();
                vector_value[i][v] = raw_vector_value[i][v];
            }
        }
    }

    // display the output box for the first time
    output_container.style.display = "block";

    // display raw matrix in mtable
    raw_matrix_box.innerText = "";
    raw_matrix_box.innerText = build_latex(matrix_value, vector_value);

    // start calculation
    solution_container.innerHTML = ``;

    // row echoleon form
    /* Remarks:
        j1 => each round of operations
        i2 & j2 => count no. of zeros in front of each row
        i3 & j3 => selection sort on row_zero_count
        i4 & j4 => row operation
        row_zero_count[i2][0] => count of zeros
        row_zero_count[i2][1] => which row is it?
        find1 & find2 => find main row
        no. of zeros: current_zero_count <= main row <= other rows
    */

    // initialize
    let max_count;
    if (row_count > column_count) {
        max_count = row_count;
    }
    else {
        max_count = column_count;
    }
    let current_zero_count = 0;
    let main_row_record = [];

    // MAIN LOOP: row operations
    for (let j1 = 1; j1 <= max_count; j1++) {
        // count no. of zeros in front of each row
        let row_zero_count = [];
        for (let i2 = 1; i2 <= row_count; i2++) {
            row_zero_count[i2] = [];
            row_zero_count[i2][0] = 0;
            row_zero_count[i2][1] = i2;
            for (let j2 = 1; j2 <= column_count; j2++) {
                if (matrix_value[i2][j2].n != 0) {
                    break;
                }
                else {
                    row_zero_count[i2][0]++;
                }
            }
        }
        // selection sort
        for (let i3 = 1; i3 < row_zero_count.length - 1; i3++) {
            let min_index = i3;
            for (let j3 = i3; j3 < row_zero_count.length; j3++) {
                if (row_zero_count[j3][0] < row_zero_count[min_index][0]) {
                    min_index = j3;
                }
            }
            if (min_index != i3) {
                let temp = row_zero_count[i3];
                row_zero_count[i3] = row_zero_count[min_index];
                row_zero_count[min_index] = temp;
            }
        }
        // find main row
        let main_row;
        let pass = 1;
        for (let find = 1; find <= row_count; find++) {
            if (row_zero_count[find][0] == current_zero_count) {
                main_row = row_zero_count[find][1];
                pass = 0;
                break;
            }
        }
        // pass: if zero count of selected main row != current_zero_count => skip this round
        if (pass == 1) {
            current_zero_count++;
            continue;
        }
        // detect if main row is zero row
        let non_zero = 0;
        for (let j = 1; j <= column_count; j++) {
            if (matrix_value[main_row][j].n != 0) {
                non_zero++;
                break;
            }
        }
        if (non_zero == 0) {
            current_zero_count++;
            continue;
        }
        // record main row
        main_row_record[j1] = main_row;
        // row operation: main row scalar multiplication
        // if scalar multiplication mode active: turn main row's first non-zero element to 1 if not
        if (scalar_multiply_mode) {
            if (matrix_value[main_row][j1].n != 1 || matrix_value[main_row][j1].d != 1) {
                let inverse = matrix_value[main_row][j1].inverse();
                for (let l = current_zero_count + 1; l <= column_count; l++) {
                    matrix_value[main_row][l] = matrix_value[main_row][l].multiply(inverse);
                }
                if (vector_mode) {
                    // vector_value[main_row] = product_fract(inverse,vector_value[main_row]);
                    for (let v = 1; v <= vector_count; v++) {
                        vector_value[main_row][v] = vector_value[main_row][v].multiply(inverse);
                    }
                }
                print_step1(inverse, main_row);
                print_matrix(matrix_value, vector_value);
            }
        }
        // row operation
        // reduced row echelon form mode
        let operated = 0;
        if (reduced_form_mode) {
            for (let i4 = 1; i4 <= row_count; i4++) {
                if (i4 != main_row && matrix_value[i4][j1].n != 0) {
                    let operator = Fract.find_operator(matrix_value[i4][j1], matrix_value[main_row][j1]);
                    for (let j4 = 1; j4 <= column_count; j4++) {
                        // Rk - nRi
                        matrix_value[i4][j4] = matrix_value[i4][j4].add(matrix_value[main_row][j4].multiply(operator.negate()));
                    }
                    if (vector_mode) {
                        for (let v = 1; v <= vector_count; v++) {
                            vector_value[i4][v] = vector_value[i4][v].add(vector_value[main_row][v].multiply(operator.negate()));
                        }
                    }
                    print_step2(operator, i4, main_row);
                    operated = 1;
                }
            }
        }
        // row echelon form mode
        else {
            for (let i4 = 1; i4 <= row_count; i4++) {
                if ((i4 != main_row && matrix_value[i4][j1].n != 0) && !main_row_record.includes(i4)) {
                    let operator = Fract.find_operator(matrix_value[i4][j1], matrix_value[main_row][j1]);
                    for (let j4 = 1; j4 <= column_count; j4++) {
                        // Rk - nRi
                        matrix_value[i4][j4] = matrix_value[i4][j4].add(matrix_value[main_row][j4].multiply(operator.negate()));
                    }
                    if (vector_mode) {
                        for (let v = 1; v <= vector_count; v++) {
                            vector_value[i4][v] = vector_value[i4][v].add(vector_value[main_row][v].multiply(operator.negate()));
                        }
                    }
                    print_step2(operator, i4, main_row);
                    operated = 1;
                }
            }
        }
        if (operated) {
            print_matrix(matrix_value, vector_value);
        }
        current_zero_count++;
    }

    // REORDER
    if (reorder_mode) {
        // count no. of zeros in front of each row
        let row_zero_count = [];
        for (let i = 1; i <= row_count; i++) {
            row_zero_count[i] = [];
            row_zero_count[i][0] = 0;
            row_zero_count[i][1] = i;
            for (let j = 1; j <= column_count; j++) {
                if (matrix_value[i][j].n != 0) {
                    break;
                }
                else {
                    row_zero_count[i][0]++;
                }
            }
        }
        // selection sort
        for (let i = 1; i < row_zero_count.length - 1; i++) {
            let min_index = i;
            for (let j = i; j < row_zero_count.length; j++) {
                if (row_zero_count[j][0] < row_zero_count[min_index][0]) {
                    min_index = j;
                }
            }
            if (min_index != i) {
                let temp = row_zero_count[i];
                row_zero_count[i] = row_zero_count[min_index];
                row_zero_count[min_index] = temp;
            }
        }
        // create new matrix
        let new_matrix_value = [];
        let new_vector_value = [];
        for (let i = 1; i <= row_count; i++) {
            new_matrix_value[i] = matrix_value[row_zero_count[i][1]];
            new_vector_value[i] = vector_value[row_zero_count[i][1]];
        }
        // check if reordering necessary
        let reorder = 0
        for (let i = 1; i <= row_count; i++) {
            if (new_matrix_value[i] != matrix_value[i]) {
                reorder = 1;
                break;
            }
        }
        if (reorder == 1) {
            // update output
            solution_container.innerHTML += `<div> &gt&gt Reorder </div>`;
            print_matrix(new_matrix_value, new_vector_value);
        }
    }
    MathJax.typeset();
    show_solution();
})

// return the transpose of the given matrix
function transpose(matrix) {
    let new_matrix = [];
    for (let i = 1; i <= matrix[1].length - 1; i++) {
        new_matrix[i] = [];
        for (let j = 1; j <= matrix.length - 1; j++) {
            new_matrix[i][j] = matrix[j][i];
        }
    }
    return new_matrix;
}

// if solution analysis approach is checked, analysize the solution
function show_solution() {
    if (solve_for_solution_approach) {
        // fix vector order: 3x6 => 6x3
        let vector_column = [];
        vector_column = transpose(vector_value);
        let raw_vector_column = [];
        raw_vector_column = transpose(raw_vector_value);

        // show analysis container
        analysis_container.style.display = "block";
        analysis_container.innerHTML = ``;

        // row_zero_count[i] => number of zeros before first non-zero value at row i
        // num_of_zero_row[v] => number of zero rows of [A|v]
        // num_of_imaginary_row[v] => number of imaginary rows of [A|v]

        // deal with matrix
        let row_zero_count = [];

        // loop through matrix to find zero rows
        for (let i = 1; i <= row_count; i++) {
            row_zero_count[i] = 0;
            for (let j = 1; j <= column_count; j++) {
                if (matrix_value[i][j].n == 0) {
                    row_zero_count[i]++;
                }
                else {
                    break;
                }
            }
        }

        // initialize
        let num_of_zero_row = [];
        let num_of_imaginary_row = [];
        let rank = [];

        // deal with vectors one by one
        let vector_object = Array(vector_count + 1).fill(0);
        let rank_object = Array(vector_count + 1).fill(0);
        let solution_analysis_object = Array(vector_count + 1).fill(0);
        let solution_box = Array(vector_count + 1).fill(0);
        for (let v = 1; v <= vector_count; v++) {
            // create element
            if (v == 1) {
                analysis_container.innerHTML += `<div class="medium_title">Solution analysis</div>`;
            }
            let temp_HTML = `<div class="box">`;
            // create objects
            let temp_id1 = "", temp_id2 = "", temp_id3 = "", temp_id4 = "";
            // vector_object
            temp_id1 = "vector_object" + v;
            temp_HTML += `<div id="${temp_id1}"></div>`;
            // rank_object
            temp_id2 = "rank_object" + v;
            temp_HTML += `<div id="${temp_id2}"></div>`;
            // solution_analysis_object
            temp_id3 = "solution_analysis_object" + v;
            temp_HTML += `<div id="${temp_id3}"></div>`;
            // solution_box
            temp_id4 = "solution_box" + v;
            temp_HTML += `<div id="${temp_id4}"></div>`;
            // end creation
            temp_HTML += `</div><hr>`;
            analysis_container.innerHTML += temp_HTML;

            // allocate objects
            vector_object[v] = document.getElementById(temp_id1);
            rank_object[v] = document.getElementById(temp_id2);
            solution_analysis_object[v] = document.getElementById(temp_id3);
            solution_box[v] = document.getElementById(temp_id4);

            // identify which vector is using
            vector_object[v].innerHTML = ``;
            vector_object[v].innerHTML += `$$ \\vec{b_${v}} = \\left[ \\begin{array}{c} `;
            for (let i = 1; i <= row_count; i++) {
                vector_object[v].innerHTML += `${raw_vector_column[v][i].toLatex()} \\\\ `;
            }
            vector_object[v].innerHTML += `\\end{array} \\right] $$`;

            // find rank
            num_of_zero_row[v] = 0;
            num_of_imaginary_row[v] = 0;
            for (let i = 1; i <= row_count; i++) {
                if (row_zero_count[i] == column_count) {
                    if (vector_column[v][i].n == 0) {
                        num_of_zero_row[v]++;
                    }
                    else {
                        num_of_imaginary_row[v]++;
                    }
                }
            }
            rank[v] = row_count - num_of_zero_row[v] - num_of_imaginary_row[v];
            rank_object[v].innerHTML = "Rank: " + rank[v];

            // numberic solution
            solution_analysis_object[v].innerHTML = ``;
            solution_box[v].innerHTML = ``;
            if (num_of_imaginary_row[v] != 0) {
                solution_analysis_object[v].innerHTML = `The linear system has no real solution.`;
            }
            else {
                if (rank[v] == column_count) {
                    solution_analysis_object[v].innerHTML = `The linear system has one unique solution.`;
                    solution_box[v].innerHTML += `$$ \\left[ \\begin{matrix} `;
                    for (let i = 1; i <= rank[v]; i++) {
                        solution_box[v].innerHTML += `x_${i} \\\\ `;
                    }
                    solution_box[v].innerHTML += `\\end{matrix} \\right] = `;
                    solution_box[v].innerHTML += `\\left[ \\begin{matrix} `;
                    for (let i = 1; i <= rank[v]; i++) {
                        solution_box[v].innerHTML += vector_column[v][i].toLatex();
                        solution_box[v].innerHTML += ` \\\\ `;
                    }
                    solution_box[v].innerHTML += `\\end{matrix} \\right] $$`;
                }
                else {
                    // infinitely many solution
                    solution_analysis_object[v].innerHTML = `The linear system has infinitely many solution.`;
                    // find out which x has NOT to be parameter
                    // non_zero_pos = first non_zero in the row
                    let non_zero_pos = [];
                    for (let i = 1; i <= row_count; i++) {
                        if (row_zero_count[i] == column_count) {
                            non_zero_pos[i] = null;
                        }
                        else {
                            non_zero_pos[i] = row_zero_count[i] + 1;
                        }
                    }
                    // find out free variables
                    // t_list[1] = 3 => t_1 is x_3
                    let t_list = [];
                    let t_count = 0;
                    for (let j = 1; j <= column_count; j++) {
                        let zero_count = 0;
                        for (let i = 1; i <= row_count; i++) {
                            if (matrix_value[i][j].n == 0) {
                                zero_count++;
                            }
                        }
                        // if column j is full zero => x_j is free variable
                        if (zero_count == row_count) {
                            t_count++;
                            t_list[t_count] = j;
                        }
                    }
                    // display: free variable
                    if (t_count != 0) {
                        if (t_count == 1) {
                            solution_box[v].innerHTML += `\\(x_${t_list[1]}\\) is a free variable.`;
                        }
                        else if (t_count > 1) {
                            for (let i = 1; i <= t_count; i++) {
                                if (i < t_count) {
                                    solution_box[v].innerHTML += `\\(x_${t_list[i]}\\), `;
                                }
                                else if (i == t_count) {
                                    solution_box.innerHTML += `\\(x${t_list[i]}\\) are free variables `;
                                }
                            }
                        }
                        solution_box[v].innerHTML += `<br> `;
                    }
                    // find out which x has to be a parameter
                    for (let i = 1; i <= column_count; i++) {
                        if (!non_zero_pos.includes(i) && !t_list.includes(i)) {
                            t_count++;
                            t_list[t_count] = i;
                        }
                    }
                    // at last, display let t
                    solution_box[v].innerHTML += `Let `;
                    for (let i = 1; i <= t_count; i++) {
                        if (i < t_count) {
                            solution_box[v].innerHTML += `\\(x_${t_list[i]} = t_${i}\\), `;
                        }
                        else if (i == t_count) {
                            solution_box[v].innerHTML += `\\(x_${t_list[i]} = t_${i}\\) `;
                        }
                    }
                    solution_box[v].innerHTML += `<br> `;
                    // display matrix equation
                    // solution vector
                    solution_box[v].innerHTML += `Solution vector: <br> `;
                    solution_box[v].innerHTML += `$$ \\left[ \\begin{matrix} `;
                    for (let i = 1; i <= column_count; i++) {
                        solution_box[v].innerHTML += `x_${i} \\\\ `;
                    }
                    solution_box[v].innerHTML += `\\end{matrix} \\right] = `;
                    // check for homogeneous
                    let zero_count = 0;
                    let homogeneous = false;
                    for (let j = 1; j <= row_count; j++) {
                        if (vector_column[v][j].n == 0) {
                            zero_count++;
                        }
                    }
                    if (zero_count == column_count) {
                        homogeneous = true;
                    }
                    // parameters
                    for (let i = 1; i <= t_count; i++) {
                        solution_box[v].innerHTML += `t_${i}`;
                        solution_box[v].innerHTML += `\\left[ \\begin{matrix} `;
                        for (let j = 1; j <= column_count; j++) {
                            if (non_zero_pos.includes(j)) {
                                solution_box[v].innerHTML += matrix_value[non_zero_pos.indexOf(j)][t_list[i]].negate().toLatex();
                                solution_box[v].innerHTML += ` \\\\ `;
                            }
                            else if (t_list.includes(j) && j == t_list[i]) {
                                solution_box[v].innerHTML += `1 \\\\ `;
                            }
                            else if (t_list.includes(j) && j != t_list[i]) {
                                solution_box[v].innerHTML += `0 \\\\`;
                            }
                            else {
                                console.log("ERROR");
                            }
                        }
                        if (homogeneous && i == t_count) {
                            solution_box[v].innerHTML += `\\end{matrix} \\right] $$`;
                        }
                        else {
                            solution_box[v].innerHTML += `\\end{matrix} \\right] + `;
                        }
                    }
                    // constant
                    if (!homogeneous) {
                        solution_box[v].innerHTML += `\\left[ \\begin{matrix} `;
                        for (let j = 1; j <= column_count; j++) {
                            if (non_zero_pos.includes(j)) {
                                solution_box[v].innerHTML += vector_column[v][non_zero_pos.indexOf(j)].toLatex();
                                solution_box[v].innerHTML += ` \\\\ `;
                            }
                            else if (t_list.includes(j)) {
                                solution_box[v].innerHTML += `0 \\\\ `;
                            }
                            else {
                                console.log("ERROR");
                            }
                        }
                        solution_box[v].innerHTML += `\\end{matrix} \\right] $$`;
                    }
                }
            }
            MathJax.typeset();
        }
    }
    else if (customized_approach) {
        // hide analysis container
        analysis_container.style.display = "none";
    }
    else {
        console.log("ANALYSIS ERROR");
    }
    MathJax.typeset();
}
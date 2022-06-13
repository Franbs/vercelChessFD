let socket = io();

let center = document.createElement('center');
center.setAttribute('style', "margin-top: 200px")
let board = document.createElement('table');

let circleTurn = true;
let selected = false;

for (var i = 0; i < 3; i++) {
    var tr = document.createElement('tr');
    for (var j = 0; j < 3; j++) {

        var td = document.createElement('td');

        let img = document.createElement('img');
        img.id = "cell" + i + j;
        img.setAttribute("width", "100px");
        img.setAttribute("height", "100px");

        img.onclick = function() {
            place(img);
        }

        td.appendChild(img);

        if ((i + j) % 2 == 0) {
            td.setAttribute('class', 'cell whitecell');
            tr.appendChild(td);
        } else {
            td.setAttribute('class', 'cell redcell');
            tr.appendChild(td);
        }
    }

    board.appendChild(tr);
}

center.appendChild(board);

board.setAttribute('cellspacing', '0');
document.body.appendChild(center);

function place(cell) {
    console.log(cell.id);
    let str;

    if (cell.src !== "") {
        window.alert("Invalid movement");
    } else {
        if (circleTurn) {
            cell.src = "../img/circle.png";
            circleTurn = false;
            str = "circle";
        } else {
            cell.src = "../img/cross.png";
            circleTurn = true;
            str = "cross";
        }
    }

    checkWin(str);
}

function checkWin(str) {
    if (checkCol(0, str) || checkCol(1, str) || checkCol(2, str) || checkRow(0, str) || checkRow(1, str) || checkRow(2, str) || checkDiagonal1(str) || checkDiagonal2(str)) {
        window.alert(str + " win");
    }
}

function checkRow(row, str) {
    return (board.rows[row].cells[0].firstElementChild.src.includes(str) && board.rows[row].cells[1].firstElementChild.src.includes(str) && board.rows[row].cells[2].firstElementChild.src.includes(str));
}

function checkCol(col, str) {
    return (board.rows[0].cells[col].firstElementChild.src.includes(str) && board.rows[1].cells[col].firstElementChild.src.includes(str) && board.rows[2].cells[col].firstElementChild.src.includes(str));
}

function checkDiagonal1(str) {
    return (board.rows[0].cells[0].firstElementChild.src.includes(str) && board.rows[1].cells[1].firstElementChild.src.includes(str) && board.rows[2].cells[2].firstElementChild.src.includes(str));
}

function checkDiagonal2(str) {
    return (board.rows[0].cells[2].firstElementChild.src.includes(str) && board.rows[1].cells[1].firstElementChild.src.includes(str) && board.rows[2].cells[0].firstElementChild.src.includes(str));
}
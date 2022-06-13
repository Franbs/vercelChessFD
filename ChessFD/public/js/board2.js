let center = document.createElement('center');
let ChessTable = document.createElement('table');

let whiteTurn = true;
let selected = false;

for (var i = 0; i < 8; i++) {
    var tr = document.createElement('tr');
    for (var j = 0; j < 8; j++) {

        var td = document.createElement('td');

        if ((i + j) % 2 == 0) {
            td.setAttribute('class', 'cell whitecell');
            tr.appendChild(td);
        } else {
            td.setAttribute('class', 'cell redcell');

            if (i < 3) {
                let img = document.createElement('img');
                img.src = "../img/redManPiece.png";
                img.setAttribute('class', 'redMan');
                img.onclick = function() {
                    if (whiteTurn) {
                        window.alert("White's turn");
                    } else {
                        moveRedManPiece();
                        whiteTurn = true;
                    }
                }
                td.appendChild(img);
            } else if (i > 4) {
                let img = document.createElement('img');
                img.src = "../img/whiteManPiece.png";
                img.setAttribute('class', 'whiteMan');
                img.id = "cell" + i + j;
                img.onclick = function() {
                    if (!whiteTurn) {
                        window.alert("Red's turn");
                    } else {
                        moveWhiteManPiece(img);
                        whiteTurn = false;
                    }
                }
                td.appendChild(img);
            }

            tr.appendChild(td);
        }
    }

    ChessTable.appendChild(tr);
}

center.appendChild(ChessTable);

ChessTable.setAttribute('cellspacing', '0');
document.body.appendChild(center);

function moveRedManPiece() {
}

function moveWhiteManPiece(piece) {
    selected = true;

    console.log(piece.id);
    checkValidWhiteMoves(piece);

    selected = false;
}

function checkValidWhiteMoves(piece) {
    let iNow = parseInt(piece.id.slice(-1));
    let jNow = parseInt(piece.id.slice(4, 5));

    console.log(iNow + " " + jNow);

    let nextI = [];
    let nextJ = [];

    /*let nextI1; // izquierda
    let nextI2; // derecha
    let nextJ;*/

    if (iNow === 0) {
        nextI.push(iNow + 1);
        nextJ.push(jNow - 1);
        /*nextI2 = iNow + 1;
        nextJ = jNow - 1;*/
    } else if (iNow === 7) {
        nextI.push(iNow - 1);
        nextJ.push(jNow - 1);
        /*nextI1 = iNow - 1;
        nextJ = jNow - 1;*/
    } else {
        nextI.push(iNow + 1);
        nextI.push(iNow - 1);
        nextJ.push(jNow - 1);
        /*nextI1 = iNow - 1;
        nextI2 = iNow + 1;
        nextJ = jNow - 1;*/
    }

    console.log(nextI + " " + nextJ);

    if (nextI.length > 1) {
        if (ChessTable.rows[nextJ].cells[nextI[0]].firstElementChild && ChessTable.rows[nextJ].cells[nextI[1]].firstElementChild) {
            nextI.splice(0, 2);
        } else if (!ChessTable.rows[nextJ].cells[nextI[0]].firstElementChild && ChessTable.rows[nextJ].cells[nextI[1]].firstElementChild) {
            nextI.pop();
        } else if (ChessTable.rows[nextJ].cells[nextI[0]].firstElementChild && !ChessTable.rows[nextJ].cells[nextI[1]].firstElementChild) {
            nextI.shift();
        }
    } else {
        if (ChessTable.rows[nextJ].cells[nextI[0]].firstElementChild) {
            nextI.shift();
        } else if (ChessTable.rows[nextJ].cells[nextI[1]].firstElementChild) {
            nextI.pop();
        }
    }
    
    console.log(nextI + " " + nextJ);

    if (nextI.length !== 0) {

    } else {
        window.alert("No movements available");
    }
}
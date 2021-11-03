var init = function () {

    var config = {
        draggable: true,
        dropOffBoard: 'snapback', // this is the default
        position: '3qk3/8/pppppppp/8/8/PPPPPPPP/8/3QK3 w - - 0 1',
        onDrop: onDrop,
        onDragStart: onDragStart,
        onMoveEnd: onMoveEnd
    }
    var board = new ChessBoard('board1', config);
    var lastMove = ''
    function legalMoves(source, target, piece, newPos, orientation) {
        //Regex to get color of moved piece, then variable to prevend capturing own pieces
        var colorRegex = new RegExp(board.position()[source][0]);
        if ((colorRegex).test(board.position()[target])) {
            return 'snapback'
        }

        //Legal pawn moves
        if (piece == 'wP') {
            if (Number(source[1]) + 1 != target[1]) {
                return 'snapback'
            }
            var diagonalPosition = source.charCodeAt(0)
            var rightDiagonal = (String.fromCharCode(diagonalPosition + 1) + (Number(source[1]) + 1));
            var leftDiagonal = (String.fromCharCode(diagonalPosition - 1) + (Number(source[1]) + 1));


            //Cancel move if pawn can't capture on diagonal
            if ((target == rightDiagonal && board.position()[rightDiagonal] == undefined) || (target == leftDiagonal && board.position()[leftDiagonal] == undefined)) {
                return 'snapback'
            }
            //Cancel move forward if there is another piece 
            if (board.position()[target] != undefined && target[0] == source[0]) {

                return 'snapback'
            }
            return oneSquareMove(target, source)

        }

        if (piece == 'bP') {
            if (Number(source[1]) - 1 != target[1]) {
                return 'snapback'
            }
            var diagonalPosition = source.charCodeAt(0)
            var rightDiagonal = (String.fromCharCode(diagonalPosition + 1) + (Number(source[1]) - 1));
            var leftDiagonal = (String.fromCharCode(diagonalPosition - 1) + (Number(source[1]) - 1));


            //Cancel move if pawn can't capture on diagonal
            if ((target == rightDiagonal && board.position()[rightDiagonal] == undefined) || (target == leftDiagonal && board.position()[leftDiagonal] == undefined)) {
                return 'snapback'
            }
            //Cancel move forward if there is another piece 
            if (board.position()[target] != undefined && target[0] == source[0]) {

                return 'snapback'
            }
            return oneSquareMove(target, source)
        }

        //Queen movement


        if (piece == 'wQ' || piece == 'bQ') {
            return oneSquareMove(target, source)
        }


        //King movement
        if (piece == 'wK' || piece == 'bK') {

            if (target[1] != source[1]) {
                if (target[0] == source[0]) {

                }
                else {
                    return 'snapback'
                }
            }
            return oneSquareMove(target, source)
        }
    }
    function oneSquareMove(target, source) {
        const verticalDistance = Number(target[1]) - Number(source[1])
        const horizontalDistance = target.charCodeAt(0) - source.charCodeAt(0)
        if ((verticalDistance > 1 || verticalDistance < -1)) {
            return 'snapback'
        }
        else if (horizontalDistance > 1 || horizontalDistance < -1) {
            return 'snapback'
        }
    }
    function onDrop(source, target, piece, newPos, orientation) {
        if (legalMoves(source, target, piece, newPos, orientation) != 'snapback') {

        }
        else { return 'snapback' }
        //End of game
        if (!(/k/g).test(Chessboard.objToFen(newPos))) {

            config.draggable = false;
            document.getElementById('gameover').style.visibility = 'visible'
            document.getElementById('gameover').innerHTML += `<h2 id='color'>White Won</h2>`

            return
        }

        console.log('Source: ' + source)
        console.log('Target: ' + target)
        console.log('Piece: ' + piece)
        console.log('New position: ' + Chessboard.objToFen(newPos))
        console.log(board.position())

        console.log('Orientation: ' + orientation)
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
        //Function to prevend moving more than one square
        function oneSquareMove() {
            if ((verticalDistance > 1 || verticalDistance < -1)) {
                return 'snapback'
            }
            else if (horizontalDistance > 1 || horizontalDistance < -1) {
                return 'snapback'
            }
        }

        //Promotion system 
        /*First two regexes match last line of the board for white & black pieces.
        Last regex gives information about last occurrence of black pawn in FEN */

        var lastLineWhiteRegex = /[a-h]8/i
        var lastLineBlackRegex = /[a-h]1/i
        var promotionPosition = /(p)(?!.*\1)/

        //White Queen promotion
        if (target.match(lastLineWhiteRegex) && piece == 'wP') {
            board.position(Chessboard.objToFen(newPos).replace('P', 'Q'))
            return 'trash'
        }

        //Black Queen promotion
        if (target.match(lastLineBlackRegex) && piece == 'bP') {
            board.position((Chessboard.objToFen(newPos)).replace(promotionPosition, 'q'));
            return 'trash'
        }

        if (board.position()[source][0] == 'w') {
            lastMove = 'white'
        }
        else {
            lastMove = 'black'
        }
        position = board.position()
        makeRandomMove(source, piece, position, orientation, newPos)
    }

    function onDragStart(source, piece, position, orientation) {
        //Prevent from moving same color more than one in row
        if ((lastMove == 'black' && piece.search(/^w/) === -1) ||
            (lastMove == 'white' && piece.search(/^b/) === -1)) {
            return false
        }
    }

    function makeRandomMove(source, piece, position, orientation, newPos) {
        var keys = Object.keys(position);
        var pickPiece = [];

        for (let i = 0; i < keys.length; i++) {
            if ((/^b/).test(position[keys[i]])) {
                pickPiece.push([keys[i]].toString())
            }
        }

        var randomIdx = Math.floor(Math.random() * (pickPiece.length))
        target = pickPiece[randomIdx]
        piece = position[pickPiece[randomIdx]]

        var targetLetter = target.charCodeAt(0)
        var char = (a, b) => (String.fromCharCode(targetLetter + a)) + (Number(target[1]) + b);
        var possibleMoves = [char(-1, 1), char(0, 1), char(1, 1), char(-1, 0), char(0, 0), char(1, 0), char(-1, -1), char(0, -1), char(1, -1)]
        possibleMoves = possibleMoves.sort(() => Math.random() - 0.5)
        var filteredMoves = []

        for (let i = 0; i < possibleMoves.length; i++) {
            source = possibleMoves[i]
            if (source[1] == '9') {
                continue;
            }
            if (legalMoves(target, source, piece) !== 'snapback') {
                filteredMoves.push(source)
            }
        }

        if (filteredMoves.length == 0) {
            makeRandomMove(source, piece, position, orientation, newPos)
        }
        else {board.move(target + '-' + filteredMoves[0])}

        lastMove = 'black'
    }
    function onMoveEnd(oldPos, newPos) {

        if (!(/K/g).test(Chessboard.objToFen(newPos))) {
            config.draggable = false;
            document.getElementById('gameover').style.visibility = 'visible'
            document.getElementById('gameover').innerHTML += `<h2 id='color'>Black Won</h2>`

            return
        }
        //Queen promotion when bot reach last line

        var lastLine = Chessboard.objToFen(newPos).match(/(\/)(?!.*\1).*/)[0]
        var promotionPosition = /(p)(?!.*\1)/

        //Black Queen promotion
        if ((lastLine).match('p')) {
            board.position((Chessboard.objToFen(newPos)).replace(promotionPosition, 'q'));
            return 'trash'
        }
    }
    $('#new-game').on('click', () => {
        board.position('3qk3/8/pppppppp/8/8/PPPPPPPP/8/3QK3 w - - 0 1')
        config.draggable = true;
        document.getElementById('color').remove()
        document.getElementById('gameover').style.visibility = 'hidden'
    })

};
$(document).ready(init);

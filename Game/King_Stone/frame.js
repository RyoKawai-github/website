// ******globalな色々な値の定義******
var turn = 0;//FIXME:もうちょいなんかやりようがあるだろう
const currentTurnText = document.getElementById("current-turn");
const board = document.getElementById("board");
const squareTemplate = document.getElementById("square-template");
const pieceTemplate = document.getElementById("piece-template");
const targetTemplate = document.getElementById("target-template");
var board_len = board.getBoundingClientRect().width / 2;
// 盤面や初期配置について
const board_size = 5;
var board_coordinate_list = []
for (let x = 0; x < board_size; x++) {
	for (let y = 0; y < board_size; y++) {
		for (let z = 0; z < board_size; z++) {
			if (x == 0 || y == 0 || z == 0) {
				board_coordinate_list.push([x, y, z]);
			}
		}
	}
}
var square_padding = board_len / (board_size - 1);
var first_piece_set = [
	[1, "king", 1, [0, 4, 0]],
	[1, "king", 2, [2, 4, 0]],
	[1, "king", 3, [4, 4, 0]],
	[1, "stone", 1, [0, 4, 2]],
	[1, "stone", 2, [2, 2, 0]],
	[1, "stone", 3, [0, 0, 2]],
	[1, "stone", 4, [4, 0, 2]],
	[2, "king", 1, [0, 0, 4]],
	[2, "king", 2, [2, 0, 4]],
	[2, "king", 3, [4, 0, 4]],
	[2, "stone", 1, [0, 2, 4]],
	[2, "stone", 2, [2, 0, 2]],
	[2, "stone", 3, [0, 2, 0]],
	[2, "stone", 4, [4, 2, 0]],
];

// ******クラスの作成******
// コマの移動

// ******関数の定義******
// coordinateからdirectionの方向に動いた際の座標を返す
const movePiece = (coordinate, direction) => {
	let moved_coordinate = coordinate.slice();
	moved_coordinate[direction % 3] += (-1) ** direction;
	let diff = Math.min(...moved_coordinate);
	moved_coordinate[0] -= diff;
	moved_coordinate[1] -= diff;
	moved_coordinate[2] -= diff;
	return moved_coordinate;
}
// Stoneの動き
const moveStone = (element, piece_coordinate_list) => {
	const coordinate = getCoordinate(element);
	let moved_coordinate_list = [];
	for (let i of [0, 1, 2, 3, 4, 5]) {
		moved_coordinate = movePiece(coordinate, i);
		if (coordinateIn(board_coordinate_list, moved_coordinate) && !coordinateIn(piece_coordinate_list, moved_coordinate)) {
			moved_coordinate_list.push(moved_coordinate);
		}
	}
	return moved_coordinate_list;
}
// Kingの動き
const moveKing = (element, piece_coordinate_list) => {
	const coordinate = getCoordinate(element);
	let check_coordinate_list = [coordinate];
	let moved_coordinate_list = [coordinate];
	while (check_coordinate_list[0]) {
		let check_coordinate = check_coordinate_list[0];
		for (let i of [0, 1, 2, 3, 4, 5]) {
			let moved_coordinate = check_coordinate.slice();
			let check_mc = movePiece(moved_coordinate, i);
			while (coordinateIn(board_coordinate_list, check_mc) && !coordinateIn(piece_coordinate_list, check_mc)) {
				moved_coordinate = movePiece(moved_coordinate, i);
				check_mc = movePiece(moved_coordinate, i);
			}
			if (!coordinateIn(moved_coordinate_list, moved_coordinate)) {
				moved_coordinate_list.push([moved_coordinate]);
				if (coordinateIn(piece_coordinate_list, check_mc)) {
					const collide_piece = board.querySelectorAll('[data-coordinate="' + check_mc + '"]')[1];
					const player = collide_piece.getAttribute("data-player");
					const name = collide_piece.getAttribute("data-name");
					if (player == turn % 2 + 1 && name == "stone") {
						check_coordinate_list.push(moved_coordinate);
					}
				}
			}
		}
		check_coordinate_list.shift();
	}
	moved_coordinate_list.shift();
	return moved_coordinate_list;
}
// 座標をもらうとその位置に配置する関数
const visualize = (element, coordinate) => {
	x = coordinate[0] * square_padding;
	y = coordinate[1] * square_padding;
	z = coordinate[2] * square_padding;
	element.style.left = board_len + x * (Math.sqrt(2) / Math.sqrt(3)) + y * (-1 / Math.sqrt(6)) + z * (-1 / Math.sqrt(6)) + 'px';
	element.style.top = board_len + x * (0) + y * (1 / Math.sqrt(2)) + z * (-1 / Math.sqrt(2)) + 'px';
	element.style.transform = 'translate(-50%, -50%)';
}
// 要素から座標を取得
const getCoordinate = (element) => {
	return element.getAttribute("data-coordinate").split(',').map(str => parseInt(str, 10));
}
// 座標の配列c_listに座標coが入っているか
const coordinateIn = (c_list, co) => {
	return c_list.some((c) => c[0] == co[0] && c[1] == co[1] && c[2] == co[2]);
}
// 座標の配列c_listから座標coを排除する
const coordinateDel = (c_list, co) => {
	return c_list.filter((c) => !(c[0] == co[0] && c[1] == co[1] && c[2] == co[2]));
}
// 座標の配列A,Bに対してA-Bを出力する(不要)
const coordinateMatrixDiff = (A, B) => {
	return A.filter((a) => !B.some((b) => a[0] == b[0] && a[1] == b[1] && a[2] == b[2]));
}
// コマをクリックした場合の動作
const onClickPiece = (e) => {
	const element = e.target;
	if (element.getAttribute("data-player") == turn % 2 + 1) {
		if (element.classList.contains("active")) {
			element.classList.remove("active");
			const targets = board.getElementsByClassName("target");
			while (targets[0]) {
				targets[0].remove();
			}
		} else {
			const other_active_piece = board.getElementsByClassName("piece active")[0];
			if (other_active_piece) {
				other_active_piece.classList.remove("active");
			}
			const targets = board.getElementsByClassName("target");
			while (targets[0]) {
				targets[0].remove();
			}
			element.classList.add("active");
			createTargets(element);
		}
	}
}
// ターゲットをクリックした場合の動作
const onClickTarget = (e) => {
	const element = e.target;
	const target_piece = board.getElementsByClassName("piece active")[0];
	const coordinate = getCoordinate(element);
	target_piece.setAttribute("data-coordinate", coordinate);
	visualize(target_piece, coordinate);// 可視化
	target_piece.classList.remove("active");
	const targets = board.getElementsByClassName("target");
	while (targets[0]) {
		targets[0].remove();
	}
	// ターンを経過させる
	turn += 1;
	currentTurnText.textContent = turn % 2 + 1;
}
// マス目の設置
const createSquares = () => {
	for (const coordinate of board_coordinate_list) {
		const square = squareTemplate.cloneNode(true); //テンプレートから要素をクローン
		square.removeAttribute("id"); //テンプレート用のid属性を削除
		square.setAttribute("data-coordinate", coordinate);// dataに値を持たせる
		visualize(square, coordinate);// 可視化
		board.appendChild(square); //マス目のHTML要素を盤に追加
	}
};
// コマの設置
const createPieces = (piece_set) => {
	for (const piece_value of piece_set) {
		const piece = pieceTemplate.cloneNode(true); //テンプレートから要素をクローン
		piece.removeAttribute("id"); //テンプレート用のid属性を削除
		// dataに値を持たせる
		piece.setAttribute("data-player", piece_value[0]);
		piece.setAttribute("data-name", piece_value[1]);
		piece.setAttribute("data-index", piece_value[2]);
		piece.setAttribute("data-coordinate", piece_value[3]);

		visualize(piece, piece_value[3]); // 可視化
		piece.addEventListener('click', (e) => {
			onClickPiece(e);
		})
		board.appendChild(piece); //マス目のHTML要素を盤に追加
	}
};
// ターゲットの設置
const createTargets = (element) => {
	const pieces = board.getElementsByClassName("piece");
	const coordinate = getCoordinate(element);
	let piece_coordinate_list = [];
	for (const piece of pieces) {
		piece_coordinate_list.push(getCoordinate(piece));
	}
	piece_coordinate_list = coordinateDel(piece_coordinate_list, coordinate);
	let coordinate_list = [];
	if (element.getAttribute("data-name") == "stone") {
		coordinate_list = moveStone(element, piece_coordinate_list);
	} else if (element.getAttribute("data-name") == "king") {
		coordinate_list = moveKing(element, piece_coordinate_list);
	} else {
		console.log("else");
	}
	for (const target_coordinate of coordinate_list) {
		const target = targetTemplate.cloneNode(true); //テンプレートから要素をクローン
		target.removeAttribute("id"); //テンプレート用のid属性を削除
		target.setAttribute("data-coordinate", target_coordinate);// dataに値を持たせる
		visualize(target, target_coordinate);// 可視化
		target.addEventListener('click', (e) => {
			onClickTarget(e);
		})
		board.appendChild(target); //マス目のHTML要素を盤に追加
	}
};

// ******最初に処理する内容******
window.onload = () => {
	createSquares();
	createPieces(first_piece_set);
};

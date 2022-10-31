// ******globalな色々な値の定義******
var turn = 0;
var player = 1;
const currentTurn = document.getElementById("current-turn");
const currentPlayer = document.getElementById("current-player");
const message = document.getElementById("message");
const log = document.getElementById("log");
const board = document.getElementById("board");
var square_padding = 37;

// ******可視化関数******
// 座標をもらうとその位置に配置する関数
const visualize = (element, coordinate) => {
	x = coordinate[0] * square_padding;
	y = coordinate[1] * square_padding;
	z = coordinate[2] * square_padding;
	element.style.left = (board.getBoundingClientRect().width / 2) + x * (Math.sqrt(2) / Math.sqrt(3)) + y * (-1 / Math.sqrt(6)) + z * (-1 / Math.sqrt(6)) + 'px';
	element.style.top = (board.getBoundingClientRect().height / 2) + x * (0) + y * (1 / Math.sqrt(2)) + z * (-1 / Math.sqrt(2)) + 'px';
	element.style.transform = 'translate(-50%, -50%)';
}

// ******座標関係の関数******
// 要素から座標を取得
const getCoordinate = (element) => {
	return element.getAttribute("data-coordinate").split(',').map(str => parseInt(str, 10));
}
// 座標同士の足し算
const addCoordinate = (c1, c2) => {
	return [c1[0] + c2[0], c1[1] + c2[1], c1[2] + c2[2]];
}
// 座標の正規化
const normalizeCoordinate = (c) => {
	const diff = Math.min(...c);
	return [c[0] - diff, c[1] - diff, c[2] - diff];
}
// 座標c1とc2が等しいかどうか
const coordinateEq = (c1, c2) => {
	return c1[0] == c2[0] && c1[1] == c2[1] && c1[2] == c2[2];
}
// 座標の配列c_listに座標coが入っているか
const coordinateIn = (c_list, co) => {
	return c_list.some((c) => c[0] == co[0] && c[1] == co[1] && c[2] == co[2]);
}
// 座標の配列c_listから座標coを排除する
const coordinateDel = (c_list, co) => {
	return c_list.filter((c) => !(c[0] == co[0] && c[1] == co[1] && c[2] == co[2]));
}
// 周辺の座標を出力する
const searchCoordinate = (base_coordinate, move_type) => {
	const coordinate_list = [];
	if (move_type == 2) {
		move_list = [
			[2, 0, 0],
			[2, 2, 0],
			[0, 2, 0],
			[0, 2, 2],
			[0, 0, 2],
			[2, 0, 2]];
	} else if (move_type == 3) {
		move_list = [
			[2, 1, 0],
			[1, 2, 0],
			[0, 2, 1],
			[0, 1, 2],
			[1, 0, 2],
			[2, 0, 1]];
	} else {
		move_list = [
			[1, 0, 0],
			[1, 1, 0],
			[0, 1, 0],
			[0, 1, 1],
			[0, 0, 1],
			[1, 0, 1]];
	}
	for (move of move_list) {
		coordinate_list.push(normalizeCoordinate(addCoordinate(base_coordinate, move)));
	}
	return coordinate_list;
}
// ******盤面関係******

//// targetを全て削除する
//const targetAllDel = () => {
//	const checkmates = board.getElementsByClassName("checkmate");
//	while (checkmates[0]) {
//		checkmates[0].removeEventListener('click', onClickCheckmate);
//		checkmates[0].classList.remove("checkmate");
//	}
//	const targets = board.getElementsByClassName("target");
//	while (targets[0]) {
//		targets[0].removeEventListener('click', onClickTarget);
//		targets[0].classList.remove("target");
//	}
//}
//// コマをクリックした場合の動作
//const onClickPiece = (e) => {
//	const element = e.target;
//	if (element.getAttribute("data-player") == turn % 2 + 1 && checkmate == 0) {
//		if (element.classList.contains("active")) {
//			element.classList.remove("active");
//			targetAllDel();
//		} else {
//			const other_active_piece = board.getElementsByClassName("piece active")[0];
//			if (other_active_piece) { other_active_piece.classList.remove("active"); }
//			targetAllDel();
//			element.classList.add("active");
//			setTargets(element);
//		}
//	}
//};
//// ターゲットの設置
//const setTargets = (element) => {
//	const pieces = board.getElementsByClassName("piece");
//	const coordinate = getCoordinate(element);
//	let piece_coordinate_list = [];
//	for (const piece of pieces) { piece_coordinate_list.push(getCoordinate(piece)); }
//	piece_coordinate_list = coordinateDel(piece_coordinate_list, coordinate);
//	if (element.getAttribute("data-name") == "stone") {
//		moveStone(element, piece_coordinate_list);
//	} else if (element.getAttribute("data-name") == "king") {
//		moveKing(element, piece_coordinate_list);
//	} else {
//		console.log("else");
//	}
//};
//// ターゲットをクリックした場合の動作
//const onClickTarget = (e) => {
//	const element = e.target;
//	const target_piece = board.getElementsByClassName("piece active")[0];
//	const coordinate = getCoordinate(element);
//	let logger = "move:[" + target_piece.getAttribute("data-coordinate") + "] -> [" + coordinate + "]\n";
//	target_piece.setAttribute("data-coordinate", coordinate);
//	visualize(target_piece, coordinate);// 可視化
//	target_piece.classList.remove("active");
//	targetAllDel();
//	// ターンを経過させる
//	turn += 1;
//	log = log + logger;
//	currentTurn.innerText = "ターン: " + turn;
//	turnPlayerText.innerText = "現在の手番: player" + (turn % 2 + 1);
//	log.innerText = log;
//};

// coordinate_listの中でclass_nameでplayer_numなものを探す
const adjacentChecker = (coordinate, distance, class_name, player_num) => {
	const coordinate_list = searchCoordinate(coordinate, distance);
	let match_coordinate_list = [];
	for (const coordinate of coordinate_list) {
		const element = board.querySelectorAll('[data-coordinate="' + coordinate + '"]')[0];
		if (element && element.classList.contains(class_name) && element.getAttribute("data-player") == player_num) {
			match_coordinate_list.push(getCoordinate(element));
		}
	}
	return match_coordinate_list;
}
// 道をクリックした場合の動作
const onClickRoad = (e) => {
	const road = e.target;
	const road_coordinate = getCoordinate(road);
	if (turn == 0) {
		road.setAttribute("data-player", player);
		//TODO:2本以上置かせない
	} else {
		let data = road.getAttribute("data-player");
		if (data == "0") {
			let bool = false;
			let adjacent_crossroads_coordinate_list = adjacentChecker(road_coordinate, 1, "crossroads", player);
			if (adjacent_crossroads_coordinate_list.length == 0) {
				adjacent_crossroads_coordinate_list = adjacentChecker(road_coordinate, 1, "crossroads", 0);
				for (const adjacent_crossroads_coordinate of adjacent_crossroads_coordinate_list) {
					const adjacent_road_coordinate_list = adjacentChecker(adjacent_crossroads_coordinate, 1, "road", player);
					if (adjacent_road_coordinate_list.length != 0) {
						bool = true;
					}
				}
			} else {
				bool = true;
			}
			if (bool) {
				//TODO:資源を減らす
				road.setAttribute("data-player", player);
				message.innerText = "";
				log.innerText += "build Road on road-" + road_coordinate + "\n";
			} else {
				message.innerText = "繋がっていないため、そこには置けません。";
			}
		} else {
			message.innerText = "そこには既に道が置かれています。";
		}
	}
}

// 地形をクリックした場合の動作
const onClickTerrain = (e) => {
	const terrain = e.target;
	let data = terrain.getAttribute("data-terrain");
	if (data == "Desert") {
		data = "Hills";
	} else if (data == "Hills") {
		data = "Forest";
	} else if (data == "Forest") {
		data = "Pasture";
	} else if (data == "Pasture") {
		data = "Fields";
	} else if (data == "Fields") {
		data = "Mountains";
	} else {
		data = "Desert";
	}
	terrain.setAttribute("data-terrain", data);
}

// 交差点をクリックした場合の動作
const onClickCrossroads = (e) => {
	const crossroads = e.target;
	const crossroads_coordinate = getCoordinate(crossroads);
	if (turn == 0) {
		crossroads.setAttribute("data-player", player);
		//TODO:2本以上置かせない
	} else {
		let data = crossroads.getAttribute("data-player");
		if (data == "0") {
			let adjacent_road_coordinate_list = adjacentChecker(crossroads_coordinate, 1, "road", player);
			if (adjacent_road_coordinate_list.length != 0) {
				//TODO:資源を減らす
				crossroads.setAttribute("data-player", player);
				crossroads.setAttribute("data-crossroads", "Settlement");
				message.innerText = "";
				log.innerText += "build Settlement on crossroads-" + crossroads_coordinate + "\n";
			} else {
				message.innerText = "繋がっていないため、そこには置けません。";
			}
		} else if (data == String(player)) {
			message.innerText = "uo";
		} else {
			message.innerText = "そこには既に建物が置かれています。";
		}
	}
}

// 盤面の設置
const createBoardContents = () => {
	const terrainTemplate = document.getElementById("terrain-template");
	const thief = document.getElementById("thief");//FIXME:追加
	const roadTemplate = document.getElementById("road-template");
	const crossroadsTemplate = document.getElementById("crossroads-template");
	// 地形の設置
	for (const coordinate of terrain_coordinate_list) {
		const terrain = terrainTemplate.cloneNode(true); //テンプレートから要素をクローン
		terrain.removeAttribute("id"); //テンプレート用のid属性を削除
		terrain.setAttribute("data-coordinate", coordinate);// dataに値を持たせる
		terrain.addEventListener('click', onClickTerrain);// クリックした際のactionを持たせる
		visualize(terrain, coordinate);// 可視化
		board.appendChild(terrain); //マス目のHTML要素を盤に追加
	}
	// 道路の設置
	for (let i = 0; i < road_coordinate_list.length; i++) {
		const road = roadTemplate.cloneNode(true); //テンプレートから要素をクローン
		road.removeAttribute("id"); //テンプレート用のid属性を削除
		road.setAttribute("data-coordinate", road_coordinate_list[i]);// dataに値を持たせる
		road.addEventListener('click', onClickRoad);// クリックした際のactionを持たせる
		visualize(road, road_coordinate_list[i]);// 可視化
		if (road_rotate_list[i] == 0) {
			road.style.transform += 'rotate(-60deg)';
		} else if (road_rotate_list[i] == 2) {
			road.style.transform += 'rotate(60deg)';
		}
		board.appendChild(road); //マス目のHTML要素を盤に追加
	}
	// 交差点の設置
	for (const coordinate of crossroads_coordinate_list) {
		const crossroads = crossroadsTemplate.cloneNode(true); //テンプレートから要素をクローン
		crossroads.removeAttribute("id"); //テンプレート用のid属性を削除
		crossroads.setAttribute("data-coordinate", coordinate);// dataに値を持たせる
		crossroads.addEventListener('click', onClickCrossroads);// クリックした際のactionを持たせる
		visualize(crossroads, coordinate);// 可視化
		board.appendChild(crossroads); //マス目のHTML要素を盤に追加
	}
};


// ******ボタン関係******
// ログをテキストファイルに書き出す
const onClickLogPrint = () => {
	let ary = log.innerText.split(''); // 配列形式に変換（後述のBlobで全要素出力）
	let blob = new Blob(ary, { type: "text/plan" }); // テキスト形式でBlob定義
	let link = document.createElement('a'); // HTMLのaタグを作成
	link.href = URL.createObjectURL(blob); // aタグのhref属性を作成
	link.download = 'log.txt'; // aタグのdownload属性を作成
	link.click(); // 定義したaタグをクリック（実行）
}

// ターンを次に進める
const onClickGoNextTurn = () => {
	turn += 1;
	player = (turn - 1) % 4 + 1;
	currentTurn.innerText = turn;
	currentPlayer.innerText = player;
}
// ボタンの設置
const createButtons = () => {
	const go_next_turn = document.getElementById("go-next-turn");
	const log_print = document.getElementById("log-print");
	log_print.addEventListener('click', onClickLogPrint)
};

// 盤面や初期配置について
//const board_size = 11;
//const board_coordinate_list = []
//for (let x = 0; x < board_size; x++) {
//	for (let y = 0; y < board_size; y++) {
//		for (let z = 0; z < board_size; z++) {
//			if (x == 0 || y == 0 || z == 0) {
//				board_coordinate_list.push([x, y, z]);
//			}
//		}
//	}
//}

currentTurn.innerText = turn;
currentPlayer.innerText = player;

const terrain_coordinate_list = [
	[4, 0, 8],
	[0, 0, 6],
	[0, 4, 8],
	[0, 6, 6],
	[0, 8, 4],
	[0, 6, 0],
	[4, 8, 0],
	[6, 6, 0],
	[8, 4, 0],
	[6, 0, 0],
	[8, 0, 4],
	[6, 0, 6],
	[2, 0, 4],
	[0, 2, 4],
	[0, 4, 2],
	[2, 4, 0],
	[4, 2, 0],
	[4, 0, 2],
	[0, 0, 0]];
const road_coordinate_list = [];
const road_rotate_list = [];
for (terrain of terrain_coordinate_list) {
	let road_coordinates = searchCoordinate(terrain, 3);
	for (index of [0, 1, 2, 3, 4, 5]) {
		let road = road_coordinates[index];
		if (!coordinateIn(road_coordinate_list, road)) {
			road_coordinate_list.push(road);
			road_rotate_list.push(index % 3);
		}
	}
}
console.log(road_coordinate_list.length)
const crossroads_coordinate_list = [];
for (terrain of terrain_coordinate_list) {
	let crossroads_coordinates = searchCoordinate(terrain, 2);
	for (crossroads of crossroads_coordinates) {
		if (!coordinateIn(crossroads_coordinate_list, crossroads)) {
			crossroads_coordinate_list.push(crossroads);
		}
	}
}
const number_list = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,]

let test = [];
if (test.length != 0) {
	console.log("True");
} else {
	console.log("False");
}

if (undefined) {
	console.log("True");
} else {
	console.log("False");
}
// ******最初に処理する内容******
window.onload = () => {
	//createSquares();
	createBoardContents();
	//createButtons();
};

const ListTable = document.getElementById("List_Table");
let column_no_prev = 0;

//文字列ソート（昇順）
function compareString(a, b) {
	if (a.value < b.value) {
		return -1;
	} else {
		return 1;
	}
	return 0;
}
//文字列ソート（降順）
function compareStringDesc(a, b) {
	if (a.value > b.value) {
		return -1;
	} else {
		return 1;
	}
	return 0;
}

const sortTable = () => {
	const e = (window.event) ? window.event : arguments.callee.caller.arguments[0];
	const self = e.target || e.srcElement;
	let column_no = self.cellIndex; //クリックされた列番号
	let table_body = ListTable.getElementsByTagName("tbody")[0];
	let sortArray = new Array; //クリックした列のデータを全て格納する配列
	for (let r of table_body.rows) {
		//行番号と値を配列に格納
		let column = new Object;
		column.row = r;
		if (column_no == 1) {
			column.value = r.cells[column_no].className;
		} else {
			column.value = r.cells[column_no].textContent;
		}
		sortArray.push(column);
	}
	if (column_no_prev == column_no) { //同じ列が2回クリックされた場合は降順ソート
		sortArray.sort(compareStringDesc);
	} else {
		sortArray.sort(compareString);
	}
	//ソート後のTRオブジェクトを順番にtbodyへ追加（移動）
	for (let i = 0; i < sortArray.length; i++) {
		table_body.appendChild(sortArray[i].row);
	}
	//昇順／降順ソート切り替えのために列番号を保存
	if (column_no_prev == column_no) {
		column_no_prev = -1; //降順ソート
	} else {
		column_no_prev = column_no;
	}
}

const onClickTableTrHref = () => {
	const e = (window.event) ? window.event : arguments.callee.caller.arguments[0];
	const self = e.target || e.srcElement;
	location = self.closest("tr").getAttribute("data-href");
}


const ths = document.querySelectorAll('#List_Table th');
for (let th of ths) {
	th.setAttribute('onclick', "sortTable()");
}

const trs = document.querySelectorAll('#List_Table tbody tr');
for (let tr of trs) {
	tr.setAttribute('onclick', "onClickTableTrHref()");
}

const onClickButtonTableFilterOnClass = (e) => {
	const re = e.value;
	for (let tr of trs) {
		const cat = tr.querySelectorAll("td")[1].className;
		if (cat.match(re) != null) {
			tr.style.display = 'table-row';
		} else {
			tr.style.display = 'none';
		}
	}
}

const onClickButtonTableFilterOnTitle = () => {
	const search_title = document.getElementById('search_title').value;
	for (let tr of trs) {
		const title = tr.querySelectorAll("td")[2].textContent;
		if (title.match(search_title) == null) {
			tr.style.display = 'none';
		}
	}
}

const onClickButtonTableShowAll = () => {
	for (let tr of trs) {
		tr.style.display = 'table-row';
	}
}

window.onload = () => {
	ths[0].click();
}

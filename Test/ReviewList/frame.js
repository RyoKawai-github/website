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

const catSelect = document.getElementById('cat_filter');

const onClickButtonTableFilterOnClass = () => {
	const re = catSelect.value;
	console.log(re);
	for (let tr of trs) {
		console.log(tr);
		const cat = tr.querySelectorAll()[1];
	}
}

//catSelect.addEventListener('change', "onClickButtonTableFilterOnClass()");
//catSelect.addEventListener('change', function () {
//	var re = catSelect.value;
//	console.log(re);
//	$('#List_Table tbody tr').each(function () {
//		var cat = $(this).find("td:eq(1)").attr("class");
//		console.log(cat);
//		if (cat.match(re) != null) {
//			$(this).show();
//		} else {
//			$(this).hide();
//		}
//	});
//});

//$(function () {
//	$('#button1').bind("click", function () {
//		var re = new RegExp($('#search_title').val());
//		$('#List_Table tbody tr').each(function () {
//			console.log($(this).find("td:eq(2)"));
//			var txt = $(this).find("td:eq(2)").html();
//			console.log(txt);
//			if (txt.match(re) != null) {
//				$(this).show();
//			} else {
//				$(this).hide();
//			}
//		});
//	});
//	$('#button2').bind("click", function () {
//		$('#search_title').val('');
//		$('#List_Table tr').show();
//	});
//});

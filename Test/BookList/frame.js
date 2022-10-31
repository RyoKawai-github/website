// targetを全て削除する
const targetAllDel = () => {
	const actives = document.getElementsByClassName("active");
	while (actives[0]) {
		actives[0].classList.remove("active");
	}
	const shows = document.getElementsByClassName("show");
	while (shows[0]) {
		shows[0].classList.remove("show");
	}
}
// ターゲットの設置
const showContent = (element) => {
	const parent = element.parentNode;
	const items = parent.getElementsByClassName("tab-item");
	const items_array = [].slice.call(items);// 配列への変換
	let index = items_array.indexOf(element);
	const contents = parent.getElementsByClassName("tab-content");
	let show_element = contents[index];
	show_element.classList.add("show");
};

// コマをクリックした場合の動作
const onClickItems = () => {
	const e = (window.event) ? window.event : arguments.callee.caller.arguments[0];
	const self = e.target || e.srcElement;
	if (self.classList.contains("active")) {
		targetAllDel();
	} else {
		targetAllDel();
		self.classList.add("active");
		showContent(self);
	}
};

const ReviewBoxes = document.getElementsByClassName("ReviewBox");
for (const ReviewBox of ReviewBoxes) {
	const tab_items = ReviewBox.getElementsByClassName("tab-item");
	if (tab_items.length > 1) {
		for (let i = 0; i < tab_items.length; i++) {
			tab_items[i].innerText = "レビュー" + (i + 1);
		}
	}
}

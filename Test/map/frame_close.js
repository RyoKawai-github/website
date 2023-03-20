const ErrorMessage = document.getElementById("errorMessage");

const BookPageURLList = [
	"https://kyushu-u.libapps.com/libguides/admin_c.php?g=948899&p=6925929",
	"https://kyushu-u.libapps.com/libguides/admin_c.php?g=948899&p=6925930",
	"https://kyushu-u.libapps.com/libguides/admin_c.php?g=948899&p=6925931",
	"https://kyushu-u.libapps.com/libguides/admin_c.php?g=948899&p=6925932",
	"https://kyushu-u.libapps.com/libguides/admin_c.php?g=948899&p=6925933",
	"https://kyushu-u.libapps.com/libguides/admin_c.php?g=948899&p=6925934",
	"https://kyushu-u.libapps.com/libguides/admin_c.php?g=948899&p=6925935",
	"https://kyushu-u.libapps.com/libguides/admin_c.php?g=948899&p=6925937",
	"https://kyushu-u.libapps.com/libguides/admin_c.php?g=948899&p=6925938",
	"https://kyushu-u.libapps.com/libguides/admin_c.php?g=948899&p=6925940"
];

const CatchPage = async (URL) => {
	const page = await fetch(URL);
	const html = await page.text();
	const dom = new DOMParser().parseFromString(html, 'text/html');
	return dom;
}

const CatchPage_inID = async (URL, ID) => {
	const page = await fetch(URL);
	const html = await page.text();
	const dom = new DOMParser().parseFromString(html, 'text/html');
	const domTarget = dom.getElementById(ID);
	if (domTarget != null) {
		console.log("ISBNが同じ本があるか:True");
		return domTarget;
	} else {
		console.log("ISBNが同じ本があるか:False");
		throw null;
	}
}

const UpdatePageHTML = async (dom, containerID, selector_css, html_str) => {
	const editButton = dom.getElementById("s-lg-admin-edit-content-text-" + containerID + "-container");
	const editButtonHTML = editButton.lastElementChild.children[1].firstElementChild;
	console.assert(editButtonHTML != null, "not exists " + containerID + " button");
	const document_obj = document.createElement("div");
	document_obj.appendChild(editButtonHTML);
	editButtonHTML.click();
	await new Promise((resolve) => {
		let counter = 0;
		const timerId = setInterval(() => {
			if (++counter > 99 || document.getElementById("s-lg-editor-content") != null) {
				clearInterval(timerId);
				resolve(0);
			}
		}, 100)
	})
	const textArea = document.getElementById("s-lg-editor-content");
	const content_html = document.createElement("div");
	content_html.innerHTML = textArea.value;
	const target = content_html.querySelector(selector_css);
	target.innerHTML = "\n" + html_str + target.innerHTML;
	textArea.value = content_html.innerHTML;
	const textSaveButton = document.getElementById("s-lib-alert-btn-first");
	console.assert(textSaveButton != null, "not find save button");
	textSaveButton.click();
	await new Promise((resolve) => {
		let counter = 0;
		const timerId = setInterval(() => {
			if (++counter > 99 || document.getElementById("s-lib-alert-btn-first") == null) {
				clearInterval(timerId);
				resolve(0);
			}
		}, 100)
	})
	return 0;
}

const onClickUpdate_Add_New = async (page_number) => {
	let counter = 2;
	const BookList = document.getElementById("BookList");
	const BookList_HTML = BookList.innerHTML;
	const ReviewList = document.querySelector("#List_Table tbody");
	const ReviewList_HTML = ReviewList.innerHTML;

	const dom_book_page = await CatchPage(BookPageURLList[page_number]).catch(val => { console.log("not get page DOM"); });
	await UpdatePageHTML(dom_book_page, BookPageContentIDList[page_number], "#BookList", BookList_HTML)
		.catch(val => {
			alert("分野別ブックレビューの更新に失敗しました");
			counter += 1;
			const Message = MakePreviewContent("<h1>Step " + counter + ": 分野別ブックレビューへの追加</h1><p>「クリップボードにコピー」を押して、<a href=\"" + BookPageURLList[page_number] + "\" target=\"_blank\">こちらのページ</a>の該当箇所に追加してください。うまくいかない場合は「保存(出力)」を押して、slackなどで共有してください。</p>", BookList_HTML, "ブックレビュー_分野" + page_number + "_追加用");
			OutputHTMLandPrint.appendChild(Message);
		});
	const dom_review_page = await CatchPage("https://kyushu-u.libapps.com/libguides/admin_c.php?g=948899&p=6925921").catch(val => { console.log("not get page DOM"); });
	await UpdatePageHTML(dom_review_page, "50556134", "#List_Table tbody", ReviewList_HTML)
		.catch(val => {
			alert("レビュー一覧の更新に失敗しました");
			counter += 1;
			const Message = MakePreviewContent("<h1>Step " + counter + ": レビュー一覧への追加</h1><p>「クリップボードにコピー」を押して、<a href=\"https://kyushu-u.libapps.com/libguides/admin_c.php?g=948899&p=6925921\" target=\"_blank\">こちらのページ</a>の該当箇所に追加してください。うまくいかない場合は「保存(出力)」を押して、slackなどで共有してください。</p>", ReviewList_HTML, "ブックレビュー_レビュー一覧_追加用");
			OutputHTMLandPrint.appendChild(Message);
		});
	if (counter == 2) { alert("正常に更新されました") }
}

const onClickUpdate_Add_Review = async (page_number) => {
	targetAllDel();// ブックレビューのjsの関数
	let counter = 2;
	const ID = document.getElementById("BookList").children[0].getAttribute("id");
	const BookList_ReviewBox = document.querySelector("#BookList .ReviewBox");
	const Container = document.createElement("div");
	Container.innerHTML = BookList_ReviewBox.innerHTML;
	while (Container.childNodes[4]) {
		Container.removeChild(Container.lastChild);
	}
	const BookList_HTML = Container.innerHTML.slice(1);
	const ReviewList = document.querySelector("#List_Table tbody");
	const ReviewList_HTML = ReviewList.innerHTML;

	const dom_book_page = await CatchPage(BookPageURLList[page_number]).catch(val => { console.log("not get page DOM"); });
	await UpdatePageHTML(dom_book_page, BookPageContentIDList[page_number], "#" + ID + " .ReviewBox", BookList_HTML)
		.catch(val => {
			alert("分野別ブックレビューの更新に失敗しました");
			counter += 1;
			const Message = MakePreviewContent("<h1>Step " + counter + ": 分野別ブックレビューへの追加</h1><p>「クリップボードにコピー」を押して、<a href=\"" + BookPageURLList[page_number] + "\" target=\"_blank\">こちらのページ</a>の該当箇所に追加してください。うまくいかない場合は「保存(出力)」を押して、slackなどで共有してください。</p>", BookList_HTML, "ブックレビュー_分野" + page_number + "_追加用");
			OutputHTMLandPrint.appendChild(Message);
		});
	const dom_review_page = await CatchPage("https://kyushu-u.libapps.com/libguides/admin_c.php?g=948899&p=6925921").catch(val => { console.log("not get page DOM"); });
	await UpdatePageHTML(dom_review_page, "50556134", "#List_Table tbody", ReviewList_HTML)
		.catch(val => {
			alert("レビュー一覧の更新に失敗しました");
			counter += 1;
			const Message = MakePreviewContent("<h1>Step " + counter + ": レビュー一覧への追加</h1><p>「クリップボードにコピー」を押して、<a href=\"https://kyushu-u.libapps.com/libguides/admin_c.php?g=948899&p=6925921\" target=\"_blank\">こちらのページ</a>の該当箇所に追加してください。うまくいかない場合は「保存(出力)」を押して、slackなどで共有してください。</p>", ReviewList_HTML, "ブックレビュー_レビュー一覧_追加用");
			OutputHTMLandPrint.appendChild(Message);
		});
	if (counter == 2) { alert("正常に更新されました") }
}

const checkData = () => {
	// 入力部分の受け取り
	const BookISBN = document.getElementById("inputBookISBN");
	const BookID = document.getElementById("inputBookID");
	const BookClass = document.getElementById("inputBookClass");
	const BookTitle = document.getElementById("inputBookTitle");
	// 入力部分の修正
	let ErrorMessage_Text = "";
	// ISBNの修正
	let BookId = "";
	let BookISBN_Text_S = (BookISBN.value).toString();
	if (BookISBN_Text_S.match(/^\d{10}$/g)) {
		let checker_num = 0;
		for (let i = 1; i < BookISBN_Text_S.length; i++) {
			checker_num += (11 - i) * Number(BookISBN_Text_S[i - 1]);
		}
		checker_num = ((11 - (checker_num % 11)) % 11) % 10;
		if (checker_num == Number(BookISBN_Text_S[9])) {
			BookISBN_Text_S = "978" + BookISBN_Text_S;
			checker_num = 0;
			for (let i = 1; i < BookISBN_Text_S.length; i++) {
				checker_num += (3 - (i % 2) * 2) * Number(BookISBN_Text_S[i - 1]);
			}
			checker_num = (10 - (checker_num % 10)) % 10;
			BookISBN_Text_S = BookISBN_Text_S.slice(0, 12) + String(checker_num);
			BookISBN.value = Number(BookISBN_Text_S);
			BookId = "ISBN_" + BookISBN.value;
		} else {
			ErrorMessage_Text = "ISBNが間違っています";
		}
	} else if (BookISBN_Text_S.match(/^\d{13}$/g)) {
		let checker_num = 0;
		for (let i = 1; i < BookISBN_Text_S.length; i++) {
			checker_num += (3 - (i % 2) * 2) * Number(BookISBN_Text_S[i - 1]);
		}
		checker_num = (10 - (checker_num % 10)) % 10;
		if (checker_num == Number(BookISBN_Text_S[12])) {
			BookId = "ISBN_" + BookISBN.value;
		} else {
			ErrorMessage_Text = "ISBNが間違っています";
		}
	} else if (BookISBN_Text_S == "") {
		if (BookID.value == "") {
			ErrorMessage_Text = "ISBNを入力するか, 書誌IDまたはレコードIDを入力してください";
		} else {
			BookId = "BibD_" + BookID.value;
		}
	} else {
		ErrorMessage_Text = "ISBNが間違っています";
	}
	return {
		ErrorMessage_: ErrorMessage_Text,
		ID: BookId,
	};

}

const onClickMakePreview = (Identifier) => {
	// 画像から情報を取得する
	const e = (window.event) ? window.event : arguments.callee.caller.arguments[0];
	const self = e.target || e.srcElement;
	// 後の行に書いているものが多い
	// const _ImageURL = self.src;
	const _ID = self.getAttribute("data-ID");
	// const _Series = self.getAttribute("data-Series");
	// const _URL = self.getAttribute("data-URL");
	const _Class = self.getAttribute("data-Class");
	let _Title = self.getAttribute("data-Title");
	let _Author = self.getAttribute("data-Author");
	// const _Publication = self.getAttribute("data-Publication");
	const _Date = self.getAttribute("data-Date");
	const _Name = self.getAttribute("data-Name");
	const _Text = self.getAttribute("data-Text");
	// 既存部分の消去
	while (OutputHTMLandPrint.firstChild) {
		OutputHTMLandPrint.removeChild(OutputHTMLandPrint.firstChild);
	}
	// 要素の作成
	const Message0 = document.createElement("div");
	const Message1 = document.createElement("div");
	const Message2 = document.createElement("div");
	const Message0_1 = document.createElement("h1");
	Message0_1.innerText = "レビュー一覧";
	const Message0_2 = document.createElement("h1");
	Message0_2.innerText = "分野別ブックレビュー";
	const Message0_3 = document.createElement("h1");
	Message0_3.innerText = "pop";

	const QRcode = document.createElement("div");

	const BookList = document.createElement("ul");
	BookList.setAttribute("id", "BookList");
	const ReviewList = document.createElement("table");
	ReviewList.setAttribute("id", "List_Table");

	const popBox = document.createElement("div");
	popBox.setAttribute("id", "popBox");
	const popBox1 = document.createElement("div");
	popBox1.setAttribute("id", "popBox1");
	const popBox2 = document.createElement("div");
	popBox2.setAttribute("id", "popBox2");
	const popBox3 = document.createElement("div");
	popBox3.setAttribute("id", "popBox3");
	const popTitle = document.createElement("p");
	popTitle.setAttribute("id", "popTitle");
	const popAuthor = document.createElement("p");
	popAuthor.setAttribute("id", "popAuthor");
	const popText = document.createElement("p");
	popText.setAttribute("id", "popText");
	const popName = document.createElement("p");
	popName.setAttribute("id", "popName");
	const popQRup = document.createElement("p");
	popQRup.setAttribute("id", "popQRup");

	const ButtonUpdate = document.createElement("input");
	ButtonUpdate.classList.add("madeButton");
	const ButtonPrint = document.createElement("input");
	ButtonPrint.classList.add("madeButton");
	// コードの作成
	if (Identifier == "Add_New") {
		const _ImageURL = self.src;
		const _Series = self.getAttribute("data-Series");
		const _URL = self.getAttribute("data-URL");
		const _Publication = self.getAttribute("data-Publication");
		const [_ID_name, _ID_num] = _ID.split("_");
		const BookList_Text =
			"<li id=\"" + _ID + "\">\n" +
			"\t<div class=\"BookBox\"><a href=\"" + _URL + "\">\n" +
			"\t\t<div class=\"ImgBox\"><img src=\"" + _ImageURL + "\" alt=\"" + _Title + "\"></div>\n" +
			"\t\t<div class=\"DetailBox\">\n" +
			"\t\t\t<p class=\"book-title\">" + _Title + "</p>\n" +
			"\t\t\t<p class=\"book-series\">" + _Series + "</p>\n" +
			"\t\t\t<p class=\"book-author\">" + _Author + "</p>\n" +
			"\t\t\t<p class=\"book-publication\">" + _Publication + "</p>\n" +
			"\t\t\t<p class=\"book-" + _ID_name + "\">" + _ID_num + "</p>\n" +
			"\t\t</div>\n" +
			"\t</a></div>\n" +
			"\t<div class=\"ReviewBox\">\n" +
			"\t\t<div class=\"tab-item\" onclick=\"onClickItems()\">レビュー</div>\n" +
			"\t\t<div class=\"tab-content\">\n" +
			"\t\t\t<div class=\"review-info\">\n" +
			"\t\t\t\t<p><span>Date</span>" + _Date + "</p>\n" +
			"\t\t\t\t<p><span>Name</span>" + _Name + "</p>\n" +
			"\t\t\t</div>\n" +
			"\t\t\t<div class=\"review-text\">\n" +
			_Text + "\n" +
			"\t\t\t</div>\n" +
			"\t\t</div>\n" +
			"\t</div>\n" +
			"</li>";
		BookList.innerHTML = BookList_Text;
	} else {
		const _BookInnerHTML = self.getAttribute("data-BookInnerHTML");
		BookList.innerHTML = _BookInnerHTML;
		_Title = BookList.querySelector(".book-title").innerText;
		_Author = BookList.querySelector(".book-author").innerText;
		const BookList_ReviewBox = BookList.querySelector(".ReviewBox");
		const BookList_Text =
			"\t\t<div class=\"tab-item\" onclick=\"onClickItems()\">レビュー</div>\n" +
			"\t\t<div class=\"tab-content\">\n" +
			"\t\t\t<div class=\"review-info\">\n" +
			"\t\t\t\t<p><span>Date</span>" + _Date + "</p>\n" +
			"\t\t\t\t<p><span>Name</span>" + _Name + "</p>\n" +
			"\t\t\t</div>\n" +
			"\t\t\t<div class=\"review-text\">\n" +
			_Text + "\n" +
			"\t\t\t</div>\n" +
			"\t\t</div>";
		BookList_ReviewBox.innerHTML = "\n" + BookList_Text + BookList_ReviewBox.innerHTML;
	}
	const ReviewList_Text =
		"\t\t<tr data-href=\"https://guides.lib.kyushu-u.ac.jp/bookreview/booklist/class0" + _Class + "#" + _ID + "\"><td><time>" + _Date + "</time></td><td class=\"cat" + _Class + "\"></td><td>" + _Title + "</td></tr>";
	ReviewList.innerHTML = "<thead><tr><th>Date</th><th>Category</th><th>Title</th></tr></thead><tbody>" + ReviewList_Text + "</tbody>";
	const BookList_Page_URL = "https://guides.lib.kyushu-u.ac.jp/bookreview/booklist/class0" + _Class + "#" + _ID;
	// メッセージの作成
	Message0.innerHTML = "<h1>プレビュー</h1><p>各ページのプレビューです。実際に追加した場合の表示内容を確認し、問題がなければ下に進んでください。</p>";
	Message1.innerHTML = "<h1>Step 1: 分野別ブックレビューおよびレビュー一覧の更新</h1><p>「ページの更新」を押すと勝手に更新してくれます。ポップアップが出たりしますが処理中なので気にしないでください。更新が完了した場合はアラートがなります。</p><p><span style=\"color: red;font-weight: bold;\">注意: </span>更新中に画面をロードしたり別の画面に移動しないでください。更新に失敗した際には追加のStep3,4が表示されます。</p> ";
	Message2.innerHTML = "<h1>Step 2: popの保存</h1><p>「pop印刷」を押して, PDFで保存してください。1回目はうまく表示されないことが多いようです。その場合は2-3回押してください。</p><p>popの保存先は<a href=\"https://drive.google.com/drive/folders/1xisVPyWtvUn8jN9hNmxOtnuzH-beelkm?usp=sharing\" target=\"_blank\">こちら</a>です。ファイル名は「POP_管理番号（応募フォームの回答者番号）」でお願いします。</p><p><span style=\"color: red;font-weight: bold;\">注意: </span>縦で保存してください。「詳細設定」を開いて倍率が100%になっているのを確認してください。</p> ";
	// QRCodeの作成
	const _QRcode = new QRCode(QRcode, {
		text: BookList_Page_URL,
		width: 256,
		height: 256,
		colorDark: "#ffffff",
		colorLight: "#000000",
		correctLevel: QRCode.CorrectLevel.H
	});
	// popの作成
	popTitle.innerText = _Title;
	popAuthor.innerText = _Author;
	popText.innerText = _Text;
	popName.innerText = _Name;
	popQRup.innerText = "詳しくはこちら！";
	// ボタンの作成
	ButtonUpdate.type = "button";
	ButtonUpdate.value = "ページの更新";
	ButtonUpdate.setAttribute('onclick', "onClickUpdate_" + Identifier + "(" + _Class + ");disabled = true;");
	ButtonPrint.type = "button";
	ButtonPrint.value = "pop印刷";
	ButtonPrint.setAttribute('onclick', "onClickPrintHTMLcontent(\"popBox\");");
	// 要素の設置
	OutputHTMLandPrint.appendChild(Message0);
	OutputHTMLandPrint.appendChild(Message1);
	OutputHTMLandPrint.appendChild(Message2);
	Message0.appendChild(Message0_1);
	Message0.appendChild(ReviewList);
	Message0.appendChild(Message0_2);
	Message0.appendChild(BookList);
	Message0.appendChild(Message0_3);
	Message0.appendChild(popBox);
	popBox.appendChild(popTitle);
	popBox.appendChild(popAuthor);
	popBox.appendChild(popBox1);
	popBox1.appendChild(popBox2);
	popBox1.appendChild(popBox3);
	popBox2.appendChild(popText);
	popBox2.appendChild(popName);
	popBox3.appendChild(QRcode);
	popBox3.appendChild(popQRup);

	Message1.appendChild(ButtonUpdate);
	Message2.appendChild(ButtonPrint);
	// はみ出し処理
	if (popText.offsetHeight < popText.scrollHeight) {
		popQRup.innerText = "続きはここから！";
	}
	// レビューが英文かの判定
	if (_Text.match(/^[\x20-\x7e\n]*$/)) {
		popBox.classList.add("popEng");
	}
}

const onClickAddPop = () => {
	const { ErrorMessage_, ID } = checkData();// 入力事項のチェック
	// エラーメッセージの出力
	ErrorMessage.innerText = ErrorMessage_;
	let ErrorMessage_2 = "";
	if (ErrorMessage_ == "") {
		// 同じ本がどのページに存在するかを検証
		const ClassList = []
		const check_page_0 = CatchPage_inID(BookPageURLList[0], ID).then(value => { ClassList.unshift([value, 0]) }).catch(() => { });
		const check_page_1 = CatchPage_inID(BookPageURLList[1], ID).then(value => { ClassList.unshift([value, 1]) }).catch(() => { });
		const check_page_2 = CatchPage_inID(BookPageURLList[2], ID).then(value => { ClassList.unshift([value, 2]) }).catch(() => { });
		const check_page_3 = CatchPage_inID(BookPageURLList[3], ID).then(value => { ClassList.unshift([value, 3]) }).catch(() => { });
		const check_page_4 = CatchPage_inID(BookPageURLList[4], ID).then(value => { ClassList.unshift([value, 4]) }).catch(() => { });
		const check_page_5 = CatchPage_inID(BookPageURLList[5], ID).then(value => { ClassList.unshift([value, 5]) }).catch(() => { });
		const check_page_6 = CatchPage_inID(BookPageURLList[6], ID).then(value => { ClassList.unshift([value, 6]) }).catch(() => { });
		const check_page_7 = CatchPage_inID(BookPageURLList[7], ID).then(value => { ClassList.unshift([value, 7]) }).catch(() => { });
		const check_page_8 = CatchPage_inID(BookPageURLList[8], ID).then(value => { ClassList.unshift([value, 8]) }).catch(() => { });
		const check_page_9 = CatchPage_inID(BookPageURLList[9], ID).then(value => { ClassList.unshift([value, 9]) }).catch(() => { });
		Promise.all([check_page_0, check_page_1, check_page_2, check_page_3, check_page_4, check_page_5, check_page_6, check_page_7, check_page_8, check_page_9]).then(() => {
			if (ClassList.length == 1) {
				// const Container = document.createElement("div");
				// Container.appendChild(ClassList[0].innerHTML);
				const src = ClassList[0][0].querySelector("img").getAttribute("src");
				const URL = "\"https://guides.lib.kyushu-u.ac.jp/bookreview/booklist/class0" + ClassList[0][1] + "#" + ID + "\"";
				const Title = ClassList[0][0].querySelector(".book-title").innerText;
				const x = document.getElementById("xxx").innerText;
				const y = document.getElementById("yyy").innerText;
				UpdatePageHTML(document, 50891153, "#mapBox",
					"<div class=\"marker\" style=\"left: " + x + "px; top: " + y + "px;\" data-src=\"" + src + "\" data-title=\"" + Title + "\" data-url=\"" + URL + "\" onclick=\"onClickMarker()\"></div>"
				);
			} else if (ClassList.length == 0) {
				ErrorMessage_2 = "同じISBNまたは書誌IDのレビューが見つかりません。then";
				ErrorMessage.innerText = ErrorMessage_2;
				alert(ErrorMessage_2);
			} else {
				ErrorMessage_2 = "同じISBNまたは書誌IDのレビューが複数あります。";
				ErrorMessage.innerText = ErrorMessage_2;
				alert(ErrorMessage_2);
			}
		}).catch(() => {
			ErrorMessage_2 = "同じISBNまたは書誌IDのレビューが見つかりません。catch";
			ErrorMessage.innerText = ErrorMessage_2;
			alert(ErrorMessage_2);
		})
	} else {
		alert(ErrorMessage_);
	}
}

// const onClickIMG = (event) => {
// 	const clickX = event.pageX;
// 	const clickY = event.pageY;

// 	// 要素の位置を取得
// 	const clientRect = document.getElementById("mapBox").getBoundingClientRect();
// 	const positionX = clientRect.left + window.pageXOffset;
// 	const positionY = clientRect.top + window.pageYOffset;

// 	// 要素内におけるクリック位置を計算
// 	const x = clickX - positionX;
// 	const y = clickY - positionY;

// 	document.getElementById("xxx").innerText = x;
// 	document.getElementById("yyy").innerText = y;

// 	const target = document.getElementById("target");
// 	target.style.left = x + 'px';
// 	target.style.top = y + 'px';
// 	const marker_actives = document.getElementsByClassName("marker active");
// 	const event_target = event.target;
// 	if (event_target.classList.contains("marker")) {
// 		if (marker_actives[0] != null) {
// 			target.classList.remove("active");
// 		}
// 	} else {
// 		target.classList.add("active");
// 	}

// }


// //マウスが押された際の関数
// function mdown(e) {

// 	//クラス名に .drag を追加
// 	this.classList.add("drag");

// 	//タッチデイベントとマウスのイベントの差異を吸収
// 	if (e.type === "mousedown") {
// 		var event = e;
// 	} else {
// 		var event = e.changedTouches[0];
// 	}

// 	//要素内の相対座標を取得
// 	x = event.pageX - this.offsetLeft;
// 	y = event.pageY - this.offsetTop;

// 	//ムーブイベントにコールバック
// 	document.body.addEventListener("mousemove", mmove, false);
// 	document.body.addEventListener("touchmove", mmove, false);
// }

// //マウスカーソルが動いたときに発火
// function mmove(e) {

// 	//ドラッグしている要素を取得
// 	var drag = document.getElementsByClassName("drag")[0];

// 	//同様にマウスとタッチの差異を吸収
// 	if (e.type === "mousemove") {
// 		var event = e;
// 	} else {
// 		var event = e.changedTouches[0];
// 	}

// 	//フリックしたときに画面を動かさないようにデフォルト動作を抑制
// 	e.preventDefault();

// 	//マウスが動いた場所に要素を動かす
// 	drag.style.top = event.pageY - y + "px";
// 	drag.style.left = event.pageX - x + "px";

// 	//マウスボタンが離されたとき、またはカーソルが外れたとき発火
// 	drag.addEventListener("mouseup", mup, false);
// 	document.body.addEventListener("mouseleave", mup, false);
// 	drag.addEventListener("touchend", mup, false);
// 	document.body.addEventListener("touchleave", mup, false);

// }

// //マウスボタンが上がったら発火
// function mup(e) {
// 	const drag = document.getElementsByClassName("drag")[0];

// 	//ムーブベントハンドラの消去
// 	document.body.removeEventListener("mousemove", mmove, false);
// 	drag.removeEventListener("mouseup", mup, false);
// 	document.body.removeEventListener("touchmove", mmove, false);
// 	drag.removeEventListener("touchend", mup, false);

// 	//クラス名 .drag も消す
// 	drag.classList.remove("drag");
// }


// const onClickIMG = (event) => {
// 	const clickX = event.pageX;
// 	const clickY = event.pageY;

// 	// 要素の位置を取得
// 	const clientRect = document.getElementById("mapBox").getBoundingClientRect();
// 	const positionX = clientRect.left + window.pageXOffset;
// 	const positionY = clientRect.top + window.pageYOffset;

// 	// 要素内におけるクリック位置を計算
// 	const x = clickX - positionX;
// 	const y = clickY - positionY;

// 	document.getElementById("xxx").innerText = x;
// 	document.getElementById("yyy").innerText = y;

// 	const target = document.getElementById("target");
// 	target.style.left = x + 'px';
// 	target.style.top = y + 'px';
// 	const marker_actives = document.getElementsByClassName("marker active");
// 	const event_target = event.target;
// 	if (event_target.classList.contains("marker")) {
// 		if (marker_actives[0] != null) {
// 			target.classList.remove("active");
// 		}
// 	} else {
// 		target.classList.add("active");
// 	}
// 	// 変更処理
// 	if (target.classList.contains("marker")) {
// 		if (false) {
// 			;//TODO:
// 		}
// 	} else if (marker_actives[0] != null) {
// 		//TODO:削除と変更
// 		const elements = marker_actives[0];
// 		//マウスが要素内で押されたとき、又はタッチされたとき発火
// 		elements.addEventListener("mousedown", mdown, false);
// 		elements.addEventListener("touchstart", mdown, false);
// 	}
// }


const onClickIMG = (event) => {
	const clickX = event.pageX;
	const clickY = event.pageY;

	// 要素の位置を取得
	const clientRect = document.getElementById("mapBox").getBoundingClientRect();
	const positionX = clientRect.left + window.pageXOffset;
	const positionY = clientRect.top + window.pageYOffset;

	// 要素内におけるクリック位置を計算
	const x = clickX - positionX;
	const y = clickY - positionY;

	document.getElementById("xxx").innerText = x;
	document.getElementById("yyy").innerText = y;

	const target = document.getElementById("target");
	target.style.left = x + 'px';
	target.style.top = y + 'px';
	const marker_actives = document.getElementsByClassName("marker active");
	const event_target = event.target;
	if (event_target.classList.contains("marker")) {
		if (marker_actives[0] != null) {
			target.classList.remove("active");
		}
	} else {
		target.classList.add("active");
	}
	// 変更処理
	if (target.classList.contains("marker")) {
		if (false) {
			;//TODO:
		}
	} else if (marker_actives[0] != null) {
		//TODO:削除と変更
		const boxDOM = marker_actives[0];
		boxDOM.onmousedown = function (event) {

			let shiftX = event.clientX - boxDOM.getBoundingClientRect().left + boxDOM.clientWidth / 2;
			let shiftY = event.clientY - boxDOM.getBoundingClientRect().top + boxDOM.clientHeight / 2;

			boxDOM.style.position = 'absolute';
			boxDOM.style.zIndex = 1000;

			movePosition(event.pageX, event.pageY);

			// #box要素の位置を決める関数
			function movePosition(pageX, pageY) {
				boxDOM.style.left = pageX - shiftX + 'px';
				boxDOM.style.top = pageY - shiftY + 'px';
			}

			// マウスを動かした時の処理
			function mouseMove(event) {
				movePosition(event.pageX, event.pageY);
			}

			// マウスを離した時にmousemoveイベントを解除する
			document.onmouseup = function () {
				document.removeEventListener('mousemove', mouseMove);
			};

			document.addEventListener('mousemove', mouseMove);
		};
	}
}

document.getElementById("mapBox").addEventListener("click", onClickIMG);

// 正しくロードできている場合はメッセージを消去する。
ErrorMessage.innerText = "";

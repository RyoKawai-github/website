const log = document.getElementById("log");
const ErrorMessage = document.getElementById("errorMessage");
const BookImgCheckBox = document.getElementById("bookImgCheckBox");
const OutputHTMLandPrint = document.getElementById("outputHTMLandPrint");
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
	const domTarget = dom.querySelector(ID);
	if (domTarget != null) {
		console.log("ISBNが同じ本があるか:True");
		return 1;
	} else {
		console.log("ISBNが同じ本があるか:False");
		throw 0;
	}
}

const onClickUpdate = async (dom, containerID, selector_css, html_str) => {
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

const onClickPrintHTMLcontent = (_id) => {
	// 印刷範囲をコピーしてbody直下に置く
	const PrintContent = document.getElementById(_id).cloneNode(true);
	const PrintArea = document.createElement("div");
	PrintArea.setAttribute("id", "printArea");
	document.body.appendChild(PrintArea);
	PrintArea.appendChild(PrintContent);
	// 最後以外の要素に.print-offをつける
	let childNodesCount = document.body.childElementCount - 1;
	for (let i = 0; i < childNodesCount; i++) {
		const bodyChild = document.body.children[i];
		bodyChild.classList.add("print-off");
	}
	// 印刷
	window.print();
	// 元に戻す
	// .print-offを検索して削除する
	const noPrints = document.getElementsByClassName("print-off");
	while (noPrints[0]) {
		noPrints[0].classList.remove("print-off");
	}
	// 追加した要素を消す
	PrintArea.remove();
}

const onClickSaveData = () => {
	// データの取得
	const e = (window.event) ? window.event : arguments.callee.caller.arguments[0];
	const self = e.target || e.srcElement;
	const text = self.getAttribute("data-Text");
	const filename = self.getAttribute("data-FileName");
	// 処理
	const ary = text.split('');
	const blob = new Blob(ary, { type: "text/plan" });
	const link = document.createElement('a');
	link.href = URL.createObjectURL(blob);
	link.download = filename + ".txt";
	link.click();
}

const onClickClipData = () => {
	// データの取得
	const e = (window.event) ? window.event : arguments.callee.caller.arguments[0];
	const self = e.target || e.srcElement;
	const text = self.getAttribute("data-Text");
	// 処理
	navigator.clipboard.writeText(text).then(() => {
		alert("コピーに成功しました");
	}, () => {
		alert("コピーに失敗しました");
	});
}

const checkData = () => {
	// 入力部分の受け取り
	const BookISBN = document.getElementById("inputBookISBN");
	const BookID = document.getElementById("inputBookID");
	const BookSeries = document.getElementById("inputBookSeries");
	const BookURL = document.getElementById("inputBookURL");
	const BookClass = document.getElementById("inputBookClass");
	const BookTitle = document.getElementById("inputBookTitle");
	const BookAuthor = document.getElementById("inputBookAuthor");
	const BookPublicationYear = document.getElementById("inputBookPublicationYear");
	const BookPublicationMonth = document.getElementById("inputBookPublicationMonth");
	const ReviewDate = document.getElementById("inputReviewDate");
	const ReviewName = document.getElementById("inputReviewName");
	const ReviewText = document.getElementById("inputReviewText");
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
	// URLのチェック
	if (!ErrorMessage_Text) {
		if (BookURL.value == "") {// URLのチェック
			ErrorMessage_Text = "本のURLが未入力です";
		} else if (!BookURL.value.match(/^https\:\/\/hdl\.handle\.net\/2324\/\d+$/)) {// URLのチェック
			ErrorMessage_Text = "本のURLが不正です";
		} else if (!BookClass.value.match(/^\d{1}$/g)) {// Classのチェック
			ErrorMessage_Text = "本の分類が間違っています";
		} else if (BookTitle.value == "") {// タイトルのチェック
			ErrorMessage_Text = "本のタイトルが未入力です";
		} else if (BookAuthor.value == "") {// 著者のチェック
			ErrorMessage_Text = "本の著者が未入力です";
		} else if (!BookPublicationYear.value.match(/^\d*$/g)) {// 発行年月のチェック
			ErrorMessage_Text = "本の発行年が不正です";
		} else if (!["", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].includes(BookPublicationMonth.value)) {// 発行年月のチェック
			ErrorMessage_Text = "本の発行月が不正です";
		} else if (ReviewDate.value == "") {// 投稿日のチェック
			ErrorMessage_Text = "投稿日が未入力です";
		} else if (ReviewText.value == "") {// レビュー本文のチェック
			ErrorMessage_Text = "レビュー本文が未入力です";
		}
	}
	if (!ErrorMessage_Text && ReviewName.value == "") {// 投稿者の名前のチェック
		ReviewName.value = "匿名";
	}
	// 発行年月日の作成
	let BookPublication = BookPublicationYear.value + "-" + BookPublicationMonth.value;
	BookPublication.replace(/-$/, '');
	return {
		ErrorMessage_: ErrorMessage_Text,
		ID: BookId,
		Series: BookSeries.value,
		URL: BookURL.value,
		Class: BookClass.value,
		Title: BookTitle.value,
		Author: BookAuthor.value,
		Publication: BookPublication,
		Date: ReviewDate.value,
		Name: ReviewName.value,
		Text: ReviewText.value
	};

}

const MakeData = (Text_HTML, HTML_Text, FileName) => {
	const content = document.createElement("div");
	const HTMLCode = document.createElement("pre");
	const ButtonSave = document.createElement("input");
	ButtonSave.classList.add("madeButton");
	const ButtonClip = document.createElement("input");
	ButtonClip.classList.add("madeButton");
	content.innerHTML = Text_HTML;
	HTMLCode.innerText = HTML_Text;
	ButtonSave.type = "button";
	ButtonSave.value = "保存(出力)";
	ButtonSave.setAttribute("data-Text", HTML_Text);
	ButtonSave.setAttribute("data-FileName", FileName);
	ButtonSave.setAttribute('onclick', "onClickSaveData()");
	ButtonClip.type = "button";
	ButtonClip.value = "クリップボードにコピー";
	ButtonClip.setAttribute("data-Text", HTML_Text);
	ButtonClip.setAttribute('onclick', "onClickClipData()");
	content.appendChild(HTMLCode);
	content.appendChild(ButtonClip);
	content.appendChild(ButtonSave);
	return content;
}
const onClickMakePreview = async () => {
	// 画像から情報を取得する
	const e = (window.event) ? window.event : arguments.callee.caller.arguments[0];
	const self = e.target || e.srcElement;
	const _ImageURL = self.src;
	const _ID = self.getAttribute("data-ID");
	const _Series = self.getAttribute("data-Series");
	const _URL = self.getAttribute("data-URL");
	const _Class = self.getAttribute("data-Class");
	const _Title = self.getAttribute("data-Title");
	const _Author = self.getAttribute("data-Author");
	const _Publication = self.getAttribute("data-Publication");
	const _Date = self.getAttribute("data-Date");
	const _Name = self.getAttribute("data-Name");
	const _Text = self.getAttribute("data-Text");
	// 既存部分の消去
	while (OutputHTMLandPrint.firstChild) {
		OutputHTMLandPrint.removeChild(OutputHTMLandPrint.firstChild);
	}
	// 要素の作成
	const Message0 = document.createElement("div");
	const Message3 = document.createElement("div");

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

	const ButtonPrint = document.createElement("input");
	ButtonPrint.classList.add("madeButton");
	const ButtonUpdate = document.createElement("input");
	ButtonUpdate.classList.add("madeButton");
	// コードの作成
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
		"</li>\n";
	BookList.innerHTML = BookList_Text;
	const ReviewList_Text =
		"\t\t<tr data-href=\"https://guides.lib.kyushu-u.ac.jp/bookreview/booklist/class0" + _Class + "#" + _ID + "\"><td><time>" + _Date + "</time></td><td class=\"cat" + _Class + "\"></td><td>" + _Title + "</td></tr>\n";
	ReviewList.innerHTML = "<thead><tr><th>Date</th><th>Category</th><th>Title</th></tr></thead>" + ReviewList_Text + "</table>";
	const BookList_Page_URL = "https://guides.lib.kyushu-u.ac.jp/bookreview/booklist/class0" + _Class + "#" + _ID;
	// メッセージの作成
	Message0.innerHTML = "<h1>プレビュー</h1><p>各ページのプレビューです。実際に追加した場合の表示内容を確認し、問題がなければ下に進んでください。</p>";
	const Message1 = MakeData("<h1>Step 1: 分野別ブックレビューへの追加</h1><p>「クリップボードにコピー」を押して、<a href=\"" + BookPageURLList[_Class] + "\" target=\"_blank\">こちらのページ</a>の該当箇所に追加してください。うまくいかない場合は「保存(出力)」を押して、slackなどで共有してください。</p>", BookList_Text, "ブックレビュー_分野" + _Class + "_追加用");
	const Message2 = MakeData("<h1>Step 2: レビュー一覧への追加</h1><p>「クリップボードにコピー」を押して、<a href=\"https://kyushu-u.libapps.com/libguides/admin_c.php?g=948899&p=6925921\" target=\"_blank\">こちらのページ</a>の該当箇所に追加してください。うまくいかない場合は「保存(出力)」を押して、slackなどで共有してください。</p>", ReviewList_Text, "ブックレビュー_レビュー一覧_追加用");
	Message3.innerHTML = "<h1>Step 3: popの保存</h1><p>「pop印刷」を押して, PDFで保存してください。1回目はうまく印刷されないことが多いため、うまく印刷できない場合は2-3回押してください。</p><p><span style=\"color: red;font-weight: bold;\">注意: </span>縦で保存してください。「詳細設定」を開いて倍率が100%になっているのを確認してください。</p > ";
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
	ButtonPrint.type = "button";
	ButtonPrint.value = "pop印刷";
	ButtonPrint.setAttribute('onclick', "onClickPrintHTMLcontent(\"popBox\")");
	ButtonUpdate.type = "button";
	ButtonUpdate.value = "ページの更新";
	ButtonUpdate.setAttribute('onclick', "onClickUpdate(\"popBox\")");
	// 要素の設置
	OutputHTMLandPrint.appendChild(Message0);
	//OutputHTMLandPrint.appendChild(Message1);
	//OutputHTMLandPrint.appendChild(Message2);
	OutputHTMLandPrint.appendChild(Message3);
	Message0.innerHTML += "<h1>レビュー一覧</h1>"
	Message0.appendChild(ReviewList);
	Message0.innerHTML += "<h1>分野別ブックレビュー</h1>"
	Message0.appendChild(BookList);
	Message0.innerHTML += "<h1>pop</h1>"
	Message0.appendChild(popBox);
	popBox.appendChild(popTitle);
	popBox.appendChild(popAuthor);
	popBox.appendChild(popBox1);
	popBox1.appendChild(popBox2);
	popBox1.appendChild(popBox3);
	popBox2.appendChild(popText);
	popBox2.appendChild(popName);
	popBox3.appendChild(_QRcode);
	popBox3.appendChild(popQRup);
	Message0.innerHTML += "<h2>pop</h2>";
	Message0.appendChild(ButtonPrint);
	Message0.appendChild(ButtonUpdate);
	// はみ出し処理
	if (popText.offsetHeight < popText.scrollHeight) {
		popQRup.innerText = "続きはここから！";
	}
	// レビューが英文かの判定
	if (_Text.match(/^[\x20-\x7e\n]*$/)) {
		popBox.classList.add("popEng");
	}
}

const onClickCheckData = () => {
	// 既存部分の消去
	while (BookImgCheckBox.firstChild) {
		BookImgCheckBox.removeChild(BookImgCheckBox.firstChild);
	}
	while (OutputHTMLandPrint.firstChild) {
		OutputHTMLandPrint.removeChild(OutputHTMLandPrint.firstChild);
	}
	const { ErrorMessage_, ID, Series, URL, Class, Title, Author, Publication, Date, Name, Text } = checkData();// 入力事項のチェック
	// エラーメッセージの出力
	ErrorMessage.innerText = ErrorMessage_;
	if (!ErrorMessage_) {
		// ISBNの存在判定
		CatchPage_inID(BookPageURLList[Class], ID)
			.then(value => {
				const AttentionMessage = document.createElement("div");
				AttentionMessage.setAttribute("id", "AttentionMessage");
				// メッセージの作成
				AttentionMessage.innerHTML = "<p>分野別ブックレビューコレクション:分野" + Class + "のページに同じ本があります。一旦このレビューは飛ばしてください。</p>"
				BookImgCheckBox.appendChild(AttentionMessage);
			})
			.catch(value => {
				// 要素の作成
				const Box = document.createElement("div");
				const AttentionMessage = document.createElement("div");
				AttentionMessage.setAttribute("id", "AttentionMessage");
				const AttentionMessageList = document.createElement("ul");
				const Message = document.createElement("p");
				const image_E = new Image();
				const image_J = new Image();
				const image_T = new Image();
				// メッセージの作成
				AttentionMessage.innerHTML = "<p>以下の部分が入力されていません。入力内容に間違いはありませんか？</p>"
				AttentionMessageList.innerHTML = "";
				if (Series == "") {
					AttentionMessageList.innerHTML += "<li>シリーズ名</li>";
				}
				if (Publication == "") {
					AttentionMessageList.innerHTML += "<li>発行年月</li>";
				}
				AttentionMessage.appendChild(AttentionMessageList);
				if (AttentionMessageList.innerHTML == "") {
					AttentionMessage.innerHTML = "";
				}
				Message.innerText = "問題なければ、以下の画像から書影を選び、クリックしてください";
				// URLの追加
				image_E.src = "https://syndetics.com/index.aspx?isbn=" + ID.substring(5) + "/LC.GIF&client=springshare";
				image_J.src = "https://www.hanmoto.com/bd/img/" + ID.substring(5) + "_600.jpg";
				image_T.src = "https://guides.lib.kyushu-u.ac.jp/ld.php?content_id=50567603";
				// URLがない場合はCuter本棚の画像を表示
				image_E.onerror = () => {
					image_E.src = "https://guides.lib.kyushu-u.ac.jp/ld.php?content_id=50567603";
				}
				image_J.onerror = () => {
					image_J.src = "https://guides.lib.kyushu-u.ac.jp/ld.php?content_id=50567603";
				}
				// 各画像にデータの値とクリックした時の処理を配置
				for (const image of [image_E, image_J, image_T]) {
					image.setAttribute("data-ID", ID);
					image.setAttribute("data-Series", Series);
					image.setAttribute("data-URL", URL);
					image.setAttribute("data-Class", Class);
					image.setAttribute("data-Title", Title);
					image.setAttribute("data-Author", Author);
					image.setAttribute("data-Publication", Publication);
					image.setAttribute("data-Date", Date);
					image.setAttribute("data-Name", Name);
					image.setAttribute("data-Text", Text);
					image.setAttribute('onclick', "onClickMakePreview()");
				}
				// 要素の設置
				BookImgCheckBox.appendChild(AttentionMessage);
				BookImgCheckBox.appendChild(Message);
				BookImgCheckBox.appendChild(Box);
				Box.appendChild(image_E);
				Box.appendChild(image_J);
				Box.appendChild(image_T);
			});
	} else {
		alert(ErrorMessage_Text);
	}
}
// 正しくロードできている場合はメッセージを消去する。
ErrorMessage.innerText = "";

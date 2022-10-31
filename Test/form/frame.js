const BookISBN = document.getElementById("inputBookISBN");
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

const ErrorMessage = document.getElementById("errorMessage");
const BookImgCheckBox = document.getElementById("bookImgCheckBox");
const OutputHTMLandPrint = document.getElementById("outputHTMLandPrint");

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

const onClickMakeData = () => {
	// 画像から情報を取得する
	const e = (window.event) ? window.event : arguments.callee.caller.arguments[0];
	const self = e.target || e.srcElement;
	const _ImageURL = self.src;
	const _ISBN = self.getAttribute("data-ISBN");
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
	const Message1 = document.createElement("div");
	const Message2 = document.createElement("div");
	const Message3 = document.createElement("div");
	const Message4 = document.createElement("div");
	const HTMLCode1 = document.createElement("pre");
	const HTMLCode2 = document.createElement("pre");
	const HTMLCode3 = document.createElement("pre");

	const QRcode = document.createElement("div");

	const BookList = document.createElement("ul");
	BookList.setAttribute("id", "BookList");
	const ReviewList = document.createElement("ul");
	ReviewList.setAttribute("id", "ReviewList");

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

	const ButtonSave1 = document.createElement("input");
	ButtonSave1.classList.add("madeButton");
	const ButtonSave2 = document.createElement("input");
	ButtonSave2.classList.add("madeButton");
	const ButtonSave3 = document.createElement("input");
	ButtonSave3.classList.add("madeButton");

	const ButtonClip1 = document.createElement("input");
	ButtonClip1.classList.add("madeButton");
	const ButtonClip2 = document.createElement("input");
	ButtonClip2.classList.add("madeButton");
	const ButtonClip3 = document.createElement("input");
	ButtonClip3.classList.add("madeButton");

	const ButtonPrint = document.createElement("input");
	ButtonPrint.classList.add("madeButton");
	// メッセージの作成
	Message0.innerHTML = "<h1>Step 0: プレビュー</h1><p>各ページのプレビューです。実際に追加した場合の表示内容を確認し、問題がなければ次のStepに進んでください。</p>";
	Message1.innerHTML = "<h1>Step 1: 分野別ブックレビューへの追加</h1><p>「クリップボードにコピー」を押して、<a href=\"\" target=\"_blank\">こちらのページ</a>の該当箇所に追加してください。\nうまくいかない場合は「保存(出力)」を押して、slackなどで共有してください。</p>";
	Message2.innerText = "以下はレビューの概要です。全て(空白も含めて)コピーして、レビュー一覧のリストの先頭に追加してください。";
	Message3.innerText = "以下はpopに使うQRコードです。うまく表示されない場合は、下のリンクをコピーして、chromeのQRコード作成機能を使用して作成してください。";
	Message4.innerText = "以下はpopです。英語の場合は黄色になっています。PC版のgoogle ChromeかFirefoxでPDFに出力することができます。1回目はうまく印刷されないことが多いため、うまく印刷できない場合は2-3回押してください。";
	// コードの作成
	const BookList_Text =
		"<li id=\"" + _ISBN + "\">\n" +
		"\t<div class=\"BookBox\"><a href=\"" + _URL + "\">\n" +
		"\t\t<div class=\"ImgBox\"><img src=\"" + _ImageURL + "\" alt=\"" + _Title + "\"></div>\n" +
		"\t\t<div class=\"DetailBox\">\n" +
		"\t\t\t<p class=\"book-title\">" + _Title + "</p>\n" +
		"\t\t\t<p class=\"book-series\">" + _Series + "</p>\n" +
		"\t\t\t<p class=\"book-author\">" + _Author + "</p>\n" +
		"\t\t\t<p class=\"book-publication\">" + _Publication + "</p>\n" +
		"\t\t\t<p class=\"book-ISBN\">" + _ISBN + "</p>\n" +
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
	HTMLCode1.innerText = BookList_Text;
	const ReviewList_Text =
		"\t\t<tr data-href=\"https://guides.lib.kyushu-u.ac.jp/bookreview/booklist/class0" + _Class + "#" + _ISBN + "\"><td><time>" + _Date + "</time></td><td class=\"cat" + _Class + "\"></td><td>" + _Title + "</td></tr>\n";
	HTMLCode2.innerText = ReviewList_Text;
	const QR_URL_Text = "https://guides.lib.kyushu-u.ac.jp/bookreview/booklist/class0" + _Class + "#" + _ISBN + "\n";
	HTMLCode3.innerText = QR_URL_Text;
	// QRCodeの作成
	const _QRcode = new QRCode(QRcode, {
		text: QR_URL_Text,
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
	ButtonSave1.type = "button";
	ButtonSave1.value = "保存(出力)";
	ButtonSave1.setAttribute("data-Text", BookList_Text);
	ButtonSave1.setAttribute("data-FileName", "ブックレビュー_分野" + _Class + "_追加用");
	ButtonSave1.setAttribute('onclick', "onClickSaveData()");
	ButtonSave2.type = "button";
	ButtonSave2.value = "保存(出力)";
	ButtonSave2.setAttribute("data-Text", ReviewList_Text);
	ButtonSave2.setAttribute("data-FileName", "ブックレビュー_レビュー一覧_追加用");
	ButtonClip1.type = "button";
	ButtonClip1.value = "クリップボードにコピー";
	ButtonClip1.setAttribute("data-Text", BookList_Text);
	ButtonClip1.setAttribute('onclick', "onClickClipData()");
	ButtonClip2.type = "button";
	ButtonClip2.value = "クリップボードにコピー";
	ButtonClip2.setAttribute("data-Text", ReviewList_Text);
	ButtonClip2.setAttribute('onclick', "onClickClipData()");
	ButtonPrint.type = "button";
	ButtonPrint.value = "pop印刷";
	ButtonPrint.setAttribute('onclick', "onClickPrintHTMLcontent(\"popBox\")");
	// 要素の設置
	OutputHTMLandPrint.appendChild(Message0);
	OutputHTMLandPrint.appendChild(BookList);
	OutputHTMLandPrint.appendChild(Message1);
	OutputHTMLandPrint.appendChild(HTMLCode1);
	OutputHTMLandPrint.appendChild(ButtonSave1);
	OutputHTMLandPrint.appendChild(ButtonClip1);
	OutputHTMLandPrint.appendChild(Message2);
	OutputHTMLandPrint.appendChild(HTMLCode2);
	OutputHTMLandPrint.appendChild(ButtonSave2);
	OutputHTMLandPrint.appendChild(ButtonClip2);
	//OutputHTMLandPrint.appendChild(Message3);
	//OutputHTMLandPrint.appendChild(HTMLCode3);
	//OutputHTMLandPrint.appendChild(ButtonSave3);
	OutputHTMLandPrint.appendChild(Message4);
	OutputHTMLandPrint.appendChild(popBox);
	OutputHTMLandPrint.appendChild(ButtonPrint);
	popBox.appendChild(popTitle);
	popBox.appendChild(popAuthor);
	popBox.appendChild(popBox1);
	popBox1.appendChild(popBox2);
	popBox1.appendChild(popBox3);
	popBox2.appendChild(popText);
	popBox2.appendChild(popName);
	popBox3.appendChild(QRcode);
	popBox3.appendChild(popQRup);
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
	// 入力部分の修正
	let ErrorMessage_Text = "";
	// ISBNの修正
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
			;// あっている
		} else {
			ErrorMessage_Text = "ISBNが間違っています";
		}
	} else {
		ErrorMessage_Text = "ISBNが間違っています";
	}
	// URLのチェック
	if (!ErrorMessage_Text) {
		if (BookURL.value == "") {
			ErrorMessage_Text = "本のURLが未入力です";
		} else if (!BookURL.value.match(/^http\:\/\/hdl\.handle\.net\/2324\/\d+$/)) {
			ErrorMessage_Text = "本のURLが不正です";
		}
	}
	// Classのチェック
	if (!ErrorMessage_Text && !BookClass.value.match(/^\d{1}$/g)) {
		ErrorMessage_Text = "本の分類が間違っています";
	}
	// タイトルのチェック
	if (!ErrorMessage_Text && BookTitle.value == "") {
		ErrorMessage_Text = "本のタイトルが未入力です";
	}
	// 著者のチェック
	if (!ErrorMessage_Text && BookAuthor.value == "") {
		ErrorMessage_Text = "本の著者が未入力です";
	}
	// 発行年月のチェック
	if (!ErrorMessage_Text && !BookPublicationYear.value.match(/^\d*$/g)) {
		ErrorMessage_Text = "本の発行年が不正です";
	}
	if (!ErrorMessage_Text && !["", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].includes(BookPublicationMonth.value)) {
		ErrorMessage_Text = "本の発行月が不正です";
	}
	// 投稿日のチェック
	if (!ErrorMessage_Text && ReviewDate.value == "") {
		ErrorMessage_Text = "投稿日が未入力です";
	}
	// 投稿者の名前のチェック
	if (!ErrorMessage_Text && ReviewName.value == "") {
		ReviewName.value = "匿名";
	}
	// レビュー本文のチェック
	if (!ErrorMessage_Text && ReviewText.value == "") {
		ErrorMessage_Text = "レビュー本文が未入力です";
	}
	// エラーメッセージの出力
	ErrorMessage.innerText = ErrorMessage_Text;
	if (!ErrorMessage_Text) {
		// 発行年月日の作成
		let BookPublication = "";
		if (!BookPublicationYear.value == "") {
			BookPublication += BookPublicationYear.value;
			if (!BookPublicationMonth.value == "") {
				BookPublication += "-" + BookPublicationMonth.value;
			}
		}
		// 要素の作成
		const Box = document.createElement("div");
		const AttentionMessage = document.createElement("p");
		AttentionMessage.setAttribute("id", "AttentionMessage");
		const Message = document.createElement("p");
		const image_E = new Image();
		const image_J = new Image();
		const image_T = new Image();
		// メッセージの作成
		if (BookSeries.value == "") {
			if (BookPublicationYear.value == "") {
				AttentionMessage.innerText = "シリーズ名および発行年月が入力されていません。入力内容は間違いないでしょうか？"
			} else {
				AttentionMessage.innerText = "シリーズ名が入力されていません。入力内容は間違いないでしょうか？"
			}
		} else if (BookPublicationYear.value == "") {
			AttentionMessage.innerText = "発行年月が入力されていません。入力内容は間違いないでしょうか？"
		}
		Message.innerText = "以下の画像から書影を選び、クリックしてください";
		// URLの追加
		image_E.src = "https://syndetics.com/index.aspx?isbn=" + BookISBN.value + "/LC.GIF&client=springshare";
		image_J.src = "https://www.hanmoto.com/bd/img/" + BookISBN.value + "_600.jpg";
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
			image.setAttribute("data-ISBN", BookISBN.value);
			image.setAttribute("data-Series", BookSeries.value);
			image.setAttribute("data-URL", BookURL.value);
			image.setAttribute("data-Class", BookClass.value);
			image.setAttribute("data-Title", BookTitle.value);
			image.setAttribute("data-Author", BookAuthor.value);
			image.setAttribute("data-Publication", BookPublication);
			image.setAttribute("data-Date", ReviewDate.value);
			image.setAttribute("data-Name", ReviewName.value);
			image.setAttribute("data-Text", ReviewText.value);
			image.setAttribute('onclick', "onClickMakeData()");
		}
		// 要素の設置
		BookImgCheckBox.appendChild(AttentionMessage);
		BookImgCheckBox.appendChild(Message);
		BookImgCheckBox.appendChild(Box);
		Box.appendChild(image_E);
		Box.appendChild(image_J);
		Box.appendChild(image_T);
	} else {
		alert(ErrorMessage_Text);
	}
}
// 正しくロードできている場合はメッセージを消去する。
ErrorMessage.innerText = "";

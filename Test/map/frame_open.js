const setBookBox = (src, Title, URL) => {
	const BookBox = document.getElementById("BookBox");
	BookBox.innerHTML =
		"<a href=\"" + URL + "\"><div class=\"ImgBox\"><img src=\"" + src + "\" alt=\"" + Title + "\"></div><p>" + Title + "</p></a>";
}

const targetAllDel = () => {
	const actives = document.getElementsByClassName("active");
	while (actives[0]) {
		actives[0].classList.remove("active");
	}
}

const onClickMarker = () => {
	const e = (window.event) ? window.event : arguments.callee.caller.arguments[0];
	const self = e.target || e.srcElement;
	if (self.classList.contains("active")) {
		targetAllDel();
		setBookBox("https://guides.lib.kyushu-u.ac.jp/ld.php?content_id=50567603", "", "");
	} else {
		targetAllDel();
		self.classList.add("active");
		const src = self.getAttribute("data-src");
		const Title = self.getAttribute("data-Title");
		const URL = self.getAttribute("data-URL");
		setBookBox(src, Title, URL);
	}
}


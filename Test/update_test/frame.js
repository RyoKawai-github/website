const CatchPage = async (URL) => {
	const page = await fetch(URL);
	const html = await page.text();
	const dom = new DOMParser().parseFromString(html, 'text/html');
	return dom;
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

const onClicked = async () => {
	const dom = await CatchPage("https://kyushu-u.libapps.com/libguides/admin_c.php?g=948899&p=6944015")
	await onClickUpdate(dom, "50745584", "#testID", "<li>aaa</li>").catch(val => { console.log("not update page"); throw 0; })
}

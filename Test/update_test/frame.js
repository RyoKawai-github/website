const onClickSaveDate = () => {
	const textArea = document.getElementById("s-lg-editor-content");
	console.log(textArea);
	const test_div = document.createElement("div");
	test_div.innerHTML = textArea.value;
	console.log(test_div);
	const textSaveButton = document.getElementById("s-lib-alert-btn-first");
	console.log(textSaveButton);
	if (textSaveButton == null) {
		console.log("not find save button");
	} else {
		const textSaveButton_click = textSaveButton.getAttribute("click");
		console.log(textSaveButton_click);
		textSaveButton.click();
		console.log("success close popup");
	}
}

const onClickUpdate = () => {
	const promise = new Promise((resolve, reject) => {
		const editButton = document.getElementById("s-lg-admin-edit-content-text-50745584-container");
		console.log(editButton);
		const editButtonHTML = editButton.lastElementChild.children[1].firstElementChild;
		console.log(editButtonHTML);
		if (editButtonHTML == null) {
			console.log("not exists button");
			reject();
		} else {
			console.log("exists button");
			editButtonHTML.click();
			resolve();
		}
	})
		.then(() => {
			console.log("success open popup");
			setTimeout(onClickSaveDate, 1000);
		})
		.catch(() => {
			console.log("error");
		})
}

const onClickUpdate2 = async () => {
	const editButton = document.getElementById("s-lg-admin-edit-content-text-50745584-container");
	console.log(editButton);
	const editButtonHTML = editButton.lastElementChild.children[1].firstElementChild;
	console.log(editButtonHTML);
	if (editButtonHTML != null) {
		console.log("exists button");
		editButtonHTML.click();
		console.log("clicked");
		await new Promise((resolve) => {
			setTimeout(() => { resolve() }, 1000);
		})
		resolve();
	} else {
		console.log("not exists button");
	}
}
const onClickSaveDate2 = async () => {
	console.log("success open popup");
	const textArea = document.getElementById("s-lg-editor-content");
	console.log(textArea);
	const test_div = document.createElement("div");
	test_div.innerHTML = textArea.value;
	console.log(test_div);
	const textSaveButton = document.getElementById("s-lib-alert-btn-first");
	console.log(textSaveButton);
	if (textSaveButton != null) {
		console.log("find save button");
		const textSaveButton_click = textSaveButton.getAttribute("click");
		console.log(textSaveButton_click);
		textSaveButton.click();
		console.log("success close popup");
		return 0;
	} else {
		console.log("not find save button");
	}
}
const onClicked = () => {
	onClickUpdate2()
		.then(onClickSaveDate2()
			.catch(() => 'error')
		)
		.catch(() => 'error')

}

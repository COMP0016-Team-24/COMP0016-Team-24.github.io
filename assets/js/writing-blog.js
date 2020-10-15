let ct = document.getElementById("current-time");
setInterval(update, 3000);
ct.addEventListener("mousedown", selectct);
ct.addEventListener("touchstart", selectct);
function update() {
	ct.innerText = new Date().toISOString();
}
function selectct(evt) {
	evt.preventDefault();
	let r = document.createRange();
	r.selectNodeContents(ct);
	let sel = window.getSelection();
	sel.removeAllRanges();
	sel.addRange(r);
}
update();

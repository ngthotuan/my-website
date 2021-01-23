async function download(node, name = 'default') {
    const data = await domtoimage.toPng(node, { bgcolor: "#fff" })
    const link = document.createElement('a');
    link.download = `${name}.png`;
    link.href = data;
    link.click();
}
async function downloadImage(button, itemId) {
    const systemMessage = document.querySelector('#system-message');
    systemMessage.style.display = 'block';
    const item = document.getElementById(itemId);
    const node = item.cloneNode(true);
    node.style.width = '400px';
    const footer = node.querySelector('.card-footer');
    footer.removeChild(footer.querySelector('.list-button'));
    footer.appendChild(document.createTextNode('NGUYENTHOTUAN.ME'));

    document.body.appendChild(node);
    await download(node, `nguyenthotuan.me-${itemId}`);
    systemMessage.style.display = 'none';
    document.body.removeChild(node);
}
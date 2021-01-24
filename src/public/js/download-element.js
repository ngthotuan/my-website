async function download(node, name = 'default') {
    const data = await domtoimage.toPng(node, { bgcolor: "#fff" });
    $("<a></a>")
        .attr('download', `${name}.png`)
        .attr('href', data)
        .get(0)
        .click();
}
async function downloadImage(button, itemId) {
    //show message
    const systemMessage = $("#system-message");
    const message = createAlert( `Đang xử lý...`, 'success', true, false);
    const messageId = $(message).attr('id');
    systemMessage.append(message);

    //create node and append to body
    const body = $('body');
    const node = $(`#${itemId}`)
        .clone()
        .width('400px')
        .find('.card-footer')
            .empty()
            .append('NGUYENTHOTUAN.ME')
        .end();
    body.append($(node));

    //download and remove message
    await download($(node).get(0), `nguyenthotuan.me-${Date.now()}-${itemId}`);
    body.remove($(node));
    $(`#${messageId}`).remove();
}
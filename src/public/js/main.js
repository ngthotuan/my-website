/**
 * @return Alert div html string
 * @param message: any html string
 * @param type: in ["primary" "secondary" "success" "info" "warning" "danger" "light" "dark"]
 * @param isSpinner: 'true' - spinner icon in alert else 'false'
 * @param isTurnOff: 'true' - button close alert else 'false'
 * */
function createAlert(message, type = 'info', isSpinner = false, isTurnOff = true) {
    return `
    <div id=${`message-${Date.now()}`} class="alert alert-${type} alert-dismissible fade show" role="alert" style="max-width: 400px">
    ${isSpinner ?
    `<div class="spinner-border text-${type}" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>`
    : ''}
    ${message}
    ${isTurnOff ?
    `<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"/>`
    : ''}
    </div>`;
}

$(function() {
    // Form validation
    Validator({
        form: '#formRegister',
        formGroupSelector: '.form-group',
        invalidClass: 'is-invalid',
        errorSelector: '.invalid-feedback',
        rules: [
            Validator.isRequired('#name', 'Vui lòng nhập tên của bạn'),
            Validator.isRequired('#email', 'Vui lòng nhập Email'),
            Validator.isEmail('#email', 'Địa chỉ email không đúng định dạng'),
            Validator.isRequired('#password', 'Vui lòng nhập mật khẩu'),
            Validator.minLength('#password', 6, 'Mật khẩu tối thiểu 6 ký tự'),
            Validator.isRequired('#password2', 'Vui lòng xác nhận mật khẩu'),
            Validator.isConfirmed(
                '#password2',
                () => document.querySelector('#formRegister #password').value,
                'Xác nhận mật khẩu không khớp',
            ),
        ],
    });

    Validator({
        form: '#formLogin',
        formGroupSelector: '.form-group',
        invalidClass: 'is-invalid',
        errorSelector: '.invalid-feedback',
        rules: [
            Validator.isRequired('#email', 'Vui lòng nhập Email'),
            Validator.isEmail('#email', 'Địa chỉ email không đúng định dạng'),
            Validator.isRequired('#password', 'Vui lòng nhập mật khẩu'),
        ],
    });

    Validator({
        form: '#formSubscribe',
        formGroupSelector: '.form-group',
        invalidClass: 'is-invalid',
        errorSelector: '.invalid-feedback',
        rules: [
            Validator.isRequired('#subscriberEmail', 'Vui lòng nhập Email'),
            Validator.isEmail(
                '#subscriberEmail',
                'Địa chỉ email không đúng định dạng',
            ),
        ],
    });

    Validator({
        form: '#formCreateCourse',
        formGroupSelector: '.form-group',
        invalidClass: 'is-invalid',
        errorSelector: '.invalid-feedback',
        rules: [
            Validator.isRequired('#name', 'Vui lòng nhập tên khóa học'),
            Validator.isRequired('#image', 'Vui lòng chọn ảnh minh họa'),
            Validator.isRequired('#shortDescription', 'Vui lòng nhập mô tả ngắn'),
            Validator.isRequired('#description', 'Vui lòng nhập mô tả chi tiết'),
        ],
    });

    Validator({
        form: '#formUploadFile',
        formGroupSelector: '.form-group',
        invalidClass: 'is-invalid',
        errorSelector: '.invalid-feedback',
        rules: [Validator.isRequired('#file', 'Vui lòng chọn file')],
    });

    Validator({
        form: '#formUrlShorten',
        formGroupSelector: '.form-group',
        invalidClass: 'is-invalid',
        errorSelector: '.invalid-feedback',
        rules: [Validator.isRequired('#fullUrl', 'Vui lòng nhập liên kết gốc')],
    });
    Validator({
        form: '#formContact',
        formGroupSelector: '.form-floating',
        invalidClass: 'is-invalid',
        errorSelector: '.invalid-feedback',
        rules: [
            Validator.isRequired('#name', 'Vui lòng cung cấp tên của bạn'),
            Validator.isRequired(
                '#email',
                'Vui lòng cung cấp địa chỉ Email liên hệ',
            ),
            Validator.isEmail('#email', 'Định dạnh email không đúng'),
            Validator.isRequired('#subject', 'Vui lòng nhập chủ đề thư'),
            Validator.minLength('#subject', 8, 'Chủ đề thư quá ngắn'),
            Validator.isRequired('#message', 'Vui lòng nhập nội dung tin nhắn'),
        ],
    });

    // Back to top button
    const topBtn = document.getElementById('topBtn');
    topBtn.onclick = () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    };
    // When the user scrolls down 20px from the top of the document, show the button
    window.onscroll = () => {
        if (
            document.body.scrollTop > 20 ||
            document.documentElement.scrollTop > 20
        ) {
            topBtn.style.display = 'block';
        } else {
            topBtn.style.display = 'none';
        }
    };

    // System message
    $("#testBtn").on('click', e => {
        const systemMessage = $("#system-message");
        systemMessage.append(createAlert( `<b>Test</b> ${Date.now()}`, 'danger', true, true));
    });

    $("#testBtn2").on('click', e => {
        const systemMessage = $("#system-message");
        systemMessage.append(createAlert( ` <b>Test 2 </b> ${Date.now()} <b>Test 2 </b> ${Date.now()}`, 'danger', true, true));
    });
});
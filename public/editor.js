let quill = new Quill('#editor-container', {
    modules: {
        toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            ['image', 'code-block']
        ]
    },
    placeholder: 'Введите текст',
    theme: 'snow'  // or 'bubble'
});


const inputText = document.querySelector('input[name="text"]');
let saveBtn = document.querySelector('.edit_theme_save')

saveBtn.addEventListener('click', () => {
    let text = quill.getText(0);
    inputText.value = text
})




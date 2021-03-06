export default {
    key: "bz2kyi2f9qk3ba5x13o5d4ircrqtp8vb17wg4uiv5y7mbzew",
    config: {
        plugins: 'image link media hr lists emoticons',
        menubar: false,
        toolbar: [
            'bold italic underline strikethrough | alignleft aligncenter alignright | formatselect | forecolor backcolor | subscript superscript | emoticons',
            'undo redo | cut copy paste removeformat | bullist numlist | outdent indent | link unlink image media| hr',
        ],
        inline: true,
        fixed_toolbar_container: ".my-toolbar",
         setup: function (editor) { // This prevents the blur event from hiding the toolbar
            editor.on('blur', function () {
                return false
            })
        }, 
    }
}

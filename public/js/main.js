$(function () {
    if ($('textarea#ta').length) {
        CKEDITOR.replace('ta');
    }

    $('a.confirmDeletion').on('click', function (e) {
        if (!confirm('Are you sure to delete this page?'))
            return false;
    });
});
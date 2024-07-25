// משתנים גלובליים לשמירת שינויים בקלטים
let gGenre = '';
let gTxt = '';
let gDate = '';

// מאזינים לשינויים בקלטים
function onChangeGenre(newGenre) {
    gGenre = newGenre;
}

function onChangeTxt(newTxt) {
    gTxt = newTxt;
}

function onChangeDateTime(dateTime) {
    gDate = dateTime;
}

// שליחת עדכון של כתבה קיימת
async function onUpdateArticle(ev) {
    ev.preventDefault();

    try {
        await $.ajax({
            url: '/news/edit/' + $('#updateButton').val(),
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                genre: gGenre,
                txt: gTxt,
                date: gDate
            }),
        });

        alert('Article updated successfully.');
        window.location.href = '/news'; // הפניה לעמוד הכתבות לאחר עדכון מוצלח
    } catch (e) {
        console.log('Error:', e);
        alert('An error occurred while updating the article.');
    }
}

// מחיקת כתבה
async function onDeleteArticle(id) {
    try {
        const res = await $.ajax({
            url: '/news/edit/' + id,
            method: 'DELETE',
            contentType: 'application/json',
            data: JSON.stringify({ id }),
        });

        if (res.status !== 404) {
            alert('Article deleted successfully.');
            window.location.href = '/news'; // הפניה לעמוד הכתבות לאחר מחיקה מוצלחת
        } else {
            alert('Article could not be deleted.');
        }
    } catch (e) {
        console.log('Error:', e);
        alert('An error occurred while deleting the article.');
    }
}

// הוספת כתבה חדשה
async function onAddArticle(ev) {
    ev.preventDefault();

    try {
        const newArticle = await $.ajax({
            url: '/news/edit',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                genre: gGenre,
                txt: gTxt,
                date: gDate
            }),
        });

        alert('New article added successfully.');
        window.location.href = '/news'; // הפניה לעמוד הכתבות לאחר הוספה מוצלחת
    } catch (e) {
        console.log('Error:', e);
        alert('An error occurred while adding the article.');
    }
}

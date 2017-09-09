function getCurrentDateTime()
{
    var date = new Date();
    date = date.getFullYear() + '-' +
        ('00' + (date.getMonth() + 1)).slice(-2) + '-' +
        ('00' + date.getDate()).slice(-2) + ' ' +
        ('00' + date.getHours()).slice(-2) + ':' +
        ('00' + date.getMinutes()).slice(-2) + ':' +
        ('00' + date.getSeconds()).slice(-2);
    return date;
}

exports.getCurrentDateTime=getCurrentDateTime;


function getAuctionDateTime()
{
    var date = new Date();
    console.log(date);
    date.setDate(date.getDate() + 4);
    date = date.getFullYear() + '-' +
        ('00' + (date.getMonth() + 1)).slice(-2) + '-' +
        ('00' + date.getDate()).slice(-2) + ' ' +
        ('00' + date.getHours()).slice(-2) + ':' +
        ('00' + date.getMinutes()).slice(-2) + ':' +
        ('00' + date.getSeconds()).slice(-2);
    console.log(date);
    return date;
}
exports.getAuctionDateTime = getAuctionDateTime;

function getdateFormat(d)
{
    var date = new Date(d);
    date = date.getFullYear() + '-' +
        ('00' + (date.getMonth() + 1)).slice(-2) + '-' +
        ('00' + date.getDate()).slice(-2) + ' ' +
        ('00' + date.getHours()).slice(-2) + ':' +
        ('00' + date.getMinutes()).slice(-2) + ':' +
        ('00' + date.getSeconds()).slice(-2);
    return date;
}

exports.getdateFormat=getdateFormat;

function getdateFormatForProperty(d)
    {
    var date = new Date(d);
    date = date.getFullYear() + '-' +
        ('00' + (date.getMonth() + 1)).slice(-2) + '-' +
        ('00' + date.getDate()).slice(-2);
    return date;
}
exports.getdateFormatForProperty = getdateFormatForProperty;
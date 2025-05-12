
function parseDateDMY(dateString) {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day); // Tháng bắt đầu từ 0 (Jan = 0)
}

module.exports = { parseDateDMY };



const date = new Date();
const year = date.getFullYear();
let month = date.getMonth() + 1; // 월은 0부터 시작하므로 1을 더해줍니다.
let day = date.getDate();

// 한 자리 수인 경우 앞에 0을 추가해주기
month = month < 10 ? '0' + month : month;
day = day < 10 ? '0' + day : day;

const today = year + '-' + month + '-' + day;

const todayPluse = (day) => {
    const date = new Date(today);
    date.setDate(date.getDate() + day);
    return date.toISOString().slice(0, 10);
}


export { today, year, month, day, todayPluse };

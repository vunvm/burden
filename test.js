function factorial(num) {
    if (num === 0) return 1;

    let result = 1;
    for (let i = 2; i <= num; i++) {
        result *= i;
    }

    return result;
}

function checkPerfectNumber(num) {
    let sum = 0;

    // tìm các ước của số và tính tổng
    for (let i = 1; i <= num / 2; i++) {
        if (num % i === 0) {
            sum += i;
        }
        if (sum > num) return false;
    }

    return sum === num;
}

function findMinimumSubstringPosition(str) {
    // từ trái qua phải số đầu tiên lớn hơn số ngay kế tiếp đó là vị trí cần tìm
    for (let i = 0; i < str.length - 1; i++) {
        if (str[i] > str[i + 1]) {
            return i;
        }
    }
    return str.length - 1;
}

function calculateTotalCandies(n, c, m) {
    let totalCandies = Math.floor(n / c);
    let wrappers = totalCandies; // Số tờ giấy gói kẹo

    // lặp lại quy trình đổi kẹo đến khi số giấy gói không đổi được nữa
    while (wrappers >= m) {
        let exchangedCandies = Math.floor(wrappers / m);
        totalCandies += exchangedCandies;

        wrappers = wrappers % m;
        wrappers += exchangedCandies;
    }

    return totalCandies;
}


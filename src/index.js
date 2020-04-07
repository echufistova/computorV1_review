
let equation = {
    flag : 0,
    pows : {
    }
};

main();

function main() {
    let a = 0;
    let b = 0;
    let c = 0;
    let discrim = 0;
    let x = [];
    if (process.argv.length != 3 || process.argv[2].length == 0) {
        return errors(0);
    }
    // console.log(process.argv[2]);
    const equat = process.argv[2];
    equatValid(equat);

    if (checkParams(equat) < 0 || reducedForm(equat) < 0)
        return (-1);
    a = (equation.pows[2]) ? equation.pows[2] : 0;
    b = (equation.pows[1]) ? equation.pows[1] : 0;
    c = (equation.pows[0]) ? equation.pows[0] : 0;
    if (a === 0 ) {
        x.push(-c / b);
    } else {
        discrim = b * b - 4 * a * c;
        x = getRoots(a, b, c, discrim);
    }
    if (discrim === 0 || (a === 0 && discrim >= 0)) {
        console.log("The solution is: ")
    } else if (discrim < 0) {
        console.log("Discriminant is negative, but I can solve it: ");
    } else {
        console.log("Discriminant is strictly positive, the two solutions are: ");
    }
    for (res in x) {
        console.log(x[res]);
    }
}

function equatValid(equat) {
    // console.log('equat ', equat);
    let re = /[0-9X*+^=. -]+$/;
    let res = equat.search(re);

    if (res === -1 || !equat.includes('=')) {
        console.log("look here");
        errors(1);
    }
    return 1;
}

function numberValid(equat) {
    let re = /^[\d.]+$/;
    let res = equat.search(re);

    console.log("func number valid");
    if (res === -1) {
        console.log("func number not valid");
        return (errors(1));
    }
    return equat;
}

function signValid(equat, equatPrev, equatNext) {
    if (isSign(equat) && equat.length !== 1) {
        return (errors(1));
    } else if (equat === '*' && (equatPrev === '-' || equatPrev === '+' ||
        equatNext === '-' || equatNext === '+' )) {
        console.log("sadd");
        return (errors(1));
    } else if (equat === '+' && (equatPrev === '-' || equatNext === '-')) {
        return (errors(4));
    } else if (equat === '-' && (equatPrev === '-' || equatNext === '-')) {
        return (errors(4));
    }
    return 1;
}
function isSign(equat) {

    console.log("isSign equat '" + equat + '\'');

    let re = /^[+*-.]+$/;
    let res = equat.search(re);

    // console.log("not sign");
    // console.log(res)ты ;
    if (res === -1)
        return 0;
    return 1;
}

function checkParams(part) {
    let koef = 0;
    let temp = 0;
    let equat = part.split(' ');
    // console.log(equat);
    checkFirstParam(equat[0]);
    for (let i = 0; i < equat.length; i++) {
        let equat1 = equat[i];
        console.log("nachalo: '" + equat1 + '\'');
        // console.log("equat1 " + equat1 + " , i: " + i );
        signValid(equat1, equat[i - 1], equat[i + 1]);
        if (equat1 === '=') {
            equation.flag = 1;
        } else if (equat1.indexOf('X', 0) === 0 && (equat[i - 1] !== "*")) {
            console.log("poisk X: " + equat1);
            if (equat1 === 'X') {
                temp = "X^1";
            } else if (equat1.indexOf('X^', 0) === 0) {
                temp = "X^" + equat1[2];
            }
            console.log("temp: " + temp);
            getPow(temp, equat[i - 1], 1);
        } else if (equat1 === '*' && i <= equat.length - 1 && i !== 0) {
            console.log("1) equat1: " + equat1);
            koef = numberValid(equat[i - 1]);
            if (equat[i + 1].indexOf('^', 0) === -1 && equat[i + 1].indexOf('X', 0) === 0) {
                equat[i + 1] += "^1";
                console.log("equat i + 1: " + equat[i + 1]);
                getPow(equat[i + 1], equat[i - 2], koef);
            } else {
                if (i <= equat.length - 2 && getPow(equat[i + 1], equat[i - 2], koef) < 0) {
                    console.log("here2");
                    return errors(2, equation.pow);
                }
            }
        } else if (i <= equat.length - 1 && equat[i + 1 ] !== '*' && equat1.indexOf('X^', 0) === -1
            && !isSign(equat1) && numberValid(equat1) !== -1) {
            console.log("2) equat1: " + equat1);
            console.log(equation);
            if (i === 0)
                getPow('X^0', '+', equat1);
            else
                getPow('X^0', equat[i - 1], equat1);
        }
    }
    return (1);

}

function checkFirstParam(equat1) {
    // console.log(equat1);
    if (equat1.includes('*') || equat1.includes('+')) {
        return (errors(1));
    }
    return (1);
}

function getPow(equat1, sign, koef) {
    koef = +koef;
    // console.log('\n\nequat: ' + equat1);
    let pow = equat1.slice(equat1.indexOf('^') + 1, equat1.length);

    if (!equation.pows[pow]) {
        equation.pows[pow] = 0;
    }
    if (sign === '-') {
        koef = -koef;
    }
    (equation.flag === 0) ? equation.pows[pow] += koef : equation.pows[pow] -= koef;
    // console.log(equation);
    return (1);
}

function reducedForm() {
    let res = "Reduced Form: ";
    console.log(equation);
    Object.keys(equation.pows).map((key, index) => {
        const sign = equation.pows[key] >= 0 ? '+' : '-';
        if (index === 0 && sign === '+') {
            res += `${equation.pows[key]} * X^${key} `
        } else {
            res += `${sign} ${Math.abs(equation.pows[key])} * X^${key} `
        }
    });
    res += "= 0";
    console.log(res);
    return (checkPows());
}

function checkPows() {
    let max = 0;
    let res = "Polynomial degree: ";
    Object.keys(equation.pows).map((pow) => {
        max = pow;
    });
    res += max;
    console.log(res);
    return ((max > 2 || max < 0) ? errors(2, max) : 1);
}

function getRoots(a, b, c, discrim) {

    console.log("dixcrim " + discrim);

    const x = [];
    let x1 = 0;
    let x2 = 0;
    if (discrim < 0) {
        x1 = +(-b / (2 * a));
        x2 = Math.pow(-discrim, 0.5) / (2 * a);
        x.push(x1 + " + " + "i * " + x2);
        x.push(x1 + " - " + "i * " + x2);
    } else if (discrim === 0) {
        x.push(-b / (2 * a));
    } else {
       x.push((-b + Math.pow(discrim, 0.5)) / (2 * a));
       x.push((-b - Math.pow(discrim, 0.5)) / (2 * a));
    }
    return (x);
}

function errors(i) {
    if (i === 0) {
        console.log("Check please your arguments!");
    } else if (i === 1) {
        console.log("Syntax Error!");
    } else if (i === 2) {
        console.log("The polynomial degree is stricly greater than 2, I can't solve.");
    } else if (i === 3) {
        console.log("Discriminant is strictly negative!");
    } else if (i === 4) {
        console.log("Try another format or сoefficient");
    }
    process.exit(0);
}

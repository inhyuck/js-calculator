import {Digits} from './components/Digits.js';
import {Modifier} from './components/Modifier.js';
import {Operations} from './components/Operations.js';
import {calculateDisplayText, calculateNumber, isValidSizeOfDigits} from './utils/math.js';
import {OPERATOR} from './consts/operator.js';

export function Calculator({$el}) {

    const state = {
        prevNumber: 0,
        operator: null,
        nextNumber: null,
    };

    function onClickDigit({digit}) {
        renewNumber({digit});
        refreshTotal();
    }

    function renewNumber({digit}) {
        const {prevNumber, operator, nextNumber} = state;

        const newNumber = Number(!!operator
            ? `${nextNumber || 0}${digit}`
            : `${prevNumber}${digit}`);

        if (!isValidSizeOfDigits({number: newNumber})) {
            alert('숫자는 세 자리까지만 입력 가능합니다!');
            return;
        }

        if (!!operator) {
            state.nextNumber = newNumber;
            return;
        }
        state.prevNumber = newNumber;
    }

    function onClickModifier() {
        state.prevNumber = 0;
        state.operator = null;
        state.nextNumber = null;
        refreshTotal();
    }

    function onClickOperation({operator}) {
        const {prevNumber, operator: prevOperator, nextNumber} = state;

        if (operator === OPERATOR.EQUAL) {
            state.operator = null;
            state.nextNumber = null;
            state.prevNumber = calculateNumber({prevNumber, operator: prevOperator, nextNumber});
            refreshTotal();
            return;
        }

        //이전 연산결과를 prevNumber 저장
        if (nextNumber) {
            state.prevNumber = calculateNumber({prevNumber, operator: prevOperator, nextNumber});
            state.nextNumber = null;
        }
        state.operator = operator;
        refreshTotal();
    }

    function refreshTotal() {
        const {prevNumber, operator, nextNumber} = state;
        const totalDisplayText = calculateDisplayText({prevNumber, operator, nextNumber});
        $el.querySelector('#total').innerText = totalDisplayText;
    }

    function render() {
        $el.innerHTML = `
            <div class="calculator">
                <h1 id="total">0</h1>
                <div class="digits flex" data-component="digits"></div>
                <div class="modifiers subgrid" data-component="modifier"></div>
                <div class="operations subgrid" data-component="operations"></div>
            </div>
        `;

        new Digits({$el: $el.querySelector('[data-component="digits"]'), onClickDigit});
        new Modifier({$el: $el.querySelector('[data-component="modifier"]'), onClickModifier});
        new Operations({$el: $el.querySelector('[data-component="operations"]'), onClickOperation});
    }

    render();
}

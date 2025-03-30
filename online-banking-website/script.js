'use strict';

const loginbtn = document.querySelector('.btn');
const inputLogin = document.querySelector('.input-text');
const inputLoginPin = document.querySelector('.input-passwort');

const movementsBox = document.querySelector('.container');
const balanceBox = document.querySelector('.balance-container');

const containerApp = document.querySelector('.app');
const containerNav = document.querySelector('.nav');

const transferTo = document.querySelector('.form__input--to');
const transferAmount = document.querySelector('.form__input--amount');
const btnTransfer = document.querySelector('.form__btn--transfer');

const income = document.querySelector('.income');
const out = document.querySelector('.out');
const interest = document.querySelector('.interest');

// Accounts
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Patrik Bartos',
  pin: 5453,
  movements: [-3210, 1000, 8500, -30, 5000, 3400, -150, 790],
  interestRate: 1.5,
};

const accounts = [account1, account2, account3];

// Create Usernames

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

// Display Movements

const calcDisplay = function (movements) {
  movementsBox.innerHTML = '';
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
            <div class="movements__type movements__type--${type}"> ${i + 1}
              ${type}
            </div>
            <div class="movements__value">${mov}€</div>
          </div>
    `;

    movementsBox.insertAdjacentHTML('afterbegin', html);
  });
};

// Balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  balanceBox.textContent = `${acc.balance}€`;
};

let currentAccount;

// Update UI
const updateUI = function (acc) {
  calcDisplay(acc.movements);

  calcDisplayBalance(acc);

  calcSummary(acc);
};

// Display Summary

const calcSummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  income.textContent = `${incomes}€`;

  const outSum = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);
  out.textContent = `${Math.abs(outSum)}€`;

  const interestSum = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  interest.textContent = `${interestSum}€`;
};

// Login
loginbtn.addEventListener('click', function (e) {
  e.preventDefault();

  // part, wo der Benutzername ausgelesen wird
  currentAccount = accounts.find(acc => acc.username === inputLogin.value);

  // part, wo das Passwort ausgelesen wird

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = 100;

    updateUI(currentAccount);
  }
});

// Transfer
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(transferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === transferTo.value);

  transferAmount.value = transferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    updateUI(currentAccount);
  }
});

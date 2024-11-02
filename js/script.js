 // Constants
 const TIERS = {
    1: { amount: 10000, interest: 0.05, name: "Tier 1" },
    2: { amount: 20000, interest: 0.10, name: "Tier 2" },
    3: { amount: 30000, interest: 0.20, name: "Tier 3" }
};
const MAX_MEMBERS = 12;

// State
let members = [];

// DOM Elements
const form = document.getElementById('registration-form');
const errorMessage = document.getElementById('error-message');
const memberCount = document.getElementById('member-count');
const totalSavings = document.getElementById('total-savings');
const totalInterest = document.getElementById('total-interest');
const membersTable = document.getElementById('members-table');

// Utilities
const formatNumber = (num) => num.toLocaleString();

const calculateInterest = (amount, interestRate) => amount * interestRate;

const calculateTotalWithdrawal = (amount, interestRate) => 
    amount + calculateInterest(amount, interestRate);

const getTotalSavings = () => 
    members.reduce((total, member) => total + TIERS[member.tier].amount, 0);

const getTotalInterest = () => 
    members.reduce((total, member) => 
        total + calculateInterest(TIERS[member.tier].amount, TIERS[member.tier].interest), 0);

// UI Updates
const showError = (message) => {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 3000);
};

const updateDashboard = () => {
    memberCount.textContent = members.length;
    totalSavings.textContent = formatNumber(getTotalSavings());
    totalInterest.textContent = formatNumber(getTotalInterest());
};

const updateMembersTable = () => {
    membersTable.innerHTML = members.map(member => {
        const tierData = TIERS[member.tier];
        const interest = calculateInterest(tierData.amount, tierData.interest);
        const totalWithdrawal = calculateTotalWithdrawal(tierData.amount, tierData.interest);
        
        return `
            <tr>
                <td>${member.name}</td>
                <td>${tierData.name}</td>
                <td class="text-right">₦${formatNumber(tierData.amount)}</td>
                <td class="text-right">₦${formatNumber(interest)}</td>
                <td class="text-right">₦${formatNumber(totalWithdrawal)}</td>
                <td class="text-center">
                    <button 
                        class="btn btn-danger" 
                        onclick="handleWithdraw('${member.name}')"
                    >
                        Withdraw
                    </button>
                </td>
            </tr>
        `;
    }).join('');
};

// Event Handlers
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const name = formData.get('name').trim();
    const tier = formData.get('tier');

    if (members.length >= MAX_MEMBERS) {
        showError('Maximum number of members reached');
        return;
    }

    if (!name) {
        showError('Please enter a name');
        return;
    }

    if (members.some(member => member.name.toLowerCase() === name.toLowerCase())) {
        showError('A member with this name already exists');
        return;
    }

    members.push({ 
        name, 
        tier,
        joinedAt: new Date()
    });

    form.reset();
    updateDashboard();
    updateMembersTable();
});

const handleWithdraw = (memberName) => {
    members = members.filter(member => member.name !== memberName);
    updateDashboard();
    updateMembersTable();
};

// Initial render
updateDashboard();
updateMembersTable();
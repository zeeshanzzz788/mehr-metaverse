// Wallet Integration with Sidra Chain
const sidraChain = {
    chainId: '0x17c2d', // 97453 in hex
    chainName: 'Sidra Chain',
    nativeCurrency: { name: 'SDA', symbol: 'SDA', decimals: 18 },
    rpcUrls: ['https://node.sidrachain.com/'],
    blockExplorerUrls: ['https://ledger.sidrachain.com']
};

let provider;
let signer;
let account;

async function connectWallet() {
    if (window.ethereum) {
        try {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            const accounts = await provider.send("eth_requestAccounts", []);
            account = accounts[0];

            // Check and switch to Sidra Chain
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: sidraChain.chainId }],
                });
            } catch (switchError) {
                if (switchError.code === 4902) {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [sidraChain],
                    });
                }
            }

            signer = provider.getSigner();
            document.getElementById('wallet-address').innerText = `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`;

            // Get SDA balance (native token)
            const balance = await provider.getBalance(account);
            document.getElementById('wallet-balance').innerText = `Balance: ${ethers.utils.formatEther(balance)} SDA`;

            document.getElementById('wallet-info').style.display = 'block';
            document.getElementById('connect-wallet-btn').innerText = 'Wallet Connected';
        } catch (error) {
            alert('Wallet connection failed: ' + error.message);
        }
    } else {
        alert('Please install MetaMask or another Ethereum wallet!');
    }
}

function enroll(courseName) {
    if (!account) {
        alert('Please connect your wallet first!');
        return;
    }
    alert(`Enrolling in ${courseName}! Simulating $MHR payment on Sidra Chain... (In production, integrate token contract here)`);
    // Future: Call $MHR contract approve/transfer for real payment
}

// EmailJS for Contact Form (Replace with your keys)
emailjs.init('YOUR_EMAILJS_USER_ID'); // Get from EmailJS dashboard

document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    }).then(() => {
        alert('Message sent successfully!');
    }, (error) => {
        alert('Failed to send message: ' + error.text);
    });
});

// Back to Top Button
const backToTop = document.getElementById('back-to-top');
window.onscroll = function() {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        backToTop.style.display = 'block';
    } else {
        backToTop.style.display = 'none';
    }
};
backToTop.addEventListener('click', () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
});

// Newsletter Placeholder (Replace with real Mailchimp or similar)
document.querySelector('#newsletter form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Subscribed! (Integrate real newsletter service)');
});
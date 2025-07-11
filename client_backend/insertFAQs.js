const mongoose = require('mongoose');

// Replace with your MongoDB URI
const uri = 'mongodb://localhost:27017/FundVerse'; // Update with your MongoDB connection string

// Define the FAQ schema
const faqSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true }
});

// Create a model based on the schema
const FAQ = mongoose.model('FAQ', faqSchema);

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected');
        
        // Define the FAQs
        const faqs = [
            {
                question: "What is FundVerse?",
                answer: "FundVerse is a digital chit fund platform that allows individuals to participate in chit funds conveniently through a secure and transparent digital interface. We combine the traditional savings mechanism with modern technology to ensure easy management, high returns, and efficient borrowing."
            },
            {
                question: "How does a chit fund work on FundVerse?",
                answer: "A chit fund is a group savings scheme where members contribute a fixed amount monthly. Each month, an auction is conducted, and the member who bids the lowest amount receives the chit for that round. The remaining amount after the bid is distributed as dividends to other members."
            },
            {
                question: "What is the auction process in FundVerse?",
                answer: "In each auction, participants bid by offering a discount on the chit amount. The member who bids the lowest receives the chit for that round, and their bid amount is deducted from the total pooled amount. The winner cannot participate in the next round but continues to contribute."
            },
            {
                question: "Can I withdraw from the chit fund at any time?",
                answer: "Once you join a chit fund, you are obligated to continue contributing until the completion of the chit cycle. Early withdrawal is not allowed, as it affects the group’s collective savings. However, you will have access to the chit amount when you win the auction."
            },
            {
                question: "How secure is the FundVerse platform?",
                answer: "FundVerse ensures complete security for users through advanced encryption methods and compliance with regulatory guidelines. All payments are processed through secure gateways like UPI, and user data is protected by industry-standard security measures."
            },
            {
                question: "What are the benefits of using FundVerse over traditional chit funds?",
                answer: "FundVerse offers several advantages over traditional chit funds, including: Digital accessibility: Manage your chit fund from anywhere. Transparency: Track your contributions and bids in real-time. Efficiency: Participate in auctions and receive payouts instantly. Security: Protected by digital security measures. No paperwork: Everything is digitized and easy to manage."
            },
            {
                question: "How do I join a chit fund on FundVerse?",
                answer: "You can join a chit fund by signing up on the FundVerse platform, completing your KYC verification, and selecting a chit scheme that fits your financial needs. After joining, you contribute monthly and participate in the chit auctions."
            },
            {
                question: "What are the different chit schemes available on FundVerse?",
                answer: "FundVerse offers a variety of chit schemes catering to different financial goals, such as: Gold Chit: Ideal for mid-range savings with moderate returns. Diamond Chit: Higher contributions for larger financial goals. Silver Chit: For smaller savings with flexible terms. Platinum Chit: Premium chit funds with maximum returns."
            },
            {
                question: "How are dividends distributed to non-winning members?",
                answer: "After each auction, the amount offered as a bid by the winner is distributed equally among the remaining members of the chit fund as dividends. This provides additional returns to the non-winners of that round."
            },
            {
                question: "What happens if I win the chit in one round?",
                answer: "If you win the chit, you will receive the pooled amount after deducting your bid. However, you won’t be allowed to bid in the next auction. You will still need to contribute the monthly installment until the chit cycle is complete."
            },
            {
                question: "Is there a penalty for missed contributions?",
                answer: "Yes, missing a contribution can lead to penalties and exclusion from the chit fund. Regular contributions are mandatory to ensure the smooth operation of the chit and fairness to all members."
            },
            {
                question: "What are the payment options available on FundVerse?",
                answer: "FundVerse supports multiple payment methods, including UPI, net banking, and credit/debit cards. This ensures easy and hassle-free monthly contributions and payouts."
            },
            {
                question: "How do I track my contributions and auction results?",
                answer: "You can track all your chit fund activities, including your contributions, auction results, dividends, and payouts, through the FundVerse dashboard. The platform offers real-time updates to ensure transparency."
            },
            {
                question: "What is the minimum and maximum chit amount I can participate in?",
                answer: "The chit amounts vary depending on the scheme you choose. FundVerse offers schemes ranging from ₹50,000 to ₹10,00,000 or more, allowing flexibility for participants based on their financial goals."
            },
            {
                question: "Can I refer others to join FundVerse?",
                answer: "Yes! FundVerse has a referral program where you can invite friends and family to join chit funds. You may be eligible for referral rewards or bonuses when someone joins through your referral link."
            }
        ];

        // Insert the FAQs into the database
        return FAQ.insertMany(faqs);
    })
    .then(() => {
        console.log('FAQs inserted successfully');
        return mongoose.connection.close(); // Close the connection
    })
    .catch((error) => {
        console.error('Error inserting FAQs:', error);
        mongoose.connection.close(); // Close the connection on error
    });

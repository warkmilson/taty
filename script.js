// Get references to HTML elements
const slider = document.getElementById('slider');
const sliderValueDisplay = document.getElementById('slider-value');
const resultDisplay = document.getElementById('result');
const multiplierDisplay = document.getElementById('multiplier');
const wagerInput = document.getElementById('wager');
const rollButton = document.getElementById('roll-button');
const balanceDisplay = document.getElementById('balance');

// Load saved balance from localStorage if available
let balance = parseFloat(localStorage.getItem('balance')) || 30000.00; // Default to 30000 if no saved balance
balanceDisplay.textContent = `Your T-Bucks: ${balance.toFixed(2)}`;

// Initialize slider and set default value to 52.00 (middle of the range)
slider.value = 60.00; // Set the default value to 52.00
slider.min = 1.00; // Set the minimum slider value to 1.00
slider.max = 99.00; // Set the maximum slider value to 99.
slider.step = 0.01; // Set the step to 0.01 for finer control

// Display initial slider value and multiplier
sliderValueDisplay.textContent = `Slider Value: 60.00`;
multiplierDisplay.textContent = `Payout Multiplier: 2.00x`;

// Function to calculate the multiplier based on the slider value
function calculateMultiplier(sliderValue) {
    const minSliderValue = 1.00;
    const maxSliderValue = 99.00;
    const minMultiplier = 1.01;  // Min payout multiplier at slider value 1.00
    const maxMultiplier = 5;    // Max payout multiplier at slider value 99.99
    const midSliderValue = 60.00;
    const midMultiplier = 2.00;

    // Adjust multiplier scaling to ensure 52 = 2x and 1.00 = 1.01x
    if (sliderValue <= midSliderValue) {
        // For values less than or equal to 52, scale between 1.01 and 2.00
        return minMultiplier + (sliderValue - minSliderValue) * (midMultiplier - minMultiplier) / (midSliderValue - minSliderValue);
    } else {
        // For values greater than 52, scale between 2.00 and 5.00
        return midMultiplier + (sliderValue - midSliderValue) * (maxMultiplier - midMultiplier) / (maxSliderValue - midSliderValue);
    }
}

// Update the displayed slider value and the multiplier
slider.addEventListener('input', () => {
    const sliderValue = parseFloat(slider.value).toFixed(2);
    sliderValueDisplay.textContent = `Slider Value: ${sliderValue}`;

    // Calculate multiplier based on slider value
    const multiplier = calculateMultiplier(slider.value);
    multiplierDisplay.textContent = `Payout Multiplier: ${multiplier.toFixed(2)}x`;
});

// Function to close the popup (if it's already open)
function closePopup() {
    const existingPopup = document.querySelector('.popup');
    if (existingPopup) {
        existingPopup.remove();
    }
}

// Handle the roll action
rollButton.addEventListener('click', () => {
    const wagerAmount = parseFloat(wagerInput.value);

    // Close any existing popups when the roll button is clicked
    closePopup();

    // Check if the player has enough T-Bucks to wager
    if (wagerAmount > balance) {
        resultDisplay.textContent = "Not enough T-Bucks to wager!";
        return;
    }

    // Generate a random number (1 to 100) to simulate the outcome
    const randomNumber = Math.random() * 100;
    const sliderValue = parseFloat(slider.value);
    const multiplier = calculateMultiplier(sliderValue);

    // Show the result in a modal popup
    showPopup(randomNumber, sliderValue, wagerAmount, multiplier, randomNumber >= sliderValue);
    
    // Update balance after result
    if (randomNumber >= sliderValue) {
        // Calculate winnings
        const winnings = wagerAmount * multiplier;
        balance += winnings;
        balanceDisplay.textContent = `Your T-Bucks: ${balance.toFixed(2)}`;

        // Save the updated balance in localStorage
        localStorage.setItem('balance', balance.toFixed(2));

        // Trigger the confetti animation if the player wins
        startConfetti();
    } else {
        balance -= wagerAmount;
        balanceDisplay.textContent = `Your T-Bucks: ${balance.toFixed(2)}`;

        // Save the updated balance in localStorage
        localStorage.setItem('balance', balance.toFixed(2));
    }
});

// Function to display a popup with the roll result
function showPopup(randomNumber, sliderValue, wagerAmount, multiplier, isWin) {
    // Create a popup container
    const popup = document.createElement('div');
    popup.className = 'popup';

    // Set the content of the popup based on win or loss
    const message = isWin ? 
        `Congratulations! You rolled ${randomNumber.toFixed(2)} and won ${wagerAmount * multiplier}.` :
        `Sorry, you rolled ${randomNumber.toFixed(2)} and lost your wager of ${wagerAmount}.`;
    
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    popup.appendChild(messageElement);

    // Add a close button to the popup
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.className = 'popup-close-button'; // Add class for styling
    closeButton.addEventListener('click', () => {
        popup.remove(); // Close the popup when the button is clicked
    });
    popup.appendChild(closeButton);

    // Append the popup to the body
    document.body.appendChild(popup);
}

// Close the popup if anywhere else on the screen is clicked
document.addEventListener('click', (event) => {
    const popup = document.querySelector('.popup');
    if (popup && !popup.contains(event.target) && event.target !== rollButton) {
        popup.remove();
    }
});

// Function to start the confetti animation on win
function startConfetti() {
    confetti({
        particleCount: 200,
        spread: 70,
        origin: { y: 0.6 }
    });
}


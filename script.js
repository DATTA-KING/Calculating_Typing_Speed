// Typing Speed Test Application
class TypingSpeedTest {
    constructor() {
        this.testTexts = {
            easy: [
                "The quick brown fox jumps over the lazy dog. This is a simple sentence.",
                "A good book is a friend that never lets you down. Reading opens new worlds.",
                "Technology changes fast but learning never stops. Keep practicing every day.",
                "The sun shines bright on a beautiful morning. Birds sing in the trees.",
                "Practice makes perfect. Every expert was once a beginner in their field."
            ],
            medium: [
                "In the digital age, communication has evolved dramatically. Social media platforms connect people across vast distances, enabling instant sharing of ideas and experiences.",
                "Climate change poses significant challenges for our planet. Scientists worldwide are working on innovative solutions to reduce carbon emissions and promote sustainability.",
                "The art of programming requires both logical thinking and creative problem-solving. Developers must understand complex algorithms while writing clean, maintainable code.",
                "Modern medicine has made remarkable advances in treating diseases. Researchers continue to discover new treatments and improve existing medical procedures.",
                "Education is the foundation of progress. Teachers inspire students to think critically and pursue knowledge throughout their lives."
            ],
            hard: [
                "Quantum computing represents a paradigm shift in computational capability. Unlike classical computers that use bits, quantum computers leverage quantum bits (qubits) which can exist in superposition states.",
                "The implementation of machine learning algorithms requires sophisticated mathematical foundations. Neural networks, with their interconnected layers of nodes, mimic the human brain's architecture.",
                "Cryptocurrency and blockchain technology have revolutionized financial systems. The decentralized nature of these systems challenges traditional banking infrastructure.",
                "Bioinformatics combines biology, computer science, and information technology. This interdisciplinary field analyzes biological data to understand genetic sequences and protein structures.",
                "The philosophical implications of artificial intelligence raise questions about consciousness, free will, and the nature of human intelligence itself."
            ]
        };
        
        this.currentText = '';
        this.currentPosition = 0;
        this.startTime = null;
        this.endTime = null;
        this.timer = null;
        this.isTestActive = false;
        this.testDuration = 60;
        this.timeLeft = 60;
        this.errors = 0;
        this.totalChars = 0;
        
        this.initializeElements();
        this.setupEventListeners();
        this.generateNewText();
    }
    
    initializeElements() {
        // Test configuration elements
        this.testDurationSelect = document.getElementById('test-duration');
        this.difficultySelect = document.getElementById('difficulty');
        this.generateTextBtn = document.getElementById('generate-text');
        
        // Test display elements
        this.timerDisplay = document.getElementById('timer');
        this.wpmDisplay = document.getElementById('wpm');
        this.accuracyDisplay = document.getElementById('accuracy');
        this.textDisplay = document.getElementById('text-display');
        this.textContent = document.getElementById('text-content');
        
        // Input elements
        this.typingInput = document.getElementById('typing-input');
        this.startTestBtn = document.getElementById('start-test');
        this.resetTestBtn = document.getElementById('reset-test');
        
        // Results elements
        this.resultsSection = document.getElementById('results-section');
        this.finalWpm = document.getElementById('final-wpm');
        this.finalAccuracy = document.getElementById('final-accuracy');
        this.finalTime = document.getElementById('final-time');
        this.finalChars = document.getElementById('final-chars');
        this.tryAgainBtn = document.getElementById('try-again');
        this.shareResultsBtn = document.getElementById('share-results');
        
        // Progress bar
        this.progressBar = document.getElementById('progress-bar');
        
        // Loading spinner
        this.loadingSpinner = document.getElementById('loading-spinner');
    }
    
    setupEventListeners() {
        // Configuration event listeners
        this.testDurationSelect.addEventListener('change', (e) => {
            this.testDuration = parseInt(e.target.value);
            this.timeLeft = this.testDuration;
            this.timerDisplay.textContent = this.testDuration;
            this.resetTest();
        });
        
        this.difficultySelect.addEventListener('change', () => {
            this.generateNewText();
        });
        
        this.generateTextBtn.addEventListener('click', () => {
            this.generateNewText();
        });
        
        // Test control event listeners
        this.startTestBtn.addEventListener('click', () => {
            this.startTest();
        });
        
        this.resetTestBtn.addEventListener('click', () => {
            this.resetTest();
        });
        
        // Typing input event listeners
        this.typingInput.addEventListener('input', (e) => {
            this.handleTyping(e);
        });
        
        this.typingInput.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });
        
        this.typingInput.addEventListener('paste', (e) => {
            e.preventDefault();
            this.showError('Pasting is not allowed during the test!');
        });
        
        // Results event listeners
        this.tryAgainBtn.addEventListener('click', () => {
            this.resetTest();
            this.hideResults();
        });
        
        this.shareResultsBtn.addEventListener('click', () => {
            this.shareResults();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                if (!this.isTestActive) {
                    this.startTest();
                }
            }
            if (e.key === 'Escape') {
                this.resetTest();
            }
        });
    }
    
    generateNewText() {
        this.showLoading();
        
        // Simulate loading delay for better UX
        setTimeout(() => {
            const difficulty = this.difficultySelect.value;
            const texts = this.testTexts[difficulty];
            const randomIndex = Math.floor(Math.random() * texts.length);
            
            this.currentText = texts[randomIndex];
            this.displayText();
            this.resetTest();
            this.hideLoading();
        }, 500);
    }
    
    displayText() {
        this.textContent.innerHTML = '';
        
        for (let i = 0; i < this.currentText.length; i++) {
            const span = document.createElement('span');
            span.textContent = this.currentText[i];
            span.classList.add('char');
            span.setAttribute('data-index', i);
            this.textContent.appendChild(span);
        }
    }
    
    startTest() {
        if (this.isTestActive) return;
        
        this.isTestActive = true;
        this.startTime = Date.now();
        this.typingInput.disabled = false;
        this.typingInput.focus();
        this.typingInput.value = '';
        
        this.startTestBtn.innerHTML = '<i class="fas fa-pause"></i> Testing...';
        this.startTestBtn.disabled = true;
        
        this.startTimer();
        this.updateHighlight();
    }
    
    startTimer() {
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.timerDisplay.textContent = this.timeLeft;
            
            const progress = ((this.testDuration - this.timeLeft) / this.testDuration) * 100;
            this.progressBar.style.width = progress + '%';
            
            if (this.timeLeft <= 0) {
                this.endTest();
            }
        }, 1000);
    }
    
    handleTyping(e) {
        if (!this.isTestActive) return;
        
        const inputText = e.target.value;
        const inputLength = inputText.length;
        
        // Update statistics
        this.totalChars = inputLength;
        this.currentPosition = inputLength;
        
        // Check for errors
        this.errors = 0;
        for (let i = 0; i < inputLength; i++) {
            if (i < this.currentText.length && inputText[i] !== this.currentText[i]) {
                this.errors++;
            }
        }
        
        // Update display
        this.updateTextDisplay(inputText);
        this.updateStats();
        
        // Check if test is complete
        if (inputLength >= this.currentText.length) {
            this.endTest();
        }
    }
    
    handleKeyPress(e) {
        if (!this.isTestActive) return;
        
        // Prevent certain keys during test
        if (e.ctrlKey || e.altKey) {
            if (e.key !== 'a' && e.key !== 'c' && e.key !== 'v') {
                // Allow basic shortcuts but prevent others
                return;
            }
        }
    }
    
    updateTextDisplay(inputText) {
        const chars = this.textContent.querySelectorAll('.char');
        
        chars.forEach((char, index) => {
            char.classList.remove('correct', 'incorrect', 'current');
            
            if (index < inputText.length) {
                if (inputText[index] === this.currentText[index]) {
                    char.classList.add('correct');
                } else {
                    char.classList.add('incorrect');
                }
            } else if (index === inputText.length) {
                char.classList.add('current');
            }
        });
    }
    
    updateHighlight() {
        const chars = this.textContent.querySelectorAll('.char');
        chars.forEach((char, index) => {
            char.classList.remove('current');
            if (index === this.currentPosition) {
                char.classList.add('current');
            }
        });
    }
    
    updateStats() {
        // Calculate WPM
        const timeElapsed = (Date.now() - this.startTime) / 1000 / 60; // in minutes
        const wordsTyped = this.totalChars / 5; // Standard: 5 characters = 1 word
        const wpm = Math.round(wordsTyped / timeElapsed) || 0;
        
        // Calculate accuracy
        const accuracy = this.totalChars > 0 ? 
            Math.round(((this.totalChars - this.errors) / this.totalChars) * 100) : 100;
        
        // Update displays
        this.wpmDisplay.textContent = wpm;
        this.accuracyDisplay.textContent = accuracy + '%';
        
        // Add visual feedback for performance
        this.updatePerformanceIndicators(wpm, accuracy);
    }
    
    updatePerformanceIndicators(wpm, accuracy) {
        // Update WPM color based on speed
        this.wpmDisplay.style.color = wpm >= 40 ? '#4caf50' : wpm >= 20 ? '#ff9800' : '#f44336';
        
        // Update accuracy color
        this.accuracyDisplay.style.color = accuracy >= 95 ? '#4caf50' : accuracy >= 85 ? '#ff9800' : '#f44336';
    }
    
    endTest() {
        this.isTestActive = false;
        this.endTime = Date.now();
        
        clearInterval(this.timer);
        this.typingInput.disabled = true;
        
        this.startTestBtn.innerHTML = '<i class="fas fa-play"></i> Start Test';
        this.startTestBtn.disabled = false;
        
        this.showResults();
    }
    
    showResults() {
        const timeElapsed = (this.endTime - this.startTime) / 1000;
        const wordsTyped = this.totalChars / 5;
        const wpm = Math.round((wordsTyped / timeElapsed) * 60) || 0;
        const accuracy = this.totalChars > 0 ? 
            Math.round(((this.totalChars - this.errors) / this.totalChars) * 100) : 100;
        
        // Update results display
        this.finalWpm.textContent = wpm;
        this.finalAccuracy.textContent = accuracy + '%';
        this.finalTime.textContent = Math.round(timeElapsed) + 's';
        this.finalChars.textContent = this.totalChars;
        
        // Show results section
        this.resultsSection.style.display = 'block';
        this.resultsSection.scrollIntoView({ behavior: 'smooth' });
        
        // Store results in localStorage
        this.saveResults(wpm, accuracy, timeElapsed, this.totalChars);
        
        // Add celebration animation for good performance
        if (wpm >= 40 && accuracy >= 95) {
            this.celebrateResults();
        }
    }
    
    hideResults() {
        this.resultsSection.style.display = 'none';
    }
    
    resetTest() {
        this.isTestActive = false;
        clearInterval(this.timer);
        
        this.currentPosition = 0;
        this.startTime = null;
        this.endTime = null;
        this.errors = 0;
        this.totalChars = 0;
        this.timeLeft = this.testDuration;
        
        // Reset UI
        this.typingInput.value = '';
        this.typingInput.disabled = true;
        this.timerDisplay.textContent = this.testDuration;
        this.wpmDisplay.textContent = '0';
        this.accuracyDisplay.textContent = '100%';
        this.progressBar.style.width = '0%';
        
        // Reset button
        this.startTestBtn.innerHTML = '<i class="fas fa-play"></i> Start Test';
        this.startTestBtn.disabled = false;
        
        // Reset text display
        if (this.currentText) {
            this.displayText();
        }
        
        // Reset performance indicators
        this.wpmDisplay.style.color = '#333';
        this.accuracyDisplay.style.color = '#333';
        
        // Hide results
        this.hideResults();
    }
    
    shareResults() {
        const wpm = this.finalWpm.textContent;
        const accuracy = this.finalAccuracy.textContent;
        const time = this.finalTime.textContent;
        
        const shareText = `I just completed a typing speed test! 🎯\n\n` +
                         `⚡ Speed: ${wpm} WPM\n` +
                         `🎯 Accuracy: ${accuracy}\n` +
                         `⏱️ Time: ${time}\n\n` +
                         `Try it yourself at SpeedType!`;
        
        if (navigator.share) {
            navigator.share({
                title: 'My Typing Speed Test Results',
                text: shareText,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                this.showSuccess('Results copied to clipboard!');
            }).catch(() => {
                this.showError('Unable to copy results. Please try again.');
            });
        }
    }
    
    saveResults(wpm, accuracy, time, chars) {
        const results = JSON.parse(localStorage.getItem('typingResults') || '[]');
        const newResult = {
            wpm,
            accuracy,
            time,
            chars,
            date: new Date().toISOString(),
            difficulty: this.difficultySelect.value,
            duration: this.testDuration
        };
        
        results.push(newResult);
        
        // Keep only last 10 results
        if (results.length > 10) {
            results.shift();
        }
        
        localStorage.setItem('typingResults', JSON.stringify(results));
    }
    
    celebrateResults() {
        // Add celebration animation
        const resultsContainer = document.querySelector('.results-container');
        resultsContainer.style.animation = 'bounce 0.6s ease-in-out';
        
        setTimeout(() => {
            resultsContainer.style.animation = '';
        }, 600);
        
        // Add confetti effect (simple version)
        this.showConfetti();
    }
    
    showConfetti() {
        const colors = ['#667eea', '#764ba2', '#4caf50', '#ff9800', '#f44336'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.zIndex = '9999';
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            
            document.body.appendChild(confetti);
            
            // Animate confetti
            const animation = confetti.animate([
                { transform: 'translateY(0px) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${window.innerHeight + 100}px) rotate(360deg)`, opacity: 0 }
            ], {
                duration: 3000,
                easing: 'ease-out'
            });
            
            animation.addEventListener('finish', () => {
                confetti.remove();
            });
        }
    }
    
    showLoading() {
        this.loadingSpinner.style.display = 'flex';
    }
    
    hideLoading() {
        this.loadingSpinner.style.display = 'none';
    }
    
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.textContent = message;
        
        // Find appropriate container
        const container = document.querySelector('.test-section');
        container.appendChild(errorDiv);
        
        // Remove after 3 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }
    
    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success';
        successDiv.style.cssText = `
            color: #4caf50;
            background-color: rgba(76, 175, 80, 0.1);
            border: 1px solid rgba(76, 175, 80, 0.3);
            padding: 0.5rem;
            border-radius: 5px;
            margin-top: 0.5rem;
        `;
        successDiv.textContent = message;
        
        const container = document.querySelector('.results-section');
        container.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }
    
    // Advanced features
    getPerformanceRating(wpm, accuracy) {
        if (wpm >= 60 && accuracy >= 98) return 'Expert';
        if (wpm >= 40 && accuracy >= 95) return 'Advanced';
        if (wpm >= 25 && accuracy >= 90) return 'Intermediate';
        if (wpm >= 15 && accuracy >= 85) return 'Beginner';
        return 'Practice More';
    }
    
    // Input validation
    validateInput(input) {
        // Check for suspicious patterns
        if (input.length > this.currentText.length * 2) {
            return false;
        }
        
        // Check for repeated characters (potential bot)
        const repeatedPattern = /(.)\1{10,}/;
        if (repeatedPattern.test(input)) {
            return false;
        }
        
        return true;
    }
}

// CSS animations for bounce effect
const style = document.createElement('style');
style.textContent = `
    @keyframes bounce {
        0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0, 0, 0);
        }
        40%, 43% {
            transform: translate3d(0, -15px, 0);
        }
        70% {
            transform: translate3d(0, -7px, 0);
        }
        90% {
            transform: translate3d(0, -2px, 0);
        }
    }
    
    .success {
        animation: slideIn 0.3s ease-out;
    }
    
    @keyframes slideIn {
        from { transform: translateY(-20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
`;
document.head.appendChild(style);

// Initialize the application
let typingTest;

document.addEventListener('DOMContentLoaded', () => {
    typingTest = new TypingSpeedTest();
    
    // Add keyboard shortcuts info
    const shortcutsInfo = document.createElement('div');
    shortcutsInfo.innerHTML = `
        <small style="color: rgba(255,255,255,0.7); margin-top: 1rem; display: block;">
            <strong>Keyboard Shortcuts:</strong> 
            Ctrl+Enter: Start Test | Escape: Reset Test
        </small>
    `;
    document.querySelector('.footer').appendChild(shortcutsInfo);
    
    // Add version info
    console.log('SpeedType v1.0.0 - Typing Speed Test Application');
    console.log('Features: Real-time feedback, WPM calculation, accuracy tracking, input validation');
});

// Service Worker registration for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TypingSpeedTest;
}
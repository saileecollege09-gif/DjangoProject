// Clean AI Chatbot - Fully Interactive Vanilla JS
// No frameworks, no APIs, instant browser-ready

class ChatBot {
    constructor() {
        this.messagesEl = document.getElementById('messages');
        this.inputEl = document.getElementById('userInput');
        this.sendBtn = document.getElementById('sendBtn');
        
        this.initEventListeners();
        this.inputEl.focus();
    }
    
    initEventListeners() {
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Auto-resize input
        this.inputEl.addEventListener('input', (e) => {
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
        });
    }
    
    addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'ai'}`;
        
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.textContent = text;
        
        messageDiv.appendChild(bubble);
        this.messagesEl.appendChild(messageDiv);
        this.scrollToBottom();
        return messageDiv;
    }
    
    showLoading() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message ai loading';
        
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.innerHTML = '<div class="loading">AI typing<span class="loading-dots"><div></div><div></div><div></div></span></div>';
        
        loadingDiv.appendChild(bubble);
        this.messagesEl.appendChild(loadingDiv);
        this.scrollToBottom();
        return loadingDiv;
    }
    
    removeLoading(loadingEl) {
        if (loadingEl && loadingEl.parentNode) {
            loadingEl.parentNode.removeChild(loadingEl);
        }
    }
    
    scrollToBottom() {
        this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
    }
    
    // Simulated AI response (replace with real API)
    async getAIResponse(userMessage) {
        // Simulate network delay 1-3s
        await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 1800));
        
        const responses = [
            `Thanks for your message "${userMessage}". That's interesting! Here's my perspective:`,
            `Great question about "${userMessage}". Let me explain: Yes, you're right about that.`,
            `Regarding "${userMessage}", I think a good approach would be to...`,
            `Love the question "${userMessage}"! Short answer: absolutely.`,
            `"${userMessage}"? Perfect. Here's why that matters:`
        ];
        
        const response = responses[Math.floor(Math.random() * responses.length)];
        return response;
    }
    
    async sendMessage() {
        const text = this.inputEl.value.trim();
        if (!text) return;
        
        // Add user message
        this.addMessage(text, true);
        const userText = this.inputEl.value;
        this.inputEl.value = '';
        
        // Disable during AI response
        this.sendBtn.disabled = true;
        this.sendBtn.textContent = '⏳';
        this.inputEl.disabled = true;
        
        // Show loading
        const loadingEl = this.showLoading();
        
        try {
            // Get AI response
            const aiResponse = await this.getAIResponse(userText);
            
            // Remove loading, add AI message
            this.removeLoading(loadingEl);
            this.addMessage(aiResponse);
            
        } catch (error) {
            console.error('AI Error:', error);
            this.removeLoading(loadingEl);
            this.addMessage('Oops! Something went wrong. Try again.');
        } finally {
            // Re-enable input
            this.sendBtn.disabled = false;
            this.sendBtn.textContent = 'Send';
            this.inputEl.disabled = false;
            this.inputEl.focus();
        }
    }
}

// Initialize when DOM loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChatBot();
});

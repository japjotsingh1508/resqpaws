document.addEventListener('DOMContentLoaded', function() {
    // First aid chatbot elements
    const startChatBtn = document.getElementById('start-chat-btn');
    const chatbotContainer = document.getElementById('chatbot-container');
    const closeChatbot = document.getElementById('close-chatbot');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input');
    const sendMessageBtn = document.getElementById('send-message');
    const quickOptions = document.querySelectorAll('.quick-option');
    
    // Common animal health issues and solutions
    const firstAidData = {
        wound: {
            symptoms: ["bleeding", "cut", "laceration", "wound", "injury"],
            solution: `1. Approach the animal carefully to avoid being bitten or scratched.
2. If bleeding, apply gentle pressure with a clean cloth or bandage.
3. Clean the wound with mild soap and water if possible.
4. Cover with a clean bandage or cloth.
5. Contact a veterinarian for further care.`
        },
        parasites: {
            symptoms: ["flea", "tick", "mite", "itching", "scratching", "parasite"],
            solution: `1. Wear gloves to protect yourself.
2. For ticks, use tweezers to grasp the tick close to the skin and pull straight out.
3. For fleas, use a flea comb to remove as many as possible.
4. Bathe the animal with mild soap if possible.
5. Consult a vet for appropriate parasite treatment.`
        },
        breathing: {
            symptoms: ["breathing difficulty", "panting", "wheezing", "coughing", "shortness of breath"],
            solution: `1. Keep the animal calm and in a well-ventilated area.
2. Check for obstructions in the mouth or throat (only if safe to do so).
3. Avoid stressing the animal further.
4. Seek immediate veterinary attention as breathing difficulties can be life-threatening.`
        },
        poisoning: {
            symptoms: ["vomiting", "diarrhea", "drooling", "seizures", "poison", "toxic"],
            solution: `1. Remove the animal from the source of poison if safe to do so.
2. Identify the poison if possible (bring container to vet).
3. Do NOT induce vomiting unless instructed by a professional.
4. Contact a veterinarian or animal poison control immediately.`
        },
        eye: {
            symptoms: ["eye discharge", "red eye", "swollen eye", "eye injury", "cloudy eye"],
            solution: `1. Flush the eye gently with clean water or saline solution.
2. Do not rub or put pressure on the eye.
3. Prevent the animal from scratching at the eye.
4. Seek veterinary care as eye problems can worsen quickly.`
        },
        malnutrition: {
            symptoms: ["thin", "weak", "starving", "malnourished", "underweight"],
            solution: `1. Offer small amounts of food and fresh water.
2. Provide high-quality protein sources if available.
3. Avoid overfeeding as this can cause digestive issues.
4. Contact a vet or animal welfare organization for ongoing care.`
        },
        fracture: {
            symptoms: ["limping", "broken bone", "fracture", "swollen limb", "unable to walk"],
            solution: `1. Do not attempt to set the bone yourself.
2. Restrict movement by gently placing the animal in a box or carrier.
3. Apply a makeshift splint only if you're trained to do so.
4. Seek immediate veterinary attention.`
        },
        skin: {
            symptoms: ["rash", "hair loss", "sores", "skin infection", "scabs"],
            solution: `1. Wear gloves to protect yourself.
2. Clean the area gently with mild soap and water.
3. Apply a clean, damp cloth to soothe irritation.
4. Consult a vet for proper diagnosis and treatment.`
        }
    };
    
    // Show/hide chatbot
    if (startChatBtn) {
        startChatBtn.addEventListener('click', function() {
            chatbotContainer.classList.add('active');
        });
    }
    
    if (closeChatbot) {
        closeChatbot.addEventListener('click', function() {
            chatbotContainer.classList.remove('active');
        });
    }
    
    // Quick options
    quickOptions.forEach(option => {
        option.addEventListener('click', function() {
            const issueType = this.getAttribute('data-option');
            sendBotMessage(`The animal has a ${issueType}. What should I do?`);
        });
    });
    
    // Send message function
    function sendBotMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${message}</p>
            </div>
        `;
        chatbotMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        
        // Process message and get response
        setTimeout(() => {
            processUserMessage(message);
        }, 500);
    }
    
    // Process user message and generate bot response
    function processUserMessage(message) {
        let response = '';
        let foundMatch = false;
        const lowerMessage = message.toLowerCase();
        
        // Check for matches in first aid data
        for (const [issue, data] of Object.entries(firstAidData)) {
            for (const symptom of data.symptoms) {
                if (lowerMessage.includes(symptom)) {
                    response = `For ${issue} issues:\n\n${data.solution}`;
                    foundMatch = true;
                    break;
                }
            }
            if (foundMatch) break;
        }
        
        if (!foundMatch) {
            response = `I'm not sure about that condition. Please describe the symptoms in more detail or contact a veterinarian immediately for serious issues.`;
        }
        
        // Add emergency note for serious conditions
        if (lowerMessage.includes('emergency') || 
            lowerMessage.includes('serious') || 
            lowerMessage.includes('critical') ||
            lowerMessage.includes('poison') ||
            lowerMessage.includes('unconscious')) {
            response += `\n\nThis sounds serious. Please contact emergency veterinary services immediately.`;
        }
        
        // Display bot response
        displayBotResponse(response);
    }
    
    // Display bot response
    function displayBotResponse(response) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        
        // Format response with line breaks
        const formattedResponse = response.split('\n').map(line => {
            return line.trim() ? `<p>${line}</p>` : '';
        }).join('');
        
        messageDiv.innerHTML = `
            <div class="message-content">
                ${formattedResponse}
                <div class="quick-options">
                    <button class="quick-option" data-option="wound">Wound/Injury</button>
                    <button class="quick-option" data-option="parasites">Parasites</button>
                    <button class="quick-option" data-option="breathing">Breathing Issues</button>
                </div>
            </div>
        `;
        
        chatbotMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        
        // Re-attach event listeners to new quick options
        document.querySelectorAll('.quick-option').forEach(option => {
            option.addEventListener('click', function() {
                const issueType = this.getAttribute('data-option');
                sendBotMessage(`The animal has a ${issueType}. What should I do?`);
            });
        });
    }
    
    // Send message on button click
    if (sendMessageBtn) {
        sendMessageBtn.addEventListener('click', function() {
            const message = chatbotInput.value.trim();
            if (message) {
                sendBotMessage(message);
                chatbotInput.value = '';
            }
        });
    }
    
    // Send message on Enter key
    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const message = chatbotInput.value.trim();
                if (message) {
                    sendBotMessage(message);
                    chatbotInput.value = '';
                }
            }
        });
    }
    
    // Common issue cards
    const issueCards = document.querySelectorAll('.issue-card');
    issueCards.forEach(card => {
        card.addEventListener('click', function() {
            const issueType = this.getAttribute('data-issue');
            chatbotContainer.classList.add('active');
            
            // Scroll to bottom and clear any existing messages
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            
            setTimeout(() => {
                sendBotMessage(`The animal has ${issueType}. What should I do?`);
            }, 300);
        });
    });
});
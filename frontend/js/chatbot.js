// ========================================
// XUMTECHBOT - FUNCTIONAL CHATBOT
// ========================================

// Global chat state
let chatState = {
    isOpen: false,
    messages: [],
    isTyping: false
};

// Bot knowledge base
const botKnowledge = {
    "servicios": {
        keywords: ["servicios", "qué hacen", "qué ofrecen", "productos", "servicio"],
        response: "En Xumtech ofrecemos desarrollo web, aplicaciones móviles, consultoría tecnológica y soluciones digitales innovadoras. Nos especializamos en React, Node.js, Python y tecnologías cloud."
    },
    "horarios": {
        keywords: ["horarios", "horario", "horas", "cuándo", "tiempo", "atención"],
        response: "Nuestro horario de atención es de lunes a viernes de 9:00 a 18:00, horario de España. Los sábados de 9:00 a 14:00."
    },
    "contacto": {
        keywords: ["contacto", "contactar", "teléfono", "email", "comunicar", "llamar"],
        response: "Puedes contactarnos al teléfono +34 954 123 456, por email a info@xumtech.es, o visitarnos en nuestra oficina en Sevilla."
    },
    "ubicacion": {
        keywords: ["ubicación", "dónde", "dirección", "oficina", "ubicados", "localización", "ciudad", "ciudades"],
        response: "Estamos ubicados en Sevilla, España. Calle Sierpes 45, Edificio Torre Sevilla, 41004. Estamos en el corazón del centro histórico de Sevilla."
    },
    "empresa": {
        keywords: ["xumtech", "empresa", "quiénes son", "acerca de", "información"],
        response: "Somos Xumtech, líderes en innovación tecnológica desde 2018 en Sevilla. Transformamos ideas en soluciones digitales innovadoras que impulsan el crecimiento de nuestros clientes en Andalucía."
    },
    "especializacion": {
        keywords: ["especialización", "especialidad", "especializan", "áreas", "en qué se especializan"],
        response: "Nos especializamos en desarrollo web con React, Angular y Vue.js, aplicaciones móviles nativas e híbridas, sistemas empresariales, inteligencia artificial y cloud computing."
    },
    "tecnologias": {
        keywords: ["tecnologías", "tecnología", "stack", "herramientas", "lenguajes", "framework", "manejan"],
        response: "Trabajamos con las últimas tecnologías: JavaScript/TypeScript, Python, Java, .NET, React, Angular, Vue.js, Node.js, Django, Spring Boot, AWS, Azure, Docker, Kubernetes y más."
    },
    "desarrollo_web": {
        keywords: ["desarrollo web", "web", "sitios web", "páginas web", "ofrecen desarrollo"],
        response: "Sí, ofrecemos desarrollo web completo. Creamos sitios web modernos, aplicaciones web progresivas (PWA), e-commerce, y sistemas web empresariales con las últimas tecnologías."
    },
    "cotizacion": {
        keywords: ["cotización", "presupuesto", "precio", "costo", "cuánto cuesta", "solicitar cotización"],
        response: "Para solicitar una cotización, puedes enviarnos un email a cotizaciones@xumtech.es con los detalles de tu proyecto, o agendar una reunión llamando al +34 954 123 456."
    },
    "soporte": {
        keywords: ["soporte técnico", "soporte", "ayuda técnica", "problemas técnicos", "fallas", "mantenimiento"],
        response: "Ofrecemos soporte técnico 24/7 para todos nuestros clientes. Puedes contactar a nuestro equipo de soporte al +34 954 123 457 o enviar un ticket a soporte@xumtech.es."
    },
    "experiencia": {
        keywords: ["experiencia", "años en el mercado", "historia", "trayectoria", "proyectos realizados"],
        response: "Con más de 6 años en el mercado, hemos completado más de 150 proyectos exitosos para empresas de diversos sectores. Nuestra experiencia incluye startups, medianas empresas y corporaciones."
    },
    "capacitacion": {
        keywords: ["capacitación", "entrenamiento", "cursos", "formación", "aprendizaje", "dan cursos"],
        response: "Ofrecemos programas de capacitación en tecnologías modernas, metodologías ágiles y mejores prácticas de desarrollo. Nuestros cursos son personalizados según las necesidades de tu empresa."
    },
    "metodologias": {
        keywords: ["metodologías", "metodología", "proceso", "agile", "scrum", "usan", "trabajan con agile"],
        response: "Utilizamos metodologías ágiles como Scrum y Kanban, con sprints de 2 semanas, reuniones diarias, retrospectivas y entrega continua. Adaptamos nuestros procesos a las necesidades específicas de cada proyecto."
    },
    "saludo": {
        keywords: ["hola", "buenos días", "buenas tardes", "buenas noches", "como estás", "que tal"],
        response: "¡Hola! Soy XumtechBot, el asistente virtual de Xumtech Sevilla. Estoy aquí para ayudarte con cualquier consulta sobre nuestros servicios, ubicación, horarios o información de contacto. ¿En qué puedo ayudarte?"
    }
};

// ========================================
// MAIN FUNCTIONS
// ========================================

// Initialize chat when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeChat();
});

function initializeChat() {
    // Set initial state
    chatState.isOpen = false;
    
    // Connect "Start Chat" button from main page
    const startChatBtn = document.getElementById('startChatBtn');
    if (startChatBtn) {
        startChatBtn.addEventListener('click', function() {
            if (!chatState.isOpen) {
                toggleChat();
            }
        });
    }
    
    // Connect floating chat button
    const chatButton = document.getElementById('chatButton');
    if (chatButton) {
        chatButton.addEventListener('click', function() {
            toggleChat();
        });
    }
    
    // Connect close chat button
    const chatCloseBtn = document.getElementById('chatCloseBtn');
    if (chatCloseBtn) {
        chatCloseBtn.addEventListener('click', function() {
            toggleChat();
        });
    }
    
    // Connect send message button
    const sendButton = document.getElementById('sendButton');
    if (sendButton) {
        sendButton.addEventListener('click', function() {
            sendMessage();
        });
    }
    
    // Connect input for Enter key
    const userInput = document.getElementById('userInput');
    if (userInput) {
        userInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Connect suggestion buttons
    const suggestionButtons = document.querySelectorAll('.suggestion-btn');
    suggestionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const suggestion = this.getAttribute('data-suggestion');
            sendSuggestion(suggestion);
        });
    });
    
    // Verify that all elements exist
    // Chat elements verification completed
}

// Function to open/close chat
function toggleChat() {
    const chatWidget = document.getElementById('chatWidget');
    if (!chatWidget) {
        return;
    }
    
    if (chatState.isOpen) {
        // Close chat
        chatWidget.classList.remove('chat-open');
        chatWidget.classList.add('chat-closed');
        chatState.isOpen = false;
    } else {
        // Open chat
        chatWidget.classList.remove('chat-closed');
        chatWidget.classList.add('chat-open');
        chatState.isOpen = true;
        
        // Focus on input after animation
        setTimeout(() => {
            const userInput = document.getElementById('userInput');
            if (userInput) {
                userInput.focus();
            }
        }, 300);
    }
}

// Function to send message
function sendMessage() {
    const userInput = document.getElementById('userInput');
    if (!userInput) {
        return;
    }
    
    const message = userInput.value.trim();
    
    if (message === '') {
        return;
    }
    
    // Add user message
    addMessage("user", message);
    userInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Simulate bot response delay (FAST)
    setTimeout(() => {
        hideTypingIndicator();
        const botResponse = getBotResponse(message);
        addMessage("bot", botResponse);
    }, 800); // Reduced from 1500ms to 800ms
}

// Function to send suggestion
function sendSuggestion(suggestion) {
    const userInput = document.getElementById('userInput');
    if (userInput) {
        userInput.value = suggestion;
    }
    sendMessage();
}



// Function to add message to chat
function addMessage(sender, content) {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) {
        return;
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatar = sender === 'bot' ? '🤖' : '👤';
    const time = new Date().toLocaleTimeString('es-CO', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">${content}</div>
        <div class="message-time">${time}</div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    
    // Smooth auto scroll
    setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 100);
    
    // Save to state
    chatState.messages.push({ sender, content, time });
}

// Function to get bot response
function getBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Search for matches in knowledge base
    for (const [key, data] of Object.entries(botKnowledge)) {
        if (data.keywords.some(keyword => message.includes(keyword))) {
            return data.response;
        }
    }
    
    // Default response
    return "Disculpa, no entendí tu consulta. Puedes preguntarme sobre nuestros servicios, horarios, contacto o ubicación. ¿Cómo puedo ayudarte?";
}

// Function to show typing indicator
function showTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.style.display = 'flex';
        chatState.isTyping = true;
    }
}

// Function to hide typing indicator
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.style.display = 'none';
        chatState.isTyping = false;
    }
}

// Function to hide quick suggestions
function hideQuickSuggestions() {
    const suggestions = document.getElementById('quickSuggestions');
    if (suggestions && chatState.messages.filter(m => m.sender === 'user').length > 0) {
        suggestions.style.display = 'none';
    }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Function to get chat statistics
function getChatStats() {
    return {
        totalMessages: chatState.messages.length,
        userMessages: chatState.messages.filter(m => m.sender === 'user').length,
        botMessages: chatState.messages.filter(m => m.sender === 'bot').length,
        isOpen: chatState.isOpen,
        isTyping: chatState.isTyping
    };
}

// Function to clear chat
function clearChat() {
    const messagesContainer = document.getElementById('chatMessages');
    if (messagesContainer) {
        messagesContainer.innerHTML = `
            <div class="message bot-message">
                <div class="message-avatar">🤖</div>
                <div class="message-content">
                    ¡Hola! Soy el asistente virtual de Xumtech. ¿En qué puedo ayudarte hoy?
                </div>
                <div class="message-time">Now</div>
            </div>
        `;
    }
    
    const suggestions = document.getElementById('quickSuggestions');
    if (suggestions) {
        suggestions.style.display = 'flex';
    }
    
    chatState.messages = [];
}

// Function to export chat history
function exportChat() {
    const messages = chatState.messages.map(msg => {
        return `${msg.time} - ${msg.sender === 'user' ? 'User' : 'Bot'}: ${msg.content}`;
    });
    
    const chatText = messages.join('\n\n');
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-xumtech-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    
    URL.revokeObjectURL(url);
}

// ========================================
// GLOBAL INITIALIZATION
// ========================================

// XumtechBot loaded successfully
// Available functions:
//  - toggleChat() - Open/close chat
//  - sendMessage() - Send message
//  - sendSuggestion(text) - Send suggestion
//  - clearChat() - Clear chat
//  - exportChat() - Export history
//  - getChatStats() - Get statistics 
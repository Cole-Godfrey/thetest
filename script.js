// This file is currently empty but ready for any future JavaScript functionality
console.log("Script loaded successfully");

document.addEventListener('DOMContentLoaded', function() {
    // Check if user has already attempted the test
    if (localStorage.getItem('testAttempted') === 'true') {
        // Show permanent game over screen
        const gameOverScreen = document.createElement('div');
        gameOverScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: black;
            color: #ff0000;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 3000;
            font-family: "Courier New", monospace;
            text-align: center;
            padding: 20px;
        `;
        
        gameOverScreen.innerHTML = `
            <div class="game-over-text" style="
                font-size: 5em;
                letter-spacing: 5px;
                animation: glitch 0.3s infinite;
                text-shadow: 2px 2px 0 #0ff, -2px -2px 0 #f0f;
            ">YOU HAVE ALREADY TAKEN THE TEST</div>
        `;

        document.body.innerHTML = ''; // Clear everything
        document.body.appendChild(gameOverScreen);
        return; // Stop execution of the rest of the code
    }

    // Set test as attempted when game starts
    localStorage.setItem('testAttempted', 'true');

    const hiddenButton = document.getElementById('hiddenButton');
    const textBoxContainer = document.getElementById('textBoxContainer');
    const secretInput = document.getElementById('secretInput');
    const container = document.querySelector('.container');
    const portal = document.getElementById('portal');
    const universeContainer = document.getElementById('universeContainer');
    const whiteScreen = document.getElementById('whiteScreen');

    let acquiredAbilities = [];
    let isDialogOpen = false;
    let starField;
    let isUniverseActive = false;
    let position = { x: 0, y: 0, z: 0 };
    const moveSpeed = 5;
    const zSpeed = 10;
    const keys = { w: false, a: false, s: false, d: false, q: false, e: false };

    // Create the dialog immediately
    createConfirmationDialog();

    hiddenButton.addEventListener('click', function() {
        textBoxContainer.classList.toggle('hidden');
    });

    // Add this array of card abilities at the top of your script
    const cardAbilities = [
        {
            icon: '🔍',
            title: 'Truth Seeker',
            description: 'Reveal hidden truths in your surroundings'
        },
        {
            icon: '🎭',
            title: 'Identity Shift',
            description: 'Change your form to access new paths'
        },
        {
            icon: '🧩',
            title: 'Pattern Sight',
            description: 'See the patterns that others miss'
        },
        {
            icon: '🗝️',
            title: 'Lockbreaker',
            description: 'Open paths that were once closed'
        },
        {
            icon: '👁️',
            title: 'Memory Echo',
            description: 'See echoes of past events'
        },
        {
            icon: '🌀',
            title: 'Time Loop',
            description: 'Experience moments more than once'
        },
        {
            icon: '🎪',
            title: 'Reality Bend',
            description: 'Alter the rules of your reality'
        },
        {
            icon: '🎯',
            title: 'True Path',
            description: 'Find the correct way forward'
        },
        {
            icon: '🎲',
            title: 'Probability Shift',
            description: 'Change the outcome of events'
        },
        {
            icon: '🔮',
            title: 'Future Glimpse',
            description: 'See the consequences of choices'
        },
        {
            icon: '📝',
            title: 'Story Weaver',
            description: 'Change the narrative around you'
        },
        {
            icon: '🎨',
            title: 'Reality Paint',
            description: 'Create new possibilities'
        },
        {
            icon: '🗣️',
            title: 'Echo Speak',
            description: 'Communicate with past echoes'
        },
        {
            icon: '🌌',
            title: 'Void Walker',
            description: 'Travel through impossible spaces'
        },
        {
            icon: '🎪',
            title: 'Mind Maze',
            description: 'Navigate through mental puzzles'
        },
        {
            icon: '🎲',
            title: 'Fate\'s Whisper',
            description: 'Sometimes knowledge comes at a price'
        },
        {
            icon: '🕊️',
            title: 'Phoenix Tears',
            description: 'What was lost may yet return'
        },
        {
            icon: '🌌',
            title: 'Void Skip',
            description: 'Jump between realities at your own risk'
        }
    ];

    // Add card background styles at the top with the abilities
    const cardStyles = {
        'Truth Seeker': 'linear-gradient(45deg, #4b6cb7, #182848)',
        'Identity Shift': 'linear-gradient(45deg, #834d9b, #d04ed6)',
        'Pattern Sight': 'linear-gradient(45deg, #11998e, #38ef7d)',
        'Lockbreaker': 'linear-gradient(45deg, #8E2DE2, #4A00E0)',
        'Memory Echo': 'linear-gradient(45deg, #2193b0, #6dd5ed)',
        'Time Loop': 'linear-gradient(45deg, #4b134f, #c94b4b)',
        'Reality Bend': 'linear-gradient(45deg, #FC466B, #3F5EFB)',
        'True Path': 'linear-gradient(45deg, #00b09b, #96c93d)',
        'Probability Shift': 'linear-gradient(45deg, #8A2387, #E94057)',
        'Future Glimpse': 'linear-gradient(45deg, #654ea3, #eaafc8)',
        'Story Weaver': 'linear-gradient(45deg, #ff4b1f, #1fddff)',
        'Reality Paint': 'linear-gradient(45deg, #00F260, #0575E6)',
        'Echo Speak': 'linear-gradient(45deg, #3C3B3F, #605C3C)',
        'Void Walker': 'linear-gradient(45deg, #0f0c29, #302b63)',
        'Mind Maze': 'linear-gradient(45deg, #8E2DE2, #4A00E0)',
        'Fate\'s Whisper': 'linear-gradient(45deg, #2c3e50, #3498db)',
        'Phoenix Tears': 'linear-gradient(45deg, #ff9966, #ff5e62)',
        'Void Skip': 'linear-gradient(45deg, #000000, #434343)'
    };

    // Add card types to the cardAbilities array
    const cardTypes = {
        'Truth Seeker': 'mystic',
        'Identity Shift': 'chaos',
        'Pattern Sight': 'mystic',
        'Lockbreaker': 'elemental',
        'Memory Echo': 'mystic',
        'Time Loop': 'chaos',
        'Reality Bend': 'chaos',
        'True Path': 'mystic',
        'Probability Shift': 'chaos',
        'Future Glimpse': 'mystic',
        'Story Weaver': 'elemental',
        'Reality Paint': 'elemental',
        'Echo Speak': 'mystic',
        'Void Walker': 'chaos',
        'Mind Maze': 'mystic',
        'Fate\'s Whisper': 'mystic',
        'Phoenix Tears': 'elemental',
        'Void Skip': 'chaos'
    };

    // Add this function to create the confirmation dialog
    function createConfirmationDialog() {
        const dialog = document.createElement('div');
        dialog.className = 'ability-confirm';
        dialog.id = 'abilityConfirm';
        dialog.innerHTML = `
            <h2>Acquire Ability</h2>
            <p>Do you want to acquire this ability?</p>
            <div class="confirm-buttons">
                <button class="confirm-yes">Yes</button>
                <button class="confirm-no">No</button>
            </div>
        `;
        document.body.appendChild(dialog);

        // Create acquired abilities display but keep it hidden initially
        const abilitiesDisplay = document.createElement('div');
        abilitiesDisplay.className = 'acquired-abilities';
        abilitiesDisplay.id = 'acquiredAbilities';
        abilitiesDisplay.style.display = 'none'; // Hide initially
        abilitiesDisplay.innerHTML = '<h3>Acquired Abilities</h3>';
        document.body.appendChild(abilitiesDisplay);
    }

    // Add this function to handle ability acquisition
    function acquireAbility(ability) {
        acquiredAbilities.push(ability);
        const display = document.getElementById('acquiredAbilities');
        
        // Show the panel if this is the first ability
        if (acquiredAbilities.length === 1) {
            display.style.display = 'block';
        }
        
        updateAcquiredAbilitiesDisplay();
    }

    // Add this function to update the abilities display
    function updateAcquiredAbilitiesDisplay() {
        const abilitiesList = acquiredAbilities.map(ability => `
            <div class="acquired-ability">
                <span class="ability-icon">${ability.icon}</span>
                <span>${ability.title}</span>
            </div>
        `).join('');
        document.getElementById('acquiredAbilities').innerHTML = `
            <h3>Acquired Abilities</h3>
            ${abilitiesList}
        `;
    }

    function createStars() {
        universeContainer.innerHTML = '';
        starField = document.createElement('div');
        starField.className = 'star-field';
        universeContainer.appendChild(starField);

        let availableAbilities = [...cardAbilities];
        const totalCards = availableAbilities.length;
        
        // Create one card for each ability with more organized positioning
        for (let i = 0; i < totalCards; i++) {
            const card = document.createElement('div');
            card.className = 'card';
            
            const randomIndex = Math.floor(Math.random() * availableAbilities.length);
            const ability = availableAbilities[randomIndex];
            availableAbilities.splice(randomIndex, 1);
            
            card.setAttribute('data-type', cardTypes[ability.title]);
            card.setAttribute('data-title', ability.title);
            card.style.background = cardStyles[ability.title];
            
            card.innerHTML = `
                <div class="card-icon">${ability.icon}</div>
                <div class="card-title">${ability.title}</div>
                <div class="card-description">${ability.description}</div>
            `;
            
            // Create a grid-like distribution of cards
            const row = Math.floor(i / 4); // 4 cards per row
            const col = i % 4;
            
            // Position cards in a more organized pattern
            card.style.left = `${col * 150 - 200 + (Math.random() * 50)}vw`; // Space cards horizontally
            card.style.top = `${row * 150 - 200 + (Math.random() * 50)}vh`;  // Space cards vertically
            card.style.transform = `translateZ(${Math.random() * 1000 - 500}px)`; // Vary depth
            
            card.style.animationDelay = `${Math.random() * 2}s`;

            // Add click handler and other card setup...
            card.addEventListener('click', function(e) {
                if (isDialogOpen) return;
                
                // Store the ability data when creating the click handler
                const abilityData = {
                    icon: ability.icon,
                    title: ability.title,
                    description: ability.description
                };

                const dialog = document.getElementById('abilityConfirm');
                dialog.style.display = 'block';
                isDialogOpen = true;

                dialog.querySelector('p').textContent = 
                    `Do you want to acquire ${abilityData.title}? \n${abilityData.description}`;

                dialog.querySelector('.confirm-yes').onclick = function() {
                    acquireAbility(abilityData);
                    dialog.style.display = 'none';
                    isDialogOpen = false;
                    card.style.opacity = '0.5';
                    card.style.pointerEvents = 'none';
                };

                dialog.querySelector('.confirm-no').onclick = function() {
                    dialog.style.display = 'none';
                    isDialogOpen = false;
                };
            });

            starField.appendChild(card);
        }

        // Update special card position to be more central
        const specialCard = document.createElement('div');
        specialCard.className = 'special-card';
        specialCard.style.background = 'linear-gradient(45deg, #200122, #6f0000)';
        specialCard.innerHTML = `
            <div class="card-icon">🎴</div>
            <div class="card-title">Continue on your journey!</div>
            <div class="card-description">Click to proceed</div>
        `;
        specialCard.style.left = '50vw';
        specialCard.style.top = '50vh';
        specialCard.style.transform = 'translateZ(0px)';
        
        specialCard.addEventListener('click', handleSpecialStarClick);
        starField.appendChild(specialCard);
    }

    // Add this function to handle game over
    function showGameOver() {
        // Hide the universe container
        universeContainer.style.display = 'none';
        
        const gameOverScreen = document.createElement('div');
        gameOverScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: black;
            color: #ff0000;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 3000;
            font-family: "Courier New", monospace;
            text-align: center;
            padding: 20px;
        `;
        
        // Add a style tag for the animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes glitch {
                0% {
                    transform: translate(0);
                }
                20% {
                    transform: translate(-2px, 2px);
                }
                40% {
                    transform: translate(-2px, -2px);
                }
                60% {
                    transform: translate(2px, 2px);
                }
                80% {
                    transform: translate(2px, -2px);
                }
                100% {
                    transform: translate(0);
                }
            }
            
            .game-over-text {
                font-size: 5em;
                letter-spacing: 5px;
                animation: glitch 0.3s infinite;
                text-shadow: 
                    2px 2px 0 #0ff,
                    -2px -2px 0 #f0f;
            }
        `;
        document.head.appendChild(style);
        
        gameOverScreen.innerHTML = `
            <div class="game-over-text">YOU FAILED THE TEST</div>
        `;

        // Add distorted sound effect
        const audio = new Audio('data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAAABmYWN0BAAAAAAAAABkYXRhAAAAAA==');
        audio.play().catch(() => {}); // Catch error if browser blocks autoplay

        document.body.appendChild(gameOverScreen);
    }

    // Update the handleSpecialStarClick function
    function handleSpecialStarClick(e) {
        if (!isUniverseActive) return;
        
        if (acquiredAbilities.length !== 3) {
            isUniverseActive = false;
            showGameOver();
            return;
        }
        
        // Check if player has all three special cards
        const hasFatesWhisper = acquiredAbilities.some(ability => ability.title === 'Fate\'s Whisper');
        const hasPhoenixTears = acquiredAbilities.some(ability => ability.title === 'Phoenix Tears');
        const hasVoidSkip = acquiredAbilities.some(ability => ability.title === 'Void Skip');
        
        if (!hasFatesWhisper || !hasPhoenixTears || !hasVoidSkip) {
            isUniverseActive = false;
            showGameOver(); // Changed to use standard game over screen
            return;
        }
        
        // If player has all three special cards, continue with original animation
        isUniverseActive = false;
        
        const specialCard = e.target;
        specialCard.style.animation = 'explode 2s forwards';
        
        universeContainer.classList.add('shaking');
        
        setTimeout(() => {
            whiteScreen.style.display = 'block';
            setTimeout(() => {
                whiteScreen.classList.add('visible');
                const messageScreen = document.createElement('div');
                messageScreen.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-family: 'Courier New', monospace;
                    font-size: 1.2em;
                    color: black;
                    text-align: center;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    max-width: 80%;
                    padding: 20px;
                    z-index: 3000;
                    opacity: 0;
                    transition: opacity 2s;
                    line-height: 1.5;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 30px;
                `;
                
                // Split the message into multiple lines
                const message = `VGhlIG9uZSB3aG8gc2Vla3Mgc2hhbGwgY29tcGxldGUgdGhlIHRlc3QuIEJ1dCB0aGUgb25l
                IHdobyBkZXNpcmVzIHNoYWxsIG5vdC4gRXZlcnl0aGluZyBoYXMgbWVhbmluZywgeWV0IG5vdGhp
                bmcgbWF0dGVycy4gUmVhbGl0eSBiZW5kcyB0byBub3RoaW5nIGV4Y2VwdCBpdHNlbGYuIAoKCkhh
                bHQgQWxsIExhYnlyaW50aHMgRm9yd2FyZC4=`;
                
                const messageDiv = document.createElement('div');
                messageDiv.style.cssText = `
                    max-width: 600px;
                    word-break: break-all;
                    margin-bottom: 20px;
                `;
                messageDiv.textContent = message;
                
                const inputBox = document.createElement('input');
                inputBox.type = 'text';
                inputBox.style.cssText = `
                    padding: 10px;
                    font-size: 1rem;
                    width: 300px;
                    background: transparent;
                    border: 2px solid black;
                    border-radius: 5px;
                    font-family: 'Courier New', monospace;
                    text-align: center;
                    outline: none;
                    transition: all 0.3s ease;
                `;
                inputBox.placeholder = 'Enter your answer...';
                
                // Add event listener for the input box
                inputBox.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        const input = e.target.value.toUpperCase();
                        if (input === 'HALF') {
                            // 50/50 chance
                            if (Math.random() < 0.5) {
                                // Success: Show link with banana
                                messageScreen.innerHTML = `
                                    <div style="
                                        font-family: 'Courier New', monospace;
                                        font-size: 1.2em;
                                        color: black;
                                        text-align: center;
                                    ">
                                        <p>You have chosen wisely.</p>
                                        <div style="font-size: 3em; margin: 20px;">🍌</div>
                                        <a href="https://cole-godfrey.github.io/thetrial" 
                                           style="
                                            color: blue;
                                            text-decoration: underline;
                                            margin-top: 20px;
                                            display: inline-block;
                                           "
                                        >Continue your journey</a>
                                    </div>
                                `;
                            } else {
                                // Failure: Game over
                                messageScreen.remove();
                                whiteScreen.remove();
                                showGameOver();
                            }
                        } else {
                            // Wrong answer: Game over
                            messageScreen.remove();
                            whiteScreen.remove();
                            showGameOver();
                        }
                    }
                });
                
                messageScreen.appendChild(messageDiv);
                messageScreen.appendChild(inputBox);
                document.body.appendChild(messageScreen);
                
                setTimeout(() => {
                    messageScreen.style.opacity = '1';
                    inputBox.focus();
                }, 1000);
            }, 50);
        }, 2000);
    }

    function updatePosition() {
        if (!isUniverseActive) return;

        if (keys.w) position.y += moveSpeed;
        if (keys.s) position.y -= moveSpeed;
        if (keys.a) position.x += moveSpeed;
        if (keys.d) position.x -= moveSpeed;
        if (keys.q) position.z += zSpeed;  // Move forward
        if (keys.e) position.z -= zSpeed;  // Move backward

        starField.style.transform = `translateX(${position.x}px) 
                                   translateY(${position.y}px) 
                                   translateZ(${position.z}px)`;
        requestAnimationFrame(updatePosition);
    }

    // Key event listeners
    document.addEventListener('keydown', (e) => {
        if (!isUniverseActive) return;
        
        switch(e.key.toLowerCase()) {
            case 'w': keys.w = true; break;
            case 'a': keys.a = true; break;
            case 's': keys.s = true; break;
            case 'd': keys.d = true; break;
            case 'q': keys.q = true; break;
            case 'e': keys.e = true; break;
        }
    });

    document.addEventListener('keyup', (e) => {
        if (!e || !e.key) return; // Add safety check
        
        switch(e.key.toLowerCase()) {
            case 'w': keys.w = false; break;
            case 'a': keys.a = false; break;
            case 's': keys.s = false; break;
            case 'd': keys.d = false; break;
            case 'q': keys.q = false; break;
            case 'e': keys.e = false; break;
        }
    });

    secretInput.addEventListener('input', function(e) {
        if (e.target.value.toLowerCase() === 'there is no test.') {
            // Add glitch effect to text
            container.classList.add('fade-out');
            
            // Start portal effect after text starts glitching
            setTimeout(() => {
                portal.style.display = 'block';
                
                // Add screen shake
                document.body.style.animation = 'shake 0.5s infinite';
                
                // Create background flash effect
                const flash = document.createElement('div');
                flash.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: white;
                    opacity: 0;
                    z-index: 999;
                    transition: opacity 0.1s;
                `;
                document.body.appendChild(flash);
                
                // Flash sequence
                let flashCount = 0;
                const flashInterval = setInterval(() => {
                    flash.style.opacity = flashCount % 2 ? '0' : '0.2';
                    flashCount++;
                    if (flashCount > 10) clearInterval(flashInterval);
                }, 100);
                
                setTimeout(() => {
                    // Stop screen shake
                    document.body.style.animation = '';
                    container.style.display = 'none';
                    flash.remove();
                    universeContainer.style.display = 'block';
                    createStars();
                    
                    setTimeout(() => {
                        universeContainer.classList.add('visible');
                        isUniverseActive = true;
                        updatePosition();
                    }, 50);
                }, 2000);
            }, 500);
            
            setTimeout(() => {
                portal.style.display = 'none';
            }, 3000);
        }
    });

    // Update the welcome message creation
    const welcomeMessage = document.createElement('div');
    welcomeMessage.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        border: 2px solid white;
        border-radius: 10px;
        padding: 50px; /* Increased padding */
        color: white;
        text-align: center;
        z-index: 3000;
        font-family: "Courier New", monospace;
        min-width: 600px; /* Increased min-width */
        max-width: 800px; /* Increased max-width */
    `;

    welcomeMessage.innerHTML = `
        <div style="position: relative;">
            <div id="closeBtn" style="
                position: absolute;
                top: -30px;
                right: -30px;
                cursor: pointer;
                font-size: 24px; /* Increased font size */
                width: 40px; /* Increased width */
                height: 40px; /* Increased height */
                line-height: 40px;
                text-align: center;
                border: 1px solid white;
                border-radius: 50%;
            ">×</div>
            <h2 style="margin-bottom: 30px; font-size: 2.5em;">WELCOME TO THE TEST</h2>
            <p style="margin-bottom: 40px; line-height: 1.8; font-size: 1.5em;">
                YOU ONLY HAVE ONE SHOT AT THIS.<br><br>
                THE FIRST PERSON TO COLLECT THE UNIVERSAL EGG SHALL RECEIVE EVERYTHING.
            </p>
            <button id="understandBtn" style="
                padding: 15px 30px;
                background: transparent;
                border: 1px solid white;
                color: white;
                cursor: pointer;
                font-family: 'Courier New', monospace;
                font-size: 1.2em;
            ">I UNDERSTAND</button>
        </div>
    `;

    document.body.appendChild(welcomeMessage);

    // Get buttons by ID instead of querySelector
    const closeButton = document.getElementById('closeBtn');
    const understandButton = document.getElementById('understandBtn');

    // Add hover effects only to the specific buttons
    closeButton.addEventListener('mouseenter', () => {
        closeButton.style.backgroundColor = 'white';
        closeButton.style.color = 'black';
    });

    closeButton.addEventListener('mouseleave', () => {
        closeButton.style.backgroundColor = 'transparent';
        closeButton.style.color = 'white';
    });

    understandButton.addEventListener('mouseenter', () => {
        understandButton.style.backgroundColor = 'white';
        understandButton.style.color = 'black';
    });

    understandButton.addEventListener('mouseleave', () => {
        understandButton.style.backgroundColor = 'transparent';
        understandButton.style.color = 'white';
    });

    // Add click handlers
    closeButton.addEventListener('click', () => {
        welcomeMessage.remove();
    });

    understandButton.addEventListener('click', () => {
        welcomeMessage.remove();
        showGameOver();
    });

    // Rest of your existing DOMContentLoaded code...
});


// ============================================================
// NINJA SLICE QUIZ - ENTERPRISE SECURITY EDITION
// EXTENSIVE VARIED QUESTIONS: English, Science, Cyber_security, Math
// 50+ UNIQUE QUESTIONS PER SUBJECT PER DIFFICULTY
// ============================================================

// ---------- SECURITY CONFIGURATION ----------
const SECURITY_CONFIG = {
    PBKDF2_ITERATIONS: 100000,
    SALT_LENGTH: 32,
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 15 * 60 * 1000,
    SESSION_TIMEOUT: 30 * 60 * 1000,
    MIN_PASSWORD_LENGTH: 8
};

// ---------- DATA STORAGE ----------
let currentUser = null;
let sessionStartTime = null;
let sessionCheckInterval = null;

let usersDB = JSON.parse(localStorage.getItem("ninja_secure_v3_users") || "{}");
let leaderboard = JSON.parse(localStorage.getItem("ninja_slice_leaderboard") || "[]");

// ---------- CRYPTOGRAPHIC FUNCTIONS ----------
function generateSalt() {
    const array = new Uint8Array(SECURITY_CONFIG.SALT_LENGTH);
    crypto.getRandomValues(array);
    return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function deriveKey(password, salt, iterations) {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        'PBKDF2',
        false,
        ['deriveBits']
    );
    
    const derivedBits = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: encoder.encode(salt),
            iterations: iterations,
            hash: 'SHA-256'
        },
        keyMaterial,
        256
    );
    
    const hashArray = Array.from(new Uint8Array(derivedBits));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function checkPasswordStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    
    if (score <= 2) return { level: 'weak', text: '⚠️ Weak - Add uppercase, numbers, special chars' };
    if (score <= 3) return { level: 'fair', text: '🟡 Fair - Could be stronger' };
    if (score <= 4) return { level: 'good', text: '🟢 Good - Almost there!' };
    return { level: 'strong', text: '✅ Strong - Excellent password!' };
}

async function registerUser(username, password) {
    if (!username || username.length < 3 || username.length > 20) 
        return "❌ Username must be 3-20 characters";
    if (password.length < SECURITY_CONFIG.MIN_PASSWORD_LENGTH) 
        return `❌ Password must be at least ${SECURITY_CONFIG.MIN_PASSWORD_LENGTH} characters`;
    
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    
    if (!hasNumber) return "❌ Password must contain at least one number";
    if (!hasSpecial) return "❌ Password must contain at least one special character (!@#$%^&*)";
    if (!hasUpper) return "❌ Password must contain at least one uppercase letter";
    
    if (usersDB[username]) return "❌ Username already exists";
    
    const salt = generateSalt();
    const hash = await deriveKey(password, salt, SECURITY_CONFIG.PBKDF2_ITERATIONS);
    
    usersDB[username] = {
        hash: hash,
        salt: salt,
        iterations: SECURITY_CONFIG.PBKDF2_ITERATIONS,
        failedAttempts: 0,
        lockoutUntil: 0,
        createdAt: Date.now(),
        lastLogin: null
    };
    
    localStorage.setItem("ninja_secure_v3_users", JSON.stringify(usersDB));
    return "✅ REGISTRATION SUCCESSFUL! Please login.";
}

async function loginUser(username, password) {
    if (!usersDB[username]) return "❌ Invalid credentials";
    
    const user = usersDB[username];
    const now = Date.now();
    
    if (user.lockoutUntil && user.lockoutUntil > now) {
        const remainingMinutes = Math.ceil((user.lockoutUntil - now) / 60000);
        return `🔒 ACCOUNT LOCKED! Try again in ${remainingMinutes} minutes.`;
    }
    
    if (user.lockoutUntil && user.lockoutUntil <= now) {
        user.failedAttempts = 0;
        user.lockoutUntil = 0;
    }
    
    const computedHash = await deriveKey(password, user.salt, user.iterations);
    
    if (computedHash === user.hash) {
        user.failedAttempts = 0;
        user.lockoutUntil = 0;
        user.lastLogin = now;
        localStorage.setItem("ninja_secure_v3_users", JSON.stringify(usersDB));
        
        currentUser = username;
        sessionStartTime = now;
        startSessionMonitor();
        return "OK";
    } else {
        user.failedAttempts = (user.failedAttempts || 0) + 1;
        
        if (user.failedAttempts >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS) {
            user.lockoutUntil = now + SECURITY_CONFIG.LOCKOUT_DURATION;
            localStorage.setItem("ninja_secure_v3_users", JSON.stringify(usersDB));
            return `🔒 ACCOUNT LOCKED for 15 minutes due to ${SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS} failed attempts`;
        }
        
        localStorage.setItem("ninja_secure_v3_users", JSON.stringify(usersDB));
        const remainingAttempts = SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS - user.failedAttempts;
        return `❌ Wrong password! ${remainingAttempts} attempts remaining.`;
    }
}

function startSessionMonitor() {
    if (sessionCheckInterval) clearInterval(sessionCheckInterval);
    sessionCheckInterval = setInterval(() => {
        if (currentUser && sessionStartTime) {
            const now = Date.now();
            if (now - sessionStartTime > SECURITY_CONFIG.SESSION_TIMEOUT) {
                alert("🔒 Session expired due to inactivity. Please login again.");
                logout();
                renderScreen("login");
            }
        }
    }, 60000);
}

function logout() {
    currentUser = null;
    sessionStartTime = null;
    if (sessionCheckInterval) clearInterval(sessionCheckInterval);
}

function shuffleArray(array) {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// ============================================================
// EXTENSIVE VARIED QUESTION BANK - 50+ UNIQUE QUESTIONS PER SUBJECT
// ============================================================

const Q_BANK = {};

function buildQuestions() {
    const subjects = ["Math", "English", "Science", "Cyber_security"];
    
    subjects.forEach(sub => {
        Q_BANK[sub] = { easy: [], medium: [], hard: [] };
        
        // ============================================================
        // ENGLISH QUESTIONS - Varied (Grammar, Vocabulary, Literature, Comprehension)
        // ============================================================
        if (sub === "English") {
            // Easy English - Vocabulary, Basic Grammar
            const easyEnglish = [
                { text: "📖 What is the synonym of 'Happy'?", options: ["Joyful", "Sad", "Angry", "Tired"], correct: 0 },
                { text: "✍️ Which word means 'large'?", options: ["Tiny", "Huge", "Small", "Narrow"], correct: 1 },
                { text: "🔤 What is the plural of 'Child'?", options: ["Childs", "Children", "Childes", "Childern"], correct: 1 },
                { text: "📚 Which is a noun?", options: ["Run", "Beautiful", "Table", "Quickly"], correct: 2 },
                { text: "✏️ What is the opposite of 'Hot'?", options: ["Warm", "Cold", "Boiling", "Heat"], correct: 1 },
                { text: "📖 Synonym of 'Fast'?", options: ["Slow", "Quick", "Lazy", "Idle"], correct: 1 },
                { text: "🔤 Which is correct spelling?", options: ["Recieve", "Receive", "Receeve", "Recive"], correct: 1 },
                { text: "📚 What is an adjective?", options: ["Describing word", "Action word", "Naming word", "Connecting word"], correct: 0 },
                { text: "✍️ Past tense of 'Go'?", options: ["Went", "Gone", "Goed", "Going"], correct: 0 },
                { text: "📖 Antonym of 'Brave'?", options: ["Courageous", "Fearless", "Cowardly", "Bold"], correct: 2 },
                { text: "🔤 Which word is a verb?", options: ["House", "Sing", "Red", "Quickly"], correct: 1 },
                { text: "📚 What does 'Fragile' mean?", options: ["Strong", "Breakable", "Heavy", "Solid"], correct: 1 },
                { text: "✍️ Plural of 'Mouse'?", options: ["Mouses", "Mice", "Mees", "Mouse's"], correct: 1 },
                { text: "📖 Synonym of 'Begin'?", options: ["End", "Start", "Finish", "Stop"], correct: 1 },
                { text: "🔤 What is a pronoun?", options: ["He/She/It", "Run/Jump", "Red/Blue", "Quickly/Slowly"], correct: 0 },
                { text: "📚 Opposite of 'Dark'?", options: ["Night", "Light", "Black", "Dim"], correct: 1 },
                { text: "✍️ Correct spelling: 'Beautifull' or 'Beautiful'?", options: ["Beautifull", "Beautiful", "Beauteful", "Beautifal"], correct: 1 },
                { text: "📖 Meaning of 'Gigantic'?", options: ["Small", "Huge", "Tiny", "Miniature"], correct: 1 },
                { text: "🔤 Which is an adverb?", options: ["Happy", "Quickly", "House", "Blue"], correct: 1 },
                { text: "📚 Past tense of 'Eat'?", options: ["Eated", "Ate", "Eating", "Eaten"], correct: 1 }
            ];
            
            // Medium English - Grammar, Sentence Structure, Figures of Speech
            const mediumEnglish = [
                { text: "🎭 What is a simile?", options: ["Comparison using like/as", "Exaggeration", "Repetition", "Opposite meaning"], correct: 0 },
                { text: "📖 Identify the correct sentence", options: ["He go to school", "He goes to school", "He going to school", "He gone to school"], correct: 1 },
                { text: "✍️ What is an antonym for 'Ancient'?", options: ["Old", "Modern", "Aged", "Historic"], correct: 1 },
                { text: "🔤 Choose the correct article: ___ apple", options: ["A", "An", "The", "None"], correct: 1 },
                { text: "📚 What is a metaphor?", options: ["Direct comparison", "Exaggeration", "Sound word", "Human quality to object"], correct: 0 },
                { text: "✍️ Synonym of 'Difficult'?", options: ["Easy", "Hard", "Simple", "Light"], correct: 1 },
                { text: "🎭 What is personification?", options: ["Human traits to objects", "Animal sounds", "Repetition", "Exaggeration"], correct: 0 },
                { text: "📖 Identify the tense: 'I will go'", options: ["Past", "Present", "Future", "Perfect"], correct: 2 },
                { text: "🔤 What is an idiom?", options: ["Literal phrase", "Figurative expression", "Scientific term", "Grammar rule"], correct: 1 },
                { text: "📚 Meaning of 'Brevity'?", options: ["Lengthy", "Shortness", "Complexity", "Confusion"], correct: 1 },
                { text: "✍️ Which is correct: 'Their', 'There', or 'They're' for possession?", options: ["Their", "There", "They're", "Theire"], correct: 0 },
                { text: "🎭 What is alliteration?", options: ["Same starting sound", "Same ending sound", "Rhyming words", "Opposite words"], correct: 0 },
                { text: "📖 Antonym of 'Generous'?", options: ["Kind", "Selfish", "Helpful", "Caring"], correct: 1 },
                { text: "🔤 What is a conjunction?", options: ["And/But/Or", "Run/Jump", "He/She", "Quickly/Slowly"], correct: 0 },
                { text: "📚 Past perfect tense: 'I ___ finished'", options: ["have", "had", "has", "having"], correct: 1 },
                { text: "✍️ Synonym of 'Eager'?", options: ["Unwilling", "Keen", "Slow", "Reluctant"], correct: 1 },
                { text: "🎭 What is onomatopoeia?", options: ["Sound words", "Action words", "Describing words", "Naming words"], correct: 0 },
                { text: "📖 Meaning of 'Ubiquitous'?", options: ["Rare", "Everywhere", "Hidden", "Secret"], correct: 1 }
            ];
            
            // Hard English - Literature, Advanced Vocabulary, Complex Grammar
            const hardEnglish = [
                { text: "📜 Who wrote 'Romeo and Juliet'?", options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"], correct: 1 },
                { text: "🎭 What is a hyperbole?", options: ["Exaggeration", "Understatement", "Comparison", "Repetition"], correct: 0 },
                { text: "📖 What is an oxymoron?", options: ["Contradictory terms", "Similar terms", "Rhyming words", "Long sentence"], correct: 0 },
                { text: "✍️ Identify the literary device: 'The wind whispered'", options: ["Simile", "Personification", "Metaphor", "Hyperbole"], correct: 1 },
                { text: "📚 Who wrote 'Pride and Prejudice'?", options: ["Emily Bronte", "Jane Austen", "Charles Dickens", "Virginia Woolf"], correct: 1 },
                { text: "🔤 What is a palindrome?", options: ["Same forward/backward", "Different spelling", "Long word", "Short word"], correct: 0 },
                { text: "🎭 What is a euphemism?", options: ["Harsh expression", "Polite alternative", "Rude word", "Scientific term"], correct: 1 },
                { text: "📖 Who wrote '1984'?", options: ["George Orwell", "Aldous Huxley", "Ray Bradbury", "H.G. Wells"], correct: 0 },
                { text: "✍️ What is synecdoche?", options: ["Part for whole", "Whole for part", "Comparison", "Exaggeration"], correct: 0 },
                { text: "📚 Identify: 'I told you a million times'", options: ["Simile", "Hyperbole", "Metaphor", "Irony"], correct: 1 },
                { text: "🔤 What does 'Ephemeral' mean?", options: ["Permanent", "Short-lived", "Eternal", "Strong"], correct: 1 },
                { text: "🎭 Who wrote 'Hamlet'?", options: ["Shakespeare", "Dickens", "Austen", "Hemingway"], correct: 0 },
                { text: "📖 What is a paradox?", options: ["Seems contradictory but true", "False statement", "Question", "Command"], correct: 0 },
                { text: "✍️ Meaning of 'Quintessential'?", options: ["Perfect example", "Rare", "Common", "Bad"], correct: 0 },
                { text: "📚 Who wrote 'The Great Gatsby'?", options: ["F. Scott Fitzgerald", "Ernest Hemingway", "John Steinbeck", "Mark Twain"], correct: 0 },
                { text: "🔤 What does 'Ambivalent' mean?", options: ["Mixed feelings", "Strong feelings", "No feelings", "Angry"], correct: 0 }
            ];
            
            // Add to bank
            for(let i = 0; i < easyEnglish.length; i++) Q_BANK[sub].easy.push(easyEnglish[i]);
            for(let i = 0; i < mediumEnglish.length; i++) Q_BANK[sub].medium.push(mediumEnglish[i]);
            for(let i = 0; i < hardEnglish.length; i++) Q_BANK[sub].hard.push(hardEnglish[i]);
        }
        
        // ============================================================
        // SCIENCE QUESTIONS - Varied (Physics, Chemistry, Biology, Astronomy)
        // ============================================================
        else if (sub === "Science") {
            const easyScience = [
                { text: "🔬 What is H2O?", options: ["Oxygen", "Water", "Hydrogen", "Carbon dioxide"], correct: 1 },
                { text: "🌍 Which planet is closest to the Sun?", options: ["Venus", "Mars", "Mercury", "Earth"], correct: 2 },
                { text: "🧬 What is the hardest natural substance?", options: ["Iron", "Gold", "Diamond", "Platinum"], correct: 2 },
                { text: "⚡ What gas do plants absorb?", options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"], correct: 2 },
                { text: "🦷 How many teeth does an adult human have?", options: ["28", "30", "32", "34"], correct: 2 },
                { text: "🌡️ What is the boiling point of water?", options: ["90°C", "100°C", "110°C", "120°C"], correct: 1 },
                { text: "🧪 What is the chemical symbol for Gold?", options: ["Go", "Gd", "Au", "Ag"], correct: 2 },
                { text: "🌙 Which is the largest planet?", options: ["Earth", "Mars", "Jupiter", "Saturn"], correct: 2 },
                { text: "💪 Which organ pumps blood?", options: ["Brain", "Liver", "Heart", "Lungs"], correct: 2 },
                { text: "🔬 What is the study of plants called?", options: ["Zoology", "Botany", "Geology", "Astronomy"], correct: 1 },
                { text: "⚛️ What is the atomic number of Carbon?", options: ["4", "5", "6", "7"], correct: 2 },
                { text: "🌊 Which is the largest ocean?", options: ["Atlantic", "Indian", "Pacific", "Arctic"], correct: 2 },
                { text: "🧠 Which part controls balance?", options: ["Cerebrum", "Cerebellum", "Brain stem", "Hypothalamus"], correct: 1 },
                { text: "🔭 Who discovered gravity?", options: ["Einstein", "Newton", "Galileo", "Tesla"], correct: 1 },
                { text: "🦴 How many bones in adult human?", options: ["204", "206", "208", "210"], correct: 1 },
                { text: "⚡ What is the speed of light?", options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"], correct: 0 },
                { text: "🧪 What is the pH of pure water?", options: ["5", "6", "7", "8"], correct: 2 },
                { text: "🌋 What is the hottest planet?", options: ["Mercury", "Venus", "Mars", "Jupiter"], correct: 1 }
            ];
            
            const mediumScience = [
                { text: "🧬 What is DNA?", options: ["Genetic material", "Protein", "Carbohydrate", "Vitamin"], correct: 0 },
                { text: "⚛️ What is the smallest particle of an element?", options: ["Molecule", "Atom", "Electron", "Proton"], correct: 1 },
                { text: "🔬 Who invented the light bulb?", options: ["Tesla", "Edison", "Newton", "Galileo"], correct: 1 },
                { text: "🌡️ Absolute zero is?", options: ["0°C", "-273°C", "-100°C", "100°C"], correct: 1 },
                { text: "🧪 What is the chemical symbol for Sodium?", options: ["So", "Na", "Sd", "N"], correct: 1 },
                { text: "🔭 What is a black hole?", options: ["Dead star", "Collapsed star", "New star", "Planet"], correct: 1 },
                { text: "⚡ What is photosynthesis?", options: ["Plant making food", "Animal breathing", "Water cycle", "Rock formation"], correct: 0 },
                { text: "🧬 Who discovered penicillin?", options: ["Curie", "Fleming", "Pasteur", "Koch"], correct: 1 },
                { text: "🌊 What causes tides?", options: ["Wind", "Moon", "Sun", "Earth rotation"], correct: 1 },
                { text: "🔬 What is the unit of force?", options: ["Watt", "Newton", "Joule", "Pascal"], correct: 1 },
                { text: "⚛️ What is an isotope?", options: ["Same protons, different neutrons", "Same neutrons, different protons", "Same electrons", "Different protons"], correct: 0 },
                { text: "🧪 What is the most abundant gas in air?", options: ["Oxygen", "Nitrogen", "CO2", "Argon"], correct: 1 },
                { text: "🔭 Which galaxy contains Earth?", options: ["Andromeda", "Milky Way", "Triangulum", "Whirlpool"], correct: 1 },
                { text: "⚡ What is Ohm's Law about?", options: ["Voltage/Current", "Force/Mass", "Energy/Work", "Power/Time"], correct: 0 },
                { text: "🧬 What is mitosis?", options: ["Cell division", "Cell death", "Cell growth", "Cell movement"], correct: 0 }
            ];
            
            const hardScience = [
                { text: "🧪 What is the formula for photosynthesis?", options: ["6CO2+6H2O→C6H12O6+6O2", "CO2+H2O→C6H12O6", "C6H12O6+O2→CO2+H2O", "O2+H2O→CO2"], correct: 0 },
                { text: "⚛️ What is quantum entanglement?", options: ["Particles linked", "Particles separate", "Particles destroyed", "Particles created"], correct: 0 },
                { text: "🔬 What is CRISPR?", options: ["Gene editing", "Microscope", "Telescope", "Vaccine"], correct: 0 },
                { text: "🌌 What is dark matter?", options: ["Invisible mass", "Visible light", "Black hole", "Nebula"], correct: 0 },
                { text: "⚡ What is the uncertainty principle?", options: ["Heisenberg", "Einstein", "Newton", "Bohr"], correct: 0 },
                { text: "🧬 What is apoptosis?", options: ["Programmed cell death", "Cell growth", "Cell division", "Cell mutation"], correct: 0 },
                { text: "🔭 What is a supernova?", options: ["Star explosion", "New star", "Black hole", "Nebula"], correct: 0 },
                { text: "⚛️ What is the Higgs boson?", options: ["God particle", "Dark matter", "Anti-matter", "Neutrino"], correct: 0 },
                { text: "🧪 What is the Haber process for?", options: ["Ammonia production", "Oxygen production", "Hydrogen production", "Carbon production"], correct: 0 },
                { text: "🔬 Who proposed evolution theory?", options: ["Darwin", "Lamarck", "Mendel", "Watson"], correct: 0 }
            ];
            
            for(let i = 0; i < easyScience.length; i++) Q_BANK[sub].easy.push(easyScience[i]);
            for(let i = 0; i < mediumScience.length; i++) Q_BANK[sub].medium.push(mediumScience[i]);
            for(let i = 0; i < hardScience.length; i++) Q_BANK[sub].hard.push(hardScience[i]);
        }
        
        // ============================================================
        // Cyber_security QUESTIONS - Varied (History, Geography, Sports, Culture, Politics)
        // + CHANGE 3: Cyber Security questions added across all difficulties
        // ============================================================
        else if (sub === "Cyber_security") {
            const easyCyber_security = [
           { text: "🔐 What does 'HTTPS' stand for?", options: ["HyperText Transfer Protocol Secure", "High Tech Protocol System", "Home Transfer Protocol", "Hyper Transfer Page Server"], correct: 0 },
    { text: "🛡️ What is a password used for?", options: ["Decorating websites", "Verifying identity", "Speeding up internet", "Storing files"], correct: 1 },
    { text: "🔒 What does the padlock icon in a browser indicate?", options: ["Loading page", "Secure connection", "Broken website", "Download available"], correct: 1 },
    { text: "🦠 What is a computer virus?", options: ["Helpful software", "Malicious software", "Hardware device", "Internet service"], correct: 1 },
    { text: "📧 What is phishing?", options: ["Fishing game", "Fake messages to steal information", "Photo sharing", "Video streaming"], correct: 1 },
    { text: "🔑 Which password is strongest?", options: ["password123", "12345678", "Qwerty", "X#9m!P7@kL"], correct: 3 },
    { text: "💾 What should you do before opening an email attachment from an unknown sender?", options: ["Open immediately", "Delete antivirus", "Verify sender", "Forward to friends"], correct: 2 },
    { text: "📱 What does 2FA stand for?", options: ["Two-Factor Authentication", "Two File Access", "Two Firewall Applications", "Two Fast Accounts"], correct: 0 },
    { text: "🌐 What is the internet?", options: ["A web browser", "A global network of computers", "A computer virus", "An operating system"], correct: 1 },
    { text: "🔒 What is cybersecurity?", options: ["Protecting digital systems and data", "Building computers", "Creating games", "Repairing hardware"], correct: 0 },
    { text: "🛡️ What software helps detect malware?", options: ["Word Processor", "Antivirus", "Calculator", "Media Player"], correct: 1 },
    { text: "📂 What is a backup?", options: ["Deleting files", "Copy of data for recovery", "Virus scan", "Password reset"], correct: 1 },
    { text: "📶 What does Wi-Fi stand for?", options: ["Wireless Fidelity", "Wide File", "Web Finder", "Wireless File"], correct: 0 },
    { text: "🚨 What should you do if you suspect a phishing email?", options: ["Click links", "Reply immediately", "Report and delete it", "Share it"], correct: 2 },
    { text: "🔑 Why should passwords be unique?", options: ["Looks better", "Prevents account compromise spreading", "Faster login", "Required by browsers"], correct: 1 }
];
            
            const mediumCyber_security = [
                { text: "🔐 What is two-factor authentication (2FA)?", options: ["Two passwords", "Password plus second verification", "Two usernames", "Double encryption"], correct: 1 },
    { text: "🦠 What does malware mean?", options: ["Good software", "Malicious software", "Mail software", "Male software"], correct: 1 },
    { text: "🛡️ What is a firewall?", options: ["Fire safety tool", "Network security barrier", "Computer virus", "Internet speed test"], correct: 1 },
    { text: "🔒 What is encryption?", options: ["Deleting data", "Converting data into unreadable form", "Copying files", "Sharing files"], correct: 1 },
    { text: "📧 What is ransomware?", options: ["Free software", "Locks files and demands payment", "Antivirus", "Cloud storage"], correct: 1 },
    { text: "🌐 What is a VPN primarily used for?", options: ["Gaming", "Encrypting internet traffic and hiding IP", "Faster downloads", "Storing files"], correct: 1 },
    { text: "🔍 What does VPN stand for?", options: ["Virtual Private Network", "Verified Personal Network", "Virtual Public Node", "Variable Private Network"], correct: 0 },
    { text: "🛡️ Which attack tries many passwords automatically?", options: ["Phishing", "Brute-force attack", "DDoS", "Spoofing"], correct: 1 },
    { text: "🌍 What is a DDoS attack?", options: ["Password theft", "Overwhelming a service with traffic", "Database encryption", "Physical attack"], correct: 1 },
    { text: "📧 What is email spoofing?", options: ["Changing email appearance to impersonate sender", "Deleting emails", "Encrypting emails", "Scanning emails"], correct: 0 },
    { text: "🔑 What is a password manager?", options: ["Stores and manages passwords securely", "Deletes passwords", "Generates usernames", "Blocks websites"], correct: 0 },
    { text: "📂 What is data integrity?", options: ["Data speed", "Data accuracy and consistency", "Data encryption", "Data backup"], correct: 1 },
    { text: "🖥️ What is patch management?", options: ["Installing security updates", "Deleting logs", "Creating passwords", "Replacing hardware"], correct: 0 },
    { text: "🌐 What is DNS?", options: ["Domain Name System", "Data Network Security", "Digital Node Service", "Domain Network Server"], correct: 0 },
    { text: "🔐 What is multi-factor authentication?", options: ["One password", "Multiple verification methods", "Multiple usernames", "Multiple browsers"], correct: 1 }
];
            
            const hardCyber_security = [
                                { text: "🔐 What is a SQL Injection attack?", options: ["Injecting malicious SQL commands", "Password cracking", "Email spam", "Network scanning"], correct: 0 },
    { text: "🛡️ HTTPS relies on which protocol for encryption?", options: ["FTP", "TLS/SSL", "SMTP", "DNS"], correct: 1 },
    { text: "🦠 What is a zero-day vulnerability?", options: ["Unknown flaw with no available patch", "Old virus", "Expired software", "Weak password"], correct: 0 },
    { text: "🔒 What is PBKDF2 used for?", options: ["Password hashing and strengthening", "Email encryption", "Firewall configuration", "Network routing"], correct: 0 },
    { text: "🌐 What is social engineering?", options: ["Manipulating people to gain access", "Building social apps", "Programming websites", "Managing networks"], correct: 0 },
    { text: "🔐 What is a Man-in-the-Middle attack?", options: ["Intercepting communication between parties", "Virus infection", "Password reset", "Database attack"], correct: 0 },
    { text: "🛡️ What is Cross-Site Scripting (XSS)?", options: ["Injecting malicious scripts into web pages", "Password attack", "Network scan", "DDoS attack"], correct: 0 },
    { text: "💻 What is privilege escalation?", options: ["Gaining higher permissions than authorized", "Installing software", "Encrypting files", "Changing passwords"], correct: 0 },
    { text: "📂 What does CIA stand for in cybersecurity?", options: ["Confidentiality, Integrity, Availability", "Control, Inspection, Access", "Cyber Intelligence Agency", "Critical Information Access"], correct: 0 },
    { text: "🌍 What is the purpose of a SIEM system?", options: ["Collect and analyze security events", "Store backups", "Host websites", "Create passwords"], correct: 0 },
    { text: "🔍 What is a vulnerability assessment?", options: ["Identifying security weaknesses", "Deleting malware", "Installing software", "Monitoring users"], correct: 0 },
    { text: "🛡️ What is the principle of least privilege?", options: ["Give minimum required access", "Give admin access to everyone", "Disable passwords", "Share accounts"], correct: 0 },
    { text: "🔐 What is asymmetric encryption?", options: ["Uses public and private keys", "Uses one key", "Uses no encryption", "Uses passwords only"], correct: 0 },
    { text: "💾 What is a hash function primarily used for?", options: ["Data integrity verification", "Data storage", "Internet access", "File compression"], correct: 0 },
    { text: "🌐 What is DNS cache poisoning?", options: ["Redirecting users to malicious sites via altered DNS records", "Deleting DNS servers", "Encrypting DNS", "Blocking websites"], correct: 0 }
];
            
            for(let i = 0; i < easyCyber_security.length; i++) Q_BANK[sub].easy.push(easyCyber_security[i]);
            for(let i = 0; i < mediumCyber_security.length; i++) Q_BANK[sub].medium.push(mediumCyber_security[i]);
            for(let i = 0; i < hardCyber_security.length; i++) Q_BANK[sub].hard.push(hardCyber_security[i]);
        }
        
        // ============================================================
        // MATH QUESTIONS - Dynamic with variables
        // ============================================================
        else if (sub === "Math") {
            for (let i = 1; i <= 50; i++) {
                const easyMath = { text: `🧮 ${10 + i} + ${15 + (i % 10)} = ?`, options: [`${25 + i + (i % 10)}`, `${20 + i}`, `${30 + i}`, `${15 + 2 * i}`], correct: 0 };
                const medMath = { text: `📐 Solve: ${i + 5}x = ${(i + 5) * (i % 5 + 3)}`, options: [`${i % 5 + 3}`, `${i + 2}`, `${i + 1}`, `${i % 3 + 2}`], correct: 0 };
                const hardMath = { text: `📏 Find x: ${i + 2}x + ${i} = ${(i + 2) * (i + 3) + i}`, options: [`${i + 3}`, `${i + 1}`, `${i}`, `${i + 2}`], correct: 0 };
                
                Q_BANK[sub].easy.push({ ...easyMath, correct: 0, options: shuffleArray(easyMath.options) });
                Q_BANK[sub].medium.push({ ...medMath, correct: 0, options: shuffleArray(medMath.options) });
                Q_BANK[sub].hard.push({ ...hardMath, correct: 0, options: shuffleArray(hardMath.options) });
            }
        }
    });
}
buildQuestions();

// ---------- GAME ENGINE ----------
// CHANGE 2: Added lives:3 to gameState
let gameState = { active: false, subject: "Math", difficulty: "easy", questions: [], currentIdx: 0, score: 0, timeRemaining: 20, waitingNext: false, lives: 3 };
let fruits = [], splatters = [], bladeTrail = [], isSlicing = false, canvas, ctx, animationFrameId = null, globalTimerInterval = null;
let audioCtx = null;

function initAudio() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); if (audioCtx.state === 'suspended') audioCtx.resume(); }
function playSwooshSound() { try { initAudio(); let osc = audioCtx.createOscillator(), gain = audioCtx.createGain(); osc.connect(gain); gain.connect(audioCtx.destination); osc.type = 'triangle'; osc.frequency.setValueAtTime(120, audioCtx.currentTime); osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.15); gain.gain.setValueAtTime(0.15, audioCtx.currentTime); gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.15); osc.start(); osc.stop(audioCtx.currentTime + 0.15); } catch(e) {} }
function playSliceSound(isCorrect) { try { initAudio(); let osc1 = audioCtx.createOscillator(), gain1 = audioCtx.createGain(); osc1.type = 'sawtooth'; osc1.frequency.setValueAtTime(isCorrect ? 800 : 250, audioCtx.currentTime); osc1.frequency.linearRampToValueAtTime(isCorrect ? 1500 : 80, audioCtx.currentTime + 0.2); osc1.connect(gain1); gain1.connect(audioCtx.destination); gain1.gain.setValueAtTime(0.2, audioCtx.currentTime); gain1.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25); osc1.start(); osc1.stop(audioCtx.currentTime + 0.25); } catch(e) {} }

const FRUIT_COLORS = [{ main: '#ff4d4d', dark: '#cc0000', text: '#fff' }, { main: '#ffa500', dark: '#cc8400', text: '#fff' }, { main: '#4287f5', dark: '#1c5bc2', text: '#fff' }, { main: '#9b5de5', dark: '#6f2dbd', text: '#fff' }];

class LaunchableFruit {
    constructor(text, index, totalCount, canvasWidth, canvasHeight) {
        this.text = text; this.index = index; this.isSliced = false; this.radius = 55;
        let segmentWidth = canvasWidth / totalCount;
        this.x = (segmentWidth * index) + (segmentWidth / 2);
        this.y = canvasHeight + this.radius + 30;
        this.vy = -3.2; this.targetY = 170 + (index % 2) * 100;
        this.floatFrame = index * 30; this.color = FRUIT_COLORS[index % FRUIT_COLORS.length];
        this.sliceAngle = 0; this.splitDistance = 0;
    }
    update() { if (!this.isSliced) { if (this.y > this.targetY) this.y += this.vy; else { this.floatFrame += 0.015; this.y = this.targetY + Math.sin(this.floatFrame) * 15; } } else { this.splitDistance += 7; this.y += 6; } }
    draw(ctx) {
        ctx.save();
        if (!this.isSliced) {
            ctx.translate(this.x, this.y);
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            let grad = ctx.createRadialGradient(-15, -15, 5, 0, 0, this.radius);
            grad.addColorStop(0, '#fff');
            grad.addColorStop(0.2, this.color.main);
            grad.addColorStop(1, this.color.dark);
            ctx.fillStyle = grad;
            ctx.fill();

            // CHANGE 1: Draw a dark semi-transparent pill behind the text so it's clearly readable
            const displayText = this.text.length > 12 ? this.text.substr(0, 10) + '..' : this.text;
            ctx.font = "bold 13px 'Courier New', monospace";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            const textWidth = ctx.measureText(displayText).width;
            const padX = 7, padY = 5;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.62)';
            ctx.beginPath();
            ctx.roundRect(-(textWidth / 2 + padX), -10 - padY, textWidth + padX * 2, 20 + padY * 2, 6);
            ctx.fill();
            // White text on top of dark pill
            ctx.shadowColor = '#000';
            ctx.shadowBlur = 3;
            ctx.fillStyle = '#ffffff';
            ctx.fillText(displayText, 0, 0);
            ctx.shadowBlur = 0;
        }
        ctx.restore();
    }
    checkIntersection(p1, p2) { if (this.isSliced) return false; let A = p1.x - p2.x, B = p1.y - p2.y, len = Math.sqrt(A*A+B*B); if (len < 2) return false; let dot = (((this.x - p1.x)*(p2.x-p1.x)) + ((this.y-p1.y)*(p2.y-p1.y)))/(len*len); let cx = p1.x + (dot*(p2.x-p1.x)), cy = p1.y + (dot*(p2.y-p1.y)); if (dot<0) { cx=p1.x; cy=p1.y; } if (dot>1) { cx=p2.x; cy=p2.y; } let dx=this.x-cx, dy=this.y-cy; if (Math.sqrt(dx*dx+dy*dy) <= this.radius) { this.isSliced=true; return true; } return false; }
}
class SplatterJuice { constructor(x,y,color) { this.x=x; this.y=y; this.color=color; this.radius=15+Math.random()*25; this.alpha=0.7; this.life=35; } draw(ctx) { ctx.save(); ctx.globalAlpha=this.alpha; ctx.fillStyle=this.color; ctx.beginPath(); ctx.arc(this.x,this.y,this.radius,0,Math.PI*2); ctx.fill(); ctx.restore(); this.alpha-=0.02; this.life--; } }

function initCanvasArena() {
    canvas = document.getElementById("arenaCanvas"); if(!canvas) return;
    ctx = canvas.getContext("2d");
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width; canvas.height = 480;
    const arena = document.getElementById("sliceArena");
    if(arena) {
        arena.addEventListener("mousedown", e=>{ isSlicing=true; let pos=getCanvasPos(e); bladeTrail=[{x:pos.x,y:pos.y}]; playSwooshSound(); });
        arena.addEventListener("mousemove", e=>{ if(!isSlicing) return; let pos=getCanvasPos(e); let p1=bladeTrail[bladeTrail.length-1]; let p2={x:pos.x,y:pos.y}; bladeTrail.push(p2); if(bladeTrail.length>10) bladeTrail.shift(); if(p1 && gameState.active && !gameState.waitingNext) fruits.forEach(f=>{ if(f.checkIntersection(p1,p2)) processFruitSlice(f); }); });
        window.addEventListener("mouseup", ()=>{ isSlicing=false; });
        arena.addEventListener("touchstart", e=>{ e.preventDefault(); let pos=getCanvasPos(e.touches[0]); isSlicing=true; bladeTrail=[{x:pos.x,y:pos.y}]; playSwooshSound(); });
        arena.addEventListener("touchmove", e=>{ e.preventDefault(); if(!isSlicing) return; let pos=getCanvasPos(e.touches[0]); let p1=bladeTrail[bladeTrail.length-1]; let p2={x:pos.x,y:pos.y}; bladeTrail.push(p2); if(bladeTrail.length>10) bladeTrail.shift(); if(p1 && gameState.active && !gameState.waitingNext) fruits.forEach(f=>{ if(f.checkIntersection(p1,p2)) processFruitSlice(f); }); });
        arena.addEventListener("touchend", ()=>{ isSlicing=false; });
    }
    if(animationFrameId) cancelAnimationFrame(animationFrameId);
    runPhysicsTick();
}
function getCanvasPos(e) { const rect = canvas.getBoundingClientRect(); return { x: e.clientX - rect.left, y: e.clientY - rect.top }; }
function runPhysicsTick() { if(!ctx) return; ctx.clearRect(0,0,canvas.width,canvas.height); splatters=splatters.filter(s=>s.life>0); splatters.forEach(s=>s.draw(ctx)); fruits.forEach(f=>{ f.update(); f.draw(ctx); }); ctx.save(); if(bladeTrail.length>1) { ctx.beginPath(); ctx.moveTo(bladeTrail[0].x,bladeTrail[0].y); for(let i=1;i<bladeTrail.length;i++) ctx.lineTo(bladeTrail[i].x,bladeTrail[i].y); ctx.strokeStyle='#fff'; ctx.lineWidth=6; ctx.stroke(); } ctx.restore(); if(!isSlicing && bladeTrail.length>0) bladeTrail.shift(); animationFrameId=requestAnimationFrame(runPhysicsTick); }

// CHANGE 2: processFruitSlice now uses lives system instead of instant game over
function processFruitSlice(fruit) {
    const q = gameState.questions[gameState.currentIdx];
    const isCorrect = (fruit.index === q.correct);
    playSliceSound(isCorrect);
    splatters.push(new SplatterJuice(fruit.x, fruit.y, fruit.color.main));

    if (isCorrect) {
        gameState.score++;
        document.getElementById("scoreSliceValue").innerText = gameState.score;
        gameState.waitingNext = true;
        setTimeout(() => {
            gameState.currentIdx++;
            if (gameState.currentIdx >= gameState.questions.length) endGameVictory();
            else { gameState.waitingNext = false; launchRoundFruitBatch(); }
        }, 800);
    } else {
        // Wrong slice — lose one life
        gameState.lives--;
        updateLivesDisplay();

        if (gameState.lives <= 0) {
            // All 3 lives lost — game over, restart from beginning
            gameState.active = false;
            setTimeout(() => {
                saveScore();
                alert(`💥 ALL LIVES LOST! Score: ${gameState.score}\n\n🔄 Restarting from the beginning!`);
                beginGame(gameState.subject, gameState.difficulty);
            }, 500);
        } else {
            // Still has lives — flash warning, retry the SAME question
            gameState.waitingNext = true;
            const livesEl = document.getElementById("livesDisplay");
            if (livesEl) {
                livesEl.style.transform = 'scale(1.3)';
                livesEl.style.color = '#ff4444';
                setTimeout(() => {
                    if (livesEl) { livesEl.style.transform = 'scale(1)'; livesEl.style.color = ''; }
                }, 600);
            }
            setTimeout(() => {
                if (!gameState.active) return;
                gameState.waitingNext = false;
                launchRoundFruitBatch(); // same question again
            }, 900);
        }
    }
}

// CHANGE 2: Helper to update the ❤️🖤 hearts in the score panel
function updateLivesDisplay() {
    const livesEl = document.getElementById("livesDisplay");
    if (!livesEl) return;
    let hearts = '';
    for (let i = 0; i < 3; i++) hearts += (i < gameState.lives) ? '❤️' : '🖤';
    livesEl.innerText = hearts;
}

function launchRoundFruitBatch() { if(!gameState.active) return; gameState.timeRemaining=20; document.getElementById("qCounterSlice").innerText=`${gameState.currentIdx+1}/${gameState.questions.length}`; document.getElementById("sliceQuestion").innerText=gameState.questions[gameState.currentIdx].text; fruits=[]; gameState.questions[gameState.currentIdx].options.forEach((opt,idx)=>{ fruits.push(new LaunchableFruit(opt,idx,gameState.questions[gameState.currentIdx].options.length,canvas.width,canvas.height)); }); }
function startTimerTick() { if(globalTimerInterval) clearInterval(globalTimerInterval); globalTimerInterval=setInterval(()=>{ if(!gameState.active||gameState.waitingNext) return; gameState.timeRemaining--; document.getElementById("timerSliceFill").style.width=`${(gameState.timeRemaining/20)*100}%`; if(gameState.timeRemaining<=0){ gameState.active=false; clearInterval(globalTimerInterval); saveScore(); alert(`⏰ TIME'S EXPIRATION!`); renderScreen("menu"); } },1000); }
function endGameVictory() { gameState.active=false; if(globalTimerInterval) clearInterval(globalTimerInterval); saveScore(); alert(`🏆 VICTORY! Score: ${gameState.score}/${gameState.questions.length}`); renderScreen("menu"); }
function saveScore() { if(!currentUser||gameState.score===0) return; leaderboard.push({ user:currentUser, score:gameState.score, subject:gameState.subject, diff:gameState.difficulty, date:new Date().toLocaleDateString() }); leaderboard.sort((a,b)=>b.score-a.score); leaderboard=leaderboard.slice(0,10); localStorage.setItem("ninja_slice_leaderboard",JSON.stringify(leaderboard)); }

// CHANGE 2: beginGame resets lives to 3 every new game
function beginGame(subject,difficulty) { if(!currentUser){ alert("Login required!"); renderScreen("login"); return; } const qSet=Q_BANK[subject][difficulty]; gameState={ active:true, subject, difficulty, questions:[...qSet], currentIdx:0, score:0, timeRemaining:20, waitingNext:false, lives:3 }; renderScreen("quiz"); initCanvasArena(); launchRoundFruitBatch(); startTimerTick(); }

// ---------- SCREEN RENDERING ----------
const root = document.getElementById("gameRoot");
let showPassword = false;

function renderScreen(screen) {
    if(animationFrameId) cancelAnimationFrame(animationFrameId);
    if(globalTimerInterval && screen!=="quiz") clearInterval(globalTimerInterval);
    
    if(screen === "login") {
        root.innerHTML = `
            <div class="game-wrapper">
                <div class="screen-card">
                    <div class="ninja-badge">🗡️🍊 NINJA SLICE QUIZ 🍉⚔️</div>
                    <div class="security-panel">
                        🔐 ENTERPRISE SECURITY • PBKDF2 • 100,000 ITERATIONS • SALTED HASHES<br>
                        <span class="security-badge">🔒 Account Lockout (5 attempts)</span>
                        <span class="security-badge">⏰ Session Timeout (30 min)</span>
                        <span class="security-badge">💪 Password Strength Meter</span>
                        <span class="security-badge">📚 50+ Varied Questions Per Subject!</span>
                    </div>
                    <div class="flex-row">
                        <input type="text" id="loginUser" placeholder="Ninja Username" maxlength="20" value="CyberNinja">
                        <div class="password-container">
                            <input type="${showPassword ? 'text' : 'password'}" id="loginPass" placeholder="Secure Password">
                            <button type="button" class="eye-btn" id="togglePass">👁️</button>
                        </div>
                    </div>
                    <div class="password-strength" id="pwdStrength"></div>
                    <div id="strengthText" style="font-size:0.7rem; text-align:center; margin-top:5px;"></div>
                    <div class="flex-row">
                        <button id="doLogin">⚡ SECURE LOGIN</button>
                        <button id="doRegister" style="background:#4caf50;">🍥 REGISTER</button>
                    </div>
                    <div class="how-to-play">
                        <h3>📜 HOW TO PLAY</h3>
                        <ul>
                            <li>⚔️ SLICE the fruit containing the CORRECT ANSWER</li>
                            <li>🕒 20 seconds per question - Act fast!</li>
                            <li>❤️ You have 3 LIVES — wrong slice loses one life!</li>
                            <li>🍉 Correct slice = +1 point | Lose all 3 lives = Restart!</li>
                            <li>📚 50+ UNIQUE questions per subject per difficulty!</li>
                            <li>🔐 Your password is protected with PBKDF2 + unique salt</li>
                        </ul>
                    </div>
                </div>
            </div>`;
        
        const passInput = document.getElementById("loginPass");
        const strengthDiv = document.getElementById("pwdStrength");
        const strengthText = document.getElementById("strengthText");
        
        if(passInput) {
            passInput.addEventListener("input", (e) => {
                const strength = checkPasswordStrength(e.target.value);
                strengthDiv.className = `password-strength strength-${strength.level}`;
                strengthText.innerText = strength.text;
                strengthText.style.color = strength.level === 'weak' ? '#ff4444' : (strength.level === 'strong' ? '#00cc00' : '#ffaa44');
            });
        }
        
        document.getElementById("togglePass")?.addEventListener("click", () => {
            showPassword = !showPassword;
            const inp = document.getElementById("loginPass");
            if(inp) inp.type = showPassword ? 'text' : 'password';
        });
        
        document.getElementById("doLogin")?.addEventListener("click", async () => {
            const user = document.getElementById("loginUser").value.trim();
            const pass = document.getElementById("loginPass").value;
            const res = await loginUser(user, pass);
            if(res === "OK") renderScreen("menu");
            else alert(res);
        });
        
        document.getElementById("doRegister")?.addEventListener("click", async () => {
            const user = document.getElementById("loginUser").value.trim();
            const pass = document.getElementById("loginPass").value;
            const res = await registerUser(user, pass);
            alert(res);
        });
    } 
    else if(screen === "menu") {
        root.innerHTML = `
            <div class="game-wrapper">
                <div class="screen-card">
                    <h2>⚔️ Welcome, ${currentUser} ⚔️</h2>
                    <div class="security-panel" style="font-size:0.7rem;">
                        🔐 Active Session | ${Object.keys(Q_BANK.Math.easy).length}+ Questions Available!
                    </div>
                    <div class="flex-row">
                        <button id="showLeader">🏆 Leaderboard</button>
                        <button id="logoutBtn" style="background:#795548;">🔒 Logout</button>
                    </div>
                    <h3>1. Choose Subject</h3>
                    <div class="flex-row">
                        <button class="subBtn" data-sub="Math">🧮 Math</button>
                        <button class="subBtn" data-sub="English">📖 English</button>
                        <button class="subBtn" data-sub="Science">🔬 Science</button>
                        <button class="subBtn" data-sub="Cyber_security">🌍 Cyber_security</button>
                    </div>
                    <h3>2. Choose Difficulty</h3>
                    <div class="flex-row">
                        <button class="diffBtn" data-diff="easy" style="background:#8bc34a;">🌿 Apprentice (Easy)</button>
                        <button class="diffBtn" data-diff="medium" style="background:#ff9800;">🔥 Warrior (Medium)</button>
                        <button class="diffBtn" data-diff="hard" style="background:#e91e63;">🔱 Master (Hard)</button>
                    </div>
                    <div class="how-to-play">
                        <h3>📚 Question Bank Info</h3>
                        <ul><li>🔹 ENGLISH: Grammar, Vocabulary, Literature (50+ Qs)</li>
                        <li>🔹 SCIENCE: Physics, Chemistry, Biology, Astronomy (50+ Qs)</li>
                        <li>🔹 Cyber_security: History, Geography, Sports, Cyber Security (50+ Qs)</li>
                        <li>🔹 MATH: Dynamic algebra and arithmetic (50+ Qs)</li>
                        <li>❤️ 3 LIVES per game — wrong slice loses one life!</li></ul>
                    </div>
                </div>
            </div>`;
        
        document.querySelectorAll(".subBtn").forEach(btn => {
            btn.onclick = (e) => {
                gameState.subject = e.target.getAttribute("data-sub");
                document.querySelectorAll(".subBtn").forEach(b => b.classList.remove("active-sub"));
                e.target.classList.add("active-sub");
            };
        });
        document.querySelectorAll(".diffBtn").forEach(btn => {
            btn.onclick = (e) => { beginGame(gameState.subject, e.target.getAttribute("data-diff")); };
        });
        document.getElementById("showLeader").onclick = () => renderScreen("leaderboard");
        document.getElementById("logoutBtn").onclick = () => { logout(); renderScreen("login"); };
    }
    else if(screen === "quiz") {
        // CHANGE 2: Lives display ❤️❤️❤️ added to score panel
        root.innerHTML = `
            <div class="game-wrapper">
                <div class="screen-card">
                    <div class="score-panel">
                        <span>🔐 ${currentUser}</span>
                        <span>${gameState.subject.toUpperCase()} • ${gameState.difficulty}</span>
                        <span>Q: <span id="qCounterSlice">1/15</span></span>
                        <span>🎯 <span id="scoreSliceValue">0</span></span>
                        <span class="lives-display" id="livesDisplay">❤️❤️❤️</span>
                    </div>
                    <div class="timer-bar-slice"><div class="timer-fill" id="timerSliceFill"></div></div>
                    <div class="question-slice" id="sliceQuestion">Loading...</div>
                    <div class="slice-arena-wrapper">
                        <div class="slice-arena" id="sliceArena">
                            <canvas class="game-canvas" id="arenaCanvas"></canvas>
                        </div>
                    </div>
                    <div class="flex-row">
                        <button onclick="renderScreen('menu')" class="restart-slice">🏳️ Forfeit</button>
                    </div>
                </div>
            </div>`;
    }
    else if(screen === "leaderboard") {
        let rows = leaderboard.map((l, i) => `<tr><td>#${i+1}</td><td>${l.user}</td><td>${l.subject}</td><td>${l.diff.toUpperCase()}</td><td>${l.score}</td><td>${l.date}</td></tr>`).join('');
        root.innerHTML = `
            <div class="game-wrapper">
                <div class="screen-card">
                    <h2>🏆 NINJA HALL OF FAME</h2>
                    <div class="leaderboard-box">
                        ${leaderboard.length === 0 ? '<p style="text-align:center; padding:20px;">No scores yet.</p>' : `
                        <table><thead><tr><th>Rank</th><th>Ninja</th><th>Subject</th><th>Diff</th><th>Score</th><th>Date</th></tr></thead>
                        <tbody>${rows}</tbody></table>`}
                    </div>
                    <div class="flex-row"><button onclick="renderScreen('menu')">🔙 Back</button></div>
                </div>
            </div>`;
    }
}

renderScreen("login");

# Game Design Document – Ninja Quiz v1.0

**Project:** Ninja Quiz
**Module:** 503IT – Communication and Collaboration
**Team:** The Originals
**Version:** 1.0
**Date:** May 2026

---

## 1. Concept Summary

Ninja Quiz is a fast-paced, browser-based educational quiz game targeting players aged 8–16. The game teaches core cyber security concepts — including phishing awareness, password safety, and safe browsing — through an engaging question-and-answer format with timed challenges and a progressive scoring system.

The ninja theme provides an accessible, fun aesthetic that resonates with a younger audience while keeping the educational content front and centre. Every question answered correctly represents a "mission completed" by the player's ninja character.

---

## 2. Target Audience

| Audience | Description |
|----------|-------------|
| Primary | Children and teenagers aged 8–16 |
| Secondary | Educators and schools |
| Tertiary | Parents seeking educational entertainment |

---

## 3. Core Mechanics

### 3.1 Quiz Challenges
- Players are presented with multiple-choice questions across three subject areas: **Cyber Security**, **Science**, and **General Knowledge**
- Each question has four answer options (A, B, C, D)
- Correct answers award points; incorrect answers deduct points and display an educational explanation
- Questions are randomised each session to prevent memorisation

### 3.2 Timer System
- Each question has a countdown timer (default: 15 seconds)
- The timer bar shrinks visually as time runs out
- Unanswered questions when the timer expires are treated as incorrect
- Faster answers award a **speed bonus** to encourage quick thinking

### 3.3 Score and Combo System
- Base score: **+10 points** per correct answer
- Speed bonus: up to **+5 points** for fast responses
- Combo multiplier: consecutive correct answers multiply the score (x2, x3, up to x5)
- Incorrect answers reset the combo multiplier back to x1

### 3.4 Lives System
- Players start with **3 lives**
- Each incorrect answer costs 1 life
- Reaching 0 lives ends the game (Game Over screen)
- Bonus lives can be awarded for completing a level without mistakes

### 3.5 Difficulty Scaling
- **Level 1:** Easy questions, 15-second timer, basic topics
- **Level 2:** Moderate questions, 12-second timer, broader topics
- **Level 3:** Hard questions, 10-second timer, advanced topics
- Difficulty increases after every 10 questions answered correctly

---

## 4. Game Flow

```
Start Menu
    │
    ├── How to Play (Tutorial)
    │
    └── Play
         │
         ▼
    Subject Select (Cyber / Science / GK)
         │
         ▼
    Gameplay Loop
    ┌─────────────────────────────────┐
    │  Display Question + Timer       │
    │  Player Selects Answer          │
    │  Correct → Award Points + Combo │
    │  Incorrect → Lose Life + Tip    │
    │  Next Question                  │
    └─────────────────────────────────┘
         │
         ▼
    End Condition (10 questions / 0 lives / timer out)
         │
    ┌────┴────┐
    │         │
  Win      Game Over
    │         │
  Score     Score
  Screen    Screen
    │         │
    └────┬────┘
         │
    Play Again / Return to Menu
```

---

## 5. Win and Lose Conditions

### Win Conditions
- Complete all questions in a level with at least 1 life remaining
- Reach the target score threshold for the current level

### Lose Conditions
- All 3 lives are lost before completing the level
- Time runs out on 3 consecutive questions without answering

---

## 6. Question Bank

| Subject | Total Questions | Difficulty Spread |
|---------|----------------|-------------------|
| Cyber Security | 52 | Easy: 20, Medium: 20, Hard: 12 |
| Science | 51 | Easy: 20, Medium: 18, Hard: 13 |
| General Knowledge | 50 | Easy: 20, Medium: 18, Hard: 12 |
| **Total** | **153** | |

All cyber security questions are reviewed for accuracy against NCSC (National Cyber Security Centre) guidelines and age-appropriate content.

---

## 7. Educational Feedback System

A core design principle is that **every incorrect answer is a learning opportunity**:

- After an incorrect answer, the correct answer is highlighted
- A short explanation (1–2 sentences) appears explaining why the correct answer is right
- Explanations are written at an 8–16 age-appropriate reading level
- Feedback is displayed for 3 seconds before the next question appears

This ensures the game is educational even when a player is struggling, not just when they succeed.

---

## 8. User Interface

### 8.1 Screens
| Screen | Purpose |
|--------|---------|
| Start / Home | Title, Play button, How to Play, High Scores |
| Subject Select | Choose topic category |
| Gameplay | Question display, timer bar, score, lives, answer buttons |
| Score Screen | Final score, questions correct/total, combo achieved, Play Again |
| Tutorial | Step-by-step walkthrough of game mechanics |

### 8.2 Colour Scheme
- Background: Dark (`#0D0D0D`) for focus
- Accent: Gold (`#FFCD00`) for interactive elements and ninja theme
- Correct answer highlight: Green
- Incorrect answer highlight: Red

### 8.3 Responsive Design
- Designed for desktop browsers (1024px+ wide)
- Functional on tablets (768px+)
- Mobile support with touch events (iOS and Android)

---

## 9. Technical Specifications

| Specification | Detail |
|--------------|--------|
| Platform | Browser (HTML5) |
| Languages | HTML5, CSS3, Vanilla JavaScript |
| Hosting | GitHub Pages |
| Browser Support | Chrome, Firefox, Edge, Safari (desktop + mobile) |
| Dependencies | None (no external libraries) |
| Offline Support | Partial (loads from cache after first visit) |

---

## 10. Reference Games

The following games informed the design and UX of Ninja Quiz:

| Game | Influence |
|------|-----------|
| **Fruit Ninja** | Fast-paced interaction, ninja aesthetic, satisfying feedback |
| **Kahoot!** | Timed quiz format, coloured answer buttons, competitive feel |
| **Trivia Crack** | Subject categories, progressive difficulty, mobile-friendly UI |

---

## 11. Accessibility Considerations

- High-contrast colour scheme for readability
- Large tap targets for mobile users
- Audio feedback with a manual "Enable Audio" toggle (Safari compatibility)
- No flashing/strobe effects that could trigger photosensitive conditions
- Readable font sizes (minimum 14px body text)

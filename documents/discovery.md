# Discovery Document – Ninja Quiz

**Project:** Ninja Quiz
**Module:** 503IT – Communication and Collaboration
**Team:** The Originals
**Date:** May 2026

---

## Overview

This document captures the discovery phase of the Ninja Quiz project — the research, decisions, and context that shaped what we built and how we built it.

---

## Phase 1 — Discovery: What are we making and why?

### The Problem

Young people aged 8–16 are increasingly exposed to online threats — phishing emails, weak passwords, malware — but formal cyber security education rarely reaches them in an engaging way. Traditional classroom methods produce low retention rates, especially with younger audiences who expect interactive, game-like experiences.

### The Opportunity

Browser-based educational games are proven to increase engagement and knowledge retention. Platforms like Kahoot! demonstrate that quiz-style formats work well with young learners. Our opportunity was to apply this format specifically to cyber security topics that are often overlooked in school curricula.

### The Client Brief

Coventry University's 503IT module asked teams to respond to a realistic client brief: build a cyber security learning game targeted at young users. The key requirements were:
- Age-appropriate content (8–16)
- Interactive and engaging gameplay
- Coverage of core cyber security topics
- Delivered as a working browser prototype

---

## Phase 2 — Pre-Production: Design, Plan, Prototype

### Technology Decision

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| Unity | Rich visuals, game engine features | Steep learning curve, large file size, requires download | ❌ Rejected |
| HTML5 / JavaScript | Works in any browser, no install, team familiarity | Less visual power than Unity | ✅ Selected |

**Rationale:** Unity was initially considered but rejected in the first sprint. The team had more confidence in web technologies, and a browser-based game better serves the target audience (no download required, works on school computers).

### Game Concept

The ninja theme was chosen because:
- Resonates with the 8–16 age group
- The "slash/slice" mechanic adds physical engagement beyond just clicking
- The name "Ninja Quiz" is memorable and playful

### Team Roles

Roles were defined at the start to prevent overlap and establish clear ownership:

| Member | Role | Owned Module |
|--------|------|--------------|
| Aakash GC | Project Lead / Coordinator | Scoring system, results screen |
| Mukesh Chaudary | Technical Lead & DevOps | GitHub management, integration |
| Kishor Adhikari | Game Developer | Question system, countdown timer |
| Bishal Rai | UI/UX Designer | Slicing mechanics, visual effects |
| Suman Neupane | Content & QA | Educational content, testing |

---

## Phase 3 — Production: Build the Game

Five sprints of approximately one week each:

| Sprint | Focus | Key Output |
|--------|-------|------------|
| 1 | Setup & Login | Auth system, GitHub branches, role structure |
| 2 | Game Engine | Core quiz loop, slash mechanic |
| 3 | Slicing & Sound | Animations, visual effects, audio |
| 4 | Leaderboard & Test | Scoring, peer testing sessions |
| 5 | Polish & Submit | Bug fixes, documentation, final deployment |

---

## Phase 4 — Alpha: Playable, Ugly, Buggy

By the end of Sprint 3 the game was playable end-to-end but had several known issues:
- Audio not working on Safari
- Touch events unreliable on older Android devices
- Timer bar animation jittery
- Question bank incomplete (below 50 per subject)

All issues were logged in Sprint 4 and 5 meeting minutes and assigned to owners.

---

## Phase 5 — Beta: Feature-Complete, Polish, Fix

Sprint 4 and 5 focused on quality:
- All 7 bugs identified were fixed and verified
- Question bank reached 153 questions across three subjects
- Peer testing completed with 8 anonymous testers
- GitHub Pages deployment verified on Chrome, Firefox, Edge, and Safari

---

## Phase 6 — Gold / Launch: Ship It

The final version was deployed to GitHub Pages and is accessible without installation in any modern browser. All documentation, meeting minutes, and code are tracked in this repository.

**Live:** [https://wlaa41.github.io/CoventryUniversity_503IT_Originals/](https://wlaa41.github.io/CoventryUniversity_503IT_Originals/)

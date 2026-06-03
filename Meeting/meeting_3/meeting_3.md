# Team Meeting Minutes 

## Meeting Details

|Field|Information|
|-|-|
|**Date**|27 May 2026|
|**Time**|11:00 AM - 11:45 AM|
|**Location/Platform**|Coventry University NG13 (Physical)|
|**Chair**|Suman Neupane|
|**Minute-Taker**|Bishal Rai|
|**Attendees**|Mukesh K Shah, Kishor Adhikari, Akash GC, Suman Neupane, Bishal Rai|

\---

## Agenda Items

|#|Agenda Item|Description|
|-|-|-|
|1|**Security Implementation Review**|Review PBKDF2 hashing, account lockout, session timeout implementation. Verify OWASP compliance.|
|2|**Question Bank Expansion Status**|Review 50+ unique questions per subject per difficulty. Check content quality and variety.|
|3|**Cross-Browser Compatibility**|Test on Chrome, Firefox, Edge, Safari. Identify and fix rendering issues.|
|4|**Mobile Responsiveness \& Touch**|Verify touch events, canvas scaling, and UI on iOS/Android devices.|
|5|**Deployment Strategy**|Plan deployment to GitHub Pages / Netlify. Discuss HTTPS requirements.|

\---

## Decisions Made

|#|Decision|
|-|-|
|1|Implement PBKDF2 with 100,000 iterations + unique per-user salt|
|2|Account lockout after 5 failed attempts for 15 minutes|
|3|Session timeout set to 30 minutes of inactivity|
|4|Use fallback hash when Web Crypto API unavailable|
|5|Question bank: 50+ unique questions minimum per difficulty per subject|

\---

## Action Items

|Task/Action|Responsible Person|Deadline|
|-|-|-|
|Complete security penetration testing. Document findings.|Bishal Rai|29 May 2026|
|Deploy application to GitHub Pages.|Suman Neupane|02 June 2026|
|Complete cross-browser testing matrix (Chrome, Firefox, Edge, Safari). Document compatibility issues.|Kishor Adhikari|29 May 2026|
|Prepare final project documentation: Technical specs, User manual, Security architecture diagram|Akash GC|29 May 2026|
|Add loading indicator for question bank. Implement lazy loading for better performance.|Mukesh K Shah|29 May 2026|

\---

## Next Steps / Next Meeting

### Next Meeting: 30 May 2026

Before the final meeting, the team must complete four key tasks:

1. **Security Analyst (Bishal Rai)** will perform penetration testing on the PBKDF2 login system and document all security implementations.
2. **Lead Developer (Suman Neupane)** will deploy the application to GitHub Pages with HTTPS enabled.
3. **QA Tester (Kishor Adhikari)** will complete cross-browser testing on Chrome, Firefox, Edge, and Safari.
4. **Project Manager (Akash GC)** will compile all documentation into a submission package.

### Meeting Objectives

During the meeting, the team will:

* Review security audit results
* Verify the live deployment
* Test cross-browser compatibility
* Prepare the final ZIP archive for submission

### Goal

The goal is to deliver a fully functional, secure, and well-documented application ready for academic submission.

\---

## Summary Status

|Category|Status|
|-|-|
|Security Implementation|✅ Completed|
|Question Bank (50+ per subject)|✅ Completed|
|PBKDF2 Hashing|✅ Completed|
|Account Lockout|✅ Completed|
|Session Timeout|✅ Completed|
|Cross-Browser Testing|⏳ In Progress|
|Deployment|📅 Pending|
|Documentation|📅 Pending|
|Final Submission|📅 Pending|

\---

*Minutes prepared by: Bishal Rai*  
*Date: 27 May 2026*


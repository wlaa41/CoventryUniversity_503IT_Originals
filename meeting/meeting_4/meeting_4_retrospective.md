# Meeting Minutes – Meeting 4 (Retrospective)

## Meeting Details

|Field|Information|
|-|-|
|**Date**|31 May 2026|
|**Time**|11:00 AM – 11:45 AM|
|**Location**|Online via Whatapps|
|**Chair**|Bishal Rai|
|**Minute-Taker**|Kishor  Adhakari|
|**Attendees**|Mukesh K Shah, Kishor Adhikari, Akash GC, Suman Neupane, Bishal Rai|
|**Meeting Type**|Sprint Retrospective \& Bug Review|
|**Project**|Ninja Slice Quiz |

\---

## Agenda Items

|#|Agenda Item|Status|
|-|-|-|
|1|Review of Meeting 3 Action Items|✅ Completed|
|2|Bug Report \& Issue Discussion|✅ Completed|
|3|Code Quality \& Security Review|✅ Completed|
|4|Question Bank Quality Review|✅ Completed|
|5|Gameplay \& UX Feedback|✅ Completed|
|6|Performance Discussion|✅ Completed|
|7|Plan for Meeting 5|✅ Completed|

\---

## Decisions Made

|#|Decision|
|-|-|
|1|All Meeting 3 action items completed except GitHub Pages deployment and Safari cross-browser testing|
|2|Safari audio bug classified as **HIGH priority**; Timer animation jitter classified as **LOW priority**|
|3|Code quality is acceptable for submission; inline comments need to be added before final delivery|
|4|Question bank needs 10-15 additional English questions to reach minimum 50+ per subject|
|5|Meeting 5 scheduled for **5 June 2026** as Final Review \& Submission Meeting|

\---

## Bug Report \& Issues

|#|Bug/Issue|Severity|Status|Owner|
|-|-|-|-|-|
|1|Web Crypto API fails on file:// protocol in Chrome|🔴 Critical|✅ Fixed|Suman|
|2|Audio does not auto-play on mobile Safari|🟡 High|⏳ In Progress|Bishal|
|3|Touch events unresponsive on older Android devices|🟡 Medium|⏳ In Progress|Kishor|
|4|Timer bar animation appears jittery|🟢 Low|⏳ In Progress|Kishor|
|5|Canvas scaling issue on screens below 320px|🟢 Low|✅ Fixed|Mukesh|
|6|Leaderboard saves scores when user not logged in|🟡 Medium|✅ Fixed|Akash|
|7|Questions repeat within same quiz session|🟢 Low|✅ Fixed|Bishal|
|8|Score counter updates with delay after correct slice|🟢 Low|✅ Fixed|Suman|

**Summary:** 6/8 bugs fixed; 2 in progress

\---

## Team Member Updates

|Member|Role|Completed|Next Steps|
|-|-|-|-|
|Suman Neupane|Lead Developer|PBKDF2, lockout, session timeout, fallback hash|Deploy to GitHub Pages.|
|Bishal Rai|Security Analyst|Security audit structure, password meter|Complete audit report, fix Safari audio|
|Kishor Adhikari|QA Tester|Chrome + Firefox testing, bug tracking|Complete Safari + Edge testing|
|Akash GC|Project Manager|Documentation template, user manual|Compile submission package, add English questions|
|Mukesh K Shah|Frontend Engineer|UI improvements, loading indicators|Complete lazy loading, add code comments|

\---

## What Went Well

* ✅ PBKDF2 security implementation meets industry standards (100,000 iterations)
* ✅ Team communication and attendance was excellent throughout the sprint
* ✅ Fruit slicing mechanics and physics work smoothly on desktop
* ✅ Math question bank with dynamic generation provides infinite variations
* ✅ Chrome and Firefox cross-browser testing completed successfully
* ✅ Account lockout and session timeout features working as designed

\---

## What Needs Improvement

|#|Area for Improvement|Action Plan|
|-|-|-|
|1|Earlier testing on Safari browser|Start mobile testing earlier in next project|
|2|Better documentation during coding|Add comments as code is written, not at end|
|3|More realistic deadlines for deployment|Account for HTTPS/Web Crypto issues earlier|
|4|Regular code reviews during development|Schedule weekly 15-minute code review sessions|

\---

## Action Items

|#|Task|Owner|Deadline|Priority|
|-|-|-|-|-|
|1|Deploy application to GitHub Pages with HTTPS|Suman Neupane|3 June 2026|🔴 High|
|2|Complete Safari and Edge cross-browser testing|Kishor Adhikari|3 June 2026|🔴 High|
|3|Add "Enable Audio" button for mobile Safari|Bishal Rai|3 June 2026|🟡 Medium|
|4|Expand question bank to 50+ per subject|All Members|4 June 2026|🟡 Medium|
|5|Add inline code comments for documentation|All Members|4 June 2026|🟡 Medium|

\---

## Project Status Dashboard

|Category|Progress|Status|
|-|-|-|
|Security Implementation|100%|✅ Complete|
|PBKDF2 Hashing|100%|✅ Complete|
|Account Lockout|100%|✅ Complete|
|Session Timeout|100%|✅ Complete|
|Math Question Bank|100%|✅ Complete|
|English Question Bank|90%|⏳ In Progress|
|Science Question Bank|86%|⏳ In Progress|
|GK Question Bank|82%|⏳ In Progress|
|Chrome Testing|100%|✅ Complete|
|Firefox Testing|100%|✅ Complete|
|Safari Testing|40%|⏳ In Progress|
|Edge Testing|0%|⏳ Pending|
|Mobile Touch Support|80%|⏳ In Progress|
|GitHub Pages Deployment|0%|📅 Pending|
|Documentation|60%|⏳ In Progress|
|Bug Fixes|75% (6/8)|⏳ In Progress|

\---

## Lessons Learned

|#|Lesson|
|-|-|
|1|Always test on physical mobile devices, not just browser developer tools|
|2|Web Crypto API requires HTTPS - plan deployment strategy EARLY in project|
|3|Audio autoplay policies vary by browser - implement user-initiated audio from start|
|4|Dynamic question generation (Math) is more efficient than static question banks|
|5|Regular team communication prevents last-minute surprises and delays|
|6|Safari browser requires special handling for touch events and audio|

\---

## Next Meeting (Meeting 5)

|Field|Information|
|-|-|
|**Date**|5 June 2026|
|**Time**|10:00 AM – 12:00 PM|
|**Location**|Coventry University NG13|
|**Meeting Type**|Final Review \& Submission Preparation|

### Meeting 5 Agenda:

1. Verify all action items from Meeting 4 are complete
2. Test live deployment on GitHub Pages
3. Final code review and approval
4. Review all documentation for completeness
5. Watch and approve demo video
6. Create final submission ZIP archive
7. Project sign-off by all team members

### Goal for Meeting 5:

> Deliver a fully functional, secure, well-documented, and bug-free application ready for academic submission with all team members in agreement.

\---

## Sign-off

We, the undersigned, confirm that the minutes of Meeting 4 (Retrospective) accurately reflect the discussions, decisions, and action items agreed upon.

|Role|Name|Signature|Date|
|-|-|-|-|
|Chair (Project Lead)|Suman Neupane|`\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_`|3 June 2026|
|Minute-Taker|Bishal Rai|`\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_`|3 June 2026|
|Team Member|Mukesh K Shah|`\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_`|3 June 2026|
|Team Member|Kishor Adhikari|`\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_`|4 June 2026|
|Team Member|Akash GC|`\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_`|4 June2026|

\---

**Minutes prepared by:** Bishal Rai (Minute-Taker)  
**Date of preparation:** 31 May 2026  
**Next Meeting:** 3 June 2026 (Meeting 5 )

\---

*End of Meeting Minutes – Meeting 4 (Retrospective)*


# Clinical Protocols — Hadassah Intubation Checklist

_Source: Official Hadassah Medical Center elective intubation protocol_

---

## Overview
This app implements the Hadassah Medical Center protocol for **elective (non-emergency) intubations**.
Three-phase workflow: Preparation → Equipment check → Post-intubation care.

---

## Phase 1: הכנה לפני אינטובציה (13 items)

| ID  | Item | Clinical Note |
|-----|------|---------------|
| p1  | קריאה לעזרה | Ensure skilled team present + documentation person |
| p2  | מוניטור קרדיאלי | Continuous cardiac rhythm monitoring |
| p3  | מד סטורציה | Continuous SpO2 monitoring |
| p4  | A.W בגודל המתאים | Measure from jaw angle to center of mouth |
| p5  | גישה ורידית פתוחה | Verify patent IV access with flush |
| p6  | סקשן תקין מחובר לקטטר | Check suction power + catheter availability |
| p7  | פרה אוקסיגינציה - FMR | Pre-oxygenation at high flow for 3 minutes |
| p8  | אמבו מחובר למסכה ושעון חמצן | Verify O2 flow and bag integrity |
| p9  | מסנן ויראלי | Viral filter for team + equipment protection |
| p10 | מכונת הנשמה | Prepare ventilator to required parameters |
| p11 | עגלת אינטובציה | Verify availability and stock |
| p12 | עגלת החייאה | Accessible in case of deterioration |
| p13 | עדכון משפחה | Explain procedure to family |

---

## Phase 2: ציוד לאינטובציה (10 items)

| ID  | Item | Clinical Note |
|-----|------|---------------|
| e1  | טובוס בגודל המתאים | Prepare half-size smaller tube as backup |
| e2  | מוליך / גייד | Verify guide does not protrude past tube tip |
| e3  | מזרק 10 מ"ל לבדיקת בלונית | Verify no cuff leak |
| e4  | ידית לרינקוסקופ עם תאורה תקינה | Check white, strong light |
| e5  | להב | Select appropriate type and size |
| e6  | שרוך לקיבוע | Prevent tube displacement |
| e7  | ג'ל סטרילי | Tube lubrication |
| e8  | מלקחי מג'יל | For direct laryngoscopy use |
| e9  | קפנוגרף / ETCO2 | Gold standard for position confirmation |
| e10 | סטטוסקופ | Auscultation of lungs and stomach |

### LMA Fail-Safe Rule
Before starting intubation, team must acknowledge:
> "אם האינטובציה נכשלת פעמיים — מניחים LMA ומקבלים עזרה"
> ("If intubation fails twice — place LMA and call for help")

---

## Phase 3: אחרי אינטובציה (4 items)

| ID  | Item | Clinical Note |
|-----|------|---------------|
| a1  | האזנה | 5-point auscultation (bilateral lungs + stomach) |
| a2  | וידוא מיקום טובוס בעזרת קפנוגרף | Confirm continuous, normal capnography wave |
| a3  | קיבוע טובוס | Secure tube to prevent displacement |
| a4  | רנטגן חזה | Chest X-ray for definitive position confirmation |

---

## Medications (Weight-Based Dosing)

### סדציה (Sedation)
| Drug | Adult Dose | Pediatric Dose | Unit | Warning |
|------|-----------|----------------|------|---------|
| מידזולם | 0.05-0.1 | 0.05-0.1 | mg/kg | טיטרציה לפי תגובה |
| פרופופול | 1-2 | 1-2 | mg/kg | היפוטנציה |
| קטמין | 1-2 | 1-2 | mg/kg | לא ביתר לחץ תוך גולגולתי |

### חסם עצב שריר (Neuromuscular Blockade)
| Drug | Adult Dose | Pediatric Dose | Unit | Warning |
|------|-----------|----------------|------|---------|
| סוקצינילכולין | 1.5 | 2 | mg/kg | התוויות נגד: כוויות, רבדומיוליזה |
| רוקורוניום | 1.2 | 1.2 | mg/kg | היפך: סוגממדקס |

---

## Hard Airway Protocol (3 items)

Triggered any time during the procedure via the red FAB button.

| ID  | Item | Clinical Note |
|-----|------|---------------|
| ha1 | בוג'י | להנחה עיוורת כשהחלל לא נראה |
| ha2 | גלייד סקופ | ניהול נתיב אוויר קשה בווידאו |
| ha3 | קריאה למומחה | מומחה נגיש תמיד |

---

## Session Timing Tracked
- `sessionStartTime` — when app loads / new session starts
- `intubationStartTime` — when LMA warning is confirmed and intubation begins
- `sessionEndTime` — when "סיום אינטובציה" button is pressed

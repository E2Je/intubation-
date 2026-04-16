export type ItemStatus = 'pending' | 'done' | 'skipped' | 'not_relevant';

export interface ChecklistItem {
  id: string;
  label: string;
  img?: string;          // Hebrew filename as stored in public/assets/
  clinical_note: string;
}

export interface ChecklistSection {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface MedItem {
  id: string;
  label: string;
  unit: string;
  adult_dosage: string;
  pediatric_dosage: string;
  warning_note: string;
}

export interface MedSection {
  title: string;
  items: MedItem[];
}

export interface HardAirwayItem {
  id: string;
  label: string;
  clinical_note: string;
  img?: string;
}

// ─── Main checklist sections ───────────────────────────────────────────────

export const CHECKLIST_SECTIONS: ChecklistSection[] = [
  {
    id: 'prep',
    title: 'הכנה לפני אינטובציה',
    items: [
      { id: 'p1',  label: 'קריאה לעזרה',                    clinical_note: 'ודא נוכחות צוות מיומן וניהול רישום.',              img: 'קריאה לעזרה.jpg' },
      { id: 'p2',  label: 'מוניטור קרדיאלי',                 clinical_note: 'ניטור קצב לב רציף.',                               img: 'מוניטור קרדיאלי.jpg' },
      { id: 'p3',  label: 'מד סטורציה',                      clinical_note: 'ניטור רמת חמצן בדם.',                              img: 'מד סטורציה.jpg' },
      { id: 'p4',  label: 'A.W בגודל המתאים',               clinical_note: 'מדידה מזווית הלסת עד למרכז הפה.',                 img: 'A.W בגודל המתאים.jpg' },
      { id: 'p5',  label: 'גישה ורידית פתוחה',               clinical_note: 'וידוא שטיפה תקינה.',                               img: 'גישה ורידית פתוחה.jpg' },
      { id: 'p6',  label: 'סקשן תקין מחובר לקטטר',          clinical_note: 'בדיקת עוצמת שאיבה וזמינות קטטר.',                img: 'סקשן תקין מחובר לקטטר.jpg' },
      { id: 'p7',  label: 'פרה אוקסיגינציה - FMR',          clinical_note: 'חמצון בנפח גבוה למשך 3 דקות.',                   img: 'פרה אוקסיגינציה - FMR.jpg' },
      { id: 'p8',  label: 'אמבו מחובר למסכה ושעון חמצן',    clinical_note: 'וידוא זרימת חמצן ותקינות השקית.',                 img: 'אמבו מחובר למסכה ושעון חמצן.jpg' },
      { id: 'p9',  label: 'מסנן ויראלי',                     clinical_note: 'הגנה על הצוות והציוד.',                            img: 'מסנן ויראלי.jpg' },
      { id: 'p10', label: 'מכונת הנשמה',                     clinical_note: 'הכנת המנשם לפרמטרים הנדרשים.',                    img: 'מכונת הנשמה.jpg' },
      { id: 'p11', label: 'עגלת אינטובציה',                  clinical_note: 'וידוא זמינות ומלאי.',                              img: 'עגלת אינטובציה.jpg' },
      { id: 'p12', label: 'עגלת החייאה',                     clinical_note: 'זמינות למקרה של הידרדרות.',                        img: 'עגלת החייאה.jpg' },
      { id: 'p13', label: 'עדכון משפחה',                     clinical_note: 'הסבר על הפרוצדורה.',                               img: 'עדכון משפחה.jpg' },
    ],
  },
  {
    id: 'equipment',
    title: 'ציוד לאינטובציה',
    items: [
      { id: 'e1',  label: 'טובוס בגודל המתאים',              clinical_note: 'הכן גם טובוס קטן בחצי מידה.',                    img: 'טובוס בגודל המתאים.jpg' },
      { id: 'e2',  label: 'מוליך / גייד',                    clinical_note: 'וידוא שהגייד אינו בולט מקצה הטובוס.',             img: 'מוליך  גייד.jpg' },
      { id: 'e3',  label: 'מזרק 10 מ"ל לבדיקת בלונית',     clinical_note: 'וידוא שאין דליפה מהקאף.',                         img: 'מזרק 10 מל לבדיקת בלונית.jpg' },
      { id: 'e4',  label: 'ידית לרינקוסקופ עם תאורה תקינה', clinical_note: 'בדיקת אור לבן וחזק.',                             img: 'ידית לרינקוסקופ עם תאורה תקינה.jpg' },
      { id: 'e5',  label: 'להב',                             clinical_note: 'בחירת סוג וגודל מתאים.',                          img: 'להב.jpg' },
      { id: 'e6',  label: 'שרוך לקיבוע',                     clinical_note: 'למניעת תזוזה של הטובוס.',                         img: 'שרוך לקיבוע.jpg' },
      { id: 'e7',  label: "ג'ל סטרילי",                      clinical_note: 'לסיכוך הטובוס.',                                  img: "ג'ל סטרילי.jpg" },
      { id: 'e8',  label: "מלקחי מג'יל",                     clinical_note: 'לשימוש בלרינקוסקופיה ישירה.',                    img: "מלקחי מג'יל.jpg" },
      { id: 'e9',  label: 'קפנוגרף / ETCO2',                 clinical_note: 'הסטנדרט המוזהב לווידוא מיקום.',                   img: 'קפנוגרף.jpg' },
      { id: 'e10', label: 'סטטוסקופ',                        clinical_note: 'להאזנה לריאות וקיבה.',                            img: 'סטטוסקטפ.jpg' },
    ],
  },
  {
    id: 'post',
    title: 'אחרי אינטובציה',
    items: [
      { id: 'a1', label: 'האזנה',                                   clinical_note: 'האזנה ל-5 נקודות (ריאות דו-צדדי וקיבה).' },
      { id: 'a2', label: 'וידוא מיקום טובוס בעזרת קפנוגרף',       clinical_note: 'וידוא גל תקין ורציף.',                      img: 'ETCO2.jpg' },
      { id: 'a3', label: 'הכנסת זונדה / פתיחת PEG לניקוז',        clinical_note: 'למניעת לחץ בקיבה.' },
      { id: 'a4', label: 'הזמנת צילום חזה',                        clinical_note: 'לווידוא סופי של עומק הטובוס.' },
    ],
  },
];

// ─── Medication sections ────────────────────────────────────────────────────

const MED_WARNING = 'חובה לבדוק בעצמך מהו המינון המדוייק ולא להסתמך על המחשבון';

export const MED_SECTIONS: MedSection[] = [
  {
    title: 'סדציה',
    items: [
      { id: 'm1', label: 'Ketamine',      unit: 'mg/kg',  adult_dosage: '1-2',     pediatric_dosage: '2',       warning_note: MED_WARNING },
      { id: 'm2', label: 'Midazolam',     unit: 'mg/kg',  adult_dosage: '0.3',     pediatric_dosage: '0.1',     warning_note: MED_WARNING },
      { id: 'm3', label: 'Etomidate',     unit: 'mg/kg',  adult_dosage: '0.2-0.6', pediatric_dosage: '0.2-0.6', warning_note: MED_WARNING },
      { id: 'm4', label: 'Propofol',      unit: 'mg/kg',  adult_dosage: '1',       pediatric_dosage: '5',       warning_note: MED_WARNING },
      { id: 'm5', label: 'Fentanyl',      unit: 'mcg/kg', adult_dosage: '1',       pediatric_dosage: '1',       warning_note: MED_WARNING },
    ],
  },
  {
    title: 'חסם עצב שריר',
    items: [
      { id: 'm6', label: 'Succinylcholine', unit: 'mg/kg', adult_dosage: '1-1.5', pediatric_dosage: '1', warning_note: MED_WARNING },
      { id: 'm7', label: 'Rocuronium',      unit: 'mg/kg', adult_dosage: '1',     pediatric_dosage: '1', warning_note: MED_WARNING },
    ],
  },
];

// ─── Hard airway items ──────────────────────────────────────────────────────

export const HARD_AIRWAY_ITEMS: HardAirwayItem[] = [
  { id: 'h1', label: "בוג'י",                         clinical_note: 'מוליך גמיש לראות מוגבלת.',       img: "בוג'י.jpg" },
  { id: 'h2', label: 'גליידוסקופ + להב',               clinical_note: 'וידאו-לרינקוסקופיה.',             img: 'גליידוסקופ + להב.jpg' },
  { id: 'h3', label: 'קריאה למרדים / תורן אא"ג',      clinical_note: 'הפעלת נוהל נתיב אוויר קשה.',     img: 'קריאה למרדים  תורן אאג.jpg' },
];

export const LMA_WARNING =
  'אם 2 ניסיונות אינטובציה לא צלחו - יש להשתמש ב- LMA עד להגעת צוות צופן';

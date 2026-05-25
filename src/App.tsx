import { useState, useEffect, useCallback } from 'react'
import { ChevronDown, ChevronUp, X, Plus, Save, RotateCcw, Sparkles, Clock, Moon, Sun, Layers, ArrowUp, GripVertical, Check } from 'lucide-react'
import './index.css'

// ===== Data =====
interface StageData {
  id: string
  tag: string
  tagClass: string
  title: string
  desc: string
  items: string[]
}

const STAGES: StageData[] = [
  {
    id: 's1', tag: 'المرحلة 1 · مساء الاثنين', tagClass: 's1',
    title: 'اليوم الذي قبل عرفة', desc: 'فرّغ نفسك واحفظ يومك.',
    items: [
      'خذ إجازة من العمل أو الدراسة',
      'أخبر أهلك وأصدقاءك بفضائل اليوم',
      'أعلم الناس أنك ستكون مشغولاً بالعبادة طوال اليوم',
      'نم مبكراً بعد صلاة العشاء',
      'اضبط منبهاً قبل الفجر بساعة',
    ]
  },
  {
    id: 's2', tag: 'المرحلة 2 · قبل الفجر', tagClass: 's2',
    title: 'الثلث الأخير من الليل', desc: 'ابدأ في الساعات التي ينزل فيها الله.',
    items: [
      'اقرأ دعاء الاستيقاظ وادعُ الله',
      'تسحّر',
      'صلِّ قيام الليل',
      'اسأل الله العون لاغتنام اليوم',
      'اقضِ آخر 5-10 دقائق في الاستغفار',
    ]
  },
  {
    id: 's3', tag: 'المرحلة 3 · الفجر', tagClass: 's3',
    title: 'فجر يوم عرفة', desc: 'افتتح اليوم بالعبادة.',
    items: [
      'توضأ واستشعر الذنوب تتساقط',
      'صلِّ الفجر في المسجد إن استطعت',
      'اقرأ أذكار الصباح',
      'اتلُ ما تيسر من القرآن',
      'ابقَ مستيقظاً حتى الشروق إن استطعت',
      'اتلُ شيئاً من القرآن',
    ]
  },
  {
    id: 's4', tag: 'المرحلة 4 · الصباح', tagClass: 's4',
    title: 'بعد الشروق', desc: 'استرح بنية، ثم عد.',
    items: [
      'إن استرحت فانوِ التقوّي على العبادة',
      'نم فقط بقدر ما تحتاج',
      'صلِّ 4 ركعات صلاة الضحى',
      'اهتم بحوائج أهلك قبل الظهر',
      'نوّع بين العبادات حتى لا تتعب',
    ]
  },
  {
    id: 's5', tag: 'المرحلة 5 · بعد الظهر', tagClass: 's5',
    title: 'من الظهر إلى العصر', desc: 'ابنِ نحو النافذة الذهبية.',
    items: [
      'صلِّ الظهر واقرأ أذكارها',
      'ادعُ الله',
      'أرسل تذكيراً لأهلك',
      'ردّد التكبير بين الصلوات',
    ]
  },
  {
    id: 's6', tag: 'المرحلة 6 · العصر', tagClass: 's6',
    title: 'من العصر إلى المغرب، النافذة الذهبية', desc: 'ساعة الذروة. لا تبخل على نفسك.',
    items: [
      'ادعُ، ادعُ، ادعُ — ساعة الذروة',
      'اسأل الله أن يعتقك من النار',
      'جهّز إفطارك',
      'ابقَ متواضعاً واحذر العُجب',
    ]
  },
]

const DUA_THEMES = [
  'المغفرة والعتق من النار',
  'الهداية والثبات على الدين',
  'الصحة والعافية',
  'الرزق الحلال والبركة',
  'بر الوالدين وصلة الأرحام',
  'الذرية الصالحة',
  'الزوج/الزوجة الصالح/ة',
  'حسن الخاتمة',
  'الفردوس الأعلى',
  'شفاء المرضى',
  'فك كرب المهمومين',
  'نصرة المستضعفين',
  'العلم النافع',
  'التوفيق في العمل والدراسة',
  'راحة البال والسكينة',
  'حفظ القرآن والعمل به',
]

const SIDEBAR_ACTIVITIES = [
  'صيام يوم عرفة',
  'صلاة قيام الليل',
  'السحور',
  'الاستغفار',
  'الدعاء',
  'صلاة الضحى',
  'أذكار الصباح',
  'أذكار ما بعد الصلاة',
  'التكبير بين الصلوات',
  'تلاوة القرآن',
  'مراجعة الحفظ',
]

// ===== Countdown Hook =====
function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false })

  useEffect(() => {
    const tick = () => {
      const now = new Date().getTime()
      const diff = targetDate.getTime() - now
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true })
        return
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        expired: false,
      })
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  return timeLeft
}

// ===== App =====
function App() {
  // Maghrib Casablanca 25 May 2026 at 20:44 (UTC+1 Morocco summer time)
  const maghribDate = new Date('2026-05-25T20:44:00+01:00')
  const countdown = useCountdown(maghribDate)

  // Dua list
  const [duas, setDuas] = useState<string[]>(() => {
    const saved = localStorage.getItem('arafah-duas-ar')
    return saved ? JSON.parse(saved) : []
  })
  const [duaInput, setDuaInput] = useState('')
  const [showThemes, setShowThemes] = useState(false)

  useEffect(() => {
    localStorage.setItem('arafah-duas-ar', JSON.stringify(duas))
  }, [duas])

  const addDua = useCallback(() => {
    const text = duaInput.trim()
    if (text) {
      setDuas(prev => [...prev, text])
      setDuaInput('')
    }
  }, [duaInput])

  const removeDua = (index: number) => {
    setDuas(prev => prev.filter((_, i) => i !== index))
  }

  // Timetable checkboxes
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('arafah-checked-ar')
    return saved ? JSON.parse(saved) : {}
  })

  useEffect(() => {
    localStorage.setItem('arafah-checked-ar', JSON.stringify(checked))
  }, [checked])

  const toggleCheck = (stageId: string, itemIdx: number) => {
    const key = `${stageId}-${itemIdx}`
    setChecked(prev => ({ ...prev, [key]: !prev[key] }))
  }

  // Stage open/close
  const [openStages, setOpenStages] = useState<Record<string, boolean>>({ s1: true })

  const toggleStage = (id: string) => {
    setOpenStages(prev => ({ ...prev, [id]: !prev[id] }))
  }

  // Calendar builder
  const [calendarItems, setCalendarItems] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('arafah-calendar-ar')
    if (saved) return JSON.parse(saved)
    const initial: Record<string, string[]> = {}
    STAGES.forEach(s => { initial[s.id] = [...s.items] })
    return initial
  })

  const [calendarInputs, setCalendarInputs] = useState<Record<string, string>>({})

  useEffect(() => {
    localStorage.setItem('arafah-calendar-ar', JSON.stringify(calendarItems))
  }, [calendarItems])

  const resetCalendar = () => {
    const initial: Record<string, string[]> = {}
    STAGES.forEach(s => { initial[s.id] = [...s.items] })
    setCalendarItems(initial)
  }

  const addCalendarItem = (stageId: string, text: string) => {
    if (!text.trim()) return
    setCalendarItems(prev => ({
      ...prev,
      [stageId]: [...(prev[stageId] || []), text.trim()]
    }))
    setCalendarInputs(prev => ({ ...prev, [stageId]: '' }))
  }

  const removeCalendarItem = (stageId: string, idx: number) => {
    setCalendarItems(prev => ({
      ...prev,
      [stageId]: prev[stageId].filter((_, i) => i !== idx)
    }))
  }

  const moveCalendarItem = (stageId: string, idx: number, dir: 'up' | 'down') => {
    setCalendarItems(prev => {
      const items = [...prev[stageId]]
      const newIdx = dir === 'up' ? idx - 1 : idx + 1
      if (newIdx < 0 || newIdx >= items.length) return prev;
      [items[idx], items[newIdx]] = [items[newIdx], items[idx]]
      return { ...prev, [stageId]: items }
    })
  }

  // Stage picker modal for sidebar
  const [stagePicker, setStagePicker] = useState<{ text: string } | null>(null)

  const addFromSidebar = (text: string) => {
    setStagePicker({ text })
  }

  const confirmStagePick = (stageId: string) => {
    if (stagePicker) {
      addCalendarItem(stageId, stagePicker.text)
      setStagePicker(null)
    }
  }

  const getCheckedCount = (stage: StageData) => {
    return stage.items.filter((_, i) => checked[`${stage.id}-${i}`]).length
  }

  return (
    <>
      {/* ===== Navbar ===== */}
      <nav className="navbar">
        <a href="#" className="navbar-logo">
          <div className="navbar-logo-icon" />
          <span>عرفة</span>
        </a>
        <ul className="navbar-links">
          <li><a href="#importance">اليوم</a></li>
          <li><a href="#plan">الخطة</a></li>
          <li><a href="#builder">جدولك</a></li>
        </ul>
      </nav>

      {/* ===== Hero ===== */}
      <section className="hero" id="top">
        <div className="hero-arch" />
        <div className="hero-arch-inner" />
        <div className="hero-ornament">۞</div>
        <p className="hero-date">٩ ذو الحجة ١٤٤٧</p>
        <h1 className="hero-title">يوم عرفة</h1>
        <p className="hero-arabic">يَوْمُ عَرَفَة</p>
        <p className="hero-subtitle">يوم الدعاء، اليوم الذي يمكن أن يُغيّر حياتك.</p>

        <p className="hero-countdown-label">حتى مغرب يوم عرفة</p>

        {countdown.expired ? (
          <div className="hero-countdown-message">
            <p>دخل المغرب، تقبّل الله كل دعاء دعوته في عرفة.</p>
          </div>
        ) : (
          <div className="hero-countdown">
            <div className="countdown-unit">
              <span className="countdown-number">{String(countdown.seconds).padStart(2, '0')}</span>
              <span className="countdown-label-text">ثانية</span>
            </div>
            <div className="countdown-unit">
              <span className="countdown-number">{String(countdown.minutes).padStart(2, '0')}</span>
              <span className="countdown-label-text">دقيقة</span>
            </div>
            <div className="countdown-unit">
              <span className="countdown-number">{String(countdown.hours).padStart(2, '0')}</span>
              <span className="countdown-label-text">ساعة</span>
            </div>
            <div className="countdown-unit">
              <span className="countdown-number">{String(countdown.days).padStart(2, '0')}</span>
              <span className="countdown-label-text">يوم</span>
            </div>
          </div>
        )}

        <p className="hero-time-note">العد التنازلي لمغرب الدار البيضاء، الساعة 8:44 مساءً اليوم، الاثنين 25 مايو 2026.</p>
        <a href="#importance" className="hero-begin">ابدأ <ChevronDown size={16} /></a>
      </section>

      {/* ===== Why This Day ===== */}
      <section className="section" id="importance">
        <p className="section-label">لماذا هذا اليوم</p>
        <h2 className="section-title">هذا أفضل يوم في السنة</h2>
        <p className="section-subtitle">لكن لماذا؟ إليك بعض فضائل وبركات هذا اليوم!</p>

        {/* Hadith Card */}
        <div className="hadith-card">
          <div className="hadith-ornament">۞</div>
          <p className="hadith-section-label">وَعْدُ هَذَا الْيَوْم</p>
          <p className="hadith-arabic">
            مَا مِنْ يَوْمٍ أَكْثَرَ مِنْ أَنْ يُعْتِقَ اللَّهُ فِيهِ عَبْدًا مِنَ النَّارِ مِنْ يَوْمِ عَرَفَةَ
          </p>
          <p className="hadith-translation">
            "ما من يومٍ أكثرُ من أن يُعتِقَ اللهُ فيه عبدًا من النارِ من يوم عرفة."
          </p>
          <p className="hadith-source">
            النبي ﷺ · رواه عائشة رضي الله عنها · صحيح مسلم
          </p>
        </div>

        {/* Action Cards */}
        <div className="action-card" onClick={() => document.getElementById('dua')?.scrollIntoView({ behavior: 'smooth' })}>
          <div className="action-card-icon spark"><Sparkles size={18} /></div>
          <p>فاسأل الله المغفرة، واسأله أن <strong>يعتقك من النار</strong>.</p>
        </div>

        <div className="action-card" style={{ cursor: 'default' }}>
          <div className="action-card-icon clock"><Clock size={18} /></div>
          <p><strong>النافذة الذهبية: من الظهر إلى المغرب.</strong> إذا جاءت، لا تبخل على نفسك. أفرغ كل ما في قلبك.</p>
        </div>

        {/* Virtue Cards */}
        <div className="virtues-grid">
          <div className="virtue-card">
            <span className="virtue-card-badge">اضغط هنا</span>
            <div className="virtue-card-icon moon"><Moon size={20} /></div>
            <h3>أعظم صيام</h3>
            <p>صيام يوم عرفة يكفّر ذنوب سنة قبله وسنة بعده.</p>
            <p className="hadith-ref">النبي ﷺ · صحيح مسلم 1162</p>
          </div>
          <div className="virtue-card">
            <span className="virtue-card-badge">اضغط هنا</span>
            <div className="virtue-card-icon sun"><Sun size={20} /></div>
            <h3>أفضل يوم للدعاء على الإطلاق</h3>
            <p>لا يوجد دعاء أحب إلى الله ولا أكثر استجابة من دعاء يوم عرفة.</p>
          </div>
          <div className="virtue-card">
            <span className="virtue-card-badge">اضغط هنا</span>
            <div className="virtue-card-icon layers"><Layers size={20} /></div>
            <h3>الأعمال مضاعفة</h3>
            <p>هذا يوم كل عمل فيه يُضاعف، فاملأه بأكبر قدر ممكن من العبادة.</p>
          </div>
          <div className="virtue-card">
            <span className="virtue-card-badge">اضغط هنا</span>
            <div className="virtue-card-icon arrow"><ArrowUp size={20} /></div>
            <h3>نقطة تحوّل</h3>
            <p>هنا يمكن أن تتغير حياتك. ضعفك يصبح قوة، وخيرك يزداد، وصعوبتك تصبح يسراً.</p>
          </div>
        </div>

        {/* Quote Block */}
        <div className="quote-block">
          <p className="quote-block-main">
            في هذا اليوم، حتى النبي ﷺ وهو يُمسك بزمام ناقته بيدٍ، كان يرفع الأخرى إلى السماء يدعو.
          </p>
          <p>لأن هذا أفضل يوم في السنة للدعاء، وكان يريد أن يغتنم كل لحظة فيه.</p>
          <p className="highlight">اسأل نفسك: ماذا لو كان هذا آخر عامٍ لك؟ ماذا ستسأل الله؟ كيف ستقضي هذا الوقت الذهبي؟</p>
        </div>
      </section>

      {/* Gradient Banner */}
      <div className="gradient-banner">
        <p>"الدعاء في هذا اليوم يمكن أن يُغيّر كل شيء."</p>
      </div>

      {/* ===== Dua Section ===== */}
      <section className="section" id="dua">
        <p className="section-label">طريقة للسؤال</p>
        <h2 className="section-title">اكتب دعاءك</h2>
        <p className="section-subtitle">ابدأ بالثناء على الله بأسمائه الحسنى، ثم اسأله ما يشتهي قلبك:</p>

        <div className="dua-example">
          "يا الله، يا مالك الملك، يا رزّاق، يا من بيده كل شيء، لو أن كل شيء ممكن، لسألتك..."
        </div>

        <div className="dua-input-wrapper">
          <input
            className="dua-input"
            type="text"
            placeholder="اكتب دعاءك، ثم اضغط أضف..."
            value={duaInput}
            onChange={(e) => setDuaInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addDua()}
          />
          <button className="dua-add-btn" onClick={addDua}>أضف</button>
        </div>

        <button className="dua-themes-link" onClick={() => setShowThemes(true)}>
          <Sparkles size={14} />
          لا تدري ماذا تسأل؟ إليك قائمة بمواضيع للدعاء!
        </button>

        <div className="dua-list-header">
          <h3>قائمة أدعيتك <span className="count">{duas.length}</span></h3>
        </div>

        {duas.length === 0 ? (
          <p className="dua-empty">لم تضف أي دعاء بعد. ابدأ بكتابة دعائك أعلاه.</p>
        ) : (
          <ul className="dua-list">
            {duas.map((dua, i) => (
              <li key={i}>
                <span>{dua}</span>
                <button onClick={() => removeDua(i)}><X size={16} /></button>
              </li>
            ))}
          </ul>
        )}

        <button className="save-btn" onClick={() => alert('سيتم حفظ القائمة كصورة قريباً إن شاء الله')}>
          <Save size={16} /> حفظ القائمة كصورة
        </button>
      </section>

      {/* ===== Before the Day ===== */}
      <section className="section">
        <h2 className="prep-heading">قبل أن يأتي اليوم</h2>
        <div className="prep-grid">
          {[
            { num: '١', title: 'اعرف عظمة اليوم', desc: 'لا تدع أعظم يوم في السنة يمر كأي يوم آخر.' },
            { num: '٢', title: 'عُد إلى الله', desc: 'الذنوب عقبات. تخلّص منها الآن بالتوبة النصوح.' },
            { num: '٣', title: 'فرّغ يومك', desc: 'أنهِ مهامك مبكراً حتى لا يزاحم شيء اليوم نفسه.' },
            { num: '٤', title: 'جهّز أدعيتك', desc: 'قرّر الآن ماذا ستسأل الله، حتى لا تضيع لحظة ثمينة.' },
            { num: '٥', title: 'أحضر غيرك معك', desc: 'أخبر أهلك وأصدقاءك ليستفيدوا، ولترفعك هممهم.' },
          ].map((step) => (
            <div key={step.num} className="prep-card">
              <div className="prep-card-number">{step.num}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="italic-quote">أنت تعرف ثقل هذا اليوم. إليك كيف تستقبله، ساعة بساعة.</p>

      {/* ===== Timetable ===== */}
      <section className="section" id="plan">
        <p className="section-label">الخطة</p>
        <h2 className="section-title">جدول مقترح</h2>
        <p className="section-subtitle">هذا جدول مقترح، اطّلع عليه، وانظر ما تستطيع فعله، ثم ابنِ جدولك الخاص أدناه.</p>

        <button className="save-btn" style={{ marginBottom: 32 }} onClick={() => alert('سيتم حفظ الجدول كصورة قريباً إن شاء الله')}>
          <Save size={16} /> حفظ الجدول كصورة
        </button>

        <div className="timetable-wrapper">
          <div className="timetable-line" />
          {STAGES.map((stage, stageIdx) => {
            const isOpen = openStages[stage.id] ?? false
            const checkedCount = getCheckedCount(stage)
            return (
              <div key={stage.id} className="timetable-stage">
                <div className={`stage-number ${stage.tagClass}`}>{stageIdx + 1}</div>
                <div className={`stage-card ${stage.tagClass}`}>
                  <div className="stage-header" onClick={() => toggleStage(stage.id)}>
                    <div className="stage-header-right">
                      <p className={`stage-tag ${stage.tagClass}`}>{stage.tag}</p>
                      <h3>{stage.title}</h3>
                      <p className="stage-desc">{stage.desc}</p>
                    </div>
                    <div className="stage-header-left">
                      <span className="stage-count">{checkedCount} / {stage.items.length}</span>
                      <span className={`stage-toggle ${isOpen ? 'open' : ''}`}>
                        <ChevronDown size={18} />
                      </span>
                    </div>
                  </div>
                  {isOpen && (
                    <div className="stage-items">
                      {stage.items.map((item, i) => {
                        const key = `${stage.id}-${i}`
                        const isChecked = checked[key] ?? false
                        return (
                          <div key={i} className="stage-item">
                            <div className="checkbox-wrapper" onClick={() => toggleCheck(stage.id, i)}>
                              <div className={`checkbox ${isChecked ? 'checked' : ''}`}>
                                {isChecked && <Check size={14} />}
                              </div>
                              <span className={`checkbox-label ${isChecked ? 'checked' : ''}`}>{item}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <p className="italic-quote">هذا هو الطريق الذي نقترحه. الآن شكّله بما يناسبك.</p>

      {/* ===== Calendar Builder ===== */}
      <section className="section" id="builder">
        <p className="section-label">اجعله خاصاً بك</p>
        <h2 className="section-title">ابنِ جدولك</h2>
        <p className="section-subtitle">ابدأ من الخطة المقترحة، ثم عدّلها لتناسب يومك. أضف أنشطة، أعد الترتيب، وأضف نيّاتك.</p>

        <div className="buttons-row">
          <button className="btn-outline" onClick={() => alert('سيتم حفظها كصورة قريباً إن شاء الله')}>
            <Save size={16} /> حفظ كصورة
          </button>
          <button className="btn-outline" onClick={resetCalendar}>
            <RotateCcw size={16} /> إعادة للخطة المقترحة
          </button>
        </div>
        <p className="calendar-saved-note">جدولك محفوظ على هذا الجهاز.</p>

        <div className="calendar-layout">
          {/* Sidebar */}
          <div className="calendar-sidebar">
            <div className="sidebar-card">
              <p className="sidebar-category">عبادات</p>
              {SIDEBAR_ACTIVITIES.map((activity, i) => (
                <div key={i} className="sidebar-item">
                  <div className="sidebar-item-right">
                    <span className="sidebar-item-star">&#9733;</span>
                    <span className="sidebar-item-text">{activity}</span>
                  </div>
                  <button className="sidebar-item-add" onClick={() => addFromSidebar(activity)}>
                    <Plus size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar Stages */}
          <div>
            {STAGES.map((stage) => {
              const items = calendarItems[stage.id] || []
              const inputVal = calendarInputs[stage.id] || ''
              return (
                <div key={stage.id} style={{ marginBottom: 24 }}>
                  <div className={`stage-card ${stage.tagClass}`}>
                    <div className="stage-header" style={{ cursor: 'default' }}>
                      <div className="stage-header-right">
                        <h3>{stage.title}</h3>
                        <p className={`stage-tag ${stage.tagClass}`}>{stage.tag.split(' · ')[1]}</p>
                      </div>
                      <span className="stage-count">{items.length}</span>
                    </div>
                    <div className="stage-items">
                      {items.map((item, i) => (
                        <div key={i} className="cal-stage-item">
                          <span className="cal-item-drag"><GripVertical size={14} /></span>
                          <span className="cal-item-time">الوقت</span>
                          <span className="cal-item-text">{item}</span>
                          <span className="cal-item-badge">مقترح</span>
                          <div className="cal-item-actions">
                            <button onClick={() => moveCalendarItem(stage.id, i, 'up')} title="لأعلى"><ChevronUp size={14} /></button>
                            <button onClick={() => removeCalendarItem(stage.id, i)} title="حذف"><X size={14} /></button>
                          </div>
                        </div>
                      ))}
                      <div className="add-activity-row">
                        <input
                          placeholder='أضف نشاطك، مثلاً: "اتصل بجدتي"'
                          value={inputVal}
                          onChange={(e) => setCalendarInputs(prev => ({ ...prev, [stage.id]: e.target.value }))}
                          onKeyDown={(e) => e.key === 'Enter' && addCalendarItem(stage.id, inputVal)}
                        />
                        <button onClick={() => addCalendarItem(stage.id, inputVal)}>
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="footer">
        <div className="footer-logo" />
        <p className="footer-arabic">تَقَبَّلَ اللهُ مِنَّا وَمِنْكُمْ</p>
        <p className="footer-text">صُنع بالدعاء ليوم عرفة · ١٤٤٧ هـ</p>
        <p className="footer-disclaimer">التواريخ والأوقات بحسب رؤية هلال الدار البيضاء المتوقعة، يُرجى التأكد من جهتك المحلية.</p>
      </footer>

      {/* ===== Dua Themes Modal ===== */}
      {showThemes && (
        <div className="modal-overlay" onClick={() => setShowThemes(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>مواضيع للدعاء</h2>
              <button className="modal-close" onClick={() => setShowThemes(false)}><X size={20} /></button>
            </div>
            <ul className="modal-themes-list">
              {DUA_THEMES.map((theme, i) => (
                <li key={i} onClick={() => { setDuaInput(theme); setShowThemes(false) }}>
                  {theme}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ===== Stage Picker Modal ===== */}
      {stagePicker && (
        <div className="modal-overlay" onClick={() => setStagePicker(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>أضف إلى أي مرحلة؟</h2>
              <button className="modal-close" onClick={() => setStagePicker(null)}><X size={20} /></button>
            </div>
            <p style={{ marginBottom: 16, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              اختر المرحلة التي تريد إضافة "{stagePicker.text}" إليها.
            </p>
            <ul className="stage-picker-list">
              {STAGES.map((stage) => (
                <li key={stage.id} onClick={() => confirmStagePick(stage.id)}>
                  <h4>{stage.title}</h4>
                  <p>{stage.tag.split(' · ')[1]}</p>
                </li>
              ))}
            </ul>
            <button className="modal-cancel-btn" onClick={() => setStagePicker(null)}>إلغاء</button>
          </div>
        </div>
      )}
    </>
  )
}

export default App

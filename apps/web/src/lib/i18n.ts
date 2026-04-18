import type { CatchStatus, FishCode } from '@fish-scan/shared'

export type AppLanguage = 'ru' | 'en'

interface UiText {
  appTitle: string
  heroEyebrow: string
  heroTitle: string
  heroDescription: string
  searchLabel: string
  searchPlaceholder: string
  searchHint: string
  searchSubmit: string
  searchLoading: string
  recentQueriesAria: string
  errorTitle: string
  emptyTitle: string
  emptyDescription: string
  locationConditions: string
  time: string
  period: string
  waterTemp: string
  outOfHundred: string
  confidence: string
  currentWeather: string
  temperature: string
  pressure: string
  wind: string
  humidity: string
  hourlyForecast: string
  hoursShort: string
  factors: string
  factorsTitle: string
  bestWindow: string
  bestWindowEmpty: string
  bestWindowFallback: string
  fishRecommendations: string
  fishTitle: string
  chances: string
  bait: string
  tactics: string
  aiAdvice: string
  aiTitle: string
  aiRefreshAria: string
  aiUnavailable: string
  history: string
  historyTitle: string
  historyEmpty: string
  language: string
}

const UI_TEXT: Record<AppLanguage, UiText> = {
  ru: {
    appTitle: 'Прогноз клева по погоде',
    heroEyebrow: 'Рыбалка по погоде',
    heroTitle: 'Погода, окно активности и рекомендации по рыбе в одном экране',
    heroDescription:
      'Укажите город или координаты, чтобы получить текущие условия, прогноз клева, рекомендации по рыбе и краткий совет от ИИ.',
    searchLabel: 'Локация',
    searchPlaceholder: 'Город или координаты (55.75, 37.62)',
    searchHint: 'Например: Москва или 55.75, 37.62',
    searchSubmit: 'Найти',
    searchLoading: 'Загружаем...',
    recentQueriesAria: 'Последние запросы',
    errorTitle: 'Не удалось получить данные',
    emptyTitle: 'Введите локацию, чтобы получить прогноз',
    emptyDescription:
      'Сервис покажет текущие условия, лучший временной слот, общий score и рекомендации по рыбе и наживке.',
    locationConditions: 'Локация и условия',
    time: 'Время',
    period: 'Период',
    waterTemp: 'Темп. воды',
    outOfHundred: 'из 100',
    confidence: 'Уверенность',
    currentWeather: 'Погода сейчас',
    temperature: 'Температура',
    pressure: 'Давление',
    wind: 'Ветер',
    humidity: 'Влажность',
    hourlyForecast: 'Прогноз на часы',
    hoursShort: 'часов',
    factors: 'Факторы',
    factorsTitle: 'Что влияет на клев',
    bestWindow: 'Лучшее окно',
    bestWindowEmpty: 'Не найдено',
    bestWindowFallback: 'Попробуйте другую локацию или дождитесь обновления прогноза.',
    fishRecommendations: 'Рекомендации по рыбе',
    fishTitle: 'Что ловить сейчас',
    chances: 'Шансы',
    bait: 'Наживка',
    tactics: 'Тактика',
    aiAdvice: 'Совет ИИ',
    aiTitle: 'Краткий вывод',
    aiRefreshAria: 'Обновить совет',
    aiUnavailable: 'Сервис ИИ недоступен, поэтому отображается только rule-based анализ.',
    history: 'История',
    historyTitle: 'Недавние локации',
    historyEmpty: 'История появится после первого запроса.',
    language: 'Язык',
  },
  en: {
    appTitle: 'Fishing forecast by weather',
    heroEyebrow: 'Weather-based fishing',
    heroTitle: 'Weather, activity window, and fish recommendations in one screen',
    heroDescription:
      'Enter a city or coordinates to get current conditions, a bite forecast, fish recommendations, and a short AI summary.',
    searchLabel: 'Location',
    searchPlaceholder: 'City or coordinates (55.75, 37.62)',
    searchHint: 'Example: London or 55.75, 37.62',
    searchSubmit: 'Search',
    searchLoading: 'Loading...',
    recentQueriesAria: 'Recent queries',
    errorTitle: 'Failed to load data',
    emptyTitle: 'Enter a location to get a forecast',
    emptyDescription:
      'The service shows current conditions, the best time slot, an overall score, and fish and bait recommendations.',
    locationConditions: 'Location and conditions',
    time: 'Time',
    period: 'Period',
    waterTemp: 'Water temp.',
    outOfHundred: 'of 100',
    confidence: 'Confidence',
    currentWeather: 'Current weather',
    temperature: 'Temperature',
    pressure: 'Pressure',
    wind: 'Wind',
    humidity: 'Humidity',
    hourlyForecast: 'Hourly forecast',
    hoursShort: 'hours',
    factors: 'Factors',
    factorsTitle: 'What affects the bite',
    bestWindow: 'Best window',
    bestWindowEmpty: 'Not found',
    bestWindowFallback: 'Try another location or wait for the forecast to update.',
    fishRecommendations: 'Fish recommendations',
    fishTitle: 'What to target now',
    chances: 'Chance',
    bait: 'Bait',
    tactics: 'Tactics',
    aiAdvice: 'AI advice',
    aiTitle: 'Short takeaway',
    aiRefreshAria: 'Refresh advice',
    aiUnavailable: 'AI is unavailable right now, so only the rule-based analysis is shown.',
    history: 'History',
    historyTitle: 'Recent spots',
    historyEmpty: 'History will appear after the first query.',
    language: 'Language',
  },
}

const STATUS_LABELS: Record<AppLanguage, Record<CatchStatus, string>> = {
  ru: {
    poor: 'Слабый клев',
    moderate: 'Средний клев',
    good: 'Хороший клев',
    excellent: 'Отличный клев',
  },
  en: {
    poor: 'Low activity',
    moderate: 'Moderate activity',
    good: 'Good activity',
    excellent: 'Strong activity',
  },
}

const FISH_NAME_LABELS: Record<AppLanguage, Record<FishCode, string>> = {
  ru: {
    crucian_carp: 'Карась',
    carp: 'Карп',
    pike: 'Щука',
    perch: 'Окунь',
    bream: 'Лещ',
  },
  en: {
    crucian_carp: 'Crucian carp',
    carp: 'Carp',
    pike: 'Pike',
    perch: 'Perch',
    bream: 'Bream',
  },
}

export function getUiText(language: AppLanguage): UiText {
  return UI_TEXT[language]
}

export function getStatusLabel(language: AppLanguage, status: CatchStatus): string {
  return STATUS_LABELS[language][status]
}

export function getFishName(language: AppLanguage, fishCode: FishCode, fallback: string): string {
  return FISH_NAME_LABELS[language][fishCode] ?? fallback
}

export function getTimeOfDayLabel(language: AppLanguage, value: string): string {
  const hour = new Date(value).getHours()

  if (language === 'en') {
    if (hour >= 4 && hour < 8) return 'Dawn'
    if (hour >= 8 && hour < 17) return 'Day'
    if (hour >= 17 && hour < 21) return 'Dusk'
    return 'Night'
  }

  if (hour >= 4 && hour < 8) return 'Рассвет'
  if (hour >= 8 && hour < 17) return 'День'
  if (hour >= 17 && hour < 21) return 'Закат'
  return 'Ночь'
}

export function getLocale(language: AppLanguage): string {
  return language === 'en' ? 'en-US' : 'ru-RU'
}

const VALUE_TRANSLATIONS: Record<string, string> = {
  червь: 'worm',
  опарыш: 'maggot',
  тесто: 'dough bait',
  перловка: 'barley',
  бойлы: 'boilies',
  кукуруза: 'corn',
  пеллетс: 'pellets',
  воблер: 'wobbler',
  силикон: 'soft bait',
  колебалка: 'spoon lure',
  блесна: 'spinner',
  живец: 'live bait',
  микроджиг: 'micro jig',
  вертушка: 'spinner lure',
  мотыль: 'bloodworm',
  'фидерная смесь': 'feeder mix',
  'поплавочная удочка': 'float rod',
  'тихая подача': 'quiet presentation',
  'ловля у растительности': 'fishing near vegetation',
  'донная оснастка': 'bottom rig',
  'прикормка точки': 'baiting the spot',
  'ожидание на глубине': 'deep wait setup',
  'медленная ступенька': 'slow step retrieve',
  'медленная проводка': 'slow retrieve',
  'облов кромки травы': 'work the weed edge',
  'работа по окнам': 'target open pockets',
  'активный поиск': 'active search',
  'активный поиск стаи': 'active school search',
  'поиск стаи': 'school search',
  'проводка у дна': 'bottom retrieve',
  'ступенчатая проводка': 'step retrieve',
  'проводка ступенькой': 'step retrieve',
  'ловля на рассвете': 'fish at dawn',
  фидер: 'feeder',
  'фидер на дистанции': 'long-range feeder fishing',
  'стабильная прикормка': 'steady groundbaiting',
  'дальняя точка': 'long-distance spot',
  'тихая ловля у камыша': 'quiet fishing near reeds',
  'тонкая оснастка': 'light tackle',
  'донная ловля': 'bottom fishing',
  'прикормка одной точки': 'baiting a single spot',
}

export function translateValues(values: string[], language: AppLanguage): string[] {
  if (language === 'ru') return values

  return values.map((value) => VALUE_TRANSLATIONS[value] ?? value)
}

export function translateBestWindowLabel(label: string, language: AppLanguage): string {
  if (language === 'ru') return label

  const aroundMatch = label.match(/^Лучшее окно около\s+(.+)$/)
  if (aroundMatch) {
    return `Best window around ${aroundMatch[1]}`
  }

  return label
}

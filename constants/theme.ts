// ─── Border Radius ────────────────────────────────────────
export const BorderRadius = {
  xs:      4,
  sm:      8,
  md:      12,
  lg:      16,
  lgModal: 32,
  full:    9999,
} as const;

// ─── Typography ───────────────────────────────────────────
export const Typography = {
  'heading-xl': { fontFamily: 'Pretendard-Bold', fontSize: 22, fontWeight: '700', lineHeight: 29, letterSpacing: -0.3 },
  'heading-lg': { fontFamily: 'Pretendard-Bold', fontSize: 20, fontWeight: '700', lineHeight: 26, letterSpacing: -0.3 },
  'heading-md': { fontFamily: 'Pretendard-SemiBold', fontSize: 18, fontWeight: '600', lineHeight: 23, letterSpacing: -0.3 },
  'heading-sm': { fontFamily: 'Pretendard-SemiBold', fontSize: 16, fontWeight: '600', lineHeight: 21, letterSpacing: -0.3 },
  'body-lg': { fontFamily: 'Pretendard-Regular', fontSize: 16, fontWeight: '400', lineHeight: 26, letterSpacing: 0 },
  'body-md': { fontFamily: 'Pretendard-Regular', fontSize: 14, fontWeight: '400', lineHeight: 22, letterSpacing: 0 },
  'body-sm': { fontFamily: 'Pretendard-Regular', fontSize: 13, fontWeight: '400', lineHeight: 21, letterSpacing: 0 },
  'caption': { fontFamily: 'Pretendard-Regular', fontSize: 12, fontWeight: '400', lineHeight: 17, letterSpacing: 0.2 },
  'label': { fontFamily: 'Pretendard-Medium', fontSize: 11, fontWeight: '500', lineHeight: 15, letterSpacing: 0.2 },
} as const;

// ─── Colors ───────────────────────────────────────────────
export const Colors = {
  light: {
    // Primary
    primary: '#4A7C59',
    primaryActive: '#3B6347',
    primaryLight: '#6A9E7A',
    primaryTint: '#C8DEC9',

    // Background
    cardBg: '#FAFAF7',
    pageBg: '#F5F3EE',
    secondarySurface: '#EDEAE3',
    divider: '#E2DDD5',

    // Text
    textTitle: '#1A1A1A',
    textSub: '#4A4A4A',
    textCaption: '#888882',
    textDisabled: '#B0ADA7',

    // Semantic
    danger: '#E8635A',
    success: '#5D9E75',
    progress: '#7EB8A4',
    warning: '#D4A85C',
    dangerBg: '#FDECEA',
    successBg: '#EBF5EE',
    progressBg: '#EAF4F1',
    warningBg: '#FDF5E6',

    // Reservation Type
    flightHeader: '#1A6B8A',
    accommodationHeader: '#2D5A3D',
    carRentalHeader: '#7A5230',

    // Overlay
    pressOverlay: 'rgba(30,40,34,0.08)',
    scrimDrawer: 'rgba(30,40,34,0.24)',
    scrimModal: 'rgba(30,40,34,0.48)',
  },

  dark: {
    // Primary
    primary: '#5E9E72',
    primaryActive: '#4A7C58',
    primaryLight: '#2E4D38',
    primaryTint: '#2E3526',

    // Background
    cardBg: '#262B28',
    pageBg: '#1C2120',
    secondarySurface: '#161A18',
    divider: '#373F3B',

    // Text
    textTitle: '#E8E4DC',
    textSub: '#B8B5AE',
    textCaption: '#7A7873',
    textDisabled: '#4A4845',

    // Semantic
    danger: '#C45650',
    success: '#56B979',
    progress: '#5E9688',
    warning: '#B08A42',
    dangerBg: '#3D1F1E',
    successBg: '#1A3326',
    progressBg: '#1A2E2B',
    warningBg: '#2E2410',

    // Reservation Type
    flightHeader: '#1A5470',
    accommodationHeader: '#1E3D29',
    carRentalHeader: '#5A3A1F',

    // Overlay
    pressOverlay: 'rgba(255,255,255,0.08)',
    scrimDrawer: 'rgba(30,40,34,0.24)',
    scrimModal: 'rgba(30,40,34,0.48)',
  },
};

// ─── Elevation ────────────────────────────────────────────
// iOS: shadow props / Android: elevation prop
// 사용: const { scheme } = useTheme();  Elevation[scheme][2]
export const Elevation = {
  light: {
    1: { shadowColor: '#1E2822', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4,  elevation: 2  },
    2: { shadowColor: '#1E2822', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.09, shadowRadius: 8,  elevation: 4  },
    3: { shadowColor: '#1E2822', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 16, elevation: 8  },
    4: { shadowColor: '#1E2822', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.16, shadowRadius: 32, elevation: 16 },
  },
  dark: {
    1: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.20, shadowRadius: 4,  elevation: 2  },
    2: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.30, shadowRadius: 8,  elevation: 4  },
    3: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.40, shadowRadius: 16, elevation: 8  },
    4: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.50, shadowRadius: 32, elevation: 16 },
  },
} as const;
const ISO_DATE_TIME_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?(Z|([+-])(\d{2}):(\d{2}))?$/;

type DateTimeParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};

function isLeapYear(year: number) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function getDaysInMonth(year: number, month: number) {
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

function addMinutes(parts: DateTimeParts, amount: number): DateTimeParts {
  let { year, month, day, hour, minute } = parts;
  minute += amount;

  while (minute >= 60) {
    minute -= 60;
    hour += 1;
  }

  while (minute < 0) {
    minute += 60;
    hour -= 1;
  }

  while (hour >= 24) {
    hour -= 24;
    day += 1;

    if (day > getDaysInMonth(year, month)) {
      day = 1;
      month += 1;

      if (month > 12) {
        month = 1;
        year += 1;
      }
    }
  }

  while (hour < 0) {
    hour += 24;
    day -= 1;

    if (day < 1) {
      month -= 1;

      if (month < 1) {
        month = 12;
        year -= 1;
      }

      day = getDaysInMonth(year, month);
    }
  }

  return { year, month, day, hour, minute };
}

function parseIsoToKoreanParts(value: string): DateTimeParts | null {
  const match = value.match(ISO_DATE_TIME_PATTERN);
  if (!match) return null;

  const [, year, month, day, hour, minute, , zone, sign, offsetHour = '0', offsetMinute = '0'] = match;
  const parts = {
    year: Number(year),
    month: Number(month),
    day: Number(day),
    hour: Number(hour),
    minute: Number(minute),
  };

  if (zone !== 'Z' && sign === '+' && offsetHour === '09' && offsetMinute === '00') {
    return parts;
  }

  const sourceOffsetMinutes = zone === 'Z'
    ? 0
    : (sign === '-' ? -1 : 1) * (Number(offsetHour) * 60 + Number(offsetMinute));
  return addMinutes(parts, 9 * 60 - sourceOffsetMinutes);
}

export function formatKoreanDateTime(value: string) {
  const parts = parseIsoToKoreanParts(value);
  if (!parts) return value;

  return `${parts.year}년 ${parts.month}월 ${parts.day}일 ${String(parts.hour).padStart(2, '0')}:${String(parts.minute).padStart(2, '0')}`;
}

export function formatKoreanTime(value: string) {
  const parts = parseIsoToKoreanParts(value);
  if (!parts) return value;

  return `${String(parts.hour).padStart(2, '0')}:${String(parts.minute).padStart(2, '0')}`;
}

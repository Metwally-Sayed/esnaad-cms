type ContentRecord = Record<string, unknown>;

const MEDIA_TOKENS = new Set([
  "image",
  "images",
  "video",
  "videos",
  "media",
  "icon",
  "icons",
  "poster",
  "thumbnail",
  "thumbnails",
  "logo",
  "logos",
  "banner",
  "banners",
  "cover",
  "covers",
  "src",
  "url",
  "urls",
  "file",
  "files",
]);

const TEXT_SUFFIX_TOKENS = new Set([
  "alt",
  "caption",
  "label",
  "description",
  "text",
]);

const isRecord = (value: unknown): value is ContentRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const hasOwn = (object: ContentRecord, key: string): boolean =>
  Object.prototype.hasOwnProperty.call(object, key);

const splitKeyTokens = (key: string): string[] =>
  key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .split(/[\s_-]+/)
    .filter(Boolean);

export const isSharedMediaKey = (key: string): boolean => {
  const tokens = splitKeyTokens(key);
  if (!tokens.length) return false;

  const lastToken = tokens[tokens.length - 1];
  if (TEXT_SUFFIX_TOKENS.has(lastToken)) {
    return false;
  }

  return tokens.some((token) => MEDIA_TOKENS.has(token));
};

const cloneDeep = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map((item) => cloneDeep(item));
  }
  if (isRecord(value)) {
    const next: ContentRecord = {};
    for (const [key, entry] of Object.entries(value)) {
      next[key] = cloneDeep(entry);
    }
    return next;
  }
  return value;
};

const mergeArrayForLocale = (
  localeValue: unknown,
  englishValue: unknown,
): unknown[] => {
  if (!Array.isArray(localeValue) && !Array.isArray(englishValue)) {
    return [];
  }

  if (!Array.isArray(localeValue) && Array.isArray(englishValue)) {
    return cloneDeep(englishValue) as unknown[];
  }

  if (Array.isArray(localeValue) && !Array.isArray(englishValue)) {
    return cloneDeep(localeValue) as unknown[];
  }

  const localeArray = localeValue as unknown[];
  const englishArray = englishValue as unknown[];
  const maxLength = Math.max(localeArray.length, englishArray.length);

  return Array.from({ length: maxLength }, (_, index) =>
    mergeLocalizedValue(localeArray[index], englishArray[index])
  );
};

const mergeObjectForLocale = (
  localeObject: ContentRecord,
  englishObject: ContentRecord,
): ContentRecord => {
  const merged: ContentRecord = {};
  const keys = new Set([
    ...Object.keys(englishObject),
    ...Object.keys(localeObject),
  ]);

  for (const key of keys) {
    const localeHas = hasOwn(localeObject, key);
    const englishHas = hasOwn(englishObject, key);

    const localeValue = localeHas ? localeObject[key] : undefined;
    const englishValue = englishHas ? englishObject[key] : undefined;

    merged[key] = mergeLocalizedValue(localeValue, englishValue, key);
  }

  return merged;
};

function mergeLocalizedValue(
  localeValue: unknown,
  englishValue: unknown,
  key?: string,
): unknown {
  if (key && isSharedMediaKey(key)) {
    return englishValue !== undefined
      ? cloneDeep(englishValue)
      : cloneDeep(localeValue);
  }

  if (Array.isArray(localeValue) || Array.isArray(englishValue)) {
    return mergeArrayForLocale(localeValue, englishValue);
  }

  if (isRecord(localeValue) || isRecord(englishValue)) {
    const localeObject = isRecord(localeValue) ? localeValue : {};
    const englishObject = isRecord(englishValue) ? englishValue : {};
    return mergeObjectForLocale(localeObject, englishObject);
  }

  return localeValue !== undefined ? localeValue : cloneDeep(englishValue);
}

export const mergeLocaleWithEnglishSharedMedia = (
  localeContent: ContentRecord,
  englishContent: ContentRecord,
): ContentRecord => mergeObjectForLocale(localeContent, englishContent);

export const resolveLocalizedContent = (
  rawContent: ContentRecord,
  locale: string,
): ContentRecord => {
  const localized = rawContent[locale];
  const english = rawContent.en;

  if (locale === "en") {
    if (isRecord(english)) {
      return cloneDeep(english) as ContentRecord;
    }
    if (isRecord(localized)) {
      return cloneDeep(localized) as ContentRecord;
    }
    return cloneDeep(rawContent) as ContentRecord;
  }

  if (isRecord(localized) && isRecord(english)) {
    return mergeLocaleWithEnglishSharedMedia(localized, english);
  }
  if (isRecord(localized)) {
    return cloneDeep(localized) as ContentRecord;
  }
  if (isRecord(english)) {
    return cloneDeep(english) as ContentRecord;
  }

  return cloneDeep(rawContent) as ContentRecord;
};

const syncSharedMediaInArray = (
  localeValue: unknown[],
  englishValue: unknown[],
): unknown[] =>
  localeValue.map((entry, index) => {
    const englishEntry = englishValue[index];
    if (isRecord(entry) && isRecord(englishEntry)) {
      return syncSharedMediaFields(entry, englishEntry);
    }
    if (Array.isArray(entry) && Array.isArray(englishEntry)) {
      return syncSharedMediaInArray(entry, englishEntry);
    }
    return cloneDeep(entry);
  });

export const syncSharedMediaFields = (
  localeContent: ContentRecord,
  englishContent: ContentRecord,
): ContentRecord => {
  const synced = cloneDeep(localeContent) as ContentRecord;

  for (const [key, englishValue] of Object.entries(englishContent)) {
    const localeValue = synced[key];

    if (isSharedMediaKey(key)) {
      synced[key] = cloneDeep(englishValue);
      continue;
    }

    if (isRecord(localeValue) && isRecord(englishValue)) {
      synced[key] = syncSharedMediaFields(localeValue, englishValue);
      continue;
    }

    if (Array.isArray(localeValue) && Array.isArray(englishValue)) {
      synced[key] = syncSharedMediaInArray(localeValue, englishValue);
    }
  }

  return synced;
};

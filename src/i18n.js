import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const LANGUAGE_KEY = 'st-language';

function getSavedLanguage() {
  try {
    return localStorage.getItem(LANGUAGE_KEY) === 'bn' ? 'bn' : 'en';
  } catch {
    return 'en';
  }
}

const resources = {
  en: {
    translation: {
      sidebar: {
        brand: 'Smart Cutting',
        searchPlaceholder: 'Search menu...',
        clearSearch: 'Clear search',
        closeSidebar: 'Close sidebar',
        expandSidebar: 'Expand sidebar',
        collapseSidebar: 'Collapse sidebar',
        noResults: 'No results found',
        groups: {
          Workspace: 'Workspace',
          'UI Elements': 'UI Elements',
          Administration: 'Administration',
          General: 'General',
          Cutting: 'Cutting',
          History: 'History',
        },
        items: {
          Overview: 'Overview',
          Components: 'Components',
          Form: 'Form',
          Table: 'Table',
          'New Table': 'New Table',
          Button: 'Button',
          Badges: 'Badges',
          'Test Table': 'Test Table',
          'Role & Permissions': 'Role & Permissions',
          Roles: 'Roles',
          Permissions: 'Permissions',
          'Human Resource (HR)': 'Human Resource (HR)',
          Companies: 'Companies',
          Departments: 'Departments',
          Designations: 'Designations',
          Employees: 'Employees',
          General: 'General',
          Parts: 'Parts',
          Shades: 'Shades',
          Groups: 'Groups',
          'Cutting Tables': 'Cutting Tables',
          'Sewing Lines': 'Sewing Lines',
          Buyers: 'Buyers',
          'Our References': 'Our References',
          'Purchase Orders': 'Purchase Orders',
          Colors: 'Colors',
          Sizes: 'Sizes',
          Cutting: 'Cutting',
          'PO List': 'PO List',
          'Bundle Card (Single PO)': 'Bundle Card (Single PO)',
          'Bundle Card (Multi PO)': 'Bundle Card (Multi PO)',
          'Bundles List': 'Bundles List',
          History: 'History',
          'Download History': 'Download History',
        },
        profile: {
          name: 'Syed Sadman Salahuddin',
        },
      },
    },
  },
  bn: {
    translation: {
      sidebar: {
        brand: 'স্মার্ট কাটিং',
        searchPlaceholder: 'মেনু খুঁজুন...',
        clearSearch: 'অনুসন্ধান মুছুন',
        closeSidebar: 'সাইডবার বন্ধ করুন',
        expandSidebar: 'সাইডবার প্রসারিত করুন',
        collapseSidebar: 'সাইডবার সংকুচিত করুন',
        noResults: 'কোনো ফলাফল পাওয়া যায়নি',
        groups: {
          Workspace: 'কর্মক্ষেত্র',
          'UI Elements': 'ইউআই উপাদান',
          Administration: 'প্রশাসন',
          General: 'সাধারণ',
          Cutting: 'কাটিং',
          History: 'ইতিহাস',
        },
        items: {
          Overview: 'সারসংক্ষেপ',
          Components: 'কম্পোনেন্ট',
          Form: 'ফর্ম',
          Table: 'টেবিল',
          'New Table': 'নতুন টেবিল',
          Button: 'বাটন',
          Badges: 'ব্যাজ',
          'Test Table': 'পরীক্ষামূলক টেবিল',
          'Role & Permissions': 'ভূমিকা ও অনুমতি',
          Roles: 'ভূমিকা',
          Permissions: 'অনুমতি',
          'Human Resource (HR)': 'মানবসম্পদ (এইচআর)',
          Companies: 'কোম্পানি',
          Departments: 'বিভাগ',
          Designations: 'পদবি',
          Employees: 'কর্মচারী',
          General: 'সাধারণ',
          Parts: 'যন্ত্রাংশ',
          Shades: 'শেড',
          Groups: 'গ্রুপ',
          'Cutting Tables': 'কাটিং টেবিল',
          'Sewing Lines': 'সেলাই লাইন',
          Buyers: 'ক্রেতা',
          'Our References': 'আমাদের রেফারেন্স',
          'Purchase Orders': 'ক্রয় আদেশ',
          Colors: 'রং',
          Sizes: 'সাইজ',
          Cutting: 'কাটিং',
          'PO List': 'পিও তালিকা',
          'Bundle Card (Single PO)': 'একক পিও বান্ডেল কার্ড',
          'Bundle Card (Multi PO)': 'একাধিক পিও বান্ডেল কার্ড',
          'Bundles List': 'বান্ডেল তালিকা',
          History: 'ইতিহাস',
          'Download History': 'ডাউনলোড ইতিহাস',
        },
        profile: {
          name: 'সৈয়দ সাদমান সালাহউদ্দিন',
        },
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: getSavedLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

document.documentElement.lang = i18n.resolvedLanguage || i18n.language;

i18n.on('languageChanged', (language) => {
  document.documentElement.lang = language;
  try {
    localStorage.setItem(LANGUAGE_KEY, language);
  } catch {
    // Language selection still applies for the current session if storage is unavailable.
  }
});

export default i18n;

/**
 * YouTube-Specific Mock Data Generators
 * Specialized generators for YouTube video content fields
 */

import { faker } from '@faker-js/faker';

/**
 * Generate transcript text (1000-2000 words)
 *
 * @param minWords - Minimum word count
 * @param maxWords - Maximum word count
 * @returns Generated transcript text
 */
export function generateTranscript(minWords: number = 1000, maxWords: number = 2000): string {
  const targetWordCount = faker.number.int({ min: minWords, max: maxWords });
  const words: string[] = [];

  // Generate words until we reach target
  while (words.length < targetWordCount) {
    // Generate sentences to build up word count
    const sentence = faker.lorem.sentence();
    words.push(...sentence.split(/\s+/));
  }

  // Trim to exact word count and join
  return words.slice(0, targetWordCount).join(' ');
}

/**
 * Generate transcript abridgement (500-1000 words)
 *
 * @returns Generated abridgement text
 */
export function generateTranscriptAbridgement(): string {
  return generateTranscript(500, 1000);
}

/**
 * Generate YouTube chapters with timestamps
 * Format: "MM:SS Chapter Title"
 *
 * @returns Formatted chapters string
 */
export function generateChapters(): string {
  const chapterCount = faker.number.int({ min: 5, max: 10 });
  const chapters: string[] = [];
  let currentTime = 0;

  for (let i = 0; i < chapterCount; i++) {
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    const timestamp = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    const title = faker.lorem.words(faker.number.int({ min: 2, max: 5 }));

    chapters.push(`${timestamp} ${title}`);

    // Increment time by 1-3 minutes
    currentTime += faker.number.int({ min: 60, max: 180 });
  }

  return chapters.join('\n');
}

/**
 * Generate YouTube video title (45-50 chars)
 *
 * @param minLength - Minimum character length
 * @param maxLength - Maximum character length
 * @returns Generated title
 */
export function generateTitle(minLength: number = 45, maxLength: number = 50): string {
  let title = faker.lorem.sentence();

  // Adjust length
  while (title.length < minLength) {
    title += ' ' + faker.lorem.word();
  }

  return title.slice(0, maxLength);
}

/**
 * Generate array of title ideas (3-5 titles)
 *
 * @returns Array of title options
 */
export function generateTitleIdeas(): string[] {
  const count = faker.number.int({ min: 3, max: 5 });
  const titles: string[] = [];

  for (let i = 0; i < count; i++) {
    titles.push(generateTitle(45, 50));
  }

  return titles;
}

/**
 * Generate video description
 *
 * @param maxLength - Maximum character length (default: 5000)
 * @returns Generated description
 */
export function generateDescription(maxLength: number = 5000): string {
  const paragraphCount = Math.ceil(maxLength / 200);
  let description = '';

  for (let i = 0; i < paragraphCount; i++) {
    description += faker.lorem.paragraph() + '\n\n';
  }

  return description.slice(0, maxLength);
}

/**
 * Generate simple description (150-200 chars)
 *
 * @returns Generated simple description
 */
export function generateSimpleDescription(): string {
  return generateDescription(200);
}

/**
 * Generate keywords array (5-10 items)
 *
 * @returns Array of keywords
 */
export function generateKeywords(): string[] {
  const count = faker.number.int({ min: 5, max: 10 });
  const keywords: string[] = [];

  for (let i = 0; i < count; i++) {
    keywords.push(faker.lorem.word());
  }

  return keywords;
}

/**
 * Generate thumbnail text (max 20 chars)
 *
 * @returns Short text for thumbnail
 */
export function generateThumbnailText(): string {
  const words = faker.lorem.words(faker.number.int({ min: 1, max: 3 }));
  return words.slice(0, 20);
}

/**
 * Generate CTA phrase
 *
 * @returns Call-to-action phrase
 */
export function generateCTA(): string {
  const ctas = [
    'Subscribe for more!',
    'Check out the links below',
    'Visit my website',
    'Join my community',
    'Get the free guide',
    'Download the resource',
    'Sign up for updates',
    'Follow on social media'
  ];

  return faker.helpers.arrayElement(ctas);
}

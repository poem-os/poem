import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import { validatePort, readEnvFile, writeEnvFile } from '../../bin/utils.js';

describe('validatePort', () => {
  it('should accept valid ports', () => {
    expect(validatePort(1024)).toBe(1024);
    expect(validatePort(4321)).toBe(4321);
    expect(validatePort(8080)).toBe(8080);
    expect(validatePort(65535)).toBe(65535);
  });

  it('should accept valid port strings', () => {
    expect(validatePort('1024')).toBe(1024);
    expect(validatePort('8080')).toBe(8080);
  });

  it('should reject ports below 1024', () => {
    expect(() => validatePort(80)).toThrow('Invalid port');
    expect(() => validatePort(1023)).toThrow('Invalid port');
  });

  it('should reject ports above 65535', () => {
    expect(() => validatePort(65536)).toThrow('Invalid port');
    expect(() => validatePort(70000)).toThrow('Invalid port');
  });

  it('should reject non-numeric ports', () => {
    expect(() => validatePort('abc')).toThrow('Invalid port');
    expect(() => validatePort('12.34')).toThrow('Invalid port');
  });

  it('should reject boundary cases', () => {
    expect(() => validatePort(1023)).toThrow('Invalid port');
    expect(validatePort(1024)).toBe(1024);
    expect(validatePort(65535)).toBe(65535);
    expect(() => validatePort(65536)).toThrow('Invalid port');
  });
});

describe('readEnvFile', () => {
  const testDir = path.join(process.cwd(), 'tests', 'fixtures', 'env-files');

  beforeEach(async () => {
    await fs.mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('should read a simple .env file', async () => {
    const envFile = path.join(testDir, 'simple.env');
    await fs.writeFile(envFile, 'PORT=4321\nPOEM_DEV=true\n');

    const config = await readEnvFile(envFile);

    expect(config.PORT).toBe('4321');
    expect(config.POEM_DEV).toBe('true');
  });

  it('should handle empty .env file', async () => {
    const envFile = path.join(testDir, 'empty.env');
    await fs.writeFile(envFile, '');

    const config = await readEnvFile(envFile);

    expect(config).toEqual({});
  });

  it('should skip comments and empty lines', async () => {
    const envFile = path.join(testDir, 'with-comments.env');
    await fs.writeFile(
      envFile,
      '# This is a comment\nPORT=4321\n\n# Another comment\nPOEM_DEV=true\n'
    );

    const config = await readEnvFile(envFile);

    expect(config.PORT).toBe('4321');
    expect(config.POEM_DEV).toBe('true');
    expect(Object.keys(config).length).toBe(2);
  });

  it('should handle values with = in them', async () => {
    const envFile = path.join(testDir, 'with-equals.env');
    await fs.writeFile(envFile, 'KEY=value=with=equals\n');

    const config = await readEnvFile(envFile);

    expect(config.KEY).toBe('value=with=equals');
  });

  it('should return empty object for non-existent file', async () => {
    const envFile = path.join(testDir, 'non-existent.env');

    const config = await readEnvFile(envFile);

    expect(config).toEqual({});
  });
});

describe('writeEnvFile', () => {
  const testDir = path.join(process.cwd(), 'tests', 'fixtures', 'env-files');

  beforeEach(async () => {
    await fs.mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('should write a simple config', async () => {
    const envFile = path.join(testDir, 'output.env');
    const config = { PORT: '4321', POEM_DEV: 'true' };

    await writeEnvFile(envFile, config);

    const content = await fs.readFile(envFile, 'utf-8');
    expect(content).toContain('PORT=4321');
    expect(content).toContain('POEM_DEV=true');
  });

  it('should write empty config', async () => {
    const envFile = path.join(testDir, 'empty-output.env');
    const config = {};

    await writeEnvFile(envFile, config);

    const content = await fs.readFile(envFile, 'utf-8');
    expect(content).toBe('\n');
  });

  it('should overwrite existing file', async () => {
    const envFile = path.join(testDir, 'overwrite.env');
    await fs.writeFile(envFile, 'OLD_KEY=old_value\n');

    const config = { PORT: '8080' };
    await writeEnvFile(envFile, config);

    const content = await fs.readFile(envFile, 'utf-8');
    expect(content).not.toContain('OLD_KEY');
    expect(content).toContain('PORT=8080');
  });
});

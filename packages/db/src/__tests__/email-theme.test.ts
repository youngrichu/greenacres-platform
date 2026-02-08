import { describe, it, expect } from 'vitest';
import { createFormattedEmail } from '../templates/email-theme';

describe('createFormattedEmail', () => {
    it('should generate valid HTML string', () => {
        const content = '<p>Test Content</p>';
        const email = createFormattedEmail(content);

        expect(email).toContain('<!DOCTYPE html>');
        expect(email).toContain('Greenacres Coffee');
        expect(email).toContain(content);
    });

    it('should include custom title when provided', () => {
        const title = 'Welcome to Greenacres';
        const email = createFormattedEmail('Content', title);

        expect(email).toContain(`<title>${title}</title>`);
    });

    it('should include current year in footer', () => {
        const year = new Date().getFullYear();
        const email = createFormattedEmail('Content');

        expect(email).toContain(`&copy; ${year} Greenacres Coffee`);
    });
});

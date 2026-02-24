/*
Copyright 2024 New Vector Ltd.

SPDX-License-Identifier: AGPL-3.0-only OR GPL-3.0-only
Please see LICENSE files in the repository root for full license details.
*/

// Detect if we're on a mobile device
const isMobile = /Mobi|Android/i.test(navigator.userAgent);

// Keyboard open body class - used by ScrollPanel to disable sticky-bottom
const KEYBOARD_OPEN_CLASS = 'mx_KeyboardOpen';

// Threshold: visual viewport height reduction that indicates keyboard is open
const KEYBOARD_HEIGHT_THRESHOLD = 150;

function applyViewportHeight(): void {
    const vv = (window as any).visualViewport;
    if (!vv) return;

    const vh = vv.height;
    const fullHeight = window.innerHeight;
    const keyboardHeight = fullHeight - vh;
    const keyboardOpen = keyboardHeight > KEYBOARD_HEIGHT_THRESHOLD;

    if (keyboardOpen) {
        // Set CSS custom property that the layout uses to clamp its height.
        // Also account for any offsetTop (iOS Safari scrolls the viewport).
        document.documentElement.style.setProperty('--viewport-height', `${vh}px`);
        document.documentElement.style.setProperty('--viewport-offset-top', `${vv.offsetTop}px`);
        document.body.classList.add(KEYBOARD_OPEN_CLASS);
    } else {
        document.documentElement.style.removeProperty('--viewport-height');
        document.documentElement.style.removeProperty('--viewport-offset-top');
        document.body.classList.remove(KEYBOARD_OPEN_CLASS);
    }
}

let orientationChangeHandler: (() => void) | null = null;

export function initMobileViewport(): void {
    if (!isMobile) return;

    const vv = (window as any).visualViewport;
    if (vv) {
        vv.addEventListener('resize', applyViewportHeight);
        vv.addEventListener('scroll', applyViewportHeight);
    } else {
        // Fallback for browsers without visualViewport
        window.addEventListener('resize', applyViewportHeight);
    }

    orientationChangeHandler = () => {
        setTimeout(applyViewportHeight, 300);
    };
    window.addEventListener('orientationchange', orientationChangeHandler);

    // Apply immediately in case viewport is already offset
    applyViewportHeight();
}

export function cleanupMobileViewport(): void {
    const vv = (window as any).visualViewport;
    if (vv) {
        vv.removeEventListener('resize', applyViewportHeight);
        vv.removeEventListener('scroll', applyViewportHeight);
    } else {
        window.removeEventListener('resize', applyViewportHeight);
    }

    if (orientationChangeHandler) {
        window.removeEventListener('orientationchange', orientationChangeHandler);
        orientationChangeHandler = null;
    }

    document.documentElement.style.removeProperty('--viewport-height');
    document.documentElement.style.removeProperty('--viewport-offset-top');
    document.body.classList.remove(KEYBOARD_OPEN_CLASS);
}

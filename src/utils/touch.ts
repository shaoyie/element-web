/*
Copyright 2026 New Vector Ltd.

SPDX-License-Identifier: AGPL-3.0-only OR GPL-3.0-only
Please see LICENSE files in the repository root for full details.
*/

let cachedPointerIsCoarse: boolean | null = null;

/**
 * Detects whether the current device primarily uses a coarse (touch) pointer.
 * The result is cached for the lifetime of the session as the pointer
 * capabilities rarely change at runtime.
 */
export function isProbablyCoarsePointerDevice(): boolean {
    if (cachedPointerIsCoarse !== null) {
        return cachedPointerIsCoarse;
    }

    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
        cachedPointerIsCoarse = false;
        return cachedPointerIsCoarse;
    }

    try {
        cachedPointerIsCoarse = window.matchMedia("(any-pointer: coarse)").matches;
    } catch (e) {
        cachedPointerIsCoarse = false;
    }

    return cachedPointerIsCoarse;
}

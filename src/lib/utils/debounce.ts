// src/lib/utils/debounce.ts
export function debounce<T extends (...args: unknown[]) => unknown>(
    fn: T,
    wait = 300,
) {
    let t: ReturnType<typeof setTimeout> | undefined;

    return (...args: Parameters<T>): void => {
        if (t) clearTimeout(t);
        t = setTimeout(() => {
            fn(...args);
        }, wait);
    };
}

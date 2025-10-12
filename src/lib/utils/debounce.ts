// src/lib/utils/debounce.ts
export function debounce<A extends unknown[]>(
    fn: (...args: A) => void | Promise<void>,
    wait = 300
): (...args: A) => void {
    let t: ReturnType<typeof setTimeout> | null = null;
    return (...args: A) => {
        if (t) clearTimeout(t);
        t = setTimeout(() => { void fn(...args); }, wait);
    };
}

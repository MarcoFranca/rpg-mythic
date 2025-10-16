// src/lib/utils/debounce.ts
export function debounce<TArgs extends unknown[]>(
    fn: (...args: TArgs) => void | Promise<void>,
    wait: number
) {
    let timer: ReturnType<typeof setTimeout> | null = null;
    return (...args: TArgs) => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => void fn(...args), wait); // garante retorno void
    };
}

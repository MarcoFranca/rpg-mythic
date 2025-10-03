// src/types/json.ts
export type Json =
    | null
    | boolean
    | number
    | string
    | Json[]
    | { [key: string]: Json };

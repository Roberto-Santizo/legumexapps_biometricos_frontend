import { type Location, type NavigateFunction } from "react-router-dom";
import { isAxiosError } from "axios";

export const getQueryParam = (location: Location, queryParam: string) => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get(queryParam);
}

export const queryParamExists = (location: Location, queryParam: string, value?: string): boolean => {
    const queryParams = new URLSearchParams(location.search);
    const show = value ? queryParams.get(queryParam) == value : !!queryParams.get(queryParam);
    return show;
}

export const handleSetQueryParam = (location: Location, navigate: NavigateFunction, queryParam: string, value: string) => {
    const params = new URLSearchParams(location.search);
    params.set(queryParam, value);
    navigate({ pathname: location.pathname, search: params.toString() });
};

export const handleDeleteQueryParam = (location: Location, navigate: NavigateFunction, queryParam: string) => {
    const params = new URLSearchParams(location.search);
    params.delete(queryParam);

    navigate({ pathname: location.pathname, search: params.toString() });
};

export const setQueryParams = <T extends Record<string, unknown>>(filters: T) => {
    const params = new URLSearchParams(Object.entries(filters).filter(([, value]) => value != null && value !== '').map(([key, value]) => [key, String(value)]));
    return params;
}

export const getDonutColors = (theme: 'light' | 'dark'): [string, string] => {
    return theme === 'dark' ? ['#22c55e', '#374151'] : ['#22c55e', '#e5e7eb'];
};

export const chartTheme = (theme: 'light' | 'dark') => {
    const isDark = theme === 'dark';
    return {
        gridColor: isDark ? '#374151' : '#e5e7eb',
        textColor: isDark ? '#9ca3af' : '#6b7280',
        emptyTrackColor: isDark ? '#374151' : '#e5e7eb',
        tooltipStyle: {
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
            borderRadius: '0.5rem',
            color: isDark ? '#f3f4f6' : '#111827',
        },
        tooltipLabelStyle: {
            color: isDark ? '#f3f4f6' : '#111827',
        },
    };
};

export function downloadBase64File(base64: string, filename: string) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
// NestJS devuelve `message` como string o como string[] (errores de validación)
export function getApiErrorMessage(error: unknown, fallback = "Error no controlado"): string {
    if (isAxiosError(error)) {
        const message = error.response?.data?.message;
        if (Array.isArray(message)) return message.join(', ');
        if (typeof message === 'string') return message;
    }

    return fallback;
}

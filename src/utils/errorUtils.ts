import axios from 'axios';

export const extractErrorMessage = (error: unknown, defaultMessage: string = 'Error inesperado'): string => {
    if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as unknown;
        if (axios.isAxiosError(axiosError) && axiosError.response?.data) {
            const apiError = axiosError.response.data as { error?: string };
            if (apiError.error) {
                return apiError.error;
            }
        }
    }
    return defaultMessage;
};
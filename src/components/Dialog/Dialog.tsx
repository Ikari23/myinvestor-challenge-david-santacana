import React, { useEffect, useRef, useState } from 'react';
import type { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import styles from './Dialog.module.scss';

type BuyFormValues = { amount: number };

interface DialogProps {
    isOpen: boolean;
    title: string;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    register: UseFormRegister<BuyFormValues>;
    errors: FieldErrors<BuyFormValues>;
    isSubmitting: boolean;
    setValue: UseFormSetValue<BuyFormValues>;
    watch: UseFormWatch<BuyFormValues>;
    fundValue?: number;
}

export const Dialog: React.FC<DialogProps> = ({
    isOpen,
    title,
    onClose,
    onSubmit,
    register,
    errors,
    isSubmitting,
    setValue,
    watch,
    fundValue = 0
}) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [displayValue, setDisplayValue] = useState('');

    const parseEuroValue = (value: string): number => {
        const cleanValue = value.replace(/[^\d,.-]/g, '');
        const normalizedValue = cleanValue.replace(',', '.');
        const numValue = parseFloat(normalizedValue);
        return isNaN(numValue) ? 0 : numValue;
    };

    const formatEuroValue = (value: number): string => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

    const calculateUnits = (amount: number): number => {
        if (fundValue > 0 && amount > 0) {
            return amount / fundValue;
        }
        return 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        if (inputValue === '') {
            setDisplayValue('');
            setValue('amount', 0);
            return;
        }

        setDisplayValue(inputValue);

        const numericValue = parseEuroValue(inputValue);
        setValue('amount', numericValue, { shouldValidate: true });
    };

    const handleInputBlur = () => {
        const currentValue = parseEuroValue(displayValue);

        if (currentValue > 0 && currentValue <= 10000) {
            setDisplayValue(formatEuroValue(currentValue));
        }
    };

    const handleInputFocus = () => {
        const currentValue = parseEuroValue(displayValue);
        if (currentValue > 0 && displayValue.includes('€')) {
            setDisplayValue(currentValue.toString().replace('.', ','));
        }
    };

    useEffect(() => {
        if (isOpen) {
            setDisplayValue('');
            setValue('amount', 0);
        }
    }, [isOpen, setValue]);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (isOpen && !dialog.open) {
            dialog.showModal();
        } else if (!isOpen && dialog.open) {
            dialog.close();
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
        } else {
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
            }
        }

        return () => {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    useEscapeKey(() => {
        if (isOpen) onClose();
    }, isOpen);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const handleCancel = (e: Event) => {
            e.preventDefault();
            onClose();
        };
        const handleClose = () => {
            if (isOpen) onClose();
        };
        dialog.addEventListener('cancel', handleCancel);
        dialog.addEventListener('close', handleClose);
        return () => {
            dialog.removeEventListener('cancel', handleCancel);
            dialog.removeEventListener('close', handleClose);
        };
    }, [isOpen, onClose]);

    const currentAmount = watch('amount') || 0;

    const isValidAmount = currentAmount > 0 && currentAmount <= 10000 && !errors.amount;

    return (
        <dialog ref={dialogRef} aria-labelledby="dialog-title" className={styles.dialog}>
            <div className={styles.header}>
                <h3 id="dialog-title" className={styles.title}>{title}</h3>
                <button type="button" onClick={onClose} aria-label="Cerrar" className={styles.closeButton}>✕</button>
            </div>
            <div className={styles.content}>
                <form onSubmit={onSubmit}>
                    <div className={styles.formField}>
                        <label htmlFor="amount" className={styles.label}>
                            Cantidad a invertir
                        </label>
                        <div className={styles.inputWrapper}>
                            <input
                                id="amount"
                                type="text"
                                placeholder="0,00 €"
                                className={styles.input}
                                value={displayValue}
                                onChange={handleInputChange}
                                onBlur={handleInputBlur}
                                onFocus={handleInputFocus}
                            />
                            <input
                                type="hidden"
                                {...register('amount', {
                                    required: 'La cantidad a invertir es obligatoria',
                                    min: {
                                        value: 0.01,
                                        message: 'La cantidad debe ser mayor que 0'
                                    },
                                    max: {
                                        value: 10000,
                                        message: 'No se pueden realizar compras superiores a 10.000 €'
                                    },
                                    validate: {
                                        positive: (value) => {
                                            return value > 0 || 'La cantidad debe ser mayor que 0';
                                        },
                                        maxAmount: (value) => {
                                            return value <= 10000 || 'No se pueden realizar compras superiores a 10.000 €';
                                        }
                                    }
                                })}
                            />
                        </div>
                        {errors.amount && (
                            <span role="alert" className={styles.errorMessage}>
                                {errors.amount.message}
                            </span>
                        )}

                        {fundValue > 0 && (
                            <div className={styles.calculation}>
                                <span className={styles.calculationText}>
                                    Precio por unidad: <strong>{formatEuroValue(fundValue)}</strong>
                                </span>
                            </div>
                        )}
                    </div>
                    <div className={styles.buttonGroup}>
                        <button
                            type="button"
                            className={`${styles.button} ${styles.secondaryButton}`}
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !isValidAmount}
                            className={`${styles.button} ${styles.primaryButton}`}
                        >
                            {isSubmitting ? 'Procesando...' : 'Confirmar compra'}
                        </button>
                    </div>
                </form>
            </div>
        </dialog>
    );
};

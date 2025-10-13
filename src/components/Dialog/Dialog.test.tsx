import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { Dialog } from './Dialog';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

vi.mock('../../hooks/useEscapeKey', () => ({
    useEscapeKey: vi.fn()
}));

type BuyFormValues = { amount: number };

const TestWrapper: React.FC<{ onSubmit: (data: BuyFormValues) => void; isOpen: boolean; onClose: () => void; fundValue?: number }> = ({
    onSubmit,
    isOpen,
    onClose,
    fundValue = 100
}) => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm<BuyFormValues>({
        defaultValues: { amount: 0 }
    });

    return (
        <Dialog
            isOpen={isOpen}
            title="Test Dialog"
            onClose={onClose}
            onSubmit={handleSubmit(onSubmit)}
            register={register}
            errors={errors}
            isSubmitting={isSubmitting}
            setValue={setValue}
            watch={watch}
            fundValue={fundValue}
        />
    );
};

describe('Dialog Component', () => {
    let mockOnSubmit: ReturnType<typeof vi.fn>;
    let mockOnClose: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        mockOnSubmit = vi.fn();
        mockOnClose = vi.fn();

        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
    });

    afterEach(() => {
        vi.clearAllMocks();
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
    });

    describe('Renderizado', () => {
        it('no debería renderizar cuando isOpen es false', () => {
            render(<TestWrapper onSubmit={mockOnSubmit} isOpen={false} onClose={mockOnClose} />);

            const dialog = document.querySelector('dialog');
            expect(dialog).toBeInTheDocument();
            expect(dialog?.open).toBe(false);
        });

        it('debería renderizar cuando isOpen es true', () => {
            render(<TestWrapper onSubmit={mockOnSubmit} isOpen={true} onClose={mockOnClose} />);

            const dialog = document.querySelector('dialog');
            expect(dialog).toBeInTheDocument();
            expect(dialog?.open).toBe(true);
        });

        it('debería mostrar el título correctamente', () => {
            render(<TestWrapper onSubmit={mockOnSubmit} isOpen={true} onClose={mockOnClose} />);

            expect(screen.getByText('Test Dialog')).toBeInTheDocument();
        });

        it('debería mostrar el formulario con todos los campos', () => {
            render(<TestWrapper onSubmit={mockOnSubmit} isOpen={true} onClose={mockOnClose} />);

            expect(screen.getByLabelText('Cantidad a invertir')).toBeInTheDocument();
            expect(screen.getByText('Cancelar')).toBeInTheDocument();
            expect(screen.getByText('Confirmar compra')).toBeInTheDocument();
        });
    });

    describe('Interacciones del formulario', () => {
        it('debería permitir escribir en el campo de cantidad', async () => {
            const user = userEvent.setup();
            render(<TestWrapper onSubmit={mockOnSubmit} isOpen={true} onClose={mockOnClose} />);

            const input = screen.getByPlaceholderText('0,00 €');
            await user.type(input, '1000');

            expect(input).toHaveValue('1000');
        });

        it('debería mostrar el precio por unidad', () => {
            render(<TestWrapper onSubmit={mockOnSubmit} isOpen={true} onClose={mockOnClose} fundValue={100} />);

            expect(screen.getByText('Precio por unidad:')).toBeInTheDocument();
            expect(screen.getByText('100,00 €')).toBeInTheDocument();
        });
    });

    describe('Eventos del dialog', () => {
        it('debería manejar evento cancel del dialog', () => {
            render(<TestWrapper onSubmit={mockOnSubmit} isOpen={true} onClose={mockOnClose} />);

            const dialog = document.querySelector('dialog') as HTMLDialogElement;

            const cancelEvent = new Event('cancel', { cancelable: true });
            fireEvent(dialog, cancelEvent);

            expect(mockOnClose).toHaveBeenCalled();
        });

        it('debería manejar evento close del dialog', () => {
            render(<TestWrapper onSubmit={mockOnSubmit} isOpen={true} onClose={mockOnClose} />);

            const dialog = document.querySelector('dialog') as HTMLDialogElement;

            const closeEvent = new Event('close');
            fireEvent(dialog, closeEvent);

            expect(mockOnClose).toHaveBeenCalled();
        });
    });
});
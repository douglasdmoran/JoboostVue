import { body, validationResult } from 'express-validator';

export const runValidations = (validations) => {
    return async (req, res, next) => {
        for (const validation of validations) {
            await validation.run(req);
        }

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        return res.status(400).json({ 
            status: 'error',
            errors: errors.array() 
        });
    };
};


export const createUserValidator = () => {
    return [
        body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
        body('email').isEmail().withMessage('El correo debe ser válido'),
        body('contrasenia').isLength({ min: 6 }).withMessage('Mínimo 6 caracteres')
    ];
};
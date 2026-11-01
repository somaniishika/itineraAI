import { ArgumentMetadata, BadRequestException, Injectable, ValidationPipe as BaseValidationPipe } from '@nestjs/common';

@Injectable()
export class ValidationPipe extends BaseValidationPipe {
    constructor() {
        super({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
        });
    }

    async transform(value: any, metadata: ArgumentMetadata) {
        try {
            return await super.transform(value, metadata);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}

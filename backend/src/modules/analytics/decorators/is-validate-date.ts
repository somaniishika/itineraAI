import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

function isValidLeapYearDate(value: string): boolean {
  const [yearStr, monthStr, dayStr] = value.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  if (month === 2 && day === 29) {
    // Check if year is a leap year
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  return true; // Non-Feb-29 dates are valid
}

export function IsValidDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidDate',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          if (!value) return true;
          return isValidLeapYearDate(value);
        },
          defaultMessage(_args: ValidationArguments) {
          return typeof validationOptions?.message === 'string'
          ? validationOptions.message
          : 'Invalid date: Feb 29 is only allowed in leap years.';
        }
      },
    });
  };
}

import { ValidatorFn, FormGroup, ValidationErrors } from '@angular/forms';

export const passwordsMatchValidator: ValidatorFn = (
  form: FormGroup
): ValidationErrors | null => {
  const password = form.get('password');
  const confirmPasssword = form.get('confirmPassword');

  return password &&
    confirmPasssword &&
    password.value !== confirmPasssword.value
    ? { fieldsDoNotMatch: true }
    : null;
};

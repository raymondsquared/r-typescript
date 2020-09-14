/* eslint-disable no-unused-vars */
import { Output } from './types/output.type';

// Validator interface validates T
interface Validator<T> {
  isValid(domain: T): Output<boolean>;
}

export { Validator };

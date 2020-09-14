import { Output } from './output.type';

interface Secrets {
  getValue(key: string): Promise<Output<string>>;
}

export { Secrets };

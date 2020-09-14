import { Output } from './output.type';

export default interface Adapter<T1, T2> {
  // T1 from T2
  from(input: T2): Output<T1>;
  // T1 to T2
  to(input: T1): Output<T2>;
}
